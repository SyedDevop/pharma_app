import { CalendarDotsIcon, ClockUserIcon, InvoiceIcon } from "@phosphor-icons/react";
import React from "react";
import { fetchApi } from "@/lib/api";
import { useInvoiceStore } from "@/store/invoice_db";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";

export function InvoiceInfo() {
  const invoiceNumber = useInvoiceStore((s) => s.invoiceNumber);
  const setInvoiceNumber = useInvoiceStore((s) => s.setInvoiceNumber);

  const getInvoiceNum = async () => {
    const data = await fetchApi<string>("get_invoice_number.php", undefined);
    setInvoiceNumber(data.data);
  };

  const dt = new Date();
  const date = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  const time = dt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  React.useEffect(() => {
    getInvoiceNum();
  }, []);

  return (
    <div className="flex w-full grow gap-3">
      <div className="flex-1">
        <Label className="mb-2 text-muted-foreground">Invoice Id</Label>
        <div className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 p-2.5">
          <InvoiceIcon className="size-6 text-primary" weight="thin" />
          {invoiceNumber ? (
            <span className="fade-in animate-in font-semibold duration-300">{invoiceNumber}</span>
          ) : (
            <div className="h-5 w-28 animate-pulse rounded bg-primary/20" />
          )}
        </div>
      </div>

      <div className="flex-1">
        <Label className="mb-2 text-muted-foreground">Date</Label>
        <div className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 p-2.5">
          <CalendarDotsIcon className="size-6 text-primary" weight="thin" />
          <span className="font-semibold">{date}</span>
        </div>
      </div>

      <div className="flex-1">
        <Label className="mb-2 text-muted-foreground">Time</Label>
        <div className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 p-2.5">
          <ClockUserIcon className="size-6 text-primary" weight="thin" />
          <span className="font-semibold">{time}</span>
        </div>
      </div>
    </div>
  );
}
