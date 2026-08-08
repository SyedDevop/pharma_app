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
import { useInvoiceStore } from "@/store/invoice_db";
import { MedicineSearch } from "../my-ui/medicineSearch";

export function SalesItems() {
  return (
    <div>
      <div className="mb-2 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
        <PillIcon className="size-4 text-primary" weight="bold" />
        <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
          Sales Item
        </h2>
      </div>
      <div className="flex gap-4 rounded-sm bg-muted p-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-orange-500" />
          Expiring 31–60 days
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-yellow-400" />
          Expiring 61–90 days
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-green-500" />
          Normal
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-purple-600" />
          H/H1/X Scheduled
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-blue-500" />
          OTC Scheduled
        </div>
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
            {[
              "#",
              "",
              "ITEM",
              "BATCH",
              "EXPIRY",
              "QTY",
              "STORE STOCK",
              "BATCH STOCK",
              "PACK",
              "MRP",
              "SELL RATE",
              "DISC",
              "GST%",
              "CGST",
              "SGST",
              "AMOUNT",
              "RACK",
            ].map((h) => (
              <TableHead
                key={h}
                className="whitespace-nowrap font-semibold text-neutral-100 text-xs tracking-wide"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoiceItems.map((row, idx) => {
            const isLast = idx === invoiceItems.length - 1;
            return (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>
                <TableCell>
                  <Button size="icon" variant="destructive" onClick={() => removeRow(row.id)}>
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
                  />
                </TableCell>
                <TableCell className="min-w-25">{row.batch}</TableCell>
                <TableCell className="min-w-25">{row.expiry}</TableCell>
                <TableCell className="w-20">
                  <Input
                    type="number"
                    className="no-spinner text-right px-1"
                    value={row.qty}
                    onChange={(e) => updateRow(idx, "qty", e.target.value)}
                  />
                </TableCell>
                <TableCell className="w-24 text-right text-muted-foreground text-sm">
                  {row.storeStock}
                </TableCell>
                <TableCell className="w-24 text-right text-muted-foreground text-sm">
                  {row.batchStock}
                </TableCell>
                <TableCell className="w-20">{row.pack}</TableCell>
                <TableCell className="w-24">{row.mrp}</TableCell>
                <TableCell className="w-28">
                  <Input
                    type="number"
                    className="no-spinner text-right"
                    value={row.sellRate}
                    onChange={(e) => updateRow(idx, "sellRate", e.target.value)}
                  />
                </TableCell>
                <TableCell className="min-w-35">
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
                      className="no-spinner rounded-l-none border-l-0 text-right"
                      value={row.disc}
                      onChange={(e) => updateRow(idx, "disc", e.target.value)}
                    />
                  </div>
                </TableCell>
                <TableCell className="w-20">{row.gstPct}</TableCell>
                <TableCell className="w-20 text-right text-sm">{row.cgst}</TableCell>
                <TableCell className="w-20 text-right text-sm">{row.sgst}</TableCell>
                <TableCell className="w-24 text-right font-medium text-sm">{row.amount}</TableCell>
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
          <kbd className="ml-1 rounded border bg-muted px-1.5 py-0.5 font-semibold text-[10px]">
            F2
          </kbd>
        </Button>
      </div>
    </div>
  );
}
