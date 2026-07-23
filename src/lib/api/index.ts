import { fetch } from "@tauri-apps/plugin-http";

export const BASE_URL = "https://pharmacy.vcarehospital.in";

export const fetchApi = async <T>(
  url: string,
  query?: Record<string, unknown> | undefined,
): Promise<ApiResponse<T>> => {
  const searchParams = new URLSearchParams(query).toString();
  const fetchUrl = new URL(`${BASE_URL}/api/${url}`);
  fetchUrl.search = searchParams;
  const response = await fetch(fetchUrl);
  return response.json() as Promise<ApiResponse<T>>;
};
