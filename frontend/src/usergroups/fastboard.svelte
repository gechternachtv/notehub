<script>
    import { localToken, server } from "../stores.js";
</script>

<main>
    {#if $localToken.model?.default_board}
        <div
            class="bannercontainer"
            style="background-color:transparent; --bgbannerimg: url('{$server.url}/api/files/_pb_users_auth_/{$localToken
                .model.id}/{$localToken?.model.banner_img}')"
        >
            <a href="#/board/{$localToken.model.default_board}"> </a>
        </div>
    {:else}
        <div class="bannercontainer">
            <a href="#/account"> </a>
        </div>
    {/if}
</main>

<style>
    main {
        height: 100%;
        border-radius: 10px;
        overflow: hidden;
        min-height: 80px;
    }
    .bannercontainer {
        background: var(--menu-bg);
        background-image: var(--bgbannerimg);
        background-size: cover;
        background-position: center;
        height: 100%;
        width: 100%;
    }

    a {
        height: 100%;
        width: 100%;
        display: block;
    }
</style>
