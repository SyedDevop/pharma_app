import { create } from "zustand";
import {
  EMPTY_CUSTOMER_FORMS,
  EMPTY_INVOICE_ADJUSTMENT,
  EMPTY_INVOICE_TOTAL,
  EMPTY_PATIENT,
  emptyInvoiceItem,
} from "./invoice/const_data.ts";
import {
  fetchPatientBalance,
  mapMedicineItemToInvoiceItem,
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
  adjustment: InvoiceAdjustment;
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
};

export const useInvoiceStore = create<State & Actions>((set) => ({
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
    set((s) => ({ invoiceItems: s.invoiceItems.filter((i) => i.id !== id) }));
  },
  updateInvoiceItemsField: (index, k, v) => {
    set((s) => {
      const invoiceItems = updateInvoiceItem(s.invoiceItems, index, k, v, s.maxDiscount);
      let totals = s.totals;

      if (k !== "item") {
        const discDis: Map<number, DiscountDistribution> = new Map();
        let taxableAmount = 0;
        for (let i = 0; i < invoiceItems.length; i++) {
          const inv = invoiceItems[i];
          const gst = Number(inv.gstPct);
          const dis = discDis.get(gst);
          taxableAmount += inv.taxableAmount;
          if (dis) {
            dis.amount += inv.taxableAmount;
            discDis.set(gst, dis);
          } else {
            discDis.set(gst, {
              amount: inv.taxableAmount,
              gstPercent: gst,
              distributionPercent: 0,
            });
          }
        }
        console.log(discDis);
        discDis.forEach((dis) => {
          dis.distributionPercent = (dis.amount / taxableAmount) * 100;
        });
        console.log(discDis);

        totals = invoiceItems.reduce((acc, inv) => {
          return {
            subTotal: acc.subTotal + inv.taxableAmount,
            gstTotal: acc.gstTotal + inv.gstAmount,
            netPayable: 0,
          };
        }, EMPTY_INVOICE_TOTAL);

        const discNum = Number(s.adjustment.disc);
        const disAmount =
          s.adjustment.discType === "%"
            ? Math.min(discNum, s.maxDiscount)
            : Math.min(discNum, Math.round((totals.subTotal * s.maxDiscount) / 100));
        totals.netPayable = totals.subTotal - disAmount;
      }
      return { invoiceItems, totals };
    });
  },
  updateInvoiceItems: (index, patch) => {
    set((s) => ({
      invoiceItems: s.invoiceItems.map((i, idx) => (idx === index ? { ...i, ...patch } : i)),
    }));
  },

  totals: EMPTY_INVOICE_TOTAL,
  adjustment: EMPTY_INVOICE_ADJUSTMENT,
}));
