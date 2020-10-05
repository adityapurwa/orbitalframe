import * as express from 'express';
import {Express} from 'express';
import OrbitalPlugin from "./OrbitalPlugin";

/**
 * Options required by the ExpressPlugin.
 */
export interface ExpressPluginOptions {
    port?: number;
    withJsonParser?: boolean;
    withUrlEncodedParser?: boolean;
}

const symbol = Symbol('ExpressPlugin');
/**
 * Plugin that wraps the express HTTP server.
 */
export default class ExpressPlugin extends OrbitalPlugin<ExpressPluginOptions> {
    public app: Express;

    /**
     * Instantiate a new instance of ExpressPlugin
     * @param options The option to configure.
     * Default options value:
     *  - withUrlEncodeParser: true
     *  - withJsonParser: true
     *  - port: 3000
     */
    constructor(options?: ExpressPluginOptions) {
        const defaults = {
            withUrlEncodedParser: true,
            withJsonParser: true,
            port: 3000
        }
        super({...defaults, ...options});
    }

    /**
     * Setup the ExpressPlugin, the plugin will instantiate the express object and setup required middlewares.
     * @param frame
     */
    setup(frame) {
        this.app = express();
        if (this.options.withJsonParser) {
            this.app.use(express.json())
        }
        if (this.options.withUrlEncodedParser) {
            this.app.use(express.urlencoded())
        }
    }

    /**
     * Start the ExpressPlugin, the plugin will bind the express instance into the configured port
     * @param frame
     */
    start(frame) {
        this.app.listen(this.options.port, () => {
            console.log(`${symbol.toString()} running on ${this.options.port}`)
        });
    }

    get symbol(): symbol {
        return symbol;
    }
}

export {symbol as ExpressPluginSymbol};
