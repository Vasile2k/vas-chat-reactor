
var _DEBUG = false;

const assert = _DEBUG ? require("assert") : noop;
const fs     = require("fs");
const path   = require("path");
const config = require("config.ini");

var isInited  = false;
var isEnabled = false;

var words = [];

// Look in config.ini to see what all that means
var chatMessageBegin = "";
var chatMessageEnd   = "";
var writeWord        = "";
var descrambleWord   = "";
var wordBeginIndexIfWrite      = 0;
var lettersToEndIfWrite        = 0;
var wordBeginIndexIfDescramble = 0;
var lettersToEndIfDescramble   = 0;
var chanceOfGuessing = 0;
var timeoutExpression = "";
var dictionaryFile   = "";
var unknownWordsFile = "";

function noop(){}

module.exports = function(bot){
	
	bot.on("message", onMessage);
	
	bot.enableChatReaction = function(){
		if(!isInited){
			init();
		}
		isEnabled = true;
	};
	
	bot.disableChatReaction = function(){
		isEnabled = false;
	};
}

function init(){
	
	var settings = config.load(path.join(__dirname, "config.ini"));
	
	if(_DEBUG){
		console.log(settings);
	}
	
	try{
		
		assert(settings); // Check if we got settings, config.ini parser might return false
		
		chatMessageBegin = settings.vasChatReactor.chatMessageBegin;
		chatMessageEnd   = settings.vasChatReactor.chatMessageEnd;
		writeWord        = settings.vasChatReactor.writeWord;
		descrambleWord   = settings.vasChatReactor.descrambleWord;
		wordBeginIndexIfWrite      = settings.vasChatReactor.wordBeginIndexIfWrite;
		lettersToEndIfWrite        = settings.vasChatReactor.lettersToEndIfWrite;
		wordBeginIndexIfDescramble = settings.vasChatReactor.wordBeginIndexIfDescramble;
		lettersToEndIfDescramble   = settings.vasChatReactor.lettersToEndIfDescramble;
		chanceOfGuessing  = settings.vasChatReactor.chanceOfGuessing;
		timeoutExpression = settings.vasChatReactor.timeoutExpression;
		dictionaryFile    = path.join(__dirname, settings.vasChatReactor.dictionaryFile);
		unknownWordsFile  = path.join(__dirname, settings.vasChatReactor.unknownWordsFile);
		
		try{
			var contents = fs.readFileSync(dictionaryFile, "utf8");
			words = contents.split("\n");
		}catch(error){
			throw(new Error("Failed to open dictionary!"));
		}
		
	}catch(error){
		throw(new Error("Failed to initialize vas-chat-reaction with error: " + error));
	}
	
	if(_DEBUG){
		console.log("chatMessageBegin: " + chatMessageBegin);
		console.log("chatMessageEnd: " + chatMessageEnd);
		console.log("writeWord: " + writeWord);
		console.log("descrambleWord: " + descrambleWord);
		console.log("wordBeginIndexIfWrite: " + wordBeginIndexIfWrite);
		console.log("lettersToEndIfWrite: " + lettersToEndIfWrite);
		console.log("wordBeginIndexIfDescramble: " + wordBeginIndexIfDescramble);
		console.log("lettersToEndIfDescramble: " + lettersToEndIfDescramble);
		console.log("chanceOfGuessing: " + chanceOfGuessing);
		console.log("timeoutExpression: " + timeoutExpression);
		console.log("dictionaryFile: " + dictionaryFile);
		console.log("unknownWordsFile: " + unknownWordsFile);
		console.log("Word dictionary:");
		console.log(words);
	}
	
	isInited = true;
}

function onMessage(msg){
	if(isEnabled){
		
		if(!isInited){
			init();
		}
		
		var message = msg.toString();
		if(isChatReaction(message)){
			var word = findWord(message);
			if(word.length > 0){
				// If we matched any word
				// Random chance of guessing
				if(Math.random() > chanceOfGuessing){
					var timeout = eval(timeoutExpression);
					var _bot = this;
					eval("setTimeout(function(){_bot.chat(\"" + word + "\");}, " + timeout + ");");
				}
			}else{
				appendDataToFile(unknownWordsFile, message + "\n" + word + "\n");
			}
			
		}
		
	}
}

function isChatReaction(msg){
	var message = msg.toString();
	return message.startsWith(chatMessageBegin) && message.endsWith(chatMessageEnd);
}

function findWord(msg){
	var message = msg.toString();
	var hasDescramble = message.indexOf(descrambleWord) != -1;
	var hasWrite = message.indexOf(writeWord) != -1;

	assert(hasWrite ^ hasDescramble); // XOR

	if(hasWrite){
		return message.substring(wordBeginIndexIfWrite, message.length - lettersToEndIfWrite);
	}else{
		var scrambledWord = message.substring(wordBeginIndexIfDescramble, message.length - lettersToEndIfDescramble);
		for(var i = 0; i < words.length; ++i){
			if(wordMatch(words[i], scrambledWord)){
				return words[i];
			}
		}
		return ""; // Return empty string in case of unknown word
	}

}

function wordMatch(word, scrambledWord){
	for(var i = 0; i < scrambledWord.length; ++i){
		var index = word.indexOf(scrambledWord[i]);
		if(index == -1){
			return false;
		}else{
			word = word.slice(0, index) + word.slice(index + 1, word.length);
		}
	}
	return true;
}

function appendDataToFile(file, data){
	var fd = undefined;
	try{
		fd = fs.openSync(file, "a");
		fs.appendFileSync(fd, data);
	}catch(err){
		// Don't do shit here...
	}finally{
		if(fd != undefined){
			fs.closeSync(fd);
		}
	}
}