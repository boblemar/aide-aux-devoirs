
var epreuve 		= "addition à trous";
var epreuveEnCours	= null;
//var nomJoueur 		= "test";
var nomJoueur 		= "Léandre";
var listeMots 		= 'liste 1';
var syntheseVocale	= new SyntheseVocale();

var epreuves 		= [];


var definitionEpreuves = [ {
							"nom": "addition",
							"classe": "EpvAddition",
							"chemin": "epreuves/addition/",
							"script": "addition.js"
						},
						{
							"nom": "addition à trous",
							"classe": "EpvAdditionATrous",
							"chemin": "epreuves/addition-a-trous/",
							"script": "addition-a-trous.js"
						},
						{
							"nom": "orthographe",
							"classe": "EpvOrthographe",
							"chemin": "epreuves/orthographe/",
							"script": "orthographe.js"
						}
					];

$(document).ready(function() {

	$("#validation").click(validation);

	$("#epreuve-addition").click(function() {
		selectionnerEpreuve('addition');
	});

	$("#epreuve-addition-a-trous").click(function() {
		selectionnerEpreuve('addition à trous');
	});

	$("#epreuve-orthographe").click(function() {
		selectionnerEpreuve('orthographe');
	});

	$("#lnkOuvrirParametres").click(function() {
		var panelParametres	= $("#parametres");
		var panelJeu		= $("#jeu");
		
		// construction du panneau de paramètres
		$("#parametres-contenu").html("");
		
		for (nomEpreuve in epreuves) {
			$("#parametres-contenu")
				.append('<h3>' + nomEpreuve + '</h3>')
				.append(epreuves[nomEpreuve].construirePanneauConfiguration());
		}

		$("#parametres-contenu").accordion({heightStyle: "fill" });
	
		panelParametres.css({top: panelJeu.position().top, left: panelJeu.position().left});
		panelParametres.height(panelJeu.height());
		panelParametres.width(panelJeu.width());
		
		$("#parametres").fadeIn();
		
		$("#parametres-contenu").accordion('refresh');
	});

	$("#lnkFermerParametres").click(function() {
		$("#parametres").fadeOut();
	});
	
	chargerParametres(nomJoueur, function() {
		// import des épreuves
		for (var i = definitionEpreuves.length - 1 ; i >= 0 ; i--) {
			var definitionEpreuve = definitionEpreuves[i];
			
			// Ajout du script
			var head	= document.getElementsByTagName('head').item(0);
			var script	= document.createElement("script");
			
			script.src	= definitionEpreuve.chemin + definitionEpreuve.script;
			
			(function(defEpreuve, estDerniereEpreuve){
				script.onload = function(event) {
					var classeEpreuve = window[defEpreuve.classe];

					var epv		= new classeEpreuve(chercherParametres(defEpreuve.nom), validation);
					epv.chargerDependances(defEpreuve.chemin);

					epreuves[defEpreuve.nom] = epv;
					
					if (epreuvesChargees()) {
						selectionnerEpreuve(epreuve);
					}
				};
			})(definitionEpreuve, i == 0);
			
			head.appendChild(script);
		}
	});
});

function epreuvesChargees() {
	for (var i = 0 ; i < definitionEpreuves.length ; i++) {
		if 	(!epreuves[definitionEpreuves[i].nom]) {
			return false;
		}
	}
	
	return true;
}

function selectionnerEpreuve(e) {
	epreuveEnCours = epreuves[e];
	
	$("#resultat-mauvais").hide();
	$("#resultat-bon").hide();
	
	epreuveEnCours.initialiserEpreuve('#epreuve');
	epreuveEnCours.genererQuestion(true);
}

function validation() {
	if (epreuveEnCours.validerReponse()) {
		$("#resultat-mauvais").hide();
		$("#score-bon").html(eval($("#score-bon").html()) + 1);
		$("#resultat-bon").show().delay(1000).fadeOut();
		//parler('Bonne réponse !');
		epreuveEnCours.genererQuestion(true);
	} else {
		$("#resultat-bon").hide();
		$("#score-mauvais").html(eval($("#score-mauvais").html()) + 1);
		$("#resultat-mauvais").show().delay(1000).fadeOut();
		$("#txtSaisie").val("");
		$("#txtSaisie").focus();
		//parler('Mauvaise réponse !');
		epreuveEnCours.genererQuestion(false);
	}
}

function parler(phrase) {
	syntheseVocale.parler(phrase);
}
