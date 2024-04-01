<script>
 import Themeswitch from './themeswitch.svelte';
 import {location} from 'svelte-spa-router'
  import Router from 'svelte-spa-router';
    import Board from './Boardpage/boardpage.svelte';
      import Workspaceview from './workspacepage/workspacepage.svelte';
      import Card from './Cardpage/cardpage.svelte';
      import Allboards from './Allboards/allboards.svelte';
    import Allworkspaces from './Allworkspaces/allworkspaces.svelte';
// import Sortgrid from './Boardpage/sortcardsgrid.svelte';

    console.log(import.meta.env)
    
</script>
        

<svelte:head>
  <title>notehub</title>
</svelte:head>





<main>



<nav>
  


  <a  class:active={$location === "/"} href="/#/">Workspaces</a>
  <a  class:active={$location === "/allboards"} href="/#/allboards">All Boards </a>
  
  <div class="settings">
  <Themeswitch/> 
  </div>

</nav>
<!-- <Sortgrid></Sortgrid> -->
<div class="app">
<Router routes={{
  '/board/:id': Board,
  '/card/:id': Card,
  '/allboards/': Allboards,
  '/workspace/:id': Workspaceview,
  '/': Allworkspaces
}} />



</div>



</main>
    
        
        <style>


.app {
  padding: var(--bodypadding);
  padding-bottom: 0px;
  min-height: calc(100vh - var(--bodypadding));
  position:relative;
}


  nav{
    background:var(--header-bg);
        /* display: flex; */
    display: flex;
grid-template-columns: auto auto 1fr;
font-size: 1.1rem;
                position: sticky;
                top: 0;
z-index: 2;
justify-content: flex-end;
  }
  nav a {
    color:var(--header-color);
    text-decoration: none;
    padding-right: 20px;
    padding: 7px;
    display: block;
    min-width: 72px;
    text-align: center;
    box-sizing: border-box;
  }
  @media(max-width:991px){
    nav a {
      padding: 14px 16px;
    }
  }
  nav a.active{
    border-bottom: 4px solid var(--header-color);
    font-weight: bold;
  }
  .settings{
    display: flex;
    align-content: center;
    justify-content: flex-end;
  }
@media(max-width:376px){
  .settings {
    grid-column: span 4;
    margin-top: 9px;
    }
}

            main{
                background:var(--container-bg);
                color:var(--main-font-1);
                margin:auto;
                max-width: 1440px;
                width:100vw;
                /* padding-bottom: 40px; */
            }

            @media (max-width:991px){
              nav {
                position: sticky;
                z-index: 9;
                width: 100%;
                top:0;
              }


            }
        </style>