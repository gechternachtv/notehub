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
	export let fileelement;
	export let files;
	export let editorBlocked = false;

	function editor(dom) {
		const MakeEditor = Editor.make()
			.config((ctx) => {
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
		});
	}
</script>

<main class:editorBlocked>
	{#if files?.length > 0}
		<div class="filename">
			📎 {files[0].name}
		</div>
	{/if}
	<div class="editor-container">
		<div bind:this={editorel} class="editor" use:editor />
		<div class="editor-controls">
			<div class="send-controls">
				<button class="sendbtn" on:click={sendBtn}>send</button>
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
	.editorBlocked {
		opacity: 0.7;
		pointer-events: none;
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
	.editorBlocked {
		opacity: 0.7;
		pointer-events: none;
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
