import re
import socket
from datetime import datetime, timezone
from urllib.parse import urlparse
import httpx
try:
    import dns.resolver
except ImportError:
    dns = None

from models.schemas import URLIntelligence

SUSPICIOUS_TLDS = {
    "cc", "tk", "ml", "ga", "cf", "gq", "xyz", "top", "click", "buzz",
    "work", "support", "rest", "fit", "surf", "cn", "ru", "su"
}

BRAND_KEYWORDS = [
    "chase", "bankofamerica", "wellsfargo", "citi", "paypal", "apple",
    "microsoft", "google", "amazon", "netflix", "fedex", "ups", "usps",
    "dhl", "coinbase", "binance", "metamask", "facebook", "instagram"
]

SUSPICIOUS_PATH_TERMS = [
    "verify", "verification", "unlock", "secure", "login", "signin",
    "auth", "update", "account-locked", "banking", "kyc", "alert", "notice"
]

def extract_domain(url: str) -> str:
    """Extract clean domain/hostname from a URL string."""
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    return hostname.lower()

async def check_safe_browsing(url: str, api_key: str | None) -> str | None:
    """Query Google Safe Browsing Lookup API v4."""
    if not api_key:
        return "Safe Browsing check skipped (API key not configured)"

    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"
    payload = {
        "client": {
            "clientId": "scamguard-personal-defense",
            "clientVersion": "1.0.0"
        },
        "threatInfo": {
            "threatTypes": [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(endpoint, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                matches = data.get("matches", [])
                if matches:
                    threat_types = list({m.get("threatType") for m in matches if m.get("threatType")})
                    return f"FLAGGED by Google Safe Browsing: {', '.join(threat_types)}"
                return "CLEAN (No threats detected in Google Safe Browsing)"
            return f"Safe Browsing check returned status {resp.status_code}"
    except Exception as e:
        return f"Safe Browsing lookup timed out or failed: {str(e)}"

async def lookup_rdap_whois(domain: str) -> dict:
    """Fetch domain registration metadata using RDAP (Registration Data Access Protocol)."""
    result = {
        "domain_age_days": None,
        "registrar": None,
        "is_newly_registered": None
    }
    if not domain:
        return result

    rdap_url = f"https://rdap.org/domain/{domain}"
    try:
        async with httpx.AsyncClient(timeout=6.0, follow_redirects=True) as client:
            resp = await client.get(rdap_url)
            if resp.status_code == 200:
                data = resp.json()
                # Find registrar entity
                for entity in data.get("entities", []):
                    roles = entity.get("roles", [])
                    if "registrar" in roles:
                        vcard = entity.get("vcardArray", [])
                        if len(vcard) > 1 and isinstance(vcard[1], list):
                            for item in vcard[1]:
                                if item and item[0] == "fn":
                                    result["registrar"] = item[3]
                                    break
                
                # Find registration date
                events = data.get("events", [])
                for event in events:
                    if event.get("eventAction") == "registration":
                        reg_date_str = event.get("eventDate")
                        if reg_date_str:
                            # Parse ISO timestamp
                            clean_str = reg_date_str.replace("Z", "+00:00")
                            try:
                                reg_dt = datetime.fromisoformat(clean_str)
                                now = datetime.now(timezone.utc)
                                age_days = max(0, (now - reg_dt).days)
                                result["domain_age_days"] = age_days
                                result["is_newly_registered"] = age_days < 30
                            except Exception:
                                pass
                        break
    except Exception:
        # Fallback to defaults on timeout / network failure
        pass

    return result

def resolve_dns_records(domain: str) -> list[str]:
    """Resolve A and CNAME DNS records for the domain."""
    records = []
    if not domain:
        return records

    # Try dnspython first if installed
    if dns:
        try:
            resolver = dns.resolver.Resolver()
            resolver.timeout = 3.0
            resolver.lifetime = 3.0
            answers = resolver.resolve(domain, "A")
            for rdata in answers:
                records.append(f"A: {rdata.to_text()}")
        except Exception:
            pass

    # Socket fallback if no records yet
    if not records:
        try:
            _, _, ip_list = socket.gethostbyname_ex(domain)
            for ip in ip_list[:4]:
                records.append(f"A: {ip}")
        except Exception:
            records.append("DNS Resolution: Unresolved / Offline")

    return records

def analyze_url_structure(url: str) -> list[str]:
    """Perform static heuristics on URL structure to identify spoofing patterns."""
    findings = []
    domain = extract_domain(url)
    parsed = urlparse(url if "://" in url else "https://" + url)

    # Check for IP address in host
    ip_pattern = r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$"
    if re.match(ip_pattern, domain):
        findings.append("URL uses raw IP address instead of a domain name")

    # Check for suspicious TLD
    parts = domain.split(".")
    if len(parts) >= 2:
        tld = parts[-1]
        if tld in SUSPICIOUS_TLDS:
            findings.append(f"Uses suspicious / high-abuse top level domain (.{tld})")

    # Check for excessive subdomains
    if len(parts) > 3:
        findings.append(f"Abnormal number of subdomains detected ({len(parts) - 2} levels)")

    # Check for Brand Impersonation in subdomain or path
    for brand in BRAND_KEYWORDS:
        if brand in domain and not domain.endswith(f"{brand}.com") and not domain.endswith(f"{brand}.org"):
            findings.append(f"Deceptive brand keyword '{brand}' appears in host '{domain}'")
            break

    # Check path and query for high-risk words
    combined_path = (parsed.path + " " + parsed.query).lower()
    found_terms = [term for term in SUSPICIOUS_PATH_TERMS if term in combined_path]
    if found_terms:
        findings.append(f"Suspicious phishing-related path keywords: {', '.join(found_terms[:3])}")

    # Check for punycode / homograph
    if domain.startswith("xn--") or ".xn--" in domain:
        findings.append("IDN Homograph attack detected (Punycode 'xn--' prefix)")

    return findings

async def gather_url_intelligence(url: str, safe_browsing_api_key: str | None = None) -> URLIntelligence:
    """Gather all URL intelligence signals into a URLIntelligence model."""
    domain = extract_domain(url)

    # Run safe browsing and whois
    sb_verdict = await check_safe_browsing(url, safe_browsing_api_key)
    rdap_data = await lookup_rdap_whois(domain)
    dns_recs = resolve_dns_records(domain)

    return URLIntelligence(
        safe_browsing_verdict=sb_verdict,
        domain_age_days=rdap_data["domain_age_days"],
        registrar=rdap_data["registrar"],
        dns_records=dns_recs,
        is_newly_registered=rdap_data["is_newly_registered"]
    )
