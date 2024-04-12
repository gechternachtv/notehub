<script>
    import {onMount,onDestroy} from 'svelte'

    let foo;
    onMount(()=>{
        document.querySelector("nav").prepend(foo)
    })
    onDestroy(()=>{
        foo.remove()
    })
</script>
<div bind:this={foo} class="absolute controls">
    <slot>notehub</slot>
</div>

<style>
        .absolute {
        position: absolute;
        
        background: var(--header-bg);
        padding: 5px;
        left: 0px;
        align-content: center;
        justify-content: center;
        align-items: center;
        
        font-weight: bold;
        
        color: var(--header-color);
        top: 20px;
        border-radius: 0 0px 10px 0px;
        padding-left: 16px;
        font-size: 2.1rem;
        gap: 17px;
        }


        @media (min-width:991px){
            .absolute{
                padding: 5px 20px;
                top: 20px;
                font-size: 3.2rem;
                z-index: 2;
            }
        }

</style>