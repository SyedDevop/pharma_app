---
name: Pharma App
description: Pharmacy management desktop app — modern, precise, clinical-grade
colors:
  medical-teal: oklch(0.511 0.096 186.391)
  medical-teal-foreground: oklch(0.984 0.014 180.72)
  mauve-stone: oklch(0.96 0.003 325.6)
  mauve-stone-deep: oklch(0.542 0.034 322.5)
  surface: oklch(1 0 0)
  ink: oklch(0.145 0.008 326)
  border-light: oklch(0.922 0.005 325.62)
  destructive: oklch(0.577 0.245 27.325)
  chart-teal-1: oklch(0.855 0.138 181.071)
  chart-teal-2: oklch(0.704 0.14 182.503)
  chart-teal-3: oklch(0.6 0.118 184.704)
  chart-teal-4: oklch(0.511 0.096 186.391)
  chart-teal-5: oklch(0.437 0.078 188.216)
typography:
  display:
    fontFamily: Manrope Variable, sans-serif
    fontSize: clamp(1.5rem, 3vw, 2.25rem)
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  body:
    fontFamily: Manrope Variable, sans-serif
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  label:
    fontFamily: Manrope Variable, sans-serif
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.04em
rounded:
  none: 0
  sm: 2px
  md: 4px
  lg: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
components:
  button-primary:
    backgroundColor: oklch(0.511 0.096 186.391)
    textColor: oklch(0.984 0.014 180.72)
    rounded: 4px
    padding: 8px 20px
    typography: label
  button-secondary:
    backgroundColor: oklch(0.96 0.003 325.6)
    textColor: oklch(0.21 0.006 285.885)
    rounded: 4px
    padding: 8px 20px
  button-ghost:
    backgroundColor: transparent
    textColor: oklch(0.511 0.096 186.391)
    rounded: 4px
    padding: 8px 20px
  input:
    backgroundColor: oklch(1 0 0)
    textColor: oklch(0.145 0.008 326)
    rounded: 4px
    padding: 8px 12px
    height: 40px
  card:
    backgroundColor: oklch(1 0 0)
    textColor: oklch(0.145 0.008 326)
    rounded: 0
    padding: 16px
  nav-item:
    textColor: oklch(0.542 0.034 322.5)
    rounded: 4px
    padding: 8px 12px
  nav-item-active:
    backgroundColor: oklch(0.511 0.096 186.391)
    textColor: oklch(0.984 0.014 180.72)
    rounded: 4px
    padding: 8px 12px
---

# Design System: Pharma App

## 1. Overview

**Creative North Star: "The Clinic"**

A pharmacy management desktop app that feels like a well-organized pharmacy counter: everything in its place, every surface clean, every interaction precise. The system balances medical authority with modern restraint — clinical without being cold, efficient without feeling rushed.

This is not a hospital system (cluttered, dated, low-contrast). Not an over-designed dashboard (decorative charts, gradient accents, glassmorphism). Not a generic SaaS product (round buttons, playful illustrations, cookie-cutter cards). It is a precise instrument for pharmacy staff who need speed and clarity under real pressure.

**Key Characteristics:**
- Airy, light default theme with high contrast and generous whitespace
- Flat surfaces with subtle elevation only on interactive states
- Consistent 4px corner radius on interactive elements, sharp 0px on containers
- Mauve-leaning neutrals for calm authority; teal accent for wayfinding and action
- Typography-driven hierarchy; Manrope across all roles
- Decoration is functional: borders, backgrounds, and spacing carry information

## 2. Colors

A restrained palette rooted in pharmaceutical clarity. One teal accent does the work of wayfinding and calls to action. Mauve-toned neutrals keep the environment calm and legible.

### Primary
- **Medical Teal** (oklch(0.511 0.096 186.391)): The single accent. Used for primary actions, active navigation, selected states, and data highlights. Covers ≤10% of any screen — its rarity is the point.
- **Medical Teal Foreground** (oklch(0.984 0.014 180.72)): Text and icons on Medical Teal surfaces.

### Neutral
- **Surface** (oklch(1 0 0)): The default background. Cards, pages, panels.
- **Ink** (oklch(0.145 0.008 326)): Body text, headings, icons. High-contrast against Surface (≥15:1).
- **Mauve Stone** (oklch(0.96 0.003 325.6)): Muted/secondary backgrounds. Sidebar, hover rows, secondary buttons.
- **Mauve Stone Deep** (oklch(0.542 0.034 322.5)): Muted text, placeholders, secondary information.
- **Border Light** (oklch(0.922 0.005 325.62)): Input strokes, table dividers, card borders.
- **Destructive** (oklch(0.577 0.245 27.325)): Errors, destructive actions, delete states. Used sparingly.

### Data / Charts
- **Chart Teal** (5-step scale from oklch(0.855 0.138 181.071) to oklch(0.437 0.078 188.216)): Charts, visualizations, data badges. A monochromatic teal ramp for consistent data styling.

### Dark Mode
Inverts the palette: Ink becomes Surface, Surface becomes a deep mauve-mid (oklch(0.145 0.008 326)). Medical Teal darkens slightly (oklch(0.437 0.078 188.216)) to maintain contrast on dark backgrounds. Shadows are replaced by tonal borders (oklch(1 0 0 / 10%)).

### Named Rules
**The One Accent Rule.** Medical Teal is the only accent. It appears on ≤10% of any screen — primary buttons, active nav, selection states. If a second accent color is needed (e.g. for third-party integrations), it must be a desaturated variant within the teal hue family.

**The Contrast Rule.** No text on a tinted background without verification. Body text hits ≥4.5:1, large text ≥3:1. Muted text (Mauve Stone Deep) is never used for primary information.

## 3. Typography

**Display / Body / Label Font:** Manrope Variable (sans-serif)

