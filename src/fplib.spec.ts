import { expect } from 'chai'
import { Libs, Lib, fplib } from './fplib'

describe('LibPrinter', () => {
    it('should print fplib table', () => {
        const libs = new Libs()
        libs.addLib(Lib.create('tinyfpga'))
        expect(fplib.printer.render(libs)).to.equal(`
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
