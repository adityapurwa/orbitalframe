import OrbitalFrame from "../src";
import ExpressPlugin from "../src/plugins/ExpressPlugin";
import SlackEvent from "../src/events/SlackEvent";
import {Wit} from "node-wit";
import WitAiPipe from "../src/pipes/WitAiPipe";
import CalendarEvent from "../src/events/CalendarEvent";

/**
 * This workflow will only runs on the first five seconds every minute.
 */
const frame = new OrbitalFrame();
frame.on(new CalendarEvent({
    interval: 100,
    when: date => {
        return date.getSeconds() === 5;
    },
    continue: (prevDate, currentDate) => {
        return prevDate.getMinutes() !== currentDate.getMinutes();
    }
}))
    .pipe((context, event, next) => {
        const data = CalendarEvent.data(context);
        console.log(`Ping! It's the fifth second now (${data.date}`);
        next(context);
    })

console.log('Running a workflow that checks for the fifth second of every minute')

frame.start();
