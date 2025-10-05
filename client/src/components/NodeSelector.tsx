import { useMemo, useState } from "react";
import type { Node } from "@xyflow/react";
import icon from "../assets/flow.svg";

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
    <aside
      style={{
        width: 280,
        padding: 12,
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "20px",
          color: "#000000e0",
          textTransform: "uppercase",
          borderBottom: "1px solid #00000020",
          paddingBottom: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <img
          src={icon}
          alt="Flow Icon"
          style={{
            height: 35,
          }}
        />
        <p>Flow Analyzer</p>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: "8px 10px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          outline: "none",
        }}
      />

      <button
        onClick={onClear}
        style={{
          padding: "6px 8px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          background: selectedId ? "white" : "#f3f4f6",
          cursor: "pointer",
          fontWeight: 400,
        }}
        title="Show the whole graph"
      >
        Show all
      </button>

      <div
        style={{
          overflowY: "auto",

          borderTop: "1px solid #f3f4f6",
          marginTop: 6,
          bottom: 0,
          flex: 1,
        }}
      >
        {filtered.map((n) => {
          const active = n.id === selectedId;
          return (
            <div
              key={n.id}
              onClick={() => onSelect(n.id)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderBottom: "1px solid #f3f4f6",
                cursor: "pointer",
                borderRadius: 6,
                background: active ? "#eef2ff" : "transparent",
                fontWeight: active ? 400 : 200,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              title={nodeLabel(n)}
            >
              {nodeLabel(n)}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
