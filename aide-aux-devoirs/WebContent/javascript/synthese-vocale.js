function SyntheseVocale() {
	this.parler = function(phrase) {
		var url = encodeURI('http://translate.google.com/translate_tts?ie=UTF-8&tl=fr&q=' + phrase);
		wnd = window.open(url, 'tts', 'height=20,width=20,status=no,toolbar=no,scrollbars=no,menubar=no,location=no');
		wnd.blur();
		setTimeout(function() {
				wnd.close();
			}, 2000);
	};
}