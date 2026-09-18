# CPlay Comercial UI Design

Date: 2026-09-17
Branch: `setup/cplay-foundation`
Status: Approved direction, pending implementation plan

## 1. Objective

Transform the current CPlay Comercial foundation into a cohesive, premium SaaS interface using DKW System as the primary visual reference, while deliberately avoiding literal copying. The final product should feel like a real commercial operating system: modern, technological, trustworthy, clear, and optimized for daily sales work.

The reference should influence hierarchy, product presentation, density, module organization, pipeline prominence, and overall SaaS perception. The CPlay identity must remain distinct through its own blue palette, spacing, component treatment, copy, information architecture, and interaction details.

## 2. Design principles

The UI must prioritize:

- operational clarity over decoration
- commercial productivity over visual novelty
- CPlay identity over imitation of the reference
- compact information density without visual clutter
- consistent desktop and mobile behavior
- reusable tokens and components instead of page-specific styling
- accessibility, legibility, and predictable interactions

The interface must avoid:

- generic admin-template appearance
- excessive gradients, glow, or glass effects
- oversized cards and unnecessary whitespace
- excessive use of status colors
- visual patterns copied directly from DKW
- decorative elements that compete with CRM data

## 3. Visual direction

### 3.1 Brand expression

The product should feel like a combination of:

- DKW System for commercial SaaS structure and product presentation
- Attio / Linear for restraint, visual hierarchy, and interface polish
- Pipedrive for sales-oriented operational clarity
- CPlay for brand identity and blue-led visual language

The result should be recognizably CPlay, not a recolored DKW clone.

### 3.2 Color system

Create a tokenized CPlay palette with these semantic groups:

- `primary`: CPlay blue for primary actions, selected navigation, links, focus states, and key highlights
- `primary-subtle`: low-contrast blue surface for active states, chips, selected filters, and contextual emphasis
- `background`: neutral application background
- `surface`: cards, sheets, modals, tables, and Kanban columns
- `surface-muted`: secondary panels and low-priority areas
- `border`: restrained neutral dividers
- `text-primary`: high-contrast titles and main content
- `text-secondary`: metadata and supporting information
- `success`: closed/won states and positive confirmation
- `warning`: upcoming or attention-required follow-up states
- `danger`: lost deals, destructive actions, overdue states

The implementation should use semantic CSS variables / design tokens rather than hardcoded page colors. Exact blue values should be centralized so the CPlay shade can be tuned later without refactoring components.

### 3.3 Typography

Use the existing application typography stack unless a change is justified by compatibility and bundle impact. The hierarchy should be refined through weight, size, line-height, and spacing rather than introducing multiple font families.

Recommended hierarchy:

- page title: strong but compact
- section heading: medium emphasis
- card title: semibold
- body: regular
- metadata: smaller and muted
- labels: medium, concise, high legibility

The UI should avoid marketing-sized typography inside the operational CRM.

### 3.4 Shape, borders, and elevation

- moderate border radius
- thin neutral borders
- minimal shadow, reserved for overlays or elevated interaction states
- avoid heavy floating-card treatment
- use spacing and border contrast to separate information before using shadow

## 4. Global application shell

### 4.1 Desktop sidebar

The sidebar becomes the main visual anchor of CPlay Comercial.

Required behavior:

- CPlay branding at the top
- clear active state using CPlay blue
- compact icon + label navigation
- visually grouped commercial resources
- collapsible behavior when supported by the current layout architecture
- user/profile/settings access in a predictable area

Initial navigation structure:

1. Dashboard
2. Oportunidades
3. Contatos
4. Empresas
5. Atividades
6. Produtos/Serviços
7. Origens
8. Configurações

The exact route set must respect resources already available in the current Atomic CRM foundation; no empty navigation items should be created solely for appearance.

### 4.2 Top bar

The top bar should be visually quiet and useful. It may contain:

- current page context/title
- global or contextual search where currently supported
- primary create action
- user/account controls

Do not add notifications, universal search, or other controls unless the current product behavior supports them or they are implemented as a separate approved feature.

### 4.3 Page layout

Use a consistent content width, page padding, vertical rhythm, title/action header, and section spacing across all resources.

The layout must remain efficient on common laptop widths; avoid excessive horizontal padding that reduces usable CRM space.

