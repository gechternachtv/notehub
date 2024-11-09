<script>
  import { server } from "../stores";
  export let board = {
    color: "",
    name: "",
    img: "",
  };

  export let workspacecard = false;
  export let counter = 0;
</script>

<a
  class:workspacecard
  style="border-left: 4px solid {board.color}"
  class="board-header"
  href="/#/board/{board.id}"
>
  {#if board.img}
    <!-- content here -->
    <!-- <div class="img" style="background-image:url('{$server.url}/api/files/{board.collectionId}/{board.id}/{board.img}{workspacecard ? "?thumb=40x40" : ""}')"></div> -->
    <div class="img-c">
      <img
        src="{$server.url}/api/files/{board.collectionId}/{board.id}/{board.img}{workspacecard
          ? '?thumb=40x40'
          : ''}"
        alt=""
      />
    </div>
  {/if}

  <div>
    <h1 class="board-name">{board.name}</h1>
    {#if !workspacecard}
      {#if counter}
        {#if counter > 0}
          <div class="cards-length">cards: {counter}</div>
        {/if}
      {/if}
    {/if}
  </div>
</a>

<style>
  .cards-length {
    font-size: 1.2rem;
    opacity: 0.6;
  }
  .board-header {
    color: var(--board-title-color);
    padding: 4px;
    margin-top: 0px;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 20px;
    padding-left: 5px;
    width: 100%;
  }
  .board-header h1 {
    margin: 0;
  }
  .board-header {
    color: var(--board-title-color);
  }
  a:hover {
    text-decoration: none;
  }
  .board-header .img-c {
    border-radius: 10px;

    transition: all 0.2s;

    background-size: cover;
    background-position: center;
    overflow: hidden;
  }
  img {
    height: 100%;
    transition: all 0.2s;
    width: 100%;
    border: 0px;
    display: block;
    object-fit: cover;
  }
  .board-header:hover .img-c {
    transform: scale(1.09);
  }

  .board-header.workspacecard {
    gap: 11px;
    margin-bottom: 0px;
  }

  .workspacecard h1 {
    font-size: 1.2rem;
    font-weight: normal;
  }
</style>
