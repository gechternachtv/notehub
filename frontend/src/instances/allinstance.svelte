<script>
    import { pb } from "../pb";
    import Instancebox from "./instancebox.svelte";
    import CreateUsergroup from "../createUsergroup.svelte";
    import { push } from "svelte-spa-router";
    import Modal from "../modal/modal.svelte";

    let recordboards = [];
    let recordworkspaces = [];
    let showModal = false;

    const recordsinstance = pb.collection('instance').getFullList({
    sort: '-created',expand:"users"});

    ;(async ()=>{
        recordboards = await pb.collection('boards').getFullList({
        sort: '-created',
        fields: 'id,collectionId,name,img,instance,color'
        })
        console.log(recordboards)

        recordworkspaces = await pb.collection('views').getFullList({
        sort: '-created',
        fields: 'id,name,img,collectionId,position,instance'
        })
        console.log(recordworkspaces)
    })()

    const handlenewusergroup = async (e)=>{
        const data = e.detail
        const record = await pb.collection('instance').create(data);
        showModal = false;
        push(`/usergroup/${record.id}`)
    }

</script>
<main>
    <button class="btn createusergroup" on:click={()=>{showModal = true}}>Create new userGroup</button>
    <Modal bind:showModal>
        <CreateUsergroup on:new={handlenewusergroup}></CreateUsergroup>
    </Modal>


{#await recordsinstance}
    ...
{:then instances}
{#each instances.filter(e => e.public === "edit") as instance}
    <Instancebox instance={instance} boards={recordboards} workspaces={recordworkspaces}></Instancebox>
{/each}
{#each instances.filter(e => e.public === "view") as instance}
    <Instancebox instance={instance} boards={recordboards} workspaces={recordworkspaces}></Instancebox>
{/each}
{#each instances.filter(e => e.public === "private") as instance}
    <Instancebox instance={instance} boards={recordboards} workspaces={recordworkspaces}></Instancebox>
{/each}

{:catch error}
    {error}
{/await}
</main>
<style>
    main{
        padding-bottom:10px;
    }
    .createusergroup{
        margin-bottom:20px;
    }
</style>