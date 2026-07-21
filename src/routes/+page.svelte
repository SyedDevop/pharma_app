<script lang="ts">
  import AutoComplete, {
    type OptionType,
  } from "$lib/components/my-ui/AutoComplete.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { fetch } from "@tauri-apps/plugin-http";

  let search = $state<string | undefined>(undefined);
  let isLoading = $state<boolean>(false);
  let isError = $state<boolean>(false);
  let patients = $state<Patient[]>([]);

  const patientOptions = $derived(
    patients.map((p) => ({
      label: p.patient_name,
      value: p.patient_id.toString(),
    })),
  );

  $effect(() => {
    if (!search) {
      patients = [];
      isLoading = false;
      isError = false;
      return undefined;
    }

    isLoading = true;
    isError = false;
    let ignore = false;

    async function fetchPatients(signal?: AbortSignal) {
      if (ignore) return;
      try {
        const encoded = encodeURIComponent(search!);
        const res = await fetch(
          `https://pharmacy.vcarehospital.in/api/get_patient.php?term=${encoded}&type=customer`,
          { signal },
        );
        if (!res.ok) {
          if (!ignore) isError = true;
          return;
        }
        const data = (await res.json()) as ApiResponse<Patient[]>;
        if (!ignore) {
          patients = Array.isArray(data?.data) ? data.data : [];
        }
      } catch (err: unknown) {
        if (ignore) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        isError = true;
      } finally {
        if (!ignore) isLoading = false;
      }
    }

    const timeoutId = setTimeout(() => fetchPatients(), 300);
    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  });
</script>

<div class="bg-background p-4 h-dvh">
  <Card.Root class="h-full">
    <Card.Header>
      <Card.Title>Search patients</Card.Title>
      <Card.Description>Search for a patient</Card.Description>
    </Card.Header>
    <Card.Content class="flex w-full h-full flex-row gap-2">
      <div class="flex flex-col items-start">
        <Label>IPD Patient Search</Label>
        <AutoComplete ariaLabel="Search IPD patients" />
      </div>
      <div class="flex flex-col items-start">
        <Label>OPD Patient Search</Label>
        <AutoComplete ariaLabel="Search OPD patients" />
      </div>
      <div class="flex flex-col items-start">
        <Label>Retail Customer Search</Label>
        <AutoComplete
          value={search}
          loading={isLoading}
          error={isError}
          items={patientOptions}
          onSearch={(e) => { search = e; }}
          ariaLabel="Search retail customers"
        />
      </div>
    </Card.Content>
  </Card.Root>
</div>
