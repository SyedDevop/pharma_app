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
  return { cgst: gstSplit, sgst: gstSplit, amount };
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
    batchStock: med.total_units.toString(),
    storeStock: med.total_store_units.toString(),
    mrp: med.mrp.toString(),
    sellRate: med.unit_mrp.toString(),
    gstPct: med.gst.toString(),
    cgst: amountAndGst.cgst.toFixed(2),
    sgst: amountAndGst.sgst.toFixed(2),
    amount: amountAndGst.amount.toFixed(2),
  } satisfies InvoiceItemFormData;
}
