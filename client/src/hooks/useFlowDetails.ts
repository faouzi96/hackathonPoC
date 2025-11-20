import { useQuery } from "@tanstack/react-query";
import ApiRepository from "../api/ApiRepository";

export function useFlowDetails(fileHash: string) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["flowDetails", fileHash],
    queryFn: () => ApiRepository.getFlowDetails(fileHash),
    enabled: !!fileHash,
  });

  return { data, isLoading, isSuccess };
}
