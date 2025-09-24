# Configuração Rápida - Autenticação Social

## 🚀 Passos para Ativar

### 1. Deploy da Configuração
```bash
npx amplify push
```

### 2. Configurar Google OAuth
1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie/selecione projeto
3. Ative Google+ API
4. Crie credenciais OAuth 2.0
5. Configure redirect URI: `https://[seu-user-pool-domain]/oauth2/idpresponse`

### 3. Configurar Facebook OAuth
1. Vá para [Facebook Developers](https://developers.facebook.com/)
2. Crie/selecione app
3. Adicione Facebook Login
4. Configure redirect URI: `https://[seu-user-pool-domain]/oauth2/idpresponse`

### 4. Adicionar Provedores no AWS Console
1. Vá para AWS Cognito > User Pools
2. Selecione seu User Pool
3. Vá para "Sign-in experience" > "Federated identity provider sign-in"
4. Adicione Google e Facebook com suas credenciais

### 5. Testar
```bash
ng serve
```
Acesse `/login` e teste os botões sociais.

## ⚡ Comandos Rápidos
```bash
# Deploy
npx amplify push

# Iniciar app
ng serve

# Ver logs
npx amplify console
```