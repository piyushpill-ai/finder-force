"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-finder-500 hover:bg-finder-600 text-white rounded-lg text-sm font-medium transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

