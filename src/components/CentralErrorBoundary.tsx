import * as React from "react";
import { AlertTriangle, Terminal, RefreshCw, ShieldAlert, Layers } from "lucide-react";
import { Logger } from "../services/Logger";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class CentralErrorBoundary extends React.Component<any, any> {
  public state: any = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): any {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    (this as any).setState({ errorInfo });
    
    // Ship UI error to centralized SQLite system logging table asynchronously
    Logger.error(
      "UI_ERROR_BOUNDARY",
      `Unhandled UI Crash: ${error.message}`,
      `Stack:\n${error.stack || ""}\n\nComponent Stack:\n${errorInfo.componentStack || ""}`
    );
  }

  private handleSoftReset = () => {
    (this as any).setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleHardReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-3xl w-full bg-zinc-900 border border-red-900/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Background Accent glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-650 via-amber-500 to-red-650 opacity-80" />
            
            {/* Top Header */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-950/50 border border-red-900/40 rounded-xl text-red-400 animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/40 border border-red-900/30 px-2 py-0.5 rounded">
                    EXCEPTION CAUGHT
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ERR_CORE_UI_MONITOR
                  </span>
                </div>
                <h2 className="text-xl font-mono font-black text-slate-150 uppercase tracking-tight">
                  Empire OS Module Exception
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              The interface framework detected an unhandled crash inside a component layout. To maintain high-fidelity operation, the central Error Boundary has intercepted the failure and persisted the trace to the database.
            </p>

            {/* Error Message Summary */}
            <div className="bg-red-950/20 border border-red-900/20 rounded-xl p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
                Primary Error Signature:
              </span>
              <code className="text-xs font-mono text-red-300 font-medium block break-words">
                {this.state.error?.toString() || "Unknown rendering exception."}
              </code>
            </div>

            {/* Diagnostic Details Drawer */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Stack Trace Diagnostics:</span>
              </div>
              <div className="bg-zinc-950/95 border border-zinc-850 rounded-xl p-4 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-350 leading-relaxed scrollbar-thin">
                <div className="space-y-3">
                  {this.state.error?.stack && (
                    <div>
                      <span className="text-slate-500 block border-b border-zinc-900 pb-1 mb-1 font-semibold uppercase">JavaScript Call Stack</span>
                      <pre className="whitespace-pre-wrap select-text selection:bg-red-900/40">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <span className="text-slate-500 block border-b border-zinc-900 pb-1 mb-1 font-semibold uppercase">React Component hierarchy</span>
                      <pre className="whitespace-pre-wrap select-text selection:bg-indigo-900/40">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remediation Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono">
              <button
                onClick={this.handleSoftReset}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 text-slate-200 border border-zinc-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Soft Reset Module</span>
              </button>

              <button
                onClick={this.handleHardReload}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-550 text-slate-100 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-lg hover:shadow-indigo-900/20"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>Hard Reload Workstation</span>
              </button>
            </div>

            {/* Footer notice */}
            <div className="text-[10px] text-center text-slate-500 font-mono flex items-center justify-center gap-1.5 pt-2 border-t border-zinc-850/40">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500/75" />
              <span>Diagnostic telemetry was automatically dispatched to the SQLite central log database.</span>
            </div>

          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
