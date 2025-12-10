<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { 
		placeholder = "Søk på siden...",
		class: className = ""
	}: { 
		placeholder?: string;
		class?: string;
	} = $props();

	let searchInput = $state('');
	let suggestions = $state<any[]>([]);
	let showSuggestions = $state(false);
	let isLoading = $state(false);
	let searchTimeout: number;
	let searchBoxRef: HTMLDivElement;

	// Debounced search for suggestions
	$effect(() => {
		if (searchInput.length >= 2) {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(async () => {
				await fetchSuggestions();
			}, 300);
		} else {
			suggestions = [];
			showSuggestions = false;
		}
	});

	async function fetchSuggestions() {
		if (searchInput.length < 2) return;
		
		isLoading = true;
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchInput)}`);
			const data = await response.json();
			suggestions = data.results.slice(0, 5); // Show max 5 suggestions
			showSuggestions = suggestions.length > 0;
		} catch (error) {
			console.error('Search suggestions failed:', error);
			suggestions = [];
			showSuggestions = false;
		} finally {
			isLoading = false;
		}
	}

	function handleSearch(event?: Event) {
		event?.preventDefault();
		if (searchInput.trim()) {
			goto(`/search?q=${encodeURIComponent(searchInput.trim())}`);
			showSuggestions = false;
		}
	}

	function selectSuggestion(suggestion: any) {
		goto(suggestion.url);
		showSuggestions = false;
		searchInput = '';
	}

	function clearSearch() {
		searchInput = '';
		suggestions = [];
		showSuggestions = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showSuggestions = false;
		}
	}

	// Close suggestions when clicking outside
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (searchBoxRef && !searchBoxRef.contains(event.target as Node)) {
				showSuggestions = false;
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div bind:this={searchBoxRef} class="relative {className}">
	<form onsubmit={handleSearch} class="relative" id="search">
		<div class="relative">
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
			<input
				bind:value={searchInput}
				onkeydown={handleKeydown}
				type="search"
				{placeholder}
				aria-label="Søk på nettsiden"
				class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				autocomplete="off"
			/>
			{#if searchInput}
				<button
					type="button"
					onclick={clearSearch}
					class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
				>
					<X class="w-4 h-4" />
				</button>
			{/if}
		</div>
	</form>

	<!-- Suggestions dropdown -->
	{#if showSuggestions}
		<div class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
			{#if isLoading}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">
					Søker...
				</div>
			{:else if suggestions.length > 0}
				<ul class="py-2">
					{#each suggestions as suggestion}
						<li>
							<button
								type="button"
								onclick={() => selectSuggestion(suggestion)}
								class="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none"
							>
								<div class="font-medium text-gray-900 dark:text-white">
									{suggestion.title}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 capitalize">
									{suggestion.type === 'nettverkskonferanse' ? 'Nettverkskonferanse' : 'Side'}
								</div>
								{#if suggestion.excerpt}
									<div class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
										{suggestion.excerpt}
									</div>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
				<div class="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
					<button
						type="button"
						onclick={handleSearch}
						class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
					>
						Se alle resultater for "{searchInput}"
					</button>
				</div>
			{:else}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">
					Ingen resultater funnet
				</div>
			{/if}
		</div>
	{/if}
</div>