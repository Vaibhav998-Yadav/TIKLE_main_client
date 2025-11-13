import { BASE_URL } from "./apiConfig";

export interface FilingData {
  // Replace with actual structure you expect (example fields shown)
  cik: string;
  name: string;
  filings: any[];
  [key: string]: any;
}

export async function fetchAllFilings(cik: string): Promise<FilingData | null> {
  const url = `${BASE_URL}get_BDC_Meta_File?cik=${cik}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching BDC Meta File:', error);
    return null;
  }
}
