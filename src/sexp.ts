import { IDoc, enclose, parens, dquotes, line, lineBreak,
         nest, group, intersperse } from 'prettier-printer'

export class SexpPrinter {
    // |  (<tag> <value>)
    printSexp(tag: string, value: IDoc): IDoc {
        return nest(2, [ enclose(parens, [tag, line, value]) ])
    }

    // |  (<tag> <value>
    // |  <value>
    // |  ...)
    printSexpGroup(tag: string, value: IDoc[]): IDoc {
        return this.printSexp(tag, intersperse(lineBreak, value))
    }

    // |  (<tag> "<value>")
    printAtom(tag: string, value?: string): IDoc {
        return group(this.printSexp(tag, enclose(dquotes, value || '')))
    }

    // |  (<tag> fn(elem)
    // |  fn(elem)
    // |  ...)
    printGroup<T>(tag: string, list: T[], fn: (elem: T) => IDoc): IDoc {
        if (list.length < 1) {
            return this.printSexp(tag, [])
        }
        return this.printSexpGroup(tag, list.map(fn))
    }
}
