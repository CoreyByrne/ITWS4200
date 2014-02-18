// first we have a few globals, one being the json file
// and the other being an index count of where in the
// along the process we are/
var file,
index = 0;
// on load, we ajax call to the file
$(document).ready(function() {
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "tweets.json",
		success: function( json ) {
			file = json;
		}
	});
});

// function takes index and retrieves info from json file
function load_message(index) {
	return "<li id='new' class='message'>" +
		"<img src='" + file[index]["user"]["profile_image_url"] + "'>" +
		"<div class='message_text'>" + file[index]["text"] + "</div>" +
		"</li>";
}

// function loads hashtags from json file
function load_tags(index) {
	return file[index]["entities"]["hashtags"];
}

// main function, runs on timer
function create_new_message() {
	var mes = $.parseHTML(load_message(index)); 	// load the message at index
	$(mes).hide();									// hide the message
	$("#messages").prepend(mes);					// add message to front
	if($("#messages").children().length > 6) {		// if 7 messages or more
		$(".message").last().remove();				// delete message out of sight
	}
	$("#new").slideDown(200);						// animate in new tweet
	$("#new").removeAttr('id');						// remove its new attribute
	
	var hashtags = load_tags(index);				// load hashtags
	for(var i = 0; i < hashtags.length; i++) {		// loop through hashtags
													// create hashtag element
		var tag = $.parseHTML("<li id ='new' class='hashtag'>#" + hashtags[i]["text"] + "</li>");
		$(tag).hide();								// hide new element
		$("#hashtags").prepend(tag);				// add to front
		if($("#hashtags").children().length > 11) {	// if 12 messages or more
			$(".hashtag").last().remove();			// delete message out of sight
		}
		$("#new").slideDown(200);					// animate hashtag
		$("#new").removeAttr('id');					// remove its new attribute
	}
	index++;										// increment the index counter
}

window.setInterval(create_new_message, 3000);		// set function to run on timer