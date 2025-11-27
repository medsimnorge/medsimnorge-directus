import { error } from '@sveltejs/kit';
import { DIRECTUS_URL, DIRECTUS_ADMIN_TOKEN } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { permalink } = params;

	try {
		const url = `${DIRECTUS_URL}/items/nettverkskonferanser?filter[permalink][_eq]=${permalink}&filter[status][_eq]=published&fields=*,blocks.*,blocks.item:block_herowithimage.*,blocks.item:block_richtext.*,blocks.item:block_teammember.*`;

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
		} else {
			const errorText = await response.text();
			console.error('Feil ved henting av nettverkskonferanse:', response.status, errorText);
		}
	} catch (err) {
		console.error(`Feil ved henting av nettverkskonferanse:`, err);
	}

	throw error(404, `Fant ikke aktuell Nettverkskonferanse: "${permalink}"`);
};
