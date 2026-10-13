import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  EMPTY_CUSTOMER_FORMS,
  EMPTY_INVOICE_ADJUSTMENT,
  EMPTY_INVOICE_PAYMENT,
  EMPTY_INVOICE_TOTAL,
  EMPTY_PATIENT,
  emptyInvoiceItem,
} from "./invoice/const_data.ts";
import {
  calculateInvoicePayment,
  fetchPatientBalance,
  mapMedicineItemToInvoiceItem,
  recalcInvoice,
  round2,
  updateInvoiceItem,
} from "./invoice/helper";

type State = {
  invoiceNumber: string;
  patient: Patient;
  patientBalance?: PatientBalance;
  customerType: CustomerTypes;
  customerTypeForm: CustomerTypeFormData;
  invoiceItems: InvoiceItemFormData[];
  maxDiscount: number;
  totals: InvoiceTotal;
  payment: InvoicePayment;
  adjustment: InvoiceAdjustment;
  gstSlab: Map<string, InvoiceGstSlab>;
};

type Actions = {
  setInvoiceNumber: (num: string) => void;

  setPatient: (p: Patient) => void;
  updatePatientField: <K extends keyof Patient>(key: K, value: Patient[K]) => void;
  updatePatient: (patch: Partial<Patient>) => void; // bonus: multi-field update
  resetPatient: () => void;

  fetchPatientBalance: (p: Patient) => Promise<void>;
  resetPatientBalance: () => void;

  setCustomerType: (type: CustomerTypes) => void;
  updateCustomerTypeForm: <T extends CustomerTypes>(
    type: T,
    patch: Partial<CustomerTypeFormData[T]>,
  ) => void;
  updateCustomerField: <T extends CustomerTypes, K extends keyof CustomerTypeFormData[T]>(
    type: T,
    key: K,
    value: CustomerTypeFormData[T][K],
  ) => void;
  resetCustomerTypeForm: () => void;

  setInvoiceItemsFromMedicineItem: (med: MedicineItem, item: InvoiceItemFormData) => void;
  addEmptyInvoiceItem: () => void;
  deleteInvoiceItems: (id: string) => void;
  updateInvoiceItemsField: <K extends keyof InvoiceItemFormData>(
    index: number,
    key: K,
    value: InvoiceItemFormData[K],
  ) => void;
  updateInvoiceItems: (index: number, patch: Partial<InvoiceItemFormData>) => void;
  updateInvoicePaymentField: <K extends InvoicePaymentMode>(
    key: K,
    value: InvoicePayment[K],
  ) => void;

  updateInvoiceAdjustment: <
    K extends keyof Omit<InvoiceAdjustment, "disableItemsDisc" | "disableBulkDisc">,
  >(
    key: K,
    value: InvoiceAdjustment[K],
  ) => void;

  fillPayment: (mode: InvoicePaymentMode) => void;
};

