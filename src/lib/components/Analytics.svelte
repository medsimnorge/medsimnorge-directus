<script lang="ts">
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';

	// Only load analytics in browser and if configured
	const websiteId = env.PUBLIC_UMAMI_WEBSITE_ID;
	const umamiUrl = env.PUBLIC_UMAMI_URL;
	const shouldLoadAnalytics = browser && websiteId && umamiUrl;
</script>

{#if shouldLoadAnalytics}
	<script
		async
		src="{umamiUrl}/script.js"
		data-website-id={websiteId}
	></script>
{/if}
