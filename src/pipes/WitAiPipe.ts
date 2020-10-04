import OrbitalPipe from "./OrbitalPipe";
import OrbitalFrame, {Context, Pipe} from "../index";
import {Wit} from "node-wit";

export interface WitAiPipeOptions {
    client: Wit;
}

export interface WitAiData {
    intents: {
        name: string;
        confidence: number;
    }[]
}

export interface WitAiMap {
    message: string;
}

const symbol = Symbol('WitAiPipe')
export default class WitAiPipe extends OrbitalPipe<WitAiPipeOptions, WitAiMap> {

    public constructor(options: WitAiPipeOptions) {
        super(options);
    }

    pipe(): Pipe<any> {
        return async (context, event, next) => {
            const map = this.mapper(context);
            const res = await this.options.client.message(map.message, {})
            context[symbol] = res;
            next(context);
        }
    }

    setup(frame: OrbitalFrame) {
    }

    get symbol(): symbol {
        return symbol;
    }

    static data(context: Context): WitAiData {
        return context[symbol]
    }

}


export {symbol as WitAiPipeSymbol};
