<script>
	// @ts-ignore
	import Board from './boardcard.svelte';
    import {pb} from '../pb.js';
    // @ts-ignore
    import CreateBoard from '../CreateBoard/CreateBoard.svelte';
    import Modal from '../modal/modal.svelte';
    import { push } from 'svelte-spa-router';
    import { onDestroy } from 'svelte';
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
    try {
        const data = e.detail
        const record = await pb.collection('boards').create(data);
        push(`/board/${record.id}`) 
    } catch (error) {
        console.warn(error)
    }
}


pb.collection('boards').subscribe('*', (e)=> {
    console.log("%c subscribe!","color:teal")
    console.log(e.action);
    console.log(e.record);

    if(e.action === "create"){
        boards = [...boards,e.record]
    }else if(e.action === "update"){
        boards = boards.map(a => a.id === e.record.id ? e.record : a);
    }else if(e.action === "delete"){
        boards = boards.filter(a => a.id != e.record.id)
    }
    console.log("%c ------","color:teal")
    // views = e.record
}, { expand: 'tags' });

onDestroy(() => {
    pb.collection('boards').unsubscribe("*")
        });

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
                grid-template-columns: repeat( auto-fit, minmax(300px, 1fr) );
                gap:40px;
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