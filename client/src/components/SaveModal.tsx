import React, { useState } from "react";

interface SaveModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState("");

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      setTitle("");
    }
  };

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] flex flex-col gap-6">
        <h2
          id="save-modal-title"
          className="text-xl font-semibold m-0 border-b border-b-gray-300 pb-1"
        >
          Save Graph
        </h2>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Graph Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter graph title"
          />
        </label>
        <div className="flex justify-end gap-3 border-t border-t-gray-300 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 ${
              !title.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
            disabled={!title.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
