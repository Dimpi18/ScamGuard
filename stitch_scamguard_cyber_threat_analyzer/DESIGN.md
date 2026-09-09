---
name: ScamGuard Precision Security
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#410002'
  on-tertiary-container: '#f63a35'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.005em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-badge:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter: 1rem
  sidebar-width: 260px
  panel-max-width: 1440px
---

## Brand & Style

This design system delivers an enterprise-grade, authoritative operational console for threat detection, forensic analysis, and fraud mitigation. The personality is disciplined, clinical, and vigilant—reminiscent of mission-critical engineering suites such as Cloudflare, Datadog, and CrowdStrike. 

The aesthetic is anchored in utility-first corporate modernism with high-density information architecture. It actively avoids generic cybersecurity tropes: zero decorative background glows, zero floating organic shapes, zero neon cyber-accents, and no frosted glass distortion. Visual weight is communicated through rigorous 1px structural borders, deliberate typographic hierarchy, explicit status semantic indicators, and immaculate alignment. Every pixel serves a defensive operational purpose, ensuring users can parse high-risk indicators under pressure without cognitive distraction.

## Colors

The palette is engineered around high luminance contrast, clinical clarity, and unmistakable threat signaling.

- **Foundational Surfaces:** Background canvas is strictly `#F8F9FA`. Content panels, inspect drawers, and data cards sit on `#FFFFFF`, framed by sharp 1px borders in `#E2E8F0` or internal sub-grid lines in `#F1F3F5`.
- **Text & Brand Tone:** Primary text and primary interactive surfaces use deep obsidian navy (`#0F172A`), providing institutional authority and crisp readability against white cards. Secondary metadata uses `#475569`.
- **System Action Accent:** Cobalts (`#2563EB` and `#3B82F6`) are deployed sparingly for verified interactive affordances (primary buttons, active tab indicators, hyperlinked threat hashes). Never apply blue gradients.
- **Threat State Triad:**
  - *Critical / Malicious:* Text/Icon `#DC2626`, container `#FEF2F2`, structural border `#FCA5A5`.
  - *Suspicious / Elevated:* Text/Icon `#D97706`, container `#FFFBEB`, structural border `#FDE68A`.
  - *Verified / Clean:* Text/Icon `#16A34A`, container `#F0FDF4`, structural border `#BBF7D0`.

## Typography

Typography prioritizes density, optical precision, and scannability across massive volumes of telemetry.

- **Prose & Hierarchy:** `Inter` handles operational headings, UI controls, and narrative reporting. Weights are restricted strictly to 400 (Regular), 500 (Medium), 600 (Semibold), and 700 (Bold). Avoid ultra-light or extra-heavy weights.
- **Forensic & Telemetry Data:** `JetBrains Mono` is enforced for all IP addresses, SHA-256 signatures, domain records, network logs, and badge metadata. All monospace values maintain tabular figures (`tnum`) to ensure aligned column auditing.
- **Micro-Copy Constraints:** Badge text and threat level pill tags must render in uppercase with +0.04em tracking using `label-badge` for unmistakable at-a-glance scanning.

## Layout & Spacing

Layout adheres to a strict 8px operational rhythm (subdivided by 4px increments for compact data components). 

- **Grid Architecture:** Desktop workspace uses a fixed-width left navigation rail (`260px`), with a fluid content area constrained to a maximum width of `1440px`. The primary canvas uses 16px (`1rem`) gutters on compact screens, scaling to 24px (`1.5rem`) on desktop.
- **Data Density:** Tables and inspection panels use compact vertical paddings (`space-xs` to `space-sm`) to maximize row density per viewport. Section headers maintain a rigid `space-base` separation from data cards.
- **Responsive Reflow:** On mobile viewports (&lt;768px), sidebar navigation collapses into a bottom or top drawer, tables switch to horizontally scrollable viewports with sticky identifier columns, and metric summary columns collapse from 4 columns to a 2-column or 1-column stack.

