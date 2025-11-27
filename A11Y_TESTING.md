# Accessibility Testing Guide

## Overview
This project uses automated accessibility testing with Playwright and axe-core to ensure WCAG 2.1 AA compliance.

## Running Tests

### Run all accessibility tests
```bash
pnpm test:a11y
```

### Run tests with UI (interactive mode)
```bash
pnpm test:ui
```

### Run all tests
```bash
pnpm test
```

### View test report
```bash
pnpm test:report
```

## What's Being Tested

### Automated Checks
- ✅ WCAG 2.0 Level A & AA compliance
- ✅ WCAG 2.1 Level A & AA compliance
- ✅ Color contrast ratios
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Form labels and inputs
- ✅ Image alt text
- ✅ Heading hierarchy
- ✅ Landmark regions
- ✅ External link indicators
- ✅ ARIA attributes

### Specific Tests

#### 1. Homepage Accessibility
Scans the entire homepage for WCAG violations.

#### 2. Navigation Accessibility
- Tests keyboard navigation (Tab key)
- Checks dropdown menus are keyboard accessible
- Verifies ARIA attributes on interactive elements

#### 3. External Links
- Ensures all external links have `target="_blank"`
- Verifies screen reader text is present
- Checks for `rel="noopener noreferrer"`

#### 4. Images
- All images must have alt text
- Decorative images should have empty alt (`alt=""`)

#### 5. Heading Structure
- Page must have at least one H1
- Headings should not skip levels (e.g., H1 → H3)

#### 6. Forms
- All inputs must have associated labels
- Can use `<label>`, `aria-label`, or `aria-labelledby`

#### 7. Landmarks
- Page must have a `<main>` landmark
- Proper semantic HTML structure

#### 8. Dynamic Content
- Tests dynamically loaded pages
- Ensures client-side navigation maintains accessibility

## Common Issues and Fixes

### Issue: Missing alt text on images
**Fix:** Add alt attribute to all images
```svelte
<img src="/image.jpg" alt="Description of image" />
```

### Issue: Low color contrast
**Fix:** Use colors that meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
```css
/* Bad */
color: #999 on #fff; /* 2.8:1 ratio */

/* Good */
color: #666 on #fff; /* 5.7:1 ratio */
```

### Issue: Missing form labels
**Fix:** Associate labels with inputs
```svelte
<label for="email">Email</label>
<input id="email" type="email" />

<!-- Or use aria-label -->
<input type="email" aria-label="Email address" />
```

### Issue: Skipped heading levels
**Fix:** Use proper heading hierarchy
```svelte
<!-- Bad -->
<h1>Title</h1>
<h3>Subtitle</h3>

<!-- Good -->
<h1>Title</h1>
<h2>Subtitle</h2>
```

### Issue: Non-keyboard accessible elements
**Fix:** Ensure interactive elements are keyboard accessible
```svelte
<!-- Bad -->
<div onclick={handleClick}>Click me</div>

<!-- Good -->
<button onclick={handleClick}>Click me</button>
```

## Manual Testing Checklist

While automated tests catch many issues, some things need manual testing:

### Keyboard Navigation
- [ ] Can you navigate the entire site using only Tab, Shift+Tab, Enter, and Arrow keys?
- [ ] Is the focus indicator visible on all interactive elements?
- [ ] Can you open and close dropdowns with keyboard?
- [ ] Can you submit forms with Enter key?

### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] Are all images announced properly?
- [ ] Are form fields clearly labeled?
- [ ] Are page landmarks announced?
- [ ] Are external links announced as opening in new tab?

### Visual Testing
- [ ] Test at 200% zoom - is content still readable?
- [ ] Test with Windows High Contrast mode
- [ ] Test with dark mode
- [ ] Are focus indicators visible?

### Mobile Accessibility
- [ ] Touch targets are at least 44x44 pixels
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling required

## Browser Extensions for Manual Testing

### Recommended Tools
1. **axe DevTools** - Chrome/Firefox extension for accessibility scanning
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Built into Chrome DevTools
4. **Color Contrast Analyzer** - Check color contrast ratios

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Install Playwright
  run: pnpm exec playwright install --with-deps

- name: Run accessibility tests
  run: pnpm test:a11y

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Accessibility Statement

Consider adding an accessibility statement page to your site:
- Describe your commitment to accessibility
- List known issues and workarounds
- Provide contact information for accessibility feedback
- Document testing methods and tools used

## Continuous Improvement

Accessibility is an ongoing process:
1. Run tests before every deployment
2. Test with real users who use assistive technology
3. Stay updated on WCAG guidelines
4. Review and update tests as site evolves
5. Train content editors on accessibility best practices
