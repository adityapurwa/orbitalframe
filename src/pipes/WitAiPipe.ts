import OrbitalPipe from "./OrbitalPipe";
import OrbitalFrame, {Context, Pipe} from "../index";
import {MessageResponse, Wit} from "node-wit";

export interface WitAiPipeOptions {
    client: Wit;
}

/**
 * Data stored by the WitAiPipe on the context.
 */
export interface WitAiData extends MessageResponse {
    intents: {
        name: string;
        confidence: number;
    }[]
}

/**
 * Data required by WitAiPipe to properly pipe the data.
 */
export interface WitAiMap {
    message: string;
}

const symbol = Symbol('WitAiPipe')
/**
 * WitAiPipe is used to pipe a message into Wit.ai, get the result and store it inside the context.
 */
export default class WitAiPipe extends OrbitalPipe<WitAiPipeOptions, WitAiMap> {

    /**
     * Initialize a new instance of WitAiPipe
     * @param options
     *  - client: The Wit AI Client
     */
    public constructor(options: WitAiPipeOptions) {
        super(options);
    }

    /**
     * Get the pipe to process the event
     */
    pipe(): Pipe<any> {
        return async (context, event, next) => {
            const map = this.mapper(context);
            const res = await this.options.client.message(map.message, {})
            context[symbol] = res;
            next(context);
        }
    }

    get symbol(): symbol {
        return symbol;
    }

    /**
     * Helper to read WitAiPipe data from the context.
     * @param context The context.
     */
    static data(context: Context): WitAiData {
        return context[symbol]
    }

}


export {symbol as WitAiPipeSymbol};
