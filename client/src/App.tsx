import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  ReactFlowProvider,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ViewTitle from "./components/ViewTitle";

const { nodes: initialNodes, edges, title } = window.GRAPH_DATA;

function App() {
  const [nodes, setNodes] = useState(initialNodes);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ViewTitle title={title} />
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          fitView
        />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
