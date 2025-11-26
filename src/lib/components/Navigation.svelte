<script lang="ts">
 import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
 import { cn } from "$lib/utils.js";
 import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
 import type { HTMLAttributes } from "svelte/elements";
  
 type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
  title: string;
  href: string;
  content: string;
 };
</script>
 
{#snippet ListItem({
 title,
 content,
 href,
 class: className,
 ...restProps
}: ListItemProps)}
 <li>
  <NavigationMenu.Link>
   {#snippet child()}
    <a
     {href}
     class={cn(
      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
      className
     )}
     {...restProps}
    >
     <div class="text-sm font-medium leading-none">{title}</div>
     <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
      {content}
     </p>
    </a>
   {/snippet}
  </NavigationMenu.Link>
 </li>
{/snippet}
 
<NavigationMenu.Root viewport={false}>
    <NavigationMenu.List>
        <NavigationMenu.Item>
            <NavigationMenu.Link>
                {#snippet child()}
                    <a href="/" class={navigationMenuTriggerStyle()}>Hjem</a>
                {/snippet}
            </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
            <NavigationMenu.Trigger>Nettverkskonferanser</NavigationMenu.Trigger>
            <NavigationMenu.Content>
                <ul class="grid w-[300px] gap-4 p-2">
                    <li>
                        <NavigationMenu.Link href="/nettverkskonferanser">
                            <div class="font-medium">Alle nettverkskonferanser</div>
                            <div class="text-muted-foreground">
                                Liste over alle tidligere nettverkskonferanser
                            </div>
                        </NavigationMenu.Link>
                        
                        <NavigationMenu.Link href="/nettverkskonferanser/nettverkskonferansen-2026">
                            <div class="font-medium">Nettverkskonferansen 2026</div>
                            <div class="text-muted-foreground">
                                Arrangeres i Bod&oslash;
                            </div>
                        </NavigationMenu.Link>
                        
                        <NavigationMenu.Link href="/nettverkskonferanser/nettverkskonferansen-2025">
                            <div class="font-medium">Nettverkskonferansen 2025</div>
                            <div class="text-muted-foreground">
                                Ble arrangert i Hamar
                            </div>
                        </NavigationMenu.Link>
                    </li>
                </ul>
            </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
            <NavigationMenu.Trigger>Om oss</NavigationMenu.Trigger>
            <NavigationMenu.Content>
                <ul class="grid w-[300px] gap-4 p-2">
                    <li>
                        <NavigationMenu.Link href="/om-oss">
                            <div class="font-medium">Om MedSimNorge</div>
                            <div class="text-muted-foreground">
                                Hvem sitter i styringsgruppen
                            </div>
                        </NavigationMenu.Link>

                        <hr class="border-b-2 border-blue-50">

                        <NavigationMenu.Link href="/om-oss/historie">
                            <div class="font-medium">Historie</div>
                            <div class="text-muted-foreground">
                                Historien om hvordan MedSimNorge ble til
                            </div>
                        </NavigationMenu.Link>
                        
                        <NavigationMenu.Link href="/om-oss/vedtekter">
                            <div class="font-medium">Vedtekter</div>
                            <div class="text-muted-foreground">
                                V&aring;re vedtekter
                            </div>
                        </NavigationMenu.Link>
                        
                        <NavigationMenu.Link href="/om-oss/mandat">
                            <div class="font-medium">Mandat</div>
                            <div class="text-muted-foreground">
                                V&aring;rt mandat
                            </div>
                        </NavigationMenu.Link>
                    </li>
                </ul>
            </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
            <NavigationMenu.Link>
                {#snippet child()}
                    <a href="/kontakt" class={navigationMenuTriggerStyle()}>Kontakt</a>
                {/snippet}
            </NavigationMenu.Link>
        </NavigationMenu.Item>
    </NavigationMenu.List>
</NavigationMenu.Root>