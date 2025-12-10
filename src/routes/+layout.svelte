<script lang="ts">
	import '../app.css';
	import defaultFavicon from '$lib/assets/MedSimNorge-favicon.png';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getAssetUrl } from '$lib/utils';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
	
	// Use favicon from site_settings or fallback to local
	const faviconUrl = data.siteSettings?.favicon 
		? getAssetUrl(data.siteSettings.favicon) 
		: defaultFavicon;
	
	// Background image from site_settings (only if enabled)
	const shouldShowBackground = data.siteSettings?.use_bgimage === true;
	const backgroundImageUrl = shouldShowBackground && data.siteSettings?.bg_image 
		? getAssetUrl(data.siteSettings.bg_image) 
		: null;
	
	// Generate background style
	const backgroundStyle = backgroundImageUrl ? `background-image: url('${backgroundImageUrl}'); background-size: cover; background-position: center; background-attachment: fixed; background-repeat: no-repeat;` : '';
</script>

<svelte:head>
	<link rel="icon" href={faviconUrl} />
</svelte:head>

<!-- Skip to main content link for keyboard users -->
<a 
	href="#main" 
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg"
>
	Hopp til hovedinnhold
</a>

<Header navItems={data.navItems} />
<main 
	id="main" 
	class="relative min-h-screen"
	style={backgroundStyle}
>
	{#if backgroundImageUrl}
		<!-- Subtle overlay for better text readability -->
		<div class="absolute inset-0 bg-white/20 dark:bg-gray-900/30"></div>
	{/if}
	
	<div class="relative z-10">
		{@render children?.()}
	</div>
</main>
<Footer siteSettings={data.siteSettings} />