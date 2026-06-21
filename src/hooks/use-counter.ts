"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCounter,
  incrementLikeCount,
  incrementVisitCount,
  type Counter,
} from "@/actions/count";

export const counterQueryKey = ["counter"] as const;

export function useCounterQuery(initialData: Counter) {
  return useQuery({
    queryKey: counterQueryKey,
    queryFn: getCounter,
    initialData,
  });
}

export function useLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementLikeCount,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: counterQueryKey });
      const previous = queryClient.getQueryData<Counter>(counterQueryKey);
      if (previous) {
        queryClient.setQueryData<Counter>(counterQueryKey, {
          ...previous,
          likeCount: previous.likeCount + 1,
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(counterQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: counterQueryKey });
    },
  });
}

export function useVisitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementVisitCount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counterQueryKey });
    },
  });
}
