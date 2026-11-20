---
name: Mohimmati
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2ec'
  on-surface: '#191c22'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3038'
  inverse-on-surface: '#eff0fa'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f87'
  primary: '#022448'
  on-primary: '#ffffff'
  primary-container: '#1e3a5f'
  on-primary-container: '#8aa4cf'
  inverse-primary: '#adc8f5'
  secondary: '#21686e'
  on-secondary: '#ffffff'
  secondary-container: '#a9ebf1'
  on-secondary-container: '#276c72'
  tertiary: '#3b1c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5a2e00'
  on-tertiary-container: '#f08921'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#adc8f5'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2d486d'
  secondary-fixed: '#aceef4'
  secondary-fixed-dim: '#90d1d8'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f9f9ff'
  on-background: '#191c22'
  surface-variant: '#e0e2ec'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a calm, academically focused, and high-legibility interface tailored specifically for Arabic-speaking students. The tone is deliberate, organized, and emotionally reassuring—eliminating academic anxiety through structural order, generous breathing room, and clear information hierarchy.

### Design Movement: Modern Functional Minimalism with RTL-Native Craft
The design draws on focused, utilitarian minimalism paired with subtle tactile warmth. It rejects sensory overload, aggressive gamification, and jarring high-saturation accents. The UI serves strictly as a transparent, dependable canvas for deadlines, study materials, and academic milestones.

### Design Principles
- **Clarity Over Clutter:** Interfaces surface actionable deadlines first. Decorative graphics are replaced by crisp typography and structured metric tiles.
- **RTL-First Symmetry:** The horizontal progression naturally flows right-to-left: actions, back navigations, and chronological progressions honor authentic Arabic script dynamics.
- **Stress-Reducing Semantics:** Visual weight is balanced so status colors guide rather than induce panic. Critical states are explicit, informative, and always paired with textual labels and contextual icons.

## Colors

The palette is anchored by a calming, scholarly deep slate-indigo (`#1E3A5F`) paired with balanced stone and warm-slate neutrals to preserve focus during long study sessions.

### Functional Palette
- **Canvas Base (`bg-surface`):** `#F9F9FB` — A soft, low-strain off-white canvas.
- **Surface Elevation (`bg-surface-elevated`):** `#FFFFFF` — Pure white for cards, elevated modals, and inputs.
- **Surface Subdued (`bg-surface-subdued`):** `#F1F3F7` — Cool stone-slate for task listing rows and non-active chips.
- **Text Primary (`text-primary`):** `#1C1F26` — Deep charcoal providing optimal contrast for Arabic diacritics and letterforms.
- **Text Secondary (`text-muted`):** `#535D6C` — Medium-slate gray for metadata, timestamps, and secondary labels.
- **Borders & Dividers (`border-subtle`):** `#E2E6ED` — Crisp, low-contrast boundary lines.

### Strict Semantic Rules
Color is never used as the sole indicator of state. Every status indicator must feature both an explicit Arabic label and an accompanying semantic icon.

- **Overdue / Urgent (`danger`):** `#C23434` (Surface: `#FDF2F2`, Border: `#F8D7D7`). Exclusively reserved for passed deadlines ('متأخرة') and destructive deletion modals. Never used for general notifications or primary tags.
- **Completed (`success`):** `#1E7E52` (Surface: `#EDF7F2`, Border: `#D0EDE0`). Strictly reserved for completed tasks ('مكتملة') and completion celebrations.
- **In-Progress (`info` / `neutral-accent`):** `#2E7278` (Surface: `#EBF5F6`, Border: `#D3ECEE`). Calming teal-slate representing active study ('قيد التنفيذ').
- **Not Started (`idle`):** `#64748B` (Surface: `#F1F5F9`, Border: `#E2E8F0`). Muted cool slate for tasks queued for the future ('لم تبدأ').
- **Approaching Due Date (`warning`):** `#D97706` (Surface: `#FEF9EE`, Border: `#FDE68A`). Warm amber for items due within 24-48 hours ('يقترب الموعد').

