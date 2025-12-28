import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, explanation, fileName } = req.body;

    if (!email || !explanation) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing");
        return res.status(500).json({ error: 'Email service not configured' });
    }

    try {
        // Generate HTML email content
        const htmlContent = generateEmailHTML(explanation, fileName);

        const { data, error } = await resend.emails.send({
            from: 'ExplainMyMedicalReport <noreply@explainmymedicalreport.com>',
            to: [email],
            subject: `Your Medical Report Explanation - ${fileName || 'Report'}`,
            html: htmlContent,
        });

        if (error) {
            console.error('[Email API] Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        console.log('[Email API] Email sent successfully:', data?.id);
        return res.status(200).json({ success: true, messageId: data?.id });

    } catch (err: any) {
        console.error('[Email API] Error:', err);
        return res.status(500).json({ error: err.message || 'Failed to send email' });
    }
}

function generateEmailHTML(explanation: any, fileName: string): string {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const sectionsHTML = explanation.sections?.map((section: any) => `
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <h3 style="margin: 0 0 8px; color: #1f2937; font-size: 16px;">${section.originalTitle}</h3>
            <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">${section.summary}</p>
        </div>
    `).join('') || '';

    const glossaryHTML = explanation.glossary?.length > 0 ? `
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 32px;">🔬 Key Medical Terms</h2>
        ${explanation.glossary.map((term: any) => `
            <div style="margin-bottom: 12px;">
                <strong style="color: #1f2937;">${term.term}</strong>
                <span style="color: #6b7280; font-size: 12px;"> [${term.category}]</span>
                <p style="margin: 4px 0 0; color: #4b5563; font-size: 14px;">${term.definition}</p>
            </div>
        `).join('')}
    ` : '';

    const questionsHTML = explanation.questions?.length > 0 ? `
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 32px;">❓ Questions for Your Clinician</h2>
        <p style="color: #6b7280; font-size: 12px; margin-bottom: 16px;">These suggested questions can help you discuss your results with your doctor.</p>
        ${explanation.questions.map((q: any, i: number) => `
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin-bottom: 8px;">
                <p style="margin: 0; color: #1e40af; font-weight: 600;">${i + 1}. "${q.question}"</p>
                <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px; font-style: italic;">Context: ${q.context}</p>
            </div>
        `).join('')}
    ` : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Medical Report Explanation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px;">ExplainMyMedicalReport</h1>
            <p style="margin: 8px 0 0; color: #dbeafe; font-size: 14px;">Your Medical Report Explained in Plain English</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
            <!-- Meta Info -->
            <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>Report:</strong> ${fileName || 'Medical Report'}<br>
                    <strong>Type:</strong> ${explanation.reportType?.toUpperCase() || 'General'}<br>
                    <strong>Generated:</strong> ${date}
                </p>
            </div>

            <!-- Disclaimer -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-bottom: 24px;">
                <p style="margin: 0; color: #92400e; font-size: 12px;">
                    ⚠️ ${explanation.disclaimer || 'This is for educational purposes only. Not medical advice.'}
                </p>
            </div>

            <!-- Summary -->
            <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📋 Summary</h2>
            <p style="color: #374151; font-size: 15px; line-height: 1.7;">${explanation.summary}</p>

            <!-- Sections -->
            <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 32px;">📖 Detailed Breakdown</h2>
            ${sectionsHTML}

            ${glossaryHTML}
            ${questionsHTML}
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
                This email was sent by <a href="https://explainmymedicalreport.com" style="color: #3b82f6;">ExplainMyMedicalReport</a>
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                This tool explains medical language in plain terms. It does not provide medical advice.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}
