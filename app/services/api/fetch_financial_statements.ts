import { BASE_URL } from "./apiConfig";

export async function fetch_financial_statement(baseUrl: string) {
  const params = new URLSearchParams({ url: baseUrl });

  const response = await fetch(
    `${BASE_URL}filing-summary?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch filing summary: ${response.status}`);
  }

  const data = await response.json();
  return data; // contains groupedReports & flatReports
}
