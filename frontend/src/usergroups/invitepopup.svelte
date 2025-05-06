<script>
    import { onMount } from "svelte";
    import { pb } from "../pb";
    export let ug;
    export let showModal = false;
    let data = {
        usergroup: ug.id,
    };

    let promise = null;

    $: {
        if (showModal) {
            promise = pb.collection("usergroup_invites").create(data);
        }
    }
</script>

<main>
    {#if showModal}
        {#await promise}
            <p>Creating invite link...</p>
        {:then invite}
            <p>Link to {ug.name} invite</p>
            <div>
                <code>
                    {window.location.origin}/#/invite/{ug.id}/{invite.id}
                </code>
            </div>
        {:catch error}
            <p style="color: red">Error creating invite: {error.message}</p>
        {/await}
        <!-- content here -->
    {/if}
</main>
