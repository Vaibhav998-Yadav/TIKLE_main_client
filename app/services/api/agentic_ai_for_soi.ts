import { BASE_URL } from "./apiConfig";

export const requestAgenticSoiRenaming = async (file: File, bdc_name: string) => {
  const formData = new FormData();
  formData.append("file", file);

  // Include bdc_name as a query parameter
  const res = await fetch(`${BASE_URL}agentic_Soi_renaming?bdc_name=${encodeURIComponent(bdc_name)}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error: ${res.status} ${text}`);
  }

  const json = await res.json();

  if (json.status !== "success" || !json.data) {
    throw new Error("Unexpected response format from backend");
  }

  return json.data; // ✅ Cleaned JSON records
};
