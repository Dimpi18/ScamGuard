# ScamGuard — Problem Statement

## The Problem

Online scams are growing in volume, sophistication, and emotional manipulation. Phishing SMS messages, fraudulent WhatsApp forwards, fake bank emails, and malicious shortened links target ordinary people daily. Most victims are not technically illiterate — they are busy, distracted, or pressured into acting before thinking.

The core issue is not detection alone. People receive a suspicious message and have no fast, trustworthy, private way to understand:

1. **Is this actually a scam?** — A clear yes/no/maybe verdict with a confidence score.
2. **How does the attack work?** — What social engineering tactics are being used (urgency, fear, impersonation, authority).
3. **What is the attacker trying to steal?** — Credentials, money, personal data, device access.
4. **What should I do right now?** — Concrete, plain-English protective actions.

Existing solutions fall short:

- **Google Safe Browsing / VirusTotal** — Checks URLs only. Does not analyze message text, social engineering, or explain the attack to a non-technical user.
- **Email spam filters** — Work silently in the background. No educational value. Miss SMS, WhatsApp, and DM-based attacks entirely.
- **Cybersecurity awareness training** — Requires proactive effort. Not available at the moment of doubt when someone is staring at a suspicious message.
- **Asking a tech-savvy friend** — Unreliable, slow, not always available, and embarrassing for the victim.

## The Gap

There is no free, instant, privacy-first tool that lets an ordinary person paste a suspicious message (or upload a screenshot, or submit a link) and receive a detailed, understandable threat analysis report — including what the scam is, how it works, what it targets, and what to do — in seconds.

## Who This Is For

- Non-technical individuals who receive suspicious messages and don't know how to evaluate them.
- Parents, elderly family members, and anyone who is a frequent target of social engineering.
- Small business owners who receive impersonation emails claiming to be from banks, government, or vendors.
- Anyone who wants to verify before they click, without needing cybersecurity expertise.

## What ScamGuard Does

ScamGuard is a free, anonymous, zero-retention web application that accepts suspicious content through three input modes:

1. **Paste Message** — Copy-paste any suspicious SMS, email body, WhatsApp message, or social media DM.
2. **Upload Screenshot** — Upload an image of a suspicious conversation; the system extracts text using OCR and analyzes it.
3. **Analyze Link** — Submit a suspicious URL for safe inspection without visiting it.

For every submission, ScamGuard produces a **Threat Analysis Report** that includes:

- **Risk Score** — A percentage-based threat level (High Risk / Suspicious / Safe) with clear visual indicators.
- **Verdict** — A plain-English summary of what the message is and what it's trying to do.
- **Threat Indicators** — Specific red flags detected (credential theft, suspicious link, brand impersonation, urgency, social engineering).
- **Why This Is Suspicious** — An explanation of each tactic the attacker is using, written for a non-technical reader.
- **Attack Chain** — A step-by-step visual breakdown of how the scam progresses (Impersonation → Fear → Urgency → Fake Verification → Credential Theft).
- **What You Should Do** — Concrete do/don't actions (don't click the link, don't share OTP, verify through official app).

## Core Principles

- **Privacy First** — Nothing is stored. No accounts required. No tracking. Analysis happens in an ephemeral session and is discarded.
- **Plain English** — Every result is written so a non-technical person can understand it without cybersecurity knowledge.
- **Instant** — Results are delivered in seconds, not minutes.
- **Free** — No subscription, no premium tier, no upsell. Personal safety should not be paywalled.
- **Educational** — The goal is not just "safe/unsafe" — it's to help people understand *how* scams work so they develop better instincts over time.

## Success Criteria

ScamGuard succeeds when a person who receives a suspicious message can:

1. Open ScamGuard in their browser.
2. Paste the message (or upload a screenshot, or submit a link).
3. Receive a clear, understandable report in under 10 seconds.
4. Know exactly what the threat is and what to do about it.
5. Walk away more informed than before — not just safer in this one instance, but better equipped to recognize the next attempt.
