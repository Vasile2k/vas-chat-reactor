var assert = require("assert");
describe("vas-chat-reactor", function(){
    describe("Load plugin", function(){
        
        it("should load events", function(){
            
            var EventEmitter = undefined;
            var bot = undefined;
            
            EventEmitter = require("events");
            assert(EventEmitter != undefined);
            bot = new EventEmitter();
            assert(bot != undefined);
            
        })
        
        it("should add functions to the bot", function(){
            
            var bot = new (require("events"))();
            require("../index.js")(bot);
            assert(bot);
            assert(bot.enableChatReaction);
            assert(bot.disableChatReaction);
            
        });
        
        it("should not crash on message event", function(){
            
            var bot = new (require("events"))();
            require("../index.js")(bot);
            bot.emit("message", "test");
            
        });
        
    });
});