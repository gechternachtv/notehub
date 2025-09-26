<script>
    import { push } from "svelte-spa-router";
    import { server } from "./stores";
    import { pb } from "./pb";

    let showoptions = false;
    let createnew = false;
    let newname, newurl;
    let allservers = window.localStorage.getItem("allservers")
        ? JSON.parse(window.localStorage.getItem("allservers"))
        : [{ name: import.meta.env.VITE_NAME, url: import.meta.env.VITE_URL },{name: "🔰 local" , url:"http://127.0.0.1:8090"}];
    let errormsg = "";
</script>

<div class="current-server">
    <div>{$server.name} | {$server.url}</div>
    <button
        on:click={() => {
            showoptions = !showoptions;
        }}
    >
        {#if showoptions}
            ↑
        {:else}
            ↓
        {/if}
    </button>
</div>
{#if showoptions}
    {#if createnew}
        <div class="inputcontainer">
            name:<input type="text" bind:value={newname} />
        </div>
        <div class="inputcontainer">
            url:<input type="text" bind:value={newurl} />
        </div>
        <div class="controls">
            <button
                on:click={() => {
                    createnew = false;
                }}
            >
                ← list</button
            >
            <button
                class="add"
                on:click={() => {
                    try {
                        const url = new URL(newurl);
                        const fullpath =
                            url.origin +
                            (url.pathname != "/" ? url.pathname : "");

                        if (
                            allservers.find(
                                (a) => a.name === newname || a.url === fullpath,
                            )
                        ) {
                            allservers = allservers.map((e) => {
                                if (e.name === newname || e.url === fullpath) {
                                    e.name = newname;
                                    e.url = fullpath;
                                    return e;
                                } else {
                                    return e;
                                }
                            });
                        } else {
                            allservers = [
                                ...allservers,
                                {
                                    name: newname,
                                    url: fullpath,
                                },
                            ];
                        }

                        window.localStorage.setItem(
                            "allservers",
                            JSON.stringify(allservers),
                        );
                        createnew = false;

                        window.localStorage.setItem(
                            "currentserver",
                            JSON.stringify({
                                name: newname,
                                url: fullpath,
                            }),
                        );
                        window.location.reload();
                    } catch (error) {
                        errormsg = error;
                    }
                }}>add server</button
            >
        </div>

        {#if errormsg != ""}
            <div>{errormsg}</div>
        {/if}
    {:else}
        <div class="server">
            {#each allservers as server}
                <div class="server-container">
                    <button
                        on:click={() => {
                            pb.authStore.clear();
                            window.localStorage.setItem(
                                "currentserver",
                                JSON.stringify({
                                    name: server.name,
                                    url: server.url,
                                }),
                            );
                            window.location.reload();
                        }}
                    >
                        {server.name} | {server.url}
                        →</button
                    >
                    <button
                        class="remove"
                        on:click={() => {
                            allservers = allservers.filter((e) => {
                                return e.url != server.url;
                            });
                            window.localStorage.setItem(
                                "allservers",
                                JSON.stringify(allservers),
                            );
                        }}>🗑️</button
                    >
                </div>
            {/each}
            <button
                class="add"
                on:click={() => {
                    createnew = true;
                }}>+</button
            >
        </div>
    {/if}
{/if}

<!-- <button>Use default server</button> -->

<style>
    .server {
        margin-top: 10px;
        display: grid;
        gap: 10px;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    .add {
        /* margin: auto; */
        text-align: center;
        justify-content: center;
    }

    .server-container {
        display: grid;
        grid-template-columns: auto 24px;
        gap: 7px;
    }

    .server-container .remove {
        background: transparent;
    }
    .server-container button {
        width: 100%;
        text-align: center;
        justify-content: center;
    }
    .controls {
        justify-content: center;
    }
    .current-server {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }
    .inputcontainer {
        display: grid;
        text-align: left;
        font-weight: bold;
        gap: 4px;
        margin-top: 8px;
    }
</style>
