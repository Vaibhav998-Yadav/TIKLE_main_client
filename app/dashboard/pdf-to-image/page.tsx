"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PdfUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (
      !inputFileRef.current?.files ||
      inputFileRef.current.files.length === 0
    ) {
      setError("Please select a PDF file to upload.");
      return;
    }

    const file = inputFileRef.current.files[0];

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://13.201.129.153:8000/api/upload-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload PDF.");
      }

      // ✅ Handle ZIP file response
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name.replace(/\.pdf$/, "_images.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage("Processed and Downloaded successfully!");
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full" style={{ maxWidth: "600px" }}>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
          <CardDescription>
            Select a PDF to be converted into images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="pdf-file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Choose PDF
              </label>
              <Input
                id="pdf-file"
                name="pdf"
                type="file"
                accept="application/pdf"
                ref={inputFileRef}
                disabled={uploading}
                aria-describedby="file-upload-description"
              />
            </div>
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? "Processing" : "Upload PDF"}
            </Button>
            {message && (
              <div
                className="mt-4 p-3 text-sm text-green-700 bg-green-100 rounded-md dark:bg-green-900 dark:text-green-200"
                role="status"
              >
                {message}
              </div>
            )}
            {error && (
              <div
                className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-200"
                role="alert"
              >
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
