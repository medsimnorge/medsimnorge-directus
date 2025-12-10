<script lang="ts">
	import { cn, enhanceExternalLinks } from "$lib/utils";

	let { content = "", class: className = "" }: { content?: string; class?: string } = $props();
	
	// Enhance content with accessibility features
	const enhancedContent = $derived(enhanceExternalLinks(content));
</script>

<div class={cn("prose prose-lg dark:prose-invert max-w-none", className)}>
	{@html enhancedContent}
</div>