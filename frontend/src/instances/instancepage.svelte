<script>
    import Allworkspaces from "../Allworkspaces/allworkspaces.svelte";
    import Allboards from "../Allboards/allboards.svelte";
    import { pb } from "../pb";

    export let params;

    const userGroup = pb.collection('instance').getOne(params.instance, {
            fields: 'name,public,expand',
            expand: "users"
        });
</script>

{#await userGroup}
    <!-- promise is pending -->
{:then e}
<div class="titlecontainer">
    <h1>{e.name}</h1>
    <div class="public">{e.public != "private" ? "permission: " : ""}{e.public}</div>
    
</div>

{#if e.expand?.users}
    <div class="users-container">
        {#each e.expand.users as user}
        <div class="userbox">
            <div class="navavatar">
            <img loading="lazy" src="{import.meta.env.VITE_API_URL}/api/files/_pb_users_auth_/{user.id}/{user.avatar}?thumb=40x40"/>
            </div>
            {user.name}
        </div>
            
        {/each}
    </div>
    {/if}

{:catch error}
    {error}
{/await}

<Allworkspaces params={{instance:params.instance}}></Allworkspaces>

<Allboards params={{instance:params.instance}}></Allboards>

<style>
    h1 {
        font-size:32px;
    }

    .public{
        font-weight: bold;
  background: var(--header-bg);
  color: var(--header-color);
  width: fit-content;
  padding: 3px 8px;
  border-radius: 6px;
  
  display: flex;
  align-items: center;
  margin-bottom:15px;
  margin-top:15px;

    }
    .titlecontainer{
        display:flex;
        align-items:center;
        gap:20px;
        flex-wrap: wrap;
    }
    .userbox{
        display:flex;
        align-items: center;
        gap: 10px;
        background: #ffffff0f;
        overflow: hidden;
        border-radius: 9px;
        padding: 0 9px 0 0;

    }
    .users-container{
        display:flex;
        flex-wrap: wrap;
        gap:30px;
    }

    .navavatar{
        width:39px;
        height:39px;
        overflow: hidden;
    }
    .navavatar img{
        object-fit: contain;
        height:39px;
    }
</style>