## Typography

The design system standardizes on `IBM Plex Sans` (with primary fallback to Arabic-specific subsets such as `IBM Plex Sans Arabic`, `Cairo`, and system UI Arabic fonts). 

Arabic typography requires specific architectural rules:
- **Expanded Line Heights:** Arabic scripts have ascenders, descenders, and diacritics (*harakat*) that collide under standard Latin line heights. Minimum line height for body text is set between `1.6` and `1.7`.
- **Optical Weighting:** Bold headings use `weight: 700` and `600` to anchor scanning without smudging curves. Body text stays strictly at `weight: 400` to maximize reading pace.
- **Letter Spacing:** Letter spacing (`letter-spacing`) is strictly set to `normal` or `0` for Arabic text. Tracking or negative kerning must never be applied to Arabic glyphs to avoid breaking cursive ligatures.
- **Numerals:** Support both Western Arabic (`1, 2, 3`) and Eastern Arabic (`١، ٢، ٣`) with uniform monospaced tabular figures in deadline dates and countdown meters.

## Layout & Spacing

The layout is built upon a 12-column fluid grid on desktop and tablet, collapsing to a single or 2-column stacked flow on mobile viewports.

### Grid Rhythm & Adapters
- **Desktop (1024px+):** 12 columns, `margin: 2rem` (max container width 1240px centered), `gutter: 1.25rem`. Summary metrics span 4 columns each. Main task boards span 8 columns, with secondary sidebars/filters spanning 4 columns.
- **Tablet (768px - 1023px):** 6 columns, `margin: 1.5rem`, `gutter: 1rem`. Summary metrics sit 2-per-row or in a scrollable horizontal deck.
- **Mobile (< 768px):** Single column flow, `margin: 1rem`, `gutter: 0.75rem`. Cards occupy 100% width with touch targets of at least 44px height.

### Strict RTL Mirroring
- Canvas container sets `dir="rtl"`.
- Floats, flex alignments, and margins preserve inline start/end logic (`padding-inline-start`, `margin-inline-end`).
- Primary icon placements in buttons and inputs are anchored to the physical right (the reading start), while directional navigation indicators (e.g., arrow chevrons) reverse direction automatically.

## Elevation & Depth

Visual hierarchy relies primarily on tonal surfaces and structural borders, supplemented by low-opacity ambient shadows to avoid visual noise.

- **Level 0 (Flat/Base):** Default page background (`#F9F9FB`), no shadow, no border.
- **Level 1 (Card Standard):** Task cards, filter pills, summary metrics (`#FFFFFF`). Border: `1px solid #E2E6ED`. Shadow: `0px 1px 3px rgba(28, 31, 38, 0.04), 0px 1px 2px rgba(28, 31, 38, 0.02)`.
- **Level 2 (Hover & Focus):** Interactive card hovering and active dropdown menus. Border: `1px solid #CBD5E1`. Shadow: `0px 4px 12px -2px rgba(28, 31, 38, 0.07), 0px 2px 4px -1px rgba(28, 31, 38, 0.04)`. Slight vertical translation of `-1px`.
- **Level 3 (Modals, Drawers & Overlays):** Slide-over task drawers and confirmation dialogs. Border: `1px solid #E2E6ED`. Shadow: `0px 16px 32px -8px rgba(28, 31, 38, 0.12), 0px 4px 12px -2px rgba(28, 31, 38, 0.06)`. Backing scrim: `rgba(28, 31, 38, 0.45)` with `backdrop-filter: blur(4px)`.

## Shapes

The design system embraces a balanced `Rounded` language (`level 2`), communicating friendliness without compromising academic structure.

