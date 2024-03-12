<script>
 import Themeswitch from './themeswitch.svelte';
 import {location} from 'svelte-spa-router'
  import Router from 'svelte-spa-router';
    import Board from './Boardpage/boardpage.svelte';
      import Viewpage from './Viewpage/Viewpage.svelte';
      import Card from './Cardpage/cardpage.svelte';
      import Allboards from './Allboards/allboards.svelte';
    import Allviews from './Allviews/allviews.svelte';
    import Modal from './modal/modaltest.svelte';
    

    console.log(import.meta.env.VITE_API_URL)
</script>
        

<svelte:head>
  <title>notehub</title>
</svelte:head>


<main>



<nav >
  


  <a  class:active={$location === "/"} href="/#/">Views</a>
  <a  class:active={$location === "/allboards"} href="/#/allboards">Boards </a>
  
  <div class="settings">
  <Themeswitch/> 
  </div>

</nav>

<div class="app">
<Router routes={{
  '/sandbox':Modal,
  '/board/:id': Board,
  '/card/:id': Card,
  '/allboards/': Allboards,
  '/view/:id': Viewpage,
  '/': Allviews
}} />

</div>



</main>
    
        
        <style>


.app {

padding: 30px;
}

  nav{
    background:var(--header-bg);
        display: flex;
    display: grid;
grid-template-columns: auto auto 1fr;
  }
  nav a {
    color:var(--header-color);
    text-decoration: none;
    padding-right: 20px;
    padding: 4px;
    display: block;
    min-width: 72px;
    text-align: center;
    box-sizing: border-box;
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
                max-width: var(--container);
                width:100%;
                padding-bottom: 40px;
            }

        </style>