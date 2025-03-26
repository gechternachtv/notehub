<script lang="ts">
	import { Body, classList, style } from "svelte-body";

	let classes = "luckygreen";
	let styles = "";
	const themes = [
		"luckygreen",
		"bluesky",
		"plankton",
		"yotsuba",
		"yotsuba-b",
		"yotsuba-c",
		"futaba",
		"dfwm98",
		"fvwm",
		"goldSrc",
		"blood",
		"uboa",
		"pxtone",
		"dark",
	];

	const storedTheme = localStorage.getItem("storedTheme");
	classes = storedTheme ? storedTheme : classes;
	let themeColor = "#235e56";

	$: {
		localStorage.setItem("storedTheme", classes);
		setTimeout(() => {
			themeColor = getComputedStyle(
				document.querySelector("body"),
			).getPropertyValue("--browser-color");
		}, 100);
	}
</script>

<svelte:body use:classList={classes} use:style={styles} />
<svelte:head>
	<meta name="theme-color" content={themeColor} />
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
		font-size: 1.2rem;
		padding: 2px;
		border: 0px;
		background: var(--button-bg);
		color: var(--button-color);
		border-radius: 4px;
		margin: 4px;
		cursor: pointer;
	}

	/* :global(.yotsuba) {
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
		} */

	:global(.yotsuba) {
		--alert: #fb0000;
		--news: #fb0000;
		--complete: #468333;
		--complete-col: #ffeedb;
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
		--browser-color: var(--header-bg);
	}

	:global(.yotsuba-b) {
		--alert: #af0a0f;
		--news: #af0a0f;
		--complete: #468333;
		--complete-col: #ffeedb;
		--header-bg: #98e;
		--main-font-1: #0f0c5d;
		--main-font-2: #0f0c5d;
		--button-bg: #074f2a;
		--button-color: #ffe;
		--header-color: #000;
		--card-bg: #d6daf0;
		--container-bg: #ffe;
		--gradient-col-1: #d1d5ee;
		--gradient-col-2: #ffe;
		--body-background: linear-gradient(
			0deg,
			var(--gradient-col-2) 0%,
			var(--gradient-col-1) 80%
		);
		--board-title-color: var(--header-bg);
		--browser-color: var(--header-bg);
	}

	:global(.yotsuba-c) {
		--alert: #df223b;
		--news: #cb4e16;
		--complete: #58b63b;
		--complete-col: #ffeedb;
		--header-bg: #5c9a45;
		--main-font-2: #000;
		--button-color: #fff;
		--header-color: #fff;
		--gradient-col-2: #f0f0f0;
		--body-background: #f7f7f7;
		--board-title-color: #47bcad;
		--browser-color: var(--header-bg);
		--main-font-1: #5c9a45;
		--button-bg: #0f9998;
		--card-bg: #ebe4cb;
		--container-bg: #f3f0e4;
		--gradient-col-1: #f3f0e4;
	}

	:global(.futaba) {
		--alert: #fb0000;
		--news: #fb0000;
		--complete: #4f923a;
		--complete-col: #ffeedb;
		--header-bg: #800000;
		--main-font-1: #800000;
		--main-font-2: #800000;
		--button-bg: #117743;
		--button-color: #ffe;
		--header-color: white;
		--card-bg: #f8e3ca;
		--container-bg: #fff3e6;
		--gradient-col-1: #fff9f5;
		--gradient-col-2: #fff3e6;
		--body-background: #ffead3;
		--board-title-color: var(--header-bg);
		--browser-color: var(--header-bg);
	}

	:global(.bluesky) {
		--alert: #d3152e;
		--news: #cb4e16;
		--complete: #468333;
		--complete-col: #ffeedb;
		--header-bg: #42a0bd;
		--main-font-2: black;
		--button-bg: #356574;
		--button-color: #fff;
		--header-color: #fff;
		--card-bg: #eee;
		--container-bg: #fafeff;
		--gradient-col-1: #eef2f3;
		--gradient-col-2: #e8e8e8;
		--body-background: linear-gradient(
			0deg,
			var(--gradient-col-2) 0%,
			var(--gradient-col-1) 80%
		);
		--main-font-1: #214049;
		--board-title-color: var(--header-bg);
		--browser-color: var(--header-bg);
	}

	:global(.luckygreen) {
		--alert: #df223b;
		--news: #cb4e16;
		--complete: #468333;
		--complete-col: #ffeedb;
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
		--browser-color: var(--header-bg);
	}

	:global(.uboa) {
		--alert: #d33;
		--news: #d33;
		--complete: #468333;
		--complete-col: #ffeedb;
		--header-bg: #603030;
		--main-font-2: #aaa;
		--button-bg: #168a4f;
		--button-color: white;
		--header-color: #fff;
		--card-bg: #383838;
		--container-bg: #1c1c1c;
		--gradient-col-1: #121212;
		--gradient-col-2: #343434;
		--body-background: #343434;
		--main-font-1: #8080e0;
		--board-title-color: var(--main-font-1);
		--browser-color: var(--header-bg);
	}
	:global(.uboa .new-section, .uboa .container-header-buttons) {
		color: var(--button-color);
	}
	:global(.plankton) {
		--alert: #6bad00;
		--news: #ff2164;
		--complete: #468333;
		--complete-col: #ffeedb;
		--main-font-1: black;
		--main-font-2: black;
		--button-color: #ffe;
		--card-bg: #eaeaea;
		--container-bg: #fff;
		--gradient-col-1: #faf4f4;
		--gradient-col-2: #fff3e6;
		--body-background: url("https://zonaplankton.net/backgrounds/page-pattern-default.png");
		--header-bg: #0394fc;
		--button-bg: #ff2164;
		--header-color: white;
		--board-title-color: var(--header-bg);
		--browser-color: var(--header-bg);
	}

	:global(.pxtone) {
		--alert: #01f080;
		--news: var(--alert);
		--complete: #468333;
		--complete-col: #ffeedb;
		--main-font-1: #d2ca9c;
		--main-font-2: var(--main-font-1);
		--button-color: #0e0e2d;
		--card-bg: #000010;
		--container-bg: #1c1b22;
		--gradient-col-1: #272535;
		--gradient-col-2: #3b3858;
		--body-background: url("https://zonaplankton.net/backgrounds/sidebar-pattern-pxtone.png");
		--header-bg: #0c0c1f;
		--button-bg: #9d9784;
		--header-color: var(--main-font-1);
		--board-title-color: var(--main-font-1);
		--browser-color: #343255;
	}

	:global(.dark) {
		--alert: #01f080;
		--news: var(--alert);
		--complete: #468333;
		--complete-col: #387e4d;
		--main-font-1: #dfdfdf;
		--main-font-2: #e4e4e4;
		--button-color: #000;
		--card-bg: #0d0d0d;
		--container-bg: #202020;
		--gradient-col-1: #0b0b0b;
		--gradient-col-2: #737373;
		--body-background: black;
		--header-bg: #131313;
		--button-bg: #646464;
		--header-color: #d3d3d3;
		--board-title-color: #7e7e7e;
		--browser-color: #131313;
	}

	:global(.blood) {
		--alert: #c50000;
		--news: #f10000;
		--complete: #468333;
		--complete-col: #ffeedb;
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
		--browser-color: var(--header-bg);
	}

	:global(body) {
		background: var(--body-background);
		background-attachment: fixed;
		background-color: var(--gradient-col-1);
	}
	:global(.fvwm) {
		--alert: #fb0000;
		--news: #fb0000;
		--complete: #468333;
		--complete-col: #ffeedb;
		--header-bg: #828776;
		--main-font-1: #262050;
		--main-font-2: #262050;
		--button-bg: #313179;
		--button-color: #dedede;
		--header-color: #353535;
		--card-bg: #8a9393;
		--container-bg: #babbae;
		--gradient-col-1: #47545d;
		--gradient-col-2: #47545d;
		--body-background: #ffead3;
		--board-title-color: #47545d;
		--browser-color: #47545d;
	}
	:global(.dfwm98) {
		--alert: #df223b;
		--news: #cb4e16;
		--complete: #468333;
		--complete-col: #ffeedb;
		--header-color: #fff;
		--card-bg: #efefef;
		--gradient-col-2: #f0f0f0;
		--body-background: #f7f7f7;
		--main-font-1: #214049;
		--header-bg: #0b0c76;
		--button-bg: #0c57af;
		--button-color: white;
		--container-bg: #d7d7d7;
		--gradient-col-1: #007f82;
		--main-font-2: #8c8c8c;
		--board-title-color: #212121;
		--browser-color: #007f82;
	}
	:global(.dfwm98 nav, .dfwm98 .title-container) {
		background: linear-gradient(
			90deg,
			rgba(11, 12, 118, 1) 22%,
			rgba(12, 121, 201, 1) 100%
		) !important;
	}

	:global(.goldSrc) {
		--alert: #96872f;
		--news: #f10000;
		--complete: #61912a;
		--complete-col: #ffeedb;
		--header-bg: #4c5945;
		--main-font-1: #fff;
		--main-font-2: #96872f;
		--button-bg: #939989;
		--button-color: #fff;
		--header-color: #939989;
		--card-bg: #4c5945;
		--container-bg: #252f1c;
		--gradient-col-1: #32392c;
		--gradient-col-2: #b7b7b7;
		--body-background: #606464;
		--board-title-color: #968832;
		--browser-color: var(--header-bg);
	}
	:global(
			.goldSrc .instance-box,
			.goldSrc .card,
			.goldSrc .workspace-card,
			.goldSrc .userbox,
			.goldSrc .btn
		) {
		border-top: 2px solid #67715d;
		border-left: 2px solid #67715d;
		border-bottom: 2px solid #393e34;
		border-right: 2px solid #393e34;
		border-radius: 0px !important;
	}
	:global(.goldSrc .board-header .img-c) {
		border-radius: 3px !important;
	}
	:global(.goldSrc nav) {
		border-bottom: 2px solid #393e34;
	}
</style>