## 5. Dashboard

The dashboard should become a commercial command center rather than a generic starter screen.

Priority order:

1. core commercial KPIs
2. pipeline status / value distribution
3. next follow-ups and overdue actions
4. recent activity
5. useful operational summaries

Candidate KPI cards:

- oportunidades abertas
- valor potencial
- follow-ups pendentes
- fechados no período

Only metrics supported by the existing data model should be shown. Do not introduce fabricated performance metrics or calculations without defined data sources.

The dashboard should use restrained cards, clear numerical hierarchy, and compact supporting labels. Charts are optional and should only be used where they improve decision-making.

## 6. Opportunities / Kanban

The Kanban is one of the primary screens and must receive the strongest visual refinement.

### 6.1 Stage columns

Maintain the approved stages:

`Novo → Contatado → Interessado → Reunião → Proposta → Negociação → Fechado → Perdido`

Each column header should show:

- stage label
- deal count
- aggregate amount when technically reliable from loaded data

`Perdido` must remain visibly accessible as a normal stage column.

### 6.2 Deal cards

Card hierarchy:

1. company name when present, otherwise primary contact
2. primary contact when company is present
3. product/service
4. potential amount
5. responsible salesperson
6. next follow-up
7. small status/tag indicators only when useful

Cards should be compact, readable, draggable, and consistent. Avoid filling cards with every available field.

### 6.3 Follow-up visual states

Use semantic emphasis for:

- overdue follow-up
- follow-up due soon
- no follow-up defined
- won deal
- lost deal

These states should rely on a combination of iconography, text, and restrained color so meaning does not depend on color alone.

### 6.4 Filters

Existing filters for company, product, lead source, salesperson, and ownership should be visually consolidated into a clean filter bar or popover pattern depending on available width.

## 7. Opportunity detail

The opportunity screen should feel like an operational workspace.

Recommended structure:

### Header summary

- company/contact identity
- stage
- product/service
- amount
- responsible salesperson
- primary actions

### Main content

- next follow-up
- contact/company context
- lead source
- expected close date
- notes
- activity/history timeline

The current deal history and follow-up behavior must remain intact. Styling must not obscure or remove historical records.

## 8. Contacts and companies

Contacts and companies remain separate resources.

### List view

Use clean rows/cards with:

- strong identity field
- relevant company/contact relationship
- salesperson
- useful metadata
- clear row action affordances

Filters and search should remain easy to reach without dominating the page.

### Detail view

The layout should group identity, communication data, ownership, commercial context, notes, and related activity into logical sections.

A contact without company must remain fully supported.

## 9. Products/services and lead sources

These are administrative/commercial configuration resources and should use a simpler visual treatment than the sales workspace.

Products/services should clearly expose:

- name
- category when present
- short description
- base price
- active/inactive state
- display order where relevant

Lead sources should remain easy to create, edit, activate/deactivate, and identify in deals.

Do not over-design these screens; clarity and maintenance speed are the priority.

## 10. Forms

All forms should adopt a consistent CPlay field system:

- clear labels
- required fields visibly indicated
- compact but comfortable input heights
- logical grouping
- responsive grids where appropriate
- predictable help/error text
- primary and secondary actions consistently positioned

Opportunity form requirements remain:

- primary contact required in UI
- company optional
- product/service required
- amount editable after product price suggestion
- salesperson required
- lead source supported
- stage required
- main follow-up editable

No visual redesign should weaken these business rules.

## 11. Tables, lists, chips, and status components

Create shared visual rules for:

- table/list headers
- row hover/focus
- selected rows
- filter chips
- status badges
- avatars/initials
- empty states
- pagination

Status colors should be semantic, not decorative. The product should not become a rainbow of stage colors.

## 12. Mobile behavior

Mobile must be treated as a first-class operational interface, not a scaled desktop.

### Navigation

Use the existing mobile layout patterns where practical, but align them visually with the CPlay system.

### Kanban

Do not attempt to display all eight columns simultaneously in a compressed viewport.

Preferred behavior:

- controlled horizontal stage navigation, or
- stage-focused view with easy next/previous or stage switching

The exact interaction should preserve existing drag/drop capabilities only if it remains usable on touch devices; otherwise moving stage through an explicit action is preferable to a fragile gesture.

