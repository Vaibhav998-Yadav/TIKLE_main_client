import React, { useState, useEffect } from "react";

export default function Bottom_Section() {
  const sampleNews = [
    {
      id: 1,
      text: `Tesla's quarterly deliveries exceeded analyst expectations by 12%, driven by strong Model Y sales in European markets and improved production efficiency at the Austin Gigafactory...`,
    },
    {
      id: 2,
      text: `Apple announced a strategic partnership with OpenAI to integrate advanced AI capabilities into iOS 18, marking a significant shift in the company's approach to artificial intelligence...`,
    },
    {
      id: 3,
      text: `Microsoft Azure reported 35% year-over-year growth in cloud revenue, outpacing competitors as enterprise customers accelerate digital transformation initiatives...`,
    },
    {
      id: 4,
      text: `NVIDIA's latest H200 GPU chips are experiencing unprecedented demand from AI companies, with order backlogs extending through Q2 2026 despite increased manufacturing capacity...`,
    },
    {
      id: 5,
      text: `Amazon Web Services launched a new quantum computing initiative, partnering with IBM and Google to make quantum resources accessible to enterprise customers through cloud infrastructure...`,
    },
    {
      id: 6,
      text: `Meta's Reality Labs division posted a 28% increase in VR headset sales, with the Quest 3 capturing significant market share ahead of Apple's Vision Pro launch...`,
    },
    {
      id: 7,
      text: `Goldman Sachs reported record profits in algorithmic trading, with automated systems generating 43% more revenue compared to the previous quarter...`,
    },
    {
      id: 8,
      text: `Netflix subscriber growth surged 18% internationally following the successful launch of ad-supported tiers in emerging markets across Asia and Latin America...`,
    },
    {
      id: 9,
      text: `JPMorgan Chase announced a $2.5 billion investment in AI-driven fraud detection systems, aiming to reduce financial crimes by 60% over the next two years...`,
    },
    {
      id: 10,
      text: `Google Cloud's machine learning services saw 47% quarterly growth as healthcare and financial institutions adopt AI for predictive analytics and automation...`,
    },
    {
      id: 11,
      text: `Intel's new quantum processor achieved a breakthrough in error correction rates, positioning the company as a serious competitor to IBM and Google in quantum computing...`,
    },
    {
      id: 12,
      text: `Salesforce completed its largest acquisition this year, purchasing AI startup DataRobot for $3.8 billion to enhance its predictive analytics capabilities...`,
    },
    {
      id: 13,
      text: `PayPal's digital payment volume increased 31% year-over-year, driven by expanded cryptocurrency trading features and new merchant partnerships in Southeast Asia...`,
    },
    {
      id: 14,
      text: `Adobe's Creative Cloud subscriptions reached an all-time high of 28.5 million users, boosted by new AI-powered features in Photoshop and Premiere Pro...`,
    },
    {
      id: 15,
      text: `Spotify's premium subscriber base grew 22% globally, with AI-generated playlists and personalized recommendations driving engagement in competitive markets...`,
    },
    {
      id: 16,
      text: `Taiwan Semiconductor Manufacturing Company reported strong demand for 3nm chips, with production capacity fully booked through 2025 for major smartphone manufacturers...`,
    },
    {
      id: 17,
      text: `BlackRock's algorithmic trading platform processed $2.1 trillion in trades this quarter, representing a 15% increase in automated execution volumes...`,
    },
    {
      id: 18,
      text: `Oracle's cloud infrastructure revenue jumped 45% as enterprises migrate legacy databases, with particular strength in financial services and healthcare sectors...`,
    },
    {
      id: 19,
      text: `Coinbase reported trading volumes of $76 billion in Q3, marking a 38% increase from the previous quarter as institutional adoption of cryptocurrency accelerates...`,
    },
    {
      id: 20,
      text: `AMD's data center GPU sales exceeded $1.2 billion this quarter, challenging NVIDIA's dominance in AI training workloads with more cost-effective solutions...`,
    },
  ];

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 0.5);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-1">
      <div className="overflow-hidden">
        {/* Scrolling News Container */}
        <div className="relative h-20 overflow-hidden">
          <div
            className=" w-full transition-transform"
            style={{
              transform: `translateY(-${offset}px)`,
            }}
          >
            {/* Render news items multiple times for continuous scroll */}
            {[...sampleNews, ...sampleNews, ...sampleNews].map(
              (item, index) => (
                <div key={`${item.id}-${index}`} className=" py-3 border-b">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-black text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
