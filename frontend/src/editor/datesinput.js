import { Extension, Mark } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const DateMark = Mark.create({
    name: 'dateMark',

    addOptions() {
        return {
            HTMLAttributes: { class: 'date-mark' },
        }
    },

    parseHTML() {
        return [{ tag: 'span.date-mark' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', HTMLAttributes, 0]
    },
})

function findDates(doc) {
    const decorations = []

    const regex = /@(\d{2}-\d{2}-\d{4})(?::(\d{2}):(\d{2}))?/g

    doc.descendants((node, pos) => {
        if (!node.isText) return

        const text = node.text || ''
        let match
        regex.lastIndex = 0

        while ((match = regex.exec(text)) !== null) {
            const start = pos + match.index
            const end = start + match[0].length


            const fullDate =
                match[2] && match[3]
                    ? `${match[1]}:${match[2]}:${match[3]}`
                    : match[1]

            decorations.push(
                Decoration.inline(
                    start,
                    end,
                    {
                        class: 'date-mark',
                        'data-date': fullDate,
                    },
                    { markType: 'dateMark' },
                ),
            )
        }
    })

    return DecorationSet.create(doc, decorations)
}

export const DateHighlighter = Extension.create({
    name: 'dateHighlighter',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('dateHighlighter'),
                state: {
                    init(_, { doc }) {
                        return findDates(doc)
                    },
                    apply(tr, oldState) {
                        return tr.docChanged ? findDates(tr.doc) : oldState
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
            dateMark: DateMark,
        }
    },
})
