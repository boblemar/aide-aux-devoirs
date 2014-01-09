/*
 * Constructeur.
 */
function EpvBaseClass(parametres, validationCallback) {
	this.validationCallback		= function() { validationCallback(); };
	this.NomEpreuve				= 'Indéfini';							// Surcharger ici le nom de l'épreuve.
	this.CheminsCss				= [];									// Surcharger ici les chemins de CSS à charger pour l'épreuve.
}

/*
 * Charge les dépendances de l'épreuve.
 */
EpvBaseClass.prototype.chargerDependances = function(baseRep) {
	// Ajout des css
	var head	= document.getElementsByTagName('head').item(0);
	
	this.CheminsCss.forEach(function(fichier) {
		var link	= document.createElement("link");
		link.rel	= 'stylesheet';
		link.href	= baseRep + fichier;
		head.appendChild(link);
	});
};

/*
 * Description
 * 		Initialise le panneau de l'épreuve
 * Paramètres
 * 		id:			L'identifiant du div acceuillant la représentation de l'épreuve.
 */
EpvBaseClass.prototype.initialiserEpreuve = function(id) {};

/*
 * Description
 * 		Génère une question.
 * Paramètres
 * 		nouvelleQuestion:	Si false : réitère la question précédente.
 * 							Si true : génère une nouvelle question.
 */
EpvBaseClass.prototype.genererQuestion = function(nouvelleQuestion) {};

/*
 * Description
 * 		Valide la réponse à la question en fonction des données fournies par le joueur.
 * Valeur de Retour
 * 		true :	La réponse est valide.
 * 		false : La réponse est erronnée.
 */
EpvBaseClass.prototype.validerReponse = function() {};

/*
 * Description
 * 		Construit le panneau de configuration correspondant à l'épreuve.
 */
EpvBaseClass.prototype.construirePanneauConfiguration = function() {};

/*
 * Description
 *		Retourne les paramètres saisis dans le panneau de configuration de l'épreuve.
 */
EpvBaseClass.prototype.parametresEpreuve = function() {};
