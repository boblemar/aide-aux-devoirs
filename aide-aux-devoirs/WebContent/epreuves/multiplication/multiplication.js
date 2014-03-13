/*
 * Constructeur.
 */
function EpvMultiplication(parametres, validationCallback) {
	EpvBaseClass.call(this, parametres, validationCallback);

	var that					= this;
	
	this.NomEpreuve				= 'multiplication';
	this.CheminsCss				= [];

	this._minOperande1		= 0;
	this._maxOperande1		= 10;
	this._minOperande2		= 0;
	this._maxOperande2		= 10;

	initialiserMembres(parametres);
	
	function initialiserMembres(parametres) {		
		if (parametres) {
			if (parametres.parametres.operande1_min)
				that._minOperande1 = parseInt(parametres.parametres.operande1_min);

			if (parametres.parametres.operande1_max)
				that._maxOperande1 = parseInt(parametres.parametres.operande1_max);

			if (parametres.parametres.operande2_min)
				that._minOperande2 = parseInt(parametres.parametres.operande2_min);

			if (parametres.parametres.operande2_max)
				that._maxOperande2 = parseInt(parametres.parametres.operande2_max);
		}
	}
}

// H�ritage du prototype de la classe m�re.
EpvMultiplication.prototype = new EpvBaseClass();

/*
 * Description
 * 		Initialise le panneau de l'�preuve
 * Param�tres
 * 		id:			L'identifiant du div acceuillant la repr�sentation de l'�preuve.
 */
EpvMultiplication.prototype.initialiserEpreuve = function(id) {
	var that = this;
	
	$(id).html(	'<h1>Multiplication</h1>' +
				'<div id="EpvMultiplication_Question">' +
				'	Combien font' +
				'	<input type="text" id="EpvMultiplication_txtQuestion" readonly="true" />' +
				'</div>' +
				'<div id="EpvMultiplication_saisie">' +
				'	R&eacute;ponse :' +
				'	<input type="text" id="EpvMultiplication_txtSaisie" />' +
				'	<input type="submit" id="EpvMultiplication_validation" value="OK" />' +
				'</div>' +
				'</h1>');
	
	$("#EpvMultiplication_validation").click(function() {
		that.validationCallback();
	});

	$("#EpvMultiplication_txtSaisie").keyup(function(event){
		if (
				(event.keyCode == 13) &&
				($(this).val() != '')
			) {
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
EpvMultiplication.prototype.genererQuestion = function(nouvelleQuestion) {
	if (!nouvelleQuestion)
		return;

	$("#EpvMultiplication_txtSaisie").val("");
	$("#EpvMultiplication_txtQuestion").val("");

	var operande1 = Math.floor((this._maxOperande1 - this._minOperande1 + 1) * Math.random()) + this._minOperande1;
	var operande2 = Math.floor((this._maxOperande2 - this._minOperande2 + 1) * Math.random()) + this._minOperande2;
	$("#EpvMultiplication_txtQuestion").val(operande1 + " * " + operande2);
	
	$("#EpvMultiplication_txtSaisie").focus();
};

/*
 * Description
 * 		Valide la r�ponse � la question en fonction des donn�es fournies par le joueur.
 * Valeur de Retour
 * 		true :	La r�ponse est valide.
 * 		false : La r�ponse est erronn�e.
 */
EpvMultiplication.prototype.validerReponse = function() {
	return eval($("#EpvMultiplication_txtQuestion").val()) === eval($("#EpvMultiplication_txtSaisie").val());
};

/*
 * Description
 * 		Ajoute le panneau de configuration correspondant � l'�preuve.
 * Param�tres
 * 		id :	Identifiant du div dans lequel ajouter le panneau.
 */
EpvMultiplication.prototype.construirePanneauConfiguration = function() {
	return $('	<div id="EpvMultiplication_Configuration">' +
				'	<table>' +
				'		<tbody>' +
				'			<tr>' +
				'				<td>Minimum op&eacute;rande 1 : </td>' +
				'				<td><input type="number" id="EpvMultiplication_Configuration_MinOperande1" value="' + this._minOperande1 + '" /></td>' +
				'			</tr>' +
				'			<tr>' +
				'				<td>Maximum op&eacute;rande 1 : </td>' +
				'				<td><input type="number" id="EpvMultiplication_Configuration_MaxOperande1" value="' + this._maxOperande1 + '" /></td>' +
				'			</tr>' +
				'			<tr>' +
				'				<td>Minimum op&eacute;rande 2 : </td>' +
				'				<td><input type="number" id="EpvMultiplication_Configuration_MinOperande2" value="' + this._minOperande2 + '" /></td>' +
				'			</tr>' +
				'			<tr>' +
				'				<td>Maximum op&eacute;rande 2 : </td>' +
				'				<td><input type="number" id="EpvMultiplication_Configuration_MaxOperande2" value="' + this._maxOperande2 + '" /></td>' +
				'			</tr>' +
				'		</tbody>' +
				'	</table>' +
				'	</div>');
};

/*
 * Description
 *		Retourne les param�tres saisis dans le panneau de configuration de l'�preuve.
 */
EpvMultiplication.prototype.parametresEpreuve = function() {
	// R�cup�ration des donn�es dans le panneau de configuration
	this._minOperande1	= parseInt($("#EpvMultiplication_Configuration_MinOperande1").val());
	this._maxOperande1	= parseInt($("#EpvMultiplication_Configuration_MaxOperande1").val());
	this._minOperande2	= parseInt($("#EpvMultiplication_Configuration_MinOperande2").val());
	this._maxOperande2	= parseInt($("#EpvMultiplication_Configuration_MaxOperande2").val());
	
	return 	{
				"nom": this.NomEpreuve,
				"parametres": {
					"operande1_min": this._minOperande1,
					"operande1_max": this._maxOperande1,
					"operande2_min": this._minOperande2,
					"operande2_max": this._maxOperande2
				},
				"historique": {
				}
			};
};