import OrbitalFrame, {Context} from "../index";
/**
 * OrbitalEvent is the base class of all event, any event should inherits from this class.
 */
export default abstract class OrbitalEvent<TOptions = unknown, TData = unknown> {
    /**
     * Get the symbol to identify the event.
     */
    abstract get symbol();

    /**
     * Initialize a new instance of OrbitalEvent.
     * @param options JavaScript object that are required by the event, you should provide sensible defaults
     * for non-required option.
     */
    protected constructor(protected options?: TOptions) {

    }

    /**
     * Setup how the events should work, this is handled by the frame runner and you
     * should never call this manually.
     * @param frame The frame that contains the event
     * @param handler The function that should be called when the event occurs
     */
    abstract setup(frame: OrbitalFrame, handler: (context: Context) => void);
}
