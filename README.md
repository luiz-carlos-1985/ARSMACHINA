# Ars Machina Consultancy

Bem-vindo ao projeto Ars Machina Consultancy! Este repositório contém uma aplicação web moderna desenvolvida em Angular para apresentar os serviços da Ars Machina Consultancy, uma empresa especializada em consultoria em TI e soluções tecnológicas inovadoras.

## Visão Geral

Esta aplicação é uma landing page profissional e interativa que demonstra as capacidades da Ars Machina Consultancy. Construída com Angular e integrada com AWS Amplify, oferece uma experiência de usuário envolvente com autenticação segura, API em tempo real e banco de dados escalável.

## Funcionalidades Principais

### 🏠 Landing Page Moderna
- **Seção Hero**: Apresentação impactante da empresa com animações e design responsivo
- **Sobre Nós**: Informações sobre a empresa e estatísticas de desempenho
- **Serviços**: Catálogo completo de serviços oferecidos (Desenvolvimento de Software, Cloud Computing, Cibersegurança, etc.)
- **Blog**: Sistema de postagens integrado para compartilhamento de conhecimento
- **Contato**: Informações de contato e formulário de contato

### 🔐 Sistema de Autenticação
- **Registro e Login**: Sistema seguro usando Amazon Cognito
- **Gerenciamento de Usuários**: Perfis personalizados e controle de acesso
- **Autenticação Social**: Integração com provedores externos

### 📊 API e Banco de Dados
- **GraphQL API**: Endpoint em tempo real com AWS AppSync
- **Banco de Dados**: Armazenamento escalável com Amazon DynamoDB
- **CRUD Operations**: Gerenciamento completo de dados para posts e usuários

### 🎨 Design e UX
- **Interface Responsiva**: Otimizada para desktop, tablet e mobile
- **Animações Avançadas**: Transições suaves e efeitos visuais atraentes
- **Tema Moderno**: Gradientes, sombras e tipografia profissional
- **Acessibilidade**: Design inclusivo seguindo melhores práticas

## Tecnologias Utilizadas

- **Frontend**: Angular 17+ com TypeScript
- **Backend**: AWS Amplify (Cognito, AppSync, DynamoDB)
- **Styling**: CSS3 com animações e design responsivo
- **Build**: Angular CLI com otimização para produção

## Instalação e Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/your-username/arsmachina-consultancy.git
   cd arsmachina-consultancy
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o AWS Amplify**:
   - Configure suas credenciais AWS
   - Execute `amplify init` para inicializar o projeto
   - Configure os serviços necessários (Cognito, AppSync, DynamoDB)

4. **Execute o servidor de desenvolvimento**:
   ```bash
   ng serve
   ```

5. **Acesse a aplicação**:
   - Abra seu navegador em `http://localhost:4200`

## Implantação

Para implantar a aplicação em produção:

1. **Build de produção**:
   ```bash
   ng build --prod
   ```

2. **Implantação no AWS**:
   - Use AWS Amplify Console para implantação contínua
   - Ou implante manualmente no Amazon S3 + CloudFront

Para instruções detalhadas, consulte a [documentação oficial do AWS Amplify](https://docs.amplify.aws/angular/start/quickstart/#deploy-a-fullstack-app-to-aws).

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── navigation/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── todos/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── translation.service.ts
│   ├── guards/
│   ├── pipes/
│   └── app.config.ts
├── assets/
├── environments/
└── styles.css
```

## Contribuição

Contribuições são bem-vindas! Por favor, leia nossas diretrizes de contribuição em [CONTRIBUTING.md](CONTRIBUTING.md).

## Segurança

Para relatar vulnerabilidades de segurança, consulte nossas [diretrizes de segurança](CONTRIBUTING.md#security-issue-notifications).

## Licença

Este projeto está licenciado sob a Licença MIT-0. Consulte o arquivo LICENSE para mais detalhes.

---

**Ars Machina Consultancy** © 2025. Todos os direitos reservados.
Transformando ideias em realidade digital.
