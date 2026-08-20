import { fetchApi } from "@/lib/api";
import { EMPTY_INVOICE_TOTAL } from "./const_data";

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
export function calcInvoiceItemGstAndAmount(
  item: InvoiceItemFormData,
  { sellRate, gstPer }: { sellRate: number; gstPer: number },
) {
  const qty = Number(item.qty);
  const disc = Number(item.disc);
  const base = qty * sellRate;

  const discAmt = item.discType === "%" ? (base * disc) / 100 : disc;
  const taxable = Math.max(base - discAmt, 0);
  const gst = (taxable * gstPer) / 100;
  const gstSplit = gst / 2;
  const amount = taxable + gst;
  return { cgst: gstSplit, sgst: gstSplit, gst, amount, taxable };
}

export function mapMedicineItemToInvoiceItem(med: MedicineItem, item: InvoiceItemFormData) {
  const amountAndGst = calcInvoiceItemGstAndAmount(item, {
    sellRate: med.unit_mrp,
    gstPer: med.gst,
  });
  const packBreakdown = `${med.stock} pk x ${med.packing_size} = ${med.total_units} units`;
  return {
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
    gstAmount: amountAndGst.gst,
    cgst: amountAndGst.cgst.toFixed(2),
    sgst: amountAndGst.sgst.toFixed(2),
    amount: amountAndGst.amount.toFixed(2),
  } satisfies InvoiceItemFormData;
}

export const updateInvoiceItem = (
  invoiceItems: InvoiceItemFormData[],
  index: number,
  key: keyof InvoiceItemFormData,
  value: InvoiceItemFormData[keyof InvoiceItemFormData],
  maxDiscount: number,
) => {
  const prev = invoiceItems[index];
  if (!prev || prev[key] === value) return invoiceItems;

  const draft = { ...prev, [key]: value };

  const discNum = Number(draft.disc);
  const saleNum = Number(draft.sellRate);

  draft.sellRate = Math.min(saleNum, Number(draft.mrp)).toString();
  draft.qty = Math.min(Number(draft.qty), Number(draft.storeStock)).toString();

  if (key === "discType" || key === "disc") {
    const disAmount =
      draft.discType === "%"
        ? Math.min(discNum, maxDiscount)
        : Math.min(discNum, Math.round((saleNum * maxDiscount) / 100));

    draft.disc = disAmount.toString();
  }

  if (RE_CALC_FOR.has(key)) {
    const amounts = calcInvoiceItemGstAndAmount(draft, {
      sellRate: Number(draft.sellRate),
      gstPer: Number(draft.gstPct),
    });
    draft.gstAmount = amounts.gst;
    draft.cgst = amounts.cgst.toFixed(2);
    draft.sgst = amounts.sgst.toFixed(2);
    draft.amount = amounts.amount.toFixed(2);
    draft.taxableAmount = amounts.taxable;
  }

  const next = invoiceItems.slice();
  next[index] = draft;
  return next;
};

export const updateInvoiceTotals = (items: InvoiceItemFormData[]) =>
  items.reduce((acc, inv) => {
    const subTotal = acc.subTotal + inv.taxableAmount;
    const gstTotal = acc.gstTotal + inv.gstAmount;
    const netPayable = acc.netPayable + subTotal + gstTotal;
    return { subTotal, gstTotal, netPayable };
  }, EMPTY_INVOICE_TOTAL);
