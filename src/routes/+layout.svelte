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
</script>

<svelte:head>
	<link rel="icon" href={faviconUrl} />
</svelte:head>

<Header navItems={data.navItems} />
<main>
{@render children?.()}
</main>
<Footer siteSettings={data.siteSettings} />