import {Plugin, TextFileView, TFile} from 'obsidian';

export default class CopyObsidianURI extends Plugin {
    load() {
        this.app.workspace.on("file-menu", ((e, t) => {
            t instanceof TFile && e.addItem(((e) => {
                    return e.setTitle('Copy as link').setIcon('link').onClick((() => {
                        return this.copy(this.app.fileManager.generateMarkdownLink(t, t.path))
                    }))
                }
            ))

            t instanceof TFile && e.addItem(((e) => {
                    return e.setTitle('Copy with header').setIcon('link').onClick((() => {
                        const sf = this.app.workspace.getLeavesOfType('search')[0]
                        // @ts-ignore
                        const content = sf.view.dom.resultDomLookup.forEach(e => {
                            if (e.file.basename === t.basename) {
                                const fst = e.result.content[0][0]
                                const headings = this.app.metadataCache.getFileCache(t).headings.filter(h => h.position.start.offset < fst).slice(-1)
                                return this.copy(this.app.fileManager.generateMarkdownLink(t, t.path, '#' + headings[0].heading))
                            }
                        })
                    }))
                }
            ))
        }))
    }

    copy(e: string) {
        if (navigator.clipboard && navigator.permissions)
            navigator.clipboard.writeText(e);
        else {
            var t = document.createElement("textarea");
            t.value = e,
                t.style.top = "0",
                t.style.left = "0",
                t.style.position = "fixed",
                document.body.appendChild(t);
            try {
                t.focus(),
                    t.select(),
                    document.execCommand("copy")
            } catch (e) {}
            document.body.removeChild(t)
        }
    }

    unload() {
        console.log('unloading plugin')
    }
}
