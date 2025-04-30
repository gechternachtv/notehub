<script>
    import { localToken, server } from "../stores.js";
    import Calendar from "../Calendar/calendar.svelte";
    import Allusergroups from "./allusergroups.svelte";

    document.querySelector("title").innerHTML = "notehub!";
</script>

<main>
    {#if $localToken}
        <div class="calendar-user-grid">
            <div class="user-home">
                <div>
                    {#if $localToken?.model.avatar}
                        <div class="profilepic-container">
                            <img
                                alt="profile pic"
                                class="profilepic"
                                src="{$server.url}/api/files/_pb_users_auth_/{$localToken
                                    .model.id}/{$localToken.model.avatar}"
                            />
                        </div>
                    {/if}
                    <div>
                        <div class="user-container">
                            <!-- {$localToken.model.name} -->

                            <div class="pleaseverify">Welcome to notehub!</div>
                        </div>
                        <div class="user-container server">
                            <div>User ID : {$localToken.model.id}</div>
                        </div>
                        <div class="user-container server">
                            <div>Server : {$server.name}</div>
                        </div>
                        <div class="user-container server">
                            <div>Version : {import.meta.env.VITE_VERSION}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Calendar></Calendar>
        </div>
    {/if}
    <Allusergroups />
</main>

<style>
    main {
        padding-bottom: 10px;
        --avatar-size: 130px;
    }

    .calendar-user-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 15px;
        margin-bottom: 15px;
    }

    @media (max-width: 991px) {
        .calendar-user-grid {
            grid-template-columns: 1fr;
        }
    }

    .user-container {
        background: var(--header-bg);
        color: var(--header-color);
        padding: 5px;
        font-weight: bold;
        border-radius: 5px;
        font-size: 15px;
    }

    .profilepic {
        border-radius: 10px;
        max-width: var(--avatar-size);
        height: auto;
    }
    .pleaseverify {
        margin-top: 10px;
    }

    .profilepic-container {
        align-items: center;
        width: var(--avatar-size);
        overflow: hidden;
        height: var(--avatar-size);
    }
    .profilepic-container img {
        object-fit: cover;
        height: var(--avatar-size);
        min-width: var(--avatar-size);
    }
    @media (max-width: 991px) {
        .profilepic-container {
            align-items: center;
        }
    }

    .server {
        margin-top: 10px;
        display: flex;
        gap: 10px;

        align-content: center;
        align-items: center;
    }

    .user-home {
        background: var(--card-bg);
        padding: min(20px, 2vw);
        border-radius: 10px;
        color: var(--header-color);
        background: var(--header-bg);
    }

    @media (max-width: 991px) {
        .user-container {
            /* padding: 5px; */
            /* font-weight: bold; */
            /* border-radius: 5px; */
            padding: 0px;
            font-weight: normal;
            border-radius: 0px;
            font-size: 11px;
        }

        /* Element | http://localhost:5173/#/ */

        .user-home > div {
            display: flex;
            gap: 17px;
        }
    }
</style>
