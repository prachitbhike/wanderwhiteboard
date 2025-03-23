
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, PlaneLanding, Globe, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <header className={cn("w-full px-6 py-4 glass border-b fixed top-0 z-50 animate-fade-in", className)}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlaneLanding className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">WanderBoard</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              My Trips
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Inspiration
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Collaborate
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span>New Trip</span>
            </Button>
            <Button size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span>Explore</span>
            </Button>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
