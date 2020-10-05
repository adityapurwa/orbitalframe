import OrbitalFrame, {Context, Handler} from "../index";
import OrbitalEvent from "./OrbitalEvent";
import {Request, Response} from "express";
import ExpressPlugin, {ExpressPluginSymbol} from "../plugins/ExpressPlugin";

export interface CalendarEventOptions {
    /**
     * The interval (in miliseconds) when will this event checks for the date match. Adjust this
     * to your own needs, if you're only comparing date it is nice to run this every 23 hours,
     * if you need more details then you can set it to smaller value.
     */
    interval?: number;
    /**
     * A function that will be called every interval.
     * @param date The date when the interval occurs.
     */
    when: (date: Date) => boolean;
    /**
     * A function that decides whether next date match will be processed or not.
     * @param prevDate The last date when the event got processed.
     * @param currentDate The current date when the interval occurs.
     */
    continue: (prevDate: Date, currentDate: Date) => boolean;
}
/**
 * The data that the SlackEvent stores into the context.
 */
export interface CalendarEventData {
    date: Date;
    readonly prevDate: Date | null;
}

const symbol = Symbol('CalendarEvent');
/**
 * CalendarEvent is an event that get triggered when a certain date requirements are met.
 * It should not be used as high resolution time checks as it uses setInterval to
 * check for the requirements.
 */
export default class CalendarEvent extends OrbitalEvent<CalendarEventOptions, CalendarEventData> {

    /**
     * Initialize a new instance of CalendarEvent
     * @param options
     *  - interval: 1000
     */
    public constructor(options: CalendarEventOptions) {
        const defaults: Partial<CalendarEventOptions> = {
           interval: 1000
        }
        super({...defaults, ...options});
    }

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
        let context = {
            [symbol]: {
                date: new Date(),
                prevDate: null
            }
        }
        setInterval(
            ()=>{
                const date = new Date();
                const data = CalendarEvent.data(context);
                if(this.options.when(date)){
                    if (data.prevDate && !this.options.continue(data.prevDate, date)) {
                        return;
                    }
                    context[symbol] = {
                        date,
                        prevDate: date
                    };
                    handler(context)
                }
            }
        )
    }

    /**
     * Helper to get the event data from the context.
     * @param context The context.
     */
    static data(context: Context): CalendarEventData {
        return context[symbol]
    }
}

export {symbol as CalendarEventSymbol};
