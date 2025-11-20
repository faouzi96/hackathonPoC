import React from "react";

interface BackdropLoaderProps {
  show: boolean;
  children?: React.ReactNode;
}

const BackdropLoader: React.FC<BackdropLoaderProps> = ({ show, children }) => {
  if (!show) return null;
  return (
    <div
      className="fixed top-0 right-0 h-screen z-50 flex items-center justify-center"
      style={{ width: "calc(100vw - 280px)" }}
    >
      <div className="w-full h-full bg-black/85 bg-opacity-30 flex items-center justify-center">
        {children ?? (
          <div className="mr-10 flex items-center gap-2">
            <span className="loader border-4 border-t-4 border-gray-200 border-t-indigo-500 rounded-full w-8 h-8 animate-spin"></span>
            <span className="text-white text-lg">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackdropLoader;
