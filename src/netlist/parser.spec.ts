import { expect } from 'chai'
import { IToken } from 'chevrotain'
import { lexerInstance, parserInstance, visitorInstance } from './parser'
import { Design, Component, Net } from './ast'

function tokenize(text: string): IToken[] {
    const lexResult = lexerInstance.tokenize(text)
    if (lexResult.errors.length > 0) {
        throw new Error(lexResult.errors[0].message);
    }
    return lexResult.tokens
}

function parse(text: string): Design {
    const tokens = tokenize(text)
    parserInstance.input = tokens
    const cst = parserInstance.top()
    if (parserInstance.errors.length > 0) {
        const error = parserInstance.errors[0]
        throw new Error(`msg: ${error.message} ln: ${error.token.startLine} ` +
                        `col: ${error.token.startColumn}`)
    }
    return visitorInstance.visit(cst) as Design
}

function expectLabel(text: string, label: string) {
    const token = tokenize(text)[0]
    if (token && token.tokenType && token.tokenType.tokenName) {
        expect(token.tokenType.tokenName).to.equal(label)
    } else {
        throw new Error('No label')
    }
}

describe('Lexer', () => {
    it('should lex', () => {
        expectLabel('(', 'Open')
        expectLabel('value', 'Value')
        expectLabel('""', 'PropValue')
        expectLabel('"abcd"', 'PropValue')
        expectLabel('abcd', 'PropValue')
        expectLabel(')', 'Close')
    })
})

describe('Parser', () => {
    it('should parse', () => {
        const input = `
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
`
        const design = new Design({
            version: '0.0.1',
            source: 'printer.spec.ts',
            date: '2018-08-05 16:26:01',
            tool: 'libkicad 0.0.1',
        })
        const r1 = new Component({
            ref: 'R1',
            value: '10K',
            footprint: '0402',
        })
        const r2 = new Component({
            ref: 'R2',
            value: '22K',
            footprint: '0402',
        })
        const n1 = new Net({
            code: 0,
            name: 'n1',
        })
        n1.addNode(r1.getNode('2'))
        n1.addNode(r2.getNode('1'))
        design.addComponent(r1)
        design.addComponent(r2)
        design.addNet(n1)
        expect(parse(input)).to.deep.equal(design)
    })
})
