"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/actions/send-email";
import SubmitBtn from "./contact-submit-button";
import { toast } from "sonner";

export default function ContactSection() {
  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Get in Touch
        </h2>
        <form
          className="mt-4 flex w-full max-w-md flex-col gap-3"
          action={async (formData: FormData) => {
            const { error } = await sendEmail(formData);

            if (error) {
              toast.error(error);
              return;
            }

            toast.success("Email sent successfully!");
          }}
        >
          <Input
            name="senderEmail"
            type="email"
            required
            maxLength={500}
            placeholder="Your email"
          />
          <Textarea
            name="message"
            required
            maxLength={5000}
            placeholder="Your message"
            className="min-h-32"
          />
          <SubmitBtn />
        </form>
      </div>
    </div>
  );
}
