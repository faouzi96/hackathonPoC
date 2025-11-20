import "@xyflow/react/dist/style.css";
import FlowGraph from "./features/FlowGraph";
import FlowList from "./features/FlowList";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <FlowList />
      <FlowGraph />
    </div>
  );
}

export default App;
