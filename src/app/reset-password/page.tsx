
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound, Loader2, AlertCircle, CheckCircle, Lock } from "lucide-react";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { SchoolLogo } from "@/components/school-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type PageState = 'checking' | 'form' | 'submitted' | 'error';

export default function ResetPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('checking');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    // This listener fires when the user is redirected back from the password reset email.
    // The session is restored, and the event is PASSWORD_RECOVERY.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted && event === "PASSWORD_RECOVERY") {
        setPageState('form');
        // We only need to hear this event once.
        subscription?.unsubscribe();
      }
    });

    // As a fallback, if the event doesn't fire after a few seconds,
    // we assume the token is invalid or expired. This handles cases where the user
    // navigates to the page directly without a valid token.
    const timer = setTimeout(() => {
        if (isMounted && pageState === 'checking') {
           setPageState('error');
        }
    }, 5000);

    return () => {
        isMounted = false;
        subscription?.unsubscribe();
        clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      // The user's session is already active from the PASSWORD_RECOVERY event.
      // We can now update the user's password directly.
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      
      setPageState('submitted');

      toast({
        title: "Success!",
        description: "Your password has been updated successfully.",
      });

    } catch (error: any) {
      setError(error.message || "Failed to update password. The link may be expired or invalid.");
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password. The link may be expired or invalid.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const renderContent = () => {
    switch (pageState) {
        case 'checking':
            return (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                  <p className="text-gray-500">Verifying link...</p>
                </div>
            );
        case 'form':
            return (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">New Password</FormLabel>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Confirm New Password</FormLabel>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle className="font-bold">Error</AlertTitle>
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full font-bold" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </form>
                </Form>
            );
        case 'submitted':
             return (
                <Alert className="border-green-500 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4 !text-green-600" />
                  <AlertTitle className="font-bold text-green-800">Password Updated!</AlertTitle>
                  <AlertDescription className="text-green-700">Your password has been changed successfully.</AlertDescription>
                </Alert>
              );
        case 'error':
             return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Invalid or Expired Link</AlertTitle>
                    <AlertDescription>
                    This password reset link is invalid or has expired. Please{' '}
                    <Link href="/forgot-password" className="font-bold underline hover:text-destructive-foreground">
                        request a new one
                    </Link>.
                    </AlertDescription>
                </Alert>
            );
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto">
            <SchoolLogo className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold text-red-600">HCSSS</h1>
          <p className="font-bold text-gray-500">
            {pageState === 'form' ? 'Set a new password' : 'Password Reset'}
          </p>
        </div>
        <div>{renderContent()}</div>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Secured by SSL</span>
        </div>
        <p>&copy; {new Date().getFullYear()} HCSSS. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
