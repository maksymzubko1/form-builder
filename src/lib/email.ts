import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type SendMailParams = {
  to: string;
  templateId: string;
  dynamicTemplateData: Record<string, unknown>;
};

type SendConfirmationParams = {
  to: string;
  confirmUrl: string;
}

type SendResetParams = {
  to: string;
  resetUrl: string;
}

export async function sendConfirmationMail({to, confirmUrl}: SendConfirmationParams) {
  if (!process.env.SENDGRID_CONFIRMATION_TEMPLATE) {
    throw new Error('SENDGRID_CONFIRMATION_TEMPLATE not set');
  }

  await sendMail({to, dynamicTemplateData: {confirmUrl}, templateId: process.env.SENDGRID_CONFIRMATION_TEMPLATE})
}

export async function sendResetMail({to, resetUrl}: SendResetParams) {
  if (!process.env.SENDGRID_RESET_TEMPLATE) {
    throw new Error('SENDGRID_RESET_TEMPLATE not set');
  }

  await sendMail({to, dynamicTemplateData: {resetUrl}, templateId: process.env.SENDGRID_RESET_TEMPLATE})
}

async function sendMail({ to, templateId, dynamicTemplateData }: SendMailParams) {
  // if (process.env.NODE_ENV !== 'production') {
  //   // В dev просто логируем
  //   console.log('[MOCK EMAIL]', { to, templateId, dynamicTemplateData });
  //   return;
  // }
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('SENDGRID_API_KEY or EMAIL_FROM not set');
  }
  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM,
    templateId,
    dynamicTemplateData,
  });
}