<script>
    // @ts-nocheck

    import Allworkspaces from "../Allworkspaces/allworkspaces.svelte";
    import Allboards from "../Allboards/allboards.svelte";
    import { pb } from "../pb";
    import Modal from "../modal/modal.svelte";
    import CreateUsergroup from "../createUsergroup.svelte";
    import { localToken, server } from "../stores.js";
    import { push } from "svelte-spa-router";

    export let params;

    let usergroup;
    let showModal = false;

    const getPublictext = {
        private: { text: "🔒 private" },
        view: { text: "public: 👁️ view" },
        "global-view": { text: "public: 🌐 global view" },
        edit: { text: "public: 🔓 join and edit" },
    };

    const getUserGroup = async () => {
        const record = await pb.collection("instance").getOne(params.instance, {
            fields: "id,name,users,public,expand.users.avatar,expand.users.name,expand.users.id",
            expand: "users",
        });
        console.log(record);
        usergroup = record;
    };

    const joinUserGroup = async () => {
        if (
            !usergroup.users.includes(
                $localToken ? $localToken?.model.id : "???",
            ) &&
            usergroup.public === "edit"
        ) {
            const newrecord = await pb
                .collection("instance")
                .update(params.instance, {
                    name: usergroup.name,
                    public: usergroup.public,
                    users: [...usergroup.users, $localToken?.model.id],
                });
            usergroup = {
                ...newrecord,
                expand: {
                    users: [
                        ...usergroup.expand.users,
                        {
                            id: $localToken?.model.id,
                            name: $localToken?.model.name,
                            avatar: $localToken?.model.avatar,
                        },
                    ],
                },
            };
        }
    };

    const userGroup = getUserGroup();

    const handleeditusergroup = async (e) => {
        console.log("edit!");
        console.log(e.detail);

        const record = await pb
            .collection("instance")
            .update(e.detail.id, e.detail);
        const users = await pb.collection("instance").getOne(e.detail.id, {
            fields: "expand",
            expand: "users",
        });
        console.log(record, users);
        usergroup = { ...record, expand: users.expand };
    };
</script>

{#await userGroup}
    <!-- promise is pending -->
{:then e}
    <div class="titlecontainer">
        <h1>{usergroup.name}</h1>
        <div class="public">{getPublictext[usergroup.public].text}</div>
    </div>
    <div class="btncontainer">
        {#if $localToken && usergroup.users.includes($localToken ? $localToken?.model?.id : "???")}
            <button
                class="btn createusergroup"
                on:click={() => {
                    showModal = true;
                }}>Edit userGroup</button
            >
            <Modal bind:showModal>
                <CreateUsergroup
                    currentUsergroup={usergroup}
                    on:edit={handleeditusergroup}
                ></CreateUsergroup>
            </Modal>
        {/if}
        {#if !usergroup.users.includes($localToken ? $localToken?.model.id : "???") && usergroup.public === "edit"}
            {#if $localToken}
                <button class="btn createusergroup" on:click={joinUserGroup}
                    >Join userGroup</button
                >
            {:else}
                <button
                    class="btn createusergroup"
                    on:click={() => {
                        push("/login");
                    }}>Join userGroup</button
                >
            {/if}
        {/if}
    </div>

    {#if usergroup.expand?.users}
        <div class="users-container">
            {#each usergroup.expand.users as user}
                <div class="userbox">
                    <div class="navavatar">
                        <img
                            loading="lazy"
                            src="{$server.url}/api/files/_pb_users_auth_/{user.id}/{user.avatar}?thumb=40x40"
                        />
                    </div>
                    {user.name}
                </div>
            {/each}
        </div>
    {/if}

    <Allworkspaces {usergroup}></Allworkspaces>

    <Allboards {usergroup}></Allboards>
{:catch error}
    {error}
{/await}

<style>
    h1 {
        font-size: 32px;
    }
    .btncontainer {
        margin-bottom: 28px;
    }
    .public {
        font-weight: bold;
        background: var(--header-bg);
        color: var(--header-color);
        width: fit-content;
        padding: 3px 8px;
        border-radius: 6px;

        display: flex;
        align-items: center;
        margin-bottom: 15px;
        margin-top: 15px;
    }
    .titlecontainer {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
    }
    .userbox {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #ffffff0f;
        overflow: hidden;
        border-radius: 9px;
        padding: 0 9px 0 0;
    }
    .users-container {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
    }

    .navavatar {
        width: 39px;
        height: 39px;
        overflow: hidden;
    }
    .navavatar img {
        object-fit: contain;
        height: 39px;
    }
</style>
