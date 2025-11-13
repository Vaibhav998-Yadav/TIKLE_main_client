// app/authentication/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
          }
        }}
        fallbackRedirectUrl="/landing"
        signInUrl="/authentication/sign-in"
      />
    </div>
  );
}