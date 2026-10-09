export function Usage() {
  return (
    <div className="p-6 md:p-8">
      <h3 className="text-xl font-bold mb-6 text-white">Quick Start Guide</h3>

      {/* Step 1 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300">1</span>
          <h4 className="font-semibold text-lg">Install Dependencies</h4>
        </div>
        <div className="ml-11 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <code className="text-emerald-300 font-mono text-sm">
            pip install ntplib
          </code>
        </div>
        <p className="ml-11 mt-2 text-sm text-slate-400">
          The <code className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">ntplib</code> package is the only external dependency required.
        </p>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300">2</span>
          <h4 className="font-semibold text-lg">Download the Script</h4>
        </div>
        <div className="ml-11 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <code className="text-emerald-300 font-mono text-sm">
            curl -O https://your-server.com/ntp_tester.py
          </code>
          <br />
          <span className="text-slate-500 font-mono text-sm"># Or download using the button above</span>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300">3</span>
          <h4 className="font-semibold text-lg">Run the Tester</h4>
        </div>
        <div className="ml-11 space-y-3">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-500 mb-1">Test default servers:</div>
            <code className="text-emerald-300 font-mono text-sm">python ntp_tester.py</code>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-500 mb-1">Test specific servers:</div>
            <code className="text-emerald-300 font-mono text-sm">python ntp_tester.py pool.ntp.org time.google.com</code>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-500 mb-1">Verbose output:</div>
            <code className="text-emerald-300 font-mono text-sm">python ntp_tester.py --verbose pool.ntp.org</code>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-500 mb-1">CSV output:</div>
            <code className="text-emerald-300 font-mono text-sm">python ntp_tester.py --csv pool.ntp.org time.google.com</code>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-500 mb-1">Use NTP v4:</div>
            <code className="text-emerald-300 font-mono text-sm">python ntp_tester.py --version 4 pool.ntp.org</code>
          </div>
        </div>
      </div>

      {/* Command Line Options */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300">⚙</span>
          <h4 className="font-semibold text-lg">Command Line Options</h4>
        </div>
        <div className="ml-11">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Option</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3 font-mono text-indigo-300">-v, --verbose</td>
                  <td className="py-2 px-3">Show additional details (leap indicator, precision)</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3 font-mono text-indigo-300">--csv</td>
                  <td className="py-2 px-3">Output results in CSV format</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3 font-mono text-indigo-300">--version</td>
                  <td className="py-2 px-3">NTP protocol version (3 or 4, default: 3)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-indigo-300">servers...</td>
                  <td className="py-2 px-3">One or more NTP server hostnames/IPs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Default Servers */}
      <div className="mt-8 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
        <h4 className="font-semibold text-indigo-300 mb-2">💡 Default Servers</h4>
        <p className="text-sm text-slate-400 mb-2">
          If no servers are specified, the tool tests these by default:
        </p>
        <div className="flex flex-wrap gap-2">
          {["pool.ntp.org", "time.google.com", "time.cloudflare.com", "time.nist.gov", "time.apple.com"].map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/50 text-xs font-mono text-slate-300">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
