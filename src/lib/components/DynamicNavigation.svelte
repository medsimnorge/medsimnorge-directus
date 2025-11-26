<script lang="ts">
	import { Menu, X, ChevronDown } from "@lucide/svelte";

	interface NavItem {
		id: number;
		label: string;
        description?: string;
		href?: string;
		page_href?: { permalink?: string } | string;
		nettverkskonferanse_href?: { permalink?: string } | string;
		parent_item?: number | null;
        is_external?: boolean;
		sort?: number;
	}

	let { navItems = [] }: { navItems: NavItem[] } = $props();

	let mobileMenuOpen = $state(false);
	let openDropdown = $state<number | null>(null);

	// Build navigation tree
	const topLevelItems = navItems.filter(item => !item.parent_item);
	
	console.log('Nav items:', navItems);
	console.log('Top level items:', topLevelItems);
	
	function getChildren(parentId: number): NavItem[] {
		const children = navItems.filter(item => item.parent_item === parentId).sort((a, b) => (a.sort || 0) - (b.sort || 0));
		console.log(`Children for ${parentId}:`, children);
		return children;
	}

	function toggleDropdown(itemId: number) {
		openDropdown = openDropdown === itemId ? null : itemId;
	}

	function closeDropdown() {
		openDropdown = null;
	}

	// Get href with priority: page_href > nettverkskonferanse_href > href
	function getHref(item: NavItem): string {
		if (item.page_href) {
			const permalink = typeof item.page_href === 'string' ? item.page_href : item.page_href.permalink;
			if (permalink === 'home') return '/';
			return permalink ? `/${permalink}` : '#';
		}
		if (item.nettverkskonferanse_href) {
			const permalink = typeof item.nettverkskonferanse_href === 'string' ? item.nettverkskonferanse_href : item.nettverkskonferanse_href.permalink;
			return permalink ? `/nettverkskonferanser/${permalink}` : '#';
		}
		return item.href || '#';
	}
</script>

<!-- Desktop Navigation -->
<nav class="hidden md:block" aria-label="Main navigation">
	<ul class="flex items-center gap-1">
		{#each topLevelItems as item}
			{@const children = getChildren(item.id)}
			
			<li class="relative">
				{#if children.length > 0}
					<!-- Item with dropdown -->
					<button
						class="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onclick={() => toggleDropdown(item.id)}
						onmouseover={() => openDropdown = item.id}
						onfocus={() => openDropdown = item.id}
						aria-expanded={openDropdown === item.id}
						aria-haspopup="true"
					>
						{item.label}
						<ChevronDown class="w-4 h-4" />
					</button>
					
					{#if openDropdown === item.id}
						<div 
							class="absolute left-0 top-full mt-1 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50"
							role="menu"
							tabindex="-1"
							onmouseleave={closeDropdown}
						>
							<ul class="p-2">
								{#each children as child}
									<li>
										<a
											href={getHref(child)}
											target={child.is_external ? '_blank' : undefined}
											rel={child.is_external ? 'noopener noreferrer' : undefined}
											class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
										>
											<div class="font-medium text-gray-900 dark:text-white">
												{child.label}
											</div>
											{#if child.description}
												<div class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
													{@html child.description}
												</div>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{:else}
					<!-- Simple link -->
					<a
						href={getHref(item)}
						target={item.is_external ? '_blank' : undefined}
						rel={item.is_external ? 'noopener noreferrer' : undefined}
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					>
						{item.label}
					</a>
				{/if}
			</li>
		{/each}
	</ul>
</nav>

<!-- Mobile Menu Button -->
<button 
	class="md:hidden p-2 text-gray-700 dark:text-gray-300"
	onclick={() => mobileMenuOpen = !mobileMenuOpen}
	aria-label="Vis/skjul meny"
>
	{#if mobileMenuOpen}
		<X class="w-6 h-6" />
	{:else}
		<Menu class="w-6 h-6" />
	{/if}
</button>

<!-- Mobile Menu -->
{#if mobileMenuOpen}
	<div class="absolute top-20 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 md:hidden z-40">
		<nav class="max-w-7xl mx-auto px-4 py-4">
			{#each topLevelItems as item}
				{@const children = getChildren(item.id)}
				
				<div class="py-2">
					{#if children.length > 0}
						<div class="font-semibold text-gray-900 dark:text-white mb-2">{item.label}</div>
						<ul class="pl-4 space-y-2">
							{#each children as child}
								<li>
									<a 
										href={getHref(child)}
										class="block py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
										onclick={() => mobileMenuOpen = false}
									>
										{child.label}
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<a 
							href={getHref(item)}
							target={item.is_external ? '_blank' : undefined}
							rel={item.is_external ? 'noopener noreferrer' : undefined}
							class="block font-semibold text-gray-900 dark:text-white hover:text-primary"
							onclick={() => mobileMenuOpen = false}
						>
							{item.label}
						</a>
					{/if}
				</div>
			{/each}
		</nav>
	</div>
{/if}