<script lang="ts">
  interface SiteSettings {
    name?: string;
    description?: string;
  }

  let { siteSettings = null }: { siteSettings: SiteSettings | null } = $props();
</script>

<footer class="bg-blue-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
  <div class="mx-auto max-w-7xl px-4 pt-12 pb-6">
    <div class="text-center">
      <!-- Logo and Site Name -->
      <a href="/" class="inline-flex items-center gap-3 text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        <img src="/MedSimNorge-logo.avif" alt="MedSimNorge Logo" class="h-12 w-12" />
        <span>{siteSettings?.name || 'MedSimNorge'}</span>
      </a>

      <!-- Description -->
      {#if siteSettings?.description}
        <div class="my-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {@html siteSettings.description}
        </div>
      {/if}

      <!-- Navigation Links -->
      <nav class="mb-4">
        <ul class="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-gray-900 dark:text-white">
          <li>
            <a href="/om-oss" class="hover:underline hover:text-primary transition-colors">
              Om oss
            </a>
          </li>
          <li>
            <a href="/nettverkskonferanser" class="hover:underline hover:text-primary transition-colors">
              Nettverkskonferanser
            </a>
          </li>
          <li>
            <a href="/kontakt" class="hover:underline hover:text-primary transition-colors">
              Kontakt oss
            </a>
          </li>
          <li>
            <a href="/personvern" class="hover:underline hover:text-primary transition-colors">
              Personvernerkl&aelig;ring
            </a>
          </li>
        </ul>
      </nav>

      <!-- Copyright -->
      <p class="text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} 
        <a href="/" class="hover:underline hover:text-primary transition-colors">
          {siteSettings?.name || 'MedSimNorge'}
        </a>. 
        Hjemmeside av 
        <a 
          href="https://www.mediweb.no" 
          target="_blank" 
          rel="noopener noreferrer"
          class="hover:underline hover:text-primary transition-colors"
        >
          MediWeb Solutions
        </a>
      </p>
    </div>
  </div>
</footer>