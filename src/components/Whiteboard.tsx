
import React, { useCallback } from 'react';
import { Tldraw, TldrawEditor, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { cn } from '@/lib/utils';

interface WhiteboardProps {
  className?: string;
}

const WhiteboardActions = () => {
  const editor = useEditor();
  
  const handleSave = useCallback(() => {
    const snapshot = editor?.store.getSnapshot();
    console.log('Saving whiteboard:', snapshot);
    // Here you would typically send this to your backend
  }, [editor]);
  
  return (
    <div className="absolute bottom-4 right-4 z-10 flex gap-2">
      <button 
        onClick={handleSave}
        className="px-3 py-1.5 text-xs font-medium bg-white/80 hover:bg-white shadow-sm rounded-md transition-colors"
      >
        Save
      </button>
    </div>
  );
};

const Whiteboard: React.FC<WhiteboardProps> = ({ className }) => {
  return (
    <div className={cn("relative w-full h-full rounded-lg overflow-hidden border shadow-sm animate-fade-in", className)}>
      <Tldraw
        className="tldraw"
        persistenceKey="travel-whiteboard"
      >
        <WhiteboardActions />
      </Tldraw>
    </div>
  );
};

export default Whiteboard;
