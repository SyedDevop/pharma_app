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
