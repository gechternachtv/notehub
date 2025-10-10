<script>
    import { server } from "../stores";
    export let usergroup;

    // let showfull = true;

    const getPublictext = {
        private: { text: "🔒 private" },
        view: { text: " 👁️ public" },
        "global-view": { text: "🌐 global | cannot edit" },
        "public-post": { text: " 🔓 open to post cards" },
    };
</script>

<main class="instance-box">
    <div class="title-container">
        <div class="title-subcontainer">
            <!-- <h1><a href="/#/usergroup/{usergroup.id}">{usergroup.name}</a></h1> -->
            <!-- <button
            class="minimizebtn"
            on:click={() => {
                showfull = !showfull;
            }}
        >
            {#if showfull}
                -
            {:else}
                +
            {/if}
        </button> -->
        </div>
        <div class="public">{getPublictext[usergroup.public].text}</div>
        <div>
            {#if usergroup.expand?.users}
                <div class="users-container">
                    {#each usergroup.expand.users as user}
                        <div
                            class="userbox"
                            class:owner={usergroup.owner === user.id}
                        >
                            <div class="navavatar">
                                <img
                                    loading="lazy"
                                    src="{$server.url}/api/files/_pb_users_auth_/{user.id}/{user.avatar}?thumb=25x25"
                                />
                            </div>
                            {user.name}

                            {#if usergroup.owner === user.id}
                                <span
                                    title="user group admin"
                                    class="workspace-admin"
                                >
                                    ⚙
                                </span>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <div class="instancebox">
        <!-- {console.log(instance)} -->
        <div class="morebutton-container">
            <div class="morebutton-border">
                <a class="morebutton" href="#/usergroup/{usergroup.id}"
                    >more →</a
                >
            </div>
        </div>
        <slot></slot>
        <div class="controls">
            <!-- <a class="btn" href="/#/usergroup/{instance.id}">full view</a> -->
            <!-- <a class="btn" href="/#/workspaces/{instance.id}">workspaces</a>
        <a class="btn" href="/#/allboards/{instance.id}">boards</a> -->
        </div>
    </div>
</main>

<style>
    .morebutton {
        background: var(--button-bg);
        color: var(--button-color) !important;
        padding: 3px 10px;
        display: block;

        border-radius: 10px;
        font-weight: 500;
        position: relative;
        z-index: 2;
        width: fit-content;
    }
    .morebutton:hover {
        text-decoration: none;
    }
    .title-container {
        position: relative;
    }
    .minimizebtn {
        position: absolute;
        right: 20px;
        background: transparent;
        color: var(--header-color);
    }
    main {
        /* border-radius: 8px; */
        overflow: hidden;
    }
    .title-subcontainer {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        align-items: center;
    }

    .title-container {
        margin-bottom: 0px;
        background: var(--header-bg);
        padding: 6px 13px;
    }

    .title-container a {
        color: var(--header-color);
    }

    .userbox {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--container-bg);
        overflow: hidden;
        border-radius: 9px;
        padding: 0 9px 0 0;
    }
    .navavatar {
        width: 25px;
        height: 25px;
        overflow: hidden;
    }
    .navavatar img {
        object-fit: contain;
        height: 25px;
    }
    .instancebox {
        background: var(--card-bg);
        padding: 16px;
        /* margin-bottom: 30px; */
        height: 100%;
    }
    .users-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        flex-direction: column;
    }
    .public {
        font-weight: bold;
        background: var(--header-bg);
        color: var(--header-color);
        width: fit-content;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
    }

    h1 {
        margin: 0px;
        font-size: 2.5rem;
    }

    .owner {
        order: -1;
    }

    .instance-box {
        display: grid;
        grid-template-columns: auto 1fr;
        max-width: 912px;
        border-radius: 0px 10px 10px 0px;
    }

    @media (max-width: 991px) {
        .instance-box {
            display: grid;
            grid-template-columns: 1fr;
        }

        .users-container {
            flex-direction: row;
        }
    }

    .morebutton-container {
        height: 20px;
    }

    .morebutton-border {
        position: absolute;
        top: 0;
        left: 0;
        background: var(--header-bg);
        padding: 8px;
        border-radius: 0 0 16px 0;
    }

    .morebutton-border:after {
        display: block;
        content: "";
        position: absolute;

        background-color: transparent;
        bottom: -40px;
        height: 40px;
        width: 15px;
        left: 0;
        border-top-left-radius: 25px;
        box-shadow: 0 -25px 0 0 var(--header-bg); /* This is where the magic happens! */
    }
    @media (max-width: 991px) {
        .morebutton-border:after {
            display: none;
        }
    }

    .instancebox {
        position: relative;
    }
</style>
