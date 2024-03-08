<script>
 import Themeswitch from './themeswitch.svelte';
 import {location} from 'svelte-spa-router'
  import Router from 'svelte-spa-router';
    import Board from './Boardpage/boardpage.svelte';
      import Viewpage from './Viewpage/Viewpage.svelte';
      import Card from './Cardpage/cardpage.svelte';
      import Allboards from './Allboards/allboards.svelte';
    import Allviews from './Allviews/allviews.svelte';
    
</script>
        

<svelte:head>
  <title>notehub</title>
</svelte:head>


<main>



<nav >
  


  <a  class:active={$location === "/"} href="/#/">Views</a>
  <a  class:active={$location === "/allboards"} href="/#/allboards">Boards </a>
  <a  class:active={$location === "/options"} href="/#/options">Options </a>
  
  <div class="settings">
  <Themeswitch/> 
  </div>

</nav>

<div class="app">
<Router routes={{
  '/board/:id': Board,
  '/card/:id': Card,
  '/allboards/': Allboards,
  '/view/:id': Viewpage,
  '/': Allviews
}} />

</div>



</main>
    
        
        <style>
          select {
    font-size: 11px;
    padding: 2px;
    border:0px;
    background:var(--button-bg);
    color:var(--button-color);
    border-radius: 4px;
    margin: 4px;
    cursor: pointer;
  }





.app {

padding: 30px;
}

  nav{
    background:var(--header-bg);
        display: flex;
    display: grid;
grid-template-columns: auto auto auto 1fr;
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
    border-bottom: 4px solid var(--card-bg);
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

.empty{
  grid-column:span 3;
  height:32px;
}


            main{
                background:var(--container-bg);
                color:var(--main-font-1);
                margin:auto;
                max-width: var(--container);
                width:100%;
                padding-bottom: 40px;
            }
            .container-header{
                background:var(--header-bg);
                color:var(--header-color);
                padding:4px;
                margin-top:17px;
            }
            .container-header h1{
                margin: 0;
            }
            .container{
                display: flex;
                gap:20px;
                flex-wrap: wrap;
                flex-direction: row;
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