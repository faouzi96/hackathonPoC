import React, { useState } from "react";
import SaveModal from "./SaveModal";

type Props = {
  onSave: (title: string) => void;
  onDelete?: () => void;
  saveLabel?: string;
  deleteLabel?: string;
  className?: string;
  isFetched: boolean;
};

const GraphOptions: React.FC<Props> = ({
  onSave,
  onDelete,
  saveLabel = "Save",
  deleteLabel = "Delete",
  className = "",
  isFetched,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`w-fit absolute right-[350px] top-2.5 inline-flex items-center gap-3 border border-gray-200 bg-white px-3 py-2 rounded-[10px] shadow-sm text-sm ${className}`}
      role="group"
      aria-label="Graph options"
    >
      <button
        type="button"
        disabled={isFetched}
        aria-disabled={isFetched}
        onClick={() => setIsOpen(true)}
        className={`inline-flex w-20 justify-center items-center gap-2 px-3 py-1.5 rounded-md border border-transparent text-white focus:outline-none focus:ring-2 ${
          isFetched
            ? "bg-green-600 opacity-50 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 focus:ring-green-300 cursor-pointer"
        }`}
      >
        {saveLabel}
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={!isFetched}
        aria-disabled={!isFetched}
        className={`inline-flex w-20 justify-center items-center gap-2 px-3 py-1.5 rounded-md border border-transparent text-white focus:outline-none focus:ring-2 ${
          !isFetched
            ? "bg-red-600 opacity-50 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 focus:ring-red-300 cursor-pointer"
        }`}
      >
        {deleteLabel}
      </button>
      <SaveModal
        open={isOpen}
        onSave={(title: string) => {
          onSave(title);
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default GraphOptions;
