import { keymap } from 'prosemirror-keymap';
import { undo, redo, history } from 'prosemirror-history';
import { toggleMark, wrapIn, chainCommands, exitCode, setBlockType, joinUp, joinDown, lift, selectParentNode, baseKeymap } from 'prosemirror-commands';
import { NodeSelection, Plugin } from 'prosemirror-state';
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { undoInputRule, smartQuotes, ellipsis, emDash, inputRules, wrappingInputRule, textblockTypeInputRule } from 'prosemirror-inputrules';
import { Schema } from "prosemirror-model"

//schemas:

const mentionSchema = new Schema({
    nodes: {
        doc: { content: "paragraph+" },

        paragraph: {
            content: "text*",
            toDOM: () => ["p", { class: "my-paragraph" }, 0],
            parseDOM: [{ tag: "p.my-paragraph" }]
        },

        text: {
            inline: true,
            toDOM: node => ["span", { class: "my-text" }, 0],
            parseDOM: [{ tag: "span.my-text" }]
        },

        // example of an inline atom node
        mention: {
            inline: true,
            group: "inline",
            atom: true,
            attrs: { number: {} },
            toDOM: node => ["span", { class: "my-mention", "data-number": node.attrs.number }, node.attrs.number],
            parseDOM: [{ tag: "span.my-mention", getAttrs: dom => ({ number: dom.getAttribute("data-number") }) }]
        }
    }
});


/** Keymap bindings for basic markdown commands */
function buildKeymap(schema, mapKeys) {
    let keys = {}, type;
    function bind(key, cmd) {
        if (mapKeys) {
            let mapped = mapKeys[key];
            if (mapped === false) return;
            if (mapped) key = mapped;
        }
        keys[key] = cmd;
    }
    // Undo/Redo
    bind("Mod-z", undo);
    bind("Shift-Mod-z", redo);
    bind("Backspace", undoInputRule);
    bind("Mod-y", redo);

    // Navigation / editing
    bind("Alt-ArrowUp", joinUp);
    bind("Alt-ArrowDown", joinDown);
    bind("Mod-BracketLeft", lift);
    bind("Escape", selectParentNode);

    // Marks
    if (type = schema.marks.strong) {
        bind("Mod-b", toggleMark(type));
        bind("Mod-B", toggleMark(type));
    }
    if (type = schema.marks.em) {
        bind("Mod-i", toggleMark(type));
        bind("Mod-I", toggleMark(type));
    }
    if (type = schema.marks.code)
        bind("Mod-`", toggleMark(type));


    if (type = schema.nodes.hard_break) {
        let br = type;
        let cmd = chainCommands(exitCode, (state, dispatch) => {
            if (dispatch) dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
            return true;
        });
        bind("Shift-Enter", cmd);
    }

    // List items
    if (type = schema.nodes.list_item) {
        bind("Enter", splitListItem(type));
        bind("Mod-[", liftListItem(type));
        bind("Mod-]", sinkListItem(type));
    }



    // Horizontal rule
    if (type = schema.nodes.horizontal_rule) {
        let hr = type;
        bind("Mod-_", (state, dispatch) => {
            if (dispatch) dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
            return true;
        });
    }

    return keys;
}

/** Input rules for basic markdown block types */
function blockQuoteRule(nodeType) {
    return wrappingInputRule(/^\s*>\s$/, nodeType);
}
function orderedListRule(nodeType) {
    return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order == +match[1]);
}
/** Task-list style: [ ] or [x] */
function taskListRule(listNodeType, listItemNodeType) {
    return wrappingInputRule(
        /^\s*\[( |x)\]\s$/,
        listNodeType,
        match => ({ type: listItemNodeType, attrs: { checked: match[1] === 'x' } }),
        (match, node) => node.childCount
    );
}
function bulletListRule(nodeType) {
    return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}
function codeBlockRule(nodeType) {
    return textblockTypeInputRule(/^```$/, nodeType);
}
function headingRule(nodeType, maxLevel) {
    return textblockTypeInputRule(new RegExp(`^(#{1,${maxLevel}})\\s$`), nodeType, match => ({ level: match[1].length }));
}

/** Build all input rules for markdown blocks */
function buildInputRules(schema) {
    let rules = smartQuotes.concat(ellipsis, emDash), type;
    if (type = schema.nodes.blockquote) rules.push(blockQuoteRule(type));
    if (type = schema.nodes.ordered_list) rules.push(orderedListRule(type));
    if (type = schema.nodes.bullet_list) rules.push(bulletListRule(type));
    if (type = schema.nodes.code_block) rules.push(codeBlockRule(type));
    if (type = schema.nodes.heading) rules.push(headingRule(type, 6));
    return inputRules({ rules });
}

/** Minimal example setup: input rules + keymap + base keymap + history */
function exampleSetup({ schema, mapKeys } = {}) {
    return [
        buildInputRules(schema),
        keymap(buildKeymap(schema, mapKeys)),
        keymap(baseKeymap),
        history()
    ];
}

export { buildInputRules, buildKeymap, exampleSetup };
