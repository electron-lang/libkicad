import { readFileSync } from 'fs'
import { resolve } from 'path'
import { netlist } from '../src'

describe('component_tester', () => {
    it('should parse component_tester.net', () => {
        const p1 = resolve('./tests/component_tester.net')
        const t1 = readFileSync(p1)
        netlist.parse(t1.toString())
    })
})
