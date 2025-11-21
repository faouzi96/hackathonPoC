import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ApiRepository from "../api/ApiRepository";

export function useDeleteFlow() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (fileHash: string) => ApiRepository.deleteFlow(fileHash),
    onSuccess: () => {
      toast.success("Flow Graph deleted");
      // trigger a refetch for the flows list
      queryClient.invalidateQueries({ queryKey: ["flowList"] });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  return {
    deleteFlow: mutation.mutate,
    deleteFlowAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
}

export default useDeleteFlow;
