import { fetch } from "@tauri-apps/plugin-http";

export const BASE_URL = "https://pharmacy.vcarehospital.in";

type ApiEndpoints = {
  "get_invoice_number.php": undefined;
  "get_patient.php": { term: string; type: string };
};

export type EndpointUrl = keyof ApiEndpoints;

export const fetchApi = async <T, U extends EndpointUrl = EndpointUrl>(
  url: U,
  query: ApiEndpoints[U],
): Promise<ApiResponse<T>> => {
  const fetchUrl = new URL(`${BASE_URL}/api/${url}`);
  if (query) {
    const searchParams = new URLSearchParams(query).toString();
    fetchUrl.search = searchParams;
  }
  const response = await fetch(fetchUrl);
  return response.json() as Promise<ApiResponse<T>>;
};
