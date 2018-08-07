import { Design, Component, Net, Node } from './ast'
import { printerInstance } from './printer'

export class Equiv {
    constructor(protected design1: Design, protected design2: Design) {}

    protected _equiv<T>(list1: T[], list2: T[], equiv: (a: T, b: T) => boolean): [T[], T[]] {
        // create a copy
        list2 = list2.map((x) => x)
        const noMatch: T[] = []
        for (let a of list1) {
            let i = 0
            for (let b of list2) {
                if (equiv(a, b)) {
                    break
                }
                i += 1
            }
            if (i < list2.length) {
                list2.splice(i, 1)
            } else {
                noMatch.push(a)
            }
        }
        return [noMatch, list2]
    }

    equiv(): boolean {
        if (this.equivComponents()) {
            return this.equivNets()
        }
        return false
    }

    equivComponents(): boolean {
        const [nomatch, leftover] = this._equiv(this.design1.components,
                                                this.design2.components,
                                                this.equivComponent)
        for (let a of nomatch) {
            console.log(`Component ${printerInstance.render(a)} not found.`)
        }

        for (let b of leftover) {
            console.log(`Component ${printerInstance.render(b)} leftover.`)
        }

        return nomatch.length == 0 && leftover.length == 0
    }

    equivNets(): boolean {
        const [nomatch, leftover] = this._equiv(this.design1.nets,
                                                this.design2.nets,
                                                (a, b) => this.equivNet(a, b))

        if (nomatch.length > 0) {
            console.log('Unmatched nets:')
            for (let a of nomatch) {
                console.log(a.nodes.map((n) => n.unwrap()))
            }
        }

        if (leftover.length > 0) {
            console.log('Leftover nets:')
            for (let b of leftover) {
                console.log(b.nodes.map((n) => n.unwrap()))
            }
        }

        const nmatches = this.design1.nets.length - nomatch.length
        console.log(`Matched ${nmatches} of ${this.design1.nets.length} nets.`)

        return nomatch.length == 0 && leftover.length == 0
    }

    equivNet(net1: Net, net2: Net): boolean {
        if (net1.nodes.length !== net2.nodes.length) {
            return false
        }
        const otherNodes = net2.nodes.map((node) => new Node(node.unwrap()))
        for (let n1 of net1.nodes) {
            let i = 0
            for (let n2 of otherNodes) {
                if (this.equivNode(n1, n2)) {
                    break
                }
                i += 1
            }
            if (i < otherNodes.length) {
                otherNodes.splice(i, 1)
            } else {
                return false
            }
        }
        return true
    }

    equivNode(node1: Node, node2: Node): boolean {
        if (node1.pin !== node2.pin) {
            return false
        }
        const c1 = this.design1.getComponent(node1.ref)
        const c2 = this.design2.getComponent(node2.ref)
        if (!(c1 && c2)) {
            throw new Error()
        }
        return this.equivComponent(c1, c2)
    }

    equivComponent(comp1: Component, comp2: Component): boolean {
        return comp1.footprint === comp2.footprint
    }
}
