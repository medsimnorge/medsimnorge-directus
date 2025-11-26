<script lang="ts">
	import { cn } from "$lib/utils";

	let { content = "", class: className = "" }: { content?: string; class?: string } = $props();
</script>

<div class={cn("prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal", className)}>
	{@html content}
</div>