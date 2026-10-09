#!/usr/bin/env python3
"""
NTP Server Tester
=================
A self-contained Python utility to test NTP servers and report key metrics
including Reachability, Server, Stratum, Reference Clock, Transmit Time,
Offset, and Delay.

Requirements:
    - Python 3.6+
    - ntplib (pip install ntplib)

Usage:
    python ntp_tester.py [server1] [server2] ...
    python ntp_tester.py                          # Tests default servers
    python ntp_tester.py pool.ntp.org time.google.com

Examples:
    python ntp_tester.py pool.ntp.org
    python ntp_tester.py time.google.com time.cloudflare.com time.apple.com
    python ntp_tester.py 0.pool.ntp.org 1.pool.ntp.org 2.pool.ntp.org
"""

import sys
import time
import socket
import struct
import argparse
from datetime import datetime, timezone
from typing import Optional, Tuple, Union

try:
    import ntplib
except ImportError:
    print("=" * 70)
    print("ERROR: 'ntplib' is not installed.")
    print()
    print("Install it with:")
    print("    pip install ntplib")
    print()
    print("Or run this script with:")
    print("    pip install ntplib && python ntp_tester.py [servers...]")
    print("=" * 70)
    sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────────────

DEFAULT_SERVERS = [
    "pool.ntp.org",
    "time.google.com",
    "time.cloudflare.com",
    "time.nist.gov",
    "time.apple.com",
]

# Common reference clock identifiers (RFC 5905 / IANA registry)
REFERENCE_CLOCKS = {
    "GOES":  "Geostationary Orbit Environment Satellite",
    "GPS ":  "Global Positioning System",
    "GAL ":  "Galileo Positioning System",
    "PPS ":  "Generic pulse-per-second",
    "IRIG":  "Inter-Range Interval Code",
    "BUDP":  "Buenos Aires UDP",
    "BUSH":  "Buenos Aires",
    "CHU ":  "Shortwave radio station CHU (Ottawa, Canada)",
    "DCF ":  "DCF77 (Mainflingen, Germany)",
    "GPS":   "Global Positioning System",
    "LOCL":  "Uncalibrated local clock",
    "CESM":  "CELSync",
    "MSF ":  "MSF (Rugby, UK)",
    "NIST":  "NIST telephone modem",
    "PTB ":  "PTB (Physikalisch-Technische Bundesanstalt, Germany)",
    "USNO":  "USNO telephone modem",
    "WWV ":  "WWV (Fort Collins, Colorado, USA)",
    "WWVB":  "WWVB (Fort Collins, Colorado, USA)",
    "WWVH":  "WWVH (Kauai, Hawaii, USA)",
}

NTP_VERSION = 3
TIMEOUT = 5  # seconds


# ─────────────────────────────────────────────────────────────────────────────
# Helper Functions
# ─────────────────────────────────────────────────────────────────────────────

def _ref_id_to_bytes(ref_id: Union[int, bytes, str]) -> Optional[bytes]:
    """Pack an ntplib ref_id into the 4 bytes carried in the NTP packet.

    ntplib leaves this field as the raw unsigned 32-bit integer from the
    packet. Older call sites sometimes pass the ASCII form instead.
    """
    if isinstance(ref_id, int):
        return struct.pack("!I", ref_id & 0xFFFFFFFF)
    if isinstance(ref_id, (bytes, bytearray)):
        return bytes(ref_id[:4]).ljust(4, b"\x00")
    if isinstance(ref_id, str) and len(ref_id.encode("latin-1", errors="replace")) <= 4:
        return ref_id.encode("latin-1", errors="replace").ljust(4, b"\x00")
    return None


