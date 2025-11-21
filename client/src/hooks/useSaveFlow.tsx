import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ApiRepository from "../api/ApiRepository";

export default function useSaveFlow() {
  const queryClient = useQueryClient();

  const { mutate, isPending, data } = useMutation({
    mutationKey: ["save"],
    mutationFn: ApiRepository.saveFlow,
    onSuccess: () => {
      toast.success("Flow successfully saved!");
      queryClient.invalidateQueries({ queryKey: ["flowList"] });
    },
    onError: () => {
      toast.error("Failed to save flow");
    },
  });

  return {
    saveFlow: mutate,
    pending: isPending,
    hashedName: data?.hashedName,
  };
}
