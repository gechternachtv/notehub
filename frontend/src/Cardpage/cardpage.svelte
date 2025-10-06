<script>
    // @ts-nocheck
    import dateFormat from "../dateFormat.js";
    import { pop } from "svelte-spa-router";
    import { pb } from "../pb.js";
    import Editor from "../editor/editor.svelte";
    import Card from "./card.svelte";
    import createNewCard from "../createNewCard.js";
    import {
        localToken,
        editorblocked,
        server,
        currentUsergroup,
    } from "../stores.js";
    import { querystring } from "svelte-spa-router";
    import findMatchingEntries from "../findMatchingEntriesJSON";
    import Contextmenu from "../contextmenu.svelte";

    export let params = {};

    export let id = params.id;

    const urlparams = new URLSearchParams($querystring);
    const workspacename = urlparams.get("workspacename");
    const workspaceid = urlparams.get("workspaceid");

    let showcard = {};
    let cardid = "";
    let fileelement;
    let files = [];
    let currentfile;

    let notification = "";

    editorblocked.set(true);

    const cardget = async () => {
        if (id) {
            try {
                const res = await pb.collection("cards").getOne(id, {
                    expand: "board.usergroup,tags,authors",
                    fields:
                        `id,board,expand.board.id,expand.board.usergroup,expand.board.cards,expand.board.expand.usergroup.users,expand.board.expand.usergroup.id,` +
                        `collectionId,check,created,id,color,` +
                        `file,imglink,favico,title,` +
                        `link,raw,done,datementions,` +
                        `authors,expand.tags.name,expand.tags.color,expand.tags.id,expand.board.name,expand.board.img,expand.board.collectionId,expand.board.color,expand.board.color,expand.board.expand.usergroup.name,expand.authors.id, expand.authors.avatar,expand.authors.name,expand.authors.collectionId`,
                });
                $currentUsergroup = res.expand.board.expand.usergroup;

                console.log(res);

                // console.log(res);
                showcard = res;
                cardid = res.id;
                // console.log(res)
                currentfile = res.file;
                editorblocked.set(false);

                // if (res.file?.length) {
                //     files = res.file.map((e) => {
                //         return { name: e };
                //     });
                // }

                const matches = findMatchingEntries(res.raw, (d) => {
                    console.log(d);
                    if (d?.src) {
                        if (d.src.startsWith("/api/files")) {
                            return true;
                        }
                    }
                });
                console.log(matches);
                for (let index = 0; index < matches.length; index++) {
                    const { parent, keyInParent } = matches[index];

                    parent[keyInParent].src =
                        `${$server.url}` + parent[keyInParent].src;
                }

                document.querySelector("title").innerHTML =
                    showcard.expand.board.expand.usergroup.name +
                    (showcard.title ? " ➜ " : " ➜ card") +
                    showcard.title;

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
        try {
            console.log(e);
            editorblocked.set(true);
            // console.log(showcard)

            const card = await createNewCard(
                showcard.expand.board.expand.usergroup.id,
                e.detail,
                showcard.authors
                    ? [...showcard.authors, $localToken?.model.id]
                    : [$localToken?.model.id],
                showcard.board,
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
            console.log("%c record:", "color:turquoise");
            console.log(record);
            showcard = { ...record, tags: card.tags, expand: oldexpand };
            currentfile = showcard.file ? showcard.file : [];
            files = [];
            if (fileelement) {
                fileelement.value = "";
            }

            if (
                !document
                    .querySelector(".readmodetoggle")
                    ?.classList.contains("readmode")
            ) {
                document.querySelector(".readmodetoggle")?.click();
            }

            // document.querySelector(".readmodetoggle")?.click();

            notification = "Card was updated successfully";

            setTimeout(() => {
                notification = "";
            }, 3000);
        } catch (error) {
            notification = "An error occurred while updating the card";
            setTimeout(() => {
                notification = "";
            }, 30000);
        }
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
            <Contextmenu>
                <div class="breadcrumb">
                    <div class="contextmenu-link">
                        <a
                            href="/#/usergroup/{showcard.expand?.board?.expand
                                ?.usergroup.id}"
                            >{showcard.expand?.board?.expand?.usergroup.name}
                        </a>

                        {#if workspacename && workspaceid}
                            ➜
                            <a href="/#/workspace/{workspaceid}"
                                >{workspacename}
                            </a>
                        {/if}

                        ➜

                        <a
                            href="/#/board/{showcard.expand?.board
                                ?.id}{workspacename && workspaceid
                                ? `?workspacename=${workspacename}&workspaceid=${workspaceid}`
                                : ''}"
                            >{showcard.expand?.board?.name}
                        </a>
                    </div>
                    ➜
                </div>
            </Contextmenu>

            <div
                class:locked={!showcard.expand?.board?.expand?.usergroup?.users.includes(
                    $localToken ? $localToken?.model.id : "???",
                )}
                class:readonly={!showcard.expand?.board?.expand?.usergroup?.users.includes(
                    $localToken ? $localToken?.model.id : "???",
                )}
                class="grid"
            >
                <div class="grid-ch">
                    <Card fullView={true} card={showcard}>
                        {#if notification != ""}
                            <div class="notification">
                                {notification}
                            </div>
                        {/if}

                        {#if currentfile?.length > 0}
                            {#each currentfile as file}
                                <div class="filename">
                                    <button
                                        class="remove-file"
                                        on:click={() => {
                                            currentfile = currentfile.filter(
                                                (a) => a != file,
                                            );
                                            document
                                                .querySelectorAll(
                                                    ".milkdown img",
                                                )
                                                .forEach((e) => {
                                                    if (e.src.includes(file)) {
                                                        e.remove();
                                                    }
                                                });
                                        }}>×</button
                                    >
                                    <a
                                        target="_blank"
                                        href={`${$server.url}/api/files/${showcard.collectionId}/${showcard.id}/${file}`}
                                    >
                                        <img
                                            src={`${$server.url}/api/files/${showcard.collectionId}/${showcard.id}/${file}?thumb=100x100`}
                                            alt=""
                                        /></a
                                    >
                                    📎 {file}
                                </div>
                            {/each}
                        {/if}
                        {#if files?.length > 0}
                            <div>new:</div>
                            {#each files as file}
                                <div class="filename">
                                    <!-- <img src={file.name} alt="" /> -->
                                    📎 {file.name}
                                </div>
                            {/each}
                        {/if}

                        <Editor
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
        /* padding: 20px 0; */
        box-sizing: border-box;
        padding-bottom: var(--bodypadding);
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

    .notification {
        background: var(--complete);
        color: var(--complete-col);
        display: flex;
        align-items: center;
        gap: 10px;

        border-radius: 9px;
        padding: 7px;
        width: fit-content;
        z-index: 20;
        pointer-events: none;
        position: fixed;
        bottom: 50px;

        margin: auto;

        left: 0;
        right: 0;
        text-align: center;
        margin-right: auto;
        margin-left: auto;
    }
    .filename {
        display: flex;
        gap: 5px;
        align-items: center;
        font-size: 10px;
    }
    .filename img {
        max-width: 30px;
    }

    .remove-file {
        padding: 0 11px;
        background: var(--alert);
    }
</style>
