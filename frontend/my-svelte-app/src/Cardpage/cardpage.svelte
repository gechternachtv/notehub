<script>
// @ts-nocheck
import dateFormat from '../dateFormat.js';
import  {pop} from 'svelte-spa-router'
import {pb} from '../pb.js';
import Editor from '../Boardpage/editor.svelte';
import Card from '../Card/card.svelte';
import createNewCard from '../createNewCard.js';

export let params = {}

export let id = params.id;

console.log(params.id)



let showcard = {};
let cardid = ""

const cardget = async()=>{
    if(id){
				try {
				const res = await pb.collection('cards').getOne(id,{expand: 'tags'})
				// console.log(params.get("id"))

                // console.log(res);
                showcard = res
                cardid = res.id
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

    console.log(showcard)

    const card = await createNewCard(e.detail,pb,file)
    const data = {...card,
        tags:card.tags.map(e => e.id),
        logs:[...showcard.logs,`card content updated ${dateFormat(new Date())}`]
    };

    // console.log(data)
    const record = await pb.collection('cards').update(cardid, data);
    console.log("%c record:","color:turquoise")
    console.log(record)
    showcard = {...record,tags:card.tags}
}


let file;







</script>

<main>



    {#await promise then defaultValue}

        {#if showcard.id}
        <div class="grid">
            <div class="grid-ch">        
                <Editor defaultValue={defaultValue} on:newcontent={handleNewCard} clearAllonEnter={false}>
                    <input bind:this={file} type="file"/>
                </Editor>
                


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
                grid-template-columns: 1fr 1fr;
                gap:20px;
            }
            .grid-ch{
                max-width:100%;
            }
            .editor-panel{
                display:flex;
                gap:10px;
            }
</style>