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

const InvoiceHistoryCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
        <ScrollIcon className="size-4 text-primary" weight="bold" />
        <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
          Patient Invoice History
        </h2>
      </div>
      {children}
    </div>
  );
};
