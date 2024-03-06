<script>
	// @ts-ignore
	import Board from './boardcard.svelte';
    import {pb} from '../pb.js';

let boards = [];

(async ()=>{
    // fetch a paginated records list
    const records = await pb.collection('boards').getFullList({
    sort: 'created',
    expand: 'tags',
    });
    
    boards = [...records]
    console.log(records)
})()





const handleNewBoard = async (e)=>{




    const data = {
    "cards": e.cards,
    "card_order": e.card_order,
    "header": e.image,
    "color": e.color,
    "name":e.name
    };

    const record = await pb.collection('boards').create(data);
    e.id = record.id
    boards.push(e);
    boards = boards
    
}


</script>
<main>

<div class="container">

    <div class="grid">
        {#each boards as board}
        <Board board={board}/>
        {/each}
    </div>
</div>







</main>

<style>
            main{
                background:var(--container-bg);
                color:var(--main-font-1);
                margin:auto;
                max-width: var(--container);
                width:100%;
                padding-bottom: 40px;
            }
           
            .grid{
                display: flex;
                gap:20px;
                flex-wrap: wrap;
                flex-direction: row;
            }
            .container{
                max-width: 1370px;
                margin: auto;
                width: calc(100% - 20px);
                padding-bottom: 30px;
            }
            @media only screen and (max-width: 991px){
                .container{
                    gap: 10px
                }
            }
            .main-container {
            display: grid;
            grid-template-columns: 134px 1fr;
            gap: 20px;
            }
            @media only screen and (max-width: 568px){
                .main-container {
                gap:0px;
                grid-template-columns:114px 1fr;
                }
            }

            button.updateall {
            background: var(--button-bg);
            color: var(--button-color);
            padding: 5px;
            font-weight: 700;
            font-size: 12px;
            border-radius: 8px;
            border:0px;
            min-width: 100px;
            margin: 0;
            cursor: pointer;
            }

            .updateall.loading{
                opacity:0.8;
                pointer-events: none;
            }
            .result{
                font-size:10px;
                opacity: 0.7;
                display: flex;
                margin-left: 20px;
                align-items: center;
            }

        
            .container-header-buttons{

                display: flex;
                align-content: center;
                gap: 11px;
                margin: 17px 10px;

            }
            @media only screen and (max-width: 568px){
                .container-header-buttons button {
                    min-height: 43px
                }
            }
</style>