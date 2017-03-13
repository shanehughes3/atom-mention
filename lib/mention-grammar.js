'use babel';

export default class MentionGrammar {

    constructor() {
        this.nickname = atom.config.get("mention.myNickname");
        this.currentGrammar;
    }

    setGrammar(nickname) {
        if (nickname) {
            this.nickname = nickname;
        }
        if (this.currentGrammar) {
            this.currentGrammar.dispose();
        }

        const path = atom.packages.getPackageDirPaths() + "/mention/lib/mention-grammar.json";
        return new Promise((resolve) => {
            atom.workspace.grammarRegistry.readGrammar(path, (err, rules) => {
                rules.rawPatterns[0].match = `@(?!${this.nickname})[A-Za-z0-9]+`;
                rules.rawPatterns.push({
                    match: `@${this.nickname}[ :-]`,
                    name: "storage.type.class.meta"
                });
                this.currentGrammar = atom.workspace.grammarRegistry.addGrammar(rules);
                resolve();
            });
        });
    }
}
