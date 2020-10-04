import OrbitalFrame, {Context, Handler} from "../index";
import OrbitalEvent from "./OrbitalEvent";
import {Request, Response} from "express";
import ExpressPlugin, {ExpressPluginSymbol} from "../plugins/ExpressPlugin";

export interface SlackRequestBody {
    token: string;
    team_id: string;
    team_domain: string;
    channel_id: string;
    channel_name: string;
    timestamp: number;
    user_id: string;
    user_name: string;
    text: string;
    trigger_wrod: string;
}

export interface SlackResponseBody {
    text: string;
}

export interface SlackEventData {
    req: Request<any, SlackRequestBody, SlackRequestBody>;
    res: Response<SlackResponseBody>;
    data: SlackRequestBody;
}

const symbol = Symbol('SlackEvent');
export default class SlackEvent extends OrbitalEvent<never, SlackEventData> {

    get symbol() {
        return symbol
    }

    setup(frame: OrbitalFrame, handler: Handler) {
        const exprPlugin = frame.usePlugin(ExpressPluginSymbol) as ExpressPlugin;
        if (!exprPlugin) {
            throw new Error(`${SlackEvent} depends on the ${ExpressPlugin} plugin.`)
        }
        exprPlugin.app.post('/SlackEvent/outgoing', (req, res) => {
            handler({
                [symbol]: {
                    req,
                    res,
                    data: req.body
                }
            })
        })
    }

    static data(context: Context): SlackEventData {
        return context[symbol]
    }
}

export {symbol as SlackEventSymbol};
