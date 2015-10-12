var $ = function(elm) { 
	return document.querySelector( elm );
};

var urlToTable = function(url) {
		var idx = url.search(/[\?|\#]/);
		if (idx == -1)
			return "";

		var tbl = "";

		url
		.slice(idx + 1)
		.split(/[\#\&]/)
		.forEach(function (elm,i) {
			if (!elm)
				return;

			elm = elm.split("="); 
			tbl += 
				"<tr>"
				+	"<td>"
				+		"<span class='key'>" + elm[0] + "</span>"
				+	"</td>"
				+	"<td>"
				+		"<input type='text' class='value' value='" + elm[1] + "'></input>"
				+	"</td>"
				+"</tr>";
		});

		return "<table><tbody>" + tbl + "</tbody></table>";
};

var getNewUrl = function(url) {
	var idx = url.search(/[\?|\#]/);
	if (idx == -1)
		return;

	var newUrl = url.slice(0, idx + 1);
	var keys = document.querySelectorAll("span.key");
	var values = document.querySelectorAll("input.value");

	for(var i = 0; i < keys.length; i++) {
		newUrl += keys[i].textContent + "=" + values[i].value + "&";
	}

	return newUrl;	
};

var updateUrl = function() {
	$('#url').value = getNewUrl($('#url').value);
};

var addInputEventListeners = function() {
	var values = document.querySelectorAll("input.value");
	for(var i = 0; i < values.length; i++) {
		values[i].addEventListener('keyup', updateUrl);
	}	
};

var redirect = function(url) {
	chrome.tabs.query({"active": true}, function(tabs) { 
		chrome.tabs.update(tabs[0].id, {url: getNewUrl(url)});
	});
};

$('#url').addEventListener('keyup', function (e) {
	$('#params').innerHTML = urlToTable( $('#url').value );
	addInputEventListeners();
});

$('#redirect').addEventListener('click', function (e) {
	redirect($('#url').value);
});

$('#decode').addEventListener('click', function (e) {
	var keys = document.querySelectorAll("span.key");
	for(var i = 0; i < keys.length; i++) {
		keys[i].textContent = decodeURIComponent(keys[i].textContent);
	}
	var values = document.querySelectorAll("input.value");
	for(var i = 0; i < values.length; i++) {
		values[i].value = decodeURIComponent(values[i].value);
	}
});

chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function(tabs) { 
	$('#url').value = tabs[0].url;
	$('#params').innerHTML = urlToTable( $('#url').value );
	addInputEventListeners();
});
