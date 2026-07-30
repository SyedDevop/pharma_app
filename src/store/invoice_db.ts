import { create } from "zustand";
import { EMPTY_PATIENT } from "./const_data";

type State = {
  invoiceNumber: string;
  patient: Patient;
};

type Actions = {
  setInvoiceNumber: (num: string) => void;
  setPatient: (p: Patient) => void;
  updatePatientField: <K extends keyof Patient>(key: K, value: Patient[K]) => void;
  updatePatient: (patch: Partial<Patient>) => void; // bonus: multi-field update
  resetPatient: () => void;
};

export const useInvoiceStore = create<State & Actions>((set) => ({
  invoiceNumber: "",
  setInvoiceNumber: (num) => set({ invoiceNumber: num }),

  patient: EMPTY_PATIENT,
  setPatient: (p) => set({ patient: p }),
  updatePatientField: (k, v) => set((s) => ({ patient: { ...s.patient, [k]: v } })),
  updatePatient: (pa) => set((s) => ({ patient: { ...s.patient, ...pa } })),
  resetPatient: () => set({ patient: EMPTY_PATIENT }),
}));
