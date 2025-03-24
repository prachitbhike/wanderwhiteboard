
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaneLanding, Calendar, Trash2, Edit, ExternalLink } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Whiteboard from '@/components/Whiteboard';

type Trip = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

const MyTrips = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        setTrips(data || []);
      } catch (error: any) {
        console.error('Error fetching trips:', error);
        toast({
          title: 'Error fetching trips',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoadingTrips(false);
      }
    };
    
    fetchTrips();
  }, [user, toast]);

  const handleDeleteTrip = async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);
        
      if (error) throw error;
      
      setTrips(trips.filter(trip => trip.id !== tripId));
      toast({
        title: 'Trip deleted',
        description: 'Your trip has been deleted successfully.',
      });
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      toast({
        title: 'Error deleting trip',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditTrip = (trip: Trip) => {
    navigate(`/edit-trip/${trip.id}`);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted/30">
        <Navbar />
        <main className="flex-grow pt-20 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      <main className="flex-grow pt-20 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Trips</h1>
              <p className="text-muted-foreground mt-1">Manage your saved travel plans</p>
            </div>
            <Button onClick={() => navigate('/')} className="gap-2">
              <PlaneLanding className="w-4 h-4" />
              <span>New Trip</span>
            </Button>
          </div>

          {loadingTrips ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading your trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12">
              <CardContent className="text-center">
                <PlaneLanding className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any travel plans yet. Start planning your first trip!
                </p>
                <Button onClick={() => navigate('/')} className="gap-2">
                  <PlaneLanding className="w-4 h-4" />
                  <span>Start Planning</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{trip.name}</TableCell>
                    <TableCell>{format(new Date(trip.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(trip.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedTrip(trip)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-xl md:max-w-2xl overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>{selectedTrip?.name}</SheetTitle>
                              <SheetDescription>
                                Last updated on {selectedTrip && format(new Date(selectedTrip.updated_at), 'MMM d, yyyy')}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 h-[600px]">
                              {selectedTrip && (
                                <TripWhiteboard tripId={selectedTrip.id} />
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTrip(trip)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteTrip(trip.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

// Component to display a saved whiteboard
const TripWhiteboard = ({ tripId }: { tripId: string }) => {
  const [whiteboardData, setWhiteboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWhiteboard = async () => {
      try {
        const { data, error } = await supabase
          .from('whiteboards')
          .select('*')
          .eq('trip_id', tripId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        
        setWhiteboardData(data?.snapshot || null);
      } catch (error: any) {
        console.error('Error fetching whiteboard:', error);
        toast({
          title: 'Error fetching whiteboard',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWhiteboard();
  }, [tripId, toast]);

  if (loading) {
    return <div>Loading whiteboard...</div>;
  }

  if (!whiteboardData) {
    return <div>No whiteboard data available for this trip.</div>;
  }

  return (
    <Whiteboard readOnly initialData={whiteboardData} />
  );
};

export default MyTrips;
