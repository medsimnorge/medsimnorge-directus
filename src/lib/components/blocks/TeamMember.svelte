<script lang="ts">
	import { cn, getAssetUrl } from "$lib/utils";
	import ObfuscatedEmail from "../ObfuscatedEmail.svelte";

	interface TeamMemberContent {
		name: string;
		role?: string;
		bio?: string;
		image?: string;
		email?: string;
		reverse?: boolean;
	}

	let { content, class: className = "" }: { content: TeamMemberContent; class?: string } = $props();

	const imageUrl = getAssetUrl(content.image);
</script>

<article 
	class={cn(
		"flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
		content.reverse && "md:flex-row-reverse",
		className
	)}
>
	{#if imageUrl}
		<div class="md:w-48 flex-shrink-0">
			<img 
				src={imageUrl} 
				alt={content.name}
				class="w-full h-48 md:h-full object-cover"
			/>
		</div>
	{/if}

	<div class="flex-1 p-6">
		<h3 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{content.name}
		</h3>
		
		{#if content.role}
			<p class="mb-3 text-md font-medium text-gray-600 dark:text-gray-400">
				{content.role}
			</p>
		{/if}

		{#if content.bio}
			<div class="mb-4 text-gray-700 dark:text-gray-400 leading-relaxed">
				{@html content.bio}
			</div>
		{/if}

		{#if content.email}
			<div class="flex flex-wrap gap-4 text-sm">
				E-post: <ObfuscatedEmail email={content.email} />
			</div>
		{/if}
	</div>
</article>