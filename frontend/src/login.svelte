<script >
import { pb } from './pb.js';
// import {push} from 'svelte-spa-router'
import {localToken} from './stores.js';
import {push} from 'svelte-spa-router'

const localStorageItem = window.localStorage.getItem('pocketbase_auth')

let warning = "success"
let showWarning = false;
let warningcontent = []
let newavatar;



const errorhandling = (error) => {
  console.warn(error.data)
    const errors = error.data?.data

    
    if(errors){
      const errorcontent = []
      for (const prop in errors) {
        errorcontent.push(`${prop}: ${errors[prop].message}`);
    }
    if(errorcontent.length > 0){
        warning = "error"
        showWarning = true;
        warningcontent = errorcontent
      }else{
        warning = "error"
        showWarning = true;
        warningcontent = [error]
      }
    }else{
      warning = "error"
      showWarning = true;
      warningcontent = [error]
    }
    

}
async function logout() {
    //localToken = false;
    showWarning = false;
    pb.authStore.clear()
    localToken.set(false)
  }

async function getServerUser() {
  const myuser = await pb.collection("users").getFullList();
			console.log(myuser)
      if(myuser[0]){
        
        pb.authStore.save($localToken.token, myuser[0])
        // verified.update(m => myuser[0].verified)
      }else{
        logout()
      }
}

if($localToken){
  (async()=>{
    await getServerUser()
  })();
}


let state ={
  email:"",
  password:""
}

async function register(){
  await logout()
  try {
    const user = await pb.collection('users').create({
    email: state.email,
    password: state.password,
    passwordConfirm: state.password,
    role:"regular"
});
  console.log(user)
  if(user){
    sendemail()
  }
  } catch (error) {
    errorhandling(error)
  }
}
async function sendemail(){
  await logout()
    const authData = await pb.collection('users').requestVerification(state.email);
    if(authData){
      console.log(authData)
      warning = "success"
      showWarning = true;
      warningcontent = ["Account created successfully, please verify your email"]
    }

}


async function btnlogin(){
  await logout()
  try {
    const authData = await pb.collection('users').authWithPassword(state.email, state.password);
    if(authData){
        // localToken = authData;
        localToken.set({...authData,model:authData.record})
        const serveruser = await getServerUser()

         console.log(authData)
        
		    return authData.record
    }
        
  } catch (error) {
    errorhandling(error)
  }

}



</script>
<main>
  
      <article>
        {#if $localToken}
        
        <div  class:grid={$localToken?.model.avatar}>
        
          {#if $localToken?.model.avatar}
            <div class="profilepic-container">
              <img alt="profile pic" class="profilepic" src="{import.meta.env.VITE_API_URL}/api/files/_pb_users_auth_/{$localToken.model.id}/{$localToken.model.avatar}"/>
            </div>
          {/if}
          <div>
            <div class="{true ? "success" : "error"}">Hello, {$localToken.model.name}
              {#if !true}  

              <div class="pleaseverify">Please verify your email</div>
              
              {:else}
              <div class="pleaseverify"> Welcome to notehub! </div>
              {/if}
            
            </div> 
            <div class="controls">
              <button
              on:click={logout}
              >logout</button>
              <!-- <button on:click={newavatar.click()}>change avatar</button>
              <input bind:this={newavatar} type="file" name="" id=""/> -->
              <button on:click={()=>{push("/account")}}>account</button>
            </div>

          </div>
        </div>
        
      {:else}
        <h1>Notehub login</h1>
        <div class="input">email: <input type="text" bind:value={state.email} name=""></div>
        <div class="input">password: <input type="password" bind:value={state.password} name=""></div>
        <div class="controls">
          <button class="btn"
          on:click={btnlogin}
          >login</button>

          <button class="btn"
          on:click={()=>{push("/register")}}
          >register →</button>

        </div>


        {#if showWarning}

          {#each warningcontent as foo}
          <div class="{warning} warningcontainer">
            {foo}
          </div>
          {/each}
        
        {/if}


    {/if}
  </article>
  
</main>


<style>


  article{
    background:var(--container-bg);
    color:var(--button-bg);
    padding:30px;
    max-width:95vw;
    width:500px;
    margin:auto;
    text-align:center;
    box-sizing:border-box;
    margin-top:20px;


  }

  .input{
    display:flex;
    flex-direction: column;
    font-size:12px;
    text-align:left;
    gap:4px;
    margin-bottom:13px;
    font-weight: bold;
  }

  div{
    padding: 5px;
    font-weight: 700;
    font-size: 12px;
    border-radius: 8px;
    border: 0px;
    min-width: 100px;
    margin: 0;
  }

  .grid div{
    display: flex;
flex-direction: column;
justify-content: center;
  }
  .error{
    background:var(--alert);
    color:var(--header-color);
  }
  .success{
    background:var(--header-bg);
    color:var(--header-color);
  }
  

.profilepic {
  border-radius: 10px;
max-width: 140px;
height: auto;
}
.pleaseverify{
  margin-top:10px;
}
.grid {
display: grid;
grid-template-columns: auto 1fr;
gap: 20px;
}
.warningcontainer{
  margin-bottom:10px;
}

  .profilepic-container{
    align-items:center;
    width:140px;
    overflow:hidden;
    height:140px;
  }
  .profilepic-container img{
    object-fit: cover;
    height:140px;
    min-width:140px;
  }
@media(max-width: 991px){
  .grid {
  grid-template-columns: 1fr;
  }
  .profilepic-container{
    align-items:center;
  }
}
.success{
  margin-bottom:10px;
}
</style>
