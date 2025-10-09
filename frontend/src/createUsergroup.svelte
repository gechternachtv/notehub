<script>
    import { createEventDispatcher } from "svelte";
    import { server } from "./stores";
    import Picmobutton from "./Picmo/picmobutton.svelte";
    // import { pb } from './pb';

    import { localToken } from "./stores.js";

    export let currentUsergroup = {
        name: "",
        public: "private",
        users: [...$localToken?.model?.id],
        expand: {
            users: [
                {
                    id: $localToken?.model?.id,
                    name: $localToken?.model?.name,
                    avatar: $localToken?.model?.avatar,
                },
            ],
        },
        owner: $localToken?.model?.id,
    };
    console.log(currentUsergroup);
    // let showconfirmbox = false;
    const dispatch = createEventDispatcher();

    let name = currentUsergroup.name;
    let publicperm = currentUsergroup.public;
    let users = currentUsergroup.expand.users;
    let newusers = "";

    const publicopt = [
        {
            value: "public-post",
            desc: "public-post - everyone with the link can post cards",
        },
        {
            value: "view",
            desc: "view - everyone with the link can view, only members can edit",
        },
        { value: "private", desc: "private - only members can view and edit" },
    ];

    function handleSubmit() {
        const validateUsers = (arr) => {
            return Array.from(new Set(arr.filter((e) => e.length > 14)));
        };

        if (currentUsergroup.id) {
            dispatch("edit", {
                id: currentUsergroup.id,
                name: name,
                public: publicperm,
                users: validateUsers([
                    $localToken?.model?.id,
                    ...users.map((e) => e.id),
                    ...newusers.split(","),
                ]),
            });
        } else {
            if (name != "") {
                dispatch("new", {
                    name: name,
                    public: publicperm,
                    users: validateUsers([
                        $localToken?.model?.id,
                        ...users.map((e) => e.id),
                        ...newusers.split(","),
                    ]),
                    owner: $localToken?.model?.id,
                });
            }
        }
    }

    const handleEmojiselect = (e) => {
        console.log(e.detail.emoji);
        name = `${e.detail.emoji.unicode} ${name}`;
    };
</script>

<main class="create-usergroup-popup">
    <h1 class="board-name">
        {#if currentUsergroup.id}
            Edit
        {:else}
            Create
        {/if} usergroup
    </h1>

    <div class="grid">
        name : <Picmobutton on:emojiselect={handleEmojiselect} />
        <input placeholder="new UserGroup" bind:value={name} />
        permissions :
        <select bind:value={publicperm}>
            {#each publicopt as option, i}
                <option value={option.value}>{option.desc}</option>
            {/each}
        </select>
        <div>users:</div>
        <div class="users-container">
            {#each users as user}
                <div
                    class="userbox"
                    class:owner={currentUsergroup.owner === user.id}
                >
                    <div class="navavatar">
                        <img
                            loading="lazy"
                            src="{$server.url}/api/files/_pb_users_auth_/{user.id}/{user.avatar}?thumb=40x40"
                        />
                    </div>
                    {user.name}

                    {#if currentUsergroup.owner === user.id}
                        <span title="user group admin" class="workspace-admin">
                            ⚙
                        </span>
                    {/if}
                    {#if currentUsergroup.owner != user.id && $localToken?.model?.id != user.id}
                        <button
                            class="remove-user"
                            on:click={() => {
                                users = users.filter((e) => e.id != user.id);
                                console.log(users);
                            }}>×</button
                        >
                    {/if}
                </div>
            {/each}
        </div>

        add users via id (multiple values sepparated by comma)
        <input bind:value={newusers} placeholder="id1,id2" />
    </div>
    {#if name != ""}
        <button class="btn" on:click={handleSubmit}>
            {#if currentUsergroup.id}
                Edit
            {:else}
                Create
            {/if}
        </button>
        <!-- content here -->
    {/if}
</main>

<style>
    .file {
        margin-top: 20px;
    }
    main {
        background: var(--card-bg);
        padding: 30px;
        color: var(--button-bg);
        box-sizing: border-box;
    }
    .grid {
        display: grid;
    }
    .flex {
        display: flex;
        gap: 10px;
    }
    button {
        min-width: 120px;
        background: var(--button-bg);
        color: var(--button-color);
        padding: 5px;
        font-weight: bold;
        font-size: 1.2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
        border: 0px;
        margin: 20px 0;
        cursor: pointer;
        text-align: center;
        justify-content: center;
        max-width: 190px;
    }
    button.alert {
        background: var(--alert);
    }
    .img-c {
        border-radius: 10px;
        height: 80px;
        transition: all 0.2s;
        width: 80px;
        border: 0px;
        overflow: hidden;
    }
    img {
        height: 100%;
        transition: all 0.2s;
        width: 100%;
        border: 0px;
        display: block;
        object-fit: cover;
    }

    .board-header {
        min-height: 80px;
        color: var(--board-title-color);
        padding: 4px;
        margin-top: 0px;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        gap: 20px;
        padding-left: 5px;
        width: 100%;
    }
    .board-header h1 {
        margin: 0;
    }
    .board-header {
        color: var(--board-title-color);
    }

    .cards-length {
        font-size: 1.2rem;
        opacity: 0.6;
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
        width: 39px;
        height: 39px;
        overflow: hidden;
    }
    .navavatar img {
        object-fit: contain;
        height: 39px;
    }

    .users-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 8px;
    }

    /* Inline #11 | http://localhost:5173/#/usergroup/on2fxwy3tks5tds */

    button.remove-user {
        min-width: auto;
        background: var(--button-color);
        color: var(--button-bg);
        padding: 0px;
        border-radius: 0px;
        display: bloc;
        margin: 0px;
        max-width: auto;
    }
    .owner {
        order: -1;
    }
</style>
