import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import dowloadIcon from "../assets/download.svg";

function downloadImage(dataUrl: string, title: string) {
  const a = document.createElement("a");

  a.setAttribute("download", title);
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

const DownloadFlow = ({
  isVisible,
  title,
}: {
  isVisible: boolean;
  title: string;
}) => {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0
    );

    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "#ffffff",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then((url) => downloadImage(url, title));
  };

  if (!isVisible) return;

  return (
    <div
      className={`w-13 h-13 absolute right-[550px] top-2.5 inline-flex items-center gap-3 border border-gray-200 bg-white px-3 py-2 rounded-full shadow-sm text-sm`}
      role="group"
      aria-label="Graph options"
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex w-full justify-center items-center gap-2 rounded-md border border-transparent cursor-pointer z-10`}
        title="Download"
      >
        <img
          src={dowloadIcon}
          alt="Show/Hide"
          style={{
            height: "50px",
            width: "50px",
          }}
        />
      </button>
    </div>
  );
};

export default DownloadFlow;
