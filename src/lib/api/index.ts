import { fetch } from "@tauri-apps/plugin-http";

export const BASE_URL = "https://pharmacy.vcarehospital.in";

type ApiEndpoints = {
  "get_patient.php": { term: string; type: string };
  "get_invoice.php": { invoiceId: string };
};

export type EndpointUrl = keyof ApiEndpoints;

export const fetchApi = async <T, U extends EndpointUrl = EndpointUrl>(
  url: U,
  query: ApiEndpoints[U],
): Promise<ApiResponse<T>> => {
  const searchParams = new URLSearchParams(query).toString();
  const fetchUrl = new URL(`${BASE_URL}/api/${url}`);
  fetchUrl.search = searchParams;
  const response = await fetch(fetchUrl);
  return response.json() as Promise<ApiResponse<T>>;
};
