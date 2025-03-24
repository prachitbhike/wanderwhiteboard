import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, PlaneLanding, Compass, Lightbulb, Users, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TravelPlannerProps {
  className?: string;
  whiteboardRef?: React.RefObject<HTMLDivElement>;
  onWhiteboardSave?: (snapshot: any) => Promise<void>;
}

const TravelPlanner: React.FC<TravelPlannerProps> = ({ className, whiteboardRef, onWhiteboardSave }) => {
  const [tripName, setTripName] = useState("Paris Adventure");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSaveTrip = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      setSaving(true);
      
      // Save the trip first
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert([
          { name: tripName, user_id: user.id }
        ])
        .select()
        .single();
        
      if (tripError) throw tripError;
      
      // If we have a whiteboard to save and a trip ID
      if (onWhiteboardSave && tripData) {
        // The editor instance will be available via onWhiteboardSave
        await onWhiteboardSave(tripData.id);
      }
      
      toast({
        title: "Trip saved!",
        description: "Your trip has been saved successfully.",
      });
      
      // Navigate to the My Trips page
      navigate('/my-trips');
    } catch (error: any) {
      console.error('Error saving trip:', error);
      toast({
        title: "Error saving trip",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className={cn("w-full space-y-6 animate-slide-in", className)}>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2">
            Planning Mode
          </div>
          <h2 className="text-2xl font-bold">
            <Input 
              value={tripName} 
              onChange={(e) => setTripName(e.target.value)} 
              className="text-2xl font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" 
            />
          </h2>
          <p className="text-muted-foreground mt-1">Use the whiteboard to visualize your travel plans</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate('/my-trips')}
          >
            <Users className="h-4 w-4" />
            <span>My Trips</span>
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={handleSaveTrip}
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save Trip"}</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="planning" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Ideas & Inspiration
                </CardTitle>
                <CardDescription>Capture your travel ideas</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">Use the whiteboard to brainstorm ideas for your trip.</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Destinations
                </CardTitle>
                <CardDescription>Map out your journey</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">Drag & drop locations on the whiteboard to plan your route.</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Timeline
                </CardTitle>
                <CardDescription>Visualize your schedule</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">Create a visual timeline of your activities and travels.</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Travel Tools
              </CardTitle>
              <CardDescription>Drag these elements onto your whiteboard</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Clock className="h-4 w-4" />
                <span>Activity</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Compass className="h-4 w-4" />
                <span>Direction</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="itinerary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip Itinerary</CardTitle>
              <CardDescription>Organize your daily activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your itinerary will appear here once you've finalized your plans on the whiteboard.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="checklist" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Travel Checklist</CardTitle>
              <CardDescription>Keep track of essentials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your travel checklist will appear here as you add items.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPlanner;
