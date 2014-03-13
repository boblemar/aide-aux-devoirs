function SyntheseVocale() {
	this.parler = function(phrase) {
		parler_embeded(phrase);
	};
	
	/**
	 * Parle � l'aide d'un popup google translate.
	 */
	function parler_popup(phrase) {
		var url = encodeURI('http://translate.google.com/translate_tts?ie=UTF-8&tl=fr&q=' + phrase);
		wnd = window.open(url, 'tts', 'height=20,width=20,status=no,toolbar=no,scrollbars=no,menubar=no,location=no');
		wnd.blur();
		setTimeout(function() {
				wnd.close();
			}, 2000);
	}
	
	/**
	 * Parle � l'aide de google translate de fa�on int�gr�e
	 */
	function parler_embeded(phrase) {
		var url = encodeURI('http://translate.google.com/translate_tts?ie=UTF-8&tl=fr&q=' + phrase);
		
		var audio = new Audio(url);
		audio.rel="noreferrer";
		audio.play();
	}
}