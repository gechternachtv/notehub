<script>
// @ts-nocheck

    import Boardcard from "../Allboards/boardcard.svelte";
    import { pb } from "../pb";
    import { createEventDispatcher } from 'svelte';
    export let currentboard;

    const getAllBoards = async () => { 
        return await pb.collection('boards').getFullList({
            sort: '-created',
            expand: 'boards'
        })
    }

    const dispatch = createEventDispatcher()
    let checkboxholder;
    const promise = getAllBoards()
   
    const handleSubmit = (e)=>{
        e.preventDefault()
        const id = document.querySelector(`input[name="boards"]:checked`)?.value
        if(id){
            dispatch("submit",id)
        }
    }



</script>
<main>
    <div bind:this={checkboxholder} class="checkbox-holder">
        {#await promise then boards}
            <h1 class="title">Move card to:</h1>
            <form on:submit={handleSubmit}>
            {#each boards as board}
           
            <div class="checkbox">
                    <input class="" checked={board.id === currentboard} type="radio" id="checkbox-{board.id}" name="boards" value="{board.id}">
                    <label for="checkbox-{board.id}">
                        
                            <div class="boardcontainer"> <Boardcard workspacecard={true} board={board}/></div>
                       
                    </label>
                </div>
                
                 
            {/each}
            <button type="submit">move</button>
            </form>
            
        {/await}
        </div>
</main>

<style>
    .checkbox{
        display:flex;
        gap:10px;
    }
    .boardcontainer{
        pointer-events: none;
        
    }
    label{
        cursor:pointer;
    }
    main{
        padding:20px;
        background: var(--card-bg);
        color: var(--button-bg);
        box-sizing: border-box;
    }
    button{
        margin-top:20px;
    }
</style>