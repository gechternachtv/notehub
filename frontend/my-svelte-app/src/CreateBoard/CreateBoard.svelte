<script>
    import {createEventDispatcher} from 'svelte';
    import { pb } from '../pb';
    import  {pop} from 'svelte-spa-router'
    const dispatch = createEventDispatcher();
    
    export let board = {
        img:"",
        color:"var(--main-font-1)",
        name:"",
        id:""
    }


    console.log(board)

    
    let color = board.color;
    let name = board.name;
    let showImage = board.img != "";



    let input;
    let image;

  let placeholder;


    let boardPreview = {
            color:"",
            name:"",
            img: null
        }

    const handleSend = () =>{



        const data = {
            color:color,
            name:name,
            img:input.files[0],
            cards:[],
        }
        if(board.id === ""){
            color = "var(--main-font-1)";
            name = "";
            showImage = false;
            input.value = ""
        }
        handleChange();

        dispatch('newcontent',data);

    }

    const handleDelete = async ()=> {
        
        console.log("delete",board.id)
        if (board.id != ""){
            console.log(board.cards)

            const promiseList = [...board.cards.map(async (e) => {
                console.log(e)
                try {
                await pb.collection('cards').delete(e)
                console.log(`${e} deleted.`);
                } catch (error) {
                console.warn(`Error deleting ${e}:`, error);
                }
            }), await pb.collection('boards').delete(board.id)]
            await Promise.all(promiseList)
            console.log("all deleted")
            pop();
        }
    }



  function handleChange() {

    boardPreview = {
            color:color,
            name:name,
            img:input.files[0]
        }
        console.log(boardPreview)
    
    if (boardPreview.img) {
			showImage = true;

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result);
        boardPreview = {
            color:color,
            name:name,
            img:reader.result
        }
        console.log(reader.result)
      });
      
      reader.readAsDataURL(boardPreview.img);
			
			return;
    }else if(board.img != ""){
        showImage = true;
        image.setAttribute("src", `http://127.0.0.1:8090/api/files/${board.collectionId}/${board.id}/${board.img}`);
        return
    }
		showImage = false; 
  }
</script>


<main>

{#if name != "" || input?.files?.length || board.img != ""}
<div style="border-left: 4px solid {boardPreview.color}" class="board-header">

    {#if showImage}
    <div class="img-c">
        <img bind:this={image} src="http://127.0.0.1:8090/api/files/{board.collectionId}/{board.id}/{board.img}" alt="" />
    </div>
        
    {/if}
		

        <div>        
            <h1 class="board-name">{name}</h1>

            {#if board.id != ""}
            <div class="cards-length">id: {board.id}</div>
            {/if}
          </div>

</div>
{:else}
<h1 class="board-name"> Create board </h1>
{/if}

<div class="grid">
    <input class="name" on:change={handleChange} bind:value={name} />
    <input class="color" on:change={handleChange} type="color" bind:value={color} />
    
    <input
        class="file"
        bind:this={input}
        on:change={handleChange}
      type="file"
    />
    <div class="flex">
    {#if board.id != "" && name != "" }
        <button on:click={handleSend}>Edit board</button>
        <button class="alert" on:click={handleDelete}>Delete</button>
        {:else if name != ""}
        <button  on:click={handleSend}>Create new board</button>
    {/if}
    </div>


</main>

<style>

main{
    background:var(--card-bg);
    padding:30px;
    color:var(--button-bg);
    box-sizing: border-box;
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
    .img-c{
        border-radius: 10px;
                height: 80px;
                transition:all .2s;
                width: 80px;
                border:0px;
                overflow:hidden;
    }
        img {
            height: 100%;
            transition: all .2s;
            width: 100%;
            border: 0px;
            display: block;
            object-fit: cover;
        }

            .board-header{
                min-height: 80px;
                color:var(--board-title-color);
                padding:4px;
                margin-top:0px;
                margin-bottom:25px;
                display: flex;
                align-items: center;
                gap: 20px;
                padding-left:5px;
                width:100%;
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
