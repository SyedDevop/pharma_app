import { useInvoiceStore } from "@/store/invoice_db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function PatientDetails() {
  const patientName = useInvoiceStore((state) => state.patient.patient_name);
  const mobile = useInvoiceStore((state) => state.patient.mobile);
  const doctor_name = useInvoiceStore((state) => state.patient.doctor_name);
  const visit_no = useInvoiceStore((state) => state.patient.visit_no);
  const visit_type = useInvoiceStore((state) => state.patient.visit_type);
  const setPatient = useInvoiceStore((state) => state.updatePatientField);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
        <CardDescription>patients across departments and retail</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-3">
          <Field>
            <FieldLabel htmlFor="patient-name">Patient Name</FieldLabel>
            <Input
              id="patient-name"
              value={patientName}
              onChange={(e) => setPatient("patient_name", e.target.value)}
              placeholder="Patient Name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
            <Input
              id="mobile"
              value={mobile}
              type="number"
              onChange={(e) => setPatient("mobile", e.target.value)}
              className="no-spinner"
              placeholder="Mobile"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="doctor">Doctor</FieldLabel>
            <Input
              id="doctor"
              value={doctor_name}
              onChange={(e) => setPatient("doctor_name", e.target.value)}
              placeholder="Referring Doctor"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="visit-no">Visit No</FieldLabel>
            <Input id="visit-no" value={visit_no} placeholder="Visit No" disabled />
          </Field>
          <Field>
            <FieldLabel htmlFor="visit-type">Visit Type</FieldLabel>
            <Input id="visit-type" value={visit_type} placeholder="Visit Type" disabled />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
