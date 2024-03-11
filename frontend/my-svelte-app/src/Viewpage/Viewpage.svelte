<script>
    import Board from '../Boardpage/boardpage.svelte';
    import {pb} from '../pb.js';
    
    import {dndzone} from "svelte-dnd-action";
    // @ts-ignore
    import Createview from '../Allviews/createview.svelte';
    import Modal from '../modal/modal.svelte';
    let showModal = false;


    export let params = {}
    export let id = params.id;
    
    
    let view;


    const handleEditView = async (e)=>{
        
            console.log(e.detail,view)

        const data = {
            boards: e.detail.boards,
            name: e.detail.name,
            position: e.detail.position,
            img: e.detail.img ? e.detail.img :  view.img
        };

        console.log(data)
        const res = await pb.collection('views').update(view.id, data);
        const record = await pb.collection('views').getOne(view.id, {
            expand: 'boards.cards.tags',
        });

        console.log(record)
        view = record
        boards = view.expand?.boards

    }



    let boards = []
    
    function handleDndConsider(e) {
        console.log(e.detail.items.map(e => e.id))
        boards = e.detail.items;
    }


    async function handleDndFinalize(e) {
        console.log(e.detail.items.map(e => e.id))
        boards = e.detail.items;
        const record = await pb.collection('views').update(id, {boards:e.detail.items.map(e => e.id)});
        
         console.log(record)
    }
    
    const getView = async ()=>{
            const record = await pb.collection('views').getOne(id, {
            expand: 'boards.cards.tags',
        });
        console.log(record)
        boards = record.expand?.boards
        view = record
        return record
    }
    const promise = getView()


</script>
<main>
    <!-- <Tags/> -->
     

{#await promise then res}


<div class="controls absolute">
    {view.name}
    <button on:click={() => (showModal = true)}> edit view </button>
</div>

<Modal bind:showModal>
    <Createview view={view} on:newcontent={handleEditView}/>
</Modal>


    {#if view.img}
        <div class="img">
            <img style="object-position: 0% {view.position}%;"src="{import.meta.env.VITE_API_URL}/api/files/{view.collectionId}/{view.id}/{view.img}" alt="">
        </div>
    {:else}
    <div class="img" style="background-color:var(--gradient-col-1)"></div><!-- else content here -->
    {/if}

    <!-- <img alt="background" src="{res.img}"> -->
    {#if boards}
    <div use:dndzone={{items:boards,type:"board",dropTargetStyle:{opacity:"0.6"}}} on:consider={handleDndConsider} on:finalize={handleDndFinalize} class="grid">
    
        {#each boards as board(board.id)}
            <div class="board-container" >
                <Board board={board} editoropen={false}/>
            </div>
        {/each}  
    

    </div>
    {/if}
{:catch error}
    :c
    {error}
{/await}


</main>

<style>
    .absolute {
        position: absolute;
        
        background: var(--header-bg);
        padding: 5px;
        left: 0px;
        align-content: center;
        justify-content: center;
        align-items: center;
        
        font-weight: bold;
        
        color: var(--header-color);
        top: -20px;
border-radius: 0 0px 10px 0px;
padding-left: 16px;
font-size: 21px;
gap: 17px;
    }
    main{
        width: calc(100% + 60px);
        margin-left: -30px;
        margin-top: -30px;
                        padding:30px;
                box-sizing: border-box;
                background:var(--gradient-col-1);
                position: relative;
    }
    .grid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap:30px;
    }

    .board-container {
        padding: 11px;
        box-sizing: border-box;
        padding: 23px 1px;
        background: var(--container-bg);
        border-radius: 10px;
        /* box-shadow: 2px 3px 4px #00000026; */
        border-radius: 4px;
    }
    .grid{
        transition:all .3s;
        opacity:1;
        margin-top: -72px;
    }
    .img{
        height:250px;
        background-position: bottom;
        background-size: cover;
        width: calc(100% + 60px);
        margin-left: -30px;
        margin-top: -30px;
        overflow:hidden;
    }
    .img img {
        width:100%;
        object-fit: cover;
        height:250px;
    }
    
    
</style>