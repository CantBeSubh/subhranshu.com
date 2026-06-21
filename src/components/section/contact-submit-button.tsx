"use client";

import { Loader2Icon, SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SubmitBtn({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="h-11 w-32 rounded-full">
      {isPending ? (
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
