# AWS SES Setup Guide - Ars Machina Consultancy

Este guia explica como configurar o AWS Simple Email Service (SES) para o formulário de contato do site.

## 📋 Pré-requisitos

- Conta AWS ativa
- Domínio verificado ou email verificado no AWS SES
- Conhecimento básico de AWS IAM

## 🔧 Configuração Passo a Passo

### 1. Configurar AWS SES

1. **Acesse o Console AWS SES**
   - Faça login no AWS Console
   - Navegue para SES (Simple Email Service)
   - Escolha a região (recomendado: us-east-1)

2. **Verificar Email/Domínio**
   ```
   - Vá para "Verified identities"
   - Clique em "Create identity"
   - Escolha "Email address" ou "Domain"
   - Para email: adicione contato@arsmachinaconsultancy.com
   - Para domínio: adicione arsmachinaconsultancy.com
   - Siga as instruções de verificação
   ```

3. **Sair do Sandbox (Produção)**
   ```
   - Por padrão, SES está em "sandbox mode"
   - Para produção, solicite saída do sandbox
   - Vá para "Account dashboard" > "Request production access"
   - Preencha o formulário explicando o uso
   ```

### 2. Configurar IAM User

1. **Criar Usuário IAM**
   ```
   - Vá para IAM Console
   - Clique em "Users" > "Create user"
   - Nome: ses-email-user
   - Tipo: Programmatic access
   ```

2. **Adicionar Permissões**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. **Obter Credenciais**
   ```
   - Anote o Access Key ID
   - Anote o Secret Access Key
   - NUNCA compartilhe essas credenciais
   ```

### 3. Configurar Variáveis de Ambiente

#### Para Desenvolvimento Local:
```bash
# Crie um arquivo .env na raiz do projeto
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

#### Para Produção (Vercel/Netlify):
```bash
# Configure nas variáveis de ambiente da plataforma
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### 4. Atualizar Configuração do Projeto

1. **Editar src/app/aws.config.ts**
   ```typescript
   export const AWS_CONFIG = {
     region: 'us-east-1', // Sua região AWS
     
     credentials: {
       accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
       secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || ''
     },
     
     email: {
       sourceEmail: 'contato@arsmachinaconsultancy.com', // Email verificado
       replyToEmail: 'contato@arsmachinaconsultancy.com'
     }
   };
   ```

## 🧪 Testando a Configuração

### 1. Teste Local
```bash
# Execute o projeto
ng serve

# Acesse http://localhost:4200/contact
# Preencha e envie o formulário
# Verifique o console para logs de sucesso/erro
```

### 2. Verificar Emails
- Verifique se o email chegou na caixa de entrada
- Verifique se o auto-reply foi enviado ao remetente
- Confirme se não há emails na pasta de spam

## 🚨 Troubleshooting

### Erro: "Email address not verified"
```
Solução: Verifique o email no AWS SES Console
- Vá para "Verified identities"
- Confirme que o email está verificado
- Aguarde até 24h para propagação
```

### Erro: "Access Denied"
```
Solução: Verifique as permissões IAM
- Confirme que o usuário tem permissões SES
- Verifique se as credenciais estão corretas
- Teste com AWS CLI: aws ses verify-email-identity
```

### Erro: "Rate exceeded"
```
Solução: Você atingiu o limite de envio
- Verifique os limites no SES Console
- Solicite aumento de limite se necessário
- Implemente throttling no código
```

### Emails indo para Spam
```
Solução: Configure SPF, DKIM e DMARC
- Configure registros DNS apropriados
- Use domínio verificado em vez de email
- Monitore reputação do remetente
```

## 📊 Monitoramento

### 1. CloudWatch Metrics
- Bounce rate
- Complaint rate
- Delivery rate
- Send rate

### 2. SES Console
- Sending statistics
- Reputation metrics
- Suppression list

## 💰 Custos

### Preços AWS SES (2024)
- Primeiros 62.000 emails/mês: GRÁTIS
- Após isso: $0.10 por 1.000 emails
- Emails recebidos: $0.09 por 1.000 emails

### Estimativa para Site de Contato
```
- 100 formulários/mês = ~200 emails (contato + auto-reply)
- Custo mensal: GRÁTIS (dentro do limite)
- Custo anual: GRÁTIS (até ~3.000 formulários/mês)
```

## 🔒 Segurança

### Boas Práticas
1. **Nunca** commite credenciais no código
2. Use variáveis de ambiente
3. Rotacione credenciais regularmente
4. Monitore uso e logs
5. Configure alertas para uso anômalo

### Exemplo .gitignore
```
# Environment variables
.env
.env.local
.env.production

# AWS credentials
aws-credentials.json
```

## 📞 Suporte

Se precisar de ajuda:
1. Consulte a documentação oficial AWS SES
2. Verifique os logs do CloudWatch
3. Entre em contato com o suporte AWS
4. Consulte a comunidade AWS no Stack Overflow

---

**Status Atual**: ✅ Configurado para desenvolvimento (simulação)
**Próximo Passo**: Configurar credenciais AWS para produção
