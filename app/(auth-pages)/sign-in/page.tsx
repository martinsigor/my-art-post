import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Login({ 
  searchParams 
}: PageProps) {
  const params = await searchParams;
  let message: Message | undefined;
  
  if (params.error) {
    message = { error: params.error as string };
  } else if (params.message) {
    message = { success: params.message as string };
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
          value={params.redirect || '/'} 
        />
        <SubmitButton pendingText="Signing In...">
          Sign in
        </SubmitButton>
        {message && <FormMessage message={message} />}
      </div>
    </form>
  );
}
