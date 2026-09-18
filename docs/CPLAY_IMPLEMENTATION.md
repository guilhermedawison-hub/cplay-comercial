# CPlay Comercial — Plano de Implementação

Este fork do Atomic CRM será adaptado para a operação comercial da CPlay.

## Escopo inicial

- CRM centralizado em Supabase
- Kanban comercial como núcleo do funil
- Leads, empresas e contatos
- Follow-ups e tarefas
- Histórico comercial e observações
- Origem do lead
- Cidade e bairro
- Produto/serviço de interesse
- Responsável comercial
- Valor potencial da oportunidade
- Integração futura com extensão do WhatsApp Web

## Kanban CPlay

Fluxo principal:

1. Novo
2. Contatado
3. Interessado
4. Reunião
5. Proposta
6. Negociação
7. Fechado

Encerramento alternativo: Perdido.

## WhatsApp Web

A extensão será uma camada complementar do CPlay Comercial. O CRM e o Supabase continuarão sendo a fonte principal dos dados. Nesta fase não haverá automação de disparo nem envio automático de mensagens.

## Fases

### Fase 1 — Fundação
- Rebranding para CPlay Comercial
- Português-BR
- Ajuste do Kanban
- Campos comerciais essenciais
- Preparação do Supabase

### Fase 2 — Operação comercial
- Dashboard
- Follow-ups e agenda
- Filtros e busca
- Importação/exportação
- Histórico detalhado

### Fase 3 — WhatsApp Web
- Painel lateral da extensão
- Identificação da conversa atual
- Busca/criação de lead
- Atualização de status, notas e follow-up
- Respostas rápidas com envio sempre manual

### Fase 4 — Evolução
- Relatórios e métricas
- Integração com rota comercial
- IA assistiva opcional para resumo, diagnóstico e sugestão de resposta
