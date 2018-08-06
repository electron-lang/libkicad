import * as fs from 'fs'
import * as path from 'path'
import { IDoc, render } from 'prettier-printer'
import { SexpPrinter } from './sexp'

export interface ILib {
    name: string
    type: 'KiCad'
    uri: string
    options: string
    descr: string
}

export class Libs {
    readonly libs: Lib[] = []

    addLib(lib: Lib) {
        this.libs.push(lib)
    }
}

export class Lib {
    constructor(protected lib: ILib) {}

    get name(): string {
        return this.lib.name
    }

    get type(): string {
        return this.lib.type
    }

    get uri(): string {
        return this.lib.uri
    }

    get options(): string {
        return this.lib.options
    }

    get descr(): string {
        return this.lib.descr
    }

    static create(name: string, descr?: string) {
        return new Lib({
            name,
            type: 'KiCad',
            uri: '${KIPRJMOD}/' + name + '.pretty',
            options: '',
            descr: descr || '',
        })
    }
}

export class LibPrinter extends SexpPrinter {
    render(libs: Libs | Lib): string {
        if (libs instanceof Libs) {
            return render(80, this.printLibs(libs))
        } else {
            return render(80, this.printLib(libs))
        }
    }

    printLibs(libs: Libs): IDoc {
        return this.printGroup('fp_lib_table', libs.libs, (lib) => this.printLib(lib))
    }

    printLib(lib: Lib): IDoc {
        return this.printSexpGroup('lib', [
            this.printAtom('name', lib.name),
            this.printAtom('type', lib.type),
            this.printAtom('uri', lib.uri),
            this.printAtom('options', lib.options),
            this.printAtom('descr', lib.descr),
        ])
    }
}

export const fplib = {
    printer: new LibPrinter()
}

export class FpLibTable {
    protected libs: Libs = new Libs()

    addLib(name: string, descr?: string) {
        this.libs.addLib(Lib.create(name, descr))
    }

    write(dir?: string) {
        const file = path.join(path.resolve(dir || process.cwd()), 'fp-lib-table')
        fs.writeFileSync(file, fplib.printer.render(this.libs))
    }
}
