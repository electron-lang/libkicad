import { IDoc, render, lineBreak, intersperse } from 'prettier-printer'
import { SexpPrinter } from '../sexp'
import { Design, Component, Net, Node } from './ast'

class NetlistPrinter extends SexpPrinter {
    render(design: Design | Component | Net | Node): string {
        if (design instanceof Design) {
            return render(80, this.printDesign(design))
        }
        if (design instanceof Component) {
            return render(80, this.printComponent(design))
        }
        if (design instanceof Net) {
            return render(80, this.printNet(design))
        }
        if (design instanceof Node) {
            return render(80, this.printNode(design))
        }
        return ''
    }

    printDesign(design: Design): IDoc {
        // Work around kicad quirk, where version needs to be on the same
        // line as export.
        return this.printSexpGroup(`export (version "${design.version}")`, [
            this.printSexpGroup('design', [
                this.printAtom('source', design.source),
                this.printAtom('date', design.date),
                this.printAtom('tool', design.tool),
            ]),
            this.printGroup('components', design.components,
                            (comp) => this.printComponent(comp)),
            this.printGroup('nets', design.nets,
                            (net) => this.printNet(net)),
        ])
    }

    printComponent(comp: Component): IDoc {
        return this.printSexpGroup('comp', [
            this.printAtom('ref', comp.ref),
            this.printAtom('value', comp.value),
            this.printAtom('footprint', comp.footprint),
        ])
    }

    printNet(net: Net): IDoc {
        return this.printSexpGroup('net', [
            this.printAtom('code', net.code.toString()),
            this.printAtom('name', net.name.toString()),
            intersperse(lineBreak, net.nodes.map((node) => this.printNode(node))),
        ])
    }

    printNode(node: Node): IDoc {
        return this.printSexpGroup('node', [
            this.printAtom('ref', node.ref),
            this.printAtom('pin', node.pin),
        ])
    }
}

export const printerInstance = new NetlistPrinter()
