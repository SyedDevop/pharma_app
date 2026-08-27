import {
  BedIcon,
  type Icon,
  MagnifyingGlassIcon,
  StethoscopeIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { accent, type PatientFom, PatientSearch } from "@/components/my-ui/PatientSearch";
import { useInvoiceStore } from "@/store/invoice_db";

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

export function GetPatient() {
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
            <PatientSearchInput
              key={col.key}
              label={col.label}
              patientFrom={col.key}
              description={col.description}
              Icon={Icon}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  label: string;
  patientFrom: PatientFom;
  description: string;
  Icon: Icon;
  style: {
    bg: string;
    border: string;
    focus: string;
    text: string;
  };
}
function PatientSearchInput({ label, patientFrom, description, Icon, style }: Props) {
  const setPatient = useInvoiceStore((s) => s.setPatient);
  const fetchPatientBalance = useInvoiceStore((s) => s.fetchPatientBalance);
  return (
    <section className={`flex flex-col gap-3 rounded-lg border ${style.border}/30 ${style.bg} p-3`}>
      <div className={`flex items-center gap-1.5 ${style.text}`}>
        <Icon className="size-4" weight="bold" />
        <span className="font-heading font-semibold text-xs uppercase tracking-wide">{label}</span>
      </div>
      <PatientSearch
        patientFrom={patientFrom}
        onSelect={(p) => {
          setPatient(p);
          fetchPatientBalance(p);
        }}
        placeholder={description}
      />
    </section>
  );
}
