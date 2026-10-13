import { fetchApi } from "@/lib/api";

export async function fetchPatientBalance(p: Patient) {
  var visit_id: string = "";
  var patient_id: string = "";

  if (p.visit_no.startsWith("CUST-")) {
    patient_id = p.visit_no.slice(5);
  } else {
    visit_id = p.visit_no;
  }
  const data = await fetchApi<PatientBalance>("get_patient_balance.php", {
    patient_id,
    visit_id,
  });
  return data.data;
}

export const RE_CALC_FOR = new Set<keyof InvoiceItemFormData>([
  "qty",
  "sellRate",
  "gstPct",
  "disc",
  "discType",
]);

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const toNum = (v: string | number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

export function calcInvoiceItemGstAndAmount(
  item: InvoiceItemFormData,
  { sellRate, gstPer }: { sellRate: number; gstPer: number },
) {
  const qty = toNum(item.qty);
  const disc = toNum(item.disc);
  const base = qty * sellRate;

  const discAmt = item.discType === "%" ? (base * disc) / 100 : disc;
  const taxable = round2(clamp(base - discAmt, 0, base));
  const gst = round2((taxable * gstPer) / 100);
  const gstSplit = gst / 2;
  const amount = round2(taxable + gst);
  return { cgst: gstSplit, sgst: gstSplit, gst, amount, taxable };
}

// Clamps qty, sell rate and discount to their limits, then recomputes the line amounts.
// Typed values are only rewritten when they exceed a limit.
export function recalcInvoiceItem(item: InvoiceItemFormData, maxDiscount: number) {
  const draft = { ...item };

  const sellRate = clamp(toNum(draft.sellRate), 0, toNum(draft.mrp));
  if (sellRate !== toNum(draft.sellRate)) draft.sellRate = sellRate.toString();

  const qty = clamp(toNum(draft.qty), 0, toNum(draft.storeStock));
  if (qty !== toNum(draft.qty)) draft.qty = qty.toString();

  // "₹" is a flat discount on the whole line, so its limit scales with qty.
  const discLimit =
    draft.discType === "%" ? maxDiscount : round2((qty * sellRate * maxDiscount) / 100);
  const disc = clamp(toNum(draft.disc), 0, discLimit);
  if (disc !== toNum(draft.disc)) draft.disc = disc.toString();

  const amounts = calcInvoiceItemGstAndAmount(draft, {
    sellRate,
    gstPer: toNum(draft.gstPct),
  });
  draft.gstAmount = amounts.gst;
  draft.cgst = amounts.cgst.toFixed(2);
  draft.sgst = amounts.sgst.toFixed(2);
  draft.amount = amounts.amount.toFixed(2);
  draft.taxableAmount = amounts.taxable;
  return draft;
}

export function mapMedicineItemToInvoiceItem(
  med: MedicineItem,
  item: InvoiceItemFormData,
  maxDiscount: number,
) {
  const packBreakdown = `${med.stock} pk x ${med.packing_size} = ${med.total_units} units`;
  return recalcInvoiceItem(
    {
      ...item,
      item: med.name,
      schedule: med.schedule,
      batch: med.batch,
      expiry: med.exp_date,
      pack: med.packing,
      packBreakdown,
      batchStock: med.total_units.toFixed(2),
      storeStock: med.total_store_units.toFixed(2),
      mrp: med.mrp.toString(),
      sellRate: med.unit_mrp.toString(),
      gstPct: med.gst.toString(),
    },
    maxDiscount,
  );
}

export const updateInvoiceItem = (
  invoiceItems: InvoiceItemFormData[],
  index: number,
  key: keyof InvoiceItemFormData,
  value: InvoiceItemFormData[keyof InvoiceItemFormData],
  maxDiscount: number,
  adjustment: InvoiceAdjustment,
) => {
  const prev = invoiceItems[index];
  if (!prev || prev[key] === value) return invoiceItems;
  if (Number(adjustment.disc) > 0 && (key === "discType" || key === "disc")) return invoiceItems;

  const draft = { ...prev, [key]: value };

  const next = invoiceItems.slice();
  next[index] = RE_CALC_FOR.has(key) ? recalcInvoiceItem(draft, maxDiscount) : draft;
  return next;
};

const sumItems = (items: InvoiceItemFormData[]) =>
  items.reduce(
    (acc, inv) => ({
      taxable: acc.taxable + inv.taxableAmount,
      gst: acc.gst + inv.gstAmount,
    }),
    { taxable: 0, gst: 0 },
  );

// Bulk discount in rupees, limited to `maxDiscount` percent of the taxable amount.
export const calcBulkDiscount = (
  taxable: number,
  adjustment: InvoiceAdjustment,
  maxDiscount: number,
) => {
  const disc = toNum(adjustment.disc);
  const limit = (taxable * maxDiscount) / 100;
  const amount = adjustment.discType === "%" ? (taxable * disc) / 100 : disc;
  return round2(clamp(amount, 0, limit));
};

// The bulk discount comes off the taxable amount, so GST shrinks in the same proportion.
const bulkDiscFactor = (taxable: number, bulkDisc: number) =>
  taxable > 0 ? 1 - bulkDisc / taxable : 1;

export const updateInvoiceTotals = (items: InvoiceItemFormData[], bulkDisc = 0): InvoiceTotal => {
  const sum = sumItems(items);
  const subTotal = round2(sum.taxable - bulkDisc);
  const gstTotal = round2(sum.gst * bulkDiscFactor(sum.taxable, bulkDisc));
  const netPayable = round2(subTotal + gstTotal);
  return { subTotal, gstTotal, netPayable, roundedNetPayable: netPayable };
};

export const updateGstSlab = (items: InvoiceItemFormData[], bulkDisc = 0) => {
  const factor = bulkDiscFactor(sumItems(items).taxable, bulkDisc);
  const gstSlab: Map<string, InvoiceGstSlab> = new Map();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // Rows without a medicine are placeholders, not part of the bill.
    if (!item.item) continue;
    const gst = toNum(item.gstPct);
    const key = gst.toString();
    const slab = gstSlab.get(key) ?? { gst, cgst: 0, sgst: 0, taxable: 0, amount: 0 };
    const taxable = item.taxableAmount * factor;
    const gstSplit = (item.gstAmount * factor) / 2;
    gstSlab.set(key, {
      gst,
      cgst: slab.cgst + gstSplit,
      sgst: slab.sgst + gstSplit,
      taxable: slab.taxable + taxable,
      amount: slab.amount + taxable + gstSplit * 2,
    } satisfies InvoiceGstSlab);
  }
  for (const slab of gstSlab.values()) {
    slab.cgst = round2(slab.cgst);
    slab.sgst = round2(slab.sgst);
    slab.taxable = round2(slab.taxable);
    slab.amount = round2(slab.amount);
  }
  return gstSlab;
};

