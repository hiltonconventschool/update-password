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

    const handleEmailChange = () => {
      try {
        // Get both hash and search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Get relevant parameters
        const hashType = hashParams.get('type');
        const searchType = searchParams.get('type');
        const code = searchParams.get('code');
        const token = searchParams.get('token');
        const accessToken = hashParams.get('access_token');
        
        // Debug: Log everything
        console.log('=== EMAIL CONFIRMATION DEBUG ===');
        console.log('Full URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('Hash:', window.location.hash);
        console.log('Parsed values:', { 
          hashType, 
          searchType, 
          code, 
          token,
          accessToken 
        });

        // If we have a code parameter from the redirect, email is confirmed
        if (code) {
          console.log('✓ Code parameter found - Email confirmed!');
          if (isMounted) {
            setPageState('confirmed');
          }
          return;
        }

        // Check other possible parameters
        if (
          hashType === 'email_change' || 
          searchType === 'email_change' ||
          token ||
          accessToken
        ) {
          console.log('✓ Valid email change parameter found - Email confirmed!');
          if (isMounted) {
            setPageState('confirmed');
          }
          return;
        }

        // If no parameters found, this was accessed directly
        console.log('✗ No valid parameters found');
        if (isMounted) {
          setErrorMessage('This page should only be accessed via the email confirmation link.');
          setPageState('error');
        }

      } catch (err) {
        console.error('Error during confirmation:', err);
        if (isMounted) {
          setErrorMessage('An unexpected error occurred.');
          setPageState('error');
        }
      }
    };

    // Run immediately
    handleEmailChange();

    return () => { 
      isMounted = false;
    };
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
          <Alert className="border-green-500 bg-green-50 text-green-800">
            <MailCheck className="h-4 w-4 !text-green-600" />
            <AlertTitle className="font-bold text-green-800">Email Confirmed!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your new email address has been successfully updated. You can now login with your new email safely.
            </AlertDescription>
          </Alert>
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