import { createFileRoute } from "@tanstack/react-router";
import { GetPatient, InvoiceInfo } from "@/components/invoice";

function Index() {
  return (
    <div className="p-8">
      <InvoiceInfo />
      <GetPatient onSelect={console.log} />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
