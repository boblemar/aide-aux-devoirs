var urlAPI 		= "http://boblemar.bl.ee/rest.php/data/aide-aux-devoirs/";
var parametresJoueur;

$(document).ready(function() {
	$("#lnkFermerParametres").click(function() {
		enregistrerParametres(nomJoueur);
		
		// On génère une nouvelle question
		selectionnerEpreuve(epreuveEnCours.nomEpreuve());
		
		$("#parametres").fadeOut();
	});
});

function chercherParametres(typeEpreuve) {
	return parametresJoueur.types.filter( function(t) { return t.nom === typeEpreuve; })[0];
}

function chargerParametres(nomJoueur, callback) {
	chargerParametres_Online(nomJoueur, callback);
}

function chargerParametres_Online(nomJoueur, callback) {
	$.ajax({
		type: "GET",
		dataType: "json",
		url: urlAPI + nomJoueur
	}).done(function(data) {
		localStorage.setItem(nomJoueur, JSON.stringify(data));
	}).always(function(data) {
		chargerParametres_Offline(nomJoueur);
		callback();
	});
}

/*
	Charge les paramètres depuis le storage.
*/
function chargerParametres_Offline(nomJoueur) {

	if (!localStorage.getItem(nomJoueur)) {
		localStorage.setItem(nomJoueur, JSON.stringify(PARAMETRES_DEFAUT));
	}

	parametresJoueur = JSON.parse(localStorage.getItem(nomJoueur));
}

function enregistrerParametres(nomJoueur) {
	enregistrerParametres_Offline(nomJoueur);
	enregistrerParametres_Online(nomJoueur);
}

function enregistrerParametres_Online(nomJoueur) {	
	$.ajax({
		type: "PUT",
		dataType: "json",
		url: urlAPI + nomJoueur,
		data: localStorage.getItem(nomJoueur)
	}).done(function(data) {
		alert(data);
	});
}

/*
	Enresgitre les paramètres dans le storage.
*/
function enregistrerParametres_Offline(nomJoueur) {	
	parametresJoueur.types = [];
	
	for (nomEpreuve in epreuves) {
		parametresJoueur.types.push(epreuves[nomEpreuve].parametresEpreuve());
	}
	
	localStorage.setItem(nomJoueur, JSON.stringify(parametresJoueur));
}