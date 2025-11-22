import type { Flatten, FlowData } from "../types/app.types";
import closeIcon from "../assets/close.svg";
import arrowIcon from "../assets/openArrow.svg";

const ViewTitle = ({
  title,
  metadata,
  isVisible,
  setIsVisible,
}: {
  title: string;
  metadata: Flatten<Pick<FlowData, "metadata">, "metadata">;
  isVisible: boolean;
  setIsVisible: (param: boolean) => void;
}) => {
  return (
    <div
      className={`w-[280px] ${
        isVisible ? "h-[30%] overflow-y-auto" : "h-[35px] overflow-hidden"
      } py-1 px-4 border-r border-gray-200 bg-white flex flex-col justify-center gap-2 absolute right-5 top-3 text-xs 2xl:text-sm z-10 rounded-lg shadow-lg transition-all duration-300`}
    >
      {isVisible && (
        <>
          <div className="w-full z-10 border-b border-black/10 py-1.5">
            <span className="font-bold">Title:</span> {title}
          </div>
          <div
            className={`w-full py-1.5 border-b border-black/10 z-10 ${
              metadata.projectType !== "unknown" ||
              metadata.framework !== "unknown"
                ? "visible"
                : "invisible"
            }`}
          >
            <span className="font-bold">Info:</span>{" "}
            <span>
              {metadata?.projectType} - {metadata?.framework}
            </span>
          </div>

          <div
            className={`w-full 2xl:h-fit md:h-20 py-1.5 z-10 ${
              metadata.description ? "visible" : "invisible"
            }`}
            title={metadata.description}
          >
            <span className="font-bold">Description:</span>{" "}
            <span>{metadata.description}</span>
          </div>
        </>
      )}
      <button
        type="button"
        aria-label="Show/Hide"
        onClick={() => setIsVisible(!isVisible)}
        className="p-1 rounded-md border cursor-pointer border-gray-200 bg-gray-50 z-10 hover:bg-gray-100 text-black/80 absolute top-[5px] right-1"
      >
        <img
          src={isVisible ? closeIcon : arrowIcon}
          alt="Show/Hide"
          className="h-4 w-4"
        />
      </button>
      <p
        className={`font-bold text-base absolute top-[5px] left-2 uppercase ${
          isVisible ? "hidden" : "visible"
        }`}
      >
        Project Information
      </p>
    </div>
  );
};

export default ViewTitle;
