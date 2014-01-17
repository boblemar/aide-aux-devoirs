/*
 * Constructeur.
 */
function EpvOrthographe(parametres, validationCallback) {
	EpvBaseClass.call(this, parametres, validationCallback);
	
	this.NomEpreuve						= 'orthographe';
	this.CheminsCss						= ['css/orthographe.css'];
	
	var that							= this;
	
	this._listesMots					= [];
	
	this._termesPartieEnCours			= [];
	
	this._nbEssais						= 3;
	
	this._nbEssaisRestantsPartieEnCours	= this._nbEssais;
	
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
			that._listesMots					= parametres.parametres.listes;
			that._termesPartieEnCours			= that.getTermes(that._listesMots);
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
				'<div id="EpvOrthographe_partieEnCours">' +
				'	<h2>Partie en cours</h2>' +
				'	Nombre de mots restants :'	+
				'	<div id="EpvOthographe_nbRestants"></div>' +
				'	<br />' +
				'	<div id="EpvOrthographe_aide">' +
				'	L\'orthographe correcte était : ' + '<div id="EpvOrthographe_ortographeDernierMot"></div>' + 
				'	</div>' +
				'</div>');
	
	this.rafraichirPartieEnCours();
	
	$("#EpvOrthographe_validation").click(function() {
		that.validationCallback();
	});

	$("#EpvOrthographe_txtSaisie").keyup(function(event){
		if (event.keyCode == 13) {
			that.validationCallback();
		}
	});
	
	$("#EpvOrthographe_Repeter").click(function() {
		parler($("#EpvOrthographe_txtMot").val());
	});
};

/*
 * Description
 * 		Génère une question.
 * Paramètres
 * 		nouvelleQuestion:	Si false : réitère la question précédente.
 * 							Si true : génère une nouvelle question.
 * Remarques
 * 		le paramètre nouvelleQuestion n'est pas utilisé dans cette épreuve.
 * 		Le système passe à la question suivante automatiquement si la réponse est juste ou si le nombre d'essais est atteint.
 */
EpvOrthographe.prototype.genererQuestion = function(nouvelleQuestion) {
	// On recopie la liste de termes sélectionnés dans la liste de la partie
	if (this._termesPartieEnCours.length === 0) {
		alert("Fin de la partie !");
		this._termesPartieEnCours = this.getTermes(this._listesMots);
	}
	

	$("#EpvOrthographe_txtSaisie").val("");
	$("#EpvOrthographe_txtMot").val("");
	$("#EpvOrthographe_txtSaisie").val("");
	
	if (this._termesPartieEnCours.length > 0) {
		$("#EpvOrthographe_txtMot").val(this._termesPartieEnCours[0]);
	} else {
		alert("Aucun mot actif ! V&eacute;rifiez la configuration !");
	}
	
	parler($("#EpvOrthographe_txtMot").val());
	$("#txtSaisie").focus();
};

/*
 * Description
 * 		Valide la réponse à la question en fonction des données fournies par le joueur.
 * Valeur de Retour
 * 		true :	La réponse est valide.
 * 		false : La réponse est erronnée.
 */
EpvOrthographe.prototype.validerReponse = function() {
	var reponseJuste = $("#EpvOrthographe_txtMot").val().toLowerCase() === $("#EpvOrthographe_txtSaisie").val().toLowerCase();
	
	if (reponseJuste) {
		// On enlève le mot de la liste
		this._termesPartieEnCours.shift();
		this._nbEssaisRestantsPartieEnCours = this._nbEssais;
		$("#EpvOrthographe_ortographeDernierMot").text("");
	} else {
		this._nbEssaisRestantsPartieEnCours --;

		if (this._nbEssaisRestantsPartieEnCours == 0) {
			// On enlève le mot de la tête et on le replace à la fin
			var motEnCours = this._termesPartieEnCours.shift();
			this._termesPartieEnCours.push(motEnCours);
			this._nbEssaisRestantsPartieEnCours = this._nbEssais;
			
			// On écrit l'orthographe correcte dans l'aide
			$("#EpvOrthographe_ortographeDernierMot").text(motEnCours);
		}
	}
	
	this.rafraichirPartieEnCours();
	
	return reponseJuste;
};

/**
 * Description
 * 		Met à jour le panneau de l'épreuve en cours.
 */
EpvOrthographe.prototype.rafraichirPartieEnCours = function() {
	var aideDernierMot = $("#EpvOrthographe_ortographeDernierMot").text();
	
	if (aideDernierMot === "") {
		$("#EpvOrthographe_aide").fadeOut();
	} else {
		$("#EpvOrthographe_aide").fadeIn();
	}
	
	// Affichage du nombre de mots restants
	$("#EpvOthographe_nbRestants").text(this._termesPartieEnCours.length);
}

/*
 * Description
 * 		Construit le panneau de configuration correspondant à l'épreuve.
 * Valeur de retour
 * 		L'objet jquery contenant le panneau.
 */
