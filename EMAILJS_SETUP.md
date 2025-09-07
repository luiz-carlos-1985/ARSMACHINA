# 🚨 **IMPORTANTE: EmailJS NÃO ESTÁ CONFIGURADO!**
# Configuração do EmailJS para Formulário de Contato

**Status: ❌ NÃO CONFIGURADO** - Os emails não serão enviados até que você complete esta configuração.

## ⚠️ Problema Atual
O formulário de contato está usando credenciais placeholder que não funcionam. Você precisa configurar o EmailJS para que os emails sejam enviados para `contato@arsmachinaconsultancy.com`.

## 📋 Passos para Configuração (OBRIGATÓRIOS)

### 1. Criar Conta no EmailJS
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Verifique seu email de confirmação

### 2. Configurar Serviço de Email
1. No painel do EmailJS, clique em **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha seu provedor de email (Gmail, Outlook, Yahoo, etc.)
4. Configure as credenciais do seu email:
   - **Email**: contato@arsmachinaconsultancy.com
   - **Password**: Sua senha do email
5. Clique em **"Connect Account"**
6. **Salve o Service ID** (exemplo: `service_abc123def`)

### 3. Criar Template de Email
1. Clique em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure o template com estes campos EXATOS:
   - **Template Name**: `Ars Machina Contact Form`
   - **Subject**: `Nova mensagem do site - {{from_name}}`
   - **To Email**: `contato@arsmachinaconsultancy.com`
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Reply To**: `{{from_email}}`
   - **Message**:
     ```
     📧 NOVA MENSAGEM DO SITE ARS MACHINA CONSULTANCY

     👤 Nome: {{from_name}}
     📧 Email: {{from_email}}

     💬 Mensagem:
     {{message}}

     ---
     Esta mensagem foi enviada através do formulário de contato do site.
     ```
4. Clique em **"Save"**
5. **Salve o Template ID** (exemplo: `template_xyz789`)

### 4. Obter User ID (Public Key)
1. No painel principal, clique em **"Account"**
2. Na seção **"General"**, copie o **"Public Key"**
3. **Salve o User ID** (exemplo: `user_ABC123DEF456`)

### 5. ⚡ Atualizar Configuração no Projeto
1. Abra o arquivo `src/app/emailjs.config.ts`
2. **Substitua COMPLETAMENTE** os valores pelos IDs obtidos:
   ```typescript
   export const EMAILJS_CONFIG = {
     serviceID: 'service_abc123def',        // ← SEU SERVICE ID AQUI
     templateID: 'template_xyz789',        // ← SEU TEMPLATE ID AQUI
     userID: 'user_ABC123DEF456'           // ← SUA PUBLIC KEY AQUI
   };
   ```

## 🧪 Teste da Configuração
1. Execute o projeto: `ng serve`
2. Acesse `http://localhost:4200/contact`
3. Preencha o formulário com dados de teste
4. Clique em **"Enviar"**
5. ✅ Deve aparecer: "Mensagem enviada com sucesso!"
6. ❌ Se aparecer erro sobre configuração, verifique os IDs

## 📧 Verificação
- ✅ **Email recebido** em `contato@arsmachinaconsultancy.com`
- ✅ **Assunto correto** com nome do remetente
- ✅ **Todos os campos** preenchidos corretamente

## 📊 Limites da Conta Gratuita
- **200 emails por mês**
- **1 serviço de email**
- **2 templates**
- **50KB por email**

💡 **Dica**: Para mais emails, considere fazer upgrade do plano pago.

## 🚨 Troubleshooting
- **Erro 400**: Campos obrigatórios não preenchidos
- **Erro 401**: Credenciais inválidas - verifique os IDs
- **Erro 429**: Muitas tentativas - aguarde alguns minutos
- **Email não chega**: Verifique spam/junk folder

---
**IMPORTANTE**: Não continue sem configurar o EmailJS. Os usuários não conseguirão entrar em contato através do site!
