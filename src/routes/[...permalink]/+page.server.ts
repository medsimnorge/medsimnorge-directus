import { error } from '@sveltejs/kit';
import { DIRECTUS_URL, DIRECTUS_ADMIN_TOKEN } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const permalink = params.permalink || 'home';

	try {
		// Fetch only from pages collection with status filter
		const url = `${DIRECTUS_URL}/items/pages?filter[permalink][_eq]=${permalink}&filter[status][_eq]=published&fields=*,blocks.*,blocks.item:block_herowithimage.*,blocks.item:block_richtext.*,blocks.item:block_teammember.*`;

		const response = await fetch(url, {
			headers: {
				'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			
			if (data.data && data.data.length > 0) {
				return {
					page: data.data[0]
				};
			}
		}
	} catch (err) {
		console.error(`Feil ved henting av sideinnhold:`, err);
	}

	throw error(404, `Kunne ikke finne siden du lette etter, som var: "${permalink}"`);
};