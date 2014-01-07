/*
 * Constructeur.
 */
function EpvAddition(parametres, validationCallback) {
	EpvBaseClass.call(this, parametres, validationCallback);
	
	this.NomEpreuve				= 'addition';
	this.CheminsCss				= [];
	
	this._plageOperande1 		= parametres.parametres.operande1_max;
	this._plageOperande2 		= parametres.parametres.operande2_max;	
	
	initialiserMembres(parametres);
	
	function initialiserMembres(parametres) {
		if (parametres) {
			if (parametres) {
				if (parametres.operande1_max)
					_plageOperande1 = parametres.operande1_max;

				if (parametres.operande2_max)
					_plageOperande2 = parametres.operande2_max;
			}
		}
	}
}

// H�ritage du prototype de la classe m�re.
EpvAddition.prototype = new EpvBaseClass();

/*
 * Description
 * 		Initialise le panneau de l'�preuve
 * Param�tres
 * 		id:			L'identifiant du div acceuillant la repr�sentation de l'�preuve.
 */
EpvAddition.prototype.initialiserEpreuve = function(id) {
	var that = this;
	
	$(id).html(	'<h1>Addition</h1>' +
				'<div id="EpvAddition_Question">' +
				'	Combien font' +
				'	<input type="text" id="EpvAddition_txtQuestion" readonly="true" />' +
				'</div>' +
				'<div id="EpvAddition_saisie">' +
				'	R&eacute;ponse :' +
				'	<input type="text" id="EpvAddition_txtSaisie" />' +
				'	<input type="submit" id="EpvAddition_validation" value="OK" />' +
				'</div>' +
				'</h1>');
	
	$("#EpvAddition_validation").click(function() {
		that.validationCallback();
	});

	$("#EpvAddition_txtSaisie").keyup(function(event){
		if (event.keyCode == 13) {
			that.validationCallback();
		}
	});
};

/*
 * Description
 * 		G�n�re une question.
 * Param�tres
 * 		nouvelleQuestion:	Si false : r�it�re la question pr�c�dente.
 * 							Si true : g�n�re une nouvelle question.
 */
EpvAddition.prototype.genererQuestion = function(nouvelleQuestion) {
	if (!nouvelleQuestion)
		return;

	$("#EpvAddition_txtSaisie").val("");
	$("#EpvAddition_txtQuestion").val("");

	var operande1 = Math.floor(this._plageOperande1 * Math.random());
	var operande2 = Math.floor(this._plageOperande2 * Math.random());
	$("#EpvAddition_txtQuestion").val(operande1 + " + " + operande2);
	
	$("#EpvAddition_txtSaisie").focus();
};

/*
 * Description
 * 		Valide la r�ponse � la question en fonction des donn�es fournies par le joueur.
 * Valeur de Retour
 * 		true :	La r�ponse est valide.
 * 		false : La r�ponse est erronn�e.
 */
EpvAddition.prototype.validerReponse = function() {
	return eval($("#EpvAddition_txtQuestion").val()) === eval($("#EpvAddition_txtSaisie").val());
};

/*
 * Description
 * 		Ajoute le panneau de configuration correspondant � l'�preuve.
 * Param�tres
 * 		id :	Identifiant du div dans lequel ajouter le panneau.
 */
EpvAddition.prototype.ajouterPanneauConfiguration = function(id) {
	$(id).append('	<div id="EpvAddition_Configuration">' +
				'		<h2>Addition</h2>' +
				'		Maximum op&eacute;rande 1 : ' +
				'		<input type="number" id="EpvAddition_Configuration_MaxOperande1" value="' + this._plageOperande1 + '" />' +
				'		Maximum op&eacute;rande 2 : ' +
				'		<input type="number" id="EpvAddition_Configuration_MaxOperande2" value="' + this._plageOperande2 + '" />' +
				'	</div>');
};

/*
 * Description
 *		Retourne les param�tres saisis dans le panneau de configuration de l'�preuve.
 */
EpvAddition.prototype.parametresEpreuve = function() {
	// R�cup�ration des donn�es dans le panneau de configuration
	this._plageOperande1	= $("#EpvAddition_Configuration_MaxOperande1").val();
	this._plageOperande2	= $("#EpvAddition_Configuration_MaxOperande2").val();
	
	return 	{
				"nom": this.NomEpreuve,
				"parametres": {
					"operande1_max": this._plageOperande1,
					"operande2_max": this._plageOperande2
				},
				"historique": {
				}
			};
};