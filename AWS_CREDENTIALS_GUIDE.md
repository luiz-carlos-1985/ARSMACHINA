# 🔑 Como Obter Credenciais AWS (Access Key ID e Secret Access Key)

## 📍 Passo a Passo Visual

### 1. **Acesse o Console AWS**
```
🌐 Vá para: https://aws.amazon.com/console/
📧 Faça login com sua conta AWS
```

### 2. **Navegue para IAM (Identity and Access Management)**
```
🔍 Na barra de pesquisa do console, digite: "IAM"
🖱️ Clique em "IAM" nos resultados
```

### 3. **Criar um Novo Usuário**
```
📋 No painel esquerdo, clique em "Users" (Usuários)
➕ Clique no botão "Create user" (Criar usuário)
```

### 4. **Configurar o Usuário**
```
👤 Nome do usuário: "ses-email-sender" (ou qualquer nome)
☑️ Marque: "Provide user access to the AWS Management Console" (OPCIONAL)
➡️ Clique em "Next" (Próximo)
```

### 5. **Definir Permissões**
```
🔘 Selecione: "Attach policies directly" (Anexar políticas diretamente)
🔍 Na busca, digite: "SES"
☑️ Marque: "AmazonSESFullAccess" 
   (ou crie uma política personalizada mais restritiva)
➡️ Clique em "Next" (Próximo)
```

### 6. **Revisar e Criar**
```
👀 Revise as configurações
✅ Clique em "Create user" (Criar usuário)
```

### 7. **🎯 OBTER AS CREDENCIAIS (PARTE IMPORTANTE!)**
```
📋 Após criar o usuário, clique no nome do usuário criado
🔒 Clique na aba "Security credentials" (Credenciais de segurança)
🔑 Na seção "Access keys", clique em "Create access key"
```

### 8. **Escolher Tipo de Access Key**
```
🔘 Selecione: "Application running outside AWS"
☑️ Marque: "I understand the above recommendation..."
➡️ Clique em "Next"
```

### 9. **🚨 SALVAR AS CREDENCIAIS (CRÍTICO!)**
```
⚠️  ATENÇÃO: Esta é a ÚNICA vez que você verá a Secret Access Key!

📝 Você verá algo assim:
   Access Key ID: AKIA1234567890EXAMPLE
   Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

💾 COPIE E SALVE EM LOCAL SEGURO:
   - Anote em um arquivo de texto temporário
   - Ou baixe o arquivo CSV
   - NUNCA compartilhe essas informações!
```

## 🔧 Como Usar as Credenciais

### **Opção 1: Variáveis de Ambiente (Recomendado)**

#### Para Windows:
```cmd
# No terminal/cmd, execute:
set AWS_ACCESS_KEY_ID=AKIA1234567890EXAMPLE
set AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Ou crie um arquivo .env na raiz do projeto:
AWS_ACCESS_KEY_ID=AKIA1234567890EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

#### Para Linux/Mac:
```bash
# No terminal, execute:
export AWS_ACCESS_KEY_ID=AKIA1234567890EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Ou adicione ao ~/.bashrc ou ~/.zshrc
echo 'export AWS_ACCESS_KEY_ID=AKIA1234567890EXAMPLE' >> ~/.bashrc
echo 'export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' >> ~/.bashrc
```

### **Opção 2: Editar Diretamente o Código (NÃO Recomendado para Produção)**

Edite o arquivo `src/app/aws.config.ts`:
```typescript
export const AWS_CONFIG = {
  region: 'us-east-1',
  
  credentials: {
    accessKeyId: 'AKIA1234567890EXAMPLE', // Sua Access Key ID aqui
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' // Sua Secret Key aqui
  },
  
  email: {
    sourceEmail: 'contato@arsmachinaconsultancy.com',
    replyToEmail: 'contato@arsmachinaconsultancy.com'
  }
};
```

## 🛡️ Configurar SES (Simple Email Service)

### 1. **Acessar SES**
```
🔍 No console AWS, pesquise: "SES"
🖱️ Clique em "Simple Email Service"
🌍 Certifique-se de estar na região correta (ex: us-east-1)
```

### 2. **Verificar Email**
```
📧 No painel esquerdo, clique em "Verified identities"
➕ Clique em "Create identity"
🔘 Selecione "Email address"
📝 Digite: contato@arsmachinaconsultancy.com
✅ Clique em "Create identity"
```

### 3. **Confirmar Verificação**
```
📬 Verifique a caixa de entrada do email
📧 Clique no link de verificação no email da AWS
✅ Aguarde status mudar para "Verified"
```

## 🧪 Testar a Configuração

### 1. **Verificar se Funciona**
```bash
# Execute o projeto
ng serve

# Acesse: http://localhost:4200/contact
# Preencha o formulário
# Verifique o console do navegador para logs
```

### 2. **Verificar Logs**
```javascript
// No console do navegador, você deve ver:
"AWS SES configured: true"
"Email sent successfully via AWS SES"
```

## ❌ Problemas Comuns

### **Erro: "The security token included in the request is invalid"**
```
❌ Problema: Credenciais incorretas
✅ Solução: Verifique se copiou corretamente as credenciais
```

### **Erro: "Email address not verified"**
```
❌ Problema: Email não verificado no SES
✅ Solução: Verifique o email no console SES
```

### **Erro: "Access Denied"**
```
❌ Problema: Usuário sem permissões SES
✅ Solução: Adicione a política AmazonSESFullAccess ao usuário
```

## 💰 Custos

```
💸 Primeiros 62.000 emails por mês: GRÁTIS
💸 Depois: $0.10 por 1.000 emails
💸 Para um site de contato: Praticamente GRÁTIS
```

## 🔒 Segurança IMPORTANTE

```
🚨 NUNCA faça commit das credenciais no Git
🚨 Use sempre variáveis de ambiente em produção
🚨 Rotacione as credenciais periodicamente
🚨 Monitore o uso no console AWS
```

## 📞 Precisa de Ajuda?

Se ainda tiver dúvidas:
1. ✅ Siga este guia passo a passo
2. ✅ Verifique se o email está verificado no SES
3. ✅ Confirme se as credenciais estão corretas
4. ✅ Teste primeiro com variáveis de ambiente
5. ✅ Verifique os logs no console do navegador

---

**🎯 Resumo Rápido:**
1. AWS Console → IAM → Users → Create User
2. Attach Policy: AmazonSESFullAccess  
3. Create Access Key → COPIAR E SALVAR
4. SES → Verify Email → Confirmar no email
5. Configurar variáveis de ambiente
6. Testar o formulário de contato
