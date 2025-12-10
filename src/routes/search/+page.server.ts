import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const query = url.searchParams.get('q') || '';
	
	if (!query.trim()) {
		return {
			results: [],
			total: 0,
			query: ''
		};
	}

	try {
		const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
		const data = await response.json();
		
		return {
			results: data.results || [],
			total: data.total || 0,
			query: query.trim()
		};
	} catch (error) {
		console.error('Search page load error:', error);
		return {
			results: [],
			total: 0,
			query: query.trim(),
			error: 'Søket feilet'
		};
	}
};