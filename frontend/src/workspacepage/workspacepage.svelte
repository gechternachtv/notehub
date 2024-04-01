<script>
    import Board from '../Boardpage/boardpage.svelte';
    import {pb} from '../pb.js';
    
    // import {dndzone} from "svelte-dnd-action";
    // @ts-ignore
    import Createworkspace from '../Allworkspaces/createworkspace.svelte';
    import Modal from '../modal/modal.svelte';
    import { onDestroy } from 'svelte';
    import Contextmenu from '../contextmenu.svelte';
    import Sortgrid from '../Boardpage/sortcardsgrid.svelte';
    
    let showModal = false;
    let boardisactive = true

    export let params = {}
    export let id = params.id;
    
    let defaults = [
        "1fr",
        "2fr 1fr",
        `repeat(3, minmax(322px, 1fr))`
    ]

    let view;
    let dragDisabled = true;
    const gridDefaults = (len) => {
        
        defaults = [
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

    async function handleDndFinalize(e) {
        // console.log(e.detail.items.map(e => e.id))
        // boards = e.detail.items;
        console.log(e.detail)
        const record = await pb.collection('views').update(id, {boards:e.detail.tochildren});
        
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



        pb.collection('views').subscribe(params.id, (e)=> {
                console.log("%c subscribe!","color:teal")
                console.log(e.action);
                console.log(e.record);

                if(e.action === "update"){
                    view = e.record
                    grid = view.grid ? view.grid : gridDefaults(view.boards.length - 1)
                    boards = e.record.expand?.boards
                }else if(e.action === "delete"){
                    boardisactive = false
                    pb.collection('views').unsubscribe(params.id);
                    console.log("deleted!");
                }
                console.log("%c ------","color:teal")
                // views = e.record
        }, { expand: 'boards.cards.tags' });





        return record
    }
    const promise = getView()


const boardUpdate = data => {
    console.log(`%c ${data.detail.id}!!!!`,"color:skyblue;font-size:20px")
    boards = boards.map(e => e.id === data.detail.id ? data.detail : e)
    console.log(data.detail)
    console.log(boards)
    boards = boards
    console.log("%c -=-","color:red;font-size:20px")
}








        onDestroy(() => {
                    pb.collection('views').unsubscribe(params.id);
                });





</script>
<main class="workspacepage" style="--grid:{grid};--grid-default:{defaults[2]}">
    <!-- <Tags/> -->
    
{#if boardisactive}
{#await promise then res}

<Contextmenu>

        {view.name}
        <button on:click={()=>{showModal = true}}> edit </button>

</Contextmenu>

<Modal bind:showModal>
    <Createworkspace isopen={showModal} view={view} on:newcontent={handleEditView}/>
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

    <!-- dragDisabled={true} use:dndzone={{dragDisabled:dragDisabled,items:boards,type:"board",dropTargetStyle:{opacity:"0.6"}}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}  -->
    <div class="grid">

        <Sortgrid on:change={handleDndFinalize} class="board-grid" options={{	group: {
            name: 'boards'
        },handle: ".grabber-board",direction: 'horizontal',ghostClass: "sortable-ghost-board",}}>
    
        {#each boards as board(board.id)}
            <div id="{board.id}" class="board-container" >
                <div class="grabber-board" on:focus={()=>dragDisabled = false} on:mouseover={()=>dragDisabled = false} on:mouseleave={() => {dragDisabled = true}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" transform="matrix(1, 0, 0, 1, 0, 0)"><path d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5-9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="var(--button-bg)"/></svg>
                </div>

                    <Board listView={false} board={board} boardpage={false} on:boardupdate={boardUpdate} />
                
            </div>
        {/each}

    </Sortgrid>

    </div>
    {/if}
    {:catch error}
    error fetching data, <br/><br/>
    {error}
{/await}
{:else}
     this workspace was deleted
{/if}



</main>

<style>
    .grabber-board{
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

    main{
        width: calc(100% + 60px);
        margin-left: -30px;
        margin-top: -30px;
                        padding:30px;
                box-sizing: border-box;
                background:var(--gradient-col-1);
                position: relative;
                height: calc(100vh - var(--bodypadding));
                --board-height:calc(100vh - 350px)
    }
    :global(.board-grid){
        display:grid;
        gap:30px;
        grid-template-columns: var(--grid);
        overflow: scroll;
        scroll-snap-type: x mandatory; 
    }
    @media (max-width:991px){
        :global(.board-grid){
        width: calc(100% + 9px);
        grid-template-columns: var(--grid-default)
    }
    }
    .board-container {
        /* scroll-snap-stop: always; */
        scroll-snap-align: start;
        padding: 11px;
        box-sizing: border-box;
        background: var(--container-bg);
        border-radius: 10px;
        /* box-shadow: 2px 3px 4px #00000026; */
        border-radius: 4px;
        position:relative;
    }
    @media (max-width:991px){
        .board-container {
            scroll-snap-stop: always;
        }
    }
    :global(.board-grid){
        opacity:1;
        margin-top: -78px;
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


    .board-container .board-header .img-c{
    width:50px ;
    height: 50px ;
    }
    
    

</style>