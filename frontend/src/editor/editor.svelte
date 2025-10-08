<script>
	import { Color } from "@tiptap/extension-text-style";
	import { ListItem } from "@tiptap/extension-list";
	import { TextStyle } from "@tiptap/extension-text-style";
	import StarterKit from "@tiptap/starter-kit";
	import { Editor } from "@tiptap/core";
	import Image from "@tiptap/extension-image";
	import { onMount } from "svelte";
	import { TaskItem, TaskList } from "@tiptap/extension-list";
	import { DateHighlighter } from "./datesinput";
	import { TagHighlighter } from "./taginput.js";
	import { tagSuggestions, editorblocked } from "../stores.js";
	import Picmobutton from "../Picmo/picmobutton.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let colorinput;
	let colortrigger;
	let element;
	let editor;
	let fileInput;
	let changeColor = false;
	let editor_initialized = false;
	let editor_hadchanges = false;

	export let defaultValue = {
		type: "json",
		value: {
			type: "doc",
			content: [
				{
					type: "paragraph",
				},
			],
		},
	};

	$tagSuggestions = [];

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Color.configure({ types: [TextStyle.name, ListItem.name] }),
				TextStyle.configure({ types: [ListItem.name] }),
				StarterKit,
				Image.configure({
					inline: true,
					allowBase64: true,
					HTMLAttributes: {
						class: "imagetext",
					},
				}),
				TaskList,
				TaskItem.configure({
					HTMLAttributes: {
						class: "task-item",
					},
				}),
				DateHighlighter,
				TagHighlighter,
			],
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: () => {
				if (editor_initialized) {
					editor_hadchanges = true;
				}
			},
		});

		editor.commands.setContent(defaultValue.value.content);

		editorblocked.subscribe((a) => {
			console.log(a);
			editor.setEditable(!a);
		});

		editor_initialized = true;
	});

	const handlesend = () => {
		if (editor) {
			const card_images = Array.from(
				element.querySelectorAll(".tiptap.ProseMirror img"),
			).map((e) => {
				return { src: e.src };
			});

			const card_tags = Array.from(
				element.querySelectorAll(".tiptap.ProseMirror .tag-mark"),
			).map((e) => {
				return {
					dataName: e.getAttribute("data-name"),
					dataTagId: e.getAttribute("data-tag-id"),
				};
			});
			const card_checklistitem = Array.from(
				element.querySelectorAll(".tiptap.ProseMirror .task-item"),
			).map((e) => {
				return { dataChecked: e.getAttribute("data-checked") };
			});
			const card_title = element.querySelector(
				".tiptap.ProseMirror h1",
			)?.innerText;
			const card_mainlink = element.querySelector(
				".tiptap.ProseMirror a",
			)?.href;
			const card_datementions = Array.from(
				element.querySelectorAll(".tiptap.ProseMirror .date-mark"),
			).map((e) => {
				return { dataDate: e.getAttribute("data-date") };
			});

			const newcardcontent = {
				raw: editor.getJSON().content,
				text: element.querySelector(".tiptap.ProseMirror").innerText,
				card_images,
				card_tags,
				card_checklistitem,
				card_title,
				card_mainlink,
				card_datementions,
			};
			dispatch("newcontent", newcardcontent);
		}
	};

	const emojiSelect = (e) => {
		if (editor) {
			console.log(e.detail);
			if (e.detail.unicode) {
				editor.chain().focus().insertContent(e.detail.unicode).run();
			} else if (e.detail.emoji?.url) {
				editor
					.chain()
					.focus()
					.setImage({ src: e.detail.emoji.url })
					.run();
			}
		}
	};

	const handleImageFile = (event) => {
		const file = event.target.files?.[0];
		if (!file || !editor) return;
		if (!file.type.startsWith("image/")) {
			alert("Please select an image file");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const src = reader.result;
			editor.chain().focus().setImage({ src, alt: file.name }).run();
			event.target.value = "";
		};
		reader.readAsDataURL(file);
	};
</script>

<main>
	{#if editor && !$editorblocked}
		<div class="control-group">
			<div class="button-group tiptapcontrols">
				<Picmobutton allowcuston={true} on:emojiselect={emojiSelect}
				></Picmobutton>

				<button
					on:click={() =>
						console.log &&
						editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					class={editor.isActive("bold") ? "is-active" : ""}
				>
					B
				</button>
				<button
					on:click={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor
						.can()
						.chain()
						.focus()
						.toggleItalic()
						.run()}
					class={editor.isActive("italic") ? "is-active" : ""}
				>
					I
				</button>

				<button
					on:click={() =>
						editor.chain().focus().toggleBlockquote().run()}
					class={editor.isActive("blockquote") ? "is-active" : ""}
				>
					q
				</button>
				<button
					on:click={() =>
						editor.chain().focus().setHorizontalRule().run()}
				>
					-
				</button>

				<button
					on:click={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				>
					z
				</button>
				<button
					on:click={() => {
						changeColor = !changeColor;
						if (changeColor) {
							if (colorinput?.value) {
								editor
									.chain()
									.focus()
									.setColor(colorinput.value)
									.run();
							}
						} else {
							editor.chain().focus().unsetColor().run();
						}
					}}
					class:isactive={changeColor}
				>
					c
				</button>
				<input
					bind:this={colorinput}
					on:change={() => {
						colortrigger.style = `background-color:${colorinput.value}`;
					}}
					style="display: none"
					type="color"
				/>
				<button
					class="colortrigger"
					style="background-color:black"
					bind:this={colortrigger}
					on:click={() => {
						colorinput?.click();
					}}
				></button>

				<button class="imgbutton" on:click={() => fileInput.click()}>
					img
				</button>
				<input
					type="file"
					accept="image/*"
					bind:this={fileInput}
					on:change={handleImageFile}
					style="display: none"
				/>
			</div>
		</div>
	{/if}

	<div class="editorcontainer" bind:this={element} />
	{#if editor_hadchanges && !$editorblocked}
		<button on:click={handlesend}>💾 save!</button>
	{/if}
	{#if $tagSuggestions}
		{#if $tagSuggestions.length}
			<div class="tagsuggestions">
				{#each $tagSuggestions as suggestion}
					<div style="background:{suggestion.color};color:white">
						{suggestion.name}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</main>

<style>
	main {
		background: var(--card-bg);
		padding: 15px;
	}
	.button-group {
		display: flex;
	}

	.editorcontainer {
		background: #ffffff1c;
	}
</style>
