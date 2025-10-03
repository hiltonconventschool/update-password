
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, MailCheck, Lock } from "lucide-react";

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


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: redirectTo,
      });
      if (error) {
        throw error;
      }
      setSubmitted(true);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
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
            {submitted ? "Check your email" : "Reset Your Password"}
          </p>
        </div>
        
        <div>
          {submitted ? (
            <Alert className="border-green-500 bg-green-50 text-green-800">
              <MailCheck className="h-4 w-4 !text-green-600" />
              <AlertTitle className="font-bold text-green-800">Email Sent!</AlertTitle>
              <AlertDescription className="text-green-700">
                A password reset link has been sent to the email address you provided. Please check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <p className="text-sm text-gray-500 text-center">
                  Enter your email address below and we'll send you a link to reset your password.
                </p>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Email Address</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="pl-10" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full font-bold" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Password Reset Link
                </Button>
              </form>
            </Form>
          )}
        </div>
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
