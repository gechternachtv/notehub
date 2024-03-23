<script>

import {pb} from '../pb.js';

let tags = [];

const getTags = async ()=>{
    // fetch a paginated records list
    const records = await pb.collection('tags').getFullList({
    sort: 'created'
    });
    
    tags = [...records]
    // console.log(records)
}

const promise = getTags()


</script>
<main>
<div class="container">
    {#await promise then value}
    <div class="tags">
        {#each tags as tag}
    
            <span class="tag tag-{tag.id}" style="background:{tag.color};">{tag.name}</span>
    
        {/each}
    </div>
    {/await}

</div>






</main>

<style>
            .tags {
            font-size: 1.1rem;
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
            padding: 3px 7px !important;
            color:white !important;
            
            }
</style>