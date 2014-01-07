/*
 * Constructeur.
 */
function EpvOrthographe(parametres, validationCallback) {
	EpvBaseClass.call(this, parametres, validationCallback);
	
	this.NomEpreuve				= 'orthographe';
	this.CheminsCss				= ['css/orthographe.css'];
	
	var that					= this;
	
	this._listesMots			= [];
	this._termesEnCours			= [];
	
	this.getTermes = function(listes)  {
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
	};
	
	initialiserMembres(parametres);
	
	function initialiserMembres(parametres) {
		if (parametres) {
			that._listesMots		= parametres.parametres.listes;
			that._termesEnCours		= that.getTermes(that._listesMots);
		}
	}	
}

// Héritage du prototype de la classe mère.
EpvOrthographe.prototype = new EpvBaseClass();

/*
 * Description
 * 		Initialise le panneau de l'épreuve
 * Paramètres
 * 		id:			L'identifiant du div acceuillant la représentation de l'épreuve.
 */
EpvOrthographe.prototype.initialiserEpreuve = function(id) {
	var that = this;

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
		that.validationCallback();
	});

	$("#EpvOrthographe_txtSaisie").keyup(function(event){
		if (event.keyCode == 13) {
			that.validationCallback();
		}
	});
	
	$("#EpvOrthographe_Repeter").click(function() {
		that.genererQuestion(false);
	});
};

EpvOrthographe.prototype.genererQuestion = function(nouvelleQuestion) {
	if (nouvelleQuestion) {
		$("#EpvOrthographe_txtSaisie").val("");
		var ancienMot = $("#EpvOrthographe_txtMot").val();
		$("#EpvOrthographe_txtMot").val("");
		$("#EpvOrthographe_txtSaisie").val("");
		
		if (this._termesEnCours.length > 0) {
			$("#EpvOrthographe_txtMot").val(this._termesEnCours[0]);
		} else {
			alert("Aucun mot actif ! V&eacute;rifiez la configuration !");
		}

		for (var i = 1 ; i < this._termesEnCours.length ; i++) {
			if (ancienMot === this._termesEnCours[i-1]) {
				$("#EpvOrthographe_txtMot").val(this._termesEnCours[i]);
			}
		}
	} else {
		
	}
	
	parler($("#EpvOrthographe_txtMot").val());
	$("#txtSaisie").focus();
};

EpvOrthographe.prototype.validerReponse = function() {
	return $("#EpvOrthographe_txtMot").val().toLowerCase() === $("#EpvOrthographe_txtSaisie").val().toLowerCase();
};

EpvOrthographe.prototype.ajouterPanneauConfiguration = function(id) {
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

	this._listesMots.forEach(function(liste) {
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
};

/*
	retourne les paramètres saisis dans le panneau de configuration de l'épreuve.
*/
EpvOrthographe.prototype.parametresEpreuve = function() {
	var that = this;
	
	// Récupération des données dans le panneau de configuration
	that._listesMots = [];
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
		that._listesMots.push(nouvelleListe);
	});
	
	that._termesEnCours	= that.getTermes(that._listesMots);
	
	return 	{
				"nom": that.NomEpreuve,
				"parametres": {
					"listes": that._listesMots
				},
				"historique": {
				}
			};
};	