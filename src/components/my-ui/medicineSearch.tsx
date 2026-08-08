import { CircleNotchIcon } from "@phosphor-icons/react";
import React from "react";

import { fetchApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "./autocomplete";

type MedicineItemRes = {
  count: number;
  items: MedicineItem[];
};
async function searchMedicines(term: string): Promise<MedicineItem[]> {
  if (!term) return [];
  // Note: do NOT encodeURIComponent here — fetchApi already runs the value
  // through searchParams.set(), so pre-encoding double-escapes it.
  const body = await fetchApi<MedicineItemRes>("get_inventory.php", {
    query: term,
  });
  console.log(body);

  return Array.isArray(body.data.items) ? body.data.items : [];
}

/* ------------------------------------------------------------------ */
/* expiry + schedule helpers (exported — the table uses them too)      */
/* ------------------------------------------------------------------ */

export type ExpiryTone = "expired" | "critical" | "warning" | "normal" | "unknown";

/** Handles `YYYY-MM-DD`, `YYYY-MM`, `MM/YY`, `MM/YYYY`, `MM-YY`. */
export function parseExpiry(raw?: string | null): Date | null {
  if (!raw) return null;
  const value = raw.trim();

  const iso = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(value);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    // No day given → treat as the last day of that month.
    return iso[3]
      ? new Date(year, month - 1, Number(iso[3]), 23, 59, 59)
      : new Date(year, month, 0, 23, 59, 59);
  }

  const short = /^(\d{1,2})[/-](\d{2}|\d{4})$/.exec(value);
  if (short) {
    const month = Number(short[1]);
    const year = short[2].length === 2 ? 2000 + Number(short[2]) : Number(short[2]);
    return new Date(year, month, 0, 23, 59, 59);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatExpiry(raw?: string | null): string {
  const date = parseExpiry(raw);
  if (!date) return raw?.trim() ?? "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

export function daysToExpiry(raw?: string | null): number | null {
  const date = parseExpiry(raw);
  if (!date) return null;
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

export function expiryTone(raw?: string | null): ExpiryTone {
  const days = daysToExpiry(raw);
  if (days === null) return "unknown";
  if (days <= 0) return "expired";
  if (days <= 60) return "critical"; // orange — 31–60 day band in the legend
  if (days <= 90) return "warning"; // yellow — 61–90 day band
  return "normal";
}

/** Matches the dot colours in the legend above the table. */
export const expiryDotClass: Record<ExpiryTone, string> = {
  expired: "bg-red-600",
  critical: "bg-orange-500",
  warning: "bg-yellow-400",
  normal: "bg-green-500",
  unknown: "bg-neutral-400",
};

export function isScheduled(schedule: ScheduleType): boolean {
  return schedule === "H" || schedule === "H1" || schedule === "X";
}

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

interface MedicineSearchProps {
  ref?: React.Ref<HTMLInputElement>;
  /** The text currently in the cell (`row.item`). */
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (medicine: MedicineItem) => void;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
  disabled?: boolean;
  className?: string;
}

export function MedicineSearch({
  ref,
  value,
  onValueChange,
  onSelect,
  placeholder = "Scan barcode or type medicine name...",
  debounceMs = 250,
  minChars = 2,
  disabled,
  className,
}: MedicineSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<MedicineItem[]>([]);

  const term = value.trim();
  const canSearch = term.length >= minChars;

  // Only fetch while the popup is open. Selecting an item closes it, so the
  // name we just wrote into the cell never triggers a second round-trip.
  React.useEffect(() => {
    if (!open || !canSearch) {
      setIsLoading(false);
      return undefined;
    }

    let ignore = false;
    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchMedicines(term);
        if (!ignore) setResults(data);
      } catch {
        if (!ignore) {
          setError("Couldn't load medicines. Check the connection and type again.");
          setResults([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [term, open, canSearch, debounceMs]);

  const handleSelect = React.useCallback(
    (medicine: MedicineItem) => {
      setOpen(false);
      setResults([]);
      onSelect(medicine);
    },
    [onSelect],
  );

  // Barcode scanners type the whole code in one burst — if it resolves to a
  // single exact barcode match, commit it without waiting for a click.
  React.useEffect(() => {
    if (isLoading || results.length !== 1) return;
    const [only] = results;
    if (only.barcode && only.barcode === term) handleSelect(only);
  }, [results, term, isLoading, handleSelect]);

  let status: React.ReactNode = null;
  if (isLoading) {
    status = (
      <div className="flex items-center gap-2">
        <CircleNotchIcon className="size-4 animate-spin" />
        Searching inventory...
      </div>
    );
  } else if (error) {
    status = error;
  } else if (results.length === 0) {
    status = `Nothing in stock matching "${term}"`;
  } else {
    status = `${results.length} batch${results.length === 1 ? "" : "es"} in stock`;
  }

  return (
    <Autocomplete
      items={results}
      value={value}
      onValueChange={onValueChange}
      open={open && canSearch}
      onOpenChange={setOpen}
      openOnInputClick
      itemToStringValue={(item: MedicineItem) => item.name}
      filter={null}
    >
      <AutocompleteInput
        ref={ref}
        size="sm"
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        className={cn("w-full", className)}
      />

      {canSearch && (
        <AutocompleteContent
          sideOffset={2}
          className="w-[min(36rem,var(--available-width))] max-w-none"
        >
          <AutocompleteStatus>{status}</AutocompleteStatus>
          <AutocompleteList>
            {(medicine: MedicineItem) => (
              <AutocompleteItem
                key={`${medicine.stock_id}-${medicine.batch}`}
                value={medicine}
                onClick={() => handleSelect(medicine)}
                className="items-start py-1.5"
              >
                <MedicineRow medicine={medicine} />
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      )}
    </Autocomplete>
  );
}

function MedicineRow({ medicine }: { medicine: MedicineItem }) {
  const tone = expiryTone(medicine.exp_date);
  const scheduled = isScheduled(medicine.schedule);

  return (
    <div className="flex w-full min-w-0 items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn("inline-block size-2 shrink-0 rounded-[1px]", expiryDotClass[tone])}
            title={tone === "expired" ? "Expired" : `Expires ${formatExpiry(medicine.exp_date)}`}
          />
          <span className="truncate font-medium text-foreground">{medicine.name}</span>
          {scheduled && (
            <span className="shrink-0 rounded-sm bg-purple-600/10 px-1 py-px font-semibold text-[10px] text-purple-700 uppercase">
              {medicine.schedule}
            </span>
          )}
          {medicine.schedule === "OTC" && (
            <span className="shrink-0 rounded-sm bg-blue-500/10 px-1 py-px font-semibold text-[10px] text-blue-700 uppercase">
              OTC
            </span>
          )}
          {medicine.is_narcotic === 1 && (
            <span className="shrink-0 rounded-sm bg-destructive/10 px-1 py-px font-semibold text-[10px] text-destructive uppercase">
              Narcotic
            </span>
          )}
        </div>
        <span className="truncate text-muted-foreground text-xs">
          {[
            medicine.batch && `Batch ${medicine.batch}`,
            medicine.exp_date && `Exp ${formatExpiry(medicine.exp_date)}`,
            medicine.packing,
            medicine.rack && `Rack ${medicine.rack}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs tabular-nums">
        <span className="font-medium text-foreground">₹{medicine.mrp}</span>
        <span className="text-muted-foreground">
          {medicine.stock} batch / {medicine.store_stock} store
        </span>
      </div>
    </div>
  );
}
