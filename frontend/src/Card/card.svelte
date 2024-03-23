<script>
    


// @ts-nocheck
        import  {pop} from 'svelte-spa-router'
        import {pb} from '../pb.js';
        import { createEventDispatcher } from 'svelte';
        import dateFormat from '../dateFormat.js';
        import getFile from '../getFile.js';
        import Confirmaction from '../confirmaction.svelte';
        import Modal from '../modal/modal.svelte';
        import Moveoptions from './moveoptions.svelte';
        export let card = {
            id:"",
            check:""
        }
        export let fullView = false;
        export let listView = false;
        console.log(card)

        let date;
        let showconfirmbox = false
        let showModal = false
        const dispatch = createEventDispatcher()
        const setInfo = (card)=>{
        checked = card.check === "done"
         date = dateFormat(new Date(card.created))
            
        }
        window.scrollTo(0,0);
        const handleDelete = async (e)=>{
        await pb.collection('cards').delete(card.id);
        pop()
        }


        const linkPreview = (c)=>{
            const icon = c.link ? "🔗 " : c.imglink ? "🔗 " : c.file ? (
                getFile(c).type === "image/jpeg" ? "🖼️" :
                getFile(c).type === "Video" ? "🎞️" :
                getFile(c).type === "Audio" ? "🔈" : "📄" 
            ) : ""

            const link = c.link ? c.link : c.imglink ? c.imglink : c.file ? c.file : ""
            const limitlink = link.slice(0, 80)
            return `${icon} ${limitlink} ${link.length > 80 ? ". . ." : ""}`
        }
        
        let checked = card.check === "done"
        const handleCheckbox = async ()=>{
            const record = await pb.collection('cards').update(card.id,
            {...card,
                check:(checked ? "done":"islist"),
                logs:[...card.logs,`card marked as ${checked ? "completed" :"incomplete"} at ${dateFormat(new Date())}`]
            } );
            card = record
            setInfo(card)
            dispatch("updatefront",card)
            
        }
        // const handlemovetoBoard = async ()=>{ console.log("hey")}
        const handlemovetoBoard = async ()=>{
            showModal=true
            // movetoBoard("tw5augb2ospnnzx")
        }

        const movetoBoard = async (boardtoinsert)=>{
            showModal=false
            const currentboard = await pb.collection('boards').getOne(card.board);
            await pb.collection('boards').update(card.board, {...currentboard,cards:currentboard.cards.filter(e => e != card.id)});
            
            const newboard = await pb.collection('boards').getOne(boardtoinsert);
            await pb.collection('boards').update(boardtoinsert, {...newboard,cards:[card.id,...newboard.cards]});


            const record = await pb.collection('cards').update(card.id, {...card,board:boardtoinsert});

            card = record

            
        }


        setInfo(card)


        // console.log(getFile(card))

