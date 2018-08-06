import { expect } from 'chai'
import { Libs, Lib, printerInstance } from './fplib'

describe('LibPrinter', () => {
    it('should print fplib table', () => {
        const fplib = new Libs()
        fplib.addLib(Lib.create('tinyfpga'))
        expect(printerInstance.render(fplib)).to.equal(`
(fp_lib_table
  (lib
    (name "tinyfpga")
    (type "KiCad")
    (uri "\${KIPRJMOD}/tinyfpga.pretty")
    (options "")
    (descr "")))
`.trim())
    })
})
