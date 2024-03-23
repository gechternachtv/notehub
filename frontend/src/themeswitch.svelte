<script lang="ts">
    	import { Body, classList, style } from 'svelte-body';

let classes = 'luckygreen';
let styles = '';
const themes = ["luckygreen","bluesky","plankton","yotsuba-nograd","yotsuba","yotsuba-b","nograd","blood","uboa","pxtone"]

const storedTheme = localStorage.getItem("storedTheme");
classes = storedTheme ? storedTheme : classes
let themeColor = "#235e56"

$:{
	localStorage.setItem("storedTheme",classes);
	setTimeout(()=>{
		themeColor = getComputedStyle(document.querySelector("body")).getPropertyValue('--header-bg')
	},100)
	
}

</script>

<svelte:body use:classList={classes} use:style={styles} />
<svelte:head>
	<meta name="theme-color" content="{themeColor}" />
</svelte:head>


    <select bind:value={classes}>
        {#each themes as theme}
            <option value={theme}>
                {theme}
            </option>
        {/each}
    </select>


<style>
	select {
		font-size: 1.1rem;
		padding: 2px;
		border:0px;
		background:var(--button-bg);
		color:var(--button-color);
		border-radius: 4px;
		margin: 4px;
		cursor: pointer;
	}








:global(.yotsuba) {
			--alert:#fb0000;
			--news:#fb0000;
			--header-bg: #e04001;
			--main-font-1: #800000;
			--main-font-2: #800000;
			--button-bg:#800000;
			--button-color:#ffffee;
			--header-color:#ffffee;
			--card-bg: #f0e0d6;
			--container-bg:#ffffee;
			--gradient-col-1:#fed6af;
			--gradient-col-2:#ffffee;
			--body-background:linear-gradient(0deg, var(--gradient-col-2) 0%, var(--gradient-col-1) 80%);
			--board-title-color: var(--header-bg);
		}

		:global(.yotsuba-nograd) {
			--alert: #fb0000;
			--news: #fb0000;
			--header-bg: #e04001;
			--main-font-1: #800000;
			--main-font-2: #800000;
			--button-bg: #800000;
			--button-color: #ffe;
			--header-color: #ffe;
			--card-bg: #f0e0d6;
			--container-bg: #fff8f0;
			--gradient-col-1: #ffe6cc;
			--gradient-col-2: #fff3e6;
			--body-background: #ffeedb;
			--board-title-color: var(--header-bg);
		}

		:global(.yotsuba-b) {
			--alert: #AF0A0F;
			--news: #AF0A0F;
			--header-bg: #98e;
			--main-font-1: #0F0C5D;
			--main-font-2: #0F0C5D;
			--button-bg: #074f2a;
			--button-color: #ffe;
			--header-color: #000;
			--card-bg: #D6DAF0;
			--container-bg: #ffe;
			--gradient-col-1: #d1d5ee;
			--gradient-col-2: #ffe;
			--body-background: linear-gradient(0deg, var(--gradient-col-2) 0%, var(--gradient-col-1) 80%);
			--board-title-color: var(--header-bg);
			}

			:global(.nograd) {
				--alert: #fb0000;
				--news: #fb0000;
				--header-bg: #800000;
				--main-font-1: #800000;
				--main-font-2: #800000;
				--button-bg: #117743;
				--button-color: #ffe;
				--header-color: white;
				--card-bg: #f0e0d6;
				--container-bg: #fff3e6;
				--gradient-col-1: #f1e1cf;
				--gradient-col-2: #fff3e6;
				--body-background: #ffead3;
				--board-title-color: var(--header-bg);
			}

			:global(.bluesky) {
				--alert: #d3152e;
				--news: #cb4e16;
				--header-bg: #42a0bd;
				--main-font-2: black;
				--button-bg: #428194;
				--button-color: #fff;
				--header-color: #fff;
				--card-bg: #eee;
				--container-bg: #fafeff;
				--gradient-col-1: #eef2f3;
				--gradient-col-2: #e8e8e8;
				--body-background: linear-gradient(0deg, var(--gradient-col-2) 0%, var(--gradient-col-1) 80%);
				--main-font-1: #214049;
				--board-title-color: var(--header-bg);
			}

			:global(.luckygreen) {
				--alert: #df223b;
				--news: #cb4e16;
				--header-bg: #36a68c;
				--main-font-2: #000;
				--button-bg: #235e56;
				--button-color: #fff;
				--header-color: #fff;
				--card-bg: #efefef;
				--container-bg: #fff;
				--gradient-col-1: #f0f0f0;
				--gradient-col-2: #f0f0f0;
				--body-background: #f7f7f7;
				--main-font-1: #214049;
				--board-title-color: #47bcad;
				}

			:global(.uboa) {
				--alert: #D33;
				--news: #D33;
				--header-bg: #603030;
				--main-font-2: #AAA;
				--button-bg: #168a4f;
				--button-color: white;
				--header-color: #fff;
				--card-bg: #383838;
				--container-bg: #1c1c1c;
				--gradient-col-1: #121212;
				--gradient-col-2: #343434;
				--body-background: #343434;
				--main-font-1: #8080E0;
				--board-title-color: var(--main-font-1);
			}
			:global(.plankton) {
				--alert: #FF2164;
				--news: #FF2164;
				--main-font-1: black;
				--main-font-2: black;
				--button-color: #ffe;
				--card-bg: #eaeaea;
				--container-bg: #fff;;
				--gradient-col-1: #faf4f4;
				--gradient-col-2: #fff3e6;
				--body-background: url('https://zonaplankton.net/backgrounds/page-pattern-default.png');
				--header-bg: #0394fc;
				--button-bg: #FF2164;
				--header-color: white;
				--board-title-color: var(--header-bg);
							}

				:global(.pxtone) {
				--alert: #01F080;
				--news: var(--alert);
				--main-font-1: #D2CA9C;
				--main-font-2: var(--main-font-1);
				--button-color: #1c1b22;
				--card-bg: #000010;
				--container-bg: #1c1b22;
				--gradient-col-1: #272535;
				--gradient-col-2: #3b3858;
				--body-background: url('https://zonaplankton.net/backgrounds/sidebar-pattern-pxtone.png');
				--header-bg: #000010;
				--button-bg: var(--main-font-1);
				--header-color: var(--main-font-1);
				--board-title-color: var(--main-font-1);
							}
			:global(.uboa .new-section, .uboa .container-header-buttons) {
				color: var(--button-color);
			}


			:global(.blood) {
				--alert: #c50000;
				--news: #f10000;
				--header-bg: #3a0707;
				--main-font-1: #0a0a0a;
				--main-font-2: #0a0a0a;
				--button-bg: #5e0c0c;
				--button-color: #fff;
				--header-color: #bdacac;
				--card-bg: #5c6060;
				--container-bg: #7e7e7e;
				--gradient-col-1: #a8a8a8;
				--gradient-col-2: #b7b7b7;
				--body-background: #606464;
				--board-title-color: var(--header-bg);
			}

	:global(body) {
			background: var(--body-background);
			background-attachment: fixed;
			background-color: var(--gradient-col-1);
		}
</style>