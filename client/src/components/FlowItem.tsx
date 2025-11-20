import type { FlowOverview } from "../features/FlowList";

const FlowItem = ({ ...flow }: FlowOverview) => {
  return (
    <div
      key={flow.fileHash}
      className=" w-full px-3 py-2 border-b border-[#00000020] cursor-pointer font-extralight whitespace-nowrap text-ellipsis pt-3"
      title={flow.title + " - " + flow.projectName}
    >
      {flow.title} - {flow.projectName} ({flow.dateTime.slice(0, 10)})
    </div>
  );
};

export default FlowItem;
