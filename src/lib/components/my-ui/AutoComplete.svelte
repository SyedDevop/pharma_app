<script lang="ts">
  import * as Command from "$lib/components/ui/command";
  import { Loader } from '@lucide/svelte';
  import { cn } from "$lib/utils";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  export type OptionType = {
    label: string;
    value: string;
    subtitle?: string;
  };

  let {
    value = $bindable(""),
    items = [],
    loading = false,
    error = false,
    placeholder = "Search...",
    emptyText = "No results found.",
    loadingText = "Searching...",
    errorText = "Search failed — try again",
    debounceMs = 300,
    maxResults,
    onSelect,
    onSearch,
    class: className,
    ariaLabel = "Search",
    ...restProps
  }: {
    value?: string;
    items?: OptionType[];
    loading?: boolean;
    error?: boolean;
    placeholder?: string;
    emptyText?: string;
    loadingText?: string;
    errorText?: string;
    debounceMs?: number;
    maxResults?: number;
    onSelect?: (item: OptionType) => void;
    onSearch?: (query: string, signal?: AbortSignal) => void;
    class?: string;
    ariaLabel?: string;
  } = $props();

  let open = $state(false);
  let inputValue = $state("");
  let inputRef = $state<HTMLInputElement | null>(null);
  let debounceTimer = $state<ReturnType<typeof setTimeout> | null>(null);
  let activeController = $state<AbortController | null>(null);

  let displayedItems = $derived(
    maxResults !== undefined ? items.slice(0, maxResults) : items,
  );
  let isTruncated = $derived(
    maxResults !== undefined && items.length > maxResults,
  );
  let listId = $derived(`autocomplete-list-${Math.random().toString(36).slice(2, 9)}`);

  $effect(() => {
    if (value !== undefined && value !== inputValue) {
      if (value === "") {
        inputValue = "";
      }
    }
  });

  function handleSelect(item: OptionType) {
    value = item.value;
    inputValue = item.label;
    open = false;
    inputRef?.focus();
    onSelect?.(item);
  }

  function handleClear() {
    value = "";
    inputValue = "";
    cancelPending();
    onSearch?.("");
    inputRef?.focus();
  }

  function cancelPending() {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (activeController !== null) {
      activeController.abort();
      activeController = null;
    }
  }

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    inputValue = target.value;
    if (target.value) {
      open = true;
      cancelPending();
      const controller = new AbortController();
      activeController = controller;
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        onSearch?.(target.value, controller.signal);
      }, debounceMs);
    } else {
      open = false;
      cancelPending();
      onSearch?.("");
    }
  }

  function handleFocus() {
    if (inputValue) open = true;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        open = false;
      }
    } else if (e.key === "ArrowDown" && !open) {
      if (inputValue || items.length > 0) {
        e.preventDefault();
        open = true;
      }
    }
  }

  $effect(() => {
    return () => cancelPending();
  });

  $effect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-autocomplete]")) {
        open = false;
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  });
</script>

<div data-autocomplete class={cn("relative", className)}>
  <Command.Root
    shouldFilter={false}
    class={cn("rounded-none!", open ? "overflow-visible" : "")}
    {...restProps}
  >
    <Command.Input
      {placeholder}
      value={inputValue}
      oninput={handleInput}
      onfocus={handleFocus}
      onkeydown={handleKeyDown}
      bind:ref={inputRef}
      aria-label={ariaLabel}
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      aria-autocomplete="list"
    />

    {#if open}
      <div
        id={listId}
        role="listbox"
        transition:fly={{ y: -4, duration: 150, easing: cubicOut }}
        class="bg-popover text-popover-foreground absolute top-full left-0 right-0 z-50 mt-0 rounded-none border border-border shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      >
        <Command.List class="static max-h-72">
          {#if loading}
            <Command.Loading>
              <div class="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                <Loader class="size-4 animate-spin"/>
                {loadingText}
              </div>
            </Command.Loading>
          {:else if error}
            <Command.Empty>
              <div class="px-2 py-4 text-center text-sm text-destructive">
                {errorText}
              </div>
            </Command.Empty>
          {:else if displayedItems.length === 0}
            <Command.Empty>
              <div class="px-2 py-4 text-center text-sm text-muted-foreground">{emptyText}</div>
            </Command.Empty>
          {:else}
            <Command.Group>
              {#each displayedItems as item, i (item.value)}
                <Command.Item
                  value={item.value}
                  onselect={() => handleSelect(item)}
                  class="ac-item"
                  style="--i: {i}"
                >
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate">{item.label}</span>
                    {#if item.subtitle}
                      <span class="truncate text-xs text-muted-foreground">{item.subtitle}</span>
                    {/if}
                  </div>
                </Command.Item>
              {/each}
            </Command.Group>
            {#if isTruncated}
              <div class="px-2 py-1.5 text-center text-xs text-muted-foreground">
                Showing {maxResults} of {items.length} results
              </div>
            {/if}
          {/if}
        </Command.List>
      </div>
    {/if}
  </Command.Root>
</div>

<style>
  @keyframes ac-fade-in {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(.ac-item) {
    animation: ac-fade-in 100ms cubic-bezier(0.25, 1, 0.5, 1) both;
    animation-delay: calc(var(--i, 0) * 25ms);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.ac-item) {
      animation: none !important;
    }
  }
</style>
