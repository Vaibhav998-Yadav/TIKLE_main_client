"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    // No auth logic yet
    router.push("/landing/explore");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-left text-xl font-semibold">Sign In</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </Label>
              <Input id="email" type="email" placeholder="team@myhaul.com" className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </Label>
              <Input id="password" type="password" placeholder="••••••••" className="w-full" />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-11 text-white font-medium rounded-md"
              style={{ backgroundColor: "#4f6ec7" }}
            >
              Login
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Login with Google
            </Button>

            <div className="space-y-2 text-sm text-center">
              <p className="text-gray-600">
                {"Don't have an account? "}
                <a href="#" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
              <p>
                <a href="#" className="text-gray-600 hover:underline">
                  Forgot your password?
                </a>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
