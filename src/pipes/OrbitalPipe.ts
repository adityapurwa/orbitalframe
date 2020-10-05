import {Context, Pipe} from "../index";

export interface OrbitalPipeClass<TOptions, TMap> {
    new(options?: TOptions): OrbitalPipe<TOptions, TMap>;
}

/**
 * OrbitalPipe is a pipe base class where all pre-defined pipe should inherits from.
 */
export default abstract class OrbitalPipe<TOptions, TMap> {
    /**
     * Contains the mapper passed from the map method.
     * @protected
     */
    protected mapper: (context: Context) => TMap;

    /**
     * Initialize a new instance of OrbitalPipe.
     * @param options JavaScript object that are required by the pipe, you should provide sensible
     * defaults for non-required option.
     * @protected
     */
    protected constructor(protected options?: TOptions) {

    }

    /**
     * Returns the symbol used to identify the pipe.
     */
    abstract get symbol(): symbol;

    /**
     * Set a mapper function to map context data that could be understood by the pipe.
     * @param fn A mapping function.
     */
    map(fn: (context: Context) => TMap) {
        this.mapper = fn;
        return this;
    }

    /**
     * The actual logic of the pipe, it returns a function that will be called
     * when the pipes is reached.
     */
    abstract pipe(): Pipe<any>;
}
