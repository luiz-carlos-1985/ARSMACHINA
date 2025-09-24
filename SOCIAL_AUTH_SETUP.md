# Configuração de Autenticação Social

Este guia explica como configurar a autenticação social com Google, Facebook e LinkedIn no projeto Ars Machina Consultancy.

## 📋 Pré-requisitos

- Conta AWS com Amplify configurado
- Contas de desenvolvedor nos provedores sociais
- Domínio configurado (para produção)

## 🔧 Configuração dos Provedores

### 1. Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ 
4. Vá para "Credenciais" > "Criar credenciais" > "ID do cliente OAuth 2.0"
5. Configure as URLs de redirecionamento:
   - Desenvolvimento: `http://localhost:4200/auth/callback`
   - Produção: `https://seu-dominio.com/auth/callback`
6. Copie o Client ID e Client Secret

### 2. Facebook OAuth

1. Acesse o [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo app ou selecione um existente
3. Adicione o produto "Facebook Login"
4. Configure as URLs de redirecionamento válidas:
   - Desenvolvimento: `http://localhost:4200/auth/callback`
   - Produção: `https://seu-dominio.com/auth/callback`
5. Copie o App ID e App Secret

### 3. LinkedIn OAuth

1. Acesse o [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Crie uma nova aplicação
3. Configure as URLs de redirecionamento:
   - Desenvolvimento: `http://localhost:4200/auth/callback`
   - Produção: `https://seu-dominio.com/auth/callback`
4. Solicite acesso aos escopos necessários (r_liteprofile, r_emailaddress)
5. Copie o Client ID e Client Secret

## 🔐 Configuração das Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Preencha as variáveis de autenticação social:
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID=seu_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=seu_google_client_secret

   # Facebook OAuth
   FACEBOOK_APP_ID=seu_facebook_app_id
   FACEBOOK_APP_SECRET=seu_facebook_app_secret

   # LinkedIn OAuth
   LINKEDIN_CLIENT_ID=seu_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=seu_linkedin_client_secret
   ```

## 🚀 Deploy no AWS Amplify

1. Configure as variáveis de ambiente no Amplify Console:
   ```bash
   amplify env add
   ```

2. Atualize a configuração de autenticação:
   ```bash
   amplify push
   ```

3. Configure os domínios de callback no Amplify Console:
   - Vá para Authentication > Social providers
   - Configure cada provedor com as credenciais
   - Adicione as URLs de callback

## 🧪 Teste em Desenvolvimento

1. Inicie o servidor de desenvolvimento:
   ```bash
   ng serve
   ```

2. Acesse `http://localhost:4200/login`
3. Teste os botões de autenticação social
4. Verifique se o redirecionamento funciona corretamente

## 🔒 Segurança

- **Nunca** commite credenciais no código
- Use HTTPS em produção
- Configure CORS adequadamente
- Monitore logs de autenticação
- Implemente rate limiting

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se as URLs de callback estão configuradas corretamente
- Certifique-se de que não há barras extras no final das URLs

### Erro: "invalid_client"
- Verifique se o Client ID e Secret estão corretos
- Confirme se o app está ativo no console do provedor

### Erro: "access_denied"
- Usuário cancelou a autenticação
- Verifique se os escopos solicitados estão aprovados

## 📚 Recursos Adicionais

- [AWS Amplify Auth Documentation](https://docs.amplify.aws/lib/auth/social/q/platform/js/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [LinkedIn OAuth 2.0 Documentation](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)

## 🆘 Suporte

Para problemas específicos:
1. Verifique os logs do console do navegador
2. Consulte os logs do AWS Amplify
3. Verifique a configuração dos provedores sociais
4. Entre em contato com o suporte técnico