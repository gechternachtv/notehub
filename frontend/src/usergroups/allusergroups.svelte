<script>
    import { pb } from "../pb";
    import CreateUsergroup from "../createUsergroup.svelte";
    import { push } from "svelte-spa-router";
    import Modal from "../modal/modal.svelte";
    import { localToken } from "../stores.js";
    import Usergroupcontent from "./usergroup-content.svelte";

    let showModal = false;
    let currentusergroupid = window.localStorage.getItem("lastusergroup");
    let currentusergroup;
    let usergroupactive = false;

    const recordallusergroupnames = pb
        .collection("usergroups")
        .getFullList({
            sort: "-created",
            expand: "users",
            filter: `users ~ "${$localToken ? $localToken.model.id : "aaa"}" || public = "global-view"`,
            fields: "owner, id, name, public, expand.users.avatar, expand.users.name, expand.users.id",
        })
        .then((usergroupsRes) => {
            console.log(usergroupsRes);
            if (!currentusergroupid) {
                if (usergroupsRes.find((e) => e.public === "global-view")) {
                    currentusergroupid = usergroupsRes.find(
                        (e) => e.public === "global-view",
                    ).id;
                } else if (usergroupsRes.length) {
                    currentusergroupid = usergroupsRes[0].id;
                }
            }

            if (currentusergroupid) {
                currentusergroup = usergroupsRes.find(
                    (x) => x.id === currentusergroupid,
                );
            }

            return usergroupsRes;
        });

    // const recordusergroup = pb.collection("usergroups").getFullList({
    //     sort: "-created",
    //     expand: "users",
    //     filter: `users ~ "${$localToken ? $localToken.model.id : "aaa"}" || public = "global-view"`,
    //     fields: "owner, id,name,public,expand.users.avatar,expand.users.name,expand.users.id",
    // });

    // (async () => {
    //     recordboards = await pb.collection("boards").getFullList({
    //         sort: "-created",
    //         fields: "id,collectionId,name,img,usergroup,color",
    //         filter: `usergroup.users ~ "${$localToken ? $localToken.model.id : "aaa"}" || usergroup.public = "global-view"`,
    //     });
    //     console.log(recordboards);

    //     recordworkspaces = await pb.collection("workspaces").getFullList({
    //         sort: "-created",
    //         fields: "id,name,img,collectionId,imgposition,usergroup",
    //         filter: `usergroup.users ~ "${$localToken ? $localToken?.model.id : "aaa"}" || usergroup.public = "global-view"`,
    //     });
    //     console.log(recordworkspaces);
    // })();

    const handlenewusergroup = async (e) => {
        const data = e.detail;
        const record = await pb.collection("usergroups").create(data);
        showModal = false;
        push(`/usergroup/${record.id}`);
    };

    document.querySelector("title").innerHTML = "notehub!";
</script>

<main>
    {#await recordallusergroupnames}
        ...
    {:then usergroups}
        <div class:usergroupactive class="usergroup-menu-grid">
            <div class="menu">
                {#each usergroups as usergroup}
                    <button
                        class:active={currentusergroupid === usergroup.id}
                        on:click={() => {
                            usergroupactive = true;
                            currentusergroup = usergroup;
                            currentusergroupid = usergroup.id;
                            window.localStorage.setItem(
                                "lastusergroup",
                                currentusergroupid,
                            );
                        }}
                    >
                        {usergroup.name}
                    </button>
                {/each}
                <!-- <h1>User Groups</h1> -->

                {#if $localToken}
                    <button
                        class="btn createusergroup"
                        on:click={() => {
                            showModal = true;
                        }}>+ Create new userGroup</button
                    >
                    <Modal bind:showModal>
                        <CreateUsergroup on:new={handlenewusergroup}
                        ></CreateUsergroup>
                    </Modal>
                {/if}
            </div>

            <div class="usergroupbox">
                <button
                    class="closeboardviewfull"
                    on:click={() => {
                        usergroupactive = false;
                    }}>←</button
                >
                <Usergroupcontent usergroup={currentusergroup}
                ></Usergroupcontent>
            </div>
        </div>
    {:catch error}
        {error}
    {/await}
</main>

<style>
    .menu {
        background: var(--menu-bg);
        color: var(--menu-col);
        width: 183px;
        overflow: hidden;
        position: relative;
        z-index: 3;
    }

    .menu button {
        width: 100%;
        border-radius: 0;
        font-size: 1.2rem;
        font-weight: normal;
        color: var(--menu-col);
        background: var(--menu-bg);
    }

    .menu button.active {
        background: var(--header-bg);
        color: var(--header-color);
    }

    .usergroup-menu-grid {
        display: grid;
        grid-template-columns: 183px auto;
        overflow: hidden;
        border-radius: 8px;
        transition: all 0.3s;
    }
    /* mobile */

    .closeboardviewfull {
        display: none;
    }

    @media (max-width: 991px) {
        .usergroup-menu-grid {
            grid-template-columns: 100% 0%;
        }
        .menu {
            width: 100%;
        }

        .usergroup-menu-grid.usergroupactive {
            grid-template-columns: 0% 100%;
        }

        .closeboardviewfull {
            display: block;
            position: absolute;
            z-index: 2;
            right: 13px;
            margin-top: 4px;
        }
    }
</style>
