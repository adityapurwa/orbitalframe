# Orbital Frame

> Workflow framework to automate and simplify your life



**v0.0.1 - Ardjet / Pre-Release** - NOT SUITABLE FOR PRODUCTION

## Introduction

Orbital Frame is a workflow framework designed to work similar
to Zapier or IFTTT. It works with the concept of event, pipe, and context.

A simple workflow for a time bot:

```ts

const frame = new OrbitalFrame();
const expPlugin = new ExpressPlugin();
frame.with(expPlugin)

// Whenever a slack outgoing webhook is received
frame.on(new SlackEvent())
    // Pipe is a middleware, it processes the event and
    // decides whether it want to continue or not    
    .pipe(
        // A prebuilt pipe can be used by mapping the input to
        // it own expected format and pipe it out
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
```

## Concepts

### Event

Event is the entry point of a workflow, when an event occurs, it will
run any registered flow.

Even must inherits from OrbitalEvent, implements the get symbol, setup,
and also expose the constructor that accept options.

> Best practice, it is not required but highly recommended to implement
> a static method to read a context using its symbol. E.g SlackEvent.data(context)
> will returns the data stored by SlackEvent in the context.

### Pipe

Pipe is a middleware function that accepts context, events, next pipe,
and the frame. Most of the time you'd likely be interested with the first three
only.

Pipe must implements the `pipe()` method that returns the actual pipe
that's going to be run. A pipe accepts a mapper function, which is used
to map current context into a form that could be understood by the pipe.

### Context

Context is the storage of the flow, any event, pipes, and plugins; can store
data into the context.

To prevent collision, context must be indexed with symbol only. That is why
event, pipes, and plugins should always expose the symbol it used to store
the data so it can be fetched later.
