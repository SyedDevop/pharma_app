# Pharma App

Pharmacy management app for small, large, and distributed pharmacies.
Manage stock, orders, customers, invoices, payments, and more.

Built with [SvelteKit](https://kit.svelte.dev/), [Tauri](https://v2.tauri.app/), and [shadcn-svelte](https://shadcn-svelte.com/).

## Prerequisites

- [Node.js](https://nodejs.org/) (>= 18)
- [Bun](https://bun.sh/) (>= 1.0)
- [Rust](https://www.rust-lang.org/) (for Tauri desktop builds)

## Setup

```bash
bun install
```

## Development

Start the web-only dev server:

```bash
bun tauri dev
```

On Linux, a WebKit bug can prevent the Tauri dev server from working
correctly. The `dev:tauri` script works around this by setting the
`WEBKIT_DISABLE_DMABUF_RENDERER=1` environment variable:

```bash
bun dev:tauri
```
