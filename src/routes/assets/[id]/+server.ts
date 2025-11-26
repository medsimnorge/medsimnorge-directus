import { DIRECTUS_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { id } = params;

	try {
		const response = await fetch(`${DIRECTUS_URL}/assets/${id}`);

		if (!response.ok) {
			throw error(response.status, 'Asset not found');
		}

		// Get the content type from Directus response
		const contentType = response.headers.get('content-type') || 'application/octet-stream';
		const buffer = await response.arrayBuffer();

		return new Response(buffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	} catch (err) {
		console.error('Error proxying asset:', err);
		throw error(500, 'Failed to load asset');
	}
};
