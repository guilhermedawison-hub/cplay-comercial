# CPlay Comercial Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o fork do Atomic CRM no núcleo do CPlay Comercial, com produtos/serviços e origens administráveis, contatos e empresas separados, oportunidades múltiplas, Kanban CPlay, responsável obrigatório e follow-up principal com histórico.

**Architecture:** Preservar o Atomic CRM como núcleo e concentrar as customizações em configuração, módulos CPlay e extensões de schema. O Supabase continua como fonte de verdade. A futura extensão do WhatsApp Web consumirá o CRM, sem armazenar estado comercial próprio.

**Tech Stack:** React 19, TypeScript, Vite, React Admin/ra-core, shadcn/ui, Supabase/Postgres, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-16-cplay-comercial-foundation-design.md`

## Global Constraints

- Nome do produto: `CPlay Comercial`.
- Idioma principal: Português-BR.
- Kanban: `Novo`, `Contatado`, `Interessado`, `Reunião`, `Proposta`, `Negociação`, `Fechado`, `Perdido`.
- `Perdido` permanece visível no Kanban.
- Contato é obrigatório na oportunidade; empresa é opcional.
- Um contato/empresa pode ter várias oportunidades simultâneas.
- Produto/serviço e origem de lead devem ser administráveis, não hardcoded.
- Preço-base apenas sugere valor; `amount` da oportunidade permanece sempre editável.
- Responsável comercial é obrigatório.
- Cada negócio possui um follow-up principal ativo e histórico de atividades anteriores.
- Não implementar automação de envio de WhatsApp nesta fase.
- Preferir extensão/configuração CPlay a alterações invasivas no núcleo do Atomic CRM.

---

## File Structure

### Configuração CPlay
- Create: `src/cplay/config.ts` — branding, estágios e defaults CPlay.
- Create: `src/cplay/types.ts` — tipos dos novos recursos administrativos.
- Modify: `src/App.tsx` — injeta configuração CPlay no componente `CRM`.

### Banco de dados
- Modify: `supabase/schemas/01_tables.sql` — produtos, origens, follow-up e novos vínculos em deals.
- Modify: `supabase/schemas/04_triggers.sql` — `updated_at` e histórico relevante.
- Modify: `supabase/schemas/05_policies.sql` — RLS das novas tabelas.
- Modify: `supabase/schemas/06_grants.sql` — permissões das novas tabelas.
- Create migration correspondente em `supabase/migrations/` gerada a partir dos schemas.

### Produtos e origens
- Create: `src/components/cplay/products/` — CRUD de produtos/serviços.
- Create: `src/components/cplay/lead-sources/` — CRUD de origens.
- Modify: `src/components/atomic-crm/root/CRM.tsx` ou ponto de registro de resources — registrar novos resources sem duplicar infraestrutura.

### Contatos, empresas e oportunidades
- Modify: componentes de `src/components/atomic-crm/contacts/` — empresa opcional e dados locais.
- Modify: componentes de `src/components/atomic-crm/companies/` — cidade/bairro e informações comerciais.
- Modify: `src/components/atomic-crm/deals/DealInputs.tsx` — contato obrigatório, empresa opcional, produto, origem, responsável e follow-up.
- Modify: `src/components/atomic-crm/deals/DealCard.tsx` — conteúdo visual do card.
- Modify: `src/components/atomic-crm/deals/DealList.tsx` — oito estágios e comportamento do Kanban.

### Testes
- Extend: `src/components/atomic-crm/deals/DealList.test.tsx`.
- Create: testes unitários em `src/components/cplay/products/*.test.tsx` e `src/components/cplay/lead-sources/*.test.tsx`.
- Create/extend e2e em `e2e/` para fluxo CRUD + oportunidade + Kanban.

---

### Task 1: Introduzir camada de configuração CPlay

**Files:**
- Create: `src/cplay/config.ts`
- Create: `src/cplay/types.ts`
- Modify: `src/App.tsx`
- Test: `src/cplay/config.test.ts`

**Interfaces:**
- Produces: `cplayDealStages`, `cplayBrand`, `CPlayProduct`, `CPlayLeadSource`.

- [ ] **Step 1: Escrever teste dos estágios**

```ts
import { describe, expect, it } from "vitest";
import { cplayDealStages } from "./config";

describe("cplayDealStages", () => {
  it("mantém a ordem comercial aprovada", () => {
    expect(cplayDealStages.map(stage => stage.value)).toEqual([
      "novo",
      "contatado",
      "interessado",
      "reuniao",
      "proposta",
      "negociacao",
      "fechado",
      "perdido",
    ]);
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar falha**

Run: `npm run test:unit:app -- src/cplay/config.test.ts`
Expected: FAIL porque `config.ts` ainda não existe.

- [ ] **Step 3: Criar configuração mínima**

```ts
export const cplayBrand = { title: "CPlay Comercial" } as const;

export const cplayDealStages = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "interessado", label: "Interessado" },
  { value: "reuniao", label: "Reunião" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
] as const;
```

- [ ] **Step 4: Definir tipos CPlay**

```ts
export type CPlayProduct = {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  base_price: number | null;
  active: boolean;
  display_order: number;
  color: string | null;
};

export type CPlayLeadSource = {
  id: number;
  name: string;
  active: boolean;
  display_order: number;
};
```

- [ ] **Step 5: Injetar branding/estágios em `src/App.tsx`**

```tsx
const App = () => (
  <CRM title={cplayBrand.title} dealStages={cplayDealStages} />
);
```

- [ ] **Step 6: Rodar testes**

Run: `npm run test:unit:app -- src/cplay/config.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/cplay src/App.tsx
git commit -m "feat: add CPlay CRM configuration layer"
```

---

### Task 2: Estender o schema Supabase para produtos, origens e oportunidades

**Files:**
- Modify: `supabase/schemas/01_tables.sql`
- Modify: `supabase/schemas/04_triggers.sql`
- Modify: `supabase/schemas/05_policies.sql`
- Modify: `supabase/schemas/06_grants.sql`
- Create: migration em `supabase/migrations/`

**Interfaces:**
- Produces tables: `products`, `lead_sources`.
- Extends `deals` with `product_id`, `lead_source_id`, `primary_contact_id`, `next_follow_up_at`, `next_follow_up_type`, `next_follow_up_note`.

- [ ] **Step 1: Adicionar tabelas ao schema**

```sql
create table public.products (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    name text not null,
    category text,
    description text,
    base_price bigint,
    active boolean not null default true,
    display_order integer not null default 0,
    color text
);

create table public.lead_sources (
    id bigint generated by default as identity primary key,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    name text not null,
    active boolean not null default true,
    display_order integer not null default 0
);
```

- [ ] **Step 2: Estender `deals`**

```sql
alter table public.deals
  add column product_id bigint,
  add column lead_source_id bigint,
  add column primary_contact_id bigint,
  add column next_follow_up_at timestamp with time zone,
  add column next_follow_up_type text,
  add column next_follow_up_note text;
```

- [ ] **Step 3: Adicionar foreign keys e índices**

```sql
alter table public.deals
  add constraint deals_product_id_fkey foreign key (product_id) references public.products(id),
  add constraint deals_lead_source_id_fkey foreign key (lead_source_id) references public.lead_sources(id),
  add constraint deals_primary_contact_id_fkey foreign key (primary_contact_id) references public.contacts(id);

create index deals_product_id_idx on public.deals(product_id);
create index deals_lead_source_id_idx on public.deals(lead_source_id);
create index deals_primary_contact_id_idx on public.deals(primary_contact_id);
```

- [ ] **Step 4: Adicionar RLS/grants seguindo o padrão das tabelas existentes**

Garantir `select/insert/update/delete` para usuários autenticados conforme as policies atuais do CRM.

- [ ] **Step 5: Adicionar trigger de `updated_at` para novas tabelas**

Reutilizar a função já existente no projeto para manter `updated_at`.

- [ ] **Step 6: Gerar migration a partir dos schemas**

Run: `supabase db diff -f cplay_commercial_foundation`
Expected: nova migration contendo apenas as mudanças acima.

- [ ] **Step 7: Validar banco local**

Run: `supabase db reset`
Expected: schema aplicado sem erro e seed concluído.

- [ ] **Step 8: Commit**

```bash
git add supabase/schemas supabase/migrations
git commit -m "feat: add CPlay commercial data model"
```

---

### Task 3: Criar CRUD de Produtos/Serviços

**Files:**
- Create: `src/components/cplay/products/ProductList.tsx`
- Create: `src/components/cplay/products/ProductCreate.tsx`
- Create: `src/components/cplay/products/ProductEdit.tsx`
- Create: `src/components/cplay/products/ProductInputs.tsx`
- Test: `src/components/cplay/products/ProductInputs.test.tsx`
- Modify: ponto de registro de resources no CRM.

**Interfaces:**
- Consumes resource `products`.
- Produces seleção utilizável por oportunidades.

- [ ] **Step 1: Escrever teste para preço-base editável**

```tsx
it("permite cadastrar produto sem preço-base obrigatório", async () => {
  // render ProductInputs dentro do form helper do projeto
  // preencher nome e salvar sem base_price
  // esperar ausência de erro de validação em base_price
});
```

- [ ] **Step 2: Implementar campos**

Usar os inputs já adotados pelo Atomic CRM para:
`name`, `category`, `description`, `base_price`, `active`, `display_order`, `color`.

- [ ] **Step 3: Criar List/Create/Edit seguindo patterns existentes**

Ordenação padrão: `display_order ASC`, depois `name ASC`.

- [ ] **Step 4: Registrar resource `products`**

Adicionar navegação administrativa sem modificar o data provider.

- [ ] **Step 5: Rodar testes**

Run: `npm run test:unit:app -- src/components/cplay/products/ProductInputs.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/cplay/products src/components/atomic-crm/root
git commit -m "feat: add product and service management"
```

---

### Task 4: Criar CRUD de Origens de Lead

**Files:**
- Create: `src/components/cplay/lead-sources/LeadSourceList.tsx`
- Create: `src/components/cplay/lead-sources/LeadSourceCreate.tsx`
- Create: `src/components/cplay/lead-sources/LeadSourceEdit.tsx`
- Create: `src/components/cplay/lead-sources/LeadSourceInputs.tsx`
- Test: `src/components/cplay/lead-sources/LeadSourceInputs.test.tsx`
- Modify: ponto de registro de resources no CRM.

**Interfaces:**
- Consumes resource `lead_sources`.
- Produces seleção utilizável por oportunidades.

- [ ] **Step 1: Testar criação com nome obrigatório**

```tsx
it("exige nome da origem", async () => {
  // render form, submit vazio e esperar erro no campo name
});
```

- [ ] **Step 2: Implementar campos**

Campos: `name`, `active`, `display_order`.

- [ ] **Step 3: Criar CRUD e registrar resource**

Ordenar por `display_order ASC` e `name ASC`.

- [ ] **Step 4: Rodar teste**

Run: `npm run test:unit:app -- src/components/cplay/lead-sources/LeadSourceInputs.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/cplay/lead-sources src/components/atomic-crm/root
git commit -m "feat: add lead source management"
```

---

### Task 5: Adaptar Contatos e Empresas para operação local

**Files:**
- Modify: formulários em `src/components/atomic-crm/contacts/`
- Modify: formulários em `src/components/atomic-crm/companies/`
- Test: testes existentes ou novos testes focados nesses formulários.

**Interfaces:**
- Contacts continuam aceitando `company_id = null`.
- Companies continuam independentes e podem ter vários contacts.

- [ ] **Step 1: Escrever teste garantindo contato sem empresa**

```tsx
it("permite salvar contato sem empresa", async () => {
  // preencher nome/WhatsApp e deixar company_id vazio
  // esperar submit válido
});
```

- [ ] **Step 2: Garantir empresa opcional nos inputs de contato**

Não adicionar validação `required` em `company_id`.

- [ ] **Step 3: Expor telefone/WhatsApp, cargo e email prioritariamente**

Reutilizar `phone_jsonb` e `email_jsonb`; não criar colunas duplicadas sem necessidade.

- [ ] **Step 4: Ajustar empresas para cidade/bairro**

Usar `city` existente; adicionar `bairro` como campo novo somente se não houver campo equivalente seguro no schema. Se necessário, adicionar `neighborhood text` via migration incremental.

- [ ] **Step 5: Rodar testes**

Run: `npm run test:unit:app`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/atomic-crm/contacts src/components/atomic-crm/companies supabase
git commit -m "feat: adapt contacts and companies for CPlay"
```

---

### Task 6: Adaptar criação/edição de Oportunidade

**Files:**
- Modify: `src/components/atomic-crm/deals/DealInputs.tsx`
- Modify: `src/components/atomic-crm/deals/DealCreate.tsx`
- Modify: `src/components/atomic-crm/deals/DealEdit.tsx`
- Test: `src/components/atomic-crm/deals/DealInputs.test.tsx`

**Interfaces:**
- Required: `primary_contact_id`, `sales_id`, `stage`.
- Optional: `company_id`, `product_id`, `lead_source_id`.
- `amount` always editable.

- [ ] **Step 1: Testar contato e responsável obrigatórios**

```tsx
it("exige contato principal e responsável", async () => {
  // submit sem os campos e esperar erros de validação
});
```

- [ ] **Step 2: Testar sugestão de preço-base**

```tsx
it("copia base_price para amount ao selecionar produto sem travar edição", async () => {
  // selecionar produto base_price=150000
  // esperar amount=150000
  // editar amount para 135000
  // esperar valor 135000 permanecer
});
```

- [ ] **Step 3: Implementar seleção de produto e origem**

Usar reference inputs filtrando `active = true`.

- [ ] **Step 4: Implementar sugestão de valor**

Ao mudar `product_id`, preencher `amount` apenas como sugestão. Não reaplicar automaticamente depois que o usuário editar `amount` manualmente durante aquela edição.

- [ ] **Step 5: Adicionar follow-up principal**

Campos no form: `next_follow_up_at`, `next_follow_up_type`, `next_follow_up_note`.

- [ ] **Step 6: Rodar testes focados**

Run: `npm run test:unit:app -- src/components/atomic-crm/deals/DealInputs.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/atomic-crm/deals
git commit -m "feat: adapt deal workflow for CPlay"
```

---

### Task 7: Adaptar Kanban e card comercial

**Files:**
- Modify: `src/components/atomic-crm/deals/DealCard.tsx`
- Modify: `src/components/atomic-crm/deals/DealList.tsx`
- Modify: `src/components/atomic-crm/deals/DealColumn.tsx` somente se necessário.
- Extend: `src/components/atomic-crm/deals/DealList.test.tsx`

**Interfaces:**
- Consumes `cplayDealStages`.
- Card exibe empresa/contato, produto, amount, responsável e follow-up.

- [ ] **Step 1: Estender teste de colunas**

```tsx
it("renderiza as oito colunas CPlay incluindo Perdido", async () => {
  // render DealList
  // assert headings Novo..Perdido
});
```

- [ ] **Step 2: Ajustar fonte dos estágios**

Remover dependência de estágios genéricos no fluxo CPlay e consumir a configuração injetada.

- [ ] **Step 3: Atualizar `DealCard`**

Ordem visual:
1. `company.name` se houver; senão contato principal
2. contato principal
3. produto
4. amount
5. responsável
6. próximo follow-up

- [ ] **Step 4: Garantir drag-and-drop entre as oito colunas**

Reutilizar lógica existente de `@hello-pangea/dnd`; persistir `stage` e `index` como hoje.

- [ ] **Step 5: Rodar teste do Kanban**

Run: `npm run test:unit:app -- src/components/atomic-crm/deals/DealList.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/atomic-crm/deals
git commit -m "feat: add CPlay sales kanban"
```

---

### Task 8: Registrar histórico de follow-up e mudanças comerciais

**Files:**
- Modify: `supabase/schemas/02_functions.sql` e/ou `04_triggers.sql`
- Modify: UI de deal notes/activity que já existe no Atomic CRM.
- Test: testes unitários/e2e de histórico.

**Interfaces:**
- Reutiliza `deal_notes`/activity existente.
- Não cria um segundo sistema de timeline se o atual suportar os eventos necessários.

- [ ] **Step 1: Mapear tipos de evento existentes**

Confirmar como `deal_notes.type` e activity aggregation tratam notas/eventos.

- [ ] **Step 2: Criar evento para conclusão/substituição de follow-up**

Quando um follow-up ativo for marcado como concluído ou substituído por outro, persistir uma entrada em `deal_notes` contendo data, tipo, observação e `sales_id`.

- [ ] **Step 3: Registrar mudanças relevantes**

Adicionar histórico para mudança de estágio, responsável e valor usando o mecanismo existente, evitando duplicidade de eventos.

- [ ] **Step 4: Testar timeline**

Criar oportunidade, alterar estágio e follow-up, e verificar eventos no histórico.

- [ ] **Step 5: Commit**

```bash
git add supabase src/components/atomic-crm
git commit -m "feat: track commercial activity history"
```

---

### Task 9: Português-BR e branding visual mínimo

**Files:**
- Create: `src/cplay/i18n/ptBR.ts` ou equivalente conforme provider atual.
- Modify: provider de i18n existente.
- Modify: assets/config de logo somente quando houver asset oficial disponível.

**Interfaces:**
- UI principal em Português-BR.
- Fallback técnico pode permanecer inglês apenas onde ainda não houver tradução, sem bloquear release.

- [ ] **Step 1: Identificar provider i18n atual**

Reutilizar `ra-i18n-polyglot` e mensagens existentes.

- [ ] **Step 2: Adicionar traduções dos fluxos alterados**

Traduzir menu, contatos, empresas, oportunidades, produtos, origens, follow-up, ações de criar/editar/salvar e estados do Kanban.

- [ ] **Step 3: Aplicar título `CPlay Comercial`**

Garantir título no layout/login/document title quando suportado pelo componente CRM.

- [ ] **Step 4: Rodar smoke tests**

Run: `npm run typecheck && npm run test:unit:app`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/cplay src/components
git commit -m "feat: add CPlay branding and pt-BR copy"
```

---

### Task 10: E2E e verificação final da fundação

**Files:**
- Create/Modify: testes em `e2e/` seguindo estrutura existente.
- Update: documentação de setup se novos passos forem necessários.

**Interfaces:**
- Valida o fluxo completo, não apenas componentes isolados.

- [ ] **Step 1: Escrever cenário E2E principal**

Fluxo:
1. criar produto com preço-base
2. criar origem
3. criar contato sem empresa
4. criar oportunidade com produto/origem/responsável
5. confirmar valor sugerido
6. alterar valor manualmente
7. definir follow-up
8. mover card entre estágios
9. confirmar `Perdido` visível
10. confirmar histórico

- [ ] **Step 2: Rodar typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Rodar unit tests**

Run: `npm run test:unit:app`
Expected: PASS.

- [ ] **Step 4: Rodar build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Rodar E2E**

Run: `make test-e2e`
Expected: cenário CPlay e suíte existente sem regressões críticas.

- [ ] **Step 6: Revisar diff contra a spec**

Confirmar explicitamente cada critério de sucesso descrito em `docs/superpowers/specs/2026-09-16-cplay-comercial-foundation-design.md`.

- [ ] **Step 7: Commit final de QA**

```bash
git add e2e docs
git commit -m "test: validate CPlay commercial foundation"
```

---

## Self-Review

- Spec coverage: todas as entidades e regras aprovadas estão mapeadas para Tasks 1–10.
- Placeholder scan: nenhuma etapa depende de `TBD`/`TODO`; pontos condicionais determinam explicitamente reutilizar o mecanismo existente antes de criar duplicação.
- Type consistency: `products`, `lead_sources`, `product_id`, `lead_source_id`, `primary_contact_id` e campos `next_follow_up_*` usam os mesmos nomes em schema, UI e testes.
- Scope control: extensão do WhatsApp Web permanece fora desta fundação e terá plano próprio posteriormente.
