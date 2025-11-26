import { DIRECTUS_URL, DIRECTUS_ADMIN_TOKEN } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const headers = {
		'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`
	};

	let navItems = [];
	let siteSettings = null;

	// Fetch all nav items (including children)
	try {
		const navItemsUrl = `${DIRECTUS_URL}/items/nav_item?fields=*,page_href.permalink,nettverkskonferanse_href.permalink&sort=sort`;
		const navItemsResponse = await fetch(navItemsUrl, { headers });

		if (navItemsResponse.ok) {
			const navItemsData = await navItemsResponse.json();
			navItems = navItemsData.data || [];
			console.log('All nav items:', navItems);
		}
	} catch (err) {
		console.error('Error fetching nav items:', err);
	}

	// Fetch site settings
	try {
		const settingsUrl = `${DIRECTUS_URL}/items/site_settings?limit=1&fields=*`;
		
		const settingsResponse = await fetch(settingsUrl, { headers });

		if (settingsResponse.ok) {
			const settingsData = await settingsResponse.json();
			siteSettings = settingsData.data || null;
		} else {
			console.error('Site settings fetch failed:', settingsResponse.status);
		}
	} catch (err) {
		console.error('Error fetching site settings:', err);
	}

	return {
		navItems,
		siteSettings
	};
};