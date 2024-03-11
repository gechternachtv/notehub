<script>
	// @ts-ignore
	import Board from './boardcard.svelte';
    import {pb} from '../pb.js';
    // @ts-ignore
    import CreateBoard from '../CreateBoard/CreateBoard.svelte';
    import Modal from '../modal/modal.svelte';
    let showModal = false;


let boards = [];

const getBoards = async ()=>{
    // fetch a paginated records list
    const records = await pb.collection('boards').getFullList({
    sort: 'created',
    expand: 'tags',
    });
    
    boards = [...records]
    console.log(records)
}

let promise = getBoards()



const handleNewBoard = async (e)=>{
    const data = e.detail
    const record = await pb.collection('boards').create(data);
        boards.push({...record});
        boards = boards;
        console.log(data)
    
}


</script>
<main>

<div class="container">

    {#await promise then value}
        <div class="grid">
            {#each boards as board}
            <Board board={board}/>
            {/each}
        </div>
    {/await}
<div class="controls">
<button on:click={() => (showModal = true)}> create board </button>
</div>
<Modal bind:showModal>
    <CreateBoard on:newcontent={handleNewBoard}/>
</Modal>
</div>








</main>

<style>
            main{
                background:var(--container-bg);
                color:var(--main-font-1);
                margin:auto;
                max-width: var(--container);
                width:100%;
                padding-bottom: 40px;
            }
           
            .grid{
                display:grid;
                gap:20px;
                grid-template-columns: 1fr 1fr;
            }
            .container{
                max-width: 1370px;
                margin: auto;
                width: calc(100% - 20px);
                padding-bottom: 30px;
            }
            @media only screen and (max-width: 991px){
                .container{
                    gap: 10px
                }
            }

</style>