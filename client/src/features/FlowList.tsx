import { useState } from "react";
import icon from "../assets/flow.svg";
import FlowItem from "../components/FlowItem";
import { useFlowList } from "../hooks/useFlowList";

export default function FlowList({
  setSelectedFlow,
}: {
  setSelectedFlow: (fileHash: string) => void;
}) {
  const { data: flows, isLoading } = useFlowList();
  const [filter, setFilter] = useState<string>("");

  return (
    <aside className="w-[280px] h-[calc(100vh-20px)] mt-2.5 ml-1 rounded-lg bg-white p-3 border-r border-gray-200 flex flex-col gap-2 fixed z-10 text-sm shadow-lg">
      <div className="font-semibold text-[20px] mb-3 mt-1 text-black/90 uppercase border-b border-black/10 pb-1.5 flex items-center justify-center gap-2">
        <img src={icon} alt="Flow Icon" className="h-[35px]" />
        <p>Flow Analyzer</p>
      </div>

      <input
        className="px-2.5 py-2 border border-gray-300 rounded-lg outline-none"
        placeholder="Filter Flows..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <button
        className="px-2 py-1.5 rounded-lg border border-gray-300 bg-gray-100 cursor-pointer font-normal"
        title="Show the whole list"
        onClick={() => setFilter("")}
      >
        Reset Filter
      </button>

      {isLoading ? (
        <div
          className={`overflow-auto w-full border-t border-gray-100 mt-1 flex-1 text-center`}
        >
          <p>Loading...</p>
        </div>
      ) : (
        <div
          className={`overflow-auto w-full border-t border-gray-100 mt-1 flex-1 ${
            flows?.length ? "text-left" : "text-center"
          }`}
        >
          {flows?.length ? (
            flows
              .filter(
                (flow) =>
                  flow.title.includes(filter) ||
                  flow.projectName.includes(filter) ||
                  flow.dateTime.includes(filter)
              )
              .map((flow) => (
                <FlowItem
                  key={flow.fileHash}
                  flow={flow}
                  onClick={(hash) => setSelectedFlow(hash)}
                />
              ))
          ) : (
            <p>No flows available.</p>
          )}
        </div>
      )}
    </aside>
  );
}
