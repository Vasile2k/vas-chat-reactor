# vas-chat-reactor
A plugin for [mineflayer][1] which allows the bot to respond
to [Chat Reaction][2] messages

## Prerequisites
* [nodejs][3]
* [npm][4]
* [mineflayer][1]
* [config.ini][5]

## Installation
Clone this repository in `node_modules` folder and run:
```sh
npm install
```
Or just simply:
```sh
npm install vas-chat-reactor
```

## Configuration
* Fill in the [`config.ini`](config.ini) file with the necessary
things to identify Chat Reaction messages and extract the word from it.
You will find all the documentation inside it.
* Fill the time to wait until the bot writes the word
(will be evaluated with `eval(timeout)`). I found that
`1850 + ~~((0.5 + Math.random()/2) * 150 * word.length)` works best
looking at how quick other players write.
* Fill in the chance to write the word. 0 or less means 0% or never write
the word and 1 or bigger is 100% chance of writing.
* Write all the known possible words to descramble in `dictionaryFile`,
one on every line. If you don't know the words, let the bot run for
some time until it will collect most of them.

Anytime the bot will find an unknown word it will write it into the
`unknownWordsFile`, as specificated in configuration file.\
**Don't use my config and dictionary file, they are just a reference guide!**\
Why don't I use regex instead of `string.startsWith`, `string.endsWith`
and `substring`? Because it's faster this way and you can't have weird
patterns in the message. Maybe I'm wrong...

## Usage
Simply require it and add it to bot's plugins.
```javascript
const mineflayer = require("mineflayer");
const chatReactor  = require("vas-chat-reactor");
const bot = mineflayer.createBot({
	"host": "HOST",
	"port": 25565,
	"username": "USERNAME",
	"password": "PASSWORD",
	"plugins": [chatReactor],

});

```
Or, if you prefer:
```javascript
// Bot is already created
require("vas-chat-reactor")(bot);
```
And then:
```javascript
bot.enableChatReaction();
```
And if you want to disable it on the fly:
```javascript
bot.disableChatReaction();
```
Additionally, if you want to see debug information, you can set the
`_DEBUG` variable on row 2 of `index.js` to `true`.

## License
This plugin is distributed under Apache 2.0. See [LICENSE](LICENSE).

## Additional details

### Contact

If you have any problems, contact me and I will try to help you.
You can find me [here][6].

[1]: https://github.com/PrismarineJS/mineflayer
[2]: https://www.spigotmc.org/resources/chatreaction.3748/
[3]: https://nodejs.org/en/
[4]: https://www.npmjs.com/
[5]: https://www.npmjs.com/package/config.ini
[6]: https://github.com/Vasile2k