export const calculateInvoicePayment = (netPayable: number, payment: InvoicePayment) => {
  const totalPaid = Number(payment.cash) + Number(payment.card) + Number(payment.upi);
  const balance = round2(totalPaid - netPayable);
  return { ...payment, totalPaid, balance };
};

// Rebuilds everything derived from the items: totals, GST slabs, auto round off, payment
// balance and the item/bulk discount locks.
export const recalcInvoice = (
  invoiceItems: InvoiceItemFormData[],
  prevAdjustment: InvoiceAdjustment,
  prevPayment: InvoicePayment,
  maxDiscount: number,
) => {
  const adjustment = { ...prevAdjustment };
  const hasItemDisc = invoiceItems.some((item) => Number(item.disc) > 0);
  const grossTaxable = sumItems(invoiceItems).taxable;
  const bulkDisc = hasItemDisc ? 0 : calcBulkDiscount(grossTaxable, adjustment, maxDiscount);

  // Keep the typed bulk discount in line with what is actually applied.
  const appliedDisc =
    adjustment.discType === "%" ? clamp(toNum(adjustment.disc), 0, maxDiscount) : bulkDisc;
  if (!hasItemDisc && appliedDisc !== toNum(adjustment.disc)) {
    adjustment.disc = appliedDisc.toString();
  }

  const totals = updateInvoiceTotals(invoiceItems, bulkDisc);
  const rounded = Math.round(totals.netPayable);
  adjustment.roundOff = round2(rounded - totals.netPayable).toFixed(2);
  totals.roundedNetPayable = rounded;

  adjustment.disableBulkDisc = hasItemDisc
    ? "Bulk discount is disabled because an item discount is already applied."
    : undefined;
  adjustment.disableItemsDisc =
    Number(adjustment.disc) > 0 ? "Bulk discount has already been applied." : undefined;

  return {
    totals,
    gstSlab: updateGstSlab(invoiceItems, bulkDisc),
    payment: calculateInvoicePayment(totals.roundedNetPayable, prevPayment),
    adjustment,
  };
};
