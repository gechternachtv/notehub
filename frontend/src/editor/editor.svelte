<script>
	import { onMount } from "svelte";
	import { EditorView } from "prosemirror-view";
	import { EditorState } from "prosemirror-state";
	import {
		schema,
		defaultMarkdownParser,
		defaultMarkdownSerializer,
	} from "prosemirror-markdown";
	import { exampleSetup } from "./settings.js";

	let editorElement;
	let editor;

	let initialContent = `# Hello World\n\nType some **Markdown** here!`;

	class ProseMirrorView {
		constructor(target, content) {
			this.view = new EditorView(target, {
				state: EditorState.create({
					doc: defaultMarkdownParser.parse(content),
					plugins: exampleSetup({ schema }),
				}),
			});
		}

		get content() {
			return defaultMarkdownSerializer.serialize(this.view.state.doc);
		}

		focus() {
			this.view.focus();
		}
		destroy() {
			this.view.destroy();
		}
	}

	onMount(() => {
		editor = new ProseMirrorView(editorElement, initialContent);
	});
</script>

<main>
	<div
		bind:this={editorElement}
		style="border:1px solid #ccc; padding:10px; min-height:200px;"
	></div>
	<button on:click={() => console.log(editor.content)}>Send</button>
</main>

<style>
	/* Basic styling for the editor */
	.ProseMirror {
		outline: none;
		font-family: sans-serif;
		font-size: 16px;
		line-height: 1.5;
	}
</style>
