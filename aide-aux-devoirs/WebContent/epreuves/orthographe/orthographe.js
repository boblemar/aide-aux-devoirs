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

// H�ritage du prototype de la classe m�re.
EpvOrthographe.prototype = new EpvBaseClass();

/*
 * Description
 * 		Initialise le panneau de l'�preuve
 * Param�tres
 * 		id:			L'identifiant du div acceuillant la repr�sentation de l'�preuve.
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

/*
 * Description
 * 		Construit le panneau de configuration correspondant � l'�preuve.
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
			// la liste existe d�j�
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
	 * Recherche une liste de mots et retourne l'objet JQuery correspondant si trouv�.
	 * @param listesMots	L'objet JQuery contenant les listes de mots.
	 * @param nomListe		Le nom de la liste � chercher.
	 * @returns				L'objet JQuery correspondant � la liste.
	 */
	function rechercherListe(listesMots, nomListe) {
		var liste = listesMots.find(":input[type='checkbox'][value=\"" + nomListe + "\"]");
		
		return liste.length == 0 ? null : liste;
	};

	/**
	 * Recherche un mot dans une liste
	 * @param listeMots		L'objet JQuery repr�sentant la liste dans laquelle rechercher le mot.
	 * @param mot			Le mot � rechercher.
	 * @returns				L'objet JQuery repr�sentant le mot.
	 */
	function rechercherMot(listeMots, mot) {
		var obj = listeMots.siblings(".liste-mots").find("li[value=\"" + mot + "\"]");
		
		return obj.length == 0 ? null : obj;
	};
	
	/*
		Ajoute un mot � une liste.
		
		Param�tres
			listesMots:		l'objet Jquery cotenant les listes de mots.
			nomListe:		nom de la liste dans laquelle ajouter.
			mot:			mot � ajouter.
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
			// Le mot existe d�j�
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
		S�lectionne la zone de saisie du nouveau mot de la liste.
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
	retourne les param�tres saisis dans le panneau de configuration de l'�preuve.
*/
EpvOrthographe.prototype.parametresEpreuve = function() {
	var that = this;
	
	// R�cup�ration des donn�es dans le panneau de configuration
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