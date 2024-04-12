<script>
    import {createEventDispatcher} from 'svelte';
    // import { pb } from './pb';
    
    import {localToken} from './stores.js'
    
    let showconfirmbox = false;
    const dispatch = createEventDispatcher();
    

    let name,publicperm;
    let users = ""

    const publicopt = [{value:"edit",desc:"edit - everyone can view and edit"},{value:"view",desc:"view - everyone can view, only members can edit"},{value:"private",desc:"private - only members can view and edit"}]


  function handleNew() {

   dispatch("new",{
    name:name,
    public:publicperm,
    users:[...users.split(","),$localToken.model.id]
   })
  }
</script>


<main>

<h1 class="board-name"> Create usergroup </h1>


<div class="grid">
    name : <input  bind:value={name} />
    permissions : <select bind:value={publicperm}>
        {#each publicopt as option, i}
          <option value={option.value}>{option.desc}</option>
        {/each}
      </select>
    members ids (values separated by comma, the creator is a user by default) : <input  bind:value={users} />
   

    </div>

    <button class="btn" on:click={handleNew}>Create</button>

</main>

<style>
    .file{
        margin-top:20px;
    }
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
                font-size: 1.1rem;
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
    font-size:1.2rem;
    opacity: 0.6;
  }
    

</style>
