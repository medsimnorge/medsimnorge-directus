<script lang="ts">
	import { ExternalLink as ExternalLinkIcon } from '@lucide/svelte';
	
	let { 
		href, 
		class: className = '',
		children 
	}: { 
		href: string; 
		class?: string;
		children: any;
	} = $props();
</script>

<a 
	{href} 
	target="_blank" 
	rel="noopener noreferrer"
	class={className}
>
	{@render children()}
	<ExternalLinkIcon class="inline-block w-4 h-4 ml-1 -mt-0.5" aria-hidden="true" />
	<span class="sr-only">(åpnes i ny fane)</span>
</a>
