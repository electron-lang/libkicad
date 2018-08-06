import { expect } from 'chai'
import { Design, Component, Net } from './ast'
import { Printer } from './printer'

describe('Printer', () => {
    it('should create a voltage divider', () => {
        const design = new Design({
            version: '0.0.1',
            source: 'printer.spec.ts',
            date: '2018-08-05 16:26:01',
            tool: 'libkicad 0.0.1',
        })
        const r1 = new Component({ref: 'R1', value: '10K', footprint: '0402'})
        const r2 = new Component({ref: 'R2', value: '22K', footprint: '0402'})
        design.addComponent(r1)
        design.addComponent(r2)
        const n1 = new Net({ code: 0, name: 'n1' })
        n1.addNode(r1.getNode('2'))
        n1.addNode(r2.getNode('1'))
        design.addNet(n1)

        expect(Printer.render(design)).to.equal(`
(export
  (version "0.0.1")
  (design
    (source "printer.spec.ts")
    (date "2018-08-05 16:26:01")
    (tool "libkicad 0.0.1"))
  (components
    (comp
      (ref "R1")
      (value "10K")
      (footprint "0402"))
    (comp
      (ref "R2")
      (value "22K")
      (footprint "0402")))
  (nets
    (net
      (code "0")
      (name "n1")
      (node
        (ref "R1")
        (pin "2"))
      (node
        (ref "R2")
        (pin "1")))))
`.trim())
    })
})
