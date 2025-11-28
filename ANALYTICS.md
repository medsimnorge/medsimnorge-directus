# Analytics - GoatCounter

This site uses [GoatCounter](https://www.goatcounter.com/) for privacy-friendly analytics.

## Why GoatCounter?

- ✅ **100% GDPR compliant** - No cookie banner needed
- ✅ **Free** for personal and small business use
- ✅ **Privacy-first** - No personal data collected
- ✅ **Lightweight** - Minimal performance impact (~3.5KB)
- ✅ **Simple** - No complex setup required
- ✅ **Open source** - Transparent and trustworthy

## Setup

GoatCounter is already configured in `src/app.html`:

```html
<script data-goatcounter="https://medsimnorge.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

## Viewing Analytics

Visit your GoatCounter dashboard:
- URL: https://medsimnorge.goatcounter.com
- Login with your GoatCounter account

## What's Tracked

- Page views
- Referrers (where visitors come from)
- Browser and OS information
- Screen size
- Country (based on IP, but IP is not stored)

## What's NOT Tracked

- ❌ Personal information
- ❌ IP addresses
- ❌ Cookies
- ❌ Cross-site tracking
- ❌ Fingerprinting

## Privacy

GoatCounter is GDPR compliant by default:
- No cookies used
- No personal data collected
- IP addresses are anonymized immediately
- Data is stored in the EU

**You don't need a cookie consent banner for GoatCounter!**

## Configuration

To change the GoatCounter site, edit `src/app.html`:

```html
<script data-goatcounter="https://YOUR-SITE.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

## Advanced Features

### Track Custom Events

```javascript
if (window.goatcounter) {
  window.goatcounter.count({
    path: '/custom-event',
    title: 'Custom Event Name',
    event: true
  });
}
```

### Exclude Specific Pages

Add to the script tag:
```html
<script 
  data-goatcounter="https://medsimnorge.goatcounter.com/count"
  data-goatcounter-settings='{"no_onload": true}'
  async src="//gc.zgo.at/count.js">
</script>
```

### Bot Detection

GoatCounter automatically filters out:
- Known bots and crawlers
- Localhost/development traffic
- Prerendering requests

## Resources

- [GoatCounter Documentation](https://www.goatcounter.com/help)
- [GoatCounter GitHub](https://github.com/arp242/goatcounter)
- [Privacy Policy](https://www.goatcounter.com/help/privacy)
