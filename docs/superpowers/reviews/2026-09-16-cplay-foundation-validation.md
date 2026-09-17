# CPlay Comercial Foundation Validation

Branch: `setup/cplay-foundation`

## Escopo de validação

Esta revisão cobre a fundação aprovada em `docs/superpowers/specs/2026-09-16-cplay-comercial-foundation-design.md` e o plano em `docs/superpowers/plans/2026-09-16-cplay-comercial-foundation.md`.

## Estado observado antes da CI

- camada de configuração CPlay presente
- oito estágios comerciais configurados
- tabelas e extensões de schema para produtos, origens e oportunidades presentes
- CRUD de produtos/serviços presente
- CRUD de origens de lead presente
- oportunidade adaptada para produto, origem, responsável e follow-up
- cards e visualização de negócios adaptados
- suporte a empresa opcional presente
- tradução PT-BR adicionada
- valores BRL com suporte decimal adicionados

## Validação obrigatória antes do merge

- lint
- prettier
- TypeScript typecheck
- testes unitários da aplicação
- testes unitários das funções Supabase
- E2E Playwright
- build de produção
- revisão das migrations Supabase
- confirmar que `Perdido` permanece coluna visível
- confirmar que preço-base sugere o valor sem bloquear edição manual
- confirmar contato obrigatório e empresa opcional em oportunidades
- confirmar responsável comercial obrigatório
- confirmar follow-up principal com histórico

## CI

GitHub Actions foi habilitado no fork em 2026-09-16. Esta atualização existe para gerar um novo evento de sincronização do PR e disparar a pipeline de validação.

Nenhum merge deve ser feito até a pipeline e a revisão final estarem concluídas.
