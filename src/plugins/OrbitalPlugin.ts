import OrbitalFrame from "../index";

export interface OrbitalPluginClass<T> {
    new(options?: T): OrbitalPlugin<T>;
}

export default abstract class OrbitalPlugin<TOptions> {
    protected constructor(protected options?: TOptions) {

    }

    abstract get symbol(): symbol;

    abstract setup(frame: OrbitalFrame);

    abstract start(frame: OrbitalFrame);
}
