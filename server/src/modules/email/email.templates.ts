export class EmailTemplates {
  constructor(private frontendUrl: string) {}

  verifyEmail(firstName: string, token: string) {
    const link = `${this.frontendUrl}/auth/verify-email?token=${token}`;
    return {
      subject: 'Verify your Downwork account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Downwork, ${firstName}!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">
            Verify Email
          </a>
          <p style="margin-top:16px;color:#666;">Or copy this link: ${link}</p>
          <p style="color:#999;font-size:12px;">This link expires in 24 hours.</p>
        </div>
      `,
      text: `Welcome to Downwork, ${firstName}! Verify your email: ${link}`,
    };
  }

  resetPassword(firstName: string, token: string) {
    const link = `${this.frontendUrl}/auth/reset-password?token=${token}`;
    return {
      subject: 'Reset your Downwork password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${firstName}, we received a request to reset your password.</p>
          <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
          <p style="margin-top:16px;color:#666;">Or copy this link: ${link}</p>
          <p style="color:#999;font-size:12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
      text: `Hi ${firstName}, reset your password: ${link}`,
    };
  }

  emailChanged(firstName: string, token: string) {
    const link = `${this.frontendUrl}/auth/verify-email?token=${token}`;
    return {
      subject: 'Verify your new email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Changed</h2>
          <p>Hi ${firstName}, please verify your new email address:</p>
          <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">
            Verify New Email
          </a>
        </div>
      `,
      text: `Hi ${firstName}, verify your new email: ${link}`,
    };
  }
}
