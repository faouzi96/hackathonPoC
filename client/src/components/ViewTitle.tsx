import type { Flatten, FlowData } from "../types/app.types";

const ViewTitle = ({
  title,
  metadata,
}: {
  title: string;
  metadata: Flatten<Pick<FlowData, "metadata">, "metadata">;
}) => {
  return (
    <div className="w-[280px] h-[30%] py-1 px-4 border-r border-gray-200 bg-white flex flex-col justify-center gap-2 absolute right-5 top-[10px]  text-sm z-10 rounded-[15px] shadow-lg overflow-y-auto">
      <div className="w-full z-10 border-b border-black/10 py-1.5">
        <span className="font-bold">Title:</span> {title}
      </div>
      <div
        className={`w-full py-1.5 border-b border-black/10 z-10 ${
          metadata.projectType !== "unknown" || metadata.framework !== "unknown"
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
        className={`w-full 2xl:h-fit md:h-20 py-1.5 border-b border-black/10 z-10 ${
          metadata.description ? "visible" : "invisible"
        }`}
        title={metadata.description}
      >
        <span className="font-bold">Description:</span>{" "}
        <span>{metadata.description}</span>
      </div>
    </div>
  );
};

export default ViewTitle;
