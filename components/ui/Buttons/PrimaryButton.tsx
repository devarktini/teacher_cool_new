import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  bgColor?: string;     // Optional custom background color
  textColor?: string;   // Optional custom text color
  className?: string;   // Optional extra classes
}

const colorMap: Record<ButtonVariant, { bg: string; text: string }> = {
  primary: { bg: "bg-blue-600 hover:bg-blue-700", text: "text-white" },
  secondary: { bg: "bg-gray-500 hover:bg-gray-600", text: "text-white" },
  danger: { bg: "bg-red-600 hover:bg-red-700", text: "text-white" },
  success: { bg: "bg-green-600 hover:bg-green-700", text: "text-white" },
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = "primary",
  bgColor,
  textColor,
  className = "",
}) => {
  const colors = colorMap[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md font-semibold transition duration-200
        ${bgColor ? "" : colors.bg}
        ${textColor ? "" : colors.text}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;


// import React, { useState } from "react";
// import PrimaryButton from "./PrimaryButton";

// const ExamplePage = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleClick = () => {
//     setIsLoading(true);
//     setTimeout(() => setIsLoading(false), 1500);
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       {/* Default primary */}
//       <PrimaryButton label="Save" onClick={handleClick} />

//       {/* Danger variant */}
//       <PrimaryButton label="Delete" variant="danger" onClick={() => alert("Deleted")} />

//       {/* Custom static colors */}
//       <PrimaryButton
//         label="Custom Theme"
//         bgColor="#9333ea"  // purple
//         textColor="#fff"
//         onClick={() => console.log("Custom clicked")}
//       />

//       {/* Disabled / loading */}
//       <PrimaryButton label={isLoading ? "Loading..." : "Submit"} disabled={isLoading} />
//     </div>
//   );
// };

// export default ExamplePage;
