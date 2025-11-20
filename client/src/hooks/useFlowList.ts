import { useQuery } from "@tanstack/react-query";
import ApiRepository from "../api/ApiRepository";

export function useFlowList() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["flowList"],
    queryFn: ApiRepository.getFlowList,
  });

  return { data, isLoading, isSuccess };
}
