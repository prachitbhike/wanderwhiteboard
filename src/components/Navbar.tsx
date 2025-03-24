
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, PlaneLanding, Globe, Menu, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={cn("w-full px-6 py-4 glass border-b fixed top-0 z-50 animate-fade-in", className)}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PlaneLanding className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">WanderBoard</h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/my-trips" className="text-sm font-medium hover:text-primary transition-colors">
              My Trips
            </Link>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Inspiration
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Collaborate
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/my-trips')}>
                  <MapPin className="h-4 w-4" />
                  <span>My Trips</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Button size="sm" className="gap-2" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
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
