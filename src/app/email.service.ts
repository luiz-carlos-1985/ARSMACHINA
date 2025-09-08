import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { EMAILJS_CONFIG } from './emailjs.config';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() {
    // Initialize EmailJS with user ID
    emailjs.init(EMAILJS_CONFIG.userID);
  }

  /**
   * Send password recovery email
   */
  async sendPasswordRecoveryEmail(email: string, resetToken: string, resetLink: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: email,
      subject: 'Recuperação de Senha - Ars Machina Consultancy',
      message: `Olá,

Você solicitou a recuperação de senha para sua conta na Ars Machina Consultancy.

Para redefinir sua senha, clique no link abaixo:
${resetLink}

Este link expirará em 24 horas.

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
Equipe Ars Machina Consultancy`,
      reset_token: resetToken,
      reset_link: resetLink
    };

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        'password_recovery_template',
        templateParams
      );
      return result;
    } catch (error) {
      console.error('Error sending password recovery email:', error);
      throw error;
    }
  }

  /**
   * Send email verification email
   */
  async sendEmailVerification(email: string, verificationCode: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: email,
      subject: 'Verificação de Email - Ars Machina Consultancy',
      message: `Olá,

Bem-vindo à Ars Machina Consultancy!

Para verificar seu endereço de email, use o código de verificação abaixo:

Código de Verificação: ${verificationCode}

Digite este código na página de verificação para ativar sua conta.

Se você não se cadastrou em nosso site, ignore este email.

Atenciosamente,
Equipe Ars Machina Consultancy`,
      verification_code: verificationCode
    };

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        'email_verification_template',
        templateParams
      );
      return result;
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(email: string, userName?: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: email,
      subject: 'Bem-vindo à Ars Machina Consultancy!',
      user_name: userName || 'Usuário',
      message: `Olá ${userName || 'Usuário'},

Bem-vindo à Ars Machina Consultancy!

Sua conta foi criada com sucesso e seu email foi verificado.

Você agora pode acessar todos os recursos da nossa plataforma.

Atenciosamente,
Equipe Ars Machina Consultancy`
    };

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        'welcome_template',
        templateParams
      );
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send account deletion confirmation email
   */
  async sendAccountDeletionEmail(email: string, userName?: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: email,
      subject: 'Conta Excluída - Ars Machina Consultancy',
      user_name: userName || 'Usuário',
      message: `Olá ${userName || 'Usuário'},

Sua conta na Ars Machina Consultancy foi excluída com sucesso.

Todos os seus dados foram removidos permanentemente de nossos sistemas.

Se você não solicitou esta exclusão, entre em contato conosco imediatamente.

Obrigado por ter usado nossos serviços.

Atenciosamente,
Equipe Ars Machina Consultancy`
    };

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        'account_deletion_template',
        templateParams
      );
      return result;
    } catch (error) {
      console.error('Error sending account deletion email:', error);
      throw error;
    }
  }
}
