import React from "react";

type ProgressBarProps = {
  bgcolor?: string;
  progress: number;
  height?: string | number;
  width?: string | number;
  text?: string;
  value?: number;
  textColor?: string;
};

function ProgressBar({
  bgcolor,
  progress,
  height = "10px",
  width = "100%",
  text,
  value,
  textColor = "#000",
}: ProgressBarProps) {
  const Parentdiv: React.CSSProperties = {
    height,
    width,
    backgroundColor: "whitesmoke",
    borderRadius: 40,
  };

  const Childdiv: React.CSSProperties = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: progress === 100 ? "#4BB543" : bgcolor,
    borderRadius: 40,
    textAlign: "right",
  };

  const progresstext: React.CSSProperties = {
    padding: 4,
    color: textColor,
    fontWeight: 900,
  };

  return (
    <>
      <div className="flex justify-between py-1">
        <span className="text-[#1E1E1E] text-opacity-60 font-medium text-xs">
          {text}
        </span>
        <span className="text-semibold text-sm text-[#121212]">
          {value ? `${value}%` : ""}
        </span>
      </div>
      <div style={{ ...Parentdiv, marginBottom: "15px" }}>
        <div style={Childdiv}>
          <span style={progresstext}></span>
        </div>
      </div>
    </>
  );
}

export default ProgressBar;
