import OrbitalFrame from "../index";
/**
 * OrbitalPlugin is the base class that all plug-ins should inherits from.
 * This is an abstract class and can not be directly instantiated.
 */
export default abstract class OrbitalPlugin<TOptions> {
    /**
     * Initialize a new instance of OrbitalPlugin.
     * @param options JavaScript object that are required by the plugin, you should provide sensible defaults
     * for non-required option.
     * @protected
     */
    protected constructor(protected options?: TOptions) {

    }

    /**
     * Returns the symbol used to identify the plugin.
     */
    abstract get symbol(): symbol;

    /**
     * Initialize any required data for the plugin, this is handled by the frame runner and you
     * should never call this manually.
     * @param frame The frame that contains the plugin.
     */
    abstract setup(frame: OrbitalFrame);

    /**
     * The core logic of the plugin, this is where you should set listeners,
     * timers, bind into socket, etc. This is handled by the frame runner and you
     * should never call this manually.
     * @param frame The frame that contains the plugin.
     */
    abstract start(frame: OrbitalFrame);
}
