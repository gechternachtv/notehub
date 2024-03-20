<script>
    import Boardcard from '../Allboards/boardcard.svelte';
    // @ts-ignore
    import Createview from './createworkspace.svelte';
    import { push } from 'svelte-spa-router';
    import {pb} from '../pb.js';
    import {dndzone} from "svelte-dnd-action";
    import Modal from '../modal/modal.svelte';
    import { onDestroy } from 'svelte';
    let showModal = false;


    let views = []
    const records = async () => {
        const records = await pb.collection('views').getFullList({
            sort: '-created',
            expand: 'boards'
        });
        console.log(records)
        views = records
        return records
    }
    const promise = records()

    const handleNewView = async (e)=>{
    const data = e.detail
    const record = await pb.collection('views').create(data);
    // const viewfull = await pb.collection('views').getOne(record.id, {
    //     expand: 'boards',
    // });
    //     views.unshift({...viewfull});
    //     views = views;
    //     console.log(data)
        push(`/workspace/${record.id}`)
    
}


pb.collection('views').subscribe('*', (e)=> {
    console.log("%c subscribe!","color:teal")
    console.log(e.action);
    console.log(e.record);

    if(e.action === "create"){
        views = [...views,e.record]
    }else if(e.action === "update"){
        views = views.map(a => a.id === e.record.id ? e.record : a);
    }else if(e.action === "delete"){
        views = views.filter(a => a.id != e.record.id)
    }
    console.log("%c ------","color:teal")
    // views = e.record
}, { expand: 'boards' });

onDestroy(()=>{
    pb.collection('views').unsubscribe("*");
})

</script>

{#await promise then res}
    <div class="grid">
    {#each views as view}
            <div class="viewcard-container">
                <a href="/#/workspace/{view.id}" class="img" >
                    {#if view.img}
                        <div class="img-c">
                            <img style="object-position: 0px {view.position}%;" src="{import.meta.env.VITE_API_URL}/api/files/{view.collectionId}/{view.id}/{view.img}" alt="">
                        </div>
                    {:else}
                         <div class="img-c" style="background-color:var(--gradient-col-1)"></div>
                    {/if}

                </a>
                <div class="title"><a href="/#/workspace/{view.id}">{view.name}</a></div>
                <div class="boardlist">
                    {#if view.expand?.boards}
                    {#each view.expand.boards as board}
                        <Boardcard small={true} board={board}/>
                    {/each}
                    {/if}

                </div>
                <div class="controls">
                    <!-- <a class="btn" href="/#/view/{view.id}">view</a> -->
                    <!-- <button on:click={()=>{console.log(view)}} class="btn">edit</button> -->
                    <!-- <button on:click={()=>{handledelete(view.id)}} class="btn alert">delete</button> -->
                </div>
            </div>
    {/each}
    </div>
{/await}
<div class="controls"><button on:click={() => (showModal = true)}> create workspace </button>
</div>

<Modal bind:showModal>
    <Createview on:newcontent={handleNewView}/>
</Modal>
<style>
    .viewcard-container{
        border-radius: 10px;
        overflow: hidden;
    }


    .alert{
        background:var(--alert)
    }
    .img-c{
        display:block;
        height:80px;
        background-position: bottom;
        background-size: cover;
        width: calc(100% + 44px);
        margin-left: -22px;
        margin-top: -22px;
        margin-bottom:22px;
    }
    img{
              height: 100%;
            transition: all .2s;
            width: 100%;
            border: 0px;
            display: block;
            object-fit: cover;
            height:80px;
            }
    .grid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap:20px;
    }
    @media (max-width:1075px){
        .grid{
            grid-template-columns: 1fr 1fr;
        }
    }
    @media (max-width:806px){
        .grid{
            grid-template-columns:1fr;
        }
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
        font-size: 2.3rem;
        color: var(--board-title-color);
        display:block;
        transition:all .3s;
    }
    .boardlist{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width:806px){
    .boardlist{
        grid-template-columns: 1fr;
    }
    }
</style>