def resolve_reference_clock(
    ref_id: Union[int, bytes, str],
    stratum: Optional[int] = None,
) -> Tuple[str, str]:
    """Return (identifier, description) for an NTP reference identifier.

    Stratum 0 and 1 pack a 4-character ASCII clock id (for example GPS).
    Stratum 2 and above pack the reference peer's IPv4 address.
    """
    raw = _ref_id_to_bytes(ref_id)
    if raw is None:
        text = str(ref_id).strip()
        return text, REFERENCE_CLOCKS.get(text, text)

    if stratum is not None and stratum >= 2:
        ip_addr = socket.inet_ntoa(raw)
        return ip_addr, ip_addr

    text = raw.decode("ascii", errors="replace").rstrip("\x00").strip()
    if not text:
        return "----", "unspecified"
    description = REFERENCE_CLOCKS.get(text, text)
    return text, description


def format_timestamp(ntp_timestamp: float) -> str:
    """Convert an NTP timestamp to a human-readable UTC datetime string."""
    try:
        dt = datetime.fromtimestamp(ntp_timestamp, tz=timezone.utc)
        return dt.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] + " UTC"
    except (OSError, ValueError, OverflowError):
        return "N/A"


def format_offset(offset: float) -> str:
    """Format an offset value with appropriate units."""
    abs_offset = abs(offset)
    if abs_offset >= 1.0:
        return f"{offset:+.6f} s"
    elif abs_offset >= 0.001:
        return f"{offset * 1000:+.3f} ms"
    elif abs_offset >= 0.000001:
        return f"{offset * 1_000_000:+.3f} µs"
    else:
        return f"{offset * 1_000_000_000:+.3f} ns"


def format_delay(delay: float) -> str:
    """Format a delay value with appropriate units."""
    abs_delay = abs(delay)
    if abs_delay >= 1.0:
        return f"{delay:.6f} s"
    elif abs_delay >= 0.001:
        return f"{delay * 1000:.3f} ms"
    elif abs_delay >= 0.000001:
        return f"{delay * 1_000_000:.3f} µs"
    else:
        return f"{delay * 1_000_000_000:.3f} ns"


def test_ntp_server(server: str, version: int = NTP_VERSION) -> dict:
    """
    Test a single NTP server and return a results dictionary.

    Returns a dict with keys:
        server, reachable, stratum, ref_clock, ref_clock_desc,
        transmit_time, offset, offset_raw, delay, delay_raw,
        leap, precision, error
    """
    result = {
        "server": server,
        "reachable": False,
        "stratum": None,
        "ref_clock": None,
        "ref_clock_desc": None,
        "transmit_time": None,
        "offset": None,
        "offset_raw": None,
        "delay": None,
        "delay_raw": None,
        "leap": None,
        "precision": None,
        "error": None,
    }

    # First check if the server resolves
    try:
        socket.getaddrinfo(server, 123, socket.AF_UNSPEC, socket.SOCK_DGRAM)
    except socket.gaierror as e:
        result["error"] = f"DNS resolution failed: {e}"
        return result

    # Query the NTP server
    client = ntplib.NTPClient()
    try:
        response = client.request(server, version=version, timeout=TIMEOUT)
    except ntplib.NTPException as e:
        result["error"] = f"NTP error: {e}"
        return result
    except OSError as e:
        result["error"] = f"Network error: {e}"
        return result
    except Exception as e:
        result["error"] = f"Unexpected error: {e}"
        return result

    # Populate results
    result["reachable"] = True
    result["stratum"] = response.stratum
    ref_clock, ref_clock_desc = resolve_reference_clock(
        response.ref_id, response.stratum
    )
    result["ref_clock"] = ref_clock
    result["ref_clock_desc"] = ref_clock_desc
    result["transmit_time"] = format_timestamp(response.tx_time)
    result["offset_raw"] = response.offset
    result["offset"] = format_offset(response.offset)
    result["delay_raw"] = response.delay
    result["delay"] = format_delay(response.delay)
    result["leap"] = response.leap
    result["precision"] = response.precision

    return result


def print_separator(char="─", width=70):
    """Print a horizontal separator line."""
    print(char * width)


