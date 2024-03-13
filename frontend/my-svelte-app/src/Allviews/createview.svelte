<script>
// @ts-nocheck
    
    import {createEventDispatcher} from 'svelte';
    import { pb } from '../pb';
    import  {pop} from 'svelte-spa-router'
    import Boardcard from '../Allboards/boardcard.svelte';

    const dispatch = createEventDispatcher();
    
    export let view = {
        id:"",
        img:"",
        name:"",
        boards:[],
        grid:"",
        position:0
    }

    let imageposition = view.position
    let hasboards = view.boards.length > 0
    let boardlist = view.boards
    let checkboxholder;

    const getallBoards = 
    async () => { 
        return await pb.collection('boards').getFullList({
            sort: '-created',
            expand: 'boards'
        })
    }

    const promise = getallBoards()

    console.log(view)

    
    
    let name = view.name;
    let showImage = view.img != "";



    let input;
    let image;




    let viewPreview = {

            name:"",
            img: null
        }

    const handleSend = () =>{



        const data = {
            
            name:name,
            img:input.files[0],
            boards:boardlist,
            position: imageposition
        }


        if(view.id === ""){
            
            name = "";
            showImage = false;
            input.value = ""
        }
        handleChange();
        console.log(checkboxholder?.querySelectorAll("input"))
        if(view.id === ""){
        try {
            checkboxholder.querySelectorAll("input").forEach(element => {
                element.checked = false
            });
        } catch (error) {
            console.warn(error)
        }
        }

        dispatch('newcontent',data);

    }

    const handleDelete = async ()=> {
        
        console.log("delete",view.id)
        await pb.collection('views').delete(view.id)
        pop();
        
    }


    function inputchange(e) {
     
            if(e.target.checked){
                boardlist.push(e.target.name)
                
                hasboards = boardlist.length > 0
                console.log(boardlist,hasboards)
            }else{
                boardlist = boardlist.filter(a => a != e.target.name)
                
                hasboards = boardlist.length > 0
                console.log(boardlist,hasboards)
            }
        
    }

  function handleChange() {
    console.log("change")
    viewPreview = {

            name:name,
            img:input.files[0]
        }
        console.log(viewPreview)
    
    if (viewPreview.img) {
			showImage = true;

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result);
        viewPreview = {

            name:name,
            img:reader.result
        }
        console.log(reader.result)
      });
      
      reader.readAsDataURL(viewPreview.img);
			
			return;
    }else if(view.img != ""){
        showImage = true;
        image.setAttribute("src", `${import.meta.env.VITE_API_URL}/api/files/${view.collectionId}/${view.id}/${view.img}`);
        return
    }
		showImage = false; 
  }
</script>


<main>

{#if input?.files?.length || view.img != ""}
<div class="board-header">

    {#if showImage}
        
            <img style="object-position: 0px {imageposition}%" bind:this={image} src="{import.meta.env.VITE_API_URL}/api/files/{view.collectionId}/{view.id}/{view.img}" alt="" />

    {/if}
		


</div>
{#if showImage}
    <div class="img-size-holder"></div>
    <div class="img-container">
        <input type="range" id="imageposition" name="volume" min="0" max="100" bind:value={imageposition}/>
    </div>
{/if}



{:else}
<h1 class="board-name"> Create view </h1>
{/if}

<div class="grid">

    <input class="name" on:change={handleChange} bind:value={name} />
    <div bind:this={checkboxholder} class="checkbox-holder">
    {#await promise then boards}
        {#each boards as board}
       
            <div class="checkbox">
                
                <input checked={view.boards.includes(board.id)} type="checkbox" id="checkbox-{board.id}" name="{board.id}" on:change={inputchange}>
                <label for="checkbox-{board.id}">
                <div class="boardcontainer"> <Boardcard small={true} board={board}/></div>
                </label>
            </div>
             
        {/each}
    {/await}
    </div>
    <input
        class="file"
        bind:this={input}
        on:change={handleChange}
      type="file"
    />
    
    
    <div class="flex">
    {#if view.id != "" && name != "" }
        <button on:click={handleSend}>Edit view</button>
        <button class="alert" on:click={handleDelete}>Delete</button>
        {:else if name != "" }
        <button  on:click={handleSend}>Create new view</button>
    {/if}
    </div>


</main>

<style>
    .file{
        margin-top:20px;
    }
    label{
        cursor: pointer;
    }
    .checkbox{
        display:flex;
        gap:15px;
    }
.boardcontainer{
    pointer-events: none;
}
main{
    background:var(--card-bg);
    padding:30px;
    color:var(--button-bg);
    box-sizing: border-box;
    position:relative;
}

.img-size-holder{
    height:180px;
}
    .grid{
        display:grid;
    }
.flex{
    display:flex;
    gap:10px
}
    button {
        min-width: 120px;
                background: var(--button-bg);
                color: var(--button-color);
                padding: 5px;
                font-weight: bold;
                font-size: 11px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 5px;
                border:0px;
                margin:20px 0;
                cursor:pointer;
                text-align: center;
                justify-content: center;
                max-width:190px;
            }
        button.alert{
        background:var(--alert)
    }


            .board-header{
                max-height: 180px;
                color:var(--board-title-color);
                padding:4px;
                margin-top:0px;
                margin-bottom:25px;
                display: flex;
                align-items: center;
                gap: 20px;
                padding-left:5px;
                width:100%;
                overflow: hidden;
                width: 100%;
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;

            }
            img {

            transition:all .2s;
            height: 180px;
            transition: all .2s;
            width: 100%;
            border: 0px;
            object-fit: cover;
            }
            .board-header h1{
                margin: 0;
            }
            .board-header  {
              color:var(--board-title-color);
            }

            .cards-length{
    font-size:12px;
    opacity: 0.6;
  }

</style>
