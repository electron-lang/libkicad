import { IDoc, enclose, parens, dquotes, render,
         line, lineBreak, nest, group, intersperse } from 'prettier-printer'
import { Design, Component, Net, Node } from './ast'

function printSexp(tag: string, value: IDoc): IDoc {
    return nest(2, [ enclose(parens, [tag, line, value]) ])
}

function printSexpGroup(tag: string, value: IDoc[]): IDoc {
    return printSexp(tag, intersperse(lineBreak, value))
}

function printAtom(tag: string, value?: string): IDoc {
    return group(printSexp(tag, enclose(dquotes, value || '')))
}

function printGroup<T>(tag: string, list: T[], fn: (elem: T) => IDoc): IDoc {
    if (list.length < 1) {
        return printSexp(tag, [])
    }
    return printSexp(tag, intersperse(lineBreak, list.map(fn)))
}

export const Printer = {

    render: (design: Design | Component | Net | Node): string => {
        if (design instanceof Design) {
            return render(80, Printer.printDesign(design))
        }
        if (design instanceof Component) {
            return render(80, Printer.printComponent(design))
        }
        if (design instanceof Net) {
            return render(80, Printer.printNet(design))
        }
        if (design instanceof Node) {
            return render(80, Printer.printNode(design))
        }
        return ''
    },

    printDesign: (design: Design): IDoc => {
        return printSexpGroup('export', [
            printAtom('version', design.version),
            printSexpGroup('design', [
                printAtom('source', design.source),
                printAtom('date', design.date),
                printAtom('tool', design.tool),
            ]),
            printGroup('components', design.components, Printer.printComponent),
            printGroup('nets', design.nets, Printer.printNet),
        ])
    },

    printComponent: (comp: Component): IDoc => {
        return printSexpGroup('comp', [
            printAtom('ref', comp.ref),
            printAtom('value', comp.value),
            printAtom('footprint', comp.footprint),
        ])
    },

    printNet: (net: Net): IDoc => {
        return printSexpGroup('net', [
            printAtom('code', net.code.toString()),
            printAtom('name', net.name.toString()),
            intersperse(lineBreak, net.nodes.map(Printer.printNode)),
        ])
    },

    printNode: (node: Node): IDoc => {
        return printSexpGroup('node', [
            printAtom('ref', node.ref),
            printAtom('pin', node.pin),
        ])
    }

}
