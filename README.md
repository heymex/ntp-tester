# NTP Server Tester

A single-file Python utility that queries NTP servers and prints reachability, stratum, reference clock, transmit time, offset, and delay.

## Requirements

- Python 3.6+
- [`ntplib`](https://pypi.org/project/ntplib/)

```bash
pip install ntplib
```

## Usage

With no arguments, the script tests these servers: `pool.ntp.org`, `time.google.com`, `time.cloudflare.com`, `time.nist.gov`, and `time.apple.com`.

```bash
python ntp_tester.py
python ntp_tester.py pool.ntp.org time.google.com
python ntp_tester.py --verbose pool.ntp.org
python ntp_tester.py --csv 0.pool.ntp.org 1.pool.ntp.org
python ntp_tester.py --version 4 time.cloudflare.com
```

Each query uses NTP version 3 and a 5 second timeout unless `--version` selects version 4.

### Options

| Option | Description |
| --- | --- |
| `servers` | One or more hostnames or IP addresses. Defaults to the list above. |
| `-v`, `--verbose` | Also print the leap indicator and precision. |
| `--csv` | Print a CSV header and one row per server. |
| `--version {3,4}` | NTP protocol version. Default is 3. |

## Reported fields

| Field | Meaning |
| --- | --- |
| Reachability | Whether the server answered before the timeout. DNS and network failures are reported as unreachable. |
| Stratum | Distance from a primary reference clock. 1 is a primary source. 2–15 are secondary. 0 is unspecified and 16 is unsynchronized. |
| Reference Clock | For stratum 0 and 1, a short clock id such as `GPS` or `NIST`, plus a description when the id is known. For stratum 2 and above, the IPv4 address of the server's reference peer. |
| Transmit Time | UTC time when the server sent its reply. |
| Offset | Difference between the local clock and the server, formatted in seconds, milliseconds, microseconds, or nanoseconds. |
| Delay | Estimated network round-trip time, in the same units as offset. |

`--verbose` adds the leap indicator (no warning, leap second, or unsynchronized alarm) and the server's advertised precision.

`--csv` writes `Server,Reachable,Stratum,Reference_Clock,Transmit_Time,Offset_s,Delay_s,Error`. Offset and delay in that mode are raw seconds.
