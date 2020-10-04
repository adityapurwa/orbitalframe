import OrbitalFrame from "../src";
import ExpressPlugin from "../src/plugins/ExpressPlugin";
import SlackEvent from "../src/events/SlackEvent";
import {Wit} from "node-wit";
import WitAiPipe from "../src/pipes/WitAiPipe";

const client = new Wit({
    accessToken: process.env.WIT_TOKEN
});

const frame = new OrbitalFrame();

const expPlugin = new ExpressPlugin();
frame.with(expPlugin)

frame.on(new SlackEvent())
    .pipe(
        new WitAiPipe({
            client
        }).map(context => {
            return {
                message: SlackEvent.data(context).data.text
            }
        }).pipe()
    )
    .pipe((context, event, next) => {
        const witData = WitAiPipe.data(context)
        const eventData = SlackEvent.data(context);
        if (witData.intents[0].name === 'ask_time' && witData.intents[0].confidence > 0.7) {
            eventData.res.status(200).send({
                text: `Its ${new Date().toTimeString()} now`
            }).end()
        }
    })

frame.start();
