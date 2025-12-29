# Monetization Setup Guide

This guide walks you through setting up monetization (ads) for Dev Toolbox.

## Prerequisites

- ✅ Privacy Policy page created and updated
- ✅ Imprint page created with your contact information
- ✅ Cookie consent banner component ready
- ✅ Ad placeholder components ready
- ✅ `ads.txt` file configured

## Step-by-Step Setup

### 1. Environment Variables

Create a `.env.local` file (or set in Vercel dashboard) with:

```bash
# Enable cookie consent banner (required for GDPR compliance)
NEXT_PUBLIC_ENABLE_COOKIE_CONSENT=true

# Enable ad placeholders (for testing layout)
NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS=true

# Your Google AdSense Publisher ID (when approved)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### 2. Apply for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Add your website URL
4. Complete the application process
5. Wait for approval (can take a few days to weeks)

### 3. Add AdSense Script to Layout

Once approved, add the AdSense script to `app/layout.tsx` in the `<head>` section:

```tsx
<head>
  <StructuredData />
  {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
    />
  )}
</head>
```

### 4. Configure Ad Slots in AdSense Dashboard

1. Log into your AdSense account
2. Go to **Ads** → **By ad unit**
3. Create ad units matching your positions:
   - **Top Banner**: 728x90 (Leaderboard)
   - **Sidebar**: 300x250 (Medium Rectangle)
   - **In-Content**: 728x90 (Leaderboard)

4. Copy the ad unit IDs and update `AdPlacement.tsx` if needed (currently uses position-based IDs)

### 5. Update ads.txt

Your `public/ads.txt` file should contain:

```
google.com, pub-3533666566587164, DIRECT, f08c47fec0942fa0
```

Replace `pub-3533666566587164` with your actual AdSense publisher ID.

### 6. Test Ad Display

1. Enable placeholders first: `NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS=true`
2. Verify layout looks good on desktop, tablet, and mobile
3. Once AdSense is approved, set `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`
4. Disable placeholders: `NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS=false`
5. Test real ads across devices

### 7. Verify Cookie Consent

1. Ensure `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT=true`
2. Test the cookie consent banner appears
3. Verify consent is stored in localStorage
4. Test that ads respect consent (if implementing consent-based ad loading)

## Ad Placement Locations

Currently configured ad positions:

1. **Top Banner** (`top-banner`)
   - Location: Welcome page, above hero section
   - Size: 728x90 (Leaderboard)
   - Component: `components/Home/WelcomePage.tsx`

2. **Sidebar** (`sidebar`)
   - Location: Left sidebar navigation
   - Size: 300x250 (Medium Rectangle)
   - Component: `components/Sidebar/Sidebar.tsx`

3. **In-Content** (`in-content`)
   - Location: Welcome page, between hero and featured tools
   - Size: 728x90 (Leaderboard)
   - Component: `components/Home/WelcomePage.tsx`

## Feature Flags

### `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT`
- **Purpose**: Show/hide cookie consent banner
- **Default**: `false`
- **When to enable**: When using ads or analytics that require cookies

### `NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS`
- **Purpose**: Show placeholder boxes instead of real ads
- **Default**: `false`
- **When to enable**: 
  - Testing layout before AdSense approval
  - Previewing ad positions
  - Development/testing

### `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`
- **Purpose**: Your Google AdSense publisher ID
- **Format**: `ca-pub-XXXXXXXXXXXXXXXX`
- **When to set**: After AdSense approval

## Privacy & Compliance

### GDPR Compliance
- ✅ Cookie consent banner implemented
- ✅ Privacy Policy updated with ad data collection details
- ✅ Opt-out links provided in Privacy Policy

### Required Pages
- ✅ Privacy Policy (`/privacy`)
- ✅ Imprint (`/imprint`)
- ✅ Legal footer links

## Troubleshooting

### Ads not showing
1. Check `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is set correctly
2. Verify AdSense script is loaded (check browser console)
3. Ensure ad slots are configured in AdSense dashboard
4. Check `ads.txt` is accessible at `/ads.txt`
5. Verify AdSense account is approved and active

### Cookie consent not appearing
1. Check `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT=true`
2. Clear localStorage: `localStorage.removeItem('cookie-consent')`
3. Refresh page

### Layout issues
1. Enable placeholders: `NEXT_PUBLIC_ENABLE_AD_PLACEHOLDERS=true`
2. Check ad container dimensions match ad sizes
3. Test responsive behavior on mobile/tablet

## Performance Considerations

- Ads are loaded asynchronously to avoid blocking page load
- Ad containers have minimum heights to prevent layout shift
- Consider lazy loading ads below the fold
- Monitor Core Web Vitals after enabling ads

## Next Steps

1. ✅ Foundation files created
2. ✅ Privacy Policy updated
3. ✅ Imprint page completed
4. ✅ Ad components ready
5. ⏳ Apply for AdSense
6. ⏳ Add AdSense script to layout
7. ⏳ Configure ad slots
8. ⏳ Test and launch

## Resources

- [Google AdSense Help](https://support.google.com/adsense/)
- [AdSense Policy Center](https://www.google.com/adsense/new/localized-policies)
- [ads.txt Specification](https://iabtechlab.com/ads-txt/)
- [GDPR Compliance Guide](https://gdpr.eu/)

