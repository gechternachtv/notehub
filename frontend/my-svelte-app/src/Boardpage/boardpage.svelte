<script>
    // @ts-nocheck
        import CreateBoard from '../CreateBoard/CreateBoard.svelte';

        import Card from '../Card/card.svelte';
        import Editor from './editor.svelte';
        
        import createNewCard from '../createNewCard'
        import Boardcard from '../Allboards/boardcard.svelte';
        import {pb} from '../pb.js';
        import Modal from '../modal/modal.svelte';
        let showModal = false;

    
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
           
            cards = e.detail.items;
        }
        async function handleDndFinalize(e) {
            console.log("%c drop details: -----","color:red")
            console.log(e);
            console.log("%c  -----","color:red")
            console.log(cards)
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
            const record = await pb.collection('boards').getOne(params.id, {
            expand: 'cards.tags',
        });
        // @ts-ignore
            board = record;
            // console.log(board)
            if(record?.expand){
                cards = cardFilter([...record.expand.cards])
            }
            // console.log(records)
            return board
        
        } catch (error) {
            console.warn(error)
        }
    }
    
    }
    
    let promise = getRecords()
    
    
    //array.sort((a, b) => a.id - b.id);
    
    
    const handleNewCard = async (e)=>{
    

    
        const card = await createNewCard(e.detail,pb)

        const data = {...card,tags:card.tags.map(e => e.id)};
    
        const cardrecord = await pb.collection('cards').create(data);

        const newcardlist = [cardrecord.id,...cards.map(e => e.id)]
        const boarddata = {
        "cards": newcardlist
        };

    const boardrecord = await pb.collection('boards').update(board.id, boarddata);

        
    card.id = cardrecord.id
    
        cards = cardFilter([card,...cards])
    
        board = boardrecord
    
    }
    

    const handleUpdate = async (e)=>{

    console.log(e.detail)
    if (e.detail.img === undefined || e.detail.img === ""){
        delete e.detail.img
    }
    if (e.detail.name === undefined || e.detail.name === ""){
        delete e.detail.name
    }
    if (e.detail.color === undefined || e.detail.color === ""){
        delete e.detail.color
    }

    console.log({...board,...e.detail})
    const record = await pb.collection('boards').update(board.id, {...board,...e.detail,cards:cards.map(e => e.id)});
    console.log(record)
    board = record
    
    }



    </script>
    <main>
    
    
        
        {#await promise then views}
    
        <div class="container">
            
            <Boardcard board={board}/>
            {#if editoropen}
            <div class="controls">
                <button on:click={() => (showModal = true)}> Edit board </button>
                </div>
            {/if}
            <div class="grid" use:dndzone={{items:cards,type:"cards",dropTargetStyle:{opacity:"0.6"},dropTargetClasses:["floating"],centreDraggedOnCursor:true}} on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
    
                {#each cards as card (card.id)}
                    <div class="card-container">
                        <Card card={card}/>
                    </div>
                    {/each}
                {#if cards.length < 1}
                     <div class="card-placeholder"></div>
                {/if}
            </div>
        </div>
        
        {#if true}
        <div class="con">
        <div class="editor">
            <Editor on:newcontent={handleNewCard} />
        </div>
        
        <div class="boardedit">

            <Modal bind:showModal>
                <CreateBoard on:newcontent={handleUpdate} board={board}/>
            </Modal>
        
        </div>
        </div>
        {/if}

    
        {/await}
    
    
    
    
    
    
    
    </main>
    
    <style>
            .con{
                display:grid;
                grid-template-columns: 1fr;
                gap:30px;
            }

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

                    display:grid;
        grid-template-columns: repeat( auto-fit, minmax(353px, 0.3fr) );
        gap:20px;
                    
                }
                .container{
                    max-width: 1370px;
                    margin: auto;
                    width: calc(100% - 36px);
                    padding-bottom: 30px;
                    max-height:100%;
                }
                @media only screen and (max-width: 991px){
                    .container{
                        gap: 10px
                    }
                }

    
              
    </style>