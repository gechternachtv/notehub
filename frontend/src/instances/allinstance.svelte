<script>
    import { pb } from "../pb";
    import Instancebox from "./instancebox.svelte";
    import CreateUsergroup from "../createUsergroup.svelte";
    import { push } from "svelte-spa-router";
    import Modal from "../modal/modal.svelte";
    import { localToken } from "../stores.js";

    let recordboards = [];
    let recordworkspaces = [];
    let showModal = false;

    const recordsinstance = pb.collection("instance").getFullList({
        sort: "-created",
        expand: "users",
        filter: `users ~ "${$localToken ? $localToken.model.id : "aaa"}" || public = "global-view"`,
        fields: "id,name,public,expand.users.avatar,expand.users.name,expand.users.id",
    });

    (async () => {
        recordboards = await pb.collection("boards").getFullList({
            sort: "-created",
            fields: "id,collectionId,name,img,instance,color",
            filter: `instance.users ~ "${$localToken ? $localToken.model.id : "aaa"}" || instance.public = "global-view"`,
        });
        console.log(recordboards);

        recordworkspaces = await pb.collection("views").getFullList({
            sort: "-created",
            fields: "id,name,img,collectionId,position,instance",
            filter: `instance.users ~ "${$localToken ? $localToken?.model.id : "aaa"}" || instance.public = "global-view"`,
        });
        console.log(recordworkspaces);
    })();

    const handlenewusergroup = async (e) => {
        const data = e.detail;
        const record = await pb.collection("instance").create(data);
        showModal = false;
        push(`/usergroup/${record.id}`);
    };
</script>

<main>
    {#await recordsinstance}
        ...
    {:then instances}
        {(() => {
            console.log(instances);
        })()}
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
        {#each instances.filter((e) => e.public === "global-view") as instance}
            <Instancebox
                {instance}
                boards={recordboards}
                workspaces={recordworkspaces}
            ></Instancebox>
        {/each}
        {#each instances.filter((e) => e.public === "edit") as instance}
            <Instancebox
                {instance}
                boards={recordboards}
                workspaces={recordworkspaces}
            ></Instancebox>
        {/each}
        {#each instances.filter((e) => e.public === "view") as instance}
            <Instancebox
                {instance}
                boards={recordboards}
                workspaces={recordworkspaces}
            ></Instancebox>
        {/each}
        {#each instances.filter((e) => e.public === "private") as instance}
            <Instancebox
                {instance}
                boards={recordboards}
                workspaces={recordworkspaces}
            ></Instancebox>
        {/each}
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
</style>
