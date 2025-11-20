import icon from "../assets/flow.svg";
import FlowItem from "../components/FlowItem";

export interface FlowOverview {
  title: string;
  projectName: string;
  framework: string;
  dateTime: string;
  fileHash: string;
}

export default function FlowList() {
  const flows: FlowOverview[] = [
    {
      title: "My First Flow",
      projectName: "AwesomeProject",
      framework: "React",
      dateTime: "2024-10-01 10:00:00",
      fileHash: "abc123",
    },
    {
      title: "Backend Flow",
      projectName: "ServerApp",
      framework: "Node.js",
      dateTime: "2024-10-02 14:30:00",
      fileHash: "def456",
    },
  ];

  return (
    <aside className="w-[280px] h-screen bg-white p-3 border-r border-gray-200 flex flex-col gap-2 fixed z-10">
      <div className="font-semibold text-[20px] text-black/90 uppercase border-b border-black/10 pb-1.5 flex items-center justify-center gap-2">
        <img src={icon} alt="Flow Icon" className="h-[35px]" />
        <p>Flow Analyzer</p>
      </div>

      <input
        className="px-2.5 py-2 border border-gray-300 rounded-lg outline-none"
        placeholder="Filter Flows..."
      />

      <button
        className="px-2 py-1.5 rounded-lg border border-gray-300 bg-gray-100 cursor-pointer font-normal"
        title="Show the whole list"
      >
        Show all
      </button>

      <div
        className={`overflow-auto w-full border-t border-gray-100 mt-1 flex-1 ${
          flows.length ? "text-left" : "text-center"
        }`}
      >
        {flows.length ? (
          flows.map((flow) => <FlowItem key={flow.fileHash} {...flow} />)
        ) : (
          <p>No flows available.</p>
        )}
      </div>
    </aside>
  );
}
