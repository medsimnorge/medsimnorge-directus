<script lang="ts">
  import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, MegaMenu } from "flowbite-svelte";
  import { ChevronDownOutline } from "flowbite-svelte-icons";
  let menu2 = [
    { name: "Nettverkskonferansen 2026", href: "/nettverkskonferanser/nettverkskonferansen-2026", help: "Nettverkskonferansen 2026 er i Bodø" },
    { name: "Nettverkskonferansen 2025", href: "/nettverkskonferanser/nettverkskonferansen-2025", help: "Besøk Nettverkskonferansen 2025" },
    { name: "Tidligere konferanser", href: "/nettverkskonferanser", help: "Oversikt over tidligere konferanser" },
  ];

  let menu3 = [
    { name: "Generelt", href: "/om-oss", help: "Generell informasjon og hvem som sitter i styringsgruppen" },
    { name: "Historie", href: "/om-oss/historie", help: "MedSimNorges historie" },
    { name: "Mandat",href: "/om-oss/mandat", help: "Vårt mandat" },
    { name: "Vedtekter", href: "/om-oss/vedtekter", help: "Les MedSimNorges vedtekter" },
  ];
</script>

<Navbar class="max-w-7xl mx-auto justify-between">
  <NavBrand href="/">
    <img src="/MedSimNorge-logo.avif" class="me-3 h-9 sm:h-12" alt="MedSimNorge Logo" />
    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">MedSimNorge</span>
  </NavBrand>
  <NavHamburger />
  <NavUl class="ms-auto gap-6 text-lg">
    <NavLi href="/" class="text-foreground">Hjem</NavLi>
    <NavLi class="cursor-pointer">
      Nettverkskonferanser<ChevronDownOutline class="text-foreground ms-2 inline h-6 w-6" />
    </NavLi>
    <MegaMenu items={menu2}>
      {#snippet children({ item })}
        <a href={item.href} class="block h-full rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div class="font-semibold dark:text-white">{item.name}</div>
          <span class="text-sm font-light text-gray-500 dark:text-gray-400">{item.help}</span>
        </a>
      {/snippet}
    </MegaMenu>
    <NavLi class="cursor-pointer">
      Om oss<ChevronDownOutline class="text-foreground ms-2 inline h-6 w-6" />
    </NavLi>
    <MegaMenu items={menu3}>
      {#snippet children({ item })}
        <a href={item.href} class="block h-full rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div class="font-semibold dark:text-white">{item.name}</div>
          <span class="text-sm font-light text-gray-500 dark:text-gray-400">{item.help}</span>
        </a>
      {/snippet}
    </MegaMenu>
    <NavLi href="/kontakt" class="text-foreground">Kontakt oss</NavLi>
  </NavUl>
</Navbar>