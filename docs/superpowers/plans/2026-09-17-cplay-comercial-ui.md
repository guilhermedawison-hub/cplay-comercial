# CPlay Comercial UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current CPlay Comercial foundation into a cohesive blue-led premium SaaS interface while preserving all approved CRM behavior and data contracts.

**Architecture:** Keep Atomic CRM behavior intact and add CPlay-owned presentation through centralized tokens, injected layout/dashboard components, and targeted visual changes to existing CRM screens. Prefer composition and wrappers over invasive upstream rewrites; only touch Atomic components where a reusable visual treatment cannot be achieved cleanly from the CPlay layer.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Tailwind CSS 4, shadcn/Radix UI, React Admin / ra-core, Vitest, Playwright, Supabase.

**Spec:** `docs/superpowers/specs/2026-09-17-cplay-comercial-ui-design.md`

## Global Constraints

- DKW System is the primary visual reference, but the result must be recognizably CPlay and must not be a recolored clone.
- CPlay blue is the primary brand/action color; exact values must be centralized in semantic tokens.
- Preserve Supabase as source of truth and preserve all existing CRUD/data flows.
- Preserve approved Kanban stages exactly: `Novo → Contatado → Interessado → Reunião → Proposta → Negociação → Fechado → Perdido`.
- Preserve company-optional deals, required primary contact in UI, required salesperson in UI, product price suggestion with manual amount override, deal filters, follow-up history logging, PT-BR localization, and authentication.
- Do not add unsupported metrics, fake data, WhatsApp automation, official WhatsApp API, bulk messaging, AI agents, new notification systems, new search backends, or a public marketing landing in this phase.
- Mobile must be treated as a first-class interface, with validation around 390 px width.
- Status meaning must not rely on color alone.
- Every task must finish with targeted tests and a commit.

---

### Task 1: Establish CPlay design tokens and visual primitives

**Files:**
- Create: `src/cplay/ui/tokens.ts`
- Create: `src/cplay/ui/status.ts`
- Create: `src/cplay/ui/status.test.ts`
- Modify: `src/index.css`

**Interfaces:**
- Produces: `cplayUiTokens`, `getFollowUpVisualState(date?: string | null)`, semantic CSS variables consumed by every later UI task.

- [ ] **Step 1: Write the failing semantic-state test**

```ts
import { describe, expect, it, vi } from "vitest";
import { getFollowUpVisualState } from "./status";

describe("getFollowUpVisualState", () => {
  it("distinguishes overdue, due-soon and missing follow-ups", () => {
    vi.setSystemTime(new Date("2026-09-17T12:00:00Z"));
    expect(getFollowUpVisualState(null)).toBe("missing");
    expect(getFollowUpVisualState("2026-09-17T10:00:00Z")).toBe("overdue");
    expect(getFollowUpVisualState("2026-09-17T18:00:00Z")).toBe("due-soon");
  });
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm run test:unit:app -- src/cplay/ui/status.test.ts`
Expected: FAIL because `status.ts` does not exist.

- [ ] **Step 3: Add semantic token exports**

```ts
export const cplayUiTokens = {
  radius: "0.75rem",
  contentMax: "1600px",
  primary: "oklch(0.57 0.19 255)",
  primarySubtle: "oklch(0.96 0.025 255)",
} as const;
```

Implement `getFollowUpVisualState` as a pure function returning `"missing" | "overdue" | "due-soon" | "scheduled"` using a 24-hour due-soon window.

- [ ] **Step 4: Replace neutral default theme values with CPlay semantic variables**

In `src/index.css`, keep existing Tailwind/shadcn variable names but set CPlay-owned light/dark values for `--primary`, `--ring`, sidebar active states, background/surface/border contrast, and add semantic variables such as `--cplay-primary-subtle`, `--cplay-success`, `--cplay-warning`, and `--cplay-danger`.

- [ ] **Step 5: Run focused and static checks**

Run:
`npm run test:unit:app -- src/cplay/ui/status.test.ts`
`npm run typecheck`
`npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/cplay/ui src/index.css
git commit -m "feat: add CPlay UI tokens and semantic states"
```

### Task 2: Build the CPlay application shell

**Files:**
- Create: `src/components/cplay/layout/CPlayLayout.tsx`
- Create: `src/components/cplay/layout/CPlaySidebar.tsx`
- Create: `src/components/cplay/layout/CPlayHeader.tsx`
- Create: `src/components/cplay/layout/CPlayLayout.test.tsx`
- Modify: `src/App.tsx`
- Read/Reuse: `src/components/atomic-crm/layout/Layout.tsx`, `Header.tsx`, `MobileLayout.tsx`, `MobileNavigation.tsx`

