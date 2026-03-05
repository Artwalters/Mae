import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface IntakeBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extra: string;
  variant: 'fysio' | 'leefstijl';
  doel: string;
  answers: Record<number, string>;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body: IntakeBody = await request.json();

    const { firstName, lastName, email, phone, extra, variant, doel, answers } = body;

    // Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres.' },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`;
    const variantLabel = variant === 'fysio' ? 'Fysiotherapie' : 'Leefstijlcoaching';
    const specialist = variant === 'fysio' ? 'Maarten' : 'Merel';

    // Format answers for display
    const answersHtml = Object.entries(answers || {})
      .map(([, value]) => `<li>${value}</li>`)
      .join('');

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@moveadaptevolve.nl';
    const toEmail = process.env.RESEND_TO_EMAIL || 'info@moveadaptevolve.nl';

    // 1. Notification email to MAE
    await resend.emails.send({
      from: `MAE Intake <${fromEmail}>`,
      to: [toEmail],
      subject: `Nieuwe intake: ${fullName} — ${variantLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h1 style="font-size: 20px; margin-bottom: 24px;">Nieuwe intake aanvraag</h1>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Naam</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold;">E-mail</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold;">Telefoon</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold;">Type</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${variantLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold;">Specialist</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${specialist}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold;">Doel</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${doel || '—'}</td>
            </tr>
          </table>

          ${answersHtml ? `
          <h2 style="font-size: 16px; margin-bottom: 12px;">Verdiepingsvragen</h2>
          <ul style="margin: 0 0 24px; padding-left: 20px;">${answersHtml}</ul>
          ` : ''}

          ${extra ? `
          <h2 style="font-size: 16px; margin-bottom: 12px;">Extra informatie</h2>
          <p style="margin: 0; padding: 12px; background: #f5f5f5; border-radius: 6px;">${extra}</p>
          ` : ''}
        </div>
      `,
    });

    // 2. Confirmation email to client
    await resend.emails.send({
      from: `MAE <${fromEmail}>`,
      to: [email],
      subject: 'Welkom bij MAE — we nemen snel contact op',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h1 style="font-size: 22px; margin-bottom: 8px;">Bedankt ${firstName}!</h1>
          <p style="font-size: 16px; color: #555; margin-bottom: 32px;">
            We hebben je aanvraag voor ${variantLabel.toLowerCase()} ontvangen.
          </p>

          <h2 style="font-size: 16px; margin-bottom: 16px;">Wat kun je verwachten?</h2>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <tr>
              <td style="padding: 12px; vertical-align: top; width: 32px; font-weight: bold; color: #888;">1</td>
              <td style="padding: 12px;">
                ${specialist} stuurt je binnen 24 uur een persoonlijk bericht via WhatsApp
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; vertical-align: top; width: 32px; font-weight: bold; color: #888;">2</td>
              <td style="padding: 12px;">
                Samen bespreken jullie de beste aanpak voor jouw situatie
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; vertical-align: top; width: 32px; font-weight: bold; color: #888;">3</td>
              <td style="padding: 12px;">
                We plannen een eerste afspraak in — vrijblijvend
              </td>
            </tr>
          </table>

          <p style="font-size: 14px; color: #888;">
            Heb je in de tussentijd vragen? Stuur gerust een bericht naar
            <a href="mailto:info@moveadaptevolve.nl" style="color: #1a1a1a;">info@moveadaptevolve.nl</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Intake API error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het versturen. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}
