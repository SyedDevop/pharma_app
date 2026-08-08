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

export function calcInvoiceItemGstAndAmount(med: MedicineItem, item: InvoiceItemFormData) {
  const qty = Number(item.qty);
  const sellRate = med.unit_mrp;
  const disc = Number(item.disc);
  const _gst = med.gst;
  const base = qty * sellRate;

  const discAmt = item.discType === "%" ? (base * disc) / 100 : disc;
  const taxable = Math.max(base - discAmt, 0);
  const gst = (taxable * _gst) / 100;
  const gstSplit = gst / 2;
  const amount = taxable + gst;
  return { cgst: gstSplit, sgst: gstSplit, amount };
}

export function mapMedicineItemToInvoiceItem(med: MedicineItem, item: InvoiceItemFormData) {
  const amountAndGst = calcInvoiceItemGstAndAmount(med, item);
  const packBreakdown = `${med.stock} pk x ${med.packing_size} = ${med.total_units} units`;
  return {
    ...item,
    item: med.name,
    batch: med.batch,
    expiry: med.exp_date,
    pack: med.packing,
    packBreakdown,
    batchStock: med.total_units.toString(),
    storeStock: med.total_store_units.toString(),
    mrp: med.mrp.toString(),
    sellRate: med.unit_mrp.toString(),
    gstPct: med.gst.toString(),
    cgst: amountAndGst.cgst.toString(),
    sgst: amountAndGst.sgst.toString(),
    amount: amountAndGst.amount.toString(),
  } satisfies InvoiceItemFormData;
}