EpvOrthographe.prototype.construirePanneauConfiguration = function() {
	var panneau 		= $('<div id="EpvOrthographe_Configuration" />');
	var listesMots		= $('<div id="listes-mots" />').appendTo(panneau);
	var listeAAjouter	= $('<div id="listes-mots-ajouter">' +
							'	Nouvelle liste :' +
							'</div>').appendTo(listesMots);
	
	function ajouterListe(listesMots, nomListe, active, contractee) {
		if (nomListe === '') {
			return;
		}
		
		if (rechercherListe(listesMots, nomListe)) {
			// la liste existe déjà
			return;
		}
		
		var nouvelleListe 	= $('<div />')
								.addClass('liste-mots-liste')
								.append('<input type="checkbox" value="' + nomListe + '"' + (active ? ' checked ' : '') + '>' + nomListe + '</input>');

		var boutonAffichageListe	= $('<div />')
										.click(function() {
											if ($(this).hasClass('affichage-liste-contractee')) {
												$(this).removeClass('affichage-liste-contractee')
														.addClass('affichage-liste-etendue');
												
												// on affiche la liste
												listeMots.slideDown();
											} else {
												$(this).removeClass('affichage-liste-etendue')
												.addClass('affichage-liste-contractee');
												
												// on masque la liste
												listeMots.slideUp();
											}
										})
										.appendTo(nouvelleListe);

		var supprimerListe	= $('<div />')
								.addClass('supprimer-liste')
								.click(function(event) {
									var liste = event.target.parentNode;
									liste.remove();})
								.appendTo(nouvelleListe);
		
		var listeMots		= $('<div>Nouveau mot :</div>')
								.addClass('liste-mots')
								.appendTo(nouvelleListe);
		
		if (contractee) {
			listeMots.hide();
			boutonAffichageListe.addClass('affichage-liste-contractee');
		} else {
			listeMots.show();
			boutonAffichageListe.addClass('affichage-liste-etendue');			
		}
		
		var nouveauMot		= $('<input />')
								.attr('type', 'text')
								.addClass('nouveau-mot')
								.keyup(function(event){
									if (event.keyCode == 13) {
										var listeMots 	= $(event.target.parentNode);
										var mot 		= $(event.target).val();
										var nomListe 	= listeMots.siblings(":input[type='checkbox']").val();
										
										ajouterMotDansListe(listesMots, nomListe, mot);
										
										$(event.target).val("");
									}})
								.appendTo(listeMots);

		var ajouterMot		= $('<div />')
								.addClass('ajouter-mot')
								.click(function(event) {
									var listeMots 	= $(event.target.parentNode);
									var elementMot	= listeMots.find(".nouveau-mot");
									var mot 		= elementMot.val();
									var nomListe 	= listeMots.siblings(":input[type='checkbox']").val();
									
									ajouterMotDansListe(listesMots, nomListe, mot);
									
									elementMot.val("");})
								.appendTo(listeMots);
		
		$("#txtNouvelleListe").val('');
		
		listesMots.append(nouvelleListe);
	};
	
	// Texte de saisie d'une nouvelle liste
	$('<input type="text" id="txtNouvelleListe" />')
		.keyup(function(event){
				if (event.keyCode == 13) {
					var nomListe = $("#txtNouvelleListe").val();
					ajouterListe(listesMots, nomListe, true, false);
					selectionnerNouveauMot(listesMots, nomListe);
				}
			})
		.appendTo(listeAAjouter);
	
	// Bouton nouvelle liste
	$('<div id="ajouter-liste" />')
		.click(function() {
			var nomListe = $("#txtNouvelleListe").val();
			ajouterListe(listesMots, nomListe, true, false);
			selectionnerNouveauMot(nomListe);
		})
		.appendTo(listeAAjouter);

	// Ajotu des listes existantes
	this._listesMots.forEach(function(liste) {
		ajouterListe(listesMots, liste.nom, liste.active, true);

		liste.termes.forEach(function(terme){
			ajouterMotDansListe(listesMots, liste.nom, terme);
		});
	});
	
	$("#supprimer-liste").click(function(event) {
		$liste = event.target.parent();
		$liste.remove();
	});
	
	
	/**
	 * Recherche une liste de mots et retourne l'objet JQuery correspondant si trouvé.
	 * @param listesMots	L'objet JQuery contenant les listes de mots.
	 * @param nomListe		Le nom de la liste à chercher.
	 * @returns				L'objet JQuery correspondant à la liste.
	 */
	function rechercherListe(listesMots, nomListe) {
		var liste = listesMots.find(":input[type='checkbox'][value=\"" + nomListe + "\"]");
		
		return liste.length == 0 ? null : liste;
	};

	/**
	 * Recherche un mot dans une liste
	 * @param listeMots		L'objet JQuery représentant la liste dans laquelle rechercher le mot.
	 * @param mot			Le mot à rechercher.
	 * @returns				L'objet JQuery représentant le mot.
	 */
	function rechercherMot(listeMots, mot) {
		var obj = listeMots.siblings(".liste-mots").find("li[value=\"" + mot + "\"]");
		
		return obj.length == 0 ? null : obj;
	};
	
	/*
		Ajoute un mot à une liste.
		
		Paramètres
			listesMots:		l'objet Jquery cotenant les listes de mots.
			nomListe:		nom de la liste dans laquelle ajouter.
			mot:			mot à ajouter.
	*/
	function ajouterMotDansListe(listesMots, nomListe, mot) {
		if (mot === '') {
			return;
		}
		
		var liste = rechercherListe(listesMots, nomListe);
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
	function selectionnerNouveauMot(listesMots, nomListe) {
		var elementsListe = rechercherListe(listesMots, nomListe);
		
		if (
				(elementsListe) &&
				(elementsListe.length > 0)
			) {
			$(elementsListe[0].parentNode).find(".nouveau-mot").focus();
		}
	}
	
	return panneau;
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
	
	that._termesPartieEnCours = that.getTermes(that._listesMots);
	
	return 	{
				"nom": that.NomEpreuve,
				"parametres": {
					"listes": that._listesMots
				},
				"historique": {
				}
			};
};	