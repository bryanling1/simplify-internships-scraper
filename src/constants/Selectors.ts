export const Selectors = {
    page: {
        simplify: {
            description: {
                blocks: "div.lg\\:w-1\\/2.xl\\:w-3\\/5 div.text-left:not(.hidden)",
                block: {
                    title: "div:nth-of-type(1)",
                    text: "div:nth-of-type(2)",
                }
            },
            headings: ".text-sm.font-bold",
            compensation: "div.rounded-lg.border.border-gray-100.bg-gray-50.p-5 p",
            pills: {
                industry: "div.flex.flex-col.gap-4.lg\\:w-1\\/2.xl\\:w-2\\/5 > div.mb-1.flex.flex-wrap.gap-2.text-sm.text-secondary-400 div"
            }
        }
    },
    jobTable: {
        table1: "markdown-accessiblity-table",
        table2: "markdown-accessibility-table",
        rows: (column: 4 | 5) => `table tbody tr:has(td:nth-child(${column}) a[href])`
    }
}