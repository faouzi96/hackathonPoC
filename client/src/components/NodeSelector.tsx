import { useMemo, useState } from "react";
import type { Node } from "@xyflow/react";

type Props = {
  nodes: Node[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  placeholder?: string;
};

function nodeLabel(n: Node): string {
  return (n.data?.label as string) ?? n.id;
}

export default function NodeSelector({
  nodes,
  selectedId,
  onSelect,
  onClear,
  placeholder = "Nodes Filter…",
}: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return nodes;
    return nodes.filter((n) => nodeLabel(n).toLowerCase().includes(s));
  }, [nodes, q]);

  return (
    <div className="w-[280px] h-[65%] p-3 border-r border-gray-200 bg-white flex flex-col gap-2 absolute right-5 bottom-[1%] z-10 rounded-[15px] shadow-lg">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="px-2.5 py-2 border border-gray-300 rounded-lg outline-none"
      />

      <button
        onClick={onClear}
        className={`px-2 py-1.5 rounded-lg border border-gray-300 cursor-pointer font-normal ${
          selectedId ? "bg-white" : "bg-gray-100"
        }`}
        title="Show the whole graph"
      >
        Show all
      </button>

      <div className="overflow-y-auto border-t border-gray-100 mt-1 flex-1">
        {filtered.map((n) => {
          const active = n.id === selectedId;
          return (
            <div
              key={n.id}
              onClick={() => onSelect(n.id)}
              className={`w-full px-2.5 py-2 border-b border-gray-100 cursor-pointer rounded-md whitespace-nowrap text-ellipsis ${
                active
                  ? "bg-indigo-100 font-normal"
                  : "bg-transparent font-extralight"
              }`}
              title={nodeLabel(n)}
            >
              {nodeLabel(n)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
