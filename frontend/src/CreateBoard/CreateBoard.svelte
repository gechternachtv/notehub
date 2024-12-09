<script>
    import { createEventDispatcher } from "svelte";
    import { pb } from "../pb";
    import { pop } from "svelte-spa-router";
    import { server } from "../stores";
    import Confirmaction from "../confirmaction.svelte";
    import Picmobutton from "../Picmo/picmobutton.svelte";
    import extractFirstEmoji from "../extractFirstEmoji";

    let showconfirmbox = false;
    const dispatch = createEventDispatcher();

    export let board = {
        img: "",
        color: "var(--main-font-1)",
        name: "",
        id: "",
        description: "",
    };
    export let usergroup;

    let color = board.color;
    let name = board.name;
    let showImage = board.img != "";
    let description = board.description ? board.description : "";

    let input;
    let image;

    // let placeholder;

    let boardPreview = {
        color: "",
        name: "",
        img: null,
        description: "",
    };

    const handleEmojiselect = (e) => {
        console.log(e.detail.emoji);
        name = `${e.detail.emoji} ${name}`;
    };
    const handleSend = () => {
        const data = {
            color: color,
            name: name,
            img: input.files[0],
            cards: [],
            usergroup: usergroup,
            description: description,
        };
        if (board.id === "") {
            color = "var(--main-font-1)";
            name = "";
            showImage = false;
            input.value = "";
            description = "";
        }

        handleChange();

        dispatch("newcontent", data);
    };

    const handleDelete = async () => {
        console.log("delete", board.id);
        if (board.id != "") {
            console.log(board.cards);

            await pb.collection("boards").delete(board.id);
            console.log("all deleted");
            pop();
        }
    };

    function handleChange() {
        boardPreview = {
            color: color,
            name: name,
            img: input.files[0],
            description: description,
        };
        console.log(boardPreview);

        if (boardPreview.img) {
            showImage = true;

            const reader = new FileReader();
            reader.addEventListener("load", function () {
                image.setAttribute("src", reader.result);
                boardPreview = {
                    color: color,
                    name: name,
                    img: reader.result,
                    description: description,
                };
                console.log(reader.result);
            });

            reader.readAsDataURL(boardPreview.img);

            return;
        } else if (board.img != "") {
            showImage = true;
            image.setAttribute(
                "src",
                `${$server.url}/api/files/${board.collectionId}/${board.id}/${board.img}`,
            );
            return;
        }
        showImage = false;
    }
</script>

<main>
    <div style="border-left: 4px solid {color}" class="board-header">
        {#if showImage}
            <div class="img-c">
                <img
                    bind:this={image}
                    src="{$server.url}/api/files/{board.collectionId}/{board.id}/{board.img}"
                    alt=""
                />
            </div>
        {:else if extractFirstEmoji(name).emoji}
            <div class="boardemoji">{extractFirstEmoji(name).emoji}</div>
        {:else}
            <div class="boardemoji">📓</div>
        {/if}

        <div>
            <h1 class="board-name">
                {extractFirstEmoji(name).text === ""
                    ? "Create board"
                    : extractFirstEmoji(name).text}
            </h1>

            {#if board.id != ""}
                <div class="cards-length">id: {board.id}</div>
            {/if}
        </div>
    </div>

    <div class="grid">
        <label for="editboardname">name:</label>
        <Picmobutton on:emojiselect={handleEmojiselect} />
        <input
            id="editboardname"
            class="name"
            on:change={handleChange}
            bind:value={name}
        />

        <label for="editboarddesc">description:</label>
        <input
            id="editboarddesc"
            class="name"
            on:change={handleChange}
            bind:value={description}
        />
        <input
            class="color"
            on:change={handleChange}
            type="color"
            bind:value={color}
        />

        <input
            class="file"
            bind:this={input}
            on:change={handleChange}
            type="file"
            accept="image/*"
        />
        <div class="flex">
            {#if board.id != "" && name != ""}
                <button on:click={handleSend}>Edit board</button>
                <button
                    class="alert"
                    on:click={() => {
                        showconfirmbox = true;
                    }}>Delete</button
                >
            {:else if name != ""}
                <button on:click={handleSend}>Create new board</button>
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
                Are you sure you want to delete this board and all the cards
                within?
            </Confirmaction>
        </div>
    </div>
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
    .boardemoji {
        font-size: 54px;
    }
</style>