## Elevation & Depth

This system intentionally eliminates deep ambient shadows, diffusion blurs, and glassmorphism. Visual depth is established through micro-layering and crisp border boundaries:

- **Base Cards & Surfaces:** Rely on a 1px solid border (`#E2E8F0`) backed by an ultra-subtle hairline drop shadow: `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`.
- **Active / Focused Containers:** Depth elevation is not signaled with heavier shadows, but with border priority shifts (e.g., `#0F172A` or `#2563EB` 1px border) and high-contrast background contrasts.
- **Floating Overlays & Popovers:** Threat inspection flyouts, filter dropdowns, and context toolbars use `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` accompanied by a 1px solid `#CBD5E1` containment border. Modals utilize a non-blurred, 40% `#0F172A` solid backdrop scrim.

## Shapes

The shape system is restrained and disciplined. Roundedness level is set to `1` (Soft).

- **Standard Containers & Cards:** Strictly capped at `6px` to `8px` (`0.375rem` to `0.5rem`). Never exceed `8px` on functional data surfaces or cards.
- **Interactive Controls:** Form inputs, standard buttons, and tab segment controls use a uniform `6px` corner radius.
- **Tags, Chips, and Threat Pills:** Micro badges use `4px` corner radii to reinforce an engineered, utilitarian chassis. Never use full pill curves (rounded-full) for tabular tags.

## Components

### Buttons
- **Primary:** `#0F172A` background, `#FFFFFF` text, 1px solid `#0F172A`. Hover: `#1E293B`. Active: `#020617`. Focus ring: 2px solid `#2563EB` with 2px offset.
- **Secondary / Standard Action:** `#FFFFFF` background, `#0F172A` text, 1px solid `#E2E8F0`. Hover: `#F8F9FA` background, `#0F172A` border.
- **Destructive:** `#FEF2F2` background, `#DC2626` text, 1px solid `#FCA5A5`. Hover: `#FEE2E2`.

### Threat Status Badges & Pills
- Rendered in uppercase monospace (`JetBrains Mono`, 11px, weight 600) with 4px border radius, 2px 6px padding.
- **Critical / Scam:** `#FEF2F2` container, 1px `#FCA5A5` border, `#DC2626` text with a 6px solid red dot indicator.
- **Suspicious:** `#FFFBEB` container, 1px `#FDE68A` border, `#D97706` text with an amber dot indicator.
- **Verified / Safe:** `#F0FDF4` container, 1px `#BBF7D0` border, `#16A34A` text with a green check or dot.

### Forensic Analysis Code Blocks & Log Terminals
- Background `#0F172A`, text `#F8F9FA`, 1px solid `#334155` border, 6px radius.
- Syntax highlights: `#38BDF8` (keys/properties), `#FDE047` (payloads/queries), `#F87171` (critical malicious vectors), `#4ADE80` (safe responses). Includes a subtle top header bar with copy-hash trigger and log size metric.

### Input Fields & Search Filters
- `#FFFFFF` background, 1px solid `#CBD5E1` border, 6px border-radius, 8px 12px padding.
- Placeholder text `#94A3B8`. Focus state: `#2563EB` border with `0 0 0 1px #2563EB`. Error state: `#DC2626` border with `0 0 0 1px #DC2626`.

### Cards & Threat Detail Panels
- `#FFFFFF` background, 1px solid `#E2E8F0` perimeter border, 8px radius, `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`.
- Internal dividers must use 1px solid `#F1F3F5`. Card headers feature an explicit 12px bottom border line separating metadata controls from row-level inspection data.

### Checkboxes & Selection Toggles
- 16px square, 3px border radius, 1px solid `#CBD5E1`. Checked state: `#0F172A` background with crisp `#FFFFFF` checkmark glyph. Indeterminate states use a crisp white 2px horizontal rule.