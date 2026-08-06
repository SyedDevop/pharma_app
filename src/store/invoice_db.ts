import { create } from "zustand";
import { EMPTY_CUSTOMER_FORMS, EMPTY_PATIENT, fetchPatientBalance } from "./invoice/helper";

type State = {
  invoiceNumber: string;
  patient: Patient;
  patientBalance?: PatientBalance;
  customerType: CustomerTypes;
  customerTypeForm: CustomerTypeFormData;
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
};

export const useInvoiceStore = create<State & Actions>((set) => ({
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
}));
