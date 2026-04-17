// src/app/api/contact/route.ts
// Simple contact handler. In production, wire up Resend / Nodemailer / Sendgrid.
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // ─── TODO: wire up your email provider ─────────────────
    // Example with Resend (https://resend.com):
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "portfolio@yourdomain.com",
    //   to: "your@email.com",
    //   subject: `Portfolio contact from ${data.name}`,
    //   html: `<p><strong>${data.name}</strong> (${data.email})</p><p>${data.message}</p>`,
    // });
    // ────────────────────────────────────────────────────────

    console.log("[Contact Form]", data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
