import { Extension, Mark } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { pb } from '../pb'

import { currentUsergroup, tagSuggestions } from '../stores'

// ─────────────────────────────────────────────
// Load tags from PocketBase
// ─────────────────────────────────────────────
let tags = []

currentUsergroup.subscribe(async e => {
    try {
        if (e?.id) {
            const records = await pb.collection('tags').getFullList({
                filter: `usergroup.id = "${e.id}"`,
                fields: 'name,color,id',
            })
            tags = records
        }
    } catch (error) {
        console.warn(error)
    }
})

// ─────────────────────────────────────────────
// Define the TagMark
// ─────────────────────────────────────────────
export const TagMark = Mark.create({
    name: 'tagMark',

    addOptions() {
        return { HTMLAttributes: { class: 'tag-mark' } }
    },

    addAttributes() {
        return {
            name: {
                default: null,
                parseHTML: el => el.getAttribute('data-name'),
                renderHTML: attrs => (attrs.name ? { 'data-name': attrs.name } : {}),
            },
            color: {
                default: 'rgb(41, 72, 115)',
                parseHTML: el => el.style.background || 'rgb(41, 72, 115)',
                renderHTML: attrs => ({ style: `background: ${attrs.color || 'rgb(41,72,115)'}` }),
            },
            id: {
                default: null,
                parseHTML: el => el.getAttribute('data-tag-id'),
                renderHTML: attrs => (attrs.id ? { 'data-tag-id': attrs.id } : {}),
            },
        }
    },

    parseHTML() { return [{ tag: 'span.tag-mark' }] },

    renderHTML({ HTMLAttributes }) {
        return ['span', this.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },
})

// ─────────────────────────────────────────────
// Function to find #tag patterns in the document
// ─────────────────────────────────────────────
function findTags(doc) {
    const decorations = []
    const regex = /(?:^|\s)#([^\s#]+)/g


    doc.descendants((node, pos) => {
        if (!node.isText) return
        const text = node.text || ''
        let match
        regex.lastIndex = 0

        while ((match = regex.exec(text)) !== null) {
            const start = pos + match.index
            const end = start + match[0].length
            const tagName = match[1]

            const tag = tags.find(t => t.name === tagName)
            const color = tag?.color || 'rgb(41, 72, 115)'
            const id = tag?.id || null

            decorations.push(
                Decoration.inline(
                    start,
                    end,
                    {
                        class: 'tag-mark',
                        'data-name': tagName,
                        ...(id && { 'data-tag-id': id }),
                        style: `background: ${color}`,
                    },
                    {
                        markType: 'tagMark',
                        attrs: { name: tagName, color, id },
                    }
                )
            )
        }
    })

    return DecorationSet.create(doc, decorations)
}

// ─────────────────────────────────────────────
// TagHighlighter Extension
// ─────────────────────────────────────────────
export const TagHighlighter = Extension.create({
    name: 'tagHighlighter',

    addMarks() { return { tagMark: TagMark } },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('tagHighlighter'),
                state: {
                    init(_, { doc }) { return findTags(doc) },
                    apply(transaction, oldState) { return transaction.docChanged ? findTags(transaction.doc) : oldState },
                },
                props: {

                    decorations(state) { return this.getState(state) },

                    // 👇 Live detection of the tag being typed
                    handleTextInput(view, from, to, text) {

                        const { state } = view
                        const pos = state.selection.from
                        const textBefore = state.doc.textBetween(0, pos, '\n', '\0')

                        if (text === "#") {

                            tagSuggestions.set(tags)
                        } else {
                            const match = textBefore.match(/(?:^|\s)#([^\s#]*)$/)
                            if (match) {
                                const currentTag = match[1] + text

                                const suggestions = tags.filter(tag =>
                                    tag.name.toLowerCase().startsWith(currentTag.toLowerCase())
                                )
                                tagSuggestions.update(a => suggestions)

                            } else {
                                tagSuggestions.update(a => [])
                            }
                        }
                        // Match the latest #word being typed (even incomplete)


                        return false // allow normal typing
                    },
                    handleKeyDown(view, event) {
                        if (event.key === 'Enter') {
                            tagSuggestions.set([])
                        } else if (event.key === 'Backspace') {
                            tagSuggestions.set([])
                        } else if (event.key === 'Space') {
                            tagSuggestions.set([])
                        }
                        return false // allow normal handling
                    },

                },
            }),
        ]
    },
})

export default TagHighlighter
