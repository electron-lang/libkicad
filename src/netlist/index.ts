export * from './ast'

import { Design } from './ast'
import { parse } from './parser'
import { printerInstance } from './printer'
import { Equiv } from './equiv'

export const netlist = {
    parse,
    print: (d: Design) => printerInstance.render(d),
    equiv: (d1: Design, d2: Design) => {
        const equiv = new Equiv(d1, d2)
        return equiv.equiv()
    }
}
