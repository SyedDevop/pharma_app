import { PillIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CustomerType,
  GetPatient,
  InvoiceBillInfo,
  InvoiceHistory,
  InvoiceInfo,
  LEGEND,
  SalesItems,
} from "@/components/invoice";
import { PatientDetails } from "@/components/invoice/patientDetails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useInvoiceStore } from "@/store/invoice_db";

function Index() {
  const setPatient = useInvoiceStore((s) => s.setPatient);
  const patientBalance = useInvoiceStore((s) => s.patientBalance);
  return (
    <div className="px-8 py-3 pb-32">
      <Card className="gap-0 py-0">
        <CardHeader className="bg-primary/5 py-2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PillIcon className="size-4.5" />
            </div>
            <div>
              <CardTitle className="font-semibold text-base text-foreground tracking-tight">
                Invoice Info
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Invoice and patient details for this sale.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 py-6">
          <InvoiceInfo />
          <Separator />
          <GetPatient onSelect={setPatient} />
          <Separator />
          <PatientDetails />
          {patientBalance && (
            <>
              <Separator />
              <InvoiceHistory />
            </>
          )}
          <Separator />
          <CustomerType />
        </CardContent>
      </Card>

      <Card className="mt-4 gap-0 py-0">
        <CardHeader className="flex justify-between bg-primary/5 py-2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PillIcon className="size-4.5" />
            </div>
            <div>
              <CardTitle className="font-semibold text-base text-foreground tracking-tight">
                Sales Items
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Items and quantities on this invoice.
              </CardDescription>
            </div>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-sm bg-muted px-3 py-1.5">
            {LEGEND.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 text-muted-foreground text-xs"
              >
                <span className={cn("size-2 rounded-[1px]", item.color)} />
                {item.label}
              </span>
            ))}
          </div>
        </CardHeader>

        <Separator />
        <CardContent className="px-0 py-1">
          <SalesItems />
        </CardContent>
      </Card>
      <InvoiceBillInfo />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
