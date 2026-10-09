import { useState, useEffect } from "react";

export function PythonCode() {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ntp_tester.py")
      .then((res) => res.text())
      .then((text) => {
        setCode(text);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading source code...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-sm text-slate-400 font-mono">ntp_tester.py</span>
        </div>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            copied
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-auto max-h-[600px] p-4">
        <pre className="text-sm font-mono leading-relaxed">
          <code>
            {code.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="inline-block w-12 text-right pr-4 text-slate-600 select-none text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span className="flex-1">
                  <HighlightedLine line={line} />
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function HighlightedLine({ line }: { line: string }) {
  // Simple syntax highlighting
  if (line.trim().startsWith("#") && !line.trim().startsWith("#!/")) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (line.trim().startsWith("#!/")) {
    return <span className="text-emerald-400">{line}</span>;
  }
  if (line.trim().startsWith('"""') || line.trim().startsWith("'''")) {
    return <span className="text-amber-300/70">{line}</span>;
  }

  // Highlight keywords
  let highlighted = line;
  const keywords = ["import", "from", "def", "class", "return", "if", "else", "elif", "for", "while", "try", "except", "with", "as", "not", "and", "or", "in", "is", "None", "True", "False", "print"];
  
  // Simple approach: colorize the whole line based on patterns
  if (line.match(/^\s*(import|from)\s/)) {
    return <span className="text-violet-300">{line}</span>;
  }
  if (line.match(/^\s*def\s/)) {
    return <span className="text-cyan-300">{line}</span>;
  }
  if (line.match(/^\s*(if|elif|else|for|while|try|except|with|return)\b/)) {
    return <span className="text-rose-300/90">{line}</span>;
  }
  if (line.match(/^\s*print\s*\(/) || line.match(/^\s*print\(/)) {
    return <span className="text-emerald-300/80">{line}</span>;
  }
  if (line.includes('"') || line.includes("'")) {
    return <span className="text-amber-200/80">{line}</span>;
  }

  return <span className="text-slate-300">{line}</span>;
}
