<script>
    import Board from '../Boardpage/boardpage.svelte';
    import {pb} from '../pb.js';
    
    import {dndzone} from "svelte-dnd-action";


    export let params = {}

    export let id = params.id;
    

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
        boards = record.expand.boards
        return record
    }
    const promise = getView()


</script>
<main>
    <!-- <Tags/> -->
     

{#await promise}
    . . .
{:then res}
    {#if res.img}
        <div class="img" style="background-image:url('{res.img}')"></div>
    {/if}

    <!-- <img alt="background" src="{res.img}"> -->
    <div use:dndzone={{items:boards,type:"board",dropTargetStyle:{opacity:"0.6"}}} on:consider={handleDndConsider} on:finalize={handleDndFinalize} class="grid">
    {#each boards as board(board.id)}
        <div class="board-container" >
        <Board board={board} editoropen={false}/>
        </div>
    {/each}
    </div>
{:catch error}
    :c
{/await}


</main>

<style>
    main{
        width: calc(100% + 60px);
        margin-left: -30px;
        margin-top: -30px;
                        padding:30px;
                box-sizing: border-box;
                background:var(--gradient-col-1);
    }
    .grid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
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
    }
    
    
</style>