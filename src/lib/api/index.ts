import { isTauri } from "@tauri-apps/api/core";
import { fetch as tFetch } from "@tauri-apps/plugin-http";

export const BASE_URL = "https://pharmacy.vcarehospital.in";
type ApiEndpoints = {
  "get_invoice_number.php": undefined;
  "get_patient.php": { term: string; type: string };
  "get_patient_balance.php": { patient_id?: string; visit_id?: string };
  "get_inventory.php": { query: string };
};

export type EndpointUrl = keyof ApiEndpoints;

export const fetchApi = async <T, U extends EndpointUrl = EndpointUrl>(
  url: U,
  query: ApiEndpoints[U],
  baseUrl: string = BASE_URL,
): Promise<ApiResponse<T>> => {
  baseUrl = isTauri() ? baseUrl : "http://localhost:1420";
  const fetchUrl = new URL(`${baseUrl}/api/${url}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === "") continue;
      fetchUrl.searchParams.set(key, String(value));
    }
    // const searchParams = new URLSearchParams(query).toString();
    // fetchUrl.search = searchParams;
  }
  const response = await (isTauri() ? tFetch(fetchUrl) : fetch(fetchUrl));
  return response.json() as Promise<ApiResponse<T>>;
};