### Forms

- single-column priority
- large tap targets
- sticky or easily reachable save action where appropriate
- avoid modal nesting

### Lists

Present essential information first and collapse secondary metadata where necessary.

## 13. Public landing / presentation layer

The immediate implementation priority is the internal CRM. A public landing page may later use the same design language, with DKW as structural inspiration, but it is a separate delivery scope unless explicitly included in the implementation plan.

When built, the landing should emphasize real product screens, modules, benefits, and CPlay identity without copying DKW copy, claims, statistics, partnership badges, or proprietary positioning.

## 14. Technical strategy

The current architecture already isolates the CPlay application layer from the Atomic CRM core through `src/App.tsx` and CPlay-specific configuration. The UI implementation should preserve that principle.

Preferred strategy:

- centralize brand/design tokens in CPlay-owned theme/style modules
- create or override layout-level CPlay components where necessary
- reuse existing Atomic CRM behavior and data flow
- modify Atomic components only when a reusable visual change cannot be achieved cleanly through composition, theme, or wrappers
- avoid broad upstream refactors unrelated to the visual system

The current `CRM` component supports layout/dashboard injection. This should be used where it reduces invasive changes.

## 15. Component boundaries

The UI work should be divided into independently understandable units:

- CPlay theme/tokens
- CPlay application shell
- CPlay dashboard presentation
- Kanban visual layer
- deal detail visual layer
- contacts/companies visual layer
- configuration-resource visual layer
- shared status/badge/filter primitives
- mobile adaptations

Each unit should consume existing data contracts rather than introducing a parallel state model.

## 16. Data and behavior preservation

This redesign is primarily a presentation-layer project.

It must preserve:

- Supabase as source of truth
- existing CRUD behavior
- Kanban drag/drop and stage updates
- deal filters
- product price suggestion with manual amount override
- company-optional deals
- primary contact requirement in UI
- salesperson requirement in UI
- follow-up history logging
- PT-BR localization
- current authentication model

Any behavior change discovered as necessary during implementation must be explicitly separated from visual refactoring and validated independently.

## 17. Accessibility and UX requirements

- maintain sufficient text/background contrast
- visible keyboard focus states
- no status meaning conveyed by color alone
- touch targets appropriate for mobile
- labels associated with form controls
- destructive actions visually distinct from primary actions
- loading, empty, and error states should remain understandable

## 18. Testing strategy

The visual redesign must not be considered complete based only on screenshots.

Validation should include:

- TypeScript typecheck
- ESLint / formatting
- unit tests affected by component changes
- existing E2E suite updated only where labels/layout legitimately changed
- new targeted tests for critical CPlay UI behavior where practical
- production build
- desktop checks at common laptop widths
- mobile checks around 390px width
- Kanban drag/drop or stage transition validation
- opportunity create/edit validation
- product price suggestion/manual override validation
- contact without company validation
- follow-up display/history validation

## 19. Implementation order

Recommended sequence:

1. theme and design tokens
2. global shell: sidebar, top bar, page spacing
3. shared primitives: cards, badges, filter treatment, empty/loading states
4. dashboard
5. Kanban and deal cards
6. opportunity detail/create/edit
7. contacts and companies
8. products/services and lead sources
9. mobile refinements
10. final visual regression and CI validation

This order reduces rework because page-level screens inherit the global system before being polished individually.

## 20. Out of scope for this UI phase

Unless separately approved, this phase does not include:

- WhatsApp automation
- official WhatsApp API integration
- bulk messaging
- AI agents
- new CRM business workflows unrelated to UI
- public marketing landing implementation
- new notification subsystem
- new global search backend
- analytics not supported by current data

## 21. Acceptance criteria

The UI phase is complete when:

- CPlay Comercial has a visually consistent blue-led design system
- the product no longer visually resembles a generic Atomic CRM starter
- DKW influence is visible as product-level inspiration without literal duplication
- sidebar, dashboard, Kanban, deal detail, forms, contacts, companies, products, and lead sources share one coherent visual language
- desktop and mobile flows remain functional
- approved commercial business rules are preserved
- critical tests and production build pass
- no unsupported marketing claims or fake operational data are introduced