**Interfaces:**
- Produces: `CPlayLayout`, injected through the existing `CRM` `layout` prop.
- Consumes: current React Admin resource registration and router state.

- [ ] **Step 1: Write a shell test for the approved resource order**

Test should render the sidebar and assert this visible order: Dashboard, Oportunidades, Contatos, Empresas, Produtos/Serviços, Origens, Configurações. Do not render an `Atividades` navigation item unless an actual routable resource exists.

- [ ] **Step 2: Run the shell test and verify failure**

Run: `npm run test:unit:app -- src/components/cplay/layout/CPlayLayout.test.tsx`
Expected: FAIL because CPlay shell components do not exist.

- [ ] **Step 3: Implement CPlay sidebar and quiet top bar**

Use existing navigation/router primitives and Lucide icons. Active navigation must use CPlay blue + `primary-subtle`; inactive items remain neutral. Keep user/profile/settings controls reachable without adding unsupported notifications or global search.

- [ ] **Step 4: Compose `CPlayLayout` around existing page content**

```tsx
export const CPlayLayout = ({ children }: LayoutProps) => (
  <div className="min-h-dvh bg-background">
    <CPlaySidebar />
    <div className="lg:pl-[248px]">
      <CPlayHeader />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  </div>
);
```

On mobile, reuse current mobile navigation behavior rather than inventing a second routing model.

- [ ] **Step 5: Inject the shell from `src/App.tsx`**

Pass `layout={CPlayLayout}` while keeping title, currency, deal stages, and pipeline statuses unchanged.

- [ ] **Step 6: Run test/typecheck/lint**

Run targeted Vitest + `npm run typecheck` + `npm run lint`.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/cplay/layout
git commit -m "feat: add CPlay application shell"
```

### Task 3: Add shared CPlay workspace primitives

**Files:**
- Create: `src/components/cplay/ui/WorkspaceCard.tsx`
- Create: `src/components/cplay/ui/MetricCard.tsx`
- Create: `src/components/cplay/ui/StatusBadge.tsx`
- Create: `src/components/cplay/ui/FilterBar.tsx`
- Create: `src/components/cplay/ui/WorkspacePrimitives.test.tsx`

**Interfaces:**
- Produces reusable primitives for dashboard, Kanban, details, list screens, and configuration resources.

- [ ] **Step 1: Write component tests**

Assert that `StatusBadge` renders text + icon for warning/danger states so meaning is not color-only, and `MetricCard` exposes title/value/supporting label with accessible text.

- [ ] **Step 2: Run test and verify failure**

Run: `npm run test:unit:app -- src/components/cplay/ui/WorkspacePrimitives.test.tsx`

- [ ] **Step 3: Implement compact primitives**

Use thin borders, moderate radius, restrained shadow, compact typography, and Tailwind classes only from semantic tokens. Avoid page-specific colors.

- [ ] **Step 4: Run tests/static checks and commit**

Commit message: `feat: add CPlay workspace UI primitives`.

### Task 4: Turn the dashboard into a commercial command center

**Files:**
- Create: `src/components/cplay/dashboard/CPlayDashboard.tsx`
- Create: `src/components/cplay/dashboard/CPlayDashboard.test.tsx`
- Reuse data logic from: `src/components/atomic-crm/dashboard/Dashboard.tsx`, `DealsPipeline.tsx`, `DashboardActivityLog.tsx`, `TasksList.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `CPlayDashboard`, injected through `CRM` `dashboard` prop.
- Consumes: only metrics derivable from current CRM data.

- [ ] **Step 1: Write a dashboard test**

Assert headings/cards for: `Oportunidades abertas`, `Valor potencial`, `Follow-ups pendentes`, and `Fechados no período`. If a metric cannot be derived reliably from current data provider responses, omit it and adjust the test rather than fabricating it.

- [ ] **Step 2: Verify failure**

Run focused Vitest.

- [ ] **Step 3: Implement dashboard composition**

Use existing list/provider hooks and `MetricCard`; present KPIs first, pipeline summary second, follow-ups/tasks third, recent activity last. Do not keep the generic starter/Welcome presentation in the authenticated dashboard.

- [ ] **Step 4: Inject dashboard in `src/App.tsx`**

Pass `dashboard={CPlayDashboard}`.

- [ ] **Step 5: Run targeted test, typecheck, lint and commit**

Commit message: `feat: redesign CPlay commercial dashboard`.

