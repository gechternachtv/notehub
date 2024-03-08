<script>
    export let board = {
    "cards": "",
    "card_order": "",
    "header": "",
    "color": "",
    "name":""
    }

    export let small = false

    
</script>











    

        <a class:small={small} style="border-left: 4px solid {board.color}" class="board-header" href="/#/board/{board.id}">
        <div class="img" style="background-image:url('{board.image}')"></div>
          <!-- <img src="{board.image}" alt=""> -->
        <div>        
          <h1 class="board-name">{board.name}</h1>
          {#if !small}
            <div class="cards-length">cards: {board.cards.length}</div>
          {/if}
        </div>
        </a>
  

    
 








<style>



  .cards-length{
    font-size:12px;
    opacity: 0.6;
  }
            .board-header{
                color:var(--board-title-color);
                padding:4px;
                margin-top:0px;
                margin-bottom:25px;
                display: flex;
                align-items: center;
                gap: 20px;
                padding-left:5px;
                width:100%;
            }
            .board-header h1{
                margin: 0;
            }
            .board-header  {
              color:var(--board-title-color);
            }
            a:hover{
              text-decoration: none;
            }
            .board-header .img{
                border-radius: 10px;
                height: 80px;
                transition:all .2s;
                width: 80px;
                background-size: cover;
                background-position: center;
            }
            .board-header:hover .img{
              transform: scale(1.09);
            }








.small  .img {
  height: 36px;
  width: 36px;
}

.board-header.small {
  gap: 11px;
  margin-bottom:0px;
}

.small h1 {
  font-size: 16px;
  font-weight: normal;
}

</style>