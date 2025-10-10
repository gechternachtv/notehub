<script>
    import { pb } from "../pb";
    import Usergroupbox from "./usergroup-content.svelte";
    import CreateUsergroup from "../createUsergroup.svelte";
    import { push } from "svelte-spa-router";
    import Modal from "../modal/modal.svelte";
    import { localToken, server } from "../stores.js";
    import Calendar from "../Calendar/calendar.svelte";

    let recordboards = [];
    let recordworkspaces = [];
    let showModal = false;

    const recordusergroup = pb.collection("usergroups").getFullList({
        sort: "-created",
        expand: "users",
        filter: `users ~ "${$localToken ? $localToken.model.id : "aaa"}" || public = "global-view"`,
        fields: "owner, id,name,public,expand.users.avatar,expand.users.name,expand.users.id",
    });

    (async () => {
        recordboards = await pb.collection("boards").getFullList({
            sort: "-created",
            fields: "id,collectionId,name,img,usergroup,color",
            filter: `usergroup.users ~ "${$localToken ? $localToken.model.id : "aaa"}" || usergroup.public = "global-view"`,
        });
        console.log(recordboards);

        recordworkspaces = await pb.collection("workspaces").getFullList({
            sort: "-created",
            fields: "id,name,img,collectionId,imgposition,usergroup",
            filter: `usergroup.users ~ "${$localToken ? $localToken?.model.id : "aaa"}" || usergroup.public = "global-view"`,
        });
        console.log(recordworkspaces);
    })();

    const handlenewusergroup = async (e) => {
        const data = e.detail;
        const record = await pb.collection("usergroups").create(data);
        showModal = false;
        push(`/usergroup/${record.id}`);
    };

    document.querySelector("title").innerHTML = "notehub!";
</script>

<main>
    {#if $localToken}
        <div class="calendar-user-grid">
            <div class="user-home">
                <div>
                    {#if $localToken?.model.avatar}
                        <div class="profilepic-container">
                            <img
                                alt="profile pic"
                                class="profilepic"
                                src="{$server.url}/api/files/_pb_users_auth_/{$localToken
                                    .model.id}/{$localToken.model.avatar}"
                            />
                        </div>
                    {/if}
                    <div>
                        <div class="user-container">
                            <!-- {$localToken.model.name} -->

                            <div class="pleaseverify">Welcome to notehub!</div>
                        </div>
                        <div class="user-container server">
                            <div>User ID : {$localToken.model.id}</div>
                        </div>
                        <div class="user-container server">
                            <div>Server : {$server.name}</div>
                        </div>
                        <div class="user-container server">
                            <div>Version : {import.meta.env.VITE_VERSION}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Calendar></Calendar>
        </div>
    {/if}
    {#await recordusergroup}
        ...
    {:then usergroups}
        <!-- <h1>User Groups</h1> -->

        <div class="instance-grid">
            {#each usergroups.filter((e) => e.public === "global-view") as usergroup}
                <Usergroupbox
                    {usergroup}
                    boards={recordboards}
                    workspaces={recordworkspaces}
                ></Usergroupbox>
            {/each}
            {#each usergroups.filter((e) => e.public === "public-post") as usergroup}
                <Usergroupbox
                    {usergroup}
                    boards={recordboards}
                    workspaces={recordworkspaces}
                ></Usergroupbox>
            {/each}
            {#each usergroups.filter((e) => e.public === "view") as usergroup}
                <Usergroupbox
                    {usergroup}
                    boards={recordboards}
                    workspaces={recordworkspaces}
                ></Usergroupbox>
            {/each}
            {#each usergroups.filter((e) => e.public === "private") as usergroup}
                <Usergroupbox
                    {usergroup}
                    boards={recordboards}
                    workspaces={recordworkspaces}
                ></Usergroupbox>
            {/each}
        </div>

        {#if $localToken}
            <button
                class="btn createusergroup"
                on:click={() => {
                    showModal = true;
                }}>Create new userGroup</button
            >
            <Modal bind:showModal>
                <CreateUsergroup on:new={handlenewusergroup}></CreateUsergroup>
            </Modal>
        {/if}
    {:catch error}
        {error}
    {/await}
</main>

<style>
    main {
        padding-bottom: var(--bodypadding);
        --avatar-size: 193px;
    }
    .createusergroup {
        width: 100%;
        text-align: center;
        justify-content: center;
        margin-top: 15px;
        font-size: 1.9rem;
        padding: 9px;
        margin-bottom: 15px;
    }
    h1 {
        font-size: 3.2rem;
    }

    .instance-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }

    @media (max-width: 991px) {
        .instance-grid {
            grid-template-columns: 1fr;
        }
    }

    .calendar-user-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 15px;
        margin-bottom: 15px;
        align-items: end;
    }

    @media (max-width: 991px) {
        .calendar-user-grid {
            grid-template-columns: 1fr;
        }
    }

    .user-container {
        background: var(--header-bg);
        color: var(--header-color);
        padding: 5px;
        font-weight: bold;
        border-radius: 5px;
        font-size: 1.5rem;
    }

    .profilepic {
        border-radius: 10px;
        max-width: var(--avatar-size);
        height: auto;
    }
    .pleaseverify {
        margin-top: 10px;
    }

    .profilepic-container {
        align-items: center;
        width: var(--avatar-size);
        overflow: hidden;
        height: var(--avatar-size);
    }
    .profilepic-container img {
        object-fit: cover;
        height: var(--avatar-size);
        min-width: var(--avatar-size);
    }
    @media (max-width: 991px) {
        .profilepic-container {
            align-items: center;
        }
    }

    .server {
        margin-top: 10px;
        display: flex;
        gap: 10px;

        align-content: center;
        align-items: center;
    }

    .user-home {
        background: var(--card-bg);
        padding: min(20px, 2vw);
        border-radius: 10px;
        color: var(--header-color);
        background: var(--header-bg);
    }

    @media (max-width: 991px) {
        .user-container {
            /* padding: 5px; */
            /* font-weight: bold; */
            /* border-radius: 5px; */
            padding: 0px;
            font-weight: normal;
            border-radius: 0px;
            font-size: 1.1rem;
        }

        /* Element | http://localhost:5173/#/ */

        .user-home > div {
            display: flex;
            gap: 17px;
        }
    }
</style>