### Task 5: Refine Kanban columns, cards and filters

**Files:**
- Modify: `src/components/atomic-crm/deals/DealCard.tsx`
- Modify: `src/components/atomic-crm/deals/DealColumn.tsx`
- Modify: `src/components/atomic-crm/deals/DealList.tsx`
- Modify: `src/components/atomic-crm/deals/DealListContent.tsx`
- Create: `src/components/atomic-crm/deals/DealCard.test.tsx`
- Extend: `src/components/atomic-crm/deals/DealList.test.tsx`

**Interfaces:**
- Preserves existing drag/drop update contract and existing filters.
- Consumes `StatusBadge` and `getFollowUpVisualState`.

- [ ] **Step 1: Add failing card hierarchy tests**

Test company-first fallback behavior, product/service, BRL amount, salesperson and next follow-up. Add a follow-up state assertion for overdue vs missing.

- [ ] **Step 2: Add failing Kanban stage-order test**

Assert all eight approved stages render in exact order and that `Perdido` is present as a normal visible column.

- [ ] **Step 3: Implement compact card styling**

Preserve current fields and link/drag behavior. Use icon + text + restrained semantic color for follow-up status. Do not add unrelated metadata.

- [ ] **Step 4: Implement column header totals**

Render stage label + deal count; render aggregate amount only from deals currently loaded in that column.

- [ ] **Step 5: Consolidate current filters visually**

Keep company, product, lead source, salesperson and ownership filter semantics unchanged; only alter presentation into a compact bar/popover based on width.

- [ ] **Step 6: Run focused tests and regression commands**

Run deal tests, `npm run typecheck`, `npm run lint`.

- [ ] **Step 7: Commit**

Commit message: `feat: refine CPlay opportunity Kanban`.

### Task 6: Redesign opportunity create/edit/detail workspace without changing rules

**Files:**
- Modify: `src/components/atomic-crm/deals/DealCreate.tsx`
- Modify: `src/components/atomic-crm/deals/DealEdit.tsx`
- Modify: `src/components/atomic-crm/deals/DealInputs.tsx`
- Create: `src/components/atomic-crm/deals/DealInputs.test.tsx`

**Interfaces:**
- Preserves current form field names and mutations.
- Required UI rules: primary contact, product/service, salesperson, stage.
- Company remains optional; amount remains editable after product price sync.

- [ ] **Step 1: Write failing business-rule tests**

Cover required fields, optional `company_id`, product base-price suggestion, and a manual amount edit surviving until the user intentionally changes product.

- [ ] **Step 2: Run focused test and verify failure**

Run `npm run test:unit:app -- src/components/atomic-crm/deals/DealInputs.test.tsx`.

- [ ] **Step 3: Recompose form sections visually**

Group fields into identity/context, commercial details, ownership/stage, dates/follow-up. Keep single-column mobile behavior and predictable action placement.

- [ ] **Step 4: Refine edit/detail header**

Present company/contact identity, stage, product, amount and salesperson with compact hierarchy while preserving notes/history/follow-up visibility.

- [ ] **Step 5: Run focused tests/static checks and commit**

Commit message: `feat: redesign CPlay opportunity workspace`.

### Task 7: Align contacts, companies and configuration resources

**Files:**
- Modify relevant list/show/input files under `src/components/atomic-crm/contacts/`
- Modify relevant list/show/input files under `src/components/atomic-crm/companies/`
- Modify relevant files under `src/components/cplay/products/`
- Modify relevant files under `src/components/cplay/lead-sources/`
- Add targeted tests in each touched resource folder.

**Interfaces:**
- Preserves contact-without-company support and existing CRUD behavior.
- Products/services retain name, category, description, base price, active state and display order.

- [ ] **Step 1: Add a contact-without-company regression test**

Create/render a contact with `company_id = null` and assert list/detail display succeeds without placeholder errors.

- [ ] **Step 2: Add configuration-resource presentation tests**

Assert base price renders in BRL, active/inactive state is textually identifiable, and lead source rows remain editable.

- [ ] **Step 3: Apply shared CPlay visual language**

Use consistent page headers, compact list rows/cards, muted metadata, restrained filter controls, and common empty/loading treatment. Do not over-design admin resources.

- [ ] **Step 4: Run resource tests/typecheck/lint and commit**

Commit message: `feat: align CPlay CRM resource screens`.

### Task 8: Complete mobile adaptation

