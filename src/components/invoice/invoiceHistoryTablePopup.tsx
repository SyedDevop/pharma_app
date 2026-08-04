import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rupeesFmt } from "@/lib/my-utils";
import { cn } from "@/lib/utils";
import { useInvoiceStore } from "@/store/invoice_db";
import { Badge } from "../ui/badge";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "../ui/item";

interface Props {
  open: boolean;
  onChange?: (c: boolean) => void;
}
export function InvoiceHistoryPopup(props: Props) {
  const name = useInvoiceStore((state) => state.patient.patient_name);
  const patientBalance = useInvoiceStore((state) => state.patientBalance);
  console.log(patientBalance);

  return (
    <Dialog onOpenChange={props.onChange} open={props.open}>
      <DialogContent className="min-w-[80%]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-base">Invoice History — {name}</DialogTitle>
          <DialogDescription>
            <ItemGroup className="grid grid-cols-4 gap-4">
              <Item variant="outline" className="border-border bg-muted">
                <ItemContent>
                  <ItemTitle className="text-base">Total Invoices</ItemTitle>
                  <ItemDescription className="flex gap-2">
                    <div>
                      <span className="pr-1 font-semibold text-foreground text-xl tabular-nums">
                        {patientBalance?.invoice_count}
                      </span>
                      Invoiced
                    </div>
                    <div className="text-success">
                      <span className="pr-1 font-semibold text-xl tabular-nums">
                        {patientBalance?.paid_count}
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
                    <span className="pr-1 font-semibold text-xl tabular-nums">
                      {rupeesFmt(patientBalance?.total_invoiced || 0)}
                    </span>
                    Current FY
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline" className="border-success/25 bg-success/10">
                <ItemContent className="text-base">
                  <ItemTitle>Total Paid</ItemTitle>
                  <ItemDescription className="text-success">
                    <span className="pr-1 font-semibold text-xl tabular-nums">
                      {rupeesFmt(patientBalance?.total_paid || 0)}
                    </span>
                    Complete
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline" className="border-destructive/25 bg-destructive/10">
                <ItemContent className="text-base">
                  <ItemTitle>Total Outstanding</ItemTitle>
                  <ItemDescription className="text-destructive">
                    <span className="pr-1 font-semibold text-xl tabular-nums">
                      {rupeesFmt(patientBalance?.net_payable_now || 0)}
                    </span>
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar relative max-h-[75vh] overflow-y-auto rounded-md border">
          {patientBalance?.invoices ? (
            <IHTable invoices={patientBalance.invoices} />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground">
              <span className="text-sm">No previous invoices found for this patient.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
function IHTable({ invoices }: { invoices: Invoice[] }) {
  const totals = invoices.reduce(
    (acc, inv) => {
      acc.net += Number(inv.net_total) || 0;
      acc.paid += Number(inv.paid_amount) || 0;
      acc.balance += Number(inv.balance_amount) || 0;
      return acc;
    },
    { net: 0, paid: 0, balance: 0 },
  );

  return (
    <Table containerClassName="no-scrollbar max-h-[75vh] overflow-auto rounded-md border">
      <TableHeader className="sticky top-0 z-10">
        <TableRow className="bg-muted [&_th]:font-semibold [&_th]:text-muted-foreground [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wide">
          <TableHead>No.</TableHead>
          <TableHead>Invoice No</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Visit No</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Net Total</TableHead>
          <TableHead className="text-right">Paid</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Remark</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, i) => (
          <TableRow key={`${invoice.id}-${invoice.invoice_no}`} className="even:bg-muted/40">
            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
            <TableCell className="font-medium">{invoice.invoice_no}</TableCell>
            <TableCell className="text-muted-foreground">{invoice.invoice_date}</TableCell>
            <TableCell className="text-muted-foreground">{invoice.opd_ipd_no}</TableCell>
            <TableCell className="text-muted-foreground">{invoice.patient_type}</TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {rupeesFmt(invoice.net_total)}
            </TableCell>
            <TableCell className="text-right text-muted-foreground tabular-nums">
              {rupeesFmt(invoice.paid_amount)}
            </TableCell>
            <TableCell
              className={cn(
                "text-right tabular-nums",
                Number(invoice.balance_amount) > 0
                  ? "font-medium text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {rupeesFmt(invoice.balance_amount)}
            </TableCell>
            <TableCell>
              <StatusBadge status={invoice.payment_status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{invoice.payment_mode}</TableCell>
            <TableCell className="text-muted-foreground">{invoice.remarks}</TableCell>
            <TableCell className="text-muted-foreground">---</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="sticky bottom-0 z-10">
        <TableRow className="border-t bg-muted">
          <TableCell colSpan={5} className="font-semibold">
            Total ({invoices.length})
          </TableCell>
          <TableCell className="text-right font-semibold tabular-nums">
            {rupeesFmt(totals.net)}
          </TableCell>
          <TableCell className="text-right font-semibold text-muted-foreground tabular-nums">
            {rupeesFmt(totals.paid)}
          </TableCell>
          <TableCell
            className={cn(
              "text-right font-semibold tabular-nums",
              totals.balance > 0 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {rupeesFmt(totals.balance)}
          </TableCell>
          <TableCell colSpan={4} />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const variant: "success" | "warning" | "destructive" =
    status === "PAID" ? "success" : status === "PARTIAL" ? "warning" : "destructive";
  return <Badge variant={variant}>{status}</Badge>;
}
