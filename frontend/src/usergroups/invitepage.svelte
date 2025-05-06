<script>
    import { server } from "../stores";
    import { pb } from "../pb";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";

    export let params;

    const promise = async () => {
        const url = `${$server.url}/validateinvite/${params.usergroup}/${params.inviteid}`;
        console.log("Calling:", url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${pb.authStore.token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
        }
        const resjson = await res.json();
        console.log(resjson);
        if (resjson.success) {
            push(`/usergroup/${params.usergroup}`);
        }
        return resjson;
    };
</script>

{#await promise()}
    <p>Joining usergroup...</p>
{:then res}
    {res.message}
{:catch error}
    <p style="color: red">Error validating invite: {error.message}</p>
{/await}
