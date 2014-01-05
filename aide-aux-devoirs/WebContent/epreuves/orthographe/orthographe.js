/*
{
	"nom": "orthographe",
	"parametres": {
		"listes": [
			{
				"nom": "liste 1",
				"termes": [
					"bonjour",
					"au revoir"
				],
				"active": "true"
			}
		]
	}
}
*/

function EpvOrthographe(parametres, validationCallback) {
	var _nomEpreuve			 	= 'orthographe';
	var _validationCallback		= function() { validationCallback(); };
	var _listesMots				= [];
	var _termesEnCours			= [];
	var _cheminsCss				= ['orthographe.css'];

	this.nomEpreuve				= function() { return _nomEpreuve; };
	
	initialiserMembres(parametres);
	
	function initialiserMembres(parametres) {
		if (parametres) {
			_listesMots		= parametres.parametres.listes;
			_termesEnCours	= getTermes(_listesMots);
		}
	}

	this.chargerDependances = function(baseRep) {
		// Ajout des css
		var head	= document.getElementsByTagName('head').item(0);
		
		_cheminsCss.forEach(function(fichier) {
			var link	= document.createElement("link");
			link.rel	= 'stylesheet';
			link.href	= baseRep + fichier;
			head.appendChild(link);
		});
	};
	
	this.initialiserEpreuve = function(id) {
		var thisClass = this;

		$(id).html(	'<h1>Orthographe</h1>' +
					'<div id="EpvOrthographe_Question">' +
					'	Ecrits le mot' +
					'	<div id="EpvOrthographe_Repeter">&nbsp;</div>' +
					'	<input type="hidden" id="EpvOrthographe_txtMot" />' +
					'</div>' +
					'<div id="EpvOrthographe_saisie">' +
					'	R&eacute;ponse :' +
					'	<input type="text" id="EpvOrthographe_txtSaisie" />' +
					'	<input type="submit" id="EpvOrthographe_validation" value="OK" />' +
					'</div>' +
					'</h1>');
		
		$("#EpvOrthographe_validation").click(function() {
			_validationCallback();
		});

		$("#EpvOrthographe_txtSaisie").keyup(function(event){
			if (event.keyCode == 13) {
				_validationCallback();
			}
		});
		
		$("#EpvOrthographe_Repeter").click(function() {
			thisClass.genererQuestion(false);
		});
	};
	
	this.genererQuestion = function(nouvelleQuestion) {
		if (nouvelleQuestion) {
			$("#EpvOrthographe_txtSaisie").val("");
			var ancienMot = $("#EpvOrthographe_txtMot").val();
			$("#EpvOrthographe_txtMot").val("");
			$("#EpvOrthographe_txtSaisie").val("");
			
			if (_termesEnCours.length > 0) {
				$("#EpvOrthographe_txtMot").val(_termesEnCours[0]);
			} else {
				alert("Aucun mot actif ! V&eacute;rifiez la configuration !");
			}

			for (var i = 1 ; i < _termesEnCours.length ; i++) {
				if (ancienMot === _termesEnCours[i-1]) {
					$("#EpvOrthographe_txtMot").val(_termesEnCours[i]);
				}
			}
		} else {
			
		}
		
		parler($("#EpvOrthographe_txtMot").val());
		$("#txtSaisie").focus();
	};
	
	this.validerReponse = function() {
		return $("#EpvOrthographe_txtMot").val().toLowerCase() === $("#EpvOrthographe_txtSaisie").val().toLowerCase();
	};

	function getTermes(listes) {
		var listesActives	= listes.filter(function(l) { return l.active; });
		var termes			= [];
		
		if (listesActives.length > 0) {
			for (var i = 0 ; i < listesActives.length ; i++) {
				termes = termes.concat(listesActives[i].termes);
			}
		
			return termes;
		} else {
			return [];
		}
	}

	/*
		Recherche une liste par son nom et retourne l'objet jquery correspondant le cas échéant ou null
	*/
	function rechercherListe(nomListe) {
		var liste = $("#listes-mots :input[type='checkbox'][value=\"" + nomListe + "\"]");
		
		return liste.length == 0 ? null : liste;
	}

	/*
		Efface les listes de mots de l'écran des paramètres.
	*/
	function effacerListes() {
		$("#listes-mots .liste-mots-liste").remove();
	}

	/*
		Ajoute une nouvelle liste de mots.
	*/
	function ajouterListe(nomListe, active) {
		if (nomListe === '') {
			return;
		}
		
		if (rechercherListe(nomListe)) {
			// la liste existe déjà
			return;
		}
		
		$("#listes-mots").append("<div class='liste-mots-liste'>" +
									"<input type='checkbox' value='" + nomListe + "'" + (active ? " checked " : "") + "'>" + nomListe + "</input>" +
									"<div class='supprimer-liste'></div>" +
									"<div class='liste-mots'>" +
										"Nouveau mot :" +
										"<input type='text' class='nouveau-mot' />" +
										"<div class='ajouter-mot'></div>" +
									"</div>" +
								"</div>");
								
		$("#listes-mots .supprimer-liste").click(function(event) {
			var liste = event.target.parentNode;
			liste.remove();
		});
		
		$("#listes-mots .ajouter-mot").click(function(event) {
			var listeMots 	= $(event.target.parentNode);
			var elementMot	= listeMots.find(".nouveau-mot");
			var mot 		= elementMot.val();
			var nomListe 	= listeMots.siblings(":input[type='checkbox']").val();
			
			ajouterMot(nomListe, mot);
			
			elementMot.val("");
		});
		
		$("#listes-mots .nouveau-mot").keyup(function(event){
			if (event.keyCode == 13) {
				var listeMots 	= $(event.target.parentNode);
				var mot 		= $(event.target).val();
				var nomListe 	= listeMots.siblings(":input[type='checkbox']").val();
				
				ajouterMot(nomListe, mot);
				
				$(event.target).val("");
			}
		});

		
		$("#txtNouvelleListe").val('');
	}

	/*
		Recherche un mot dans une liste et retourne l'objet jquery correspondant le cas échéant ou null
		Paramètres
			liste:		l'objet JQuery correspondant à la liste.
			mot:		le mot à rechercher.
	*/
	function rechercherMot(liste, mot) {
		var obj = liste.siblings(".liste-mots").find("li[value=\"" + mot + "\"]");
		
		return obj.length == 0 ? null : obj;
	}

	/*
		Ajoute un mot à une liste.
		
		Paramètres
			nomListe:		nom de la liste dans laquelle ajouter.
			mot:			mot à ajouter.
	*/
	function ajouterMot(nomListe, mot) {
		if (mot === '') {
			return;
		}
		
		var liste = rechercherListe(nomListe);
		if (!liste) {
			return;
		}
		
		if (rechercherMot(liste, mot)) {
			// Le mot existe déjà
			return;
		}
		
		liste.siblings(".liste-mots").append("<li value=\"" + mot + "\">" + mot +
							"<div class='supprimer-mot'></div>" +
						"</li>");
				
		$(".liste-mots .supprimer-mot").click(function(event) {
			var mot = event.target.parentNode;
			mot.remove();
		});
	}

	this.ajouterPanneauConfiguration = function(id) {
		$(id).append('	<div id="EpvOrthographe_Configuration">' +
					'		<h2>Orthographe</h2>' +
					'		<div id="listes-mots">' +
					'			<div id="listes-mots-ajouter">' +
					'				Nouvelle liste :' +
					'				<input type="text" id="txtNouvelleListe" />' +
					'				<div id="ajouter-liste" />' +
					'			</div>' +
					'		</div>' +
					'	</div>');

		_listesMots.forEach(function(liste) {
			ajouterListe(liste.nom, liste.active);

			liste.termes.forEach(function(terme){
				ajouterMot(liste.nom, terme);
			});
		});

		$("#ajouter-liste").click(function() {
			var nomListe = $("#txtNouvelleListe").val();
			ajouterListe(nomListe, true);
			selectionnerNouveauMot(nomListe);
		});
		
		$("#txtNouvelleListe").keyup(function(event){
			if (event.keyCode == 13) {
				var nomListe = $("#txtNouvelleListe").val();
				ajouterListe(nomListe, true);
				selectionnerNouveauMot(nomListe);
			}
		});
		
		$("#supprimer-liste").click(function(event) {
			$liste = event.target.parent();
			$liste.remove();
		});
	};
	
	/*
		Sélectionne la zone de saisie du nouveau mot de la liste.
	*/
	function selectionnerNouveauMot(nomListe) {
		var elementsListe = rechercherListe(nomListe);
		
		if (
				(elementsListe) &&
				(elementsListe.length > 0)
			) {
			$(elementsListe[0].parentNode).find(".nouveau-mot").focus();
		}
	}
	
	/*
		retourne les paramètres saisis dans le panneau de configuration de l'épreuve.
	*/
	this.parametresEpreuve = function() {
		// Récupération des données dans le panneau de configuration
		_listesMots = [];
		$("#listes-mots .liste-mots-liste").each(function(index, liste){
			var checkbox = $(liste).find(":input[type='checkbox']");
			var nouvelleListe = {
				'nom': checkbox.val(),
				'termes': [],
				'active': checkbox.is(':checked')
			};

			$(liste).find(".liste-mots li").each(function(index, mot) {
				nouvelleListe.termes.push($(mot).attr('value'));
			});
			_listesMots.push(nouvelleListe);
		});
		
		_termesEnCours	= getTermes(_listesMots);
		
		return 	{
					"nom": _nomEpreuve,
					"parametres": {
						"listes": _listesMots
					},
					"historique": {
					}
				};
	};
}