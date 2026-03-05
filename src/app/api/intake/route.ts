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
        <div style="background-color: #272727; padding: 0; margin: 0; width: 100%;">
          <div style="max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">

            <!-- Header -->
            <div style="padding: 40px 40px 32px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9DF032; margin-bottom: 16px;">Nieuwe intake</div>
              <h1 style="font-size: 28px; font-weight: 400; margin: 0; line-height: 1.2;">${fullName}</h1>
              <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 8px 0 0;">${variantLabel} &middot; ${specialist}</p>
            </div>

            <!-- Details -->
            <div style="padding: 32px 40px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); width: 120px;">Naam</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; color: #ffffff;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4);">E-mail</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px;"><a href="mailto:${email}" style="color: #9DF032; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4);">Telefoon</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px;"><a href="tel:${phone}" style="color: #9DF032; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4);">Doel</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; color: #ffffff;">${doel || '—'}</td>
                </tr>
              </table>
            </div>

            ${answersHtml ? `
            <!-- Verdieping -->
            <div style="padding: 0 40px 32px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); margin-bottom: 16px;">Verdiepingsvragen</div>
              <ul style="margin: 0; padding: 0; list-style: none;">${Object.entries(answers || {}).map(([, value]) => `<li style="padding: 10px 16px; background: rgba(255,255,255,0.05); margin-bottom: 4px; font-size: 14px; color: #ffffff;">${value}</li>`).join('')}</ul>
            </div>
            ` : ''}

            ${extra ? `
            <!-- Extra -->
            <div style="padding: 0 40px 32px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); margin-bottom: 16px;">Extra informatie</div>
              <p style="margin: 0; padding: 16px; background: rgba(255,255,255,0.05); font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6;">${extra}</p>
            </div>
            ` : ''}

            <!-- Footer -->
            <div style="padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.25); margin: 0;">M.A.E. &middot; Move Adapt Evolve</p>
            </div>

          </div>
        </div>
      `,
    });

    // 2. Confirmation email to client
    await resend.emails.send({
      from: `MAE <${fromEmail}>`,
      to: [email],
      subject: 'Welkom bij MAE — we nemen snel contact op',
      html: `
        <div style="background-color: #272727; padding: 0; margin: 0; width: 100%;">
          <div style="max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">

            <!-- Header -->
            <div style="padding: 40px 40px 0;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #9DF032; margin-bottom: 32px;">M.A.E.</div>
            </div>

            <!-- Hero -->
            <div style="padding: 0 40px 32px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <h1 style="font-size: 28px; font-weight: 400; margin: 0 0 12px; line-height: 1.2;">Bedankt ${firstName}!</h1>
              <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 0; line-height: 1.6;">
                We hebben je aanvraag voor ${variantLabel.toLowerCase()} ontvangen.
              </p>
            </div>

            <!-- Steps -->
            <div style="padding: 32px 40px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); margin-bottom: 24px;">Wat kun je verwachten?</div>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 16px; background: rgba(255,255,255,0.05); vertical-align: top; width: 40px;">
                    <span style="font-size: 18px; font-weight: 400; color: #9DF032;">1</span>
                  </td>
                  <td style="padding: 16px; background: rgba(255,255,255,0.05); font-size: 14px; color: #ffffff; line-height: 1.5;">
                    ${specialist} stuurt je binnen 24 uur een persoonlijk bericht via WhatsApp
                  </td>
                </tr>
                <tr><td colspan="2" style="height: 4px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background: rgba(255,255,255,0.05); vertical-align: top; width: 40px;">
                    <span style="font-size: 18px; font-weight: 400; color: #9DF032;">2</span>
                  </td>
                  <td style="padding: 16px; background: rgba(255,255,255,0.05); font-size: 14px; color: #ffffff; line-height: 1.5;">
                    Samen bespreken jullie de beste aanpak voor jouw situatie
                  </td>
                </tr>
                <tr><td colspan="2" style="height: 4px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background: rgba(255,255,255,0.05); vertical-align: top; width: 40px;">
                    <span style="font-size: 18px; font-weight: 400; color: #9DF032;">3</span>
                  </td>
                  <td style="padding: 16px; background: rgba(255,255,255,0.05); font-size: 14px; color: #ffffff; line-height: 1.5;">
                    We plannen een eerste afspraak in — vrijblijvend
                  </td>
                </tr>
              </table>
            </div>

            <!-- Footer -->
            <div style="padding: 24px 40px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.6;">
                Heb je in de tussentijd vragen? Stuur gerust een bericht naar
                <a href="mailto:info@moveadaptevolve.nl" style="color: #9DF032; text-decoration: none;">info@moveadaptevolve.nl</a>
              </p>
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.2); margin: 24px 0 0;">M.A.E. &middot; Move Adapt Evolve</p>
            </div>

          </div>
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
