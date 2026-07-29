import { createFileRoute } from "@tanstack/react-router";
import { GetPatient, InvoiceInfo } from "@/components/invoice";
import { useInvoiceStore } from "@/store/invoice_db";

function Index() {
  const setPatient = useInvoiceStore((s) => s.setPatient);
  return (
    <div className="p-8">
      <InvoiceInfo />
      <GetPatient onSelect={setPatient} />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
