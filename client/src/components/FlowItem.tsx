import type { FlowOverview } from "../types/app.types";

const FlowItem = ({
  flow,
  onClick,
}: {
  flow: FlowOverview;
  onClick: (param: string) => void;
}) => {
  return (
    <div
      key={flow.fileHash}
      className=" w-full px-3 py-2 border-b border-[#00000020] cursor-pointer font-extralight whitespace-nowrap text-ellipsis pt-3"
      title={flow.title + " - " + flow.projectName}
      onClick={() => onClick(flow.fileHash)}
    >
      {flow.title} - {flow.projectName} ({flow.dateTime.slice(0, 10)})
    </div>
  );
};

export default FlowItem;
