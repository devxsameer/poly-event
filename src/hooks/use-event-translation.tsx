"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { translateEventAction } from "@/features/events/event.actions";
import { EventWithResolvedTranslation } from "@/features/events/event.types";

export function useEventTranslation({
  eventId,
  locale,
  shouldTranslate,
  initialData,
}: {
  eventId: string;
  locale: string;
  shouldTranslate: boolean;
  initialData: EventWithResolvedTranslation;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["event", eventId, locale],
    queryFn: async () => initialData,
    initialData,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () => translateEventAction({ eventId, targetLocale: locale }),

    onSuccess: (translated) => {
      queryClient.setQueryData(["event", eventId, locale], (old: any) => ({
        ...old,
        translation: {
          translated_title: translated.title,
          translated_description: translated.description,
          status: "completed",
        },
      }));
    },
  });

  useEffect(() => {
    if (shouldTranslate && !mutation.isPending && !mutation.isSuccess) {
      mutation.mutate();
    }
  }, [shouldTranslate]);

  return { event: query.data, mutation };
}
