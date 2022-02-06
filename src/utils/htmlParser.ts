import { DOMWindow, JSDOM } from "jsdom";

export class HtmlParser {

    static window: DOMWindow;
    static document: Document;

    static parseBody = (html: string) => {
        this.window = new JSDOM(html).window;
        return this.document = this.window.document;
    }

    static parseRows = (body: HTMLBodyElement | null) => {
        const children = Array.from(body?.children ?? []).filter(x => x.tagName.toUpperCase() != "SCRIPT" && x.tagName.toUpperCase() != "STYLE");
        if (children.length > 1) return Array.from(children);
        let a = children[0];

        if (a) {

            if (a?.children.length > 1) return Array.from(a.children);
            let b = a?.children[0]

            if (b) {

                if (b?.children.length > 1) return Array.from(b.children);
                let c = b?.children[0];
                if (c) {

                    if (c?.children.length > 1) return Array.from(c.children)
                    let d = c?.children[0];

                    if (d?.children.length > 1) return Array.from(d.children);

                    return this.parseParentChildren(d)

                }

                return this.parseParentChildren(b)
            }

            return this.parseParentChildren(a);
        }

        return [];
    }

    static parseParentChildren = (element: Element) => Array.from(element?.parentElement?.children ?? []);

    static parseColumns = (row: Element, hasMultipleCells: boolean) =>
        Array.from(hasMultipleCells ? row.children[0]?.children[0]?.children ?? row.children[0]?.children : row.children);

    static parseInlineStyle(element: Element) {

        let style = {};
        const style_ = element.getAttribute("style");
        style_?.split(";").forEach(x => {
            const key = x.split(":")[0];
            const value = x.split(":")[1];
            Object.assign(style, { [key]:value});
        });

        return style;
    }
}