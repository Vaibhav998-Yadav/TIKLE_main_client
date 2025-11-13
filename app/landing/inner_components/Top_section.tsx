"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBDCMeta } from "@/app/redux/slices/bdcMetaSlice";
import Notification_bell from "../../assets/svgs/Notification_bell";

import BDCData from "@/app/assets/data/BDC_data.json";

interface BDCItem {
  value: number;
  CIK: string;
  ticker: string;
  label: string;
}

export default function Top_section() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { data: notifications } = useAppSelector(
    (state) => state.notifications
  );

  const { status: bdcStatus } = useAppSelector((state) => state.bdcMeta);
  const isLoading = bdcStatus === "loading";

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<BDCItem[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Filter suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered: BDCItem[] = BDCData.Data.filter(
      (item: BDCItem) =>
        item.value.toString().includes(lower) ||
        item.ticker.toLowerCase().includes(lower) ||
        item.label.toLowerCase().includes(lower)
    ).slice(0, 8);

    setSuggestions(filtered);
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // Select a suggestion (only sets text, not fetch)
  const handleSelect = (item: BDCItem) => {
    setSearchTerm(item.label);
    setSuggestions([]); // close dropdown
    setHighlightedIndex(-1);

    // Ensure dropdown stays closed even if useEffect runs again
    setTimeout(() => setSuggestions([]), 0);
  };

  // Handle arrow keys + enter + escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;

      case "Escape":
        setSuggestions([]);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  };

  // Fetch Data button click
  const handleFetchClick = async () => {
    const selectedItem = BDCData.Data.find(
      (item: BDCItem) =>
        item.label.toLowerCase() === searchTerm.toLowerCase() ||
        item.ticker.toLowerCase() === searchTerm.toLowerCase()
    );

    if (selectedItem) {
      // console.log("Fetching data for:", selectedItem);
      await dispatch(fetchBDCMeta(selectedItem.CIK));
      router.push("/dashboard/view-filings");
    } else {
      console.warn("No matching BDC found for search term");
      router.push("/dashboard/view-filings");
    }
  };

  const isValidSelection = BDCData.Data.some(
    (item: BDCItem) =>
      item.label.toLowerCase() === searchTerm.toLowerCase() ||
      item.ticker.toLowerCase() === searchTerm.toLowerCase()
  );

  return (
    <header className="w-full h-full">
      <div className="mx-auto flex flex-col gap-1 h-full">
        {/* Row 1 */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center h-10 cursor-pointer relative group"
            onClick={() => router.push("/")}
          >
            <Image
              src="/TIKLE_black_logo.svg"
              alt="TIKLE Logo"
              width={120}
              height={40}
              priority
              className="transition-all duration-500 group-hover:opacity-0 group-hover:rotate-180"
            />
            <svg
              className="absolute inset-0 m-auto w-8 h-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              fill="black"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7.88 7.88l-3.54 7.78 7.78-3.54 3.54-7.78-7.78 3.54zM10 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/dashboard/notifications">
            <div style={{ marginRight: "10px", cursor: "pointer" }}>
              <Notification_bell notifications={notifications.length} />
            </div>
          </Link>
            <div className="text-black font-semibold">
              {`Hello ${user?.firstName ?? "User"}`}
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            
              <UserButton
                appearance={{
                  elements: { avatarBox: "w-10 h-10" },
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="text-black text-lg">
              Don’t let water run in the sink; our life is on the brink.
            </div>
            <div className="w-6 h-6 mt-1" aria-hidden>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 13c3-3 6-4 9-4"
                  stroke="#91E26F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 4c3 3 3 6 2 9"
                  stroke="#91E26F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search BDC by name, ticker, CIK"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-[420px] min-w-[220px] rounded-md px-4 py-1 shadow-sm focus:outline-none bg-white"
              />
              <button
                onClick={handleFetchClick}
                disabled={isLoading || !isValidSelection}
                className={`px-3 py-1 rounded-md font-medium shadow flex items-center justify-center transition ${
                  isLoading || !isValidSelection
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Fetch Data"
                )}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute top-[2.5rem] w-[420px] bg-white border border-gray-200 rounded-md shadow-md z-[1000]">
                {suggestions.map((item: BDCItem, index) => (
                  <li
                    key={item.CIK}
                    onClick={() => handleSelect(item)}
                    className={`px-4 py-2 cursor-pointer text-sm flex justify-between ${
                      index === highlightedIndex
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-500">{item.ticker}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// "use client";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
// import { fetchBDCMeta } from "@/app/redux/slices/bdcMetaSlice";
// import Notification_bell from "../../assets/svgs/Notification_bell";

// import BDCData from "@/app/assets/data/BDC_data.json";

// interface BDCItem {
//   value: number;
//   CIK: string;
//   ticker: string;
//   label: string;
// }

// export default function Top_section() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { data: notifications } = useAppSelector(
//     (state) => state.notifications
//   );

//   const { status: bdcStatus } = useAppSelector((state) => state.bdcMeta);
//   const isLoading = bdcStatus === "loading";

//   // Search state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<BDCItem[]>([]);
//   const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

//   // Mock user (since Clerk is removed)
//   const [userName] = useState("User");

//   // Filter suggestions
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setSuggestions([]);
//       setHighlightedIndex(-1);
//       return;
//     }

//     const lower = searchTerm.toLowerCase();
//     const filtered: BDCItem[] = BDCData.Data.filter(
//       (item: BDCItem) =>
//         item.value.toString().includes(lower) ||
//         item.ticker.toLowerCase().includes(lower) ||
//         item.label.toLowerCase().includes(lower)
//     ).slice(0, 8);

//     setSuggestions(filtered);
//     setHighlightedIndex(-1);
//   }, [searchTerm]);

//   // Select a suggestion (only sets text, not fetch)
//   const handleSelect = (item: BDCItem) => {
//     setSearchTerm(item.label);
//     setSuggestions([]);
//     setHighlightedIndex(-1);
//     setTimeout(() => setSuggestions([]), 0);
//   };

//   // Handle arrow keys + enter + escape
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (suggestions.length === 0) return;

//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setHighlightedIndex((prev) =>
//           prev < suggestions.length - 1 ? prev + 1 : 0
//         );
//         break;

//       case "ArrowUp":
//         e.preventDefault();
//         setHighlightedIndex((prev) =>
//           prev > 0 ? prev - 1 : suggestions.length - 1
//         );
//         break;

//       case "Enter":
//         e.preventDefault();
//         if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
//           handleSelect(suggestions[highlightedIndex]);
//         }
//         break;

//       case "Escape":
//         setSuggestions([]);
//         setHighlightedIndex(-1);
//         break;

//       default:
//         break;
//     }
//   };

//   // Fetch Data button click
//   const handleFetchClick = async () => {
//     const selectedItem = BDCData.Data.find(
//       (item: BDCItem) =>
//         item.label.toLowerCase() === searchTerm.toLowerCase() ||
//         item.ticker.toLowerCase() === searchTerm.toLowerCase()
//     );

//     if (selectedItem) {
//       await dispatch(fetchBDCMeta(selectedItem.CIK));
//       router.push("/dashboard/view-filings");
//     } else {
//       console.warn("No matching BDC found for search term");
//       router.push("/dashboard/view-filings");
//     }
//   };

//   const isValidSelection = BDCData.Data.some(
//     (item: BDCItem) =>
//       item.label.toLowerCase() === searchTerm.toLowerCase() ||
//       item.ticker.toLowerCase() === searchTerm.toLowerCase()
//   );

//   return (
//     <header className="w-full h-full">
//       <div className="mx-auto flex flex-col gap-1 h-full">
//         {/* Row 1 */}
//         <div className="flex items-center justify-between">
//           <div
//             className="flex items-center h-10 cursor-pointer relative group"
//             onClick={() => router.push("/")}
//           >
//             <Image
//               src="/TIKLE_black_logo.svg"
//               alt="TIKLE Logo"
//               width={120}
//               height={40}
//               priority
//               className="transition-all duration-500 group-hover:opacity-0 group-hover:rotate-180"
//             />
//             <svg
//               className="absolute inset-0 m-auto w-8 h-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
//               fill="black"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7.88 7.88l-3.54 7.78 7.78-3.54 3.54-7.78-7.78 3.54zM10 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
//             </svg>
//           </div>

//           <div className="flex items-center gap-3">
//             <Link href="/dashboard/notifications">
//               <div style={{ marginRight: "10px", cursor: "pointer" }}>
//                 <Notification_bell notifications={notifications.length} />
//               </div>
//             </Link>
//             <div className="text-black font-semibold">
//               {`Hello ${userName}`}
//             </div>
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//               DF
//             </div>
//           </div>
//         </div>

//         {/* Row 2 */}
//         <div className="flex items-center justify-between flex-wrap gap-4 py-2">
//           <div className="flex items-center gap-3">
//             <div className="text-black text-lg">
//               Don’t let water run in the sink; our life is on the brink.
//             </div>
//             <div className="w-6 h-6 mt-1" aria-hidden>
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M5 13c3-3 6-4 9-4"
//                   stroke="#91E26F"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M14 4c3 3 3 6 2 9"
//                   stroke="#91E26F"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="relative flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <input
//                 type="text"
//                 placeholder="Search BDC by name, ticker, CIK"
//                 aria-label="Search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="w-[420px] min-w-[220px] rounded-md px-4 py-1 shadow-sm focus:outline-none bg-white"
//               />
//               <button
//                 onClick={handleFetchClick}
//                 disabled={isLoading || !isValidSelection}
//                 className={`px-3 py-1 rounded-md font-medium shadow flex items-center justify-center transition ${
//                   isLoading || !isValidSelection
//                     ? "bg-gray-400 text-white cursor-not-allowed"
//                     : "bg-black text-white hover:bg-gray-800"
//                 }`}
//               >
//                 {isLoading ? (
//                   <>
//                     <svg
//                       className="animate-spin h-4 w-4 mr-2 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                       ></path>
//                     </svg>
//                     Loading...
//                   </>
//                 ) : (
//                   "Fetch Data"
//                 )}
//               </button>
//             </div>

//             {/* Suggestions Dropdown */}
//             {suggestions.length > 0 && (
//               <ul className="absolute top-[2.5rem] w-[420px] bg-white border border-gray-200 rounded-md shadow-md z-[1000]">
//                 {suggestions.map((item: BDCItem, index) => (
//                   <li
//                     key={item.CIK}
//                     onClick={() => handleSelect(item)}
//                     className={`px-4 py-2 cursor-pointer text-sm flex justify-between ${
//                       index === highlightedIndex
//                         ? "bg-gray-200"
//                         : "hover:bg-gray-100"
//                     }`}
//                   >
//                     <span>{item.label}</span>
//                     <span className="text-gray-500">{item.ticker}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
