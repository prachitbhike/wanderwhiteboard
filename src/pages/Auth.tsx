
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { PlaneLanding } from 'lucide-react';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <PlaneLanding className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-3xl font-bold mt-4">WanderBoard</h1>
            <p className="text-muted-foreground mt-2">Plan your travels visually</p>
          </div>
          
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default Auth;
