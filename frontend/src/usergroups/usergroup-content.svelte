<script>
    import { pb } from "../pb";
    import { server } from "../stores";
    import Usergroupbox from "./usergroupbox.svelte";
    import Boardcard from "../Allboards/boardcard.svelte";
    export let usergroup;

    let getboards;
    let getworkspaces;
    // console.log($server);
    const res = fetch(`${$server.url}/workspaceget/idhere`, {
        method: "GET",
        mode: "no-cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
    })
        .then((a) => {
            console.log(a);
            return a.json();
        })
        .then((a) => console.log(a));

    $: if (usergroup?.id) {
        getboards = pb.collection("boards").getFullList(usergroup.id, {
            fields: "id,name,color,img,collectionId",
            filter: `usergroup = "${usergroup.id}"`,
        });

        getworkspaces = pb.collection("workspaces").getFullList(usergroup.id, {
            fields: "id,name,img,collectionId",
            filter: `usergroup = "${usergroup.id}"`,
        });
    }
</script>

<main>
    {#if usergroup?.id}
        <Usergroupbox {usergroup}>
            {#await getworkspaces}
                ...
            {:then workspaces}
                <div class="workspacecontainer viewcard-container">
                    {#if workspaces}
                        {#each workspaces as workspace}
                            <a
                                class="workspace-card"
                                href="/#/workspace/{workspace.id}"
                            >
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
                    {/if}
                </div>
            {:catch error}
                {error}
            {/await}

            {#await getboards}
                ...
            {:then boards}
                <div class="boardscontainer viewcard-container">
                    {#each boards as board}
                        <Boardcard workspacecard={true} {board} />
                    {/each}
                </div>
            {:catch error}
                {error}
            {/await}
        </Usergroupbox>
    {/if}
</main>

<style>
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
        font-size: 1.3rem;
        font-weight: bold;
    }
    .workspacecontainer .text {
        padding: 5px;
    }
</style>
