# Componente de Projetos

## Visão Geral

O componente de Projetos (`ProjectsComponent`) é uma página dedicada para visualizar, filtrar e gerenciar todos os projetos da aplicação. Esta funcionalidade foi implementada para complementar o dashboard principal, oferecendo uma visão mais detalhada e ferramentas avançadas de gerenciamento.

## Funcionalidades

### 🔍 Busca e Filtros
- **Busca por texto**: Pesquisa em nome, descrição e cliente
- **Filtro por status**: Todos, Planejamento, Em Andamento, Em Revisão, Concluído
- **Ordenação**: Por nome, prazo, progresso, prioridade ou orçamento
- **Ordem crescente/decrescente**: Botão toggle para inverter a ordenação

### 📊 Estatísticas em Tempo Real
- Número total de projetos encontrados
- Projetos em andamento
- Projetos concluídos
- Orçamento total dos projetos filtrados

### 📅 Indicadores de Prazo
- **Normal**: Prazo superior a 30 dias (verde)
- **Em breve**: Prazo entre 8-30 dias (amarelo)
- **Urgente**: Prazo até 7 dias (laranja)
- **Atrasado**: Prazo vencido (vermelho)

### 🎯 Ações por Projeto
- **Visualizar**: Mostra detalhes completos do projeto
- **Editar**: Permite modificar informações do projeto
- **Excluir**: Remove o projeto com confirmação

### 📤 Exportação
- Exporta projetos filtrados para CSV
- Inclui todas as informações relevantes
- Nome do arquivo com data atual

## Estrutura de Dados

Cada projeto contém as seguintes informações:

```typescript
{
  id: number;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  statusText: string;
  progress: number; // 0-100
  deadline: string; // YYYY-MM-DD
  teamSize: number;
  priority: 'low' | 'medium' | 'high';
  client: string;
  budget: number;
  startDate: string; // YYYY-MM-DD
}
```

## Design e UX

### 🎨 Design Moderno
- Gradientes e efeitos de blur para profundidade
- Animações suaves e transições
- Cards com hover effects
- Badges coloridos para status e prioridade

### 📱 Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Touch targets otimizados para dispositivos móveis
- Formulários com tamanhos adequados para evitar zoom no iOS
- Navegação intuitiva em todas as telas

### ♿ Acessibilidade
- Botões com tamanhos mínimos recomendados (44px)
- Contraste adequado de cores
- Feedback visual para interações
- Suporte a navegação por teclado

## Navegação

### Acesso
- Através do botão "Ver Todas" na seção de projetos do dashboard
- URL direta: `/projects`

### Retorno
- Botão "Voltar ao Dashboard" no cabeçalho
- Navegação programática via `router.navigate(['/dashboard'])`

## Integração com Dashboard

### Sincronização de Dados
- Utiliza o mesmo localStorage do dashboard (`dashboardData`)
- Alterações são refletidas automaticamente no dashboard
- Dados padrão são carregados se não houver dados salvos

### Consistência Visual
- Mantém o mesmo padrão de cores e tipografia
- Componentes reutilizáveis do design system
- Animações consistentes com o resto da aplicação

## Tecnologias Utilizadas

- **Angular 17+**: Framework principal
- **TypeScript**: Linguagem de programação
- **CSS3**: Estilização com gradientes e animações
- **LocalStorage**: Persistência de dados local
- **Angular Router**: Navegação entre páginas

## Estados da Aplicação

### Loading
- Indicadores visuais durante carregamento
- Estados de loading para operações assíncronas

### Empty State
- Tela especial quando nenhum projeto é encontrado
- Botão para limpar filtros
- Mensagem explicativa e ícone ilustrativo

### Error Handling
- Validações de entrada
- Confirmações para ações destrutivas
- Mensagens de feedback para o usuário

## Performance

### Otimizações
- Lazy loading do componente
- Filtros eficientes com debounce implícito
- Renderização condicional para melhor performance
- Animações otimizadas com CSS transforms

### Escalabilidade
- Estrutura preparada para grandes volumes de dados
- Possibilidade de implementar paginação
- Filtros preparados para expansão futura

## Próximas Melhorias

### Funcionalidades Planejadas
- [ ] Paginação para grandes volumes
- [ ] Filtros avançados (data, orçamento, equipe)
- [ ] Visualização em lista/grid toggle
- [ ] Drag & drop para reordenação
- [ ] Integração com calendário
- [ ] Notificações de prazo
- [ ] Relatórios avançados
- [ ] Colaboração em tempo real

### Melhorias Técnicas
- [ ] Testes unitários completos
- [ ] Testes de integração
- [ ] Otimização de bundle size
- [ ] Service Worker para offline
- [ ] Internacionalização completa