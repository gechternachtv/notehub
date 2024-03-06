<script>
    import Tags from './Tageidt/tagedit.svelte';
    import Viewboard from './Viewboard/viewboard.svelte';
    import PocketBase from 'pocketbase';
    
    import {dndzone} from "svelte-dnd-action";


    const pb = new PocketBase('http://127.0.0.1:8090');



    let boards = []
    
    function handleDndConsider(e) {
        console.log(e.detail.items)
        boards = e.detail.items;
    }


    async function handleDndFinalize(e) {
        // console.log(e.detail.items.map(e => e.id))
        boards = e.detail.items;
        console.log(e.detail.items)
        const record = await pb.collection('views').update("ttsn5k5shke8553", {boards:e.detail.items.map(e => e.id)});
        
         console.log(record)
    }
    
    const getView = async ()=>{
            const record = await pb.collection('views').getOne('ttsn5k5shke8553', {
            expand: 'boards.cards.tags',
        });
        console.log(record)
        boards = record.expand.boards
    }
    const promise = getView()


</script>
<main>
    <Tags/>
    <!-- <img style="max-width:100px" src="https://images-ext-1.discordapp.net/external/480dYEyUI-tygT7BwGBt_HZVCZ8G93s-rhuUEyONTEk/https/csprea.nekoweb.org/src/kaguya-boom.gif"> -->

{#await promise}
    . . .
{:then res}
    <div use:dndzone={{items:boards,type:"board",dropTargetStyle:{opacity:"0.6"}}} on:consider={handleDndConsider} on:finalize={handleDndFinalize} class="grid">
    {#each boards as board(board.id)}
        <div class="card-container" >
        <Viewboard board={board}/>
        </div>
    {/each}
    </div>
{:catch error}
    :c
{/await}

    <div class="grid">
    
        
        <!-- <Viewboard params={id1}/> -->

    
</div>
</main>

<style>
    .grid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap:30px;
    }

    .board-container {
        padding: 11px;
        box-sizing: border-box;
    }
    .grid{
        transition:all .3s;
        opacity:1;
    }
</style>