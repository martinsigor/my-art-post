import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type PageProps = {
  searchParams: {
    message?: string;
    error?: string;
    redirect?: string;
  };
};

export default function Login({ searchParams }: PageProps) {
  let message: Message | undefined;
  
  if (searchParams.error) {
    message = { error: searchParams.error };
  } else if (searchParams.message) {
    message = { success: searchParams.message };
  }

  return (
    <form action={signInAction} className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <input 
          type="hidden" 
          name="redirect" 
          value={searchParams.redirect || '/'} 
        />
        <SubmitButton pendingText="Signing In...">
          Sign in
        </SubmitButton>
        {message && <FormMessage message={message} />}
      </div>
    </form>
  );
}
