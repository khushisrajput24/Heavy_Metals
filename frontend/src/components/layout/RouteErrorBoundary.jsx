import React, { useState } from "react";
import { useRouteError, isRouteErrorResponse, useNavigate, useLocation } from "react-router-dom";
import { TriangleAlert, RefreshCw, Home, Clipboard, Check, ChevronDown, ChevronUp } from "lucide-react";

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract relevant message and status information
  let errorMessage = "An unexpected error occurred.";
  let errorStatusText = "";
  let errorStatus = "";
  let errorStack = "";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorStatusText = error.statusText;
    errorMessage = typeof error.data === "string" ? error.data : error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack || "";
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object") {
    errorMessage = error.message || JSON.stringify(error);
  }

  const handleCopy = async () => {
    const textToCopy = `Error on path: ${location.pathname}\nStatus: ${errorStatus} ${errorStatusText}\nMessage: ${errorMessage}\n\nStack Trace:\n${errorStack || "No stack trace available."}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 to-slate-950 p-6 font-sans">
      <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-cyan-950/20">
        
        {/* Pulsing Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 animate-pulse border border-amber-500/30">
            <TriangleAlert className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Unexpected Application Error
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            The application encountered a runtime error while loading this page.
          </p>
        </div>

        {/* Error Info Box */}
        <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800 mb-6 text-sm">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500 font-medium">Path</span>
              <span className="text-slate-300 font-mono select-all">{location.pathname}</span>
            </div>
            {errorStatus && (
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500 font-medium">HTTP Status</span>
                <span className="text-amber-500 font-bold font-mono">
                  {errorStatus} {errorStatusText && `(${errorStatusText})`}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium mb-1">Details</span>
              <span className="text-rose-400 font-mono break-words leading-relaxed select-all">
                {errorMessage}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition duration-200 border border-slate-700/60 shadow-lg cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-hover" />
            Reload Page
          </button>
          
          <button
            onClick={() => navigate("/user")}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition duration-200 shadow-lg shadow-teal-900/30 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Accordion Developer Details */}
        <div className="border-t border-slate-800 pt-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between py-2 text-slate-400 hover:text-slate-300 transition duration-150 cursor-pointer"
          >
            <span className="text-sm font-semibold tracking-wider uppercase">
              Developer Diagnostics
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="mt-4 transition-all duration-300 animate-fadeIn">
              <div className="relative bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden">
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800/80 bg-slate-900/40">
                  <span className="text-xs font-mono text-slate-500">
                    {error instanceof Error ? "Stack Trace Log" : "Diagnostic Info"}
                  </span>
                  
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition duration-150 py-1 px-2.5 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3.5 h-3.5" /> Copy Log
                      </>
                    )}
                  </button>
                </div>
                
                <div className="p-4 overflow-x-auto max-h-60 text-xs font-mono text-slate-400 leading-relaxed whitespace-pre select-all">
                  {errorStack || JSON.stringify(error, null, 2) || "No trace or object details available."}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
