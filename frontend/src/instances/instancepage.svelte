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
    let showModalEdit,
        showModalDelete,
        showModalLeave = false;

    const getPublictext = {
        private: { text: "🔒 private" },
        view: { text: "public: 👁️ view" },
        "global-view": { text: "public: 🌐 global view" },
        edit: { text: "public: 🔓 join and edit" },
    };

    const getUserGroup = async () => {
        const record = await pb.collection("instance").getOne(params.instance, {
            fields: "owner, id,name,users,public,expand.users.avatar,expand.users.name,expand.users.id",
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

    const leaveUserGroup = async () => {
        if (
            usergroup.users.includes(
                $localToken ? $localToken?.model.id : "???",
            )
        ) {
            const newrecord = await pb
                .collection("instance")
                .update(params.instance, {
                    name: usergroup.name,
                    public: usergroup.public,
                    users: usergroup.users.filter(
                        (usString) => usString !== $localToken?.model.id,
                    ),
                });
            const newUsers = usergroup.expand.users.filter(
                (usString) => usString.id !== $localToken?.model.id,
            );
            usergroup = {
                ...newrecord,
                expand: {
                    users: newUsers,
                },
            };
        }
    };

    const deleteUsergroup = async () => {
        await pb.collection("instance").delete(usergroup.id);
        push("/");
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
    . . .
{:then e}
    <div class="usergroup-card">
        <div class="titlecontainer">
            <h1>{usergroup.name}</h1>
            <div class="public">{getPublictext[usergroup.public].text}</div>
        </div>
        <div class="btncontainer">
            {#if $localToken && usergroup.users.includes($localToken ? $localToken?.model?.id : "???")}
                <button
                    class="btn createusergroup"
                    on:click={() => {
                        showModalEdit = true;
                    }}>Edit userGroup</button
                >
                <Modal bind:showModal={showModalEdit}>
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

            {#if usergroup.users.includes($localToken ? $localToken?.model.id : "???")}
                {#if usergroup.owner === ($localToken ? $localToken?.model.id : "???")}
                    <button
                        class="btn createusergroup danger"
                        on:click={() => {
                            showModalDelete = true;
                        }}>Delete usergroup</button
                    >
                    <Modal bind:showModal={showModalDelete}>
                        <div class="modal-container">
                            Delete user group and all workspaces,boards and
                            cards on it? This cannot be undone.
                            <div class="btncontainer">
                                <button
                                    class="btn"
                                    on:click={() => (showModalDelete = false)}
                                    >Close</button
                                >
                                <button
                                    class="btn danger"
                                    on:click={deleteUsergroup}
                                    >Delete "{usergroup.name}"</button
                                >
                            </div>
                        </div>
                    </Modal>
                {:else}
                    <button
                        class="btn createusergroup danger"
                        on:click={() => {
                            showModalLeave = true;
                        }}>Leave usergroup</button
                    >
                    <Modal bind:showModal={showModalLeave}>
                        <div class="modal-container">
                            Are you sure you want to leave this usergroup?
                            {#if usergroup.public != "edit"}
                                <div>
                                    This can only be undone being added again by
                                    another user in this group
                                </div>
                            {/if}
                            <div class="btncontainer">
                                <button
                                    class="btn"
                                    on:click={() => (showModalLeave = false)}
                                    >Close</button
                                >
                                <button
                                    class="btn danger"
                                    on:click={leaveUserGroup}
                                    >Leave "{usergroup.name}"</button
                                >
                            </div>
                        </div>
                    </Modal>
                {/if}
            {/if}
        </div>

        {#if usergroup.expand?.users}
            <div class="users-container">
                {#each usergroup.expand.users as user}
                    <div
                        class="userbox"
                        class:owner={usergroup.owner === user.id}
                    >
                        <div class="navavatar">
                            <img
                                loading="lazy"
                                src="{$server.url}/api/files/_pb_users_auth_/{user.id}/{user.avatar}?thumb=40x40"
                            />
                        </div>
                        {user.name}
                        {#if usergroup.owner === user.id}
                            <span
                                title="user group admin"
                                class="workspace-admin"
                            >
                                ⚙
                            </span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    <Allworkspaces {usergroup}></Allworkspaces>

    <Allboards {usergroup}></Allboards>
{:catch error}
    {error}
{/await}

<style>
    h1 {
        font-size: 32px;
        margin-top: 0px;
    }
    .btncontainer {
        margin-bottom: 28px;
        display: flex;
        gap: 10px;
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
        /* background: #ffffff0f; */
        background: var(--container-bg);
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
    .owner {
        order: -1;
    }

    .btn.danger {
        background: var(--alert);
    }

    .modal-container {
        font-size: 15px;
        background: var(--card-bg);
        padding: 30px;
        color: var(--button-bg);
    }
    .modal-container .btncontainer {
        margin-top: 21px;
        margin-bottom: 0px;
    }

    .usergroup-card {
        background: var(--header-bg);
        padding: 20px;
        border-radius: 9px;

        display: block;
        width: fit-content;
    }
    .usergroup-card h1 {
        color: var(--header-color);
    }
</style>
