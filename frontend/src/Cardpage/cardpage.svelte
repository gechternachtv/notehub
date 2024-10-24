<script>
    // @ts-nocheck
    import dateFormat from "../dateFormat.js";
    import { pop } from "svelte-spa-router";
    import { pb } from "../pb.js";
    import Editor from "../Boardpage/editor.svelte";
    import Card from "./card.svelte";
    import createNewCard from "../createNewCard.js";
    import { localToken } from "../stores.js";

    export let params = {};

    export let id = params.id;

    // console.log(params.id)

    let showcard = {};
    let cardid = "";
    let fileelement;
    let files;
    let currentfile;
    let editorBlocked = true;

    const cardget = async () => {
        if (id) {
            try {
                const res = await pb.collection("cards").getOne(id, {
                    expand: "board.usergroup,tags,authors",
                    fields:
                        `id,board,expand.board.id,expand.board.cards,expand.board.expand.usergroup.users,expand.board.expand.usergroup.id,` +
                        `collectionId,check,created,id,color,` +
                        `file,imglink,favico,title,` +
                        `link,raw,` +
                        `authors,expand.tags.name,expand.tags.color,expand.tags.id,expand.board.name,expand.board.img,expand.board.collectionId,expand.board.color,expand.board.color,expand.board.expand.usergroup.name,expand.authors.id, expand.authors.avatar,expand.authors.name,expand.authors.collectionId`,
                });
                // console.log(res.expand.authors);

                // console.log(res);
                showcard = res;
                cardid = res.id;
                // console.log(res)
                currentfile = res.file;
                editorBlocked = false;

                // console.log(showcard.expand?.board?.expand?.usergroup?.users.includes($localToken ? $localToken?.model.id : "???"))

                if (res.file) {
                    files = [{ name: res.file }];
                }

                return {
                    type: "json",
                    value: {
                        type: "doc",
                        content: res.raw,
                    },
                };
            } catch (err) {
                console.warn(err);
            }
        }
    };
    let promise = cardget();

    const handleNewCard = async (e) => {
        editorBlocked = true;
        // console.log(showcard)

        const card = await createNewCard(
            showcard.expand.board.expand.usergroup.id,
            e.detail,
            showcard.authors
                ? [...showcard.authors, $localToken?.model.id]
                : [$localToken?.model.id],
            fileelement,
            currentfile,
        );
        const data = {
            ...card,
            tags: card.tags.map((e) => e.id),
            // logs: [
            //     // ...showcard.logs,
            //     `card content updated ${dateFormat(new Date())}`,
            // ],
            board: showcard.board,
        };

        // console.log(data)
        const oldexpand = { ...showcard.expand, tags: card.tags };
        const record = await pb.collection("cards").update(cardid, data);
        // console.log("%c record:","color:turquoise")
        // console.log(record)
        showcard = { ...record, tags: card.tags, expand: oldexpand };
        // files = fileelement.files
        if (record.file) {
            files = [{ name: record.file }];
        }
        editorBlocked = false;
    };

    const oneditorready = () => {
        const thumb = document
            .querySelector(".thumb .img-c img")
            ?.getAttribute("src");
        const milkdownimg = document
            .querySelector(".milkdown img")
            ?.getAttribute("src");

        if (thumb && milkdownimg) {
            if (thumb === milkdownimg) {
                // console.log("im equal!");
                document
                    .querySelector(".thumb .img-c img")
                    .setAttribute("style", "display:none");
            }
            if (milkdownimg.includes("data:image")) {
                document
                    .querySelector(".thumb .img-c img")
                    .setAttribute("style", "display:none");
            }
        }
    };
</script>

<main>
    {#await promise then defaultValue}
        {#if showcard.id}
            <div
                class:locked={!showcard.expand?.board?.expand?.usergroup?.users.includes(
                    $localToken ? $localToken?.model.id : "???",
                )}
                class="grid"
            >
                <div class="grid-ch">
                    <Card fullView={true} card={showcard}>
                        <Editor
                            bind:editorBlocked
                            bind:files
                            bind:fileelement
                            {defaultValue}
                            on:newcontent={handleNewCard}
                            clearAllonEnter={false}
                            on:editorready={oneditorready}
                        ></Editor>
                    </Card>
                </div>
            </div>
        {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</main>

<style>
    main {
        padding: 20px 0;
        box-sizing: border-box;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        max-width: 700px;
        margin: auto;
        width: 100%;
    }
    .grid-ch {
        max-width: 100%;
    }
    .editor-panel {
        display: flex;
        gap: 10px;
    }

    .locked .grid-editor-container {
        display: none;
    }

    .locked .grid-ch {
        max-width: 700px;
        margin: auto;
        width: 100%;
    }
</style>
