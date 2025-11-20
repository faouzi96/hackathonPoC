import "@xyflow/react/dist/style.css";
import FlowGraph from "./features/FlowGraph";
import FlowList from "./features/FlowList";
import { useState } from "react";
import { useFlowDetails } from "./hooks/useFlowDetails";
import BackdropLoader from "./components/BackdropLoader";

function App() {
  const [selectedFlow, setSelectedFlow] = useState<string>("");
  const { data, isLoading } = useFlowDetails(selectedFlow);
  return (
    <div className="w-screen h-screen flex flex-col">
      <FlowList setSelectedFlow={setSelectedFlow} />
      <BackdropLoader show={isLoading} />
      <FlowGraph data={data} />
    </div>
  );
}

export default App;
