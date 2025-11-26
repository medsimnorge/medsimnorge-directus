<script lang="ts">
	import RichText from "$lib/components/blocks/RichText.svelte";
    import HeroWithImage from "$lib/components/blocks/HeroWithImage.svelte";
	import TeamMember from "$lib/components/blocks/TeamMember.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.page.title || 'MedSimNorge'}</title>
	{#if data.page.meta_description}
		<meta name="description" content={data.page.meta_description} />
	{/if}
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-12">
	{#if data.page.title && data.page.show_title}
		<h1 class="text-4xl font-bold mb-8 dark:text-white">{data.page.title}</h1>
	{/if}

	{#if data.page.blocks && data.page.blocks.length > 0}
		<div class="space-y-8">
			{#each data.page.blocks as block}
                {#if block.collection === 'block_herowithimage'}
					<HeroWithImage content={block.item} />
				{/if}
				{#if block.collection === 'block_richtext'}
					<RichText content={block.item.content} />
				{/if}
				{#if block.collection === 'block_teammember'}
					<TeamMember content={block.item} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
