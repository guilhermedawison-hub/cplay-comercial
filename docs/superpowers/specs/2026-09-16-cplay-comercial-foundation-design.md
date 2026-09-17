# CPlay Comercial Foundation Design

## Objetivo

Transformar o fork do Atomic CRM no núcleo do CPlay Comercial, preservando o máximo possível da estrutura original para facilitar manutenção e futuras atualizações, ao mesmo tempo em que adicionamos o modelo comercial específico da CPlay.

## Princípio arquitetural

O Atomic CRM será mantido como núcleo funcional. As customizações da CPlay devem ficar concentradas em uma camada própria de configuração, módulos e componentes, evitando alterações espalhadas no código upstream quando houver uma extensão limpa disponível.

A fonte de verdade será o CRM conectado ao Supabase. A futura extensão do WhatsApp Web será apenas uma camada complementar de operação e nunca o armazenamento principal.

## Entidades principais

### Contato

Representa uma pessoa física.

Campos iniciais:
- nome
- WhatsApp
- telefone
- e-mail
- cargo/função
- empresa opcional
- observações

Um contato pode existir sem empresa.

### Empresa

Representa uma organização comercial.

Campos iniciais:
- nome
- segmento
- cidade
- bairro
- endereço
- site
- informações comerciais adicionais

Uma empresa pode possuir vários contatos.

### Produto/Serviço

Cadastro administrável dentro do CRM. Não haverá lista fixa de produtos no código.

Campos:
- nome
- categoria opcional
- descrição curta
- preço-base opcional
- ativo/inativo
- ordem de exibição
- cor/identificação visual opcional

Ao selecionar um produto em uma oportunidade, o preço-base deve preencher automaticamente o valor sugerido da oportunidade, mas o valor final deve permanecer sempre editável manualmente.

### Origem de Lead

Cadastro administrável, sem lista fixa no código.

Campos:
- nome
- ativo/inativo
- ordem de exibição

Cada oportunidade pode estar ligada a uma origem.

### Negócio/Oportunidade

Representa um card do Kanban e é a unidade central do funil comercial.

Regras:
- um contato pode ter várias oportunidades simultâneas
- uma empresa pode ter várias oportunidades simultâneas
- empresa é opcional
- contato é obrigatório
- produto/serviço é selecionado a partir do cadastro administrável
- valor da oportunidade é inicializado a partir do preço-base, quando disponível, mas sempre editável
- responsável comercial é obrigatório
- origem do lead é selecionada a partir do cadastro administrável
- cada negócio possui um próximo follow-up principal
- atividades e follow-ups anteriores permanecem no histórico

## Kanban

O fluxo padrão será:

1. Novo
2. Contatado
3. Interessado
4. Reunião
5. Proposta
6. Negociação
7. Fechado
8. Perdido

A coluna Perdido permanece visível no Kanban.

### Conteúdo do card

Prioridade visual:
1. empresa, quando existir; caso contrário, nome do contato
2. contato responsável
3. produto/serviço
4. valor potencial
5. responsável comercial
6. próximo follow-up

## Follow-up

Cada negócio terá um follow-up principal ativo.

Campos:
- data
- hora
- tipo de contato
- observação

O follow-up é sempre editável manualmente. Quando concluído ou substituído, deve permanecer no histórico de atividades.

## Responsável comercial

Todo negócio deve possuir um responsável comercial obrigatório.

Mesmo que exista apenas um usuário no início, o modelo deve nascer preparado para múltiplos vendedores, parceiros ou operadores.

## Histórico e atividades

Sempre que possível, reutilizar o mecanismo de histórico/atividades do Atomic CRM.

O histórico deve registrar eventos comerciais relevantes, incluindo:
- criação da oportunidade
- alteração de estágio
- alteração de responsável
- conclusão de follow-up
- criação de notas
- alterações relevantes de valor

## Importação, exportação e notas

Manter os recursos existentes do Atomic CRM quando fizerem sentido, especialmente:
- notas
- tarefas
- importação/exportação
- histórico de atividades

Não recriar funcionalidades equivalentes sem necessidade.

## Internacionalização e branding

O produto final deve usar:
- nome: CPlay Comercial
- idioma principal: Português-BR
- branding visual da CPlay

A implementação deve preferir configuração e componentes próprios da CPlay em vez de substituir diretamente componentes upstream quando uma camada de extensão for suficiente.

## WhatsApp Web

A extensão será implementada em uma fase posterior.

Princípios:
- sem API oficial nesta fase
- sem automação de envio
- sem disparo em massa
- respostas rápidas apenas preenchem o campo do WhatsApp; envio continua manual
- extensão consulta e atualiza dados no CPlay Comercial
- Supabase/CRM permanece como fonte principal dos dados

## Supabase

O Supabase será usado para persistência, autenticação e dados compartilhados.

A primeira fase deve preparar o modelo de dados para:
- contatos
- empresas
- produtos/serviços
- origens de lead
- oportunidades
- responsáveis
- follow-ups
- atividades

## Estratégia de implementação

A ordem recomendada é:
1. rebranding e camada de configuração CPlay
2. modelo de dados e migrations
3. cadastro de produtos/serviços
4. cadastro de origens de lead
5. adaptação de contatos e empresas
6. adaptação de negócios e Kanban
7. follow-up principal e histórico
8. responsável comercial obrigatório
9. testes, QA e documentação
10. integração futura com extensão do WhatsApp Web

## Critérios de sucesso da fundação

A fundação será considerada concluída quando:
- o CRM estiver identificado como CPlay Comercial
- contatos e empresas estiverem separados
- contatos sem empresa forem permitidos
- produtos/serviços forem cadastráveis no próprio sistema
- origem de lead for cadastrável
- preço-base preencher o valor sugerido, mantendo edição manual
- múltiplas oportunidades por contato/empresa funcionarem
- Kanban exibir as oito etapas definidas
- responsável comercial for obrigatório
- follow-up principal por negócio funcionar com histórico
- dados persistirem no Supabase
- testes relevantes passarem sem regressões críticas
