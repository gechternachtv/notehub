<script>
    import Boardcard from "../Allboards/boardcard.svelte";
    import { server } from "../stores";
    export let usergroup;
    export let workspaces;
    export let boards;

    // let showfull = true;

    const getPublictext = {
        private: { text: "🔒 private" },
        view: { text: "public: 👁️ view" },
        "global-view": { text: "public: 🌐 global view" },
        edit: { text: "public: 🔓 join and edit" },
    };
</script>

<main class="instance-box">
    <div class="title-container">
        <div class="title-subcontainer">
            <h1><a href="/#/usergroup/{usergroup.id}">{usergroup.name}</a></h1>
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
            <div class="public">{getPublictext[usergroup.public].text}</div>
        </div>
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

        <div class="workspacecontainer viewcard-container">
            {#each workspaces.filter((e) => e.usergroup === usergroup.id) as workspace}
                <a class="workspace-card" href="/#/workspace/{workspace.id}">
                    {#if workspace.img}
                        <div class="img-c">
                            <img
                                loading="lazy"
                                style="object-position: 0px {workspace.imgposition}%;"
                                src="{$server.url}/api/files/{workspace.collectionId}/{workspace.id}/{workspace.img}?thumb=200x200"
                                alt=""
                            />
                        </div>
                    {:else}
                        <div
                            class="img-c"
                            style="background-color:var(--gradient-col-1)"
                        ></div>
                    {/if}
                    <div class="text">
                        {workspace.name}
                    </div>
                </a>
            {/each}
        </div>
        <div class="boardscontainer viewcard-container">
            {#each boards.filter((e) => e.usergroup === usergroup.id) as board}
                <Boardcard workspacecard={true} {board} />
            {/each}
        </div>
        <div class="controls">
            <!-- <a class="btn" href="/#/usergroup/{instance.id}">full view</a> -->
            <!-- <a class="btn" href="/#/workspaces/{instance.id}">workspaces</a>
        <a class="btn" href="/#/allboards/{instance.id}">boards</a> -->
        </div>
    </div>
</main>

<style>
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
        border-radius: 8px;
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
    }
    .public {
        font-weight: bold;
        background: var(--header-bg);
        color: var(--header-color);
        width: fit-content;
        padding: 3px 8px;
        border-radius: 6px;

        display: flex;
        align-items: center;
        margin-bottom: 15px;
        margin-top: 15px;
    }

    h1 {
        margin: 0px;
        font-size: 2.5rem;
    }
    .boardscontainer {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 220px));
    }
    .img-c {
        width: 220px;
        height: 60px;
        overflow: hidden;
    }
    .img-c img {
        width: 100%;
        height: 60px;
        object-fit: cover;
    }

    .workspace-card {
        background: var(--container-bg);
        overflow: hidden;
        border-radius: 6px;
        transition: all 0.2s;
        color: var(--main-font-1);
    }

    .workspace-card:hover {
        text-decoration: none;
        transform: scale(1.04);
    }

    .workspacecontainer {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 220px));
        gap: 13px;
        margin-top: 19px;
        font-size: 13px;
        font-weight: bold;
    }
    .workspacecontainer .text {
        padding: 5px;
    }
    .owner {
        order: -1;
    }

    .title-container .btn {
        color: var(--header-bg);
    }
</style>
