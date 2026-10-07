<script lang="ts">
  import { ArrowRight } from "@lucide/svelte";
  import { cn, getAssetUrl } from "$lib/utils";

  interface HeroContent {
    title: string;
    subtitle?: string;
    image?: string | { id: string };
    primary_link?: string | { permalink?: string };
    primary_link_text?: string;
  }

  let { content, class: className = "" }: { content: HeroContent, class?: string } = $props();
  
  const imageUrl = getAssetUrl(content.image);
  const primaryLinkHref = $derived.by(() => {
    const primaryLink = content.primary_link;
    if (typeof primaryLink === "string") {
      return /^(https?:\/\/|\/|mailto:|tel:)/.test(primaryLink) ? primaryLink : undefined;
    }

    const permalink = primaryLink?.permalink;
    if (!permalink) return undefined;
    return permalink === "home" ? "/" : `/${permalink}`;
  });
</script>

<section class={cn("min-h-[calc(100vh-6rem)] flex items-center", className)}>
  <div class="max-w-7xl mx-auto px-4 w-full">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl dark:text-white">
          {content.title}
        </h1>
        {#if content.subtitle}
          <div class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            {@html content.subtitle}
          </div>
        {/if}
        <div class="flex flex-wrap gap-4">
          {#if primaryLinkHref && content.primary_link_text}
            <a 
              href={primaryLinkHref}
              class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-radial-[at_50%_50%] from-blue-200 to-indigo-300 hover:from-blue-100 hover:to-indigo-200 rounded-lg transition-colors"
            >
              {content.primary_link_text}
              <ArrowRight class="w-5 h-5" />
            </a>
          {/if}
          <a 
            href="/om-oss" 
            class="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Om MedSimNorge
          </a>
        </div>
      </div>
      <div>
        {#if imageUrl}
          <img src={imageUrl} alt={content.title || ""} class="w-full rounded-lg" />
        {/if}
      </div>
    </div>
  </div>
</section>