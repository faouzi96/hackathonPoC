import "@xyflow/react/dist/style.css";
import FlowGraph from "./features/FlowGraph";
import FlowList from "./features/FlowList";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FlowList />
      <FlowGraph />
    </div>
  );
}

export default App;
