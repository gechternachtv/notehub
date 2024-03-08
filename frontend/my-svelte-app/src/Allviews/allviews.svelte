<script>
    import Boardcard from '../Allboards/boardcard.svelte';
    import {pb} from '../pb.js';
    
    import {dndzone} from "svelte-dnd-action";


    const records = async () => {
        const records = await pb.collection('views').getFullList({
            sort: '-created',
            expand: 'boards'
        });
        console.log(records)
        return records
    }
    const promise = records()


</script>

{#await promise then views}
    <!-- promise was fulfilled -->
    <div class="grid">
    {#each views as view}
         <!-- content here -->
            <div class="viewcard-container">
                <a href="/#/view/{view.id}" class="img" style="background-image:url('{view.img}')"></a>
                <div class="title"><a href="/#/view/{view.id}">{view.name}</a></div>
                <div class="boardlist">
                    {#each view.expand.boards as board}
                        <Boardcard small={true} board={board}/>
                    {/each}
                </div>
                <div class="controls">
                    <a href="/#/view/{view.id}">view</a>
                    <a href="/#/view/{view.id}">edit</a>
                </div>
            </div>
    {/each}
    </div>
{/await}

<style>
    .viewcard-container{
        border-radius: 10px;
        overflow: hidden;
    }

    .controls{
        margin: 20px 0;
    }
    .controls a{
        background: var(--button-bg);
        color: var(--button-color);
        padding: 5px 11px;
        font-weight: bold;
        font-size: 11px;
        border-radius: 8px;
        text-decoration:none;

    }
    .img{
        display:block;
        height:80px;
        background-position: bottom;
        background-size: cover;
        width: calc(100% + 44px);
        margin-left: -22px;
        margin-top: -22px;
        margin-bottom:22px;
    }
    .grid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap:20px;
    }
    .viewcard-container{
        background: var(--card-bg);
        padding: 22px;
        padding-bottom: 0;
    }
    .title{
        margin-bottom:10px;
    }
    .title a{
        font-weight: bold;
        font-size: 23px;
        color: var(--board-title-color);
        display:block;
        transition:all .3s;
    }
    .boardlist{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

</style>