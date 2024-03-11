<script>
		// import { onMount } from "svelte";
		import { Editor, rootCtx, defaultValueCtx, editorViewCtx, serializerCtx } from "@milkdown/core";
		import { commonmark } from "@milkdown/preset-commonmark";
		import { insert, replaceAll } from '@milkdown/utils';
		import {createEventDispatcher} from 'svelte';
		import { onDestroy } from 'svelte';


		let editorel;
		let sendBtn = (e)=>{
			const event = new Event("send")
			console.log(event)
			editorel.dispatchEvent(event)
		}
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
								"text": "Edit me"
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
								const doc = editorView.state.doc
								console.log(doc.content.size)
					            return {
									
									string:doc.textBetween(0,doc.content.size,"\n"),
									json:doc.toJSON()
								}
					        });
					    }

				const enterHandler = (event)=> {
					
						if ((event.ctrlKey && event.key === 'Enter') || event.type === "send") {
							dispatch('newcontent',getMarkdown());
							window.scrollTo(0, document.body.scrollHeight);
							if(clearAllonEnter){
								editor.action(replaceAll(''));
							}

						}
					
				}
				editorel.addEventListener('keydown', enterHandler);
				editorel.addEventListener("send",enterHandler);


			  })




		}
</script>

<main>
	<div bind:this={editorel} class="editor" use:editor />
	<button class="sendbtn" on:click={sendBtn}>send</button>
</main>



<style>
	main{
		padding:20px;
		background:var(--card-bg);
		display:grid;
		gap:10px;
	}

.sendbtn {
  max-width: 103px;
  justify-content: center;
}

</style>