import { useState } from "react";
import { PythonCode } from "./components/PythonCode";
import { ExampleOutput } from "./components/ExampleOutput";
import { Features } from "./components/Features";
import { Usage } from "./components/Usage";
import { Header } from "./components/Header";

export default function App() {
  const [activeTab, setActiveTab] = useState<"code" | "output" | "usage">("code");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Self-contained Python Utility
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
            NTP Server Tester
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            A comprehensive Python tool to test NTP servers and report
            <span className="text-indigo-300 font-medium"> Reachability</span>,
            <span className="text-cyan-300 font-medium"> Stratum</span>,
            <span className="text-emerald-300 font-medium"> Reference Clock</span>,
            <span className="text-amber-300 font-medium"> Transmit Time</span>,
            <span className="text-rose-300 font-medium"> Offset</span>, and
            <span className="text-violet-300 font-medium"> Delay</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/ntp_tester.py"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Python Script
            </a>
            <button
              onClick={() => {
                const el = document.getElementById("code-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              View Source Code
            </button>
          </div>
        </section>

        {/* Features */}
        <Features />

        {/* Metrics Cards */}
        <section className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Reported Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              icon="📡"
              title="Reachability"
              description="Whether the server responds to NTP queries within the timeout period"
              color="indigo"
            />
            <MetricCard
              icon="🏢"
              title="Server"
              description="The hostname or IP address of the NTP server being tested"
              color="cyan"
            />
            <MetricCard
              icon="📊"
              title="Stratum"
              description="Distance from primary reference clock (1 = primary, 2+ = secondary)"
              color="emerald"
            />
            <MetricCard
              icon="🕐"
              title="Reference Clock"
              description="The source of time synchronization (GPS, atomic clock, etc.)"
              color="amber"
            />
            <MetricCard
              icon="📤"
              title="Transmit Time"
              description="The timestamp when the server sent its response"
              color="rose"
            />
            <MetricCard
              icon="📏"
              title="Offset & Delay"
              description="Clock offset (time difference) and network round-trip delay"
              color="violet"
            />
          </div>
        </section>

        {/* Tabbed Section */}
        <section id="code-section" className="py-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <TabButton active={activeTab === "code"} onClick={() => setActiveTab("code")}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Source Code
            </TabButton>
            <TabButton active={activeTab === "output"} onClick={() => setActiveTab("output")}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Example Output
            </TabButton>
            <TabButton active={activeTab === "usage"} onClick={() => setActiveTab("usage")}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Start
            </TabButton>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            {activeTab === "code" && <PythonCode />}
            {activeTab === "output" && <ExampleOutput />}
            {activeTab === "usage" && <Usage />}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 text-center text-slate-500 text-sm">
          <p>NTP Server Tester • Python 3.6+ • Requires <code className="px-2 py-0.5 bg-slate-800 rounded text-slate-300">ntplib</code></p>
        </footer>
      </main>
    </div>
  );
}

function MetricCard({ icon, title, description, color }: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    indigo: "border-indigo-500/30 bg-indigo-500/5",
    cyan: "border-cyan-500/30 bg-cyan-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    rose: "border-rose-500/30 bg-rose-500/5",
    violet: "border-violet-500/30 bg-violet-500/5",
  };

  return (
    <div className={`rounded-xl border p-5 transition-all hover:scale-[1.02] ${colorClasses[color] || colorClasses.indigo}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
          : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
