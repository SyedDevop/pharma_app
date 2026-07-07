<script lang="ts">
  import AutoComplete, {
    type OptionType,
  } from "$lib/components/my-ui/AutoComplete.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { fetch } from "@tauri-apps/plugin-http";

  let search = $state<string | undefined>(undefined);
  let isLoading = $state<boolean>(false);
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
      return undefined;
    }
    isLoading = true;

    let ignore = false;
    async function fetchPatients() {
      if (ignore) return;
      try {
        const res = await fetch(
          `https://pharmacy.vcarehospital.in/api/get_patient.php?term=${search}&type=customer`,
        );
        const data = (await res.json()) as ApiResponse<Patient[]>;
        patients = data.data;
      } finally {
        isLoading = false;
      }
    }

    const timeoutId = setTimeout(fetchPatients, 300);
    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  });
</script>

<div class="bg-background p-4">
  <Card.Root>
    <Card.Header>
      <Card.Title>Search patients</Card.Title>
      <Card.Description>Search for a patient</Card.Description>
    </Card.Header>
    <Card.Content class="flex w-full flex-row gap-2">
      <div class="flex flex-col items-start">
        <Label>IPD Patient Search</Label>
        <AutoComplete />
      </div>
      <div class="flex flex-col items-start">
        <Label>OPD Patient Search</Label>
        <AutoComplete />
      </div>
      <div class="flex flex-col items-start">
        <Label>Retail Customer Search</Label>
        <AutoComplete
          value={search}
          loading={isLoading}
          items={patientOptions}
          onSearch={(e) => (search = e)}
        />
      </div>
    </Card.Content>
  </Card.Root>
</div>
