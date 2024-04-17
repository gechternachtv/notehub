<script>
  import { push } from "svelte-spa-router";
  import { pb } from "./pb.js";
  // import {push} from 'svelte-spa-router'
  import { localToken } from "./stores.js";

  const localStorageItem = window.localStorage.getItem("pocketbase_auth");

  let warning = "success";
  let showWarning = false;
  let warningcontent = [];
  let avatar;
  let imageel;
  let showavatarpreview = false;

  console.log($localToken);

  const handleAvatarChange = (e) => {
    if (e.target?.files) {
      if (e.target.files.length > 0) {
        showavatarpreview = true;
        avatar = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          imageel.setAttribute("src", reader.result);
        });
        reader.readAsDataURL(avatar);
      }
    }
  };

  async function login() {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(state.email, state.password);
      if (authData) {
        // localToken = authData;
        localToken.set({ ...authData, model: authData.record });
        // const serveruser = await getServerUser()

        console.log(authData);
        push("/account");
      }
    } catch (error) {
      errorhandling(error);
    }
  }

  const errorhandling = (error) => {
    console.warn(error.data);
    const errors = error.data?.data;

    if (errors) {
      const errorcontent = [];
      for (const prop in errors) {
        errorcontent.push(`${prop}: ${errors[prop].message}`);
      }
      if (errorcontent.length > 0) {
        warning = "error";
        showWarning = true;
        warningcontent = errorcontent;
      } else {
        warning = "error";
        showWarning = true;
        warningcontent = [error];
      }
    } else {
      warning = "error";
      showWarning = true;
      warningcontent = [error];
    }
  };
  async function logout() {
    //localToken = false;
    showWarning = false;
    pb.authStore.clear();
    localToken.set(false);
    push("/login");
  }

  let state = {
    email: $localToken?.model?.email,
    name: $localToken?.model?.name,
    username: $localToken?.model?.name,
    avatar: $localToken?.model?.avatar,
    password: "",
  };

  async function register() {
    try {
      if ($localToken) {
        const user = await pb.collection("users").update($localToken.model.id, {
          email: state.email != "" ? state.email : $localToken.model.email,

          avatar:
            avatar != $localToken.model.avatar
              ? avatar
              : $localToken.model.avatar,

          name: state.name != "" ? state.name : $localToken.model.name,
          username: state.name != "" ? state.name : $localToken.model.name,
        });
        console.log(user);
        localToken.set({ ...$localToken, model: user });
      } else {
        // await logout();
        const user = await pb.collection("users").create({
          email: state.email,
          password: state.password,
          avatar: avatar,
          passwordConfirm: state.passwordconfirm,
          name: state.name,
          username: state.name,
        });

        console.log(user);
        if (user) {
          sendemail();
          await login();
        }
      }
    } catch (error) {
      errorhandling(error);
    }
  }
  async function sendemail() {
    // await logout()
    const authData = await pb
      .collection("users")
      .requestVerification(state.email);
    if (authData) {
      console.log(authData);
      warning = "success";
      showWarning = true;
      warningcontent = ["Account created successfully"];
    }
  }
</script>

<main>
  <article>
    {#if $localToken}
      <div class:grid={$localToken.model.avatar}>
        {#if $localToken.model.avatar}
          <div class="profilepic-container">
            <img
              alt="profile pic"
              class="profilepic"
              src="{import.meta.env
                .VITE_API_URL}/api/files/_pb_users_auth_/{$localToken.model
                .id}/{$localToken.model.avatar}"
            />
          </div>
        {/if}
        <div>
          <div class={true ? "success" : "error"}>
            Hello, {$localToken.model.name}
            {#if !true}
              <div class="pleaseverify">Please verify your email</div>
            {:else}
              <div class="pleaseverify">Welcome to notehub!</div>
            {/if}
          </div>
          <button on:click={logout}>logout</button>
        </div>
      </div>
    {/if}
    {#if !$localToken}<h1>Notehub register:</h1>{/if}

    <div class="input">
      email: <input type="text" bind:value={state.email} name="" />
    </div>
    <div class="input">
      username: <input type="text" bind:value={state.name} name="" />
    </div>
    <div class="avatarcontainer">
      {#if showavatarpreview}
        <div class="avatarpreview"><img bind:this={imageel} /></div>
      {:else}
        <div class="avatarplaceholder"></div>
      {/if}

      <div class="input">
        avatar: <input
          on:change={handleAvatarChange}
          class="avatar"
          type="file"
          name=""
        />
      </div>
    </div>
    {#if !$localToken}
      <div class="input">
        password: <input type="password" bind:value={state.password} name="" />
      </div>
      <div class="input">
        password confirm: <input
          type="password"
          bind:value={state.passwordconfirm}
          name=""
        />
      </div>
    {/if}
    <button on:click={register}>{$localToken ? "Update" : "Register"}</button>

    {#if showWarning}
      {#each warningcontent as foo}
        <div class="{warning} warningcontainer">
          {foo}
        </div>
      {/each}
    {/if}
  </article>
</main>

<style>
  button {
    background: var(--button-bg);
    color: var(--button-color);
    padding: 5px;
    font-weight: 700;
    font-size: 12px;
    border-radius: 8px;
    border: 0px;
    min-width: 100px;
    margin: 0;
    cursor: pointer;
    margin-bottom: 10px;
    margin-top: 10px;
    justify-content: center;
  }

  article {
    background: var(--container-bg);
    color: var(--button-bg);
    padding: 30px;
    max-width: 95vw;
    width: 500px;
    margin: auto;
    text-align: center;
    box-sizing: border-box;
    margin-top: 20px;
  }

  .input {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    text-align: left;
    gap: 4px;
    margin-bottom: 13px;
    font-weight: bold;
  }

  div {
    padding: 5px;
    font-weight: 700;
    font-size: 12px;
    border-radius: 8px;
    border: 0px;
    min-width: 100px;
    margin: 0;
  }

  .grid div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .error {
    background: var(--alert);
    color: var(--header-color);
  }
  .success {
    background: var(--header-bg);
    color: var(--header-color);
  }

  .profilepic {
    border-radius: 10px;
    max-width: 140px;
    height: auto;
  }
  .pleaseverify {
    margin-top: 10px;
  }
  .grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
  }
  .warningcontainer {
    margin-bottom: 10px;
  }

  .profilepic-container {
    align-items: center;
    width: 140px;
    overflow: hidden;
    height: 140px;
  }
  .profilepic-container img {
    object-fit: cover;
    height: 140px;
    min-width: 140px;
  }
  @media (max-width: 991px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .profilepic-container {
      align-items: center;
    }
  }

  .avatarpreview {
    align-items: center;
    width: 100px;
    overflow: hidden;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .avatarpreview img {
    object-fit: cover;
    height: 100px;
    min-width: 100px;
  }

  .avatarcontainer {
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>
