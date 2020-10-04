import OrbitalFrame, {Context} from "../index";

export interface OrbitalEventClass<TOptions> {
    new(options?: TOptions): OrbitalEvent<TOptions, unknown>;
}

export default abstract class OrbitalEvent<TOptions = unknown, TData = unknown> {
    abstract get symbol();

    public constructor(protected options?: TOptions) {

    }

    abstract setup(frame: OrbitalFrame, handler: (context: Context) => void);
}
