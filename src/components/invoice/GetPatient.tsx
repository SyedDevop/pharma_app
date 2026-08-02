import {
  BedIcon,
  MagnifyingGlassIcon,
  StethoscopeIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { accent, PatientSearch } from "@/components/my-ui/PatientSearch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoiceStore } from "@/store/invoice_db";
import { Separator } from "../ui/separator";

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
  const fetchPatientBalance = useInvoiceStore((s) => s.fetchPatientBalance);
  return (
    <div>
      <div className="mb-4 flex max-w-fit items-center gap-2.5 rounded-r-sm border-primary border-l-2 bg-primary/10 py-1 pr-4 pl-3">
        <MagnifyingGlassIcon className="size-4 text-primary" weight="bold" />
        <h2 className="font-heading font-semibold text-foreground text-sm tracking-wide">
          Patient Search
        </h2>
      </div>
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
                onSelect={(p) => {
                  onSelect?.(p);
                  fetchPatientBalance(p);
                }}
                placeholder={col.description}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
