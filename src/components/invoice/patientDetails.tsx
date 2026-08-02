import { IdentificationCardIcon } from "@phosphor-icons/react";
import { useInvoiceStore } from "@/store/invoice_db";
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
    <div>
      <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
        <IdentificationCardIcon className="size-4 text-primary" weight="bold" />
        <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
          Patient Details
        </h2>
      </div>
      <FieldGroup className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="patient-name">Patient Name</FieldLabel>
          <Input
            id="patient-name"
            value={patientName}
            onChange={(e) => setPatient("patient_name", e.target.value)}
            placeholder="Patient Name"
            className="focus-visible:border-primary focus-visible:ring-primary/30"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
          <Input
            id="mobile"
            value={mobile}
            type="number"
            onChange={(e) => setPatient("mobile", e.target.value)}
            className="no-spinner focus-visible:border-primary focus-visible:ring-primary/30"
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
            className="focus-visible:border-primary focus-visible:ring-primary/30"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="visit-no" className="text-muted-foreground">
            Visit No
          </FieldLabel>
          <Input
            id="visit-no"
            value={visit_no}
            placeholder="Visit No"
            disabled
            className="disabled:border-chart-3/30 disabled:bg-chart-3/10 disabled:text-chart-4 disabled:opacity-100"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="visit-type" className="text-muted-foreground">
            Visit Type
          </FieldLabel>
          <Input
            id="visit-type"
            value={visit_type}
            placeholder="Visit Type"
            disabled
            className="disabled:border-chart-3/30 disabled:bg-chart-3/10 disabled:text-chart-4 disabled:opacity-100"
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
