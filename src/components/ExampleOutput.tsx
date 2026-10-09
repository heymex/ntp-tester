export function ExampleOutput() {
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
          <span className="ml-3 text-sm text-slate-400 font-mono">Terminal Output</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">python ntp_tester.py pool.ntp.org time.google.com time.cloudflare.com</span>
      </div>

      {/* Output */}
      <div className="overflow-auto max-h-[600px] p-4 font-mono text-sm">
        <div className="text-slate-400 mb-4">
          <span className="text-emerald-400">$</span> python ntp_tester.py pool.ntp.org time.google.com time.cloudflare.com
        </div>
        <pre className="text-slate-300 leading-relaxed whitespace-pre">
{`  Testing 3 NTP server(s)...
  NTP Version: 3 | Timeout: 5s

══════════════════════════════════════════════════════════════════
  NTP SERVER TEST RESULTS
  Tested at: 2025-01-15 14:32:07 UTC
══════════════════════════════════════════════════════════════════

  Server:          pool.ntp.org
  Reachability:    `}<span className="text-emerald-400">✓ Reachable</span>{`
  Stratum:         2 (secondary, 1 hop from primary)
  Reference Clock: 185.19.184.35 → 185.19.184.35
  Transmit Time:   2025-01-15 14:32:07.234 UTC
  Offset:          `}<span className="text-cyan-300">+2.341 ms</span>{`
  Delay:           `}<span className="text-amber-300">15.234 ms</span>{`

──────────────────────────────────────────────────────────────────

  Server:          time.google.com
  Reachability:    `}<span className="text-emerald-400">✓ Reachable</span>{`
  Stratum:         1 (primary reference)
  Reference Clock: GOES → Geostationary Orbit Environment Satellite
  Transmit Time:   2025-01-15 14:32:07.456 UTC
  Offset:          `}<span className="text-cyan-300">+0.892 ms</span>{`
  Delay:           `}<span className="text-amber-300">8.127 ms</span>{`

──────────────────────────────────────────────────────────────────

  Server:          time.cloudflare.com
  Reachability:    `}<span className="text-emerald-400">✓ Reachable</span>{`
  Stratum:         1 (primary reference)
  Reference Clock: GPS  → Global Positioning System
  Transmit Time:   2025-01-15 14:32:07.678 UTC
  Offset:          `}<span className="text-cyan-300">-1.203 ms</span>{`
  Delay:           `}<span className="text-amber-300">5.891 ms</span>{`

══════════════════════════════════════════════════════════════════
  Total servers tested: 3
  Reachable:          3/3
══════════════════════════════════════════════════════════════════`}
        </pre>
      </div>
    </div>
  );
}
