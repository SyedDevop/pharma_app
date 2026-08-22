# Pharma App — Agent Context

## Design Context

### Register
Product (app UI / dashboard / tool — design serves the product)

### Files
- `PRODUCT.md` — strategic: users, purpose, brand, principles, anti-references
- `DESIGN.md` — visual: colors, typography, elevation, components, do's and don'ts
- `.impeccable/design.json` — machine-readable tokens + component snippets for live panel

### Core Identity
- **North Star:** "The Clinic" — well-organized pharmacy counter, everything in its place
- **Personality:** Modern & sleek. Medical precision without hospital-system baggage. Think Epic/Cerner UX redesigned.
- **Palette:** Medical Teal (single accent, ≤10% coverage), Mauve Stone (neutral family), white surfaces, near-black ink
- **Font:** Manrope Variable across all roles
- **Shapes:** 0px containers, 4px interactive elements
- **Elevation:** Flat by default; shadows only on floating UI and hover states

### Design Principles
1. Precision at speed — every interaction reduces friction
2. Two-speed design — fast for techs, deep for managers
3. Medical, not medicinal — clinical without hospital cliché
4. Data-first clarity — tables and forms are the interface
5. Confidence through consistency — predictable patterns

### Key Commands
- `/impeccable craft <feature>` — shape and build end-to-end
- `/impeccable critique <page>` — UX design review
- `/impeccable audit <page>` — a11y, perf, responsive checks
- `/impeccable live` — in-browser visual variant iteration
- `/impeccable document` — refresh DESIGN.md from code

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
