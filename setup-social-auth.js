#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Configurando autenticação social no AWS Amplify...\n');

try {
  // Fazer push das mudanças do Amplify
  console.log('📤 Fazendo deploy das configurações...');
  execSync('npx amplify push --yes', { stdio: 'inherit' });
  
  console.log('\n✅ Configuração concluída!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure as credenciais do Google no AWS Console');
  console.log('2. Configure as credenciais do Facebook no AWS Console');
  console.log('3. Teste a autenticação social');
  
} catch (error) {
  console.error('❌ Erro durante a configuração:', error.message);
  process.exit(1);
}