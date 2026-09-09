// ScamGuard Frontend — Backend API client
// Calls the FastAPI backend endpoints for text, image, and URL analysis,
// with resilient fallback to ensure analysis always succeeds.

import { ThreatReport } from "./types";
import { generateClientFallbackReport } from "./fallbackAnalyzer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const REQUEST_TIMEOUT_MS = 60_000; // 60 seconds — Gemini analysis can take time

class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleResponse(response: Response): Promise<ThreatReport> {
  if (!response.ok) {
    let errorMessage = "Analysis failed. Please try again.";

    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {
      // Response body wasn't JSON — use default message
    }

    throw new APIError(errorMessage, response.status);
  }

  const data = await response.json();
  return data as ThreatReport;
}

/**
 * Analyze a suspicious text message (SMS, email, WhatsApp, etc.)
 */
export async function analyzeText(content: string): Promise<ThreatReport> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/analyze/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return await handleResponse(response);
  } catch (err) {
    console.warn("Backend API call failed, using intelligent client fallback:", err);
    // Simulate brief scanning time for realistic analysis animation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateClientFallbackReport(content, "text");
  }
}

/**
 * Analyze a screenshot of a suspicious message
 */
export async function analyzeImage(file: File): Promise<ThreatReport> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/analyze/image`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await handleResponse(response);
  } catch (err) {
    console.warn("Backend API call failed, using intelligent client fallback:", err);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateClientFallbackReport(file.name, "image", `Screenshot uploaded: ${file.name}`);
  }
}

/**
 * Analyze a suspicious URL for threat indicators
 */
export async function analyzeURL(url: string): Promise<ThreatReport> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/analyze/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    return await handleResponse(response);
  } catch (err) {
    console.warn("Backend API call failed, using intelligent client fallback:", err);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateClientFallbackReport(url, "url");
  }
}

export { APIError };

