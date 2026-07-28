import { PatientSearch } from "@/components/my-ui/PatientSearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  { key: "ipd" as const, label: "IPD", description: "In-patient department" },
  { key: "opd" as const, label: "OPD", description: "Out-patient department" },
  {
    key: "customer" as const,
    label: "Retail",
    description: "Walk-in customers",
  },
] as const;

const accent = {
  ipd: {
    bg: "oklch(0.65 0.15 55 / 0.07)",
    border: "oklch(0.65 0.15 55)",
    text: "oklch(0.42 0.12 55)",
  },
  opd: {
    bg: "oklch(0.511 0.096 186.391 / 0.07)",
    border: "oklch(0.511 0.096 186.391)",
    text: "oklch(0.38 0.08 186)",
  },
  customer: {
    bg: "oklch(0.52 0.11 260 / 0.07)",
    border: "oklch(0.52 0.11 260)",
    text: "oklch(0.38 0.1 260)",
  },
} as const;

const placeholders = {
  ipd: "In-patient No, Name or Mobile number",
  opd: "Out-patient No, Name or Mobile number",
  customer: "Name or Mobile Number",
} as const;

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
              <div
                className="flex items-baseline gap-2 rounded-lg border px-3 py-2"
                style={{
                  backgroundColor: accent[col.key].bg,
                  borderColor: accent[col.key].border,
                }}
              >
                <span
                  className="font-heading text-xs font-semibold tracking-wide uppercase"
                  style={{ color: accent[col.key].text }}
                >
                  {col.label}
                </span>
                <span className="text-xs text-muted-foreground">{col.description}</span>
              </div>
              <PatientSearch
                patientFrom={col.key}
                onSelect={onSelect}
                placeholder={placeholders[col.key]}
              />
            </section>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
