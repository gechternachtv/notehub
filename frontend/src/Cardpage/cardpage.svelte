<script>
// @ts-nocheck
import dateFormat from '../dateFormat.js';
import  {pop} from 'svelte-spa-router'
import {pb} from '../pb.js';
import Editor from '../Boardpage/editor.svelte';
import Card from '../Card/card.svelte';
import createNewCard from '../createNewCard.js';
import { localToken } from '../stores.js';

export let params = {}

export let id = params.id;

console.log(params.id)



let showcard = {};
let cardid = ""
let fileelement;
let files;
let currentfile;
let editorBlocked = true;


const cardget = async()=>{
    if(id){
				try {
				const res = await pb.collection('cards').getOne(id,{expand: 'tags,board.instance'})
				console.log(res)

                // console.log(res);
                showcard = res
                cardid = res.id
                console.log(res)
                currentfile = res.file;
                editorBlocked = false;


                // console.log(showcard.expand?.board?.expand?.instance?.users.includes($localToken ? $localToken?.model.id : "???"))


                if(res.file){
                    files = [{name:res.file}]
                }
                
                return {
				type: 'json',
				value: {
						"type": "doc",
						"content": res.raw
						}
			};
            
                
                }catch(err){
                    console.warn(err)
                }
                
            }   
            
}
let promise = cardget()



const handleNewCard = async (e)=>{
    editorBlocked = true
    console.log(showcard)

    const card = await createNewCard(e.detail,fileelement,currentfile)
    const data = {...card,
        tags:card.tags.map(e => e.id),
        logs:[...showcard.logs,`card content updated ${dateFormat(new Date())}`],
        board:showcard.board
    };

    // console.log(data)
    const oldexpand = showcard.expand
    const record = await pb.collection('cards').update(cardid, data);
    console.log("%c record:","color:turquoise")
    console.log(record)
    showcard = {...record,tags:card.tags,expand:oldexpand}
    // files = fileelement.files
    if(record.file){
        files = [{name:record.file}]
    }
    editorBlocked = false
}










</script>

<main>



    {#await promise then defaultValue}

        {#if showcard.id}
       
        <div class:locked={!showcard.expand?.board?.expand?.instance?.users.includes($localToken ? $localToken?.model.id : "???")} class="grid">
            <div class="grid-ch grid-editor-container">        
                <Editor bind:editorBlocked bind:files bind:fileelement defaultValue={defaultValue} on:newcontent={handleNewCard} clearAllonEnter={false}></Editor>
                


            </div>
            <div class="grid-ch">
                <Card fullView={true} card={showcard}/>
            </div>

        </div>

        {/if}

    {:catch error}
	<p style="color: red">{error.message}</p>
{/await}



</main>

<style>
    main{
        padding:30px;
        box-sizing: border-box;
    }

            .grid{
                display:grid;
                grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
                gap:20px;
                
            }
            .grid-ch{
                max-width:100%;
            }
            .editor-panel{
                display:flex;
                gap:10px;
            }

            .locked .grid-editor-container {
                display:none;
            }

            .locked .grid-ch{
                max-width:700px;
                margin:auto;
                width:100%;
            }
            
</style>