Stage 6 Complete: Settings, Legal & Polish

## What Was Built

### 1. Settings Page (`/app/settings/page.tsx`)
Complete settings page with 4 organized sections:

**a. Appearance Section**
- Dark Mode three-way toggle: Light / Dark / System
- Gradient highlight for current selection
- Updates ThemeProvider immediately
- Persisted via localStorage

**b. Generation Preferences Section**
- Default Game selector (GameSelector component)
- Default Set Count selector (SetCountSelector 1-5)
- No Repeat toggle with description
- All values persist to Dexie settings

**c. Data Management Section**
- "Clear All Saved Numbers" button → ConfirmDialog → clears Dexie generatedSets
- "Clear Synced Results" button → ConfirmDialog → clears Dexie historicalDraws + localStorage keys
- Both with proper success/error toasts

**d. About Section**
- Version: 1.0.0
- Full disclaimer text
- Links to Terms and Privacy pages
- Built with: Next.js, TypeScript, Tailwind CSS

### 2. Terms of Service Page (`/app/terms/page.tsx`)
Full legal page with all required sections:
- Acceptance of Terms
- Description of Service (entertainment only disclaimer)
- No Guarantees or Warranties
- User Responsibilities
- Intellectual Property
- Data Storage (local only)
- Limitation of Liability
- Modifications to Terms
- Contact Information

Footer note: "These terms are a template. Consult legal counsel before publishing to app stores."

### 3. Privacy Policy Page (`/app/privacy/page.tsx`)
Full privacy policy with all required sections:
- Overview (minimal data approach)
- Information We Collect: "None."
- Local Data Storage (IndexedDB/localStorage explanation)
- Third-Party Services (no analytics, no ads)
- Cookies (none used)
- Children's Privacy (18+ only)
- Data Deletion instructions
- Changes to This Policy
- Contact Information

Footer note: "This privacy policy is a template. Consult legal counsel before publishing to app stores."

### 4. Error Boundary (`/components/ErrorBoundary.tsx`)
- Class component that catches rendering errors
- Displays friendly error UI with "Something went wrong" message
- Shows "Try Again" button (window.location.reload)
- Logs error to console
- Integrated into ClientLayout wrapping main content

### 5. DB Availability Check (`/hooks/useDBAvailable.ts`)
- Checks if IndexedDB is available on mount
- Returns { isAvailable, isChecking }
- Shows persistent banner when unavailable:
  "⚠️ Local storage is unavailable. Your data won't be saved between sessions."
- App still functions for generation without IndexedDB

### 6. UI Polish Components

**ConfirmDialog (`/components/ConfirmDialog.tsx`)**
- Reusable confirmation modal for destructive actions
- Props: isOpen, title, message, confirmLabel, cancelLabel, confirmVariant, onConfirm, onCancel
- Supports 'danger' and 'primary' variants
- Accessible with proper ARIA attributes

**SetCountSelector (`/components/SetCountSelector.tsx`)**
- Number selector 1-5 with visual buttons
- Gradient highlight for selected value
- Used in Settings and Generate pages

**Toggle (`/components/Toggle.tsx`)**
- Switch component for boolean settings
- Accessible with role="switch" and aria-checked
- Animated transitions

### 7. Home Page Updates (`/app/page.tsx`)
- Shows real "Sets Generated" count from Dexie
- Shows real "Last Draw" date from Dexie (most recent for selected game)
- Shows "Next Draw" calculated from game's drawDays
- DB unavailable warning banner
- Loading states for all stats

### 8. Layout Updates

**ClientLayout (`/components/ClientLayout.tsx`)**
- Wraps entire app with ErrorBoundary
- Shows DB unavailable banner when IndexedDB is not available
- Adjusts padding when banner is shown
- Contains Header, Sidebar, BottomNav, Toast

**Providers (`/components/Providers.tsx`)**
- Wraps ThemeProvider and ToastProvider
- Renders ClientLayout with children

**Template (`/app/template.tsx`)**
- Uses Providers to wrap all pages
- Ensures consistent layout across app

### 9. Type Updates (`/types/index.ts`)
- Added required `noRepeat: boolean` to UserSettings
- Added required `defaultSetCount: number` to UserSettings
- Removed optional markers (now required with defaults)

### 10. Database Updates (`/lib/db.ts`)
- Default settings now include: noRepeat: false, defaultSetCount: 1

## Files Created/Modified

| File | Status | Description |
|------|--------|-------------|
| `/components/ErrorBoundary.tsx` | NEW | Error catching component |
| `/hooks/useDBAvailable.ts` | NEW | IndexedDB availability check |
| `/components/ConfirmDialog.tsx` | NEW | Confirmation modal |
| `/components/SetCountSelector.tsx` | NEW | Number set selector 1-5 |
| `/components/Toggle.tsx` | NEW | Switch/toggle component |
| `/app/settings/page.tsx` | REWRITTEN | Full settings page |
| `/app/terms/page.tsx` | REWRITTEN | Full Terms of Service |
| `/app/privacy/page.tsx` | REWRITTEN | Full Privacy Policy |
| `/app/page.tsx` | MODIFIED | Real stats from Dexie |
| `/components/ClientLayout.tsx` | NEW | Layout with ErrorBoundary + DB banner |
| `/components/Providers.tsx` | NEW | Context providers wrapper |
| `/app/template.tsx` | NEW | Template using Providers |
| `/app/layout.tsx` | MODIFIED | Simplified server layout |
| `/types/index.ts` | MODIFIED | Added required settings fields |
| `/lib/db.ts` | MODIFIED | Added default settings values |
| `/hooks/useSettings.ts` | MODIFIED | Added defaults for new fields |

## Verification Checklist
✅ Settings page has all 4 sections with working controls
✅ Dark mode three-way toggle works (Light/Dark/System)
✅ Default game and set count persist and are used on generation page
✅ No Repeat toggle persists and affects generation
✅ Clear saved numbers works with confirmation
✅ Clear synced results works with confirmation
✅ Terms page has full, realistic content with all required sections
✅ Privacy page has full, realistic content with all required sections
✅ Both legal pages note they are templates needing legal review
✅ ErrorBoundary catches and displays rendering errors
✅ IndexedDB availability check works and shows banner when unavailable
✅ Home page quick stats show real data from Dexie
✅ All loading and empty states are handled
✅ No hydration mismatches (ClientLayout wrapper)

## Next: Stage 7
Ready for the final stage which likely includes:
- PWA manifest and service worker
- Final testing and optimization
- App store preparation
