<script>
    // @ts-nocheck
    
        import Card from '../Card/card.svelte';
        import Editor from './editor.svelte';
        
        import createNewCard from '../createNewCard'
        import Boardcard from '../Allboards/boardcard.svelte';
        import {pb} from '../pb.js';
    
    //flip
    
        import {dndzone} from "svelte-dnd-action";
    
    
        export let editoropen = true
        export let board = {
            id:"",
            name:"",
            image:"",
            color:"",
            cards:[]
        }
    
        export let params = {id:board.id}
    
    
        
    
        //flip
    
        let cards = []
        
        function handleDndConsider(e) {
            console.log(e.detail.items.map(e => e.id))
            cards = e.detail.items;
        }
        async function handleDndFinalize(e) {
            console.log(e.detail.items.map(e => e.id))
            cards = e.detail.items;
    
            const record = await pb.collection('boards').update(params.id, {cards:e.detail.items.map(e => e.id)});
            board = record
            // console.log(record)
        }
    
        //
    
    
        
    
        
        
    
        
    
    
    const cardFilter = (cards)=>{
        return cards
    }
    
    async function getRecords(){
    
        if(params.id && !params.id.includes("dnd-shadow-placeholder")){
        try {
            (async ()=>{
            
            const record = await pb.collection('boards').getOne(params.id, {
            expand: 'cards.tags',
        });
        // @ts-ignore
            board = record;
            console.log(record)
            if(record?.expand){
                cards = cardFilter([...record.expand.cards])
            }
            // console.log(records)
        })()   
        } catch (error) {
            console.warn(error)
        }
    }
    return cards
    }
    
    let promise = getRecords()
    
    
    //array.sort((a, b) => a.id - b.id);
    
    
    const handleNewCard = async (e)=>{
    
        console.log("%c e","color:green")
        console.log(e.detail)
    
        const card = await createNewCard(e.detail,pb)
        console.log(card)
        const data = {...card,tags:card.tags.map(e => e.id)};
    
        const cardrecord = await pb.collection('cards').create(data);
        console.log(`%c cardrecord`,`color:red`)
        console.log(cardrecord)
        const newcardlist = [cardrecord.id,...cards.map(e => e.id)]
        const boarddata = {
        "cards": newcardlist
        };
        console.log(`%c boarddata`,`color:turquoise`)
        console.log(boarddata);
    const boardrecord = await pb.collection('boards').update(board.id, boarddata);
        console.log(cardrecord);
        console.log(boardrecord);
        
    card.id = cardrecord.id
    
        cards = cardFilter([card,...cards])
    
        board = boardrecord
    
    }
    
    
    </script>
    <main>
    
    
        
        {#await promise then views}
    
        <div class="container">
            <Boardcard board={board}/>
            <div class="grid" use:dndzone={{items:cards,type:"cards",dropTargetStyle:{opacity:"0.6"}}} on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
    
                {#each cards as card (card.id)}
                    <div class="card-container">
                        <Card card={card} />
                    </div>
                    {/each}
                {#if cards.length < 1}
                     <div class="card-placeholder"></div>
                {/if}
            </div>
        </div>
        
        {#if editoropen}
        <div class="editor">
            <Editor on:newcontent={handleNewCard} />
        </div>
        {/if}
    
        {:catch error}
            <!-- promise was rejected -->
        {/await}
    
    
    
    
    
    
    
    </main>
    
    <style>
    
                .card-placeholder{
                    display:block;
                    background:rgba(0, 0, 0, 0.021);
                    min-height:110px;
                    width:100%;
                    pointer-events: none;
                }
                main{
                    background:var(--container-bg);
                    color:var(--main-font-1);
                    margin:auto;
                    max-width: var(--container);
                    width:100%;
                    padding-bottom: 20px;
                }
    
                .grid{
                    display: flex;
                    gap:20px;
                    flex-wrap: wrap;
                    flex-direction: row;
                    opacity:1;
                    transition: all .3s;
                    min-height:150px;
                    max-height: auto;
                     overflow:auto; 
                     max-height: calc(100vh - 450px); 
                    overflow: auto;
                    
                }
                .container{
                    max-width: 1370px;
                    margin: auto;
                    width: calc(100% - 20px);
                    padding-bottom: 30px;
                    max-height:100%;
                }
                @media only screen and (max-width: 991px){
                    .container{
                        gap: 10px
                    }
                }

    
              
    </style>