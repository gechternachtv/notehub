<script>
  import Themeswitch from "./themeswitch.svelte";
  import { location } from "svelte-spa-router";
  import Router from "svelte-spa-router";
  import { localToken, server } from "./stores.js";
  import { wrap } from "svelte-spa-router/wrap";
  import { pb } from "./pb.js";
  if (!pb.authStore.isValid) {
    pb.authStore.clear();
    localToken.set(false);
  }

  console.log(server);

  console.log($localToken);
</script>

<!-- <Login></Login> -->

<div class="maincontainer">
  <nav>
    <a class="home" href="/#/"
      >notehub
      {#if $server.name != "🌐 pockethost"}
        <span class="servername">{$server.name}</span>
      {/if}
    </a>
    <a class="search" href="/#/search">Search</a>
    {#if $localToken}
      <a class="navatar-container" href="/#/account">
        <div class="navavatar">
          <img
            alt="user avatar"
            src="{$server.url}/api/files/_pb_users_auth_/{$localToken.model
              .id}/{$localToken.model?.avatar}"
          />
        </div></a
      >
    {:else}
      <a class="loginlink" class:active={$location === "/login"} href="/#/login"
        >Login
      </a>
    {/if}
    <div class="settings"></div>
  </nav>

  <!-- <Sortgrid></Sortgrid> -->
  <div class="app">
    <Router
      routes={{
        "/board/:id": wrap({
          asyncComponent: () => import("./Boardpage/boardpage.svelte"),
        }),
        "/search/": wrap({
          asyncComponent: () => import("./Search/search.svelte"),
        }),
        "/card/:id": wrap({
          asyncComponent: () => import("./Cardpage/cardpage.svelte"),
        }),
        "/allboards/:usergroup": wrap({
          asyncComponent: () => import("./Allboards/allboards.svelte"),
        }),
        "/workspace/:id": wrap({
          asyncComponent: () => import("./workspacepage/workspacepage.svelte"),
        }),
        "/account/": wrap({
          asyncComponent: () => import("./register.svelte"),
        }),
        "/login/": wrap({ asyncComponent: () => import("./login.svelte") }),
        "/register/": wrap({
          asyncComponent: () => import("./register.svelte"),
        }),
        "/workspaces/:usergroup": wrap({
          asyncComponent: () => import("./Allworkspaces/allworkspaces.svelte"),
        }),
        "/usergroup/:usergroup": wrap({
          asyncComponent: () => import("./usergroups/usergrouppage.svelte"),
        }),
        "/invite/:usergroup/:inviteid": wrap({
          asyncComponent: () => import("./usergroups/invitepage.svelte"),
        }),
        "/": wrap({
          asyncComponent: () => import("./usergroups/homepage.svelte"),
        }),
      }}
    />
  </div>
</div>

<footer>
  <Themeswitch /></footer>

<style>
  .app {
    padding: var(--bodypadding);
    padding-bottom: 0px;

    position: relative;
  }

  nav {
    background: var(--header-bg);
    /* display: flex; */
    display: flex;
    grid-template-columns: auto auto 1fr;
    font-size: 1.2rem;
    position: sticky;
    top: 0;
    z-index: 3;
    justify-content: flex-end;
    line-height: 21px;
    min-height: 40px;
    /* border-radius: 0 0 10px 0; */
    /* margin-right: 15px; */
  }
  nav a {
    color: var(--header-color);
    text-decoration: none;
    padding-right: 20px;
    padding: 7px;
    display: block;
    min-width: 72px;
    text-align: center;
    box-sizing: border-box;
  }
  @media (max-width: 991px) {
    nav a {
      padding: 14px 16px;
    }
  }
  nav a.active {
    border-bottom: 4px solid var(--header-color);
    font-weight: bold;
  }
  .settings {
    display: flex;
    align-content: center;
    justify-content: flex-end;
  }
  @media (max-width: 376px) {
    .settings {
      grid-column: span 4;
      margin-top: 9px;
    }
  }

  .maincontainer {
    background: var(--container-bg);
    color: var(--main-font-1);
    margin: auto;
    max-width: 1440px;
    width: 100vw;
    /* padding-bottom: 40px; */
  }

  @media (max-width: 991px) {
    nav {
      position: sticky;
      z-index: 9;
      width: 100%;
      top: 0;
    }
  }
  footer {
    max-width: 1440px;
    width: 100vw;
    margin: auto;
    display: flex;
    justify-content: flex-end;
  }

  .navatar-container {
    position: relative;
    height: 40px;
    width: 40px;
  }
  .navavatar {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    height: 40px;
    width: 40px;
  }

  .navavatar img {
    object-fit: contain;
    height: 40px;
  }

  @media (max-width: 991px) {
    .navavatar {
      height: 53px;
      width: 53px;
    }
    .navavatar img {
      height: 53px;
    }
  }

  .home {
    font-weight: bold;
    font-size: 36px;
    padding: 9px 15px;
    width: 100%;
    text-align: left;
  }

  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 11px;
  }

  .servername {
    font-size: 12px;
    margin: 0px;
    background: var(--header-color);
    color: var(--header-bg);
    padding: 3px 6px;
    border-radius: 6px;
    position: absolute;
    top: 0;
    height: 12px;
    line-height: 6px;
    left: auto;
    top: 5px;
  }
  .loginlink {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
