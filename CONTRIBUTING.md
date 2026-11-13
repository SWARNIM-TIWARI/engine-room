# Contributing to Engine Room

Thanks for looking. The most valuable thing you can do here is tell me when something is wrong.

## Found a mistake?

Open a [content correction](../../issues/new?template=content_correction.md). Include the card name, what it says, what you think is true, and a source. A paper, official docs or a reputable write up is enough.

## Run it locally

```bash
git clone https://github.com/SWARNIM-TIWARI/engine-room.git
cd engine-room
npm install
npm run dev
```

Before you open a pull request, run `npm run build` and make sure it passes. CI runs the same command.

## Adding or editing a topic

All topics live in the `TOPICS` array in `src/App.jsx`. Each one looks like this:

```js
{
  id: 14, num: '14', icon: '🧪', cat: 'ai', name: 'Your Topic',
  tagline: 'One sentence that makes someone curious',
  concept: 'The plain English explanation. Start with the idea, not the definition.',
  techniques: [
    { name: 'Technique', desc: 'What it is and why it matters.' },
    // four of them
  ],
  code: `short, runnable looking example`,
  codeLang: 'python',
  frontier: 'What researchers are still stuck on.',
  resources: [{ name: 'Tool or paper', type: 'tool' }], // tool, paper, book or course
}
```

Also add a search phrase for it in the `WIKI_QUERIES` object so the live Wikipedia summary finds the right page.

`cat` picks the color and must be one of `knowledge`, `ai`, `systems`, `hardware`, `applied`, `security`.

## Writing style

- Explain it like you would to a smart friend who has not met the topic yet.
- Idea first, jargon second.
- If you state a number, link a source in your pull request.
- Skip filler openers like "In today's world" and skip decorative dashes.
- Code samples should be short and should read like real code, not pseudocode.

## Pull requests

- One topic or one fix per pull request.
- Say what changed and why.
- Screenshots help if you touched the UI.

## Not sure?

Open an issue and ask before you spend time on it.
