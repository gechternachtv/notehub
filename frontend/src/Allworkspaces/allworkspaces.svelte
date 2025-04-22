<script>
    import Boardcard from "../Allboards/boardcard.svelte";
    // @ts-ignore
    import Createworkspace from "./createworkspace.svelte";
    import { push } from "svelte-spa-router";
    import { pb } from "../pb.js";
    // import {dndzone} from "svelte-dnd-action";
    import Modal from "../modal/modal.svelte";
    import { onDestroy } from "svelte";
    // import Contextmenu from "../contextmenu.svelte";

    export let usergroup = null;
    export let params = { usergroup: "" };
    import { localToken, server } from "../stores.js";

    // import SidebarAllusergroups from "../sidebar-allusergroups.svelte";
    // console.log(usergroup)

    let showModal = false;

    let workspaces = [];
    const records = async () => {
        if (!usergroup) {
            usergroup = await pb
                .collection("usergroups")
                .getOne(params.usergroup, {
                    fields: "public,id,users",
                });
            console.log(usergroup);
        }

        const records = await pb.collection("workspaces").getFullList({
            sort: "-created",
            expand: "boards",
            filter: `usergroup = "${usergroup.id}"`,
            fields: "boards,usergroup,id,users,img,collectionId,name,expand.boards.name,expand.boards.img,expand.boards.collectionId,expand.boards.id,expand.boards.color",

            // filter : 'usergroup == "pnfkrb2353g8zkp"'
        });
        console.log(records);
        workspaces = records;

        document.querySelector("title").innerHTML = usergroup.name;

        return records;
    };
    const promise = records();

    const handleNewWorkspace = async (e) => {
        const data = e.detail;
        const record = await pb.collection("workspaces").create(data);
        // const viewfull = await pb.collection('workspaces').getOne(record.id, {
        //     expand: 'boards',
        // });
        //     workspaces.unshift({...viewfull});
        //     workspaces = workspaces;
        //     console.log(data)
        push(`/workspace/${record.id}`);
    };

    pb.collection("workspaces").subscribe(
        "*",
        (e) => {
            console.log("%c subscribe!", "color:teal");
            console.log(e.action);
            console.log(e.record);

            if (e.action === "create") {
                workspaces = [...workspaces, e.record];
            } else if (e.action === "update") {
                workspaces = workspaces.map((a) =>
                    a.id === e.record.id ? e.record : a,
                );
            } else if (e.action === "delete") {
                workspaces = workspaces.filter((a) => a.id != e.record.id);
            }
            console.log("%c ------", "color:teal");
            // workspaces = e.record
        },
        {
            expand: "boards",
            // @ts-ignore
            filter: `usergroup = "${usergroup.id}"`,
            fields: "boards,usergroup,id,users,img,collectionId,name,expand.boards.name,expand.boards.img,expand.boards.collectionId,expand.boards.id,expand.boards.color",
        },
    );

    onDestroy(() => {
        pb.collection("workspaces").unsubscribe("*");
    });
</script>

<main class="contextholder">
    {#await promise then value}
        <div class="contexttitle">
            <h1>Workspaces</h1>
            {#if usergroup.users.includes($localToken ? $localToken?.model.id : "???")}
                <button class="createbtn" on:click={() => (showModal = true)}>
                    +
                </button>

                <Modal bind:showModal>
                    <Createworkspace
                        isopen={showModal}
                        on:newcontent={handleNewWorkspace}
                        usergroup={usergroup.id}
                    />
                </Modal>
            {/if}
        </div>
        <!-- <Contextmenu>
        <div>Workspaces</div>
        <button class="createbtn" on:click={() => (showModal = true)}> + </button>    
    </Contextmenu> -->

        <div class="grid">
            {#each workspaces as workspace}
                <div class="workspacecard-container">
                    <a href="/#/workspace/{workspace.id}" class="img">
                        {#if workspace.img}
                            <div class="img-c">
                                <img
                                    style="object-position: 0px {workspace.imgposition}%;"
                                    src="{$server.url}/api/files/{workspace.collectionId}/{workspace.id}/{workspace.img}"
                                    alt=""
                                />
                            </div>
                        {:else}
                            <div
                                class="img-c"
                                style="background-color:var(--gradient-col-1)"
                            ></div>
                        {/if}
                    </a>
                    <div class="title">
                        <a href="/#/workspace/{workspace.id}"
                            >{workspace.name}</a
                        >
                    </div>
                    <div class="boardlist">
                        {#if workspace.expand?.boards}
                            {#each workspace.expand.boards as board}
                                <Boardcard workspacecard={true} {board} />
                            {/each}
                        {/if}
                    </div>
                    <div class="controls">
                        <!-- <a class="btn" href="/#/view/{view.id}">view</a> -->
                        <!-- <button on:click={()=>{console.log(view)}} class="btn">edit</button> -->
                        <!-- <button on:click={()=>{handledelete(view.id)}} class="btn alert">delete</button> -->
                    </div>
                </div>
            {/each}
        </div>
    {:catch error}
        {error}
    {/await}
</main>

<style>
    .workspacecard-container {
        border-radius: 10px;
        overflow: hidden;
    }

    .alert {
        background: var(--alert);
    }
    .img-c {
        display: block;
        height: 80px;
        background-position: bottom;
        background-size: cover;
        width: calc(100% + 44px);
        margin-left: -22px;
        margin-top: -22px;
        margin-bottom: 22px;
    }
    img {
        height: 100%;
        transition: all 0.2s;
        width: 100%;
        border: 0px;
        display: block;
        object-fit: cover;
        height: 80px;
    }
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
    }
    @media (max-width: 1075px) {
        .grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    @media (max-width: 806px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
    .workspacecard-container {
        background: var(--card-bg);
        padding: 22px;
        padding-bottom: 0;
    }
    .title {
        margin-bottom: 10px;
    }
    .title a {
        font-weight: bold;
        font-size: 2.3rem;
        color: var(--board-title-color);
        display: block;
        transition: all 0.3s;
    }
    .boardlist {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 806px) {
        .boardlist {
            grid-template-columns: 1fr;
        }
    }

    main {
        padding-bottom: var(--bodypadding);
    }
</style>
