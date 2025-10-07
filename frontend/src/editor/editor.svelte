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
	import { tagSuggestions } from "../stores.js";
	import Picmobutton from "../Picmo/picmobutton.svelte";
	let element;
	let editor;

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
		});

		editor.commands.setContent(defaultValue.value.content);
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
				return { dataChecked: e.getAttribute("data-date") };
			});
			console.log({
				card_images,
				card_tags,
				card_checklistitem,
				card_title,
				card_mainlink,
				card_datementions,
			});

			console.log(editor.getJSON().content);
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
</script>

<main>
	<Picmobutton allowcuston={true} on:emojiselect={emojiSelect}></Picmobutton>
	{#if editor}
		<div class="control-group">
			<div class="button-group">
				<button
					on:click={() =>
						console.log &&
						editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					class={editor.isActive("bold") ? "is-active" : ""}
				>
					Bold
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
					Italic
				</button>
				<button
					on:click={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor
						.can()
						.chain()
						.focus()
						.toggleStrike()
						.run()}
					class={editor.isActive("strike") ? "is-active" : ""}
				>
					Strike
				</button>

				<button
					on:click={() =>
						editor.chain().focus().toggleBulletList().run()}
					class={editor.isActive("bulletList") ? "is-active" : ""}
				>
					Bullet list
				</button>
				<button
					on:click={() =>
						editor.chain().focus().toggleOrderedList().run()}
					class={editor.isActive("orderedList") ? "is-active" : ""}
				>
					Ordered list
				</button>

				<button
					on:click={() =>
						editor.chain().focus().toggleBlockquote().run()}
					class={editor.isActive("blockquote") ? "is-active" : ""}
				>
					Blockquote
				</button>
				<button
					on:click={() =>
						editor.chain().focus().setHorizontalRule().run()}
				>
					Horizontal rule
				</button>

				<button
					on:click={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				>
					Undo
				</button>

				<button
					on:click={() =>
						editor.chain().focus().setColor("#958DF1").run()}
					class={editor.isActive("textStyle", { color: "#958DF1" })
						? "is-active"
						: ""}
				>
					Purple
				</button>
			</div>
		</div>
	{/if}
	<div class="editorcontainer" bind:this={element} />
	<button on:click={handlesend}></button>

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
