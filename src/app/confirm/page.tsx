"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, MailCheck, Lock } from "lucide-react";
import Link from 'next/link';

import { supabase } from "@/lib/supabase/client";
import { SchoolLogo } from "@/components/school-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PageState = 'checking' | 'confirmed' | 'error';

export default function ConfirmEmailChangePage() {
  const [pageState, setPageState] = useState<PageState>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const handleEmailChange = async () => {
      try {
        // Get the hash fragment (everything after #) which Supabase uses for auth tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Check for token in hash (Supabase's primary method)
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');
        
        // Also check search params as fallback
        const codeParam = searchParams.get('code');
        const typeParam = searchParams.get('type');

        // If we have an access token and type in hash, use it
        if (accessToken && type === 'recovery') {
          // This handles the token automatically via Supabase's auth listener
          if (isMounted) {
            setPageState('confirmed');
          }
          return;
        }

        // If we have a code parameter, exchange it for a session
        if (codeParam) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(codeParam);
          
          if (error) {
            console.error('Error exchanging code:', error);
            if (isMounted) {
              setErrorMessage(error.message);
              setPageState('error');
            }
            return;
          }

          if (data.session) {
            if (isMounted) {
              setPageState('confirmed');
            }
            return;
          }
        }

        // Check if type parameter indicates email change
        if (typeParam === 'email_change' || type === 'email_change') {
          if (isMounted) {
            setPageState('confirmed');
          }
          return;
        }

        // If none of the above, wait a bit and show error
        const timer = setTimeout(() => {
          if (isMounted) {
            setErrorMessage('No valid confirmation token found in URL.');
            setPageState('error');
          }
        }, 3000);

        return () => clearTimeout(timer);

      } catch (err) {
        console.error('Unexpected error:', err);
        if (isMounted) {
          setErrorMessage('An unexpected error occurred.');
          setPageState('error');
        }
      }
    };

    handleEmailChange();

    return () => { isMounted = false; };
  }, []);

  const renderContent = () => {
    switch (pageState) {
      case 'checking':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <p className="text-gray-500">Confirming your new email address...</p>
          </div>
        );
      case 'confirmed':
        return (
          <div className="space-y-4">
            <Alert className="border-green-500 bg-green-50 text-green-800">
              <MailCheck className="h-4 w-4 !text-green-600" />
              <AlertTitle className="font-bold text-green-800">Email Confirmed!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your new email address has been successfully updated. You can now use it to log in.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-red-600 hover:text-red-700 font-medium underline"
              >
                Go to Login
              </Link>
            </div>
          </div>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Invalid or Expired Link</AlertTitle>
            <AlertDescription>
              {errorMessage || 'This confirmation link is invalid or has expired. Please try changing your email again.'}
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto">
            <SchoolLogo className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold text-red-600">HCSSS</h1>
          <p className="font-bold text-foreground/80">
            Email Change Confirmation
          </p>
        </div>
        <div>{renderContent()}</div>
      </div>
      <footer className="mt-8 text-center text-sm text-foreground/60">
        <div className="flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Secured by SSL</span>
        </div>
        <p>&copy; {new Date().getFullYear()} HCSSS. All Rights Reserved.</p>
      </footer>
    </main>
  );
}