<script lang="ts">
	import { onMount } from 'svelte';

	let { 
		email, 
		displayText,
		class: className = "text-primary-800 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors font-semibold"
	}: { 
		email: string; 
		displayText?: string;
		class?: string;
	} = $props();

	let linkElement: HTMLAnchorElement;
	let displayElement: HTMLSpanElement;

	onMount(() => {
		if (linkElement && email) {
			// Set up the real mailto link after component mounts (client-side only)
			linkElement.href = `mailto:${email}`;
		}
		
		if (displayElement && email) {
			// Show the real email address to users after component mounts
			displayElement.textContent = displayText || email;
		}
	});

	function handleClick(event: MouseEvent) {
		event.preventDefault();
		window.location.href = `mailto:${email}`;
	}

	// Split email for obfuscation in HTML source
	const [localPart, domain] = email.split('@');
	const [domainName, tld] = domain?.split('.') || ['', ''];
	
	// Create a safe fallback href
	const fallbackHref = `mailto:${email.replace('@', '%40')}`;
</script>

<a 
	bind:this={linkElement}
	href={fallbackHref}
	onclick={handleClick}
	class={className}
	title="Send e-post"
>
	<span bind:this={displayElement}>
		<!-- Obfuscated in HTML source, but JavaScript will replace with real email -->
		<span style="display:none;">{localPart}</span>
		<span style="display:none;">@</span>
		<span style="display:none;">{domainName}</span>
		<span style="display:none;">.</span>
		<span style="display:none;">{tld}</span>
		<!-- Fallback text for when JavaScript is disabled -->
		<noscript>{displayText || email}</noscript>
	</span>
</a>