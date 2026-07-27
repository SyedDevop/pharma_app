import type { AutocompleteRootActions } from "@base-ui/react";
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
  title: string;
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

  const shouldRenderPopup = searchValue !== "";
  const actionRef = React.useRef<AutocompleteRootActions>(null);
  return (
    <div className="w-full">
      <Autocomplete
        items={searchResults}
        openOnInputClick
        value={searchValue}
        onValueChange={setSearchValue}
        itemToStringValue={() => ""}
        filter={null}
        actionsRef={actionRef}
      >
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor={id}>{props.title}</Label>
          <AutocompleteInput
            id={id}
            placeholder={props.placeholder ?? "Search for a Patient"}
            showTrigger
            showClear
            className="flex-1"
          />
        </div>
        {shouldRenderPopup && (
          <AutocompleteContent>
            <AutocompleteStatus>{status}</AutocompleteStatus>
            <AutocompleteList>
              {(p: Patient) => (
                <AutocompleteItem
                  key={p.patient_id}
                  value={p}
                  className="rounded-lg"
                  onClick={() => {
                    props.onSelect?.(p);
                  }}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{p.patient_name}</span>
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
