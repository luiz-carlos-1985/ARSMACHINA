# 📧 Configuração do Formulário de Contato

## Como configurar para receber emails em contato@arsmachinaconsultancy.com

### ✅ Status Atual
O formulário já está configurado para enviar para `contato@arsmachinaconsultancy.com`, mas precisa de uma das opções abaixo para funcionar:

### 🔧 Opção 1: EmailJS (Recomendado - Gratuito)

1. **Acesse:** https://www.emailjs.com/
2. **Crie uma conta gratuita**
3. **Configure um serviço de email:**
   - Vá em "Email Services"
   - Clique "Add New Service"
   - Escolha "Gmail" ou outro provedor
   - Configure com o email `contato@arsmachinaconsultancy.com`

4. **Crie um template:**
   - Vá em "Email Templates"
   - Clique "Create New Template"
   - Configure:
     ```
     To: contato@arsmachinaconsultancy.com
     Subject: Nova mensagem do site - {{from_name}}
     
     Nome: {{from_name}}
     Email: {{from_email}}
     
     Mensagem:
     {{message}}
     ```

5. **Obtenha as credenciais:**
   - Service ID (ex: service_abc123)
   - Template ID (ex: template_xyz789)
   - Public Key (ex: user_def456)

6. **Atualize o arquivo `src/app/emailjs.config.ts`:**
   ```typescript
   export const EMAILJS_CONFIG = {
     serviceID: 'service_abc123',
     templateID: 'template_xyz789',
     userID: 'user_def456'
   };
   ```

### 🔧 Opção 2: AWS SES (Para produção)

1. **Configure AWS SES** seguindo o guia `AWS_CREDENTIALS_GUIDE.md`
2. **Verifique o email** `contato@arsmachinaconsultancy.com` no AWS SES
3. **Configure as variáveis de ambiente:**
   ```
   AWS_ACCESS_KEY_ID=sua_chave
   AWS_SECRET_ACCESS_KEY=sua_chave_secreta
   ```

### 🧪 Teste

1. **Execute o projeto:** `ng serve`
2. **Acesse:** http://localhost:4200/contact
3. **Preencha e envie o formulário**
4. **Verifique:** O email deve chegar em `contato@arsmachinaconsultancy.com`

### 📱 Funcionalidades Alternativas

Se o email não funcionar, o usuário pode:
- Enviar via WhatsApp
- Abrir cliente de email
- Copiar email para área de transferência

### 🔍 Verificação

Para verificar se está funcionando:
1. Abra o console do navegador (F12)
2. Envie uma mensagem de teste
3. Procure por logs como:
   - "Email sent successfully via EmailJS"
   - "Email sent successfully via AWS SES"

### ❌ Problemas Comuns

**EmailJS não configurado:**
- Mensagem: "EmailJS not configured"
- Solução: Configure as credenciais no `emailjs.config.ts`

**AWS SES não configurado:**
- Mensagem: "AWS SES not configured"
- Solução: Configure as variáveis de ambiente

**Email não verificado:**
- Mensagem: "Email address not verified"
- Solução: Verifique o email no AWS SES ou EmailJS

### 💡 Dica

O sistema já tem fallbacks automáticos:
1. Tenta AWS SES primeiro
2. Se falhar, usa EmailJS
3. Se ambos falharem, mostra opções alternativas

**Status:** ✅ Código pronto - Precisa apenas configurar EmailJS ou AWS SES