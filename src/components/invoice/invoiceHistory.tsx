import { ArrowsClockwiseIcon, EyeIcon, ScrollIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import React from "react";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { rupeesFmt } from "@/lib/my-utils";
import { useInvoiceStore } from "@/store/invoice_db";
import { Button } from "../ui/button";
import { InvoiceHistoryPopup } from "./invoiceHistoryTablePopup";

export function InvoiceHistory() {
  const patientBalance = useInvoiceStore((state) => state.patientBalance);
  const [open, setOpen] = React.useState(false);
  if (!patientBalance)
    return (
      <InvoiceHistoryCard>
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="text-sm">No previous invoices found for this patient.</span>
        </div>
      </InvoiceHistoryCard>
    );
  return (
    <InvoiceHistoryCard showAction onClick={() => setOpen((s) => !s)}>
      <ItemGroup className="grid grid-cols-4 gap-4">
        <Item variant="outline" className="border-border bg-muted">
          <ItemContent>
            <ItemTitle className="text-base">Total Invoices</ItemTitle>
            <ItemDescription className="flex gap-2">
              <div>
                <span className="pr-1 font-semibold text-2xl text-foreground tabular-nums">
                  {patientBalance.invoice_count}
                </span>
                Invoiced
              </div>
              <div className="text-emerald-600">
                <span className="pr-1 font-semibold text-2xl tabular-nums">
                  {patientBalance.paid_count}
                </span>
                Paid
              </div>
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" className="border-info/25 bg-info/10">
          <ItemContent>
            <ItemTitle className="text-base">Total Billed</ItemTitle>
            <ItemDescription className="text-info">
              <span className="pr-1 font-semibold text-2xl tabular-nums">
                {rupeesFmt(patientBalance.total_invoiced)}
              </span>
              Current FY
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" className="border-success/25 bg-success/10">
          <ItemContent className="text-base">
            <ItemTitle>Total Paid</ItemTitle>
            <ItemDescription className="text-success">
              <span className="pr-1 font-semibold text-2xl tabular-nums">
                {rupeesFmt(patientBalance.total_paid)}
              </span>
              Complete
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" className="border-destructive/25 bg-destructive/10">
          <ItemContent className="text-base">
            <ItemTitle>Total Outstanding</ItemTitle>
            <ItemDescription className="text-destructive">
              <span className="pr-1 font-semibold text-2xl tabular-nums">
                {rupeesFmt(patientBalance.net_payable_now)}
              </span>
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <InvoiceHistoryPopup open={open} onChange={setOpen} />
    </InvoiceHistoryCard>
  );
}
const InvoiceHistoryCard = ({
  children,
  showAction = false,
  onClick,
}: {
  children: React.ReactNode;
  showAction?: boolean;
  onClick?: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);
  const fetchPatientBalance = useInvoiceStore((state) => state.fetchPatientBalance);
  const patient = useInvoiceStore((state) => state.patient);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l bg-primary/10 py-1 pr-4 pl-3">
          <ScrollIcon className="size-4 text-primary" weight="bold" />
          <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
            Patient Invoice History
          </h2>
        </div>
        {showAction && (
          <div className="flex flex-row items-center justify-end gap-2 pb-2">
            <Button
              variant="secondary"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  await fetchPatientBalance(patient);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <SpinnerGapIcon className="animate-spin" /> : <ArrowsClockwiseIcon />}
              Refresh Balance
            </Button>
            <Button onClick={onClick}>
              <EyeIcon />
              History
            </Button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
