import { CircleNotchIcon } from "@phosphor-icons/react";
import React from "react";
import { fetchApi } from "@/lib/api";
import { Label } from "../ui/label";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "./autocomplete";

type PatientFom = "ipd" | "opd" | "customer";

const accentMap: Record<PatientFom, string> = {
  ipd: "oklch(0.65 0.15 55)",
  opd: "oklch(0.511 0.096 186.391)",
  customer: "oklch(0.52 0.11 260)",
};

const accent = {
  ipd: {
    bg: "bg-[oklch(0.65_0.15_55_/0.07)]",
    border: "border-[oklch(0.65_0.15_55)]",
    focus: "border-[oklch(0.65_0.15_55)]",
    text: "text-[oklch(0.42_0.12_55)]",
  },
  opd: {
    bg: "bg-[oklch(0.511_0.096_186.391_/_0.07)]",
    border: "border-[oklch(0.511_0.096_186.391)]",
    focus: "focus-[oklch(0.511_0.096_186.391)]",
    text: "text-[oklch(0.38_0.08_186)]",
  },
  customer: {
    bg: "bg-[oklch(0.52_0.11_260/0.07)]",
    border: "border-[oklch(0.52_0.11_260)]",
    focus: "focus-[oklch(0.52_0.11_260)]",
    text: "text-[oklch(0.38_0.1_260)]",
  },
} as const;

async function searchPatients(term: string, from: PatientFom) {
  if (!term) return [];
  const encoded = encodeURIComponent(term);
  const body = await fetchApi<Patient[]>("get_patient.php", {
    term: encoded,
    type: from,
  });
  if (!body?.success) return [];
  return Array.isArray(body.data) ? body.data : [];
}

interface Props {
  onSelect?: (patient: Patient) => void;
  patientFrom: PatientFom;
  title?: string;
  placeholder?: string;
  debounceMs?: number;
}
export function PatientSearch(props: Props) {
  const id = React.useId();
  const [searchValue, setSearchValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<Patient[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (!searchValue) {
      setSearchResults([]);
      setIsLoading(false);
      return undefined;
    }
    if (searchValue.length < 3) return undefined;
    setIsLoading(true);
    setError(null);

    let ignore = false;

    async function fetchDevelopers() {
      try {
        const results = await searchPatients(searchValue, props.patientFrom);
        if (!ignore) {
          setSearchResults(results);
        }
      } catch {
        if (!ignore) {
          setError("Failed to fetch patients. Please try again.");
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(fetchDevelopers, props.debounceMs ?? 300);

    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  }, [searchValue]);

  let status: React.ReactNode = "";

  if (isLoading) {
    status = (
      <div className="flex items-center gap-2">
        <CircleNotchIcon className="size-4 animate-spin" />
        Searching patients...
      </div>
    );
  } else if (error) {
    status = error;
  } else if (searchResults.length === 0 && searchValue) {
    status = `No patients found for "${searchValue}"`;
  } else if (searchResults.length > 0) {
    status = `${searchResults.length} patient${searchResults.length === 2 ? "" : "s"} found`;
  } else if (!searchValue) {
    status = "Start typing to search patients...";
  }

  const shouldRenderPopup = searchValue !== "" && searchValue.length >= 3;
  const style = accent[props.patientFrom];

  return (
    <div className="w-full">
      <Autocomplete
        items={searchResults}
        openOnInputClick
        value={searchValue}
        onValueChange={setSearchValue}
        itemToStringValue={() => ""}
        filter={null}
      >
        <div className="flex flex-col items-start gap-2">
          {props.title && <Label htmlFor={id}>{props.title}</Label>}
          <div
            className={`flex w-full items-center gap-2 border rounded-md ${style.bg} ${style.border} ${style.text}`}
          >
            <span className="pl-1 font-heading text-xs font-semibold tracking-wide uppercase">
              {props.patientFrom}
            </span>
            <AutocompleteInput
              id={id}
              placeholder={props.placeholder ?? "Search for a Patient"}
              showTrigger
              showClear
              className={`flex-1 border-0  ${style.focus}`}
            />
          </div>
        </div>
        {shouldRenderPopup && (
          <AutocompleteContent>
            <AutocompleteStatus>{status}</AutocompleteStatus>
            <AutocompleteList>
              {(p: Patient) => (
                <AutocompleteItem
                  key={p.patient_id}
                  value={p}
                  className="border-l-2 border-l-transparent transition-all data-highlighted:border-l-(--patient-accent) data-highlighted:pl-3"
                  style={
                    {
                      "--patient-accent": accentMap[props.patientFrom],
                    } as React.CSSProperties
                  }
                  onClick={() => {
                    props.onSelect?.(p);
                  }}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-medium text-foreground">{p.patient_name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {[p.mobile, p.visit_no, p.doctor_name].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  );
}
