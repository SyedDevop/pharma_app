import { PatientSearch } from "@/components/my-ui/PatientSearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  {
    key: "ipd" as const,
    label: "IPD",
    description: "In-patient No, Name or Mobile number",
  },
  {
    key: "opd" as const,
    label: "OPD",
    description: "Out-patient No, Name or Mobile number",
  },
  {
    key: "customer" as const,
    label: "Retail",
    description: "Walk-in customers Name or Mobile number",
  },
] as const;

interface Props {
  onSelect?: (patient: Patient) => void;
}
export function GetPatient({ onSelect }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Patient Search</CardTitle>
        <CardDescription>Look up patients across departments and retail</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="grid grid-cols-3 gap-5">
          {columns.map((col) => (
            <section key={col.key} className="flex flex-col gap-3">
              <PatientSearch
                patientFrom={col.key}
                onSelect={onSelect}
                placeholder={col.description}
              />
            </section>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
