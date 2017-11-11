function randInt(min, max)
{
	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var hangman = {
	"easyDictonary": ["verb", "learn", "skill", "value", "legal", "duty"], // 5 letters or less
	"mediumDictonary": ["abandon", "research", "inquire", "minimum", "commerce", "something"], // 8 letters or less
	"hardDictonary": ["investigate", "competent", "interchange", "reciprocal", "complementary", "allograph", "administration"], // 9 letters or more
	"words": [],//empty container for the dictonary used in the current game
	"wordsGuessed": [],
	"lettersGuessed": [],
	"badLetters": [],
	"wins": 0,
	"lives": 12,
	"word": "",
	"hidden": [],

	newGame: function(difficulty){
		if(difficulty === "easy")
		{
			this.words = this.easyDictonary;
		}
		else if(difficulty === "medium")
		{
			this.words = this.mediumDictonary;
		}
		else if(difficulty === "hard")
		{
			this.words = this.hardDictonary;
		}

		this.wordsGuessed = [];
		this.lettersGuessed = [];
		this.wins = 0;
		this.remainingGuesses = 6;
	},

	getWord: function(){
		this.lettersGuessed = [];

		if(this.words.length === this.wordsGuessed.length)//there is no more words in the current diffuculty dictonary
		{
			return "-";
		}

		var word = this.words[randInt(0, this.words.length)];
		while(this.wordsGuessed.includes(word))//make sure that the player is not getting a word they already guessed
		{
			word = this.words[randInt(0, this.words.length)];
		}
		this.wordsGuessed[this.wordsGuessed.length] = word;
		console.log("word: " + word);
		this.hidden = [];
		for(var i = 0; i < word.length; i++)
		{
			this.hidden[i] = "_";
		}
		return word;
	},

	setup: function(){
		hangman.word = hangman.getWord();
		document.getElementById("word").innerHTML = hangman.hidden.join("");
		document.getElementById("guessed").innerHTML = "_";
		hangman.lives = 12;
    	document.getElementById("lives").innerHTML = "Lives: " + hangman.lives;
	}
};

window.onload = function(){
	document.getElementById("easy").addEventListener("click", function(){
    	hangman.newGame("easy");
    	hangman.setup();
    	document.getElementById("word").style.fontSize = "700%";
	});

	document.getElementById("medium").addEventListener("click", function(){
   		hangman.newGame("medium");
   		hangman.setup();
    	document.getElementById("word").style.fontSize = "650%";
	});

	document.getElementById("hard").addEventListener("click", function(){
    	hangman.newGame("hard");
    	hangman.setup();
    	document.getElementById("word").style.fontSize = "600%";
	});

	document.addEventListener("keyup", function(event){
		if(hangman.hidden.indexOf(event.key) === -1 && hangman.word.indexOf(event.key) !== -1 && hangman.word !== "")
		{
			var last_i = hangman.word.indexOf(event.key);
			while(last_i !== -1)
			{
				hangman.hidden[last_i] = event.key;
				last_i = hangman.word.indexOf(event.key, last_i + 1);
			}

			document.getElementById("word").innerHTML = hangman.hidden.join("");

			if(hangman.hidden.indexOf("_") === -1)
			{
				hangman.wins++;
				document.getElementById("wins").innerHTML = "Wins: " + hangman.wins;

				if(hangman.words.length === hangman.wordsGuessed.length)
				{
					document.getElementById("word").innerHTML = "You Won";
					setTimeout(function()
					{
						document.getElementById("word").innerHTML = "Start A New";
						document.getElementById("guessed").innerHTML = "Game";
					}, 2000);
				}
				else
				{
					hangman.word = hangman.getWord();
					setTimeout(function()
					{
						document.getElementById("word").innerHTML = hangman.hidden.join("");
					}, 750);
				}
			}
		}
		else if(hangman.badLetters.indexOf(event.key) === -1 && hangman.hidden.indexOf(event.key) === -1 && hangman.word !== "")
		{
			hangman.badLetters[hangman.badLetters.length] = event.key;
			document.getElementById("guessed").innerHTML = hangman.badLetters.join(",");

			hangman.lives--;
			document.getElementById("lives").innerHTML = "Lives: " + hangman.lives;
			if(hangman.lives === 0)
			{
				hangman.word = "";
				document.getElementById("word").innerHTML = "You Lost";
				setTimeout(function()
				{
					document.getElementById("word").innerHTML = "Start A New";
					document.getElementById("guessed").innerHTML = "Game";
					setTimeout(function()
					{
						document.getElementById("word").innerHTML = "Looser";
						document.getElementById("guessed").innerHTML = "Idiot";
					}, 2000);
				}, 2000);
			}
		}
	});
}