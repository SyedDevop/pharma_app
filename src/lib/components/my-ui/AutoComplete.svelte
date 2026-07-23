<script lang="ts">
  import * as Command from "$lib/components/ui/command";
  import { Loader } from "@lucide/svelte";
  import { cn } from "$lib/utils";
  import * as Popover from "$lib/components/ui/popover/index";
  import MyInput from "./MyInput.svelte";
  import { fetchApi } from "$lib/api";

  interface Props {
    onSelect?: (patient: Patient) => void;
    patientFrom: "ipd" | "opd" | "customer";
    placeholder?: string;
    emptyText?: string;
    loadingText?: string;
    errorText?: string;
    debounceMs?: number;
    maxResults?: number;
    class?: string;
    ariaLabel?: string;
  }

  let {
    onSelect,
    placeholder = "patient by name or mobile...",
    loadingText = "Searching patients...",
    errorText = "Couldn't load patients — try again",
    debounceMs = 300,
    maxResults,
    class: className,
    ariaLabel = "Search patient",
    patientFrom,
  }: Props = $props();

  let open = $state(false);
  let inputValue = $state("");
  let inputRef = $state<HTMLInputElement | null>(null);

  let patients = $state<Patient[]>([]);
  let loading = $state(false);
  let error = $state(false);

  // Message from the API to show when the request itself failed at the app level.
  let errorMessage = $state("");

  let displayedPatients = $derived(
    maxResults !== undefined ? patients.slice(0, maxResults) : patients,
  );
  let isTruncated = $derived(
    maxResults !== undefined && patients.length > maxResults,
  );
  let listId = `patient-search-list-${Math.random().toString(36).slice(2, 9)}`;

  let requestId = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  async function searchPatients(term: string) {
    const currentRequest = ++requestId;

    if (!term) {
      patients = [];
      loading = false;
      error = false;
      errorMessage = "";
      return;
    }

    loading = true;
    error = false;
    errorMessage = "";

    try {
      const encoded = encodeURIComponent(term);
      const body = await fetchApi<Patient[]>("get_patient.php", {
        term: encoded,
        type: patientFrom,
      });

      // Ignore results from a stale/superseded request.
      if (currentRequest !== requestId) return;

      if (!body?.success) {
        patients = [];
        loading = false;
        error = true;
        errorMessage = body?.message || "";
        return;
      }

      const data = Array.isArray(body.data) ? body.data : [];
      patients = data;
      loading = false;
    } catch (err) {
      if (currentRequest !== requestId) return;
      patients = [];
      loading = false;
      error = true;
    }
  }

  function runSearch(term: string) {
    clearTimeout(debounceTimer);
    if (debounceMs > 0) {
      debounceTimer = setTimeout(() => searchPatients(term), debounceMs);
    } else {
      searchPatients(term);
    }
  }

  function handleSelect(patient: Patient) {
    inputValue = patient.patient_name;
    open = false;
    inputRef?.focus();
    onSelect?.(patient);
  }

  function handleClear() {
    clearTimeout(debounceTimer);
    inputValue = "";
    patients = [];
    loading = false;
    error = false;
    errorMessage = "";
    open = false;
    inputRef?.focus();
  }

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    inputValue = target.value;
    if (target.value) {
      open = true;
      runSearch(target.value);
    } else {
      open = false;
      clearTimeout(debounceTimer);
      patients = [];
      loading = false;
      error = false;
      errorMessage = "";
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
      } else if (inputValue) {
        e.preventDefault();
        handleClear();
      }
    } else if (e.key === "ArrowDown" && !open) {
      if (inputValue || patients.length > 0) {
        e.preventDefault();
        open = true;
      }
    }
  }

  // $effect(() => {
  //   if (!open) return;
  //   function onMouseDown(e: MouseEvent) {
  //     const target = e.target as HTMLElement;
  //     if (!target.closest("[data-patient-search]")) {
  //       open = false;
  //     }
  //   }
  //   document.addEventListener("mousedown", onMouseDown);
  //   return () => document.removeEventListener("mousedown", onMouseDown);
  // });

  $effect(() => () => {
    clearTimeout(debounceTimer);
  });
</script>

<div data-patient-search class={className}>
  <Command.Root
    shouldFilter={false}
    class={cn("rounded-lg", open && " border border-ring/80 shadow-md")}
  >
    <Popover.Root bind:open = {open}>
      <MyInput
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
        class={inputValue ? "pr-8" : undefined}
        onClear={handleClear}
      />
      <Popover.Content>
        <Command.List>
          {#if loading}
            <Command.Loading>
              <div
                class="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground"
              >
                <Loader class="size-4 animate-spin" />
                {loadingText}
              </div>
            </Command.Loading>
          {:else if error}
            <Command.Empty>
              <div class="px-2 py-4 text-center text-sm text-destructive">
                {errorMessage || errorText}
              </div>
            </Command.Empty>
          {:else}
            <Command.Empty>
              <div class="px-2 py-4 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            </Command.Empty>
            <Command.Group>
              {#each displayedPatients as patient, i (patient.patient_id)}
                <Command.Item
                  value={String(patient.patient_id)}
                  onclick={() => handleSelect(patient)}
                  class="ps-item"
                  style="--i: {i}"
                >
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate">{patient.patient_name}</span>
                    <span class="truncate text-xs text-muted-foreground">
                      {[patient.mobile, patient.visit_no, patient.doctor_name]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                </Command.Item>
              {/each}
            </Command.Group>
            {#if isTruncated}
              <div
                class="px-2 py-1.5 text-center text-xs text-muted-foreground"
              >
                Showing {maxResults} of {patients.length} results
              </div>
            {/if}
          {/if}
        </Command.List>
      </Popover.Content>
    </Popover.Root>
  </Command.Root>
</div>

<style>
  @keyframes ps-fade-in {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  :global(.ps-item) {
    animation: ps-fade-in 100ms cubic-bezier(0.25, 1, 0.5, 1) both;
    animation-delay: calc(var(--i, 0) * 25ms);
  }
  :global(.ps-item[data-selected="true"]) {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.ps-item) {
      animation: none !important;
    }
  }
</style>
