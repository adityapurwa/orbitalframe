import OrbitalPlugin from "./plugins/OrbitalPlugin";
import OrbitalEvent from "./events/OrbitalEvent";

export type Pipe<T extends OrbitalEvent> = (context: Context, event: T, next: Handler, frame: OrbitalFrame) => void;
export type Handler = (context: Context) => void;
export type Context<T = unknown> = Record<symbol, T>;

class Flow<T extends OrbitalEvent> {
    private handlers: Pipe<OrbitalEvent>[] = []

    constructor() {
    }

    pipe(handler: Pipe<T>) {
        this.handlers.push(handler)
        return this;
    }

    run(frame: OrbitalFrame, event: T, context: Context) {
        const runPipe = (context: Record<symbol, unknown>, event: T, frame: OrbitalFrame, pipes: Pipe<any>[]) => {
            if (!pipes.length) {
                return;
            }
            return pipes[0](context, event, () => {
                runPipe(context, event, frame, pipes.slice(1))
            }, frame)
        }
        runPipe(context, event, frame, [...this.handlers])
    }
}


export default class OrbitalFrame {
    private plugins: Record<symbol, OrbitalPlugin<unknown>> = {};
    private listeners: { event: OrbitalEvent<unknown, unknown>, flow: Flow<any> }[] = [];

    constructor() {
    }

    with(plugin: OrbitalPlugin<unknown>) {
        if (this.plugins[plugin.symbol]) {
            throw new Error(`Plugin ${plugin} is already registered, you can not register a plugin twice.`)
        }
        this.plugins[plugin.symbol] = plugin;
    }

    private setupPlugins() {
        Object.getOwnPropertySymbols(this.plugins).forEach((symbol: symbol) => {
            this.plugins[symbol].setup();
        })
    }

    private startPlugins() {
        Object.getOwnPropertySymbols(this.plugins).forEach((symbol: symbol) => {
            this.plugins[symbol].start();
        })
    }

    usePlugin(symbol: symbol) {
        return this.plugins[symbol];
    }

    on<T extends OrbitalEvent>(event: T) {
        const frame = this;

        const flow = new Flow<T>()
        this.listeners.push({
            event,
            flow
        })
        return flow
    }

    private setupEvents() {
        for (const listener of this.listeners) {
            listener.event.setup(this, (context) => {
                listener.flow.run(this, listener.event, context)
            });
        }
    }


    start() {
        this.setupPlugins()
        this.setupEvents();
        this.startPlugins()
    }
}
