
import React from 'react';
import Navbar from '@/components/Navbar';
import Whiteboard from '@/components/Whiteboard';
import TravelPlanner from '@/components/TravelPlanner';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="order-2 lg:order-1">
            <TravelPlanner />
          </section>
          
          <section className="order-1 lg:order-2 h-[500px] lg:h-[700px]">
            <Whiteboard />
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
