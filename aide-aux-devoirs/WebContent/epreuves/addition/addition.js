/*
 * Constructeur.
 */
function EpvAddition(parametres, validationCallback) {
	EpvBaseClass.call(this, parametres, validationCallback);
	
	var that					= this;
	
	this.NomEpreuve				= 'addition';
	this.CheminsCss				= [];
	
	this._minOperande1	= 1;
	this._maxOperande1	= 10;
	this._minOperande2	= 1;
	this._maxOperande2	= 10;

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

// Héritage du prototype de la classe mère.
EpvAddition.prototype = new EpvBaseClass();

/*
 * Description
 * 		Initialise le panneau de l'épreuve
 * Paramètres
 * 		id:			L'identifiant du div acceuillant la représentation de l'épreuve.
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
 * 		Génère une question.
 * Paramètres
 * 		nouvelleQuestion:	Si false : réitère la question précédente.
 * 							Si true : génère une nouvelle question.
 */
EpvAddition.prototype.genererQuestion = function(nouvelleQuestion) {
	if (!nouvelleQuestion)
		return;

	$("#EpvAddition_txtSaisie").val("");
	$("#EpvAddition_txtQuestion").val("");

	var operande1 = Math.floor((this._maxOperande1 - this._minOperande1 + 1) * Math.random()) + this._minOperande1;
	var operande2 = Math.floor((this._maxOperande2 - this._minOperande2 + 1) * Math.random()) + this._minOperande2;
	
	$("#EpvAddition_txtQuestion").val(operande1 + " + " + operande2);
	
	$("#EpvAddition_txtSaisie").focus();
};

/*
 * Description
 * 		Valide la réponse à la question en fonction des données fournies par le joueur.
 * Valeur de Retour
 * 		true :	La réponse est valide.
 * 		false : La réponse est erronnée.
 */
EpvAddition.prototype.validerReponse = function() {
	return eval($("#EpvAddition_txtQuestion").val()) === eval($("#EpvAddition_txtSaisie").val());
};

/*
 * Description
 * 		Ajoute le panneau de configuration correspondant à l'épreuve.
 * Paramètres
 * 		id :	Identifiant du div dans lequel ajouter le panneau.
 */
EpvAddition.prototype.construirePanneauConfiguration = function() {
	return $('	<div id="EpvAddition_Configuration">' +
				'	<table>' +
				'		<tbody>' +
				'			<tr>' +
				'				<td>Minimum op&eacute;rande 1 : </td>' +
				'				<td><input type="number" id="EpvAddition_Configuration_MinOperande1" value="' + this._minOperande1 + '" /></td>' +
				'			</tr>' +
				'			<tr>' +
				'				<td>Maximum op&eacute;rande 1 : </td>' +
				'				<td><input type="number" id="EpvAddition_Configuration_MaxOperande1" value="' + this._maxOperande1 + '" /></td>' +
				'			</tr>' +
				'			<tr>' +
				'				<td>Minimum op&eacute;rande 2 : </td>' +
				'				<td><input type="number" id="EpvAddition_Configuration_MinOperande2" value="' + this._minOperande2 + '" /></td>' +
				'			</tr>' +
				'			<tr>' +
				'				<td>Maximum op&eacute;rande 2 : </td>' +
				'				<td><input type="number" id="EpvAddition_Configuration_MaxOperande2" value="' + this._maxOperande2 + '" /></td>' +
				'			</tr>' +
				'		</tbody>' +
				'	</table>' +
				'	</div>');
};

/*
 * Description
 *		Retourne les paramètres saisis dans le panneau de configuration de l'épreuve.
 */
EpvAddition.prototype.parametresEpreuve = function() {
	// Récupération des données dans le panneau de configuration
	this._minOperande1	= parseInt($("#EpvAddition_Configuration_MinOperande1").val());
	this._maxOperande1	= parseInt($("#EpvAddition_Configuration_MaxOperande1").val());
	this._minOperande2	= parseInt($("#EpvAddition_Configuration_MinOperande2").val());
	this._maxOperande2	= parseInt($("#EpvAddition_Configuration_MaxOperande2").val());
	
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