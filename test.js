var assert = require("assert");
describe("vas-chat-reactor", function(){
    describe("Load plugin", function(){
        
        var EventEmitter = undefined;
        var bot = undefined;
        
        it("should load events", function(){
            EventEmitter = require("events");
            assert(EventEmitter != undefined);
            bot = new EventEmitter();
            assert(bot != undefined);
        })
        
        it("should add functions to the bot", function(){
            require("./index.js")(bot);
            assert(bot);
            assert(bot.enableChatReaction);
            assert(bot.disableChatReaction);
        });
        
        it("should not crash on message event", function(){
            bot.emit("message", "test");
        });
        
    });
});