**Files:**
- Modify: `src/components/atomic-crm/layout/MobileLayout.tsx`
- Modify: `src/components/atomic-crm/layout/MobileHeader.tsx`
- Modify: `src/components/atomic-crm/layout/MobileNavigation.tsx`
- Modify: `src/components/atomic-crm/dashboard/MobileDashboard.tsx`
- Modify mobile-specific contact/task screens only where required by the new CPlay shell.
- Add/extend mobile tests near existing `MobileRefreshButton.test.tsx` and Playwright E2E coverage.

**Interfaces:**
- Preserves current mobile routing and pull-to-refresh behavior.
- Kanban must not compress eight columns into one viewport.

- [ ] **Step 1: Write mobile navigation regression tests**

Assert primary destinations remain reachable and active state is identifiable at mobile width.

- [ ] **Step 2: Implement 390 px spacing and tap-target pass**

Use single-column forms, compact list metadata, readable header/actions, and touch targets at least 44 px where interactive.

- [ ] **Step 3: Choose mobile Kanban behavior based on existing drag library capability**

If touch drag remains reliable in Playwright/manual verification, keep controlled horizontal stage scrolling. Otherwise expose explicit stage change in deal actions and avoid fragile touch drag.

- [ ] **Step 4: Run unit tests and targeted mobile E2E**

Use existing Playwright mobile project and add assertions for navigation, opportunity list/Kanban access and create/edit form reachability.

- [ ] **Step 5: Commit**

Commit message: `feat: refine CPlay mobile CRM experience`.

### Task 9: Stabilize E2E copy and critical commercial flows

**Files:**
- Modify: `e2e/fixtures.ts`
- Modify existing specs whose labels changed legitimately.
- Create: `e2e/cplayCommercialFlow.spec.ts`

**Interfaces:**
- Tests PT-BR/CPlay UI rather than Atomic CRM English starter copy.

- [ ] **Step 1: Add critical flow E2E**

Cover login, open opportunities, create a deal with primary contact/product/salesperson, verify base-price suggestion, manually change amount, save, move stage, and confirm the card remains visible.

- [ ] **Step 2: Add contact-without-company E2E**

Create a standalone contact and verify list/detail accessibility.

- [ ] **Step 3: Remove brittle old-brand assertions**

Use semantic roles and current PT-BR labels; title assertions must target `CPlay Comercial`.

- [ ] **Step 4: Run E2E**

Run the repository Playwright command used by CI. Expected: all desktop/mobile tests pass or only explicitly justified skips remain.

- [ ] **Step 5: Commit**

Commit message: `test: cover CPlay commercial UI flows`.

### Task 10: Final QA, build and visual acceptance

**Files:**
- Modify only files required by failures found in this validation pass.
- Update: `docs/CPLAY_IMPLEMENTATION.md` with the final UI phase status and validation results.

**Interfaces:**
- No new UI scope; this task only validates and fixes regressions against the approved spec.

- [ ] **Step 1: Run all static/unit checks**

Run:

```bash
npm run typecheck
npm run lint
npm run prettier
npm run test:unit:app
npm run build
```

Expected: PASS.

- [ ] **Step 2: Run full E2E suite**

Use CI-equivalent Playwright execution. Expected: PASS.

- [ ] **Step 3: Perform desktop visual acceptance**

Verify common laptop widths for sidebar/header spacing, dashboard density, eight-stage Kanban, filters, deal detail, contacts/companies, products and lead sources.

- [ ] **Step 4: Perform 390 px mobile acceptance**

Verify no clipped primary actions, readable cards, reachable navigation, usable forms, and no nested-modal trap.

- [ ] **Step 5: Verify business-rule regressions manually or by E2E evidence**

Confirm: company optional, primary contact required, salesperson required, product suggestion/manual amount override, Perdido visible, follow-up state/history intact, PT-BR labels intact.

- [ ] **Step 6: Update implementation documentation**

Record what was implemented, test commands run, remaining known limitations if any, and explicitly state that landing/WhatsApp/AI remain out of scope.

- [ ] **Step 7: Commit final QA fixes/documentation**

```bash
git add .
git commit -m "chore: finalize CPlay UI validation"
```

## Self-Review

- Spec coverage: tokens, application shell, dashboard, Kanban, deal workspace, contacts/companies, products/lead sources, forms, mobile, accessibility, PT-BR, testing and final CI all have explicit tasks.
- Scope check: public landing, WhatsApp, AI, unsupported analytics and new backend workflows remain excluded.
- Type/interface consistency: shared primitives and status helper are introduced before downstream consumption; existing CRM field/resource names remain unchanged.
- Placeholder scan: no TBD/TODO/"implement later" requirements remain in the plan.
