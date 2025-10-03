import { Extension, Mark } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

// Define the fixed list of tags
const tags = [
    { name: 'tag1', color: 'red' },
    { name: 'tag2', color: 'blue' },
    { name: 'tag3', color: 'green' },
];

// Define the TagMark to wrap matched tag text
export const TagMark = Mark.create({
    name: 'tagMark',

    addOptions() {
        return {
            HTMLAttributes: { class: 'tag-mark' }, // Apply a CSS class to the mark
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span.tag-mark', // Parse HTML elements with the 'tag-mark' class
            },
        ]
    },

    renderHTML({ mark, HTMLAttributes }) {
        const name = mark.attrs.name || '';
        const color = mark.attrs.color || '';
        return [
            'span',
            {
                ...HTMLAttributes,
                'data-name': name,
                ...(color && { style: `background: ${color}` }),
            },
            0,
        ];
    },

    addAttributes() {
        return {
            name: {
                default: null,
                parseHTML: element => element.getAttribute('data-name'),
                renderHTML: attributes => {
                    if (!attributes.name) return {};
                    return { 'data-name': attributes.name };
                },
            },
            color: {
                default: null,
                parseHTML: element => element.style.background || null,
                renderHTML: attributes => {
                    if (!attributes.color) return {};
                    return { style: `background: ${attributes.color}` };
                },
            },
        };
    },
})

// Function to find #tag patterns in the document
function findTags(doc) {
    const decorations = [];
    // Create a regex for the fixed tags (e.g., #tag1, #tag2, #tag3)
    const tagNames = tags.map(tag => tag.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    const regex = new RegExp(`#(${tagNames})\\b`, 'g');

    doc.descendants((node, pos) => {
        if (!node.isText) return;

        const text = node.text || '';
        let match;
        regex.lastIndex = 0;

        while ((match = regex.exec(text)) !== null) {
            const start = pos + match.index;
            const end = start + match[0].length;
            const tagName = match[1]; // e.g., tag1

            // Find the corresponding tag object
            const tag = tags.find(t => t.name === tagName);
            if (tag) {
                decorations.push(
                    Decoration.inline(start, end, {
                        class: 'tag-mark',
                        'data-name': tag.name,
                        style: `background: ${tag.color}`,
                    }, {
                        markType: 'tagMark',
                        attrs: { name: tag.name, color: tag.color },
                    })
                );
            }
        }
    });

    return DecorationSet.create(doc, decorations);
}

// Extension to highlight #tag patterns
export const TagHighlighter = Extension.create({
    name: 'tagHighlighter',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('tagHighlighter'),
                state: {
                    init(_, { doc }) {
                        return findTags(doc);
                    },
                    apply(transaction, oldState) {
                        return transaction.docChanged ? findTags(transaction.doc) : oldState;
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

    addMarks() {
        return {
            tagMark: TagMark,
        }
    },
})

export default TagHighlighter;