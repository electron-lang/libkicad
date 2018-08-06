import { Design, Component, Net, Node } from './ast'
//import { Printer } from './printer'

export class Equiv {
    constructor(protected design1: Design, protected design2: Design) {}

    equiv(): boolean {
        if (this.design1.nets.length !== this.design2.nets.length) {
            return false
        }
        const otherNets = this.design2.nets.map((net) => net)
        for (let net1 of this.design1.nets) {
            let i = 0
            for (let net2 of otherNets) {
                if (this.equivNet(net1, net2)) {
                    break
                }
                i += 1
            }
            if (i < otherNets.length) {
                otherNets.splice(i, 1)
            } else {
                console.log(`No matching net for ${net1.name}`)
                return false
            }
        }
        return true
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
