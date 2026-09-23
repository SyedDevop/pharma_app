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
  updateGstSlab,
  updateInvoiceItem,
  updateInvoiceTotals,
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
      set((s) => ({
        invoiceItems: [
          ...s.invoiceItems.filter((i) => i.id !== item.id),
          mapMedicineItemToInvoiceItem(med, item),
        ],
      }));
    },
    deleteInvoiceItems: (id: string) => {
      set((s) => {
        const invoiceItems = s.invoiceItems.filter((i) => i.id !== id);
        let payment = s.payment;
        let adjustment = s.adjustment;
        const gstSlab = updateGstSlab(invoiceItems);
        const totals = updateInvoiceTotals(invoiceItems);
        payment = calculateInvoicePayment(totals.netPayable, payment);
        if (invoiceItems.length === 0) {
          invoiceItems.push(emptyInvoiceItem());
          adjustment = EMPTY_INVOICE_ADJUSTMENT;
        }
        return { invoiceItems, totals, payment, gstSlab, adjustment };
      });
    },
    updateInvoiceItemsField: (index, key, value) => {
      set((s) => {
        const adjustment = { ...s.adjustment };
        let gstSlab = s.gstSlab;
        const invoiceItems = updateInvoiceItem(
          s.invoiceItems,
          index,
          key,
          value,
          s.maxDiscount,
          adjustment,
        );
        const isDiscountApplied = invoiceItems.some((item) => Number(item.disc) > 0);
        let totals = s.totals;
        let payment = s.payment;
        if (key !== "item") {
          totals = updateInvoiceTotals(invoiceItems);
          const roundOff = Math.round(totals.netPayable) - totals.netPayable;
          adjustment.roundOff = roundOff.toFixed(2);
          totals.roundedNetPayable += roundOff;
          payment = calculateInvoicePayment(totals.roundedNetPayable, payment);
          gstSlab = updateGstSlab(invoiceItems);
        }
        adjustment.disableBulkDisc = isDiscountApplied
          ? "Bulk discount is disabled because an item discount is already applied."
          : undefined;
        return { invoiceItems, totals, payment, adjustment, gstSlab };
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
        const adjustment = { ...s.adjustment };
        let totals = s.totals;
        if (k === "roundOff") {
          totals = {
            ...totals,
            roundedNetPayable: totals.netPayable + Number(v),
          };
        }

        // Don't update if disableBulkDisc is set
        if (adjustment.disableBulkDisc) return s;
        adjustment[k] = v;

        if (Number(adjustment.disc) > 0) {
          adjustment.disableItemsDisc = "Bulk Discount has already been applied Applied";
        } else adjustment.disableItemsDisc = undefined;

        return { adjustment, totals };
      });
    },
    gstSlab: new Map(),
  })),
);
