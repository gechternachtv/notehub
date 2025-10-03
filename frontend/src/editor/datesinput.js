import { Extension, Mark } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

// Define the DateMark to wrap matched date text
export const DateMark = Mark.create({
    name: 'dateMark',

    addOptions() {
        return {
            HTMLAttributes: { class: 'date-mark' },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span.date-mark',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', HTMLAttributes, 0]
    },
})

// Function to find @DD-MM-YYYY patterns in the document
function findDates(doc) {
    const decorations = [];
    const regex = /@(\d{2}-\d{2}-\d{4})/g;

    // Iterate through all text nodes in the document
    doc.descendants((node, pos) => {
        if (!node.isText) return;

        const text = node.text || '';
        let match;

        // Reset regex lastIndex to avoid missing matches
        regex.lastIndex = 0;

        // Find all matches in the text node
        while ((match = regex.exec(text)) !== null) {
            const start = pos + match.index;
            const end = start + match[0].length;

            // Create a decoration with the DateMark
            decorations.push(
                Decoration.inline(start, end, {
                    class: 'date-mark',
                    'data-date': match[1], // Optional: Store the date part for reference
                }, {
                    markType: 'dateMark', // Associate with the DateMark
                })
            );
        }
    });

    return DecorationSet.create(doc, decorations);
}

// Extension to highlight @DD-MM-YYYY dates
export const DateHighlighter = Extension.create({
    name: 'dateHighlighter',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('dateHighlighter'),
                state: {
                    init(_, { doc }) {
                        return findDates(doc);
                    },
                    apply(transaction, oldState) {
                        return transaction.docChanged ? findDates(transaction.doc) : oldState;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                },
            }),
        ]
    },

    // Register the DateMark with the editor's schema
    addMarks() {
        return {
            dateMark: DateMark,
        }
    },
})