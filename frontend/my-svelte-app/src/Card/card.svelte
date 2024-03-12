<script>

// @ts-nocheck
        import {pb} from '../pb.js';
        
        export let card = {
            id:"",
            check:""
        }

        export let isNew = false;
        // console.log(card)


        const setInfo = (card)=>{
        checked = card.check === "done"
         created = new Date(card.created)
         date = {day:created.getDate() < 9 ?  `0${created.getDate()}` : created.getDate() ,
            month:(created.getMonth() + 1) < 9 ?  `0${created.getMonth() + 1}` : created.getMonth() + 1,
            year:created.getFullYear()}
            
        }


        let created,date;
        let checked = card.check === "done"
        const handleCheckbox = async ()=>{
            const record = await pb.collection('cards').update(card.id,{...card,check:(checked ? "done":"islist")} );
            console.log("%c record: -----","color:teal")
            console.log(record)
            card = record
            setInfo(card)
            console.log("%c -----","color:teal")
        }




        setInfo(card)



</script>

<main>


    <div class="card" class:newpost={isNew} style="border-left: 3px solid {card.color}">
        
        <div class="card-container">
            <div class="thumb">
                <div class="tooltip">
                    <!-- {#each channel.laspost.split("\n") as content} -->
                    <div><!-- {content} --> {card.id} </div>
                    <!-- {/each} -->
                </div>
                <a class="thumblink" href="/#/card/{card.id}">
                    <!-- {#if channel.thumb} -->
                    <!-- <img loading=lazy src="{channel.thumb}" alt=""> -->
                    <div class="img-c">
                        <img src="{card.img}" alt="">
                    </div>
                    <!-- {/if} -->
                </a>
                
            </div>
            <!-- <div class="title">{channel.name}</div> -->
            <!-- <div class="hostName">{channel.host}</div> -->
            <div class="title">

                <img style="max-width:16px" loading=lazy src="{card.favico}" alt=""> {card.title}</div> 
            <div class="link">{card.link ? card.link : card.img}</div>
            
            
                {#if card.check}
                {#if card.check === "done" || card.check === "islist"}
                <div class:checked={checked} class="inputholder">
                    <label><input type="checkbox" name="" bind:checked={checked} on:change={handleCheckbox}> done</label>
                </div>
                {/if}
                {/if}
            
            <div class="updates">{card.text}</div>
            <div class="date">📅 {date.year}/{date.month}/{date.day}</div>

            
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
        <div class="card-container feed-btn-container">
            {#if card.link != "" || card.img != ""}
            <div class="feed-btn"><a target="_blank" href="{card.link ? card.link : card.img}">visit 
                <svg fill="var(--button-color)" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="15px" height="15px"><path d="M 41.470703 4.9863281 A 1.50015 1.50015 0 0 0 41.308594 5 L 27.5 5 A 1.50015 1.50015 0 1 0 27.5 8 L 37.878906 8 L 22.439453 23.439453 A 1.50015 1.50015 0 1 0 24.560547 25.560547 L 40 10.121094 L 40 20.5 A 1.50015 1.50015 0 1 0 43 20.5 L 43 6.6894531 A 1.50015 1.50015 0 0 0 41.470703 4.9863281 z M 12.5 8 C 8.3754991 8 5 11.375499 5 15.5 L 5 35.5 C 5 39.624501 8.3754991 43 12.5 43 L 32.5 43 C 36.624501 43 40 39.624501 40 35.5 L 40 25.5 A 1.50015 1.50015 0 1 0 37 25.5 L 37 35.5 C 37 38.003499 35.003499 40 32.5 40 L 12.5 40 C 9.9965009 40 8 38.003499 8 35.5 L 8 15.5 C 8 12.996501 9.9965009 11 12.5 11 L 22.5 11 A 1.50015 1.50015 0 1 0 22.5 8 L 12.5 8 z"/></svg>
            </a></div>
            {/if}
            <div class="feed-btn"><a href="/#/card/{card.id}">more</a></div>
        </div>
    </div>

</main>

<style>

main{
    min-height:181px;
    height: 100%;
        width: 100%;
        display:block;
}
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

     .thumb img{
                width: auto;
                max-width: min(100%, 180px);
            }
    

            .card{
                background-color:var(--card-bg);
                padding:13px;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 20px;
                box-sizing: border-box;
                position:relative;
                /* box-shadow: 2px 3px 4px #00000026; */
                /* border-radius: 4px; */
                
            }
            @media only screen and (max-width: 568px){
                .card{
                    width:100%;
                }
            }


            .feed-btn a{
                background: var(--button-bg);
                color: var(--button-color);
                padding: 5px;
                font-weight: bold;
                font-size: 11px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .feed-btn a:hover {
                text-decoration: none;
            }

            .feed-btn-container{
                display: flex;
                gap: 10px;
                align-items: center;
                flex-wrap: wrap;
            }




            .title{
                font-weight: bold;
                color:var(--main-font-2);
            }
            .tags {
            font-size: 11px;
            opacity:0.8
            }

            .tags span{
            display: inline-block;
            margin-right: 4px;
            border-radius:5px;
            font-weight: bold;
            background:var(--header-bg);
            margin-bottom: 4px;
            padding: 1px 7px !important;
            color:white !important;
            
            }

            .link {
                font-size:10px;
                opacity:0.6;
                margin-bottom:1em;
                max-height: 36px;
                overflow: hidden;
            }

            .updates{
                font-size:11px;
                white-space: pre-wrap;
            }

            .tooltip {
            font-size: 10px;
            background: var(--button-color);
            color: var(--button-bg);
            padding: 14px;
            position: absolute;
            left: 0;
            top: 0;
            border: 1px solid;
            opacity:0;
            transition:all .3s;
            max-width: 100%;
            word-break: break-word;
            pointer-events: none;
            max-height: 180px;
            overflow: hidden;
            z-index: 2;
            }

            .thumb:hover .tooltip{
                opacity:1;
            }


            @media only screen and (max-width: 991px){
            .thumb a {
                    pointer-events: none;
                }
            }

            .newpost.card{
                max-width:100% ;
                width:100%;
            }
            .newpost .thumb img{
                max-width:60%;
            }

            .newpost .thumb:hover .tooltip{
                opacity:0;
            }
            .bulletlistitem{
                margin-bottom:7px
            }
            input{
                cursor:pointer;
            }
            .inputholder label{
                cursor:pointer;
                font-size:12px;
                opacity:0.6;
            }
            .inputholder{
            background-color: transparent;
            transition:background-color .3s;
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
                background-color: #5bfa5b54;
            }

.date {
    font-size: 12px;
  opacity: 0.7;
  margin-top: 17px;
}

.inputholder input {
  /* margin: 0 0 0.5em 0; */
  margin: 0px;
}



</style>