import OrbitalFrame, {Context, Handler, Pipe} from "../index";

export interface OrbitalPipeClass<TOptions, TMap> {
    new(options?: TOptions): OrbitalPipe<TOptions, TMap>;
}

export default abstract class OrbitalPipe<TOptions, TMap> {
    protected mapper: (context: Context) => TMap;

    protected constructor(protected options?: TOptions) {

    }

    abstract get symbol(): symbol;

    abstract setup(frame: OrbitalFrame);

    map(fn: (context: Context) => TMap) {
        this.mapper = fn;
        return this;
    }

    abstract pipe(): Pipe<any> ;
}
