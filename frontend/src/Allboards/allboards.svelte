<script>
    // @ts-ignore
    import Board from "./boardcard.svelte";
    import { pb } from "../pb.js";
    // @ts-ignore
    import CreateBoard from "../CreateBoard/CreateBoard.svelte";
    import Modal from "../modal/modal.svelte";
    import { push } from "svelte-spa-router";
    import { onDestroy } from "svelte";
    // import Contextmenu from "../contextmenu.svelte";
    import { localToken } from "../stores.js";
    let showModal = false;

    export let usergroup = null;
    export let params = { usergroup: "" };

    console.log(params, usergroup);

    let boards = [];

    const getBoards = async () => {
        if (!usergroup) {
            // console.log("...getting")
            usergroup = await pb
                .collection("usergroups")
                .getOne(params.usergroup, {
                    fields: "public,id,users",
                });
            console.log(usergroup);
        }
        // fetch a paginated records list
        const records = await pb.collection("boards").getFullList({
            sort: "created",
            expand: "tags",
            filter: `usergroup = "${usergroup.id}"`,
            fields: "id,name,img,collectionId,color,cards",
        });

        boards = [...records];

        console.log("->>>>>>>");
        console.log(records);
    };

    let promise = getBoards();

    const handleNewBoard = async (e) => {
        try {
            const data = e.detail;
            const record = await pb.collection("boards").create(data);
            push(`/board/${record.id}`);
        } catch (error) {
            console.warn(error);
        }
    };

    pb.collection("boards").subscribe(
        "*",
        (e) => {
            console.log("%c subscribe!", "color:teal");
            console.log(e.action);
            console.log(e.record);

            if (e.action === "create") {
                boards = [...boards, e.record];
            } else if (e.action === "update") {
                boards = boards.map((a) =>
                    a.id === e.record.id ? e.record : a,
                );
            } else if (e.action === "delete") {
                boards = boards.filter((a) => a.id != e.record.id);
            }
            console.log("%c ------", "color:teal");
            // views = e.record
        },
        // @ts-ignore
        {
            expand: "tags",
            // @ts-ignore
            filter: `usergroup = "${usergroup.id}"`,
            fields: "id,name,img,collectionId,color,cards",
        },
    );

    onDestroy(() => {
        pb.collection("boards").unsubscribe("*");
    });
</script>

<main>
    {#await promise then value}
        <div class="contexttitle">
            <h1>Boards</h1>
            {#if usergroup.users?.includes($localToken ? $localToken?.model.id : "???")}
                <button class="createbtn" on:click={() => (showModal = true)}>
                    +
                </button>
                <Modal bind:showModal>
                    <CreateBoard
                        on:newcontent={handleNewBoard}
                        usergroup={usergroup.id}
                    />
                </Modal>
            {/if}
        </div>

        <div class="container contextholder">
            <!-- <Contextmenu>
        <div>Boards</div>
          
    </Contextmenu> -->

            <div class="grid">
                {#each boards as board}
                    <Board {board} />
                {/each}
            </div>
        </div>
    {:catch error}
        {error}
    {/await}
</main>

<style>
    main {
        color: var(--main-font-1);
        margin: auto;
        max-width: var(--container);
        width: 100%;
        padding-bottom: 40px;
    }

    .grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 40px;
    }
    .container {
        max-width: 1370px;
        margin: auto;
        width: calc(100% - 20px);
        padding-bottom: 30px;
    }
    @media only screen and (max-width: 991px) {
        .container {
            gap: 10px;
        }
    }
</style>
