<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    import "emoji-picker-element";

    let picmoEl;
    export let allowcuston = false;

    const dispatch = createEventDispatcher();
    let emojipicker;

    onMount(() => {
        if (allowcuston) {
            emojipicker.customEmoji = [
                {
                    name: "Very Happy",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_biggrin.png",
                    category: "Smiley",
                },
                {
                    name: "Smile",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_smile.gif",
                    category: "Smiley",
                },
                {
                    name: "Sad",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_sad.gif",
                    category: "Smiley",
                },
                {
                    name: "Surprised",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_surprised.gif",
                    category: "Smiley",
                },
                {
                    name: "Shocked",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_eek.gif",
                    category: "Smiley",
                },
                {
                    name: "Cool",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_cool.gif",
                    category: "Smiley",
                },
                {
                    name: "Laughing",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_lol.gif",
                    category: "Smiley",
                },
                {
                    name: "Mad",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_mad.gif",
                    category: "Smiley",
                },
                {
                    name: "Razz",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_razz.gif",
                    category: "Smiley",
                },
                {
                    name: "Embarassed",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_redface.gif",
                    category: "Smiley",
                },
                {
                    name: "Crying or Very sad",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_cry.gif",
                    category: "Smiley",
                },
                {
                    name: "Evil or Very Mad",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_evil.gif",
                    category: "Smiley",
                },
                {
                    name: "Twisted Evil",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_twisted.gif",
                    category: "Smiley",
                },
                {
                    name: "Rolling Eyes",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_rolleyes.gif",
                    category: "Smiley",
                },
                {
                    name: "Wink",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_wink.gif",
                    category: "Smiley",
                },
                {
                    name: "Exclamation",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_exclaim.gif",
                    category: "Smiley",
                },
                {
                    name: "Question",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_question.gif",
                    category: "Smiley",
                },
                {
                    name: "Idea",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_idea.png",
                    category: "Smiley",
                },
                {
                    name: "Arrow",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_arrow.gif",
                    category: "Smiley",
                },
                {
                    name: "Neutral",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_neutral.gif",
                    category: "Smiley",
                },
                {
                    name: "What a Face",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/fresse.png",
                    category: "Smiley",
                },
                {
                    name: "Like a Star @ heaven",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/star3.png",
                    category: "Smiley",
                },
                {
                    name: "Suspect",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/suspect.gif",
                    category: "Smiley",
                },
                {
                    name: "I love you",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/herz.png",
                    category: "Smiley",
                },
                {
                    name: "No",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/kopfschuettel.gif",
                    category: "Smiley",
                },
                {
                    name: "@",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/at.png",
                    category: "Smiley",
                },
                {
                    name: "cyclops",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_cyclops.gif",
                    category: "Smiley",
                },
                {
                    name: "clown",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_clown.png",
                    category: "Smiley",
                },
                {
                    name: "pirat",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_pirat.png",
                    category: "Smiley",
                },
                {
                    name: "tongue",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_tongue.png",
                    category: "Smiley",
                },
                {
                    name: "silent",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_silent.png",
                    category: "Smiley",
                },
                {
                    name: "pale",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_pale.gif",
                    category: "Smiley",
                },
                {
                    name: "alien",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/alien.png",
                    category: "Smiley",
                },
                {
                    name: "cat",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_cat.png",
                    category: "Smiley",
                },
                {
                    name: "monkey",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_monkey.png",
                    category: "Smiley",
                },
                {
                    name: "pig",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_porc.png",
                    category: "Smiley",
                },
                {
                    name: "rabbit",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_rabbit.png",
                    category: "Smiley",
                },
                {
                    name: "bounce",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_bounce.gif",
                    category: "Smiley",
                },
                {
                    name: "confused",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/confused.png",
                    category: "Smiley",
                },
                {
                    name: "affraid",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/affraid.gif",
                    category: "Smiley",
                },
                {
                    name: "Basketball",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_basketball.gif",
                    category: "Smiley",
                },
                {
                    name: "cheers",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_cheers.png",
                    category: "Smiley",
                },
                {
                    name: "bom",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/bom.png",
                    category: "Smiley",
                },
                {
                    name: "drunken",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/drunken_smilie.png",
                    category: "Smiley",
                },
                {
                    name: "Sleep",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/sleep.gif",
                    category: "Smiley",
                },
                {
                    name: "sunny",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_sunny.png",
                    category: "Smiley",
                },
                {
                    name: "albino",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_albino.png",
                    category: "Smiley",
                },
                {
                    name: "cherry",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_cherry.png",
                    category: "Smiley",
                },
                {
                    name: "santa",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_santa.png",
                    category: "Smiley",
                },
                {
                    name: "rendeer",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_rendeer.png",
                    category: "Smiley",
                },
                {
                    name: "farao",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_farao.png",
                    category: "Smiley",
                },
                {
                    name: "king",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_king.png",
                    category: "Smiley",
                },
                {
                    name: "queen",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_queen.png",
                    category: "Smiley",
                },
                {
                    name: "jocolor",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_jokercolor.png",
                    category: "Smiley",
                },
                {
                    name: "geek",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_geek.png",
                    category: "Smiley",
                },
                {
                    name: "scratch",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_scratch.png",
                    category: "Smiley",
                },
                {
                    name: "study",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_study.png",
                    category: "Smiley",
                },
                {
                    name: "elephant",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_elephant.png",
                    category: "Smiley",
                },
                {
                    name: "flower",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_flower.png",
                    category: "Smiley",
                },
                {
                    name: "afro",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/icon_rr.png",
                    category: "Smiley",
                },
                {
                    name: "lol!",
                    shortcodes: ["smiley"],
                    url: "https://illiweb.com/fa/i/smiles/lol.gif",
                    category: "Smiley",
                },
                {
                    name: "veryyy happy",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/354459.gif",
                    category: "Smiley",
                },
                {
                    name: "love",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2389593522.gif",
                    category: "Smiley",
                },
                {
                    name: ":ET:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3495479568.gif",
                    category: "Smiley",
                },
                {
                    name: ":robo:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2605604870.gif",
                    category: "Smiley",
                },
                {
                    name: ":beleza:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2257166422.gif",
                    category: "Smiley",
                },
                {
                    name: ":00:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2213793032.gif",
                    category: "Smiley",
                },
                {
                    name: ":01:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2598960201.gif",
                    category: "Smiley",
                },
                {
                    name: ":02:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2982522762.gif",
                    category: "Smiley",
                },
                {
                    name: ":03:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2833161931.gif",
                    category: "Smiley",
                },
                {
                    name: ":04:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3885959180.gif",
                    category: "Smiley",
                },
                {
                    name: ":05:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/4270078285.gif",
                    category: "Smiley",
                },
                {
                    name: ":06:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3584649870.gif",
                    category: "Smiley",
                },
                {
                    name: ":08:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1261061888.gif",
                    category: "Smiley",
                },
                {
                    name: ":09:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1378973249.gif",
                    category: "Smiley",
                },
                {
                    name: ":10:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2184292159.gif",
                    category: "Smiley",
                },
                {
                    name: ":11:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2603259518.gif",
                    category: "Smiley",
                },
                {
                    name: ":12:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2953299389.gif",
                    category: "Smiley",
                },
                {
                    name: ":13:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2837247228.gif",
                    category: "Smiley",
                },
                {
                    name: ":14:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3864879675.gif",
                    category: "Smiley",
                },
                {
                    name: ":16:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3563782329.gif",
                    category: "Smiley",
                },
                {
                    name: ":17:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3446682104.gif",
                    category: "Smiley",
                },
                {
                    name: ":19:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1408441462.gif",
                    category: "Smiley",
                },
                {
                    name: ":20:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2155288934.gif",
                    category: "Smiley",
                },
                {
                    name: ":21:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2574002215.gif",
                    category: "Smiley",
                },
                {
                    name: ":22:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2990636004.gif",
                    category: "Smiley",
                },
                {
                    name: ":23:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2874821285.gif",
                    category: "Smiley",
                },
                {
                    name: ":24:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3827031138.gif",
                    category: "Smiley",
                },
                {
                    name: ":25:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/4244696355.gif",
                    category: "Smiley",
                },
                {
                    name: ":26:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3593322208.gif",
                    category: "Smiley",
                },
                {
                    name: ":27:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3476459425.gif",
                    category: "Smiley",
                },
                {
                    name: ":28:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1219400558.gif",
                    category: "Smiley",
                },
                {
                    name: ":29:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1370858031.gif",
                    category: "Smiley",
                },
                {
                    name: ":30:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2176152401.gif",
                    category: "Smiley",
                },
                {
                    name: ":31:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2561557008.gif",
                    category: "Smiley",
                },
                {
                    name: ":32:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3011711443.gif",
                    category: "Smiley",
                },
                {
                    name: ":33:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2862096530.gif",
                    category: "Smiley",
                },
                {
                    name: ":34:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3856250453.gif",
                    category: "Smiley",
                },
                {
                    name: ":35:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/4240606996.gif",
                    category: "Smiley",
                },
                {
                    name: ":36:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3622819031.gif",
                    category: "Smiley",
                },
                {
                    name: ":37:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3472156054.gif",
                    category: "Smiley",
                },
                {
                    name: ":38:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1231878489.gif",
                    category: "Smiley",
                },
                {
                    name: ":39:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1350027288.gif",
                    category: "Smiley",
                },
                {
                    name: ":40:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2231002580.gif",
                    category: "Smiley",
                },
                {
                    name: ":41:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2648790165.gif",
                    category: "Smiley",
                },
                {
                    name: ":42:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3066824534.gif",
                    category: "Smiley",
                },
                {
                    name: ":43:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2950116887.gif",
                    category: "Smiley",
                },
                {
                    name: ":44:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3767967952.gif",
                    category: "Smiley",
                },
                {
                    name: ":45:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/4186804625.gif",
                    category: "Smiley",
                },
                {
                    name: ":46:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3533750866.gif",
                    category: "Smiley",
                },
                {
                    name: ":47:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3418092307.gif",
                    category: "Smiley",
                },
                {
                    name: ":48:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1277423580.gif",
                    category: "Smiley",
                },
                {
                    name: ":49:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1429790365.gif",
                    category: "Smiley",
                },
                {
                    name: ":50:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2235043811.gif",
                    category: "Smiley",
                },
                {
                    name: ":51:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/2619555490.gif",
                    category: "Smiley",
                },
                {
                    name: ":52:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3071176033.gif",
                    category: "Smiley",
                },
                {
                    name: ":56:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3546458213.gif",
                    category: "Smiley",
                },
                {
                    name: ":57:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/3396966692.gif",
                    category: "Smiley",
                },
                {
                    name: ":58:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1306625515.gif",
                    category: "Smiley",
                },
                {
                    name: ":59:",
                    shortcodes: ["smiley"],
                    url: "https://2img.net/u/2615/11/13/86/smiles/1425716394.gif",
                    category: "Smiley",
                },
            ];
        }

        emojipicker.addEventListener("emoji-click", (event) => {
            console.log(event);
            dispatch("emojiselect", event.detail);
        });
    });
</script>

<main>
    <emoji-picker bind:this={emojipicker}></emoji-picker>
</main>

<style>
    .picmo {
        position: absolute;
        z-index: 99;
    }
</style>
