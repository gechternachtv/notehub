import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

function findDone(doc) {
    // Matches done:55 or done:200/500
    const regex = /done:(\d{1,5})(?:\/(\d{1,5}))?/g
    const decorations = []

    doc.descendants((node, pos) => {
        if (!node.isText) return
        const text = node.text
        let match
        regex.lastIndex = 0

        while ((match = regex.exec(text)) !== null) {
            const start = pos + match.index
            const end = start + match[0].length

            let value = Number(match[1])
            const denominator = match[2] ? Number(match[2]) : null

            // If format is done:x/y, calculate percentage
            if (denominator !== null) {
                if (denominator > 0) {
                    value = Math.round((value / denominator) * 100)
                } else {
                    continue // skip division by zero
                }
            }

            // Only 0–100 final percentage is valid
            if (value >= 0 && value <= 100) {
                decorations.push(
                    Decoration.inline(start, end, {
                        class: 'doneelement',
                        'data-done': value,
                    })
                )
            }
        }
    })

    return DecorationSet.create(doc, decorations)
}

export const DoneHighlighter = Extension.create({
    name: 'doneHighlighter',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('doneHighlighter'),
                state: {
                    init(_, { doc }) {
                        return findDone(doc)
                    },
                    apply(tr) {
                        return findDone(tr.doc)
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
})
