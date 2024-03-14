<script>
    import Board from '../Boardpage/boardpage.svelte';
    import {pb} from '../pb.js';
    
    import {dndzone} from "svelte-dnd-action";
    // @ts-ignore
    import Createworkspace from '../Allworkspaces/createworkspace.svelte';
    import Modal from '../modal/modal.svelte';
    let showModal = false;


    export let params = {}
    export let id = params.id;
    
    
    let view;
    let dragDisabled = true;
    const gridDefaults = (len) => {
        
        const defaults = [
        "1fr",
        "2fr 1fr",
        `repeat(${len + 1}, minmax(322px, 1fr))`
    ]
    //console.log(len,defaults[len])
        if (!!defaults[len]){
            return defaults[len]
        }else{
            return defaults[2]
        }
}
    let grid;

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
        showModal = false
        grid = gridDefaults(view.boards.length - 1)
        
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
        //  dragDisabled = true
    }
    
    const getView = async ()=>{
            const record = await pb.collection('views').getOne(id, {
            expand: 'boards.cards.tags',
        });
        console.log(record)
        boards = record.expand?.boards
        view = record
        grid = view.grid ? view.grid : gridDefaults(view.boards.length - 1)
        return record
    }
    const promise = getView()




</script>
<main style="--grid:{grid}">
    <!-- <Tags/> -->
    

{#await promise then res}


<div class="controls absolute">
    {view.name}
    <button on:click={()=>{showModal = true}}> edit workspace </button>
</div>

<Modal bind:showModal>
    <Createworkspace view={view} on:newcontent={handleEditView}/>
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

    <div dragDisabled={true} use:dndzone={{dragDisabled:dragDisabled,items:boards,type:"board",dropTargetStyle:{opacity:"0.6"}}} on:consider={handleDndConsider} on:finalize={handleDndFinalize} class="grid">
    
        {#each boards as board(board.id)}
            <div class="board-container" >
                <div class="grabber" on:focus={()=>dragDisabled = false} on:mouseover={()=>dragDisabled = false} on:mouseleave={() => {dragDisabled = true}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" transform="matrix(1, 0, 0, 1, 0, 0)"><path d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5-9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="var(--button-bg)"/></svg>
                </div>
                <Board listView={false} board={board} editoropen={false}/>
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
    .grabber{
        position:absolute;
        right:15px;
        z-index:2;
        right: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        left: -5px;
        padding: 5px 0px;
        top: 0;
        padding-right: 5px;
    }
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
font-size: 2.1rem;
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
        gap:30px;
        grid-template-columns: var(--grid);
        overflow: auto;
        scroll-snap-type: x mandatory;
    }

    .board-container {
        scroll-snap-align: start;
        padding: 11px;
        box-sizing: border-box;
        background: var(--container-bg);
        border-radius: 10px;
        /* box-shadow: 2px 3px 4px #00000026; */
        border-radius: 4px;
        position:relative;
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
    




    @media (max-width:1325px){

        /* Inline #10 | http://localhost:5173/#/workspace/bi030ifwz0fhktp */

        main{
        width: calc(100% + 18px);
        margin-left: -9px;
        margin-top: -9px;
        padding: 9px;
        }

        .img {

        width: calc(100% + 18px);
        margin-left: -9px;
        margin-top: -9px;
        }

    }
    
</style>