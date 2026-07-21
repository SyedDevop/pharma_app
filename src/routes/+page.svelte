<script lang="ts">
  import AutoComplete  from "$lib/components/my-ui/AutoComplete.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
</script>

<div class="p-4 h-dvh">
  <Card.Root class="h-full">
    <Card.Header>
      <Card.Title>Search patients</Card.Title>
      <Card.Description>Search for a patient</Card.Description>
    </Card.Header>
    <Card.Content class="flex w-full h-full flex-row gap-2">
      <div class="flex flex-col items-start">
        <Label>Retail Customer Search</Label>
        <AutoComplete 
          onSelect={(patient) => console.log(patient.visit_no, patient.doctor_name)}
        /> 
      </div>
    </Card.Content>
  </Card.Root>
</div>
