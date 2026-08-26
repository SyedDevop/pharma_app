import { CreditCardIcon, InvoiceIcon, KeyboardIcon, XIcon } from "@phosphor-icons/react";
import { Field, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
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
import { DumGroupe, DumInput, DumTitle } from "../my-ui/dumInput";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export function InvoiceBillInfo() {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      <KeyShortcuts />
      <Totals />
      <Payment />
    </div>
  );
}

function KeyShortcuts() {
  return (
    <Card>
      <CardContent>
        <div>
          <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
            <KeyboardIcon className="size-6 text-primary" weight="light" />
            <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
              Keyboard Shortcuts
            </h2>
          </div>
          <div className="space-y-2.5">
            {" "}
            <div className="grid grid-cols-2 gap-4">
              <p>
                <Kbd className="text-xs">F1</Kbd> {"  "}Cash
              </p>
              <p>
                <Kbd className="text-xs">F2</Kbd> {"  "}Add Row
              </p>
              <p>
                <Kbd className="text-xs">F3</Kbd> {"  "}Upi
              </p>
              <p>
                <Kbd className="text-xs">F4</Kbd> {"  "}Card
              </p>
              <p>
                <KbdGroup>
                  <Kbd className="text-xs">Ctrl + S</Kbd>
                </KbdGroup>
                Save
              </p>
              <p>
                <KbdGroup>
                  <Kbd className="text-xs">Ctrl + P</Kbd>
                </KbdGroup>
                Print
              </p>
              <p>
                <KbdGroup>
                  <Kbd className="text-xs">Ctrl + B</Kbd>
                </KbdGroup>
                Balance
              </p>
            </div>
            <Separator />
            <Field>
              <FieldLabel htmlFor="note" className="font-semibold text-lg text-primary">
                Note / Remarks
              </FieldLabel>
              <Textarea placeholder="Add Notes..." />
            </Field>
            <Separator />
            <div>
              <GstSlabBreakup />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GstSlabBreakup() {
  const gstSlab = useInvoiceStore((s) => s.gstSlab);
  return (
    <div>
      <h1 className="font-semibold text-lg text-primary">GST Slab Break-up</h1>

      <div className="min-h-25 rounded-sm border bg-muted">
        {gstSlab.size === 0 ? (
          <div className="grid min-h-25 place-content-center">
            <p className="p-2 text-lg text-muted-foreground">No Items Yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GST %</TableHead>
                <TableHead className="text-right">Taxable</TableHead>
                <TableHead className="text-right">CGST</TableHead>
                <TableHead className="text-right">SGST</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(gstSlab.values()).map(({ gst, cgst, sgst, taxable, amount }) => (
                <TableRow key={gst}>
                  <TableCell>{gst}%</TableCell>
                  <TableCell className="text-right">{rupeesFmt(taxable)}</TableCell>
                  <TableCell className="text-right">{rupeesFmt(cgst)}</TableCell>
                  <TableCell className="text-right">{rupeesFmt(sgst)}</TableCell>
                  <TableCell className="text-right font-medium">{rupeesFmt(amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function Totals() {
  const totals = useInvoiceStore((s) => s.totals);
  const adjustment = useInvoiceStore((s) => s.adjustment);
  const updateAdjustment = useInvoiceStore((s) => s.updateInvoiceAdjustment);
  return (
    <Card>
      <CardContent>
        <div>
          <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
            <InvoiceIcon className="size-6 text-primary" weight="light" />
            <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
              Totals
            </h2>
          </div>
          <div className="space-y-2.5">
            <DumGroupe>
              <DumTitle>Sub Total (Taxable)</DumTitle>
              <DumInput className="text-right font-bold text-primary/60 text-sm">
                {rupeesFmt(totals.subTotal)}
              </DumInput>
            </DumGroupe>
            <DumGroupe>
              <DumTitle>Gst Total </DumTitle>
              <DumInput className="text-right font-bold text-primary/60 text-sm">
                {rupeesFmt(totals.gstTotal)}
              </DumInput>
            </DumGroupe>

            <Field>
              <FieldTitle>Discount</FieldTitle>
              <div className="flex items-center gap-2">
                <Select
                  defaultValue="%"
                  value={adjustment.discType}
                  onValueChange={(v) => v && updateAdjustment("discType", v as ItemDiscountType)}
                  disabled={Boolean(adjustment.disableBulkDisc)}
                >
                  <SelectTrigger className="min-w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="₹">₹</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={adjustment.disc}
                  type="number"
                  placeholder="00.00"
                  className="no-spinner text-right font-bold tabular-nums"
                  onChange={(e) => updateAdjustment("disc", e.target.value)}
                />
              </div>
              <FieldError errors={[{ message: adjustment.disableBulkDisc }]} />
            </Field>

            <DumGroupe>
              <DumTitle>Round Off (auto)</DumTitle>
              <Input
                type="number"
                placeholder="00.00"
                className="no-spinner text-right font-bold tabular-nums"
                value={adjustment.roundOff}
                onChange={(e) => updateAdjustment("roundOff", e.target.value)}
              />
            </DumGroupe>
            <Separator />
            <DumGroupe>
              <DumTitle>Net Payable</DumTitle>
              <DumInput className="text-right font-bold text-primary/60 text-sm">
                {rupeesFmt(totals.roundedNetPayable)}
              </DumInput>
            </DumGroupe>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Payment() {
  const payment = useInvoiceStore((s) => s.payment);
  const updatePayment = useInvoiceStore((s) => s.updateInvoicePaymentField);
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
          <CreditCardIcon className="size-6 text-primary" weight="light" />
          <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
            Payment
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="space-y-2.5">
            <DumGroupe>
              <DumTitle>Cash (F1)</DumTitle>
              <div className="flex flex-row gap-1.5">
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => {
                    updatePayment("cash", "");
                  }}
                >
                  <XIcon />
                </Button>
                <Input
                  type="number"
                  placeholder="00.00"
                  className="no-spinner text-right font-bold tabular-nums"
                  value={payment.cash}
                  onChange={(e) => updatePayment("cash", e.target.value)}
                />
                <Button>Fill</Button>
              </div>
            </DumGroupe>
            <DumGroupe>
              <DumTitle>Card (F3)</DumTitle>
              <div className="flex flex-row gap-1.5">
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => {
                    updatePayment("card", "");
                  }}
                >
                  <XIcon />
                </Button>
                <Input
                  type="number"
                  placeholder="00.00"
                  className="no-spinner text-right font-bold tabular-nums"
                  value={payment.card}
                  onChange={(e) => updatePayment("card", e.target.value)}
                />
                <Button>Fill</Button>
              </div>
            </DumGroupe>
            <DumGroupe>
              <DumTitle>Upi (F4)</DumTitle>
              <div className="flex flex-row gap-1.5">
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => {
                    updatePayment("upi", "");
                  }}
                >
                  <XIcon />
                </Button>
                <Input
                  type="number"
                  placeholder="00.00"
                  className="no-spinner text-right font-bold tabular-nums"
                  value={payment.upi}
                  onChange={(e) => updatePayment("upi", e.target.value)}
                />
                <Button>Fill</Button>
              </div>
            </DumGroupe>
          </div>
          <div className="mt-21 space-y-2.5">
            <Separator />
            <DumGroupe>
              <DumTitle>Total Paid</DumTitle>
              <DumInput className="text-right font-bold text-primary/60 text-sm">
                {rupeesFmt(payment.totalPaid)}
              </DumInput>
            </DumGroupe>
            <DumGroupe>
              <DumTitle>Balance / Change</DumTitle>
              <DumInput className="text-right font-bold text-primary/60 text-sm">
                {rupeesFmt(payment.balance)}
              </DumInput>
            </DumGroupe>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
