import { ScrollIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

import { rupeesFmt } from "@/lib/my-utils";
import { useInvoiceStore } from "@/store/invoice_db";

export function InvoiceHistory() {
  const patientBalance = useInvoiceStore((state) => state.patientBalance);
  console.log(patientBalance);

  if (!patientBalance)
    return (
      <InvoiceHistoryCard>
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="text-sm">No previous invoices found for this patient.</span>
        </div>
      </InvoiceHistoryCard>
    );
  return (
    <InvoiceHistoryCard>
      <ItemGroup className="grid grid-cols-4 gap-4">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Total Invoices</ItemTitle>
            <ItemDescription>{patientBalance.paid_count} settled</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Total Billed</ItemTitle>
            <ItemDescription>{rupeesFmt(patientBalance.total_invoiced)} Current FY</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Total Paid</ItemTitle>
            <ItemDescription>{rupeesFmt(patientBalance.total_paid)} Complete</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Total Outstanding</ItemTitle>
            <ItemDescription>{rupeesFmt(patientBalance.net_payable_now)}</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </InvoiceHistoryCard>
  );
}

const InvoiceHistoryCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="mt-4 gap-0 py-0">
    <CardHeader className="bg-primary/5 py-2">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ScrollIcon className="size-4.5" weight="bold" />
        </div>
        <div>
          <CardTitle className="font-semibold text-base">Patient Invoices</CardTitle>
          <CardDescription className="text-muted-foreground">
            View all previous invoices generated for this patient.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="py-6"> {children}</CardContent>
  </Card>
);
