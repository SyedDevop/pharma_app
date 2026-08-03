type Patient = {
  visit_type: string;
  patient_id: number;
  visit_no: string;
  visit_date: string;
  doctor_name: string;
  patient_name: string;
  mobile: string;
  address: string;
};

type PatientBalance = {
  type: string;
  invoice_count: number;
  due_count: number;
  partial_count: number;
  paid_count: number;
  total_invoiced: number;
  total_paid: number;
  total_balance_col_sum: number;
  net_outstanding: number;
  total_advance: number;
  net_payable_now: number;
  invoices: Invoice[];
};

type Invoice = {
  id: number;
  invoice_no: string;
  invoice_date: string;
  opd_ipd_no?: string;
  patient_type?: PatientType;
  customer_name?: string;
  mobile?: string;
  net_total: string;
  paid_amount: string;
  balance_amount: string;
  payment_status: PaymentStatus;
  payment_mode?: PaymentMode;
  remarks?: string;
};

type PatientType = "IPD" | "OPD" | "CUSTOMER" | "";
type PaymentMode = "MIX" | "UPI" | "CARD" | "CASH";
type PaymentStatus = "PAID" | "DUE" | "PARTIAL";
