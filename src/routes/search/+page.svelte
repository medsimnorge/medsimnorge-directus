<script lang="ts">
	import { Search } from '@lucide/svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function highlightText(text: string, query: string): string {
		if (!query || !text) return text;
		
		const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
	}
</script>

<svelte:head>
	<title>Søk{data.query ? ` - ${data.query}` : ''} | MedSimNorge</title>
	<meta name="description" content="Søk gjennom MedSimNorges innhold" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<!-- Search header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
			Søk
		</h1>
		
		<!-- Search box -->
		<SearchBox class="max-w-2xl" />
	</div>

	<!-- Search results -->
	{#if data.query}
		<div class="mb-6">
			<p class="text-gray-600 dark:text-gray-400">
				{#if data.total > 0}
					Fant <strong>{data.total}</strong> resultat{data.total !== 1 ? 'er' : ''} for "<strong>{data.query}</strong>"
				{:else}
					Ingen resultater funnet for "<strong>{data.query}</strong>"
				{/if}
			</p>
		</div>

		{#if data.results.length > 0}
			<div class="space-y-6">
				{#each data.results as result}
					<article class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
						<div class="flex items-start justify-between mb-2">
							<div class="flex-1">
								<h2 class="text-xl font-semibold mb-2">
									<a 
										href={result.url}
										class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
									>
										{@html highlightText(result.title, data.query)}
									</a>
								</h2>
								
								<div class="flex items-center gap-2 mb-3">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
										{result.type === 'nettverkskonferanse' ? 'Nettverkskonferanse' : 'Side'}
									</span>
									<span class="text-sm text-gray-500 dark:text-gray-400">
										{result.url}
									</span>
								</div>

								{#if result.excerpt}
									<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
										{@html highlightText(result.excerpt, data.query)}
									</p>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else if data.query}
			<!-- No results -->
			<div class="text-center py-12">
				<Search class="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					Ingen resultater funnet
				</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-6">
					Prøv å søke med andre ord eller sjekk stavemåten.
				</p>
				
				<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
					<h3 class="font-medium text-gray-900 dark:text-white mb-3">Søketips:</h3>
					<ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
						<li>• Bruk færre eller andre søkeord</li>
						<li>• Sjekk stavemåten</li>
						<li>• Prøv mer generelle termer</li>
						<li>• Bruk synonymer</li>
					</ul>
				</div>
			</div>
		{/if}
	{:else}
		<!-- No search query -->
		<div class="text-center py-12">
			<Search class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
				Søk gjennom innholdet
			</h2>
			<p class="text-gray-600 dark:text-gray-400">
				Skriv inn søkeord i feltet over for å finne innhold på MedSimNorge.
			</p>
		</div>
	{/if}
</div>