import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { EMAILJS_CONFIG } from './emailjs.config';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() {
    // Initialize EmailJS only if enabled and configured
    if (EMAILJS_CONFIG.enabled && EMAILJS_CONFIG.userID !== 'your_public_key_here') {
      emailjs.init(EMAILJS_CONFIG.userID);
    }
  }

  /**
   * Check if EmailJS is properly configured
   */
  private isEmailJSConfigured(): boolean {
    return EMAILJS_CONFIG.enabled && 
           EMAILJS_CONFIG.userID !== 'your_public_key_here' &&
           EMAILJS_CONFIG.serviceID !== 'service_your_service_id' &&
           EMAILJS_CONFIG.userID.length > 5 &&
           EMAILJS_CONFIG.serviceID.length > 5;
  }

  /**
   * Send password recovery email
   */
  async sendPasswordRecoveryEmail(email: string, resetToken: string, resetLink: string): Promise<EmailJSResponseStatus> {
    if (!this.isEmailJSConfigured()) {
      console.log('📧 EmailJS not configured - simulating password recovery email for:', email);
      throw new Error('EmailJS not configured for development');
    }

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
    console.log('📧 Sending verification email to:', email, 'Code:', verificationCode);
    
    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0],
      from_name: 'Ars Machina Consultancy',
      subject: 'Código de Verificação',
      message: `Seu código de verificação é: ${verificationCode}`,
      verification_code: verificationCode
    };

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams,
        EMAILJS_CONFIG.userID
      );
      console.log('✅ Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(email: string, userName?: string): Promise<EmailJSResponseStatus> {
    if (!this.isEmailJSConfigured()) {
      console.log('📧 EmailJS not configured - simulating welcome email for:', email, 'User:', userName);
      throw new Error('EmailJS not configured for development');
    }

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
  async sendAccountDeletionEmail(email: string, userName?: string): Promise<any> {
    console.log('📧 Sending account deletion email to:', email);
    
    // Fallback email sending using mailto or direct notification
    const subject = 'Conta Excluída - Ars Machina Consultancy';
    const body = `Olá ${userName || 'Usuário'},

Sua conta na Ars Machina Consultancy foi excluída com sucesso.

Todos os seus dados foram processados conforme solicitado.

Se você não solicitou esta exclusão, entre em contato conosco imediatamente.

Obrigado por ter usado nossos serviços.

Atenciosamente,
Equipe Ars Machina Consultancy`;
    
    try {
      // Try FormSubmit as fallback
      const formData = new FormData();
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', body);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      
      const response = await fetch('https://formsubmit.co/contato@arsmachinaconsultancy.com', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        console.log('✅ Account deletion email sent via FormSubmit');
        return { success: true, method: 'FormSubmit' };
      }
    } catch (error) {
      console.warn('⚠️ FormSubmit failed, using mailto fallback');
    }
    
    // Final fallback: open mailto
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    
    console.log('✅ Account deletion notification opened via mailto');
    return { success: true, method: 'mailto' };
  }
}
