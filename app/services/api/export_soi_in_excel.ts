import { BASE_URL } from "./apiConfig";

export const requestExcelUpload = async (file: File, accessionNumber: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("accession_number", accessionNumber);

  const res = await fetch(`${BASE_URL}process_excel`, {
    method: "POST",
    body: formData, // ✅ file upload, not JSON
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error: ${res.status} ${text}`);
  }

  // 🧾 Trigger browser download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${accessionNumber}_processed.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
