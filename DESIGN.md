# Design Brief

## Direction

Bold Modern Gen Z e-commerce — high-energy, maximalist, impulse-driven with confident color hierarchy and micro-interactions.

## Tone

Playful maximalist with dark mode warmth; confidence through vibrant fuchsia primary and warm amber accents, rejecting minimalist stereotypes.

## Differentiation

Visible depth layers, bold oversized typography (Space Grotesk chunky headlines), and pulsing accent badges highlight hero USPs (cash-on-delivery, same-day delivery, fit-and-try).

## Color Palette

| Token      | OKLCH         | Role                         |
| ---------- | ------------- | ---------------------------- |
| background | 0.14 0.01 280 | Deep charcoal, primary dark  |
| foreground | 0.92 0.01 280 | Off-white, high contrast     |
| card       | 0.18 0.015 280| Elevated surface layer       |
| primary    | 0.62 0.28 315 | Electric fuchsia/magenta CTA |
| accent     | 0.75 0.22 65  | Warm amber, USP badges       |
| muted      | 0.25 0.025 280| Secondary surface dimming    |

## Category Cards

| Category     | Primary OKLCH  | Secondary OKLCH | Meaning                 |
| ------------ | -------------- | --------------- | ----------------------- |
| Men          | 0.52 0.18 265  | 0.68 0.12 265   | Deep navy masculinity   |
| Women        | 0.55 0.20 330  | 0.72 0.14 330   | Rose/magenta premium    |
| Handicrafts  | 0.58 0.20 75   | 0.75 0.14 75    | Warm amber artisan      |
| Other        | 0.50 0.16 295  | 0.65 0.11 295   | Purple/violet modern    |

## Typography

- Display: Space Grotesk — bold, chunky headlines for hero and section titles
- Body: DM Sans — warm, accessible, friendly for descriptions and UI labels
- Scale: hero `text-6xl md:text-7xl font-bold tracking-tight`, h2 `text-4xl md:text-5xl font-bold`, label `text-sm font-semibold tracking-widest`, body `text-base`

## Elevation & Depth

Multi-layer surface hierarchy: dark background + elevated card surfaces with subtle depth; shadow `elevated` for cards, `glow` for primary CTAs.

## Structural Zones

| Zone    | Background   | Border           | Notes                          |
| ------- | ------------ | ---------------- | ------------------------------ |
| Header  | card/0.18    | border (subtle)  | Sticky, mobile-bottom nav      |
| Content | alternating  | none             | Sections alternate bg-card/bg  |
| Footer  | card/0.18    | border-t         | Warm accent accent elements    |

## Spacing & Rhythm

Large breathing room (6px–4rem) between sections; compact micro-spacing (4px–8px) within components for readability.

## Component Patterns

- Buttons: `btn-primary` (fuchsia, rounded-lg, hover scale-up) and `btn-accent` (amber, hover shadow)
- Cards: bg-card, rounded-lg, border-subtle, shadow-elevated, TikTok-style vertical grid
- Badges: `badge-usp` (amber pill, uppercase font-bold) for USP callouts (Fit & Try, Same Day)
- Category Cards: 2x2 grid on mobile, gradient backgrounds (Men/Women/Handicrafts/Other), bold icon + label overlay, hover lift animation (scale-105, shadow-elevated)
  - `.category-card-{men|women|handicrafts|other}`: applies distinct gradient
  - `.category-card` parent: handles rounded-2xl, overflow, transition
  - Icons: 80x80 on mobile (text-5xl), 96x96 on tablet (text-6xl), opacity-80 for depth

## Motion

- Entrance: `fade-in` (0.4s) + `slide-up` (0.5s) on page load and scroll
- Hover: `scale-105` on buttons, `pulse-glow` on accent badges
- Card lift: Category cards trigger `scale-105` + `shadow-elevated` on hover/tap
- Decorative: Smooth scroll transitions, no bounce

## Constraints

- Maintain >= 0.7 L contrast between foreground and background in both light and dark modes
- Fuchsia primary reserved for CTAs only; amber accent for USP badges
- All animations must use cubic-bezier(0.4, 0, 0.2, 1) base easing (smooth)
- Mobile-first design: thumb-friendly CTAs, bottom nav patterns

## Signature Detail

Pulsing glow aura on USP badges (`pulse-glow`) signals availability of premium features (same-day, fit-and-try) — drives conversational urgency and Gen Z impulse engagement. Category cards use bold gradient + icon typography to immediately communicate brand personality and collection intent, with lift animation on tap for tactile feedback.
