<script>

import {pb} from '../pb.js';

let tags = [];

(async ()=>{
    // fetch a paginated records list
    const records = await pb.collection('tags').getFullList({
    sort: 'created'
    });
    
    tags = [...records]
    // console.log(records)
})()




</script>
<main>
<div class="container">
    <div class="tags">
    {#each tags as tag}

        <span class="tag tag-{tag.id}" style="background:{tag.color};">{tag.name}</span>

    {/each}
</div>
</div>






</main>

<style>
            .tags {
            font-size: 11px;
            opacity:0.8;
            margin-bottom:20px;
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
</style>