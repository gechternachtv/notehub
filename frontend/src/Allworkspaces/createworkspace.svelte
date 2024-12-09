<script>
    // @ts-nocheck

    import { pb } from "../pb";
    import { push } from "svelte-spa-router";
    import Boardcard from "../Allboards/boardcard.svelte";
    import Confirmaction from "../confirmaction.svelte";
    import { createEventDispatcher } from "svelte";
    import { server } from "../stores";
    // import {localToken} from '../stores.js'
    export let usergroup;
    export let isopen = false;
    const dispatch = createEventDispatcher();

    export let workspace = {
        id: "",
        img: "",
        name: "",
        boards: [],
        grid: "",
        imgposition: 0,
    };

    let showconfirmbox = false;
    let imageposition = workspace.imgposition;
    let hasboards = workspace.boards.length > 0;
    let boardlist = workspace.boards;
    let checkboxholder;

    const getallBoards = async () => {
        return await pb.collection("boards").getFullList({
            filter: `usergroup = "${usergroup}"`,
            fields: "color,name,id,img,collectionId",
        });
    };
    let promise;
    $: {
        if (isopen) {
            promise = getallBoards();
        }
    }

    console.log(workspace);

    let name = workspace.name;
    let showImage = workspace.img != "";

    let input;
    let image;

    let workspacePreview = {
        name: "",
        img: null,
    };

    const handleSend = () => {
        const data = {
            name: name,
            img: input.files[0],
            boards: boardlist,
            imgposition: imageposition,
            usergroup: usergroup,
        };

        if (workspace.id === "") {
            name = "";
            showImage = false;
            input.value = "";
        }
        handleChange();
        console.log(checkboxholder?.querySelectorAll("input"));
        if (workspace.id === "") {
            try {
                checkboxholder.querySelectorAll("input").forEach((element) => {
                    element.checked = false;
                });
            } catch (error) {
                console.warn(error);
            }
        }

        dispatch("newcontent", data);
    };

    const handleDelete = async () => {
        console.log("delete", workspace.id);
        await pb.collection("workspaces").delete(workspace.id);
        push("/");
    };

    function inputchange(e) {
        if (e.target.checked) {
            boardlist.push(e.target.name);

            hasboards = boardlist.length > 0;
            console.log(boardlist, hasboards);
        } else {
            boardlist = boardlist.filter((a) => a != e.target.name);

            hasboards = boardlist.length > 0;
            console.log(boardlist, hasboards);
        }
    }

    function handleChange() {
        console.log("change");
        workspacePreview = {
            name: name,
            img: input.files[0],
        };
        console.log(workspacePreview);

        if (workspacePreview.img) {
            showImage = true;

            const reader = new FileReader();
            reader.addEventListener("load", function () {
                image.setAttribute("src", reader.result);
                workspacePreview = {
                    name: name,
                    img: reader.result,
                };
                console.log(reader.result);
            });

            reader.readAsDataURL(workspacePreview.img);

            return;
        } else if (workspace.img != "") {
            showImage = true;
            image.setAttribute(
                "src",
                `${$server.url}/api/files/${workspace.collectionId}/${workspace.id}/${workspace.img}`,
            );
            return;
        }
        showImage = false;
    }
</script>

<main>
    {#if input?.files?.length || workspace.img != ""}
        <div class="board-header">
            {#if showImage}
                <img
                    style="object-position: 0px {imageposition}%"
                    bind:this={image}
                    src="{$server.url}/api/files/{workspace.collectionId}/{workspace.id}/{workspace.img}"
                    alt=""
                />
            {/if}
        </div>
        {#if showImage}
            <div class="img-size-holder"></div>
            <div class="img-container">
                <input
                    type="range"
                    id="imageposition"
                    name="volume"
                    min="0"
                    max="100"
                    bind:value={imageposition}
                />
            </div>
        {/if}
    {:else}
        <h1 class="board-name">Create workspace</h1>
    {/if}

    <div class="grid">
        <input class="name" on:change={handleChange} bind:value={name} />
        <div bind:this={checkboxholder} class="checkbox-holder">
            {#if isopen}
                {#await promise then boards}
                    {#each boards as board}
                        <div class="checkbox">
                            <input
                                checked={workspace.boards.includes(board.id)}
                                type="checkbox"
                                id="checkbox-{board.id}"
                                name={board.id}
                                on:change={inputchange}
                            />
                            <label for="checkbox-{board.id}">
                                <div class="boardcontainer">
                                    <Boardcard workspacecard={true} {board} />
                                </div>
                            </label>
                        </div>
                    {/each}
                {/await}
            {/if}
        </div>
        <input
            class="file"
            bind:this={input}
            on:change={handleChange}
            type="file"
            accept="image/*"
        />

        <div class="flex">
            {#if workspace.id != "" && name != ""}
                <button on:click={handleSend}>Edit workspace</button>
                <button
                    class="alert"
                    on:click={() => {
                        showconfirmbox = true;
                    }}>Delete</button
                >
            {:else if name != ""}
                <button on:click={handleSend}>Create new workspace</button>
            {/if}
        </div>
        <div>
            <Confirmaction
                show={showconfirmbox}
                on:close={() => {
                    showconfirmbox = false;
                }}
                on:confirm={() => {
                    handleDelete();
                }}
            >
                Are you sure you want to delete this workspace? (This action
                does not affect the boards)
            </Confirmaction>
        </div>
    </div>
</main>

<style>
    .file {
        margin-top: 20px;
    }
    label {
        cursor: pointer;
    }
    .checkbox {
        display: flex;
        gap: 15px;
    }
    .boardcontainer {
        pointer-events: none;
    }
    main {
        background: var(--card-bg);
        padding: 30px;
        color: var(--button-bg);
        box-sizing: border-box;
        position: relative;
    }

    .img-size-holder {
        height: 180px;
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

    .board-header {
        max-height: 180px;
        color: var(--board-title-color);
        padding: 4px;
        margin-top: 0px;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        gap: 20px;
        padding-left: 5px;
        width: 100%;
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
    }
    img {
        transition: all 0.2s;
        height: 180px;
        transition: all 0.2s;
        width: 100%;
        border: 0px;
        object-fit: cover;
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
</style>
