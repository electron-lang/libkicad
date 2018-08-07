# libkicad [![Build Status](https://travis-ci.org/electron-lang/libkicad.svg?branch=master)](https://travis-ci.org/electron-lang/libkicad) [![Gitter](https://badges.gitter.im/electron-lang/electron.svg)](https://gitter.im/electron-lang/electron)
Provides support for printing and parsing kicad file formats.

Currently `.net` and `fp-lib-table` are supported.

Can perform equivalence checks on kicad `.net` files.

## Netlist equivalence checking example
```ts
import { expect } from 'chai'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { netlist } from 'libkicad'

describe('Netlist', () => {
    it('should be equivalent to TinyFPGA-B.net', () => {
        const p1 = resolve('./build/TinyFPGA.net')
        const t1 = readFileSync(p1)
        const d1 = netlist.parse(t1.toString())

        const p2 = resolve('./tests/TinyFPGA-B.clean.net')
        const t2 = readFileSync(p2)
        const d2 = netlist.parse(t2.toString())

        expect(netlist.equiv(d1, d2)).to.equal(true)
    })
})
```

## Create a `fp-lib-table` example
```ts
import { FpLibTable } from 'libkicad'

const libs = new FpLibTable()
libs.addLib('tinyfpga')
libs.write()
```

## License
ISC License

Copyright (c) 2017, David Craven and others

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
