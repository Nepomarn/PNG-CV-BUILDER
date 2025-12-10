import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { forgotPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 overflow-hidden">
        {/* PNG Flag Gradient Background */}
        <div className="absolute inset-0 png-gradient opacity-100 dark:opacity-100" />
        <div className="absolute inset-0 png-gradient-light opacity-40 dark:opacity-0" />
        <div className="absolute inset-0 bilum-pattern" />
        
        <div className="relative z-10 w-full max-w-md rounded-none bg-[#FAF8F5] dark:bg-[#121212] p-8 brutalist-card animate-fade-in">
          <UrlProvider>
            <form className="flex flex-col space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] dark:text-[#FAF8F5]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  RESET PASSWORD
                </h1>
                <p className="text-sm text-[#0A0A0A]/70 dark:text-[#FAF8F5]/70">
                  Remember your password?{" "}
                  <Link
                    className="text-[#FF6F00] font-bold hover:underline transition-all uppercase"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] dark:text-[#FAF8F5]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full border-2 border-[#0A0A0A] dark:border-[#FF6F00] rounded-none bg-white dark:bg-[#0A0A0A] focus:ring-2 focus:ring-[#FF6F00]"
                  />
                </div>
              </div>

              <SubmitButton
                formAction={forgotPasswordAction}
                pendingText="Sending reset link..."
                className="w-full brutalist-btn py-3 rounded-none"
              >
                RESET PASSWORD
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
