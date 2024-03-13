<script>
    // @ts-nocheck
        import CreateBoard from '../CreateBoard/CreateBoard.svelte';
        import dateFormat from '../dateFormat';
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
    
    
        let file;
    
        //flip
    
        let cards = board.cards


        let counter = cards.length

        function handleDndConsider(e) {
            
            cards = e.detail.items;
        }
        async function handleDndFinalize(e) {
            console.log("%c drop details: -----","color:teal")
            console.log(counter,cards)
            console.log(board.name)
            console.log(e.detail.info)
            console.log("%c  -----","color:red")
            // console.log(cards)
            //log

            //
            
            cards = e.detail.items;
            
            
            if(counter<cards.length){
                const card = cards.find(o => o.id === e.detail.info.id)
                if(board.name === "done"){
                    card.check = "done"
                }
                const carddata = {card, logs:[...card.logs,`moved the card to ${board.name} - ${dateFormat(new Date())}`]}
                await pb.collection('cards').update(e.detail.info.id,carddata);
                
            }
            const record = await pb.collection('boards').update(params.id, {cards:e.detail.items.map(e => e.id)});
            board = record
            // console.log(record)


            counter = cards.length
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
                counter = cards.length
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
    

        const card = await createNewCard(e.detail,pb,file)

        const data = {...card,
            tags:card.tags.map(e => e.id),
            logs:[`card created on ${board.name} at ${dateFormat(new Date())}`]
        };
    
        const cardrecord = await pb.collection('cards').create(data);

        const newcardlist = [cardrecord.id,...cards.map(e => e.id)]
        const boarddata = {
        "cards": newcardlist
        };

        const boardrecord = await pb.collection('boards').update(board.id, boarddata);

        
        card.id = cardrecord.id
    
        cards = cardFilter([{...cardrecord,tags:card.tags},...cards])
    
        board = boardrecord

        file.value = ""
    
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

    const cardUpdateFront = (e)=>{
        console.log(e)
        const cardNewInfo = e.detail
        const oldinfoCard = cards[cards.findIndex(e => e.id === cardNewInfo.id)]
        cards[cards.findIndex(e => e.id === cardNewInfo.id)] = {...cardNewInfo,expand:oldinfoCard.expand}
        board.cards = cards
        board = board
        console.log(board.cards)
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
            <div class="grid" use:dndzone={{items:cards,
                type:"cards",
                dropTargetStyle:{opacity:"0.6"}
                ,dropTargetClasses:["floating"]
                ,centreDraggedOnCursor:true}
                } on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
    
                {#each cards as card (card.id)}
                    <div class="card-container">
                        <Card card={card} on:updatefront={cardUpdateFront}/>
                    </div>
                    {/each}
                {#if cards.length < 1}
                     <div class="card-placeholder"></div>
                {/if}
            </div>
        </div>
        
        {#if true}
        <div class="con">
            
            <!-- <button on:click={()=>{document.querySelector(`input[type="file"]`).click()}}>upload file...</button> -->
        <div class="editor">
            <Editor on:newcontent={handleNewCard} >
                <input bind:this={file} type="file"/>
                <!-- <button type="button" on:click={()=>{file.click()}}>file...</button> -->
            </Editor>
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
                    /* transition: all .3s; */
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