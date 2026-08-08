import { PillIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useInvoiceStore } from "@/store/invoice_db";
import {
  type ExpiryTone,
  expiryDotClass,
  expiryTone,
  MedicineSearch,
} from "../my-ui/medicineSearch";

const ALIGN_CLASS = {
  left: "",
  right: "text-right tabular-nums",
  center: "text-center",
} as const;

type HeaderAlign = keyof typeof ALIGN_CLASS;

const COLUMNS: { label: string; align?: HeaderAlign }[] = [
  { label: "#" },
  { label: "" },
  { label: "ITEM" },
  { label: "BATCH" },
  { label: "EXPIRY" },
  { label: "QTY", align: "right" },
  { label: "STORE", align: "right" },
  { label: "BATCH", align: "right" },
  { label: "PACK", align: "right" },
  { label: "MRP", align: "right" },
  { label: "SELL RATE", align: "right" },
  { label: "DISC", align: "right" },
  { label: "GST%", align: "right" },
  { label: "CGST", align: "right" },
  { label: "SGST", align: "right" },
  { label: "AMOUNT", align: "right" },
  { label: "RACK", align: "center" },
];

const EXPIRY_TEXT_CLASS: Record<ExpiryTone, string> = {
  expired: "text-red-600 dark:text-red-400",
  critical: "text-orange-700 dark:text-orange-400",
  warning: "text-yellow-700 dark:text-yellow-400",
  normal: "text-foreground",
  unknown: "text-muted-foreground",
};

const LEGEND = [
  { label: "Expiring 31–60 days", color: "bg-orange-500" },
  { label: "Expiring 61–90 days", color: "bg-yellow-400" },
  { label: "Normal", color: "bg-green-500" },
  { label: "H/H1/X Scheduled", color: "bg-purple-600" },
  { label: "OTC Scheduled", color: "bg-blue-500" },
] as const;

function ExpiryCell({ expiry }: { expiry: string }) {
  const tone = expiryTone(expiry);
  if (tone === "unknown") {
    return <span className="text-muted-foreground text-sm">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={cn("size-2 shrink-0 rounded-[1px]", expiryDotClass[tone])} />
      <span className={cn("font-medium tabular-nums", EXPIRY_TEXT_CLASS[tone])}>{expiry}</span>
    </span>
  );
}

export function SalesItems() {
  return (
    <div>
      <div className="mb-2 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l bg-primary/10 py-1 pr-4 pl-3">
        <PillIcon className="size-4 text-primary" weight="bold" />
        <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
          Sales Item
        </h2>
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
      <InvoiceLineTable />
    </div>
  );
}

export default function InvoiceLineTable() {
  const lastItemRef = React.useRef<HTMLInputElement>(null);
  const invoiceItems = useInvoiceStore((state) => state.invoiceItems);

  const addEmptyRow = useInvoiceStore((state) => state.addEmptyInvoiceItem);
  const setInvoiceItemsFromMedicineItem = useInvoiceStore(
    (state) => state.setInvoiceItemsFromMedicineItem,
  );

  const removeRow = useInvoiceStore((state) => state.deleteInvoiceItems);
  const updateRow = useInvoiceStore((state) => state.updateInvoiceItemsField);

  const addRow = React.useCallback(() => {
    addEmptyRow();
    requestAnimationFrame(() => lastItemRef.current?.focus());
  }, [addEmptyRow]);

  React.useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        event.preventDefault();
        addRow();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [addRow]);

  return (
    <div className="w-full overflow-x-auto rounded-sm border">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-900 hover:bg-neutral-900">
            {COLUMNS.map((col) => (
              <TableHead
                key={col.label}
                className={cn(
                  "whitespace-nowrap font-semibold text-neutral-100 text-xs tracking-wide",
                  ALIGN_CLASS[col.align ?? "left"],
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoiceItems.map((row, idx) => {
            const isLast = idx === invoiceItems.length - 1;
            return (
              <TableRow key={row.id} className="odd:bg-muted/30 hover:bg-primary/6">
                <TableCell className="text-muted-foreground text-sm tabular-nums">
                  {(idx + 1).toString().padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeRow(row.id)}
                    title="Remove row"
                  >
                    <XIcon />
                  </Button>
                </TableCell>
                <TableCell className="min-w-55">
                  <MedicineSearch
                    ref={isLast ? lastItemRef : null}
                    value={row.item}
                    onValueChange={(value) => updateRow(idx, "item", value)}
                    onSelect={(med) => {
                      setInvoiceItemsFromMedicineItem(med, row);
                    }}
                    schedule={row.schedule ?? undefined}
                  />
                </TableCell>
                <TableCell className="min-w-25 text-sm">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    {row.batch}
                  </div>
                </TableCell>
                <TableCell className="min-w-25">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    <ExpiryCell expiry={row.expiry} />
                  </div>
                </TableCell>
                <TableCell className="w-20">
                  <Input
                    type="number"
                    className="no-spinner px-1 text-right tabular-nums"
                    value={row.qty}
                    onChange={(e) => updateRow(idx, "qty", e.target.value)}
                  />
                </TableCell>
                <TableCell className="w-16 text-right">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    {row.storeStock}
                  </div>
                </TableCell>
                <TableCell className="w-16 text-right">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    {row.batchStock}
                  </div>
                </TableCell>
                <TableCell className="w-20 text-right text-sm tabular-nums">{row.pack}</TableCell>
                <TableCell className="w-24 text-right text-sm tabular-nums">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    {row.mrp}
                  </div>
                </TableCell>
                <TableCell className="w-28">
                  <Input
                    type="number"
                    className="no-spinner text-right tabular-nums"
                    value={row.sellRate}
                    onChange={(e) => updateRow(idx, "sellRate", e.target.value)}
                  />
                </TableCell>
                <TableCell className="w-35">
                  <div className="flex items-center">
                    <Select
                      defaultValue="%"
                      value={row.discType}
                      onValueChange={(v) => updateRow(idx, "discType", v as ItemDiscountType)}
                    >
                      <SelectTrigger className="rounded-r-none border-r-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="₹">₹</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      className="no-spinner rounded-l-none border-l-0 text-right tabular-nums"
                      value={row.disc}
                      onChange={(e) => updateRow(idx, "disc", e.target.value)}
                    />
                  </div>
                </TableCell>
                <TableCell className="w-20 text-right">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    {row.gstPct}
                  </div>
                </TableCell>
                <TableCell className="w-20 text-right">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    {row.cgst}
                  </div>
                </TableCell>
                <TableCell className="w-20 text-right">
                  <div className="rounded-sm border bg-primary/5 p-1 text-sm tabular-nums">
                    {row.sgst}
                  </div>
                </TableCell>
                <TableCell className="w-24 text-right">
                  <div className="rounded-sm border bg-primary/5 p-1 font-semibold text-sm tabular-nums">
                    {row.amount}
                  </div>
                </TableCell>
                <TableCell className="w-16 text-center text-muted-foreground text-sm">—</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="p-2">
        <Button variant="outline" size="sm" onClick={addRow} className="gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Row
          <kbd className="ml-1 rounded border bg-primary/5 px-1.5 py-0.5 font-semibold text-[10px]">
            F2
          </kbd>
        </Button>
      </div>
    </div>
  );
}
