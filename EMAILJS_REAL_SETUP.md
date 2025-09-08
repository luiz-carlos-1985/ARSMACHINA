# Configuração Real do EmailJS

## Status Atual
✅ **CONFIGURADO** - O sistema está pronto para enviar emails reais

## Configuração Necessária

### 1. Criar Conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Crie uma conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email
1. No dashboard, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Configure as credenciais
5. Anote o **Service ID** (ex: `service_abc123`)

### 3. Criar Template de Email
1. Vá em **Email Templates**
2. Clique em **Create New Template**
3. Use este template:

```html
Assunto: Código de Verificação - Ars Machina

Olá {{to_name}},

Seu código de verificação é: {{verification_code}}

Digite este código para verificar sua conta.

Atenciosamente,
{{from_name}}
```

4. Anote o **Template ID** (ex: `template_xyz789`)

### 4. Obter Chave Pública
1. Vá em **Account** → **General**
2. Copie a **Public Key** (ex: `user_abc123xyz`)

### 5. Atualizar Configuração
Edite o arquivo `src/app/emailjs.config.ts`:

```typescript
export const EMAILJS_CONFIG = {
  enabled: true,
  serviceID: 'SEU_SERVICE_ID_AQUI',
  templateID: 'SEU_TEMPLATE_ID_AQUI', 
  userID: 'SUA_PUBLIC_KEY_AQUI'
};
```

## Teste Rápido

Para testar se está funcionando:

1. Faça um registro com seu email real
2. Verifique se recebeu o código por email
3. Use o código para completar o registro

## Variáveis do Template

O sistema envia estas variáveis para o template:

- `{{to_email}}` - Email do destinatário
- `{{to_name}}` - Nome extraído do email
- `{{from_name}}` - "Ars Machina Consultancy"
- `{{subject}}` - "Código de Verificação"
- `{{message}}` - Mensagem com o código
- `{{verification_code}}` - O código de 6 dígitos

## Limites Gratuitos

- **200 emails/mês** na conta gratuita
- Upgrade para planos pagos se necessário

## Troubleshooting

### Email não chega:
1. Verifique spam/lixo eletrônico
2. Confirme as credenciais do EmailJS
3. Teste o template no dashboard do EmailJS

### Erro de configuração:
1. Verifique se `enabled: true`
2. Confirme Service ID, Template ID e Public Key
3. Veja o console do navegador para erros

## Status de Implementação

✅ EmailJS configurado e habilitado
✅ Template de verificação implementado  
✅ Envio automático no registro
✅ Logs detalhados para debug
✅ Fallback em caso de erro

O sistema está **PRONTO** para enviar emails reais assim que as credenciais corretas forem configuradas.