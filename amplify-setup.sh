#!/bin/bash

echo "🚀 Configurando Amplify para autenticação social..."

# Deploy das configurações
echo "📤 Fazendo deploy..."
npx amplify push --yes

echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure Google OAuth no Google Cloud Console"
echo "2. Configure Facebook OAuth no Facebook Developers"
echo "3. Adicione as credenciais no AWS Cognito User Pool"
echo "4. Teste com: ng serve"
echo ""
echo "🔗 Links úteis:"
echo "Google: https://console.cloud.google.com/"
echo "Facebook: https://developers.facebook.com/"
echo "AWS Cognito: https://console.aws.amazon.com/cognito/"