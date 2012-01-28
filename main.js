/** This is for the NLP work **/
var stopWords = new Array("i've", "you're", "that's", "it's", "i'm", "don't", "just", "did", "didn't", "isn't", "wasn't", "weren't", "they're", "i", " ", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the");

var wordCounts = {};
var totalCount = 0;

$(document).ready(function () {
	
	
	/** interactive functionalities and image hovers **/
	$("#analyze").click(function() {
		var forumName = $("#forumName").val();
		if (forumName != "") {
			getLikedUsers(forumName);
			$("#analyze").attr("style", "display: none;");
			$("#forumName").attr("style", "display: none");
			$("#loading").attr("style", "");
		}
	});
	
	$("#analyze").hover(function() {
		$("#analyze").attr("src", "img/button_glow.png");
		}, 
		function() {
		$("#analyze").attr("src", "img/button.png");
		});
		
	$("#test").hover(function() {
		$("#test").attr("src", "img/test_glow.png");
		}, 
		function() {
		$("#test").attr("src", "img/test.png");
		});
		
	$("#test").click(function() {
		var text = $("#comment").val();
		text = text.split(" ");
		var prob = 0.0;
		text.forEach(function(word) {
			/** condense word **/
			word = word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~() "\n]/g,"");
			word = word.replace(/\s{2,}/g," ");
			word = word.toLowerCase();
			if ($.inArray(word, stopWords) == -1) {
				if (wordCounts[word] == null) {
					wordCounts[word] = 0;
				}
				prob += Math.log(wordCounts[word] + 1) - Math.log(totalCount + 1);
			}
		});
		
		/** unscaled probability **/ 
		console.log(prob);
	});		
});

function getLikedUsers(forumName) {
	$.ajax({
		url: "https://disqus.com/api/3.0/forums/listMostLikedUsers.jsonp?",
		data: {forum: forumName,
				api_secret: "wQ2624dAWkU1SQ2x2uxrnCJH7ySQqczsz4RQwyzUihIANPE0O0eFiiMdSeN3NcPN",
				limit: "10"},
		success: function(data) {processForum(data, forumName);},
		dataType: "jsonp"
	});						
}

function processForum(data, forumName) {
	var userIDArray = new Array();
	var data = data.response;
	var i = 0;
	data.forEach(function(user) {
		userIDArray[i] = user.id;
		i++;
	});
	processUsers(userIDArray, 0, {});
}

function processUsers(userIDArray, index, wordArray) {
	//list posts given the user array
	if (index < userIDArray.length) {
		$.ajax({
			url: "https://disqus.com/api/3.0/users/listPosts.jsonp?",
			data: {user: userIDArray[index],
					api_secret: "wQ2624dAWkU1SQ2x2uxrnCJH7ySQqczsz4RQwyzUihIANPE0O0eFiiMdSeN3NcPN",
					limit: "100"},
			success: function(data) {
				data = data.response;
				data.forEach(
					function(post) {
						post.raw_message.split(" ").forEach(
							function(word) {
								/** condense word **/
								word = word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~() "\n]/g,"");
								word = word.replace(/\s{2,}/g," ");
								word = word.toLowerCase();
								if ($.inArray(word, stopWords) == -1) {
									if (wordArray[word]) {
										wordArray[word] += 1;
									} else {
										wordArray[word] = 1;
									}
								}
							}
						);
					}
				);
				index++;
				processUsers(userIDArray, index, wordArray);
				},
			dataType: "jsonp"
		});
	} else {
		Analyze(wordArray);
	}
}

function Analyze(wordArray) {
	
	/** sorting **/
	var tuples = [];
	for (var key in wordArray) {
		tuples.push([key, wordArray[key]]);
	}
	tuples.sort(function(a, b) {
		a = a[1];
		b = b[1];

		return a < b ? -1 : (a > b ? 1 : 0);
	});
	
	var myString = "Top 50 words: \n"
	for (var i = tuples.length-1; i >= 0; i--) {
		var key = tuples[i][0];
		var value = tuples[i][1];
		totalCount += value;
		if (tuples.length-1 - i < 50 && i != tuples.length - 1) {
			myString += key + ": " + value + "\n"
		}
	}
	
	//set gobal variable
	wordCounts = wordArray;
	updatePage(myString);
}

function updatePage(myString) {}
	$("#loading").attr("style", "display: none;");
	$("#output").attr("style", "");
	$("#output").attr("value", myString);
	$("#comment").attr("style", "");
	$("#test").attr("style", "");
}