def print_results(results: list, verbose: bool = False):
    """Print formatted results for all tested servers."""
    print()
    print_separator("═")
    print("  NTP SERVER TEST RESULTS")
    print(f"  Tested at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print_separator("═")

    for i, result in enumerate(results):
        if i > 0:
            print()
            print_separator("─")

        server = result["server"]
        reachable = result["reachable"]

        print(f"  Server:          {server}")
        print(f"  Reachability:    {'✓ Reachable' if reachable else '✗ Unreachable'}")

        if not reachable:
            print(f"  Error:           {result['error']}")
            continue

        stratum = result["stratum"]
        stratum_desc = ""
        if stratum == 0:
            stratum_desc = " (unspecified/invalid)"
        elif stratum == 1:
            stratum_desc = " (primary reference)"
        elif 2 <= stratum <= 15:
            stratum_desc = f" (secondary, {stratum - 1} hop{'s' if stratum > 2 else ''} from primary)"
        elif stratum == 16:
            stratum_desc = " (unsynchronized)"

        print(f"  Stratum:         {stratum}{stratum_desc}")
        print(f"  Reference Clock: {result['ref_clock']} → {result['ref_clock_desc']}")
        print(f"  Transmit Time:   {result['transmit_time']}")
        print(f"  Offset:          {result['offset']}")
        print(f"  Delay:           {result['delay']}")

        if verbose:
            leap_labels = {
                0: "no warning",
                1: "last minute of the day has 61 seconds",
                2: "last minute of the day has 59 seconds",
                3: "alarm condition (clock not synchronized)",
            }
            leap_desc = leap_labels.get(result["leap"], "unknown")
            print(f"  Leap Indicator:  {result['leap']} ({leap_desc})")
            print(f"  Precision:       {format_offset(result['precision'])}")

    print()
    print_separator("═")
    print(f"  Total servers tested: {len(results)}")
    reachable_count = sum(1 for r in results if r["reachable"])
    print(f"  Reachable:          {reachable_count}/{len(results)}")
    print_separator("═")
    print()


def print_csv_results(results: list):
    """Print results in CSV format for easy parsing."""
    print("Server,Reachable,Stratum,Reference_Clock,Transmit_Time,Offset_s,Delay_s,Error")
    for r in results:
        reachable = "Yes" if r["reachable"] else "No"
        stratum = r["stratum"] if r["stratum"] is not None else ""
        ref_clock = f"{r['ref_clock']} ({r['ref_clock_desc']})" if r["ref_clock"] else ""
        tx_time = r["transmit_time"] or ""
        offset = f"{r['offset_raw']:.9f}" if r["offset_raw"] is not None else ""
        delay = f"{r['delay_raw']:.9f}" if r["delay_raw"] is not None else ""
        error = r["error"] or ""
        print(f"{r['server']},{reachable},{stratum},{ref_clock},{tx_time},{offset},{delay},{error}")


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Test NTP servers and report key metrics.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s pool.ntp.org
  %(prog)s time.google.com time.cloudflare.com time.apple.com
  %(prog)s --csv 0.pool.ntp.org 1.pool.ntp.org
  %(prog)s --verbose pool.ntp.org

Default servers (if none specified):
  pool.ntp.org, time.google.com, time.cloudflare.com,
  time.nist.gov, time.apple.com
        """,
    )
    parser.add_argument(
        "servers",
        nargs="*",
        help="NTP server(s) to test (hostname or IP address)",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Show additional details (leap indicator, precision)",
    )
    parser.add_argument(
        "--csv",
        action="store_true",
        help="Output results in CSV format",
    )
    parser.add_argument(
        "--version",
        type=int,
        default=NTP_VERSION,
        choices=[3, 4],
        help=f"NTP protocol version (default: {NTP_VERSION})",
    )

    args = parser.parse_args()

    # Determine which servers to test
    servers = args.servers if args.servers else DEFAULT_SERVERS

    print()
    print(f"  Testing {len(servers)} NTP server(s)...")
    print(f"  NTP Version: {args.version} | Timeout: {TIMEOUT}s")
    print()

    # Test each server
    results = []
    for server in servers:
        result = test_ntp_server(server, version=args.version)
        results.append(result)

    # Output results
    if args.csv:
        print_csv_results(results)
    else:
        print_results(results, verbose=args.verbose)


if __name__ == "__main__":
    main()