- **Inputs, Buttons, and Status Badges:** `0.5rem` (`rounded-md`).
- **Cards & Metric Modules:** `1rem` (`rounded-lg`).
- **Modals & Slide-over Drawers:** `1.5rem` (`rounded-xl` on modal corners; drawers apply `rounded-r-none` and `rounded-l-2xl` for RTL desktop entry from the left or full `rounded-t-2xl` for mobile bottom-sheets).
- **Interactive Filter Chips & Category Tags:** Fully pill-shaped (`9999px`) to create an immediate visual distinction between functional task cards and clickable query filters.

## Components

### 1. Summary Metric Cards (بطاقات الملخص)
- **Container:** Elevated surface, `padding: 1.25rem`, border `1px solid #E2E6ED`.
- **Content Flow:** An icon with a soft background tile sits at the start (right), followed by a vertical stack: small muted label (`label-sm`), large bold Arabic numeral (`headline-lg`), and secondary progress trend.
- **Variants:**
  - *Upcoming (المهام القادمة):* Icon in Slate-Indigo (`#1E3A5F`).
  - *Overdue (المتأخرة):* Icon in Danger Crimson (`#C23434`), border left highlight or subtle red-tinted indicator.
  - *Completed (المكتملة):* Icon in Success Forest (`#1E7E52`).

### 2. Task Card Item (بطاقة المهمة)
- **Structure:** Horizontal flexbox on desktop, wrapping gracefully on mobile.
- **Start Section (Right):** Completion circle checkbox (20px) allowing one-click check-off.
- **Center Section:**
  - Course Chip (e.g., `هياكل البيانات` or `فيزياء عامة`) rendered with subdued background and contrasting text.
  - Task Title (`headline-sm`, `font-semibold`, charcoal color).
  - Due Date row: Calendar icon with formatted date string (e.g., `الأحد، ١٢ مايو - ١١:٥٩ م`) displaying in amber if due soon.
- **End Section (Left):**
  - Explicit status badge (Text label + dot/icon).
  - Quick action menu button (three dots) aligned to the far left.

### 3. Add/Edit Task Drawer & Modal (نافذة إضافة/تعديل مهمة)
- **Drawer Motion:** Slides smoothly from the screen edge (left edge on desktop RTL, or bottom sheet on mobile screens).
- **Form Controls:**
  - *عنوان المهمة:* Full-width text input with placeholder `مثال: تسليم المشروع النهائي`.
  - *اسم المقرر / الكورس:* Selectable dropdown with search and color-coded course tags.
  - *موعد التسليم:* Date-time picker formatted in localized Arabic date conventions.
  - *الحالة:* Radio button group or segmented control choosing between: لم تبدأ، قيد التنفيذ، مكتملة.
  - *Primary CTA (`أضف مهمة`):* Slate-indigo solid button, bold white text, right-aligned icon `+`.

### 4. Interactive Filter Chips (شرائح التصفية)
- Height: 36px, pill-shaped (`9999px`), `padding: 0 1rem`.
- Inactive state: Border `#E2E6ED`, background `#FFFFFF`, text `#535D6C`.
- Active state: Background `#1E3A5F`, text `#FFFFFF`, bold font weight.
- Includes clear counter badges (e.g., `الكل (١٢)`, `متأخرة (٢)`).

### 5. Inputs & Search Fields (حقول الإدخال والبحث)
- Search Bar features magnifying glass icon anchored to the right (`padding-inline-start: 2.5rem`).
- Placeholder text in `#8C96A5` with proper Arabic phrasing: `ابحث عن مهمة، كورس، أو تاريخ...`.
- Clear icon button (X) pinned to the left when text is entered.
- Focus rings use `box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.15)` with a solid `#1E3A5F` border.

### 6. Empty State Illustrations (حالات الفراغ)
- Centered container with a soft circular backdrop (`#F1F5F9`).
- Calming line-art illustration representing organization (e.g., an open notebook, clear desk, or floating checklist).
- Title (`headline-md`): `لا توجد مهام حالياً`.
- Description (`body-md`): `أنت على المسار الصحيح! خذ استراحة أو أضف مهمة جديدة للبدء بها.`
- Quick Action Button: Secondary or primary button directly linking to task creation.