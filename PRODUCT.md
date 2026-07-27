# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pharmacy staff across two primary roles:

- **Technicians / cashiers** — at the counter, serving customers. Need fast lookups, sales, prescription processing, and payment handling. Every interaction saved in seconds matters.
- **Pharmacists / managers** — overseeing inventory, orders, compliance, reporting, and customers. Need data-dense views, filtering, and control panels.

Both roles share the same application but with different emphases: speed for the counter, depth for the back office.

## Product Purpose

A pharmacy management desktop app for small, large, and distributed pharmacies. Manages stock, orders, customers, invoices, payments, and prescriptions in one place.

Success looks like: staff can complete a sale or lookup in under 10 seconds, managers can audit inventory across locations without switching tools, and the app feels like a precise instrument rather than a chore.

## Positioning

All-in-one pharmacy OS — a single application handling stock, orders, customers, invoices, payments, and multi-location management without requiring tool-switching. Neighboring products typically specialize in one domain (POS, inventory, or billing); Pharma App consolidates the full pharmacy workflow into one interface.

## Operating Context

- **Pharmacy counter**: fast-paced customer-facing environment. Staff look up patients, process sales, handle payments, and manage prescriptions in real time. Speed and accuracy are non-negotiable.
- **Back office**: managers review inventory levels, approve orders, run reports, audit compliance, and oversee multi-location operations. Data density and filtering matter more than speed.
- **Multi-location oversight**: district or chain managers monitor stock and sales across branches from a single interface.
- **External integrations**: connects to a remote pharmacy API (`pharmacy.vcarehospital.in`) for patient records, invoices, and related data.

## Capabilities and Constraints

**Confirmed capabilities:**

- Patient / customer search (IPD, OPD, retail) with autocomplete
- Stock and inventory management
- Orders and supplier management
- Invoicing and payment processing
- Reporting and analytics
- Multi-location management

**Technical constraints:**

- Tauri desktop app (web frontend, Rust backend)
- React 19 + TypeScript, TanStack Router, Tailwind CSS 4, shadcn/ui
- Remote API dependency for patient and invoice data
- Desktop-only (no mobile or web deployment planned)

**Undecided:**

- Prescription management scope and workflow
- Offline capability requirements
- User authentication and role-based access control

## Brand Commitments

- **Name:** Pharma App
- **Voice:** Precise, trustworthy, unobtrusive. Medical-grade reliability with contemporary polish.
- **Personality:** Modern and sleek. Clinical precision without hospital-system baggage. Think Epic or Cerner UX redesigned with modern typography, deliberate whitespace, and a neutral-teal palette.
- **Anti-references:** Not a typical hospital/clinic system (dated, cluttered), not an over-designed dashboard (decorative charts, glassmorphism), not a generic SaaS product (round buttons, playful illustrations).

## Evidence on Hand

- Working codebase with patient search feature (IPD, OPD, retail)
- shadcn/ui component library (base-nova style, olive base, Phosphor icons)
- Tauri desktop shell with HTTP plugin integration
- Remote API connected to `pharmacy.vcarehospital.in`
- Roboto Slab Variable as heading font, teal primary color scheme

## Product Principles

1. **Precision at speed.** Pharmacy work is fast-paced; every interaction should reduce friction, not add it. Animations are brief and purposeful. Data appears instantly or shows a skeleton.
2. **Two-speed design.** Serve both the quick-lookup technician and the deep-dive manager without compromise. The same screen should read fast at a glance and reward focused exploration.
3. **Medical, not medicinal.** Clinical precision without hospital-system baggage. Modern, clean, trustworthy — the authority of a medical tool with the polish of a contemporary app.
4. **Data-first clarity.** Tables, lists, forms, and information hierarchy are the primary interface. Decoration is subordinate. Layouts prioritize what the user needs to see and act on.
5. **Confidence through consistency.** Predictable patterns, clear feedback, no surprises. Every button, input, and table behaves the way the last one did. Users build muscle memory quickly.

## Accessibility & Inclusion

WCAG 2.2 AA minimum. Body text contrast ≥4.5:1, large text ≥3:1. Keyboard-navigable throughout. Screen-reader compatible. Support for reduced motion via `prefers-reduced-motion`.
