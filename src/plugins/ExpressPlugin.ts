import * as express from 'express';
import {Express} from 'express';
import OrbitalPlugin from "./OrbitalPlugin";

export interface ExpressPluginOptions {
    port: number;
    withJsonParser: boolean;
    withUrlEncodedParser: boolean;
}

const symbol = Symbol('ExpressPlugin');
export default class ExpressPlugin extends OrbitalPlugin<ExpressPluginOptions> {
    public app: Express;


    constructor(options?: ExpressPluginOptions) {
        const defaults = {
            withUrlEncodedParser: true,
            withJsonParser: true,
            port: 3000
        }
        super({...defaults, ...options});
    }

    setup(frame) {
        this.app = express();
        if (this.options.withJsonParser) {
            this.app.use(express.json())
        }
        if (this.options.withUrlEncodedParser) {
            this.app.use(express.urlencoded())
        }
    }

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
