import "@xyflow/react/dist/style.css";
import { Bounce, ToastContainer } from "react-toastify";
import FlowGraph from "./features/FlowGraph";
import FlowList from "./features/FlowList";
import { useEffect, useState } from "react";
import { useFlowDetails } from "./hooks/useFlowDetails";
import BackdropLoader from "./components/BackdropLoader";
import useDeleteFlow from "./hooks/useDeleteFlow";
import useSaveFlow from "./hooks/useSaveFlow";

function App() {
  const [selectedFlow, setSelectedFlow] = useState<string>("");
  const { data, isLoading } = useFlowDetails(selectedFlow);
  const { isPending, deleteFlow, isSuccess } = useDeleteFlow();
  const { saveFlow, pending: isSaving, hashedName } = useSaveFlow();

  useEffect(() => {
    if (hashedName) setSelectedFlow(hashedName);
  }, [hashedName]);

  useEffect(() => {
    if (isSuccess) setSelectedFlow("");
  }, [isSuccess]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <FlowList setSelectedFlow={setSelectedFlow} />
      <BackdropLoader show={isLoading || isPending || isSaving} />
      <FlowGraph
        data={data}
        onDelete={() => deleteFlow(selectedFlow)}
        onSave={saveFlow}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
