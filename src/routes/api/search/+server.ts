import { json } from '@sveltejs/kit';
import { DIRECTUS_URL, DIRECTUS_ADMIN_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q');
	
	if (!query || query.trim().length < 2) {
		return json({ results: [], total: 0 });
	}

	const headers = {
		'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`
	};

	try {
		const searchResults = [];

		// Search in pages with blocks
		const pagesUrl = `${DIRECTUS_URL}/items/pages?filter[status][_eq]=published&fields=*,blocks.*,blocks.item:block_richtext.*,blocks.item:block_herowithimage.*,blocks.item:block_teammember.*&limit=50`;
		const pagesResponse = await fetch(pagesUrl, { headers });
		
		if (pagesResponse.ok) {
			const pagesData = await pagesResponse.json();
			
			// Filter in JavaScript for better debugging
			for (const page of pagesData.data || []) {
				const titleMatch = page.title?.toLowerCase().includes(query.toLowerCase());
				
				// Extract content from blocks
				let blockContent = '';
				if (page.blocks && Array.isArray(page.blocks)) {
					for (const block of page.blocks) {
						const blockItem = block.item;
						if (blockItem) {
							// Extract text from different block types
							if (blockItem.content) blockContent += ' ' + blockItem.content;
							if (blockItem.title) blockContent += ' ' + blockItem.title;
							if (blockItem.description) blockContent += ' ' + blockItem.description;
							if (blockItem.bio) blockContent += ' ' + blockItem.bio;
							if (blockItem.name) blockContent += ' ' + blockItem.name;
						}
					}
				}
				
				const contentMatch = blockContent.toLowerCase().includes(query.toLowerCase());
				
				if (titleMatch || contentMatch) {
					searchResults.push({
						id: page.id,
						title: page.title,
						type: 'page',
						url: page.permalink === 'home' ? '/' : `/${page.permalink}`,
						excerpt: extractExcerpt(blockContent, query),
						relevance: calculateRelevance(page.title, blockContent, query)
					});
				}
			}
		} else {
			console.error('Pages response error:', pagesResponse.status, await pagesResponse.text());
		}

		// Search in nettverkskonferanser with blocks
		const konferanserUrl = `${DIRECTUS_URL}/items/nettverkskonferanser?filter[status][_eq]=published&fields=*,blocks.*,blocks.item:block_richtext.*,blocks.item:block_herowithimage.*,blocks.item:block_teammember.*&limit=50`;
		const konferanserResponse = await fetch(konferanserUrl, { headers });
		
		if (konferanserResponse.ok) {
			const konferanserData = await konferanserResponse.json();
			
			// Filter in JavaScript for better debugging
			for (const konferanse of konferanserData.data || []) {
				const titleMatch = konferanse.title?.toLowerCase().includes(query.toLowerCase());
				
				// Extract content from blocks
				let blockContent = '';
				if (konferanse.blocks && Array.isArray(konferanse.blocks)) {
					for (const block of konferanse.blocks) {
						const blockItem = block.item;
						if (blockItem) {
							// Extract text from different block types
							if (blockItem.content) blockContent += ' ' + blockItem.content;
							if (blockItem.title) blockContent += ' ' + blockItem.title;
							if (blockItem.description) blockContent += ' ' + blockItem.description;
							if (blockItem.bio) blockContent += ' ' + blockItem.bio;
							if (blockItem.name) blockContent += ' ' + blockItem.name;
						}
					}
				}
				
				const contentMatch = blockContent.toLowerCase().includes(query.toLowerCase());
				
				if (titleMatch || contentMatch) {
					searchResults.push({
						id: konferanse.id,
						title: konferanse.title,
						type: 'nettverkskonferanse',
						url: `/nettverkskonferanser/${konferanse.permalink}`,
						excerpt: extractExcerpt(blockContent, query),
						relevance: calculateRelevance(konferanse.title, blockContent, query)
					});
				}
			}
		} else {
			console.error('Nettverkskonferanser response error:', konferanserResponse.status, await konferanserResponse.text());
		}

		// Sort by relevance
		searchResults.sort((a, b) => b.relevance - a.relevance);

		return json({
			results: searchResults.slice(0, 20), // Limit to 20 results
			total: searchResults.length,
			query
		});

	} catch (error) {
		console.error('Search error:', error);
		return json({ results: [], total: 0, error: 'Search failed' }, { status: 500 });
	}
};

function extractExcerpt(content: string, query: string): string {
	if (!content) return '';
	
	// Remove HTML tags
	const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	
	// Find the query in the text (case insensitive)
	const lowerContent = plainText.toLowerCase();
	const lowerQuery = query.toLowerCase();
	const index = lowerContent.indexOf(lowerQuery);
	
	if (index === -1) {
		// Query not found, return first 150 characters
		return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
	}
	
	// Extract text around the query
	const start = Math.max(0, index - 75);
	const end = Math.min(plainText.length, index + query.length + 75);
	let excerpt = plainText.substring(start, end);
	
	// Add ellipsis if needed
	if (start > 0) excerpt = '...' + excerpt;
	if (end < plainText.length) excerpt = excerpt + '...';
	
	return excerpt;
}

function calculateRelevance(title: string, content: string, query: string): number {
	const lowerQuery = query.toLowerCase();
	const lowerTitle = title.toLowerCase();
	const lowerContent = content?.toLowerCase() || '';
	
	let score = 0;
	
	// Title matches are more important
	if (lowerTitle.includes(lowerQuery)) {
		score += 10;
		// Exact title match gets bonus
		if (lowerTitle === lowerQuery) score += 20;
		// Title starts with query gets bonus
		if (lowerTitle.startsWith(lowerQuery)) score += 10;
	}
	
	// Content matches
	const contentMatches = (lowerContent.match(new RegExp(lowerQuery, 'g')) || []).length;
	score += contentMatches * 2;
	
	return score;
}