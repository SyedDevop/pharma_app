import {
  CreditCardIcon,
  InvoiceIcon,
  KeyboardIcon,
  MoneyWavyIcon,
  PillIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CustomerType,
  GetPatient,
  InvoiceHistory,
  InvoiceInfo,
  LEGEND,
  SalesItems,
} from "@/components/invoice";
import { PatientDetails } from "@/components/invoice/patientDetails";
import { DumGroupe, DumInput, DumTitle } from "@/components/my-ui/dumInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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

      <div className="mt-4 grid grid-cols-3 gap-4">
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
                    {1600.0}
                  </DumInput>
                </DumGroupe>
                <DumGroupe>
                  <DumTitle>Gst Total </DumTitle>
                  <DumInput className="text-right font-bold text-primary/60 text-sm">
                    {1600.0}
                  </DumInput>
                </DumGroupe>
                <DumGroupe>
                  <DumTitle>Gst Amount</DumTitle>
                  <DumInput className="text-right font-bold text-primary/60 text-sm">
                    {1600.0}
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
                    {1600.0}
                  </DumInput>
                </DumGroupe>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <Input
                    type="number"
                    placeholder="00.00"
                    className="no-spinner text-right font-bold tabular-nums"
                  />
                </DumGroupe>
                <DumGroupe>
                  <DumTitle>Cash (F3)</DumTitle>
                  <Input
                    type="number"
                    placeholder="00.00"
                    className="no-spinner text-right font-bold tabular-nums"
                  />
                </DumGroupe>
                <DumGroupe>
                  <DumTitle>Cash (F4)</DumTitle>
                  <Input
                    type="number"
                    placeholder="00.00"
                    className="no-spinner text-right font-bold tabular-nums"
                  />
                </DumGroupe>
              </div>
              <div className="mt-21 space-y-2.5">
                <Separator />
                <DumGroupe>
                  <DumTitle>Total Paid</DumTitle>
                  <DumInput className="text-right font-bold text-primary/60 text-sm">
                    {1600.0}
                  </DumInput>
                </DumGroupe>
                <DumGroupe>
                  <DumTitle>Balance / Change</DumTitle>
                  <DumInput className="text-right font-bold text-primary/60 text-sm">
                    {1600.0}
                  </DumInput>
                </DumGroupe>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
