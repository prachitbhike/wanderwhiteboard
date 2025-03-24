
import React, { useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Whiteboard from '@/components/Whiteboard';
import TravelPlanner from '@/components/TravelPlanner';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);

  const handleSaveWhiteboard = useCallback(async (tripId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!editorRef.current) {
      throw new Error('Whiteboard editor not available');
    }

    // Get the current state of the whiteboard
    const snapshot = editorRef.current;
    
    // Save the whiteboard to Supabase
    const { error } = await supabase
      .from('whiteboards')
      .insert([
        { 
          trip_id: tripId,
          snapshot: snapshot
        }
      ]);
      
    if (error) throw error;
  }, [user, navigate]);

  const captureWhiteboardState = useCallback((snapshot: any) => {
    editorRef.current = snapshot;
    return Promise.resolve();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="order-2 lg:order-1">
            <TravelPlanner 
              onWhiteboardSave={handleSaveWhiteboard}
            />
          </section>
          
          <section className="order-1 lg:order-2 h-[500px] lg:h-[700px]">
            <Whiteboard onSave={captureWhiteboardState} />
          </section>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>WanderBoard — Plan your travels visually</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
