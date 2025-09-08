import { Injectable } from '@angular/core';

// AWS SDK v3 imports
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { AWS_CONFIG, isDevelopmentMode } from './aws.config';

@Injectable({
  providedIn: 'root'
})
export class AwsEmailService {
  private sesClient: SESClient | null = null;

  constructor() {
    // Only initialize AWS SES client if credentials are available
    if (!isDevelopmentMode()) {
      const { accessKeyId, secretAccessKey } = AWS_CONFIG.credentials;
      
      // Ensure credentials are strings before creating client
      if (accessKeyId && secretAccessKey) {
        this.sesClient = new SESClient({
          region: AWS_CONFIG.region,
          credentials: {
            accessKeyId,
            secretAccessKey
          }
        });
      }
    }
  }

  /**
   * Send contact form email using AWS SES
   */
  async sendContactEmail(formData: {
    name: string;
    email: string;
    message: string;
  }): Promise<boolean> {
    if (!this.sesClient) {
      throw new Error('AWS SES not configured. Please set up AWS credentials.');
    }

    try {
      const params = {
        Source: AWS_CONFIG.email.sourceEmail,
        Destination: {
          ToAddresses: ['contato@arsmachinaconsultancy.com']
        },
        Message: {
          Subject: {
            Data: `Novo contato via site - ${formData.name}`,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: `
                <html>
                  <body>
                    <h2>Nova mensagem de contato</h2>
                    <p><strong>Nome:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Mensagem:</strong></p>
                    <p>${formData.message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Enviado através do site Ars Machina Consultancy</small></p>
                  </body>
                </html>
              `,
              Charset: 'UTF-8'
            },
            Text: {
              Data: `
Nova mensagem de contato

Nome: ${formData.name}
Email: ${formData.email}

Mensagem:
${formData.message}

---
Enviado através do site Ars Machina Consultancy
              `,
              Charset: 'UTF-8'
            }
          }
        },
        ReplyToAddresses: [formData.email]
      };

      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);
      
      console.log('Email sent successfully:', result.MessageId);
      return true;
    } catch (error) {
      console.error('Error sending email via AWS SES:', error);
      throw error;
    }
  }

  /**
   * Send auto-reply email to the contact form sender
   */
  async sendAutoReply(formData: {
    name: string;
    email: string;
    message: string;
  }): Promise<boolean> {
    if (!this.sesClient) {
      console.warn('AWS SES not configured, skipping auto-reply');
      return false;
    }

    try {
      const params = {
        Source: AWS_CONFIG.email.sourceEmail,
        Destination: {
          ToAddresses: [formData.email]
        },
        Message: {
          Subject: {
            Data: 'Recebemos sua mensagem - Ars Machina Consultancy',
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: `
                <html>
                  <body>
                    <h2>Obrigado por entrar em contato!</h2>
                    <p>Olá ${formData.name},</p>
                    <p>Recebemos sua mensagem e entraremos em contato em breve.</p>
                    
                    <h3>Sua mensagem:</h3>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                      ${formData.message.replace(/\n/g, '<br>')}
                    </div>
                    
                    <p>Tempo de resposta estimado: <strong>24 horas</strong></p>
                    
                    <p>Atenciosamente,<br>
                    Equipe Ars Machina Consultancy</p>
                    
                    <hr>
                    <p><small>
                      📧 Email: ${AWS_CONFIG.email.sourceEmail}<br>
                      📱 WhatsApp: +55 98 99964-9215<br>
                      🌐 Site: www.arsmachinaconsultancy.com
                    </small></p>
                  </body>
                </html>
              `,
              Charset: 'UTF-8'
            },
            Text: {
              Data: `
Obrigado por entrar em contato!

Olá ${formData.name},

Recebemos sua mensagem e entraremos em contato em breve.

Sua mensagem:
${formData.message}

Tempo de resposta estimado: 24 horas

Atenciosamente,
Equipe Ars Machina Consultancy

---
📧 Email: ${AWS_CONFIG.email.sourceEmail}
📱 WhatsApp: +55 98 99964-9215
🌐 Site: www.arsmachinaconsultancy.com
              `,
              Charset: 'UTF-8'
            }
          }
        }
      };

      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);
      
      console.log('Auto-reply sent successfully:', result.MessageId);
      return true;
    } catch (error) {
      console.error('Error sending auto-reply via AWS SES:', error);
      // Don't throw error for auto-reply failures
      return false;
    }
  }

  /**
   * Check if AWS SES is properly configured
   */
  isConfigured(): boolean {
    return !isDevelopmentMode() && this.sesClient !== null;
  }

  /**
   * Get setup instructions for AWS SES
   */
  getSetupInstructions(): string {
    return `
🔧 Para configurar o AWS SES:

1. Crie uma conta AWS e acesse o SES (Simple Email Service)
2. Verifique seu domínio ou email no SES
3. Crie um usuário IAM com permissões SES
4. Obtenha Access Key ID e Secret Access Key
5. Configure as variáveis de ambiente:
   - AWS_ACCESS_KEY_ID=sua_chave_aqui
   - AWS_SECRET_ACCESS_KEY=sua_chave_secreta_aqui
6. Atualize o email de origem em aws.config.ts

Atualmente em modo de desenvolvimento (simulação).
    `;
  }
}
