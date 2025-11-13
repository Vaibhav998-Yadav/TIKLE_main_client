"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Agent_main from "./Schedule_of_investments/page";

const page = () => {
  const { user, isLoaded } = useUser();

  // List of allowed email addresses
  const allowedEmails = [
    "luv.ratan@decipherfinancials.com",
    "abhinav.sharma@decipherfinancials.com",
    "sneha.mehta@decipherfinancials.com",
    "megha.punjabi@decipherfinancials.com",
    "anil.kumar@decipherfinancials.com",
    "garima.goel@decipherfinancials.com",
    "komal.kaushik@decipherfinancials.com",
    "surender.malik@decipherfinancials.com",
    "prasuk.jain@decipherfinancials.com",
    "mohit.patel@decipherfinancials.com",
    "meenakshi.rawat@decipherfinancials.com",
    "suprit.baviskar@decipherfinancials.com",
    "garvit.sharma@decipherfinancials.com",
    "ashu.jain@decipherfinancials.com"
    
  ];

  // Wait until user is loaded
  if (!isLoaded) {
    return <div className="text-white p-5">Loading...</div>;
  }

  // If no user is signed in or email not in allowed list
  if (
    !user ||
    !allowedEmails.includes(user.primaryEmailAddress?.emailAddress ?? "")
  ) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500 text-lg">
        Access Denied 🚫 — You don’t have permission to view this page.
      </div>
    );
  }

  // Authorized access
  return (
    <div style={{ background: "black" }} className="h-screen p-5">
      <Agent_main />
    </div>
  );
};

export default page;
