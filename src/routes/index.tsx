import { createFileRoute } from "@tanstack/react-router";
import { GetPatient, InvoiceHistory, InvoiceInfo } from "@/components/invoice";
import { PatientDetails } from "@/components/invoice/patientDetails";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInvoiceStore } from "@/store/invoice_db";

function Index() {
  const setPatient = useInvoiceStore((s) => s.setPatient);
  return (
    <div className="px-8 py-3">
      <Card className="gap-0 py-0">
        <CardContent className="space-y-3 py-6">
          <InvoiceInfo />
          <Separator />
          <GetPatient onSelect={setPatient} />
          <Separator />
          <PatientDetails />
          <Separator />
          <InvoiceHistory />
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
