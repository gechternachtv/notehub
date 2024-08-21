<script>
    import { createEventDispatcher } from "svelte";
    // import { pb } from './pb';

    import { localToken } from "./stores.js";

    export let currentUsergroup = {
        name: "new User Group",
        public: "private",
        users: [],
    };
    console.log(currentUsergroup);
    // let showconfirmbox = false;
    const dispatch = createEventDispatcher();

    let name = currentUsergroup.name;
    let publicperm = currentUsergroup.public;
    let users = currentUsergroup.users
        ?.filter((e) => e != ($localToken ? $localToken?.model?.id : "???"))
        .join(",");

    const publicopt = [
        { value: "edit", desc: "edit - everyone with the link can join" },
        {
            value: "view",
            desc: "view - everyone with the link can view, only members can edit",
        },
        { value: "private", desc: "private - only members can view and edit" },
    ];

    function handleSubmit() {
        if (currentUsergroup.id) {
            dispatch("edit", {
                id: currentUsergroup.id,
                name: name,
                public: publicperm,
                users: [$localToken?.model?.id, ...users.split(",")].filter(
                    (e) => e != "",
                ),
            });
        } else {
            dispatch("new", {
                name: name,
                public: publicperm,
                users: [$localToken?.model?.id, ...users.split(",")].filter(
                    (e) => e != "",
                ),
            });
        }
    }
</script>

<main>
    <h1 class="board-name">
        {#if currentUsergroup.id}
            Edit
        {:else}
            Create
        {/if} usergroup
    </h1>

    <div class="grid">
        name : <input bind:value={name} />
        permissions :
        <select bind:value={publicperm}>
            {#each publicopt as option, i}
                <option value={option.value}>{option.desc}</option>
            {/each}
        </select>
        members ids (values separated by comma, the creator is a user by default)
        : <input bind:value={users} />
    </div>

    <button class="btn" on:click={handleSubmit}>
        {#if currentUsergroup.id}
            Edit
        {:else}
            Create
        {/if}
    </button>
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
        font-size: 1.1rem;
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
        font-size: 1.3rem;
        opacity: 0.6;
    }
</style>
