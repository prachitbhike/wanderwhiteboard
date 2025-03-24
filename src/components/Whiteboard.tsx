
import React, { useCallback, useEffect, useState } from 'react';
import { Tldraw, TldrawEditor, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface WhiteboardProps {
  className?: string;
  onSave?: (snapshot: any) => Promise<void>;
  readOnly?: boolean;
  initialData?: any;
}

const WhiteboardActions = ({ onSave }: { onSave?: (snapshot: any) => Promise<void> }) => {
  const editor = useEditor();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSave = useCallback(async () => {
    if (!editor || !onSave) return;
    
    try {
      setSaving(true);
      const snapshot = editor.store.getSnapshot();
      await onSave(snapshot);
      toast({
        title: "Whiteboard saved",
        description: "Your whiteboard has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      toast({
        title: "Error saving whiteboard",
        description: "There was an error saving your whiteboard.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [editor, onSave, toast]);
  
  // Don't show save button if no onSave handler is provided
  if (!onSave) return null;
  
  return (
    <div className="absolute bottom-4 right-4 z-10 flex gap-2">
      <button 
        onClick={handleSave}
        disabled={saving}
        className="px-3 py-1.5 text-xs font-medium bg-white/80 hover:bg-white shadow-sm rounded-md transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

const Whiteboard: React.FC<WhiteboardProps> = ({ 
  className, 
  onSave, 
  readOnly = false,
  initialData = null
}) => {
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setStore(initialData);
    }
  }, [initialData]);

  return (
    <div className={cn("relative w-full h-full rounded-lg overflow-hidden border shadow-sm animate-fade-in", className)}>
      <Tldraw
        className="tldraw"
        persistenceKey={readOnly ? undefined : "travel-whiteboard"}
        readOnly={readOnly}
        snapshot={store}
      >
        <WhiteboardActions onSave={onSave} />
      </Tldraw>
    </div>
  );
};

export default Whiteboard;
