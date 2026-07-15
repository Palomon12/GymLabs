import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ReminderEmail } from '@/emails/ReminderEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nombreCliente, diasRestantes, emailDestino } = await request.json();

    // Nota de limitación: En el plan gratuito de Resend, solo puedes enviar desde onboarding@resend.dev
    // Además, solo puedes enviar hacia tu correo verificado de la cuenta (sarangojosue6@gmail.com).
    const toEmail = "sarangojosue6@gmail.com"; 
    // En producción con dominio verificado sería: const toEmail = emailDestino;

    const data = await resend.emails.send({
      from: 'GymLabs <onboarding@resend.dev>',
      to: [toEmail], 
      subject: diasRestantes <= 0 ? 'Tu membresía ha vencido - GymLabs' : 'Aviso de vencimiento - GymLabs',
      react: ReminderEmail({ nombreCliente, diasRestantes }),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "No se pudo enviar el correo" }, { status: 500 });
  }
}
