<script lang="ts">
	import DynamicNavigation from "./DynamicNavigation.svelte";
	import SearchBox from "./SearchBox.svelte";

	interface NavItem {
		id: number;
		title: string;
		url?: string;
		parent_item?: number | null;
		sort?: number;
	}

	let { navItems = [] }: { navItems: NavItem[] } = $props();
</script>

<header class="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4">
		<div class="flex items-center justify-between h-20 gap-4">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-3 flex-shrink-0">
				<img src="/MedSimNorge-logo.avif" alt="MedSimNorge Logo" class="h-12 w-12" />
				<span class="text-xl font-bold text-gray-900 dark:text-white">MedSimNorge</span>
			</a>

			<!-- Search Box (hidden on mobile) -->
			<div class="hidden md:block flex-1 max-w-md mx-4">
				<SearchBox placeholder="Søk..." />
			</div>

			<!-- Dynamic Navigation -->
			<DynamicNavigation {navItems} />
		</div>
		
		<!-- Mobile Search (shown on mobile) -->
		<div class="md:hidden pb-4">
			<SearchBox placeholder="Søk..." />
		</div>
	</div>
</header>