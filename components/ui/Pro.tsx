import React from "react";
import "./css/ProBadge.css";

interface ProBadgeProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const ProBadge: React.FC<ProBadgeProps> = ({
  size = "small",
  className = "",
}) => {
  const sizeClassMap = {
    small: "sizeSmall",
    medium: "sizeMedium",
    large: "sizeLarge",
  };

  return (
    <div className={`proBadge ${sizeClassMap[size]} ${className}`}>
      <div className="overlay" />
      <span className="relative z-10 tracking-wide">Pro</span>
    </div>
  );
};

export default ProBadge;
