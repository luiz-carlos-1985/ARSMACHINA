# Configuração do EmailJS para Formulário de Contato

Este documento explica como configurar o EmailJS para enviar emails através do formulário de contato.

## Passos para Configuração

### 1. Criar Conta no EmailJS
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Verifique seu email

### 2. Configurar Serviço de Email
1. No painel do EmailJS, clique em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Configure as credenciais do seu email
5. Salve o Service ID

### 3. Criar Template de Email
1. Clique em "Email Templates"
2. Clique em "Create New Template"
3. Configure o template com os seguintes campos:
   - **To Email**: contato@arsmachinaconsultancy.com
   - **From Name**: {{from_name}}
   - **From Email**: {{from_email}}
   - **Subject**: Nova mensagem do site Ars Machina Consultancy
   - **Message**:
     ```
     Você recebeu uma nova mensagem do formulário de contato:

     Nome: {{from_name}}
     Email: {{from_email}}

     Mensagem:
     {{message}}
     ```
4. Salve o Template ID

### 4. Obter User ID
1. No painel principal, clique em "Account"
2. Copie o "User ID" (Public Key)

### 5. Atualizar Configuração no Projeto
1. Abra o arquivo `src/app/emailjs.config.ts`
2. Substitua os valores pelos IDs obtidos:
   ```typescript
   export const EMAILJS_CONFIG = {
     serviceID: 'SEU_SERVICE_ID_AQUI',
     templateID: 'SEU_TEMPLATE_ID_AQUI',
     userID: 'SEU_USER_ID_AQUI'
   };
   ```

## Teste
1. Execute o projeto: `ng serve`
2. Acesse a página de contato
3. Preencha e envie o formulário
4. Verifique se o email foi recebido em contato@arsmachinaconsultancy.com

## Limites da Conta Gratuita
- 200 emails por mês
- 1 serviço de email
- 2 templates

Para mais emails, considere fazer upgrade do plano.
