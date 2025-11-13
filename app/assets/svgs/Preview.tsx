import React from "react";

interface EyeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const EyeIcon: React.FC<EyeIconProps> = ({ size = 25, ...props }) => {
  return (
    <svg
      className={`w-[${size}px] h-[${size}px] text-gray-800 dark:text-white`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke="#1d2f55"
        strokeWidth="2"
        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
      />
      <path
        stroke="#1d2f55"
        strokeWidth="2"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
};

export default EyeIcon;
