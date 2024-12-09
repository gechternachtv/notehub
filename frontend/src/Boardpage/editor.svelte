<script>
	// import { onMount } from "svelte";
	import {
		Editor,
		rootCtx,
		defaultValueCtx,
		editorViewCtx,
	} from "@milkdown/core";
	import { commonmark } from "@milkdown/preset-commonmark";
	import { replaceAll } from "@milkdown/utils";
	import { createEventDispatcher } from "svelte";
	import { gfm } from "@milkdown/kit/preset/gfm";
	import { listItemBlockComponent } from "@milkdown/kit/component/list-item-block";
	import { history } from "@milkdown/kit/plugin/history";
	import { cursor } from "@milkdown/kit/plugin/cursor";
	import { editorblocked } from "../stores.js";
	import Picmobutton from "./picmobutton.svelte";

	import { editorViewOptionsCtx } from "@milkdown/kit/core";
	export let fileelement;
	export let files;

	function editorBlockerCheck() {
		if ($editorblocked) {
			document
				.querySelector(".ProseMirror.editor")
				?.setAttribute("contenteditable", "false");
		} else {
			document
				.querySelector(".ProseMirror.editor")
				?.setAttribute("contenteditable", "true");
		}
	}

	$: {
		console.log("locked:");
		console.log($editorblocked);
		console.log(editable());
		editorBlockerCheck();
	}

	const editable = () => !$editorblocked;

	let editorel;
	let sendBtn = (e) => {
		const event = new Event("send");
		console.log(event);
		editorel.dispatchEvent(event);
	};
	// import { listener, listenerCtx } from '@milkdown/plugin-listener';
	// import { nord } from "@milkdown/theme-nord";
	// import { emoji } from "@milkdown/plugin-emoji";

	const dispatch = createEventDispatcher();

	export let clearAllonEnter = true;
	export let defaultValue = {
		type: "json",
		value: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							text: " ",
						},
					],
				},
			],
		},
	};

	const handleEmojiselect = (e) => {
		console.log(editorel.innerHTML);
		if (editorel.querySelector("p")) {
			const lastP =
				editorel.querySelectorAll("p")[
					editorel.querySelectorAll("p").length - 1
				];
			lastP.innerHTML = lastP.innerHTML + " " + e.detail.emoji;
		}
	};
	function editor(dom) {
		const MakeEditor = Editor.make()
			.config((ctx) => {
				// ctx.update(editorViewOptionsCtx, (prev) => ({
				// 	...prev,
				// 	editable,
				// }));
				// ctx.get(listenerCtx).updated((ctx, doc, prevDoc) => {
				//     output = doc.toJSON();
				//     console.log(output)
				// });
				ctx.set(rootCtx, dom);
				// @ts-ignore
				ctx.set(defaultValueCtx, defaultValue);
			})
			// .use(nord)
			// .use(emoji)
			.use(commonmark)
			.use(gfm)
			.use(listItemBlockComponent)
			.use(history)
			.use(cursor)

			// .use(listener)
			.create();

		MakeEditor.then((editor) => {
			// console.log(editor)

			const getMarkdown = () => {
				return editor.action((ctx) => {
					const editorView = ctx.get(editorViewCtx);
					const doc = editorView.state.doc;
					console.log({
						string: doc.textBetween(0, doc.content.size, "\n"),
						json: doc.toJSON(),
					});
					return {
						string: doc.textBetween(0, doc.content.size, "\n"),
						json: doc.toJSON(),
					};
				});
			};

			const enterHandler = (event) => {
				console.log(event);

				if ($editorblocked) {
					event.preventDefault();
				}
				if (event.key === "Tab") {
					console.log(event.key);
					event.preventDefault();
				}
				if (
					(event.ctrlKey && event.key === "Enter") ||
					event.type === "send"
				) {
					dispatch("newcontent", getMarkdown());
					window.scrollTo(0, document.body.scrollHeight);
					if (clearAllonEnter) {
						editor.action(replaceAll(""));
					}
				}
			};
			editorel.addEventListener("keydown", enterHandler);
			editorel.addEventListener("send", enterHandler);

			dispatch("editorready", true);
			editorBlockerCheck();
		});
	}
</script>

<main>
	{#if files?.length > 0}
		<div class="filename">
			📎 {files[0].name}
		</div>
	{/if}
	<div class="editor-container">
		<div class="editor-incontainer">
			<Picmobutton on:emojiselect={handleEmojiselect} />

			<div bind:this={editorel} class="editor" use:editor />
		</div>
		<div class="editor-controls">
			<div class="send-controls">
				<button class="sendbtn" on:click={sendBtn}>save</button>
				<button
					class="filebtn"
					on:click={() => {
						fileelement.click();
						console.log(fileelement);
					}}>file</button
				>
				<input
					class="file"
					bind:this={fileelement}
					bind:files
					type="file"
				/>
			</div>
		</div>
	</div>
</main>

<style>
	main {
		container-type: inline-size;
		container-name: card-container;
	}
	.editorblocked {
		opacity: 0.7;
	}
	.send-controls {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		max-width: 103px;
		max-height: 94px;
	}
	main {
		background: var(--card-bg);
		gap: 1px;

		/* display: flex; */
		gap: 7px;
		width: 100%;
	}
	.editor-incontainer {
		width: 100%;
		position: relative;
	}
	.editor {
		width: 100%;
	}
	.sendbtn,
	.filebtn {
		max-width: 103px;
		justify-content: center;
		min-width: 100px;
	}
	.editor-controls {
		display: flex;
		align-items: flex-end;
		padding: 5px;
	}
	.editor-container {
		width: 100%;
		display: flex;
		gap: 1px;
	}
	.filename {
		padding: 16px 0;
		font-size: 1.2rem;
		font-weight: bold;
	}
	.file {
		display: none;
	}
	.filebtn {
		width: 100%;
		text-align: center;
		justify-content: center;
	}
	.editorblocked {
		opacity: 0.7;
	}

	@container card-container (max-width: 991px) {
		.editor-container {
			display: grid;
		}

		.send-controls {
			flex-wrap: nowrap;
		}
		.send-controls {
			max-width: auto;
		}
	}
</style>
