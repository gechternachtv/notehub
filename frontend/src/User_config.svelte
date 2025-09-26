<script>
    import { pb } from "./pb";
    import { localToken } from "./stores";
    import BoardSelector from "./BoardSelector.svelte";
    import Modal from "./modal/modal.svelte";

    let selectfavoriteboard = false;
    let favoriteboardModal = false;
    let selectcalendarboard = false;
    let calendarboardModal = false;

    const handleFavoriteBoardSubmit = async (e) => {
        console.log(e.detail);

        selectfavoriteboard = false;

        const user = await pb.collection("users").update($localToken.model.id, {
            default_board: e.detail[0],
        });
        $localToken.model = user;
        favoriteboardModal = false;
    };

    const handleCalendarBoardSubmit = async (e) => {
        console.log(e.detail);

        selectcalendarboard = false;

        const user = await pb.collection("users").update($localToken.model.id, {
            calendar_board: e.detail[0],
        });
        $localToken.model = user;
        calendarboardModal = false;
    };

    const handleBannerChange = async (e) => {
        if (e.target?.files) {
            if (e.target.files.length > 0) {
                const user = await pb
                    .collection("users")
                    .update($localToken.model.id, {
                        banner_img: e.target.files[0],
                    });
                console.log(user);
                $localToken.model = user;
            }
        }
    };
</script>


<div class="option">
    default board:
    <button
        on:click={() => {
            favoriteboardModal = true;
            selectfavoriteboard = true;
        }}>{$localToken.model.default_board}</button
    >
    <Modal bind:showModal={favoriteboardModal}>
        <BoardSelector
            isopen={selectfavoriteboard}
            single={true}
            on:submit={handleFavoriteBoardSubmit}
        ></BoardSelector>
    </Modal>
</div>

<div class="option">
    calendar board:
    <button
        on:click={() => {
            calendarboardModal = true;
            selectcalendarboard = true;
        }}>{$localToken.model.calendar_board}</button
    >
    <Modal bind:showModal={calendarboardModal}>
        <BoardSelector
            isopen={selectcalendarboard}
            single={true}
            on:submit={handleCalendarBoardSubmit}
        ></BoardSelector>
    </Modal>
</div>

<div class="option">
    banner:
    <div>
    <input
        on:change={handleBannerChange}
        class="avatar"
        type="file"
        name=""
        accept="image/*"
    />
    </div>
</div>

<style>
    .option {
        text-align: left;
        margin-bottom:10px;
    }
</style>
