"use client";

import { useMutation } from "@tanstack/react-query";
import { sendEmail } from "@/actions/send-email";

export function useSendEmailMutation() {
  return useMutation({
    mutationKey: ["sendEmail"],
    mutationFn: sendEmail,
  });
}
