
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

  useEffect(() => {
    let isMounted = true;

    // Supabase puts the token information in the URL search parameters (e.g. ?type=email_change)
    // after a successful redirect. The token has already been verified and consumed by Supabase
    // before the redirect happens. We just need to check for the presence of the `type` parameter
    // to confirm that we arrived here from a valid confirmation link.
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('type') === 'email_change') {
      if (isMounted) {
        setPageState('confirmed');
      }
    } else {
      // If the parameter isn't there, this page was likely accessed directly
      // or the link was malformed.
      const timer = setTimeout(() => {
          if (isMounted) {
            setPageState('error');
          }
      }, 3000);
      return () => clearTimeout(timer);
    }
    
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
          <Alert className="border-green-500 bg-green-50 text-green-800">
            <MailCheck className="h-4 w-4 !text-green-600" />
            <AlertTitle className="font-bold text-green-800">Email Confirmed!</AlertTitle>
            <AlertDescription className="text-green-700">
                Your new email address has been successfully updated. You can now use it to log in.
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Invalid or Expired Link</AlertTitle>
            <AlertDescription>
              This confirmation link is invalid or has expired. Please try changing your email again.
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
