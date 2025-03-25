<script>
    import { pb } from "../pb";
    import Usergroupbox from "./usergroupbox.svelte";
    import CreateUsergroup from "../createUsergroup.svelte";
    import { push } from "svelte-spa-router";
    import Modal from "../modal/modal.svelte";
    import { localToken } from "../stores.js";
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
</script>

<main>
    {#if $localToken}
        <Calendar></Calendar>
    {/if}
    {#await recordusergroup}
        ...
    {:then usergroups}
        <h1>User Groups</h1>
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
        <div class="instance-grid">
            {#each usergroups.filter((e) => e.public === "global-view") as usergroup}
                <Usergroupbox
                    {usergroup}
                    boards={recordboards}
                    workspaces={recordworkspaces}
                ></Usergroupbox>
            {/each}
            {#each usergroups.filter((e) => e.public === "edit") as usergroup}
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
    {:catch error}
        {error}
    {/await}
</main>

<style>
    main {
        padding-bottom: 10px;
    }
    .createusergroup {
        margin-bottom: 20px;
    }
    h1 {
        font-size: 32px;
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
</style>
