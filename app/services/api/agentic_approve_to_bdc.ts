// app/services/api/agentic_approve_to_bdc.ts

import { BASE_URL } from "./apiConfig";

export const sendJsonToBDC = async (
  jsonData: any,
  bdc_name: string, // 🆕 New required argument
  filename = "Cleaned_BDC_Data.json"
) => {
  try {
    // Convert JSON to Blob (simulate a file upload)
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const jsonFile = new File([jsonBlob], filename, { type: "application/json" });

    // Use FormData to send both file and string field
    const formData = new FormData();
    formData.append("file", jsonFile);
    formData.append("bdc_name", bdc_name); // 🆕 Added string argument

    // 🔥 Send multipart/form-data POST request
    const response = await fetch(`${BASE_URL}post_processing_and_download_soi`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to process file: ${response.statusText}`);
    }

    // Expect Excel binary data
    const blob = await response.blob();

    // Trigger download in browser
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cleaned_${bdc_name}_BDC_Data.xlsx`; // 🧠 dynamic filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    console.log(`✅ Excel file successfully downloaded for ${bdc_name}`);
  } catch (error) {
    console.error("❌ Error in sendJsonToBDC:", error);
    throw error;
  }
};
