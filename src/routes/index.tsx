import { createFileRoute } from "@tanstack/react-router";
import { GetPatient, InvoiceHistory, InvoiceInfo } from "@/components/invoice";
import { PatientDetails } from "@/components/invoice/patientDetails";
import { useInvoiceStore } from "@/store/invoice_db";

function Index() {
  const setPatient = useInvoiceStore((s) => s.setPatient);
  return (
    <div className="p-8">
      <InvoiceInfo />
      <GetPatient onSelect={setPatient} />
      <PatientDetails />
      <InvoiceHistory />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
