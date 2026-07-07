<script lang="ts">
  import * as Command from "$lib/components/ui/command";
  import { cn } from "$lib/utils";

  export type OptionType = {
    label: string;
    value: string;
  };

  let {
    value = $bindable(""),
    items = [],
    loading = false,
    placeholder = "Search...",
    emptyText = "No results found.",
    loadingText = "Searching...",
    onSelect,
    onSearch,
    class: className,
    ...restProps
  }: {
    value?: string;
    items?: OptionType[];
    loading?: boolean;
    placeholder?: string;
    emptyText?: string;
    loadingText?: string;
    onSelect?: (item: OptionType) => void;
    onSearch?: (query: string) => void;
    class?: string;
  } = $props();

  let open = $state(false);
  let inputValue = $state("");

  function handleSelect(item: OptionType) {
    value = item.value;
    inputValue = item.label;
    open = false;
    onSelect?.(item);
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    inputValue = target.value;
    if (target.value) {
      open = true;
      onSearch?.(target.value);
    } else {
      open = false;
    }
  }

  function handleFocus() {
    if (inputValue) open = true;
  }

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
    class={cn(open ? "overflow-visible" : "")}
    {...restProps}
  >
    <Command.Input
      {placeholder}
      bind:value={inputValue}
      oninput={handleInput}
      onfocus={handleFocus}
    />
    {#if open}
      <div
        class="bg-popover text-popover-foreground absolute top-full left-0 right-0 z-50 mt-0 rounded-none shadow-md ring-1 ring-foreground/10"
      >
        <Command.List class="static max-h-72">
          {#if loading}
            <Command.Loading>
              <div class="py-6 text-center text-sm">{loadingText}</div>
            </Command.Loading>
          {:else if items.length === 0}
            <Command.Empty>
              <div class="py-6 text-center text-sm">{emptyText}</div>
            </Command.Empty>
          {:else}
            <Command.Group>
              {#each items as item (item.value)}
                <Command.Item
                  value={item.value}
                  onselect={() => handleSelect(item)}
                >
                  {item.label}
                </Command.Item>
              {/each}
            </Command.Group>
          {/if}
        </Command.List>
      </div>
    {/if}
  </Command.Root>
</div>
