import { BASE_URL } from "./apiConfig";

// types/sec.ts
export interface FilingReport {
  shortName?: string;
  longName?: string;
  position?: number;
  htmlFileName?: string;
  instance?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface FilingSummary {
  reports: FilingReport[];
  [key: string]: any;
}

/**
 * Fetches SEC Filing Summary XML data for a given filing URL.
 *
 * Example:
 *   const data = await fetchFilingSummary("https://www.sec.gov/Archives/edgar/data/1287750/000128775025000007");
 */
export async function fetchFilingSummary(filingUrl: string): Promise<FilingSummary | null> {
  // Construct the endpoint URL
  const url = `${BASE_URL}get_filing_summary_filing_summary_get?url=${encodeURIComponent(filingUrl)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as FilingSummary;
  } catch (error) {
    console.error("Error fetching Filing Summary:", error);
    return null;
  }
}
