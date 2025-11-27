<script lang="ts">
	import '../app.css';
	import defaultFavicon from '$lib/assets/MedSimNorge-favicon.png';
	import Analytics from '$lib/components/Analytics.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getAssetUrl } from '$lib/utils';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
	
	// Use favicon from site_settings or fallback to local
	const faviconUrl = data.siteSettings?.favicon 
		? getAssetUrl(data.siteSettings.favicon) 
		: defaultFavicon;
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

<Analytics />
<Header navItems={data.navItems} />
<main id="main">
{@render children?.()}
</main>
<Footer siteSettings={data.siteSettings} />