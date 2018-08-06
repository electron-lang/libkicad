import { expect } from 'chai'
import { Design, Component, Net } from './ast'
import { Equiv } from './equiv'

function vdiv(fp1: string, fp2: string,
              pins: [string, string, string, string]): Design {
    const design = Design.create()
    const vccSym = Component.create('vcc')
    vccSym.ref = 'vcc'
    const r1 = Component.create(fp1)
    r1.ref = 'R1'
    const r2 = Component.create(fp2)
    r2.ref = 'R2'
    const gndSym = Component.create('gnd')
    gndSym.ref = 'gnd'
    design.addComponent(vccSym)
    design.addComponent(r1)
    design.addComponent(r2)
    design.addComponent(gndSym)
    const vcc = Net.create('vcc')
    const n1 = Net.create('n1')
    const gnd = Net.create('gnd')
    vcc.addNode(r1.getNode(pins[0]))
    n1.addNode(r1.getNode(pins[1]))
    n1.addNode(r2.getNode(pins[2]))
    gnd.addNode(r2.getNode(pins[3]))
    design.addNet(vcc)
    design.addNet(n1)
    design.addNet(gnd)
    return design
}

function expectEquiv(d1: Design, d2: Design, res: boolean) {
    const equiv = new Equiv(d1, d2)
    const isEquiv = equiv.equiv()
    expect(isEquiv).to.equal(res)
}

describe('Component', () => {
    it('should be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0402')
        expect(equiv.equivComponent(c1, c2)).to.equal(true)
    })

    it('should not be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0805')
        expect(equiv.equivComponent(c1, c2)).to.equal(false)
    })
})

describe('Node', () => {
    it('should be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0402')
        d1.addComponent(c1)
        d2.addComponent(c2)
        expect(equiv.equivNode(c1.getNode('1'), c2.getNode('1'))).to.equal(true)
    })

    it('should not be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0805')
        d1.addComponent(c1)
        d2.addComponent(c2)
        expect(equiv.equivNode(c1.getNode('1'), c2.getNode('1'))).to.equal(false)
    })

    it('should not be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0402')
        d1.addComponent(c1)
        d2.addComponent(c2)
        expect(equiv.equivNode(c1.getNode('1'), c2.getNode('2'))).to.equal(false)
    })
})

describe('Net', () => {
    it('should be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0402')
        d1.addComponent(c1)
        d1.addComponent(c2)
        d2.addComponent(c1)
        d2.addComponent(c2)
        const n1 = Net.create()
        const n2 = Net.create()
        n1.addNode(c1.getNode('1'))
        n1.addNode(c2.getNode('2'))
        n2.addNode(c1.getNode('1'))
        n2.addNode(c2.getNode('2'))
        expect(equiv.equivNet(n1, n2)).to.equal(true)
    })

    it('should not be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0805')
        d1.addComponent(c1)
        d1.addComponent(c2)
        d2.addComponent(c1)
        d2.addComponent(c2)
        const n1 = Net.create()
        const n2 = Net.create()
        n1.addNode(c1.getNode('1'))
        n1.addNode(c2.getNode('2'))
        n2.addNode(c1.getNode('2'))
        n2.addNode(c2.getNode('1'))
        expect(equiv.equivNet(n1, n2)).to.equal(false)
    })

    it('should not be equiv', () => {
        const d1 = Design.create()
        const d2 = Design.create()
        const equiv = new Equiv(d1, d2)
        const c1 = Component.create('0402')
        const c2 = Component.create('0402')
        d1.addComponent(c1)
        d1.addComponent(c2)
        d2.addComponent(c1)
        d2.addComponent(c2)
        const n1 = Net.create()
        const n2 = Net.create()
        n1.addNode(c1.getNode('1'))
        n1.addNode(c2.getNode('2'))
        n2.addNode(c1.getNode('1'))
        n2.addNode(c2.getNode('3'))
        expect(equiv.equivNet(n1, n2)).to.equal(false)
    })
})

describe('Design', () => {
    it('should be equiv', () => {
        const d1 = vdiv('0402', '0402', ['a', 'b', 'c', 'd'])
        const d2 = vdiv('0402', '0402', ['a', 'b', 'c', 'd'])
        expectEquiv(d1, d2, true)
    })

    it('should not be equiv', () => {
        const d1 = vdiv('0402', '0402', ['1', '2', '1', '2'])
        const d2 = vdiv('0805', '0805', ['1', '2', '1', '2'])
        expectEquiv(d1, d2, false)
    })
})
