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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rupeesFmt } from "@/lib/my-utils";
import { useInvoiceStore } from "@/store/invoice_db";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "../ui/item";

interface Props {
  open: boolean;
  onChange?: (c: boolean) => void;
}
export function InvoiceHistoryPopup(props: Props) {
  const name = useInvoiceStore((state) => state.patient.patient_name);
  const patientBalance = useInvoiceStore((state) => state.patientBalance);

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
                    <div className="text-emerald-600">
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
        <div className="no-scrollbar max-h-[75vh] overflow-y-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Invoice No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Visit No</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Net Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>01</TableCell>
                <TableCell>VC-26-27/1234567</TableCell>
                <TableCell>01/01/2023</TableCell>
                <TableCell>OPD-23698</TableCell>
                <TableCell>OPD</TableCell>
                <TableCell>60.00</TableCell>
                <TableCell>60.00</TableCell>
                <TableCell>00.00</TableCell>
                <TableCell>PAID</TableCell>
                <TableCell>UPI</TableCell>
                <TableCell>---</TableCell>
                <TableCell>---</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function StatCard({
  icon: Icon,
  label,
  sub,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  sub?: string;
  value: React.ReactNode;
  tone?: "destructive" | "success" | "default";
}) {
  const toneClass =
    tone === "destructive"
      ? "text-destructive"
      : tone === "success"
        ? "text-emerald-600"
        : "text-foreground";

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
      <div className="rounded-md bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-0.5">
        <p className="font-medium text-muted-foreground text-xs">{label}</p>
        <p className={`font-semibold text-xl tabular-nums ${toneClass}`}>{value}</p>
        {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
      </div>
    </div>
  );
}
