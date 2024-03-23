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
        import { push } from 'svelte-spa-router';
        import { onDestroy } from 'svelte';
        import {createEventDispatcher} from 'svelte';

        const dispatch = createEventDispatcher();


        let showModal = false;
        let boardisactive = true;
    
    //flip

        import {dndzone} from "svelte-dnd-action";
    

        export let boardpage = true
        export let board = {
            id:"",
            name:"",
            image:"",
            color:"",
            cards:[]
        }
        export let listView;
        
    
        export let params = {id:board.id}
    
        let dragDisabled = true;
        let fileelement;
        let files;
        let editorBlocked = false;
        let editorOpen = false;
        //flip
    
        let cards = board.expand?.cards ? board.expand.cards : board.cards

        console.log("%c =-=====","font-size:30px;color:teal")
        console.log(board)

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
                    card.logs = [...card.logs,`card marked as "completed" at ${dateFormat(new Date())}`]
                }
                const carddata = {...card, logs:[...card.logs,`moved the card to ${board.name} - ${dateFormat(new Date())}`],board:board.id}

                console.log(carddata);
                await pb.collection('cards').update(e.detail.info.id,carddata);
                
            }
            
            
            const record = await pb.collection('boards').update(params.id, {cards:e.detail.items.map(e => e.id)});
            board = {...record,cards:cards}
            dispatch('boardupdate',{...board,cards:cards})
            
            
            // console.log(record)


            counter = cards.length
            // dragDisabled = true
        }
    
        //
    
    const cardFilter = (cards)=>{
        
        return cards
    }
    
    async function getRecords(){
    
        if(params.id && !params.id.includes("dnd-shadow-placeholder")){
        try {   
            if(board.id === ""){
                const record = await pb.collection('boards').getOne(params.id, {
                expand: 'cards.tags',
            });
        // @ts-ignore
            board = record;
            dispatch('boardupdate',board)
            // console.log(board)
            if(record?.expand){
                cards = cardFilter([...record.expand.cards])
                counter = cards.length
            }
            // console.log(records)



            }

            pb.collection('boards').subscribe(params.id, (e)=> {
                console.log(`%c ${e.action} event on ${board.id}`,"background:turquoise;color:red;font-size:20px")
                console.log(e.record);

                if(e.action === "update"){
                    board = e.record
                    
                        if(e.record?.expand){
                            console.log(cardFilter([...e.record.expand.cards]))
                            cards = cardFilter([...e.record.expand.cards])
                            counter = cards.length
                            dispatch('boardupdate',{...board,cards:cards})
                        }else{
                            cards = []
                            dispatch('boardupdate',{...board,cards:[]})
                        }
                }else if(e.action === "delete"){
                    boardisactive = false
                    pb.collection('boards').unsubscribe(params.id);
                    console.log("deleted!");
                }
                console.log("%c ------","color:teal")
                // views = e.record
        }, { expand: 'cards.tags' });





















            return board
        
        } catch (error) {
            console.warn(error)
        }
    }
    
    }
    

    onDestroy(() => {
                    pb.collection('boards').unsubscribe(params.id);
                });

    let promise = getRecords()
    
    
    //array.sort((a, b) => a.id - b.id);
    
    
    const handleNewCard = async (e)=>{
    
        editorBlocked = true
        const card = await createNewCard(e.detail,pb,fileelement)

        const data = {...card,
            tags:card.tags.map(e => e.id),
            logs:[`card created on ${board.name} at ${dateFormat(new Date())}`],
            board:board.id
        };
    
        const cardrecord = await pb.collection('cards').create(data);

        const newcardlist = [cardrecord.id,...cards.map(e => e.id)]
        const boarddata = {
        "cards": newcardlist
        };

        const boardrecord = await pb.collection('boards').update(board.id, boarddata);

        
        // card.id = cardrecord.id
    
        // cards = cardFilter([{...cardrecord,tags:card.tags},...cards])
    
        // board = boardrecord

        fileelement.value = ""
        files = fileelement.files
        window.scrollTo(0,0);
        editorBlocked = false
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
    board = record;
    dispatch('boardupdate',board)
    showModal = false;
    }

    const cardUpdateFront = (e)=>{
        console.log(e)
        const cardNewInfo = e.detail
        const oldinfoCard = cards[cards.findIndex(e => e.id === cardNewInfo.id)]
        cards[cards.findIndex(e => e.id === cardNewInfo.id)] = {...cardNewInfo,expand:oldinfoCard.expand}
        board.cards = cards
        board = board
        dispatch('boardupdate',board)
        console.log(board.cards)
    }

    if(listView === undefined){
        listView = !!window.localStorage.getItem("listView")
    }
    const handleListViewChange = ()=>{
        if(!window.localStorage.getItem("listView")){
            window.localStorage.setItem("listView",true)
            listView = true
        }else{
            window.localStorage.removeItem("listView")
            listView = false
        }
    }

    </script>


    <main>
    
    {#if boardisactive}
         <!-- content here -->

        
        {#await promise then views}
    
        <div class="container">
            <!-- {board.id} -->
            <Boardcard board={board}/>
            {#if boardpage}
            <div class="controls">
                <button on:click={() => (showModal = true)}> Edit board </button>
                <button on:click={handleListViewChange}> {listView ? "Card mode" : "List mode"} </button>    
            </div>
            {:else}
                <button class="editorOpentoggle" on:click={()=>editorOpen=!editorOpen}>{editorOpen ? "-" : "+"}</button>
            {/if}

            <div class="grid-container">
                
                <div class="grid"
                class:list={listView} use:dndzone={{items:cards,
                    morphDisabled:true,
                    dragDisabled:dragDisabled,
                    type:"cards",
                    dropTargetStyle:{opacity:"0.6"}
                    ,dropTargetClasses:["floating"]
                    }
                    } on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">

                    
                        
                        {#each cards as card (card.id)}
                            
                        <Card listView={listView} card={card} on:updatefront={cardUpdateFront}>
                            <div class="grabber" slot="grabber" 
                            on:focus={()=>dragDisabled = false}
                            on:mouseover={()=>dragDisabled = false} on:mouseleave={() => {dragDisabled = true}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" transform="matrix(1, 0, 0, 1, 0, 0)"><path d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5-9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="var(--button-bg)"/></svg>
                            </div>
                        </Card>
                            
                    
                        {/each}
                    

                        {#if cards?.length < 1}
                            <div class="card-placeholder"></div>
                        {/if}
                </div>

                {#if  editorOpen}
                <div class="con conworkspace">
                    <div class:editorBlocked={editorBlocked} class="editor">
                        <Editor bind:editorBlocked bind:files bind:fileelement on:newcontent={handleNewCard} ></Editor>
                    </div>
                </div>
                {/if}

            </div>


            {#if boardpage}
            <div class="con condesktop">
                <div class:editorBlocked={editorBlocked} class="editor">
                    <Editor bind:editorBlocked bind:files bind:fileelement on:newcontent={handleNewCard} ></Editor>
                </div>
                
                <div class="boardedit">

                    <Modal bind:showModal>
                        <CreateBoard on:newcontent={handleUpdate} board={board}/>
                    </Modal>
                
                </div>
            </div>
            {/if}

        </div>

        

 
            




  
  

    
        {/await}
    
    
        {:else}
        this board was deleted
        {/if}
    
    
    
    
    </main>
    
    <style>

        main{
            position: relative;
        }
        
        .grabber{
            position: absolute;
            right: 15px;
            z-index: 2;
            right: 0;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            left: -5px;
            padding: 5px 0px;
            top: 0;
            padding-right: 5px;
        }
            .con{
                display:grid;
                grid-template-columns: 1fr;
            }

                .card-placeholder{
                    display:block;
                    background:rgba(0, 0, 0, 0.021);
                    min-height:110px;
                    width:100%;
                    pointer-events: none;
                    grid-column: span 3;
                }
                main{
                    background:var(--container-bg);
                    color:var(--main-font-1);
                    margin:auto;
                    /* max-width: var(--container); */
                    width:100%;
                    /* padding-bottom: 20px; */
                    
                }
    
                .grid{
                    gap:20px;     
                    opacity:1;     
                    min-height:150px;
                    display:grid;
                    margin-bottom: 19px;
                    gap:15px;
                    grid-template-columns: repeat(12, minmax(70px, 1fr));
                    /* background:rgba(0, 0, 0, 0.116); */;
                    container-type: inline-size;
                    container-name: card-container;
                    

                }

                .grid-container{
                    max-height: var(--board-height); 
                    overflow: auto;
                }

                @container card-container (max-width: 1100px) {
                    .grid {
                        grid-template-columns: repeat(9, minmax(70px, 1fr));
                        
                    }
                }      

                @container card-container (max-width: 768px) {
                    .grid {
                        grid-template-columns: repeat(6, minmax(70px, 1fr));
                        
                    }
                }

                @container card-container (max-width: 600px) {
                    .grid {
                        grid-template-columns: repeat(3, minmax(70px, 1fr));
                        
                    }
                }


                .grid.list{
                    grid-template-columns: 190px 1fr auto;
                    gap:3px;

                }
                .container{
                    padding:0px;
                    container-type: inline-size;
                    container-name: card-container;
                }



        .con{
            position:sticky;
            width: 100%;
            bottom: 0;
            border-top:4px solid var(--container-bg)
        }
        .editorOpentoggle{

        position: absolute;
        top:18px;right:20px;
        padding:6px 8px;
        border-radius: 6px
        }
              
    </style>