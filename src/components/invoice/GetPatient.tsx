import {
  BedIcon,
  MagnifyingGlassIcon,
  StethoscopeIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { accent, PatientSearch } from "@/components/my-ui/PatientSearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  {
    key: "ipd" as const,
    label: "IPD",
    description: "In-patient No, Name or Mobile number",
    icons: BedIcon,
  },
  {
    key: "opd" as const,
    label: "OPD",
    description: "Out-patient No, Name or Mobile number",
    icons: StethoscopeIcon,
  },
  {
    key: "customer" as const,
    label: "Retail",
    description: "Walk-in customers Name or Mobile number",
    icons: StorefrontIcon,
  },
] as const;

interface Props {
  onSelect?: (patient: Patient) => void;
}

export function GetPatient({ onSelect }: Props) {
  return (
    <Card className="mt-4 gap-0 py-0">
      <CardHeader className="border-border border-b bg-primary/5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MagnifyingGlassIcon className="size-4.5" weight="bold" />
          </div>
          <div>
            <CardTitle className="font-semibold text-base">Patient Search</CardTitle>
            <CardDescription className="text-muted-foreground">
              Look up patients across departments and retail
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col) => {
            const style = accent[col.key];
            const Icon = col.icons;
            return (
              <section
                key={col.key}
                className={`flex flex-col gap-3 rounded-lg border ${style.border}/30 ${style.bg} p-3`}
              >
                <div className={`flex items-center gap-1.5 ${style.text}`}>
                  <Icon className="size-4" weight="bold" />
                  <span className="font-heading font-semibold text-xs uppercase tracking-wide">
                    {col.label}
                  </span>
                </div>
                <PatientSearch
                  patientFrom={col.key}
                  onSelect={onSelect}
                  placeholder={col.description}
                />
              </section>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
