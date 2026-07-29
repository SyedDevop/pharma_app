import { create } from "zustand";

type State = {
  invoiceNumber: string;
  patient?: Patient;
};

type Actions = {
  setPatient: (p: Patient) => void;
  setInvoiceNumber: (num: string) => void;
};

export const useInvoiceStore = create<State & Actions>((set) => ({
  invoiceNumber: "",
  setInvoiceNumber: (num) => set({ invoiceNumber: num }),

  patient: undefined,
  setPatient: (p) => set({ patient: p }),
}));
