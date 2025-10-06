import { Extension, Mark } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { pb } from '../pb'

// ─────────────────────────────────────────────
// Load tags from PocketBase
// ─────────────────────────────────────────────
let tags = []

    ; (async () => {
        const records = await pb.collection('tags').getFullList({
            fields: 'name,color,id',
        })
        tags = records
        console.log('Loaded tags:', tags)
    })()

// ─────────────────────────────────────────────
// Define the TagMark
// ─────────────────────────────────────────────
export const TagMark = Mark.create({
    name: 'tagMark',

    addOptions() {
        return {
            HTMLAttributes: { class: 'tag-mark' },
        }
    },

    addAttributes() {
        return {
            name: {
                default: null,
                parseHTML: element => element.getAttribute('data-name'),
                renderHTML: attributes => {
                    if (!attributes.name) return {}
                    return { 'data-name': attributes.name }
                },
            },
            color: {
                default: 'rgb(41, 72, 115)',
                parseHTML: element => element.style.background || 'rgb(41, 72, 115)',
                renderHTML: attributes => {
                    return { style: `background: ${attributes.color || 'rgb(41, 72, 115)'}` }
                },
            },
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-tag-id'),
                renderHTML: attributes => {
                    if (!attributes.id) return {}
                    return { 'data-tag-id': attributes.id }
                },
            },
        }
    },

    parseHTML() {
        return [{ tag: 'span.tag-mark' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', this.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },
})

// ─────────────────────────────────────────────
// Function to find #tag patterns in the document
// ─────────────────────────────────────────────
function findTags(doc) {
    const decorations = []

    // Match any #word without spaces and at least one char after #
    const regex = /#([^\s#]+)/g

    doc.descendants((node, pos) => {
        if (!node.isText) return
        const text = node.text || ''
        let match
        regex.lastIndex = 0

        while ((match = regex.exec(text)) !== null) {
            const start = pos + match.index
            const end = start + match[0].length
            const tagName = match[1]

            // Try to find matching tag from PocketBase
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

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('tagHighlighter'),
                state: {
                    init(_, { doc }) {
                        return findTags(doc)
                    },
                    apply(transaction, oldState) {
                        return transaction.docChanged ? findTags(transaction.doc) : oldState
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state)
                    },
                },
            }),
        ]
    },

    addMarks() {
        return {
            tagMark: TagMark,
        }
    },
})

export default TagHighlighter
