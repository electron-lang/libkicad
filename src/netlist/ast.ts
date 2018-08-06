export interface IDesign {
    version?: string
    source?: string
    date?: string
    tool?: string
}

export class Design {
    readonly components: Component[] = []
    protected componentsIndex: {[ref: string]: Component} = {}

    readonly nets: Net[] = []
    protected netsCodeIndex: {[code: number]: Net} = {}
    protected netsNameIndex: {[name: string]: Net} = {}

    constructor(protected design: IDesign) {}

    static create(version?: string, source?: string): Design {
        return new Design({
            version, source,
            date: Design.dateString(),
            tool: Design.toolString()
        })
    }

    unwrap(): IDesign {
        return this.design
    }

    get version(): string {
        return this.design.version || ''
    }

    set version(version: string) {
        this.design.version = version
    }

    get source(): string {
        return this.design.source || ''
    }

    set source(source: string) {
        this.design.source = source
    }

    get date(): string {
        return this.design.date || ''
    }

    set date(date: string) {
        this.design.date = date
    }

    static dateString(): string {
        return new Date().toISOString()
            .replace(/T/, ' ')   // replace T with a space
            .replace(/\..+/, '') // delete the dot and everything after
    }

    get tool(): string {
        return this.design.tool || ''
    }

    set tool(tool: string) {
        this.design.tool = tool
    }

    static toolString(): string {
        return `libkicad ${require('../../package.json').version}`
    }

    addComponent(component: Component) {
        if (component.ref in this.componentsIndex) {
            throw new Error(`Component with ref ${component.ref} already in design.`)
        }

        this.components.push(component)
        this.componentsIndex[component.ref] = component
    }

    containsComponent(component: string): boolean {
        return !!this.getComponent(component)
    }

    getComponent(ref: string): Component | undefined {
        return this.componentsIndex[ref]
    }

    removeComponent(ref: string): void {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].ref === ref) {
                this.components.splice(i, 1)
                delete this.componentsIndex[ref]
                return
            }
        }
    }

    addNet(net: Net): void {
        if (net.code in this.netsCodeIndex) {
            throw new Error(`Net with code ${net.code} already in design.`)
        }

        if (net.name in this.netsNameIndex) {
            throw new Error(`Net with name ${net.name} already in design.`)
        }

        this.nets.push(net)
        this.netsCodeIndex[net.code] = net
        this.netsNameIndex[net.name] = net
    }

    containsNet(net: number | string): boolean {
        return !!this.getNet(net)
    }

    getNet(net: number | string): Net | undefined {
        if (typeof net === 'number') {
            return this.netsCodeIndex[net]
        } else if (typeof net === 'string') {
            return this.netsNameIndex[net]
        }
    }

    removeNet(net: number | string): void {
        const n = this.getNet(net)
        if (!n) {
            return
        }
        const code = n.code
        for (let i = 0; i < this.nets.length; i++) {
            const net = this.nets[i]
            if (net.code === code) {
                this.nets.splice(i, 1)
                delete this.netsCodeIndex[net.code]
                delete this.netsNameIndex[net.name]
                return
            }
        }
    }

}

export interface IComponent {
    ref: string
    value?: string
    footprint?: string
}

export class Component {
    constructor(protected component: IComponent) {}

    unwrap(): IComponent {
        return this.component
    }

    get ref(): string {
        return this.component.ref
    }

    set ref(ref: string) {
        this.component.ref = ref
    }

    get value(): string {
        return this.component.value || ''
    }

    set value(value: string) {
        this.component.value = value
    }

    get footprint(): string {
        return this.component.footprint || ''
    }

    set footprint(footprint: string) {
        this.component.footprint = footprint
    }

    getNode(pin: string): Node {
        return new Node({ ref: this.ref, pin })
    }

    equals(other: Component) {
        return this.ref === other.ref && this.value === other.value
            && this.footprint === other.footprint
    }

    equiv(other: Component) {
        return this.ref === other.ref
    }

    static create(footprint: string): Component {
        return new Component({ ref: createRandom(), footprint })
    }
}

export interface INet {
    code: number
    name: string
}

export class Net {
    readonly nodes: Node[] = []

    constructor(protected net: INet) {}

    unwrap(): INet {
        return this.net
    }

    get code(): number {
        return this.net.code || 0
    }

    get name(): string {
        return this.net.name || ''
    }

    equals(other: Net): boolean {
        return this.code === other.code && this.name === other.name
    }

    static create(name?: string): Net {
        const netName = name ? name : createRandom(8)
        return new Net({
            name: netName,
            code: parseInt(createRandom(8, '0123456789')),
        })
    }

    addNode(node: Node) {
        this.nodes.push(node)
    }

}

export interface INode {
    ref: string
    pin: string
}

export class Node {
    constructor(protected node: INode) {}

    unwrap(): INode {
        return this.node
    }

    get ref(): string {
        return this.node.ref
    }

    get pin(): string {
        return this.node.pin
    }

    equals(other: Node): boolean {
        return this.ref === other.ref && this.pin === other.pin
    }

}

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'
export function createRandom(length: number = 8, chars: string = CHARS): string {
    let id = '';
    for (let i = 0; i < length; i++) {
        const charIndex = Math.floor(Math.random() * chars.length)
        id += chars.charAt(charIndex);
    }
    return id;
}
