import { fetchApi } from "@/lib/api";

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

export async function fetchPatientBalance(id: number) {
  const data = await fetchApi<PatientBalance>("get_patient_balance.php", {
    patientId: id,
  });
  return data.data;
}
