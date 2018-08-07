import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { netlist } from '../src'

describe('tinyfpga', () => {
    it('should parse', () => {
        const p = resolve('./tests/TinyFPGA-B.net')
        const t = readFileSync(p)
        const d = netlist.parse(t.toString())
        expect(d.tool).to.equal("Eeschema 4.0.7")
    })
})
