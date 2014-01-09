/*
 * Constructeur.
 */
function EpvBaseClass(parametres, validationCallback) {
	this.validationCallback		= function() { validationCallback(); };
	this.NomEpreuve				= 'Ind�fini';							// Surcharger ici le nom de l'�preuve.
	this.CheminsCss				= [];									// Surcharger ici les chemins de CSS � charger pour l'�preuve.
}

/*
 * Charge les d�pendances de l'�preuve.
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
 * 		Initialise le panneau de l'�preuve
 * Param�tres
 * 		id:			L'identifiant du div acceuillant la repr�sentation de l'�preuve.
 */
EpvBaseClass.prototype.initialiserEpreuve = function(id) {};

/*
 * Description
 * 		G�n�re une question.
 * Param�tres
 * 		nouvelleQuestion:	Si false : r�it�re la question pr�c�dente.
 * 							Si true : g�n�re une nouvelle question.
 */
EpvBaseClass.prototype.genererQuestion = function(nouvelleQuestion) {};

/*
 * Description
 * 		Valide la r�ponse � la question en fonction des donn�es fournies par le joueur.
 * Valeur de Retour
 * 		true :	La r�ponse est valide.
 * 		false : La r�ponse est erronn�e.
 */
EpvBaseClass.prototype.validerReponse = function() {};

/*
 * Description
 * 		Construit le panneau de configuration correspondant � l'�preuve.
 */
EpvBaseClass.prototype.construirePanneauConfiguration = function() {};

/*
 * Description
 *		Retourne les param�tres saisis dans le panneau de configuration de l'�preuve.
 */
EpvBaseClass.prototype.parametresEpreuve = function() {};
