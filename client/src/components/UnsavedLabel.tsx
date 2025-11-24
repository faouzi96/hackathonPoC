import React from "react";

type UnsavedLabelProps = {
  isSaved: boolean;
  isVisible: boolean;
};

const UnsavedLabel: React.FC<UnsavedLabelProps> = ({ isSaved, isVisible }) => {
  if (isSaved || !isVisible) return null;

  return (
    <div
      className="absolute top-5 left-[300px] bg-red-500 text-white px-3 py-1.5 text-xs font-bold rounded-bl-md rounded-br-md rounded-tr-md z-50 shadow-md pointer-events-none"
      aria-live="polite"
      role="status"
    >
      Flow unsaved
    </div>
  );
};

export default UnsavedLabel;
