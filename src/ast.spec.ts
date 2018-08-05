import { expect } from 'chai'
import { Design, Component, Net } from './ast'

describe('AST', () => {
    it('should create a Design', () => {
        const design = new Design({
            version: 'A',
            source: 'ast.spec.ts',
            date: '2018-08-05 16:26:01',
            tool: 'libkicad 0.0.1',
        })
        expect(design.unwrap()).to.deep.equal({
            version: 'A',
            source: 'ast.spec.ts',
            date: '2018-08-05 16:26:01',
            tool: 'libkicad 0.0.1',
        })
        const design2 = Design.create()
        expect(design2.unwrap().tool).to.equal('libkicad 0.0.1')
    })

    it('should create a Component', () => {
        const r1 = new Component({ ref: 'R1', value: '10K', footprint: '0402' })
        expect(r1.unwrap()).to.deep.equal({
            ref: 'R1',
            value: '10K',
            footprint: '0402',
        })
    })

    it('should add and remove Component from Design', () => {
        const design = Design.create()

        // Add R1
        design.addComponent(new Component({
            ref: 'R1',
            value: '10k',
            footprint: '0402'
        }))
        expect(design.containsComponent('R1')).to.equal(true)
        const r1 = design.getComponent('R1') as any as Component
        expect(r1.unwrap()).to.deep.equal({
            ref: 'R1',
            value: '10k',
            footprint: '0402',
        })

        // Add R2
        design.addComponent(new Component({
            ref: 'R2',
            value: '22k',
            footprint: '0805'
        }))
        expect(design.containsComponent('R2')).to.equal(true)
        const r2 = design.getComponent('R2') as any as Component
        expect(r2.unwrap()).to.deep.equal({
            ref: 'R2',
            value: '22k',
            footprint: '0805',
        })

        // Remove R1
        design.removeComponent('R1')
        expect(design.containsComponent('R1')).to.equal(false)
    })

    it('should add and remove Net from Design', () => {
        const design = Design.create()

        // Add n1
        design.addNet(new Net({code: 0, name: 'n1'}))
        expect(design.containsNet(0)).to.equal(true)
        expect(design.containsNet('n1')).to.equal(true)
        expect(design.getNet(0)).to.equal(design.getNet('n1'))

        // Add n2
        design.addNet(new Net({code: 1, name: 'n2'}))
        expect(design.containsNet(1)).to.equal(true)
        expect(design.containsNet('n2')).to.equal(true)
        expect(design.getNet(1)).to.equal(design.getNet('n2'))

        // Remove n1
        design.removeNet('n1')
        expect(design.containsNet('n1')).to.equal(false)

        // Remove n2
        design.removeNet(1)
        expect(design.containsNet(1)).to.equal(false)
    })

    it('should generate random code/name', () => {
        expect(Net.create().equals(Net.create())).to.equal(false)
    })

})
