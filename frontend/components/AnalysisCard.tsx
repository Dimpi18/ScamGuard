"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type TabId = "paste" | "screenshot" | "link";

interface AnalysisCardProps {
  onSubmitText: (content: string) => void;
  onSubmitImage: (file: File) => void;
  onSubmitURL: (url: string) => void;
  isAnalyzing: boolean;
  selectedTab?: TabId;
  onTabSelect?: (tab: TabId) => void;
  presetText?: string;
}

const SAMPLE_PHISHING_SMS =
  'URGENT: Your Chase bank account has been locked due to suspicious activity. Click here immediately to verify your identity & regain access: https://chase-security-resolver.cc/auth?token=904128';

const MAX_CHARS = 5000;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/heic",
];

export default function AnalysisCard({
  onSubmitText,
  onSubmitImage,
  onSubmitURL,
  isAnalyzing,
  selectedTab,
  onTabSelect,
  presetText,
}: AnalysisCardProps) {
  const [internalTab, setInternalTab] = useState<TabId>("paste");
  const activeTab = selectedTab ?? internalTab;
  const [textContent, setTextContent] = useState("");
  const [linkValue, setLinkValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (presetText !== undefined) {
      setTextContent(presetText);
    }
  }, [presetText]);

  const handleTabSwitch = useCallback(
    (tab: TabId) => {
      setInternalTab(tab);
      onTabSelect?.(tab);
      setFileError(null);
    },
    [onTabSelect]
  );

  const handlePrefill = useCallback(() => {
    setTextContent(SAMPLE_PHISHING_SMS);
  }, []);

  const handleClear = useCallback(() => {
    setTextContent("");
  }, []);

  const handleTextSubmit = useCallback(() => {
    const trimmed = textContent.trim();
    if (!trimmed) return;
    onSubmitText(trimmed);
  }, [textContent, onSubmitText]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFileError(null);
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError("Please upload a PNG, JPG, or HEIC image.");
        setSelectedFile(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File is too large. Maximum size is 15MB.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    },
    []
  );

  const handleImageSubmit = useCallback(() => {
    if (!selectedFile) return;
    onSubmitImage(selectedFile);
  }, [selectedFile, onSubmitImage]);

  const handleLinkSubmit = useCallback(() => {
    const trimmed = linkValue.trim();
    if (!trimmed) return;
    const fullURL = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    onSubmitURL(fullURL);
  }, [linkValue, onSubmitURL]);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "paste", label: "Paste message", icon: "chat_bubble_outline" },
    { id: "screenshot", label: "Upload screenshot", icon: "image" },
    { id: "link", label: "Analyze link", icon: "link" },
  ];

  return (
    <div className="card overflow-hidden flex flex-col transition-colors duration-200">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-low)]/40 px-3 pt-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabSwitch(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-[15px] font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-[var(--color-primary)] text-[var(--color-on-surface)] font-semibold"
                : "border-transparent text-[var(--color-outline)] hover:text-[var(--color-on-surface)]"
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content: Paste Message */}
      {activeTab === "paste" && (
        <div className="p-4 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[var(--color-outline)] font-medium">
                Sample text to test:
              </span>
              <button
                onClick={handlePrefill}
                className="inline-flex items-center gap-1 text-[13px] text-[var(--color-secondary)] bg-[var(--color-surface-low)] hover:bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] px-2 py-0.5 rounded-lg transition-colors font-medium cursor-pointer"
              >
                ⚡ Try sample phishing SMS
              </button>
            </div>
            <button
              onClick={handleClear}
              className="text-[13px] text-[var(--color-outline)] hover:text-[var(--color-threat-critical)] transition-colors cursor-pointer"
            >
              Clear text
            </button>
          </div>

          <div className="relative">
            <textarea
              value={textContent}
              onChange={(e) =>
                setTextContent(e.target.value.slice(0, MAX_CHARS))
              }
              placeholder='Paste a suspicious SMS, WhatsApp message, email, or suspicious message here (e.g., "Your account has been locked due to suspicious activity. Click here to verify...")...'
              rows={6}
              className="w-full bg-[var(--color-surface-bright)] rounded-lg border border-[var(--color-outline-variant)] p-3 text-[14px] text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/70 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-none"
            />
            <div className="absolute right-3 bottom-3 text-[var(--color-outline)] text-[12px] font-mono bg-[var(--color-surface-bright)]/90 px-1 py-0.5 rounded">
              {textContent.length} characters
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[var(--color-outline)] text-[13px]">
              <span className="material-symbols-outlined text-[18px] text-[var(--color-secondary)]">
                lock
              </span>
              <span>
                Analyzed in an encrypted ephemeral sandbox. Nothing is saved.
              </span>
            </div>
            <button
              onClick={handleTextSubmit}
              disabled={isAnalyzing || !textContent.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold text-[15px] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    search_check_2
                  </span>
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Upload Screenshot */}
      {activeTab === "screenshot" && (
        <div className="p-4 sm:p-6 flex flex-col gap-3">
          <p className="text-[13px] text-[var(--color-on-surface-variant)]">
            Upload an image of a suspicious text conversation, email preview, or
            app notification. Our engine extracts the text and checks for visual
            deception.
          </p>

          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-outline-variant)] hover:border-[var(--color-secondary)]/60 rounded-xl p-8 bg-[var(--color-surface-bright)] hover:bg-[var(--color-surface-low)]/50 transition-colors cursor-pointer text-center"
          >
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/png,image/jpeg,image/heic"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mb-2 text-[var(--color-primary)]">
              <span className="material-symbols-outlined text-[26px]">
                add_photo_alternate
              </span>
            </div>
            {selectedFile ? (
              <>
                <span className="font-semibold text-[15px] text-[var(--color-on-surface)]">
                  {selectedFile.name}
                </span>
                <span className="text-[13px] text-[var(--color-outline)] mt-0.5">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB — Click to
                  change
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold text-[15px] text-[var(--color-on-surface)]">
                  Click to upload or drag screenshot here
                </span>
                <span className="text-[13px] text-[var(--color-outline)] mt-0.5">
                  Supports PNG, JPG, JPEG, HEIC (up to 15MB)
                </span>
              </>
            )}
          </label>

          {fileError && (
            <p className="text-[13px] text-[var(--color-threat-critical)] font-medium">
              {fileError}
            </p>
          )}

          {selectedFile && (
            <button
              onClick={handleImageSubmit}
              disabled={isAnalyzing}
              className="w-full sm:w-auto self-end px-6 py-3 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold text-[15px] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    document_scanner
                  </span>
                  <span>Analyze Screenshot</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Tab Content: Analyze Link */}
      {activeTab === "link" && (
        <div className="p-4 sm:p-6 flex flex-col gap-3">
          <p className="text-[13px] text-[var(--color-on-surface-variant)]">
            Inspect a suspicious web address safely without clicking it or
            risking device compromise.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 flex items-center bg-[var(--color-surface-bright)] rounded-lg border border-[var(--color-outline-variant)] px-3 py-2 focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
              <span className="text-[var(--color-outline)] text-[13px] select-none pr-1.5 font-mono">
                https://
              </span>
              <input
                type="text"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                placeholder="example-chase-update-login.com"
                className="w-full bg-transparent text-[14px] text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/70 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLinkSubmit();
                }}
              />
            </div>
            <button
              onClick={handleLinkSubmit}
              disabled={isAnalyzing || !linkValue.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold text-[15px] hover:opacity-90 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    travel_explore
                  </span>
                  <span>Check Link Safety</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