**Character:** A single humanist sans-serif across the entire system. Manrope's open apertures and generous x-height ensure legibility at small sizes — critical for data-dense pharmacy screens. The variable weight axis provides a natural hierarchy without font switching.

### Hierarchy

- **Display** (Semi Bold 600, clamp(1.5rem, 3vw, 2.25rem), 1.2 line-height, -0.02em tracking): Page titles, modal headings. Max 2 per screen. Set with `text-wrap: balance`.
- **Headline** (Semi Bold 600, 1.125rem, 1.3 line-height): Section headings within pages. Card titles, panel headers.
- **Title** (Medium 500, 0.9375rem, 1.4 line-height): List item titles, table row labels, navigation items.
- **Body** (Regular 400, 0.875rem, 1.5 line-height): The default. Tables, paragraphs, form labels. Max line length 75ch.
- **Label** (Medium 500, 0.75rem, 1.25 line-height, 0.04em tracking): Button text, form captions, badges, tabs. All-caps optional for badge variants.

### Named Rules
**The No-Decoration Rule.** No gradient text, no drop caps, no fancy initial letters. Weight and size do the hierarchy work. The single weight axis of Manrope is enough.

## 4. Elevation

Flat by default, with minimal shadows reserved for interactive surfaces and floating elements. The app uses a **tonal layering** approach: depth is conveyed through background lightness rather than box shadows. Shadows appear only as a transient response to state.

### Shadow Vocabulary
- **Floating** (`0 2px 8px rgba(0,0,0,0.08)`): Dropdowns, popovers, tooltips, date pickers. The only persistent use of shadow.
- **Hover lift** (`0 1px 4px rgba(0,0,0,0.06)`): Cards and rows on hover. Transient; disappears when not hovered.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only for floating UI (dropdowns, dialogs, tooltips) and hover states. Never apply static shadows to resting cards or panels.

## 5. Components

### Buttons
- **Shape:** Slightly rounded corners (4px). Sharp edges reserved for containers.
- **Primary:** Medical Teal fill, Medical Teal Foreground text. Hover darkens by 8% lightness. Active darkens 12%.
- **Secondary:** Mauve Stone fill, Ink text. Hover deepens the mauve tint.
- **Ghost:** No fill or border. Text in Medical Teal. Hover adds a faint Mauve Stone background.
- **Destructive:** Destructive fill, white text. Hover darkens.
- **Sizing:** Compact (32px), default (40px), spacious (48px). Default is standard.

### Inputs / Fields
- **Shape:** Slightly rounded (4px), 1px Border Light stroke. White background.
- **Focus:** Medical Teal ring (`box-shadow: 0 0 0 2px oklch(0.511 0.096 186.391 / 0.3)`).
- **Error:** Destructive border + ring.
- **Disabled:** Mauve Stone background, 50% opacity text.
- **Height:** 40px default. Textarea uses proportional height.

### Cards / Containers
- **Corner Style:** Sharp (0px). Cards sit flush against the surface.
- **Background:** Surface (white). No shadow at rest.
- **Hover:** Subtle lift via Hover Elevation shadow, applied only when the card is interactive.
- **Border:** None by default. When grouping is needed, use Border Light on one edge.
- **Internal Padding:** 16px (md). Dense data cards use 12px.

### Navigation
- **Style:** Left sidebar. Flat, full-height panel in Mauve Stone background.
- **Items:** Title-medium text in Mauve Stone Deep. 8px horizontal, 10px vertical padding. 4px radius on hover state.
- **Active:** Medical Teal background block. Medical Teal Foreground text. No icon fill change — the background shift is the signal.
- **Icons:** Lucide, 20px, matching text color. Never decorative.

### Tables
- **Header:** Medium 500, 0.75rem, uppercase, 0.04em tracking. Mauve Stone Deep text. Border Light bottom stroke.
- **Rows:** Body weight, Ink text. Alternating backgrounds optional (white / Mauve Stone at 50% opacity).
- **Hover:** Mauve Stone background. No lift.
- **Selected:** Medical Teal at 8% opacity background. Medical Teal left-edge marker (3px).
- **Sizing:** Compact (40px rows) for dense data; comfortable (48px rows) for interactive tables.

## 6. Do's and Don'ts

### Do:
- **Do** use Medical Teal as the sole accent, covering ≤10% of any screen.
- **Do** keep containers sharp (0px radius); reserve 4px radius for interactive elements.
- **Do** use the Mauve Stone neutral family for all non-accent surfaces and borders.
- **Do** prefer tonal layering over shadows: shift background lightness to convey depth.
- **Do** verify body text contrast ≥4.5:1 against its background.
- **Do** use `text-wrap: balance` on display/headline text and `text-wrap: pretty` on long prose.
- **Do** use compact table rows (40px) for data-dense screens and comfortable (48px) for interactive tables.

### Don't:
- **Don't** use a second accent color outside the teal hue family.
- **Don't** use gradient text, glassmorphism, or decorative blur effects.
- **Don't** apply static shadows to resting cards, panels, or containers.
- **Don't** use side-stripe borders (border-left/right >1px) as accent markers on cards or callouts.
- **Don't** use the "hero-metric" template (big number + small label + gradient accent).
- **Don't** add tiny uppercase tracked eyebrows ("INVENTORY" "ORDERS" "REPORTS") above every section heading. One deliberate section label is voice; every section is AI grammar.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding. Numbers earn their place only when the sequence carries information (a real workflow, a step-by-step flow).
- **Don't** use identical card grids (icon + heading + text, repeated endlessly).
- **Don't** nest cards. Cards at one level only.
- **Don't** use playful illustrations, emoji, or decorative icons in the interface.
- **Don't** let display text overflow its container. Test every heading at every breakpoint.
