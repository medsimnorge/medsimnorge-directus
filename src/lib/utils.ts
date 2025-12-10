import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Generate a proxied asset URL from a Directus asset ID
 * This masks the actual Directus URL and serves assets through the local proxy
 * @param assetId - The Directus asset ID (string) or asset object with id property
 * @returns The proxied asset URL or null if no asset provided
 */
export function getAssetUrl(assetId?: string | { id: string } | null): string | null {
	if (!assetId) return null;
	
	const id = typeof assetId === 'string' ? assetId : assetId.id;
	return `/assets/${id}`;
}

/**
 * Enhance HTML content by adding accessibility features to external links
 * Adds screen reader text to links with target="_blank"
 * @param html - HTML string from Directus
 * @returns Enhanced HTML with accessibility improvements
 */
export function enhanceExternalLinks(html: string): string {
	if (!html) return html;
	
	// Add screen reader text to external links
	return html.replace(
		/<a([^>]*target=["']_blank["'][^>]*)>(.*?)<\/a>/gi,
		'<a$1>$2<span class="sr-only"> (åpnes i ny fane)</span></a>'
	);
}

/**
 * Obfuscate emails in HTML content (for RichText blocks)
 * Replaces email addresses with JavaScript-based obfuscated versions
 * @param html - HTML content that may contain email addresses
 * @returns HTML with obfuscated email addresses that display normally to users
 */
export function obfuscateEmailsInHtml(html: string): string {
	if (!html) return html;
	
	// Pattern to match email addresses in text and mailto links
	const emailPattern = /\b([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/g;
	
	return html.replace(emailPattern, (match, localPart, domain) => {
		// Create a span that will be populated by JavaScript
		const id = `email-${Math.random().toString(36).substr(2, 9)}`;
		return `<span id="${id}" class="obfuscated-email" data-local="${btoa(localPart)}" data-domain="${btoa(domain)}"></span>
		<script>
			(function() {
				const el = document.getElementById('${id}');
				if (el) {
					const local = atob(el.dataset.local);
					const domain = atob(el.dataset.domain);
					const email = local + '@' + domain;
					el.innerHTML = '<a href="mailto:' + email + '" class="text-primary-800 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors font-semibold">' + email + '</a>';
				}
			})();
		</script>`;
	});
}