</script>



    <div class="card" class:fullview={fullView} class:listview={listView} style="border-left: 3px solid {card.color}">
        <Modal bind:showModal>
            <Moveoptions currentboard={card.board} on:submit={(e)=>{movetoBoard(e.detail)}}></Moveoptions>
        </Modal>
        <!-- {card.board} -->
        <!-- <object title="stealth_operation_8VgOQaQdlq.mp3" data="{card.img}">Cannot preview the file.</object> -->
        
        <div class="card-container card-container---image">
            <slot name="grabber" />
            <div class="thumb">

                    <!-- {#if channel.thumb} -->
                    <!-- <img loading=lazy src="{channel.thumb}" alt=""> -->
                    <a class="img-c thumblink" href="/#/card/{card.id}">

                        {#if card.file}
                            {#if getFile(card).type === "image/jpeg"}
                                <img src="{getFile(card).link}" alt="">   
                            {:else if getFile(card).type && fullView}
                                    <object title="{card.id}" data="{getFile(card).link}"><a href="{getFile(card).link}" target="_blank">{card.file}</a></object>
                            {/if}
                        {:else if card.imglink}
                            <img src="{card.imglink}" alt="">
                        {/if}

                        
                    
                    <!-- {/if} -->
                </a>
                
            </div>
        </div>
        <div class="card-container card-container---info">
            <!-- <div class="title">{channel.name}</div> -->
            <!-- <div class="hostName">{channel.host}</div> -->
            <a class="nodeco" href="/#/card/{card.id}">
            <div class="title">
                <img style="max-width:16px" loading=lazy src="{card.favico}" alt=""> {card.title}
            </div> 
            <div class="link">{linkPreview(card)}</div> 
            </a>
            {#if card.check}
                {#if card.check === "done" || card.check === "islist"}
                <div class:checked={checked} class="inputholder">
                    <label><input type="checkbox" name="" bind:checked={checked} on:change={handleCheckbox}> done</label>
                </div>
                {/if}
            {/if}

            <a class="nodeco" href="/#/card/{card.id}">
                <div class="updates">{card.text}</div>
            </a>
            <div class="date">📅 {date}</div>

            {#if card.expand?.tags}
                {#if card.expand.tags.length > 0 }

                <div class="tags">
                    {#each card.expand.tags as tag} 
                    {#if tag.name != undefined}
                        <span class="tag" style="background:{tag.color};">{tag.name}</span>
                    {/if}
                    {/each}
                </div>
                
                {/if}
            {/if}

            {#if card.tags}
                {#if card.tags.length > 0 } 
                <div class="tags">
                    {#each card.tags as tag} 
                    {#if tag.name != undefined}
                        <span class="tag" style="background:{tag.color};">{tag.name}</span>
                    {/if}
                    {/each}
                </div>
                {/if}
            {/if}

        </div>

        <div class="card-container card-container---controls">


            <div class="controls editor-panel">

                {#if card.link != "" || card.imglink != "" || card.file != ""}
                <div class="feed-btn"><a target="_blank" href="{card.link ? card.link : card.imglink ? card.imglink : getFile(card).link}"> 
                    <svg fill="var(--button-color)" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="15px" height="15px"><path d="M 41.470703 4.9863281 A 1.50015 1.50015 0 0 0 41.308594 5 L 27.5 5 A 1.50015 1.50015 0 1 0 27.5 8 L 37.878906 8 L 22.439453 23.439453 A 1.50015 1.50015 0 1 0 24.560547 25.560547 L 40 10.121094 L 40 20.5 A 1.50015 1.50015 0 1 0 43 20.5 L 43 6.6894531 A 1.50015 1.50015 0 0 0 41.470703 4.9863281 z M 12.5 8 C 8.3754991 8 5 11.375499 5 15.5 L 5 35.5 C 5 39.624501 8.3754991 43 12.5 43 L 32.5 43 C 36.624501 43 40 39.624501 40 35.5 L 40 25.5 A 1.50015 1.50015 0 1 0 37 25.5 L 37 35.5 C 37 38.003499 35.003499 40 32.5 40 L 12.5 40 C 9.9965009 40 8 38.003499 8 35.5 L 8 15.5 C 8 12.996501 9.9965009 11 12.5 11 L 22.5 11 A 1.50015 1.50015 0 1 0 22.5 8 L 12.5 8 z"/></svg>
                </a></div>
                {/if}
            {#if fullView}
            
                <button class="" on:click={handlemovetoBoard}>move ➜</button>
                <a href="/#/board/{card.board}">current board</a>
                <button class="alert" on:click={()=>showconfirmbox=true}>delete</button>
                
            
            {:else}
            
            <a href="/#/card/{card.id}">more</a>  
                  

            {/if}
            </div>   
            

        </div>
        <Confirmaction show={showconfirmbox} on:close={()=>{showconfirmbox=false}} on:confirm={()=>{handleDelete()}}>
            Are you sure you want to delete this card?
        </Confirmaction>
        {#if fullView}
        <div class="tooltip">
            <!-- {#each channel.laspost.split("\n") as content} -->
            <div><!-- {content} -->id: {card.id} </div>
            <!-- {/each} -->
        </div>
            {#if card.logs}
            <div class="log-container">
                {#if card.logs.length > 1}
                {#each card.logs as log}
                    <div class:completed={log.includes("completed")} class="log">{log}</div>
                {/each}
                {/if}

            </div>
        {/if}

        {/if}
    </div>






<style>

.nodeco{
    text-decoration: none;
}
button, .btn {
  min-height: 26px;
}


.card{
                background-color:var(--card-bg);
                padding:13px;
                width: 100%;
                display: grid;
                justify-content: space-between;
                gap: 5px;
                box-sizing: border-box;
                position:relative;
                /* box-shadow: 2px 3px 4px #00000026; */
                /* border-radius: 4px; */
                height: 100%;
                display:grid;
                grid-row: span 3;
                grid-column: span 3;
                grid-template-rows: subgrid;
                overflow:hidden;
            }

            .card.listview{
                grid-template-rows: auto;
                grid-template-columns: subgrid;
                gap:14px;
                min-height: 83px;
                max-width:100%;
            }



            @container card-container (max-width: 768px) {

                }

    .card-container---controls{
                display: flex;
                gap: 10px;
                align-items: center;
                flex-wrap: wrap;
                z-index: 2;
            }


            .img-c{
        display:block;
    }
     .img-c object,.img-c img{
                width: auto;
                max-width: 100%;
                max-height: 200px;
            }




    .log-container{
        max-height:100px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        margin-top:20px;
    }
.log {
    font-size:1.2rem;
    opacity:0.6;
    margin: 3px;
    padding: 3px;
border-radius: 5px;
display: flex;
align-content: center;
align-items: center;
padding-left: 8px;
}

.completed{
    background: #008062;
color: var(--button-color);
}
/* main{
    min-height:181px;
    height: 100%;
        width: 100%;
        display:contents;
} */
    .tags{
        margin-top:10px;
    }

    .thumb{
        /* min-height: 100px; */
        cursor:pointer;
    }

    .thumblink{
        display: block;
        width: 100%;
        /* min-height: 100px; */
    }

            .feed-btn a, .editor-panel a{
                background: var(--button-bg);
                color: var(--button-color);
                padding: 5px;
                font-weight: bold;
                font-size: 1.1rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 5px;
                text-decoration: none;
                min-height: 26px;
            }

            .feed-btn a:hover {
                text-decoration: none;
            }







            .title{
                font-weight: bold;
                color:var(--main-font-2);
                font-size: 1.3rem;
                margin-bottom: 5px;
            }
            .tags {
            font-size: 1.1rem;
            opacity:0.8
            }

            .tags span{
            display: inline-block;
            margin-right: 4px;
            border-radius:5px;
            font-weight: bold;
            background:var(--header-bg);
            margin-bottom: 4px;
            padding: 3px 7px !important;
            color:white !important;
            
            }

            .link {
                font-size:1.0rem;
                opacity:0.6;
                margin-bottom:1em;
                max-height: 36px;
                overflow: hidden;
            }

            .updates{
                font-size:1.1rem;
                white-space: pre-wrap;
                overflow: hidden;
                max-height:8ch;
            }

            .fullview .updates , .listview .updates{
                max-height: unset;
            }

            .tooltip {
            font-size: 1.0rem;
            color: var(--button-bg);
            padding: 14px;
            max-width: 100%;
            word-break: break-word;
            pointer-events: none;
            max-height: 180px;
            z-index: 2;
            opacity:1
            }

            .thumb .tooltip{
                opacity:1;
            }


            @media only screen and (max-width: 991px){
            .thumb a {
                    pointer-events: none;
                }
            }

            .fullview.card{
                max-height: unset;
                max-width:100% ;
                width:100%;
            }
            .fullview .img-c object,.fullview .img-c img{
                max-height: 800px;
                max-width:100%;
            }

            .fullview .img-c object{
                width:100%;
            }
            



            input{
                cursor:pointer;
            }
            .inputholder label{
                cursor:pointer;
                font-size:1.2rem;
                opacity:0.6;
            }
            .inputholder{
            background-color: transparent;
            /* transition:background-color .3s; */
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            max-width: 59px;
            border-radius: 7px;
            margin-bottom: 7px;
            }

            .inputholder label {
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            padding: 2px;
            gap:4px;
            line-height: 0;
 
            }
            .checked{
                background-color: #008062;
            }

.date {
    font-size: 1.2rem;
  opacity: 0.7;
  margin-top: 17px;
}

.inputholder input {
  margin: 0px;
}

.card.listview .date {
  position: absolute;

  top: -10px;
right: 26px;
}


.card.listview .card-container---controls {
  align-items: flex-end;
  justify-content: end;
  position: absolute;
  bottom: 10px;
  right: 12px;
}

.listview .updates {
  max-width:87%;
}

@media(max-width:991px){
    .feed-btn a, .editor-panel a{
        padding: 10px;
    }
}


</style>