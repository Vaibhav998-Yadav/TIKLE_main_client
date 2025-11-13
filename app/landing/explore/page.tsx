"use client";
import type React from "react";
import "./style.css";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import BDCData from "@/app/assets/data/BDC_data.json";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useRouter } from "next/navigation";
import ProBadge from "@/components/ui/Pro";
import MySplineScene from "@/app/assets/3d_designs/MySplineScene";
import DashedLines from "./DashedLines";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function PF_divider() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSignedIn } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePremium = () => {
    if (isSignedIn) {
      router.push("/dashboard-premium");
    }
    // If not signed in, the SignInButton wrapper will handle showing the modal
  };

  const handleExploreBDCs = () => {
    if (isSignedIn) {
      router.push("/landing");
    }
    // If not signed in, the SignInButton wrapper will handle showing the modal
  };

  const [avatarUrl] = useState(() => {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}`;
  });

  return (
    <div className="dashboard-container">
      {/* Left Section */}
      <div className="left-panel">
        <div className="header-padding">
          <div className="logo-container">
            <span className="logo-text">TIKLE</span>
          </div>
        </div>
        <div className="left-content-area">
          <div>
            <div style={{ width: "40vw", height: "40vh"}}>
              <MySplineScene />
            </div>
          </div>
          <div className="left-text-content">
            <h1 className="left-heading">Premium Analytics for all BDCs</h1>
            <p className="left-description">
              Access deep insights and detailed data to elevate your
              decision-making and drive better results for any BDC.
            </p>
            <SignedIn>
              <Button
                className="analytics-button cursor-pointer"
                onClick={handlePremium}
              >
                Analytics <ProBadge />
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton
                mode="modal"
                forceRedirectUrl="/dashboard-premium"
                signUpForceRedirectUrl="/dashboard-premium"
              >
                <Button className="analytics-button cursor-pointer">
                  Analytics <ProBadge />
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "auto",
          height: "100vh",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/book_binding.svg"
          alt="Dashboard illustration"
          width={300}
          height={300}
          style={{
            height: "100vh",
            width: "auto",
            objectFit: "cover",
          }}
        />
      </div>
      <Image
        src="/book_corner.png"
        alt="Corner image"
        width={1500} // use a high-res image if possible
        height={1500}
        style={{
          position: "fixed",
          top: "-1rem",
          right: "-1rem",
          width: "10vw", // browser scales down a high-quality image cleanly
          height: "auto",
          objectFit: "contain",
          zIndex: 9999,
          imageRendering: "crisp-edges"
        }}
      />

      {/* Right Section */}
      <div className="right-panel">
        <DashedLines>
          <div className="right-content-area">
            <div className="right-main-content">
              <div
                style={{
                  width: "100%",
                  height: "60%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/Group4.svg"
                  alt="Dashboard illustration"
                  width={300}
                  height={300}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-[100%] mx-auto text-center text-gray-500 mb-5 mt-10">
                Access deep insights and detailed data to elevate your
                decision-making and drive better results for any BDC.
              </div>

              <SignedIn>
                <button
                  onClick={handleExploreBDCs}
                  className="bg-[#405DA8] text-white px-6 py-2 rounded-md font-medium w-50 min-w-[400px] mt-3 hover:bg-[#334a87] transition-colors"
                >
                  Explore BDCs
                </button>
              </SignedIn>
              <SignedOut>
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/landing"
                  signUpForceRedirectUrl="/landing"
                >
                  <button className="bg-[#405DA8] text-white px-6 py-2 rounded-md font-medium w-50 min-w-[400px] mt-3 hover:bg-[#334a87] transition-colors">
                    Explore BDCs
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </DashedLines>
      </div>
    </div>
  );
}