"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html2Unlayer = void 0;
const htmlParser_1 = require("../utils/htmlParser");
class Html2Unlayer {
    constructor() {
        /**
        *
        * @param columns columns Column[]
        * @returns number[]
        */
        this.getCells = (columns) => {
            const cells = columns.map(x => {
                var _a;
                return (_a = Array.from(x.children)) === null || _a === void 0 ? void 0 : _a.map((y) => Number(y.style._values["min-width"].replace(/[a-zA-Z]+/g, "")));
            })[0];
            return cells.map(x => Math.round(x / Math.min(...cells)));
        };
        this.hasMultipleCell = (columns) => this.getCells(columns).length > 1;
        this.getColumns = (rows) => Array.from(rows).map((column, i) => {
            return {
                contents: this.getContents(column),
                values: this.getStyle(column === null || column === void 0 ? void 0 : column.style, '', `u_column_${i + 1}`),
            };
        });
        this.getContents = (column) => Array.from(column.children).map((content, i) => {
            var _a;
            return {
                type: this.getContentType(content),
                values: Object.assign(Object.assign({}, this.getStyle(content.style, content.outerHTML, `u_content_${this.getContentType(content)}_${i + 1}`)), {
                    src: {
                        url: (_a = content === null || content === void 0 ? void 0 : content.querySelector("img")) === null || _a === void 0 ? void 0 : _a.src,
                        width: "auto",
                        height: "auto"
                    }
                })
            };
        });
        /**
        *
        * @param style Style
        * @param text html
        * @returns Unlayer Values
        */
        this.getStyle = (style, text = '', id_type) => style ? Object.assign({}, {
            containerPadding: style === null || style === void 0 ? void 0 : style.padding,
            color: this.getColor(style["color"]),
            headingType: "",
            fontFamily: style["font-family"] ? {
                label: "font",
                value: style["font-family"]
            } : {},
            fontSize: style["font-size"],
            textAlign: style["text-align"],
            lineHeight: style["line-height"],
            linkStyle: style["link-style"],
            displayCondition: null,
            _meta: {
                htmlID: id_type,
                htmlClassNames: id_type === null || id_type === void 0 ? void 0 : id_type.replace(/_\d/g, "")
            },
            selectable: true,
            draggable: true,
            duplicatable: true,
            deletable: true,
            hideable: false,
            text: text,
            size: {
                autoWidth: true,
                width: style === null || style === void 0 ? void 0 : style.width
            },
            padding: style["padding"],
            border: {
                borderBottom: style["border-bottom"],
                borderLeft: style["border-left"],
                borderRight: style["border-right"],
                borderTop: style["border-top"]
            },
            borderRadius: style["border-radius"],
            calculatedWidth: null,
            calculatedHeight: null,
            textColor: style["color"],
            backgroundColor: this.getColor(style["background-color"]),
            backgroundImage: {
                url: style["background-image"],
                fullWidth: false,
                repeat: false,
                center: true,
                cover: false
            },
            contentWidth: "500px",
            contentAlign: "center",
            preheaderText: "",
            columns: id_type === null || id_type === void 0 ? void 0 : id_type.includes("column"),
            columnsBackgroundColor: this.getColor(style["background-color"]),
            hideDesktop: false,
        }) : {};
        /**
         *
         * @param color string
         * @returns String
         */
        this.getColor = (color) => color === "transparent" ? "" : color;
        this.getContentType = (content) => {
            if (content.querySelector("img")) {
                return "image";
            }
            return "text";
        };
    }
    from(data) {
        var _a;
        let design = {};
        const body = htmlParser_1.HtmlParser.parse(data).querySelector("body");
        design.body = {
            rows: Array.from((_a = body === null || body === void 0 ? void 0 : body.children[0].children[0].children[0].children[0].children) !== null && _a !== void 0 ? _a : []).map((row, i) => {
                const hasMultipleCells = this.hasMultipleCell(Array.from(row.children[0].children));
                return {
                    cells: this.getCells(Array.from(row.children[0].children)),
                    columns: hasMultipleCells ? this.getColumns(row.children[0].children[0].children) : this.getColumns(row.children),
                    values: this.getStyle(row.style, '', `u_row_${i + 1}`)
                };
            }),
            values: this.getStyle(body === null || body === void 0 ? void 0 : body.style, '', `u_body`)
        };
        return design;
    }
}
exports.Html2Unlayer = Html2Unlayer;