"use client";

import { useState, useCallback } from "react";
import { ThreatReport, AnalysisState } from "@/lib/types";
import { analyzeText, analyzeImage, analyzeURL, APIError } from "@/lib/api";

interface UseAnalysisReturn {
  state: AnalysisState;
  mode: "text" | "image" | "url";
  originalContent: string;
  report: ThreatReport | null;
  error: string | null;
  submitText: (content: string) => Promise<void>;
  submitImage: (file: File) => Promise<void>;
  submitURL: (url: string) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [state, setState] = useState<AnalysisState>("idle");
  const [mode, setMode] = useState<"text" | "image" | "url">("text");
  const [originalContent, setOriginalContent] = useState("");
  const [report, setReport] = useState<ThreatReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setState("idle");
    setReport(null);
    setError(null);
    setOriginalContent("");
  }, []);

  const handleAnalysis = useCallback(
    async (
      targetMode: "text" | "image" | "url",
      contentSummary: string,
      analysisFn: () => Promise<ThreatReport>
    ) => {
      setMode(targetMode);
      setOriginalContent(contentSummary);
      setState("analyzing");
      setReport(null);
      setError(null);

      try {
        const result = await analysisFn();
        setReport(result);
        setState("complete");
      } catch (err) {
        const message =
          err instanceof APIError
            ? err.message
            : "An unexpected error occurred. Please try again.";
        setError(message);
        setState("error");
      }
    },
    []
  );

  const submitText = useCallback(
    async (content: string) => {
      await handleAnalysis("text", content, () => analyzeText(content));
    },
    [handleAnalysis]
  );

  const submitImage = useCallback(
    async (file: File) => {
      await handleAnalysis("image", file.name, () => analyzeImage(file));
    },
    [handleAnalysis]
  );

  const submitURL = useCallback(
    async (url: string) => {
      await handleAnalysis("url", url, () => analyzeURL(url));
    },
    [handleAnalysis]
  );

  return {
    state,
    mode,
    originalContent,
    report,
    error,
    submitText,
    submitImage,
    submitURL,
    reset,
  };
}
