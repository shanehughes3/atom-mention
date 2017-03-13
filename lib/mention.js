'use babel';

import MentionView from './mention-view';
import MentionGrammar from "./mention-grammar";
import { CompositeDisposable } from 'atom';

export default {

    mentionView: null,
    subscriptions: null,

    initialize(state) {
        this.mentionView = new MentionView(state.mentionViewState);
        // this.modalPanel = atom.workspace.addModalPanel({
        //     item: this.mentionView.getElement(),
        //     visible: false
        // });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
        this.mentionGrammar = new MentionGrammar();
        this.mentionGrammar.setGrammar();


        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'mention:setGrammar': () => this.mentionGrammar.setGrammar()
        }));
        atom.config.observe("mention.myNickname", (nickname) => {
            this.mentionGrammar.setGrammar(nickname)
            .then(() => {
                editors = atom.workspace.getTextEditors();
                // this doesn't work - seems the function was removed
                editors.forEach((editor) => editor.tokenizedBuffer.retokenizeLines());
            });
        });
    },

    deactivate() {
        // this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.mentionView.destroy();
    },

    serialize() {
        return {
            mentionViewState: this.mentionView.serialize()
        };
    },

    // toggle() {
    //     console.log('Mention was toggled!');
    //     return (
    //         this.modalPanel.isVisible() ?
    //         this.modalPanel.hide() :
    //         this.modalPanel.show()
    //     );
    // },

    config: {
        myNickname: {
            description: "The name other users can use to @-mention you",
            type: "string",
            default: ""
        },
        myFullName: {
            description: "Your full name, shown when other users are selecting who to mention",
            type: "string",
            default: ""
        },
        statusBarIndicator: {
            type: "boolean",
            default: true
        }
    }

};
