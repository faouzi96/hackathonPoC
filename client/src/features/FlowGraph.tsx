import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  ReactFlowProvider,
  type OnNodesChange,
  MarkerType,
  useEdgesState,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeSelector from "../components/NodeSelector";
import ViewTitle from "../components/ViewTitle";

const {
  nodes: initialNodes,
  edges: initialEdges,
  title,
} = window.GRAPH_DATA.graph;

const metadata = window.GRAPH_DATA.metadata;

const DEFAULT_COLOR = "#333";
const HOVER_COLOR = "red";

const baseMarker = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
} as const;

type RawEdge = Omit<Edge, "style" | "markerEnd"> & {};

function decorateEdges(raw: RawEdge[]): Edge[] {
  return raw.map((e) => ({
    ...e,
    style: { stroke: DEFAULT_COLOR, strokeWidth: 2 },
    markerEnd: { ...baseMarker, color: DEFAULT_COLOR },
  }));
}

/** --- descendants helper --- **/
function buildAdjacency(edges: Pick<Edge, "source" | "target">[]) {
  const m = new Map<string, string[]>();
  for (const e of edges) {
    if (!m.has(e.source)) m.set(e.source, []);
    m.get(e.source)!.push(e.target);
  }
  return m;
}

function getDescendants(
  rootId: string,
  edges: Pick<Edge, "source" | "target">[],
) {
  const adj = buildAdjacency(edges);
  const visited = new Set<string>();
  const stack = [rootId];
  while (stack.length) {
    const cur = stack.pop()!;
    const children = adj.get(cur) ?? [];
    for (const c of children) {
      if (!visited.has(c)) {
        visited.add(c);
        stack.push(c);
      }
    }
  }
  return visited; // root not included
}

const FlowGraph = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [rawEdges, setRawEdges] = useState<RawEdge[]>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]); // uncontrolled via hook

  const [filterRootId, setFilterRootId] = useState<string | null>(null);
  const [rf, setRf] = useState<ReactFlowInstance | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((snap) => applyNodeChanges(changes, snap)),
    [],
  );

  useEffect(() => {
    setRawEdges(initialEdges);
  }, []);

  useEffect(() => {
    if (rawEdges.length) setEdges(decorateEdges(rawEdges));
  }, [rawEdges, setEdges]);

  /** keep your hover-highlighting behavior */
  const applyHighlight = useCallback(
    (nodeId: string | null) => {
      setEdges((eds) =>
        eds.map((e) => {
          const isOutgoing = nodeId != null && e.source === nodeId;
          const color = isOutgoing ? HOVER_COLOR : DEFAULT_COLOR;
          return {
            ...e,
            style: { ...(e.style ?? {}), stroke: color },
            markerEnd: {
              ...((e.markerEnd as object) ?? baseMarker),
              ...baseMarker,
              color,
            },
          };
        }),
      );
    },
    [setEdges],
  );

  const onNodeMouseEnter = useCallback(
    (_e: React.MouseEvent, node: Node) => applyHighlight(node.id),
    [applyHighlight],
  );
  const onNodeMouseLeave = useCallback(
    () => applyHighlight(null),
    [applyHighlight],
  );
  const onPaneMouseLeave = useCallback(
    () => applyHighlight(null),
    [applyHighlight],
  );

  /** --- compute the visible subset --- **/
  const { displayNodes, displayEdges } = useMemo(() => {
    if (!filterRootId) return { displayNodes: nodes, displayEdges: edges };
    const desc = getDescendants(filterRootId, edges);
    const visible = new Set<string>([filterRootId, ...desc]);
    return {
      displayNodes: nodes.filter((n) => visible.has(n.id)),
      displayEdges: edges.filter(
        (e) => visible.has(e.source) && visible.has(e.target),
      ),
    };
  }, [nodes, edges, filterRootId]);

  /** Fit to the currently visible nodes */
  useEffect(() => {
    if (rf && displayNodes.length) {
      rf.fitView({
        nodes: displayNodes,
        includeHiddenNodes: false,
        padding: 0.2,
      });
    }
  }, [rf, displayNodes]);

  return (
    <>
      <ViewTitle title={title} metadata={metadata} />
      <ReactFlowProvider>
        <div className="flex flex-1 min-h-0">
          {/* LEFT SIDEBAR: separate file */}
          <NodeSelector
            nodes={nodes}
            selectedId={filterRootId}
            onSelect={setFilterRootId}
            onClear={() => setFilterRootId(null)}
          />
          {/* CANVAS */}
          <div className="flex-1">
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              onNodesChange={onNodesChange}
              // onEdgesChange stays managed by useEdgesState hook; no need to pass applyEdgeChanges manually
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onPaneMouseLeave={onPaneMouseLeave}
              fitView
              onInit={setRf}
              style={{ background: "#00000010" }}
            />
          </div>
        </div>
      </ReactFlowProvider>
    </>
  );
};

export default FlowGraph;
