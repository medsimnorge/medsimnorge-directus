<script lang="ts">
	import { cn, enhanceExternalLinks, obfuscateEmailsInHtml } from "$lib/utils";

	let { content = "", class: className = "" }: { content?: string; class?: string } = $props();
	
	// Enhance content with accessibility features and email obfuscation
	const enhancedContent = $derived(
		obfuscateEmailsInHtml(enhanceExternalLinks(content))
	);
</script>

<div class={cn("prose prose-lg dark:prose-invert max-w-none", className)}>
	{@html enhancedContent}
</div>