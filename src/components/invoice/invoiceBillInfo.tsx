import { CreditCardIcon, InvoiceIcon, KeyboardIcon, XIcon } from "@phosphor-icons/react";
import { rupeesFmt } from "@/lib/my-utils";
import { useInvoiceStore } from "@/store/invoice_db";
import { DumGroupe, DumInput, DumTitle } from "../my-ui/dumInput";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
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
              <h1 className="font-semibold text-lg text-primary">Gst Slab Break-up</h1>
              <div className="grid min-h-25 place-content-center rounded-sm border bg-muted">
                <p className="p-2 text-lg text-muted-foreground">No Items Yet</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Totals() {
  const totals = useInvoiceStore((s) => s.totals);
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

            <DumGroupe>
              <DumTitle>Discount</DumTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="%">
                  <SelectTrigger className="min-w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="₹">₹</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="00.00"
                  className="no-spinner text-right font-bold tabular-nums"
                />
              </div>
            </DumGroupe>

            <DumGroupe>
              <DumTitle>Round Off (auto)</DumTitle>
              <Input
                type="number"
                placeholder="00.00"
                className="no-spinner text-right font-bold tabular-nums"
              />
            </DumGroupe>
            <Separator />
            <DumGroupe>
              <DumTitle>Net Payable</DumTitle>
              <DumInput className="text-right font-bold text-primary/60 text-sm">
                {rupeesFmt(totals.netPayable)}
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