export const useInvoiceStore = create<State & Actions>()(
  devtools((set) => ({
    maxDiscount: 10,
    invoiceNumber: "",
    setInvoiceNumber: (num) => set({ invoiceNumber: num }),

    patient: EMPTY_PATIENT,
    setPatient: (p) => set({ patient: p }),
    updatePatientField: (k, v) => set((s) => ({ patient: { ...s.patient, [k]: v } })),
    updatePatient: (pa) => set((s) => ({ patient: { ...s.patient, ...pa } })),
    resetPatient: () => set({ patient: EMPTY_PATIENT }),
    patientBalance: undefined,
    fetchPatientBalance: async (p: Patient) => {
      set({ patientBalance: await fetchPatientBalance(p) });
    },
    resetPatientBalance: () => set({ patientBalance: undefined }),

    customerType: "retail",
    setCustomerType: (type) => set({ customerType: type }),

    customerTypeForm: EMPTY_CUSTOMER_FORMS,
    updateCustomerTypeForm: (t, patch) =>
      set((s) => ({
        customerTypeForm: {
          ...s.customerTypeForm,
          [t]: { ...s.customerTypeForm[t], ...patch },
        },
      })),
    updateCustomerField: (t, k, v) =>
      set((s) => ({
        customerTypeForm: {
          ...s.customerTypeForm,
          [t]: { ...s.customerTypeForm[t], [k]: v },
        },
      })),
    resetCustomerTypeForm: () => set({ customerTypeForm: undefined }),

    invoiceItems: Array.of(emptyInvoiceItem()),
    addEmptyInvoiceItem: () => {
      set((s) => ({ invoiceItems: [...s.invoiceItems, emptyInvoiceItem()] }));
    },
    setInvoiceItemsFromMedicineItem: (med, item) => {
      set((s) => {
        const invoiceItems = s.invoiceItems.map((i) =>
          i.id === item.id ? mapMedicineItemToInvoiceItem(med, i, s.maxDiscount) : i,
        );
        return {
          invoiceItems,
          ...recalcInvoice(invoiceItems, s.adjustment, s.payment, s.maxDiscount),
        };
      });
    },
    deleteInvoiceItems: (id: string) => {
      set((s) => {
        const invoiceItems = s.invoiceItems.filter((i) => i.id !== id);
        let adjustment = s.adjustment;
        if (invoiceItems.length === 0) {
          invoiceItems.push(emptyInvoiceItem());
          adjustment = EMPTY_INVOICE_ADJUSTMENT;
        }
        return {
          invoiceItems,
          ...recalcInvoice(invoiceItems, adjustment, s.payment, s.maxDiscount),
        };
      });
    },
    updateInvoiceItemsField: (index, key, value) => {
      set((s) => {
        const invoiceItems = updateInvoiceItem(
          s.invoiceItems,
          index,
          key,
          value,
          s.maxDiscount,
          s.adjustment,
        );
        if (invoiceItems === s.invoiceItems) return s;
        if (key === "item") return { invoiceItems };
        return {
          invoiceItems,
          ...recalcInvoice(invoiceItems, s.adjustment, s.payment, s.maxDiscount),
        };
      });
    },
    updateInvoiceItems: (index, patch) => {
      set((s) => ({
        invoiceItems: s.invoiceItems.map((i, idx) => (idx === index ? { ...i, ...patch } : i)),
      }));
    },

    totals: EMPTY_INVOICE_TOTAL,
    payment: EMPTY_INVOICE_PAYMENT,

    updateInvoicePaymentField: (k, v) => {
      set((s) => {
        let payment = { ...s.payment, [k]: v };
        payment = calculateInvoicePayment(s.totals.roundedNetPayable, payment);
        return { payment };
      });
    },

    fillPayment: (mode) => {
      set((s) => {
        let payment = s.payment;
        const totalFill = Number(payment.upi) + Number(payment.card) + Number(payment.cash);
        if (totalFill > s.totals.roundedNetPayable) return s;
        payment = {
          ...payment,
          [mode]: payment.totalPaid - payment.balance - totalFill,
        };
        payment = calculateInvoicePayment(s.totals.roundedNetPayable, payment);
        return { payment };
      });
    },

    adjustment: EMPTY_INVOICE_ADJUSTMENT,

    updateInvoiceAdjustment: (k, v) => {
      set((s) => {
        if (k === "roundOff") {
          const totals = {
            ...s.totals,
            roundedNetPayable: round2(s.totals.netPayable + (Number(v) || 0)),
          };
          return {
            adjustment: { ...s.adjustment, roundOff: v },
            totals,
            payment: calculateInvoicePayment(totals.roundedNetPayable, s.payment),
          };
        }

        // Don't update if disableBulkDisc is set
        if (s.adjustment.disableBulkDisc) return s;
        const adjustment = { ...s.adjustment, [k]: v };
        return recalcInvoice(s.invoiceItems, adjustment, s.payment, s.maxDiscount);
      });
    },
    gstSlab: new Map(),
  })),
);
