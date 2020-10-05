import OrbitalFrame, {Context, Handler} from "../index";
import OrbitalEvent from "./OrbitalEvent";
import {Request, Response} from "express";
import ExpressPlugin, {ExpressPluginSymbol} from "../plugins/ExpressPlugin";

/**
 * The body of a Slack outgoing webhook request.
 */
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

/**
 * The body of a Slack outgoing webhook response
 */
export interface SlackResponseBody {
    text: string;
}

/**
 * The data that the SlackEvent stores into the context.
 */
export interface SlackEventData {
    req: Request<any, SlackRequestBody, SlackRequestBody>;
    res: Response<SlackResponseBody>;
    data: SlackRequestBody;
}

const symbol = Symbol('SlackEvent');
/**
 * SlackEvent is an event that occurs when an outgoing webhook is called by Slack.
 * Depends On: **ExpressPlugin**
 */
export default class SlackEvent extends OrbitalEvent<never, SlackEventData> {

    get symbol() {
        return symbol
    }

    /**
     * Setup the SlackEvent, this events depends on ExpressPlugin and will try to
     * bind itself into a predefined endpoint of `SlackEvent/outgoing`.
     * @param frame The frame that contains the event.
     * @param handler The handler that will process the event.
     */
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

    /**
     * Helper to get the event data from the context.
     * @param context The context.
     */
    static data(context: Context): SlackEventData {
        return context[symbol]
    }
}

export {symbol as SlackEventSymbol};
