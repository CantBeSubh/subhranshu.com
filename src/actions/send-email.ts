"use server";

import ContactFormEmail from "@/emails/contact-form-email";
import { DATA } from "@/data/resume";
import { getErrorMessage, validateString } from "@/lib/utils";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  console.log("[sendEmail] received submission", {
    senderEmail,
    messageLength: typeof message === "string" ? message.length : null,
  });

  if (!validateString(senderEmail, 500)) {
    console.log("[sendEmail] rejected: invalid sender email", { senderEmail });
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(message, 5000)) {
    console.log("[sendEmail] rejected: invalid message");
    return {
      error: "Invalid message",
    };
  }

  let data;
  try {
    console.log("[sendEmail] sending via Resend", { to: DATA.contact.email });
    data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: DATA.contact.email,
      subject: "Message from contact form",
      replyTo: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
      }),
    });
    console.log("[sendEmail] Resend response", data);
  } catch (error: unknown) {
    console.error("[sendEmail] failed to send", error);
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    data,
  };
};
