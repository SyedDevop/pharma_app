import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function PatientDetails() {
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
            <Input id="patient-name" placeholder="Patient Name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
            <Input id="mobile" placeholder="Mobile" />
          </Field>
          <Field>
            <FieldLabel htmlFor="doctor">Doctor</FieldLabel>
            <Input id="doctor" placeholder="Referring Doctor" />
          </Field>
          <Field>
            <FieldLabel htmlFor="visit-no">Visit No</FieldLabel>
            <Input id="visit-no" placeholder="Visit No" disabled />
          </Field>
          <Field>
            <FieldLabel htmlFor="visit-type">Visit Type</FieldLabel>
            <Input id="visit-type" placeholder="Visit Type" disabled />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
