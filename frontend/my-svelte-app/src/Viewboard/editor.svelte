<script>
		// import { onMount } from "svelte";
		import { Editor, rootCtx, defaultValueCtx, editorViewCtx, serializerCtx } from "@milkdown/core";
		import { commonmark } from "@milkdown/preset-commonmark";
		import { insert, replaceAll } from '@milkdown/utils';
		import {createEventDispatcher} from 'svelte';
		import { onDestroy } from 'svelte';

		let isAlive = true
		onDestroy(()=>{
			isAlive = false
		})
		// import { listener, listenerCtx } from '@milkdown/plugin-listener';
		// import { nord } from "@milkdown/theme-nord";
		// import { emoji } from "@milkdown/plugin-emoji";

		const dispatch = createEventDispatcher();

		export let clearAllonEnter = true
		export let defaultValue = {
				type: 'json',
				value: {
						"type": "doc",
						"content": [
							{
							"type": "paragraph",
							"content": [
								{
								"type": "text",
								"text": "hello!!"
								}
							]
							}
						]
						}
			};

		function editor(dom) {


		  const MakeEditor = Editor.make().config(ctx => {
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
		    // .use(listener)
		    .create();


		      MakeEditor.then((editor) => {
		      	// console.log(editor)

		      	const getMarkdown = () => {
					        return editor.action((ctx) => {
					            const editorView = ctx.get(editorViewCtx);
								console.log(editorView.state.doc.toJSON())
					            return editorView.state.doc.toJSON()
					        });
					    }

				const enterHandler = (event)=> {
					if(isAlive){
						if (event.ctrlKey && event.key === 'Enter') {
							dispatch('newcontent',getMarkdown());
							window.scrollTo(0, document.body.scrollHeight);
							if(clearAllonEnter){
								editor.action(replaceAll(''));
							}

						}
					}else{
						document.removeEventListener('keydown', enterHandler);
					}
				}
				document.addEventListener('keydown', enterHandler);

				
				

			  })




		}
</script>


<div class="editor" use:editor />

<style>
	.editor{
		padding:20px;
		background:var(--card-bg);
	}
</style>