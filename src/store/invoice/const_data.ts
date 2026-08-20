export const EMPTY_PATIENT: Patient = {
  visit_type: "",
  patient_id: 0,
  visit_no: "",
  visit_date: "",
  doctor_name: "",
  patient_name: "",
  mobile: "",
  address: "",
} as const;

export const EMPTY_INVOICE_TOTAL: InvoiceTotal = {
  subTotal: 0,
  gstTotal: 0,
  //totalAmount: 0,
  netPayable: 0,
} as const;

export const EMPTY_INVOICE_PAYMENT: InvoicePayment = {
  upi: "",
  card: "",
  cash: "",
  totalPaid: 0,
  balance: 0,
} as const;

export const EMPTY_INVOICE_ADJUSTMENT: InvoiceAdjustment = {
  discType: "%",
  disc: "",
  roundOff: "",
} as const;

export const EMPTY_CUSTOMER_FORMS: CustomerTypeFormData = {
  retail: {
    previous_due: "",
    advance_available: "",
    advance_applied: "",
  },
  b2b: {
    name: "",
    gstin: "",
    address: "",
  },
  staff: {
    employee_id: "",
    name: "",
    department: "",
  },
  insurance: {
    company: "",
    policy_tpa: "",
    auth_code: "",
    coverage_amount: "",
  },
} as const;

export const emptyInvoiceItem = (): InvoiceItemFormData =>
  ({
    id: crypto.randomUUID(),
    item: "",
    schedule: "",
    batch: "—",
    expiry: "—",
    qty: "1",
    storeStock: "0",
    batchStock: "0",
    pack: "0",
    packBreakdown: "",
    mrp: "0",
    sellRate: "0",
    discType: "%",
    disc: "0",
    gstPct: "0",
    cgst: "0",
    sgst: "0",
    amount: "0",
    gstAmount: 0,
    taxableAmount: 0,
  }) as const;
