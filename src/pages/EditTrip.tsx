
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Whiteboard from '@/components/Whiteboard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';

const EditTrip = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [tripName, setTripName] = useState('');
  const [whiteboardData, setWhiteboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      
      try {
        // Fetch trip data
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tripError) throw tripError;
        
        setTrip(tripData);
        setTripName(tripData.name);
        
        // Fetch whiteboard data
        const { data: whiteboardData, error: whiteboardError } = await supabase
          .from('whiteboards')
          .select('*')
          .eq('trip_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (whiteboardError && whiteboardError.code !== 'PGRST116') throw whiteboardError;
        
        if (whiteboardData) {
          setWhiteboardData(whiteboardData.snapshot);
        }
      } catch (error: any) {
        console.error('Error fetching trip:', error);
        toast({
          title: 'Error loading trip',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/my-trips');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrip();
  }, [id, toast, navigate]);

  const captureWhiteboardState = useCallback((snapshot: any) => {
    editorRef.current = snapshot;
    return Promise.resolve();
  }, []);

  const handleSave = async () => {
    if (!id || !trip) return;
    
    try {
      setSaving(true);
      
      // Update trip name
      const { error: updateError } = await supabase
        .from('trips')
        .update({ name: tripName, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Save whiteboard if available
      if (editorRef.current) {
        const { error: whiteboardError } = await supabase
          .from('whiteboards')
          .insert([
            { 
              trip_id: id,
              snapshot: editorRef.current
            }
          ]);
          
        if (whiteboardError) throw whiteboardError;
      }
      
      toast({
        title: 'Trip updated',
        description: 'Your trip has been updated successfully.',
      });
      
      navigate('/my-trips');
    } catch (error: any) {
      console.error('Error updating trip:', error);
      toast({
        title: 'Error updating trip',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !trip) return;
    
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('trips')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: 'Trip deleted',
          description: 'Your trip has been deleted successfully.',
        });
        
        navigate('/my-trips');
      } catch (error: any) {
        console.error('Error deleting trip:', error);
        toast({
          title: 'Error deleting trip',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
        <Navbar />
        <main className="flex-grow pt-20 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
          <div className="flex justify-center items-center h-[300px]">
            <p>Loading trip data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/my-trips')}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Trips</span>
            </Button>
            <h1 className="text-2xl font-bold">Edit Trip</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
            
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-1"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Update your trip information</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label htmlFor="tripName" className="block text-sm font-medium mb-1">Trip Name</label>
              <Input
                id="tripName"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="h-[500px] lg:h-[700px]">
          <Whiteboard 
            onSave={captureWhiteboardState}
            initialData={whiteboardData}
          />
        </div>
      </main>
    </div>
  );
};

export default EditTrip;
