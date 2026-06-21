"use client";

import { Loader2Icon, SendIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-32 rounded-full"
    >
      {pending ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <>
          Send
          <SendIcon className="size-3.5" />
        </>
      )}
    </Button>
  );
}
