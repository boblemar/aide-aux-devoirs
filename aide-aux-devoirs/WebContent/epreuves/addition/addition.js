/*
	"nom": "Léandre",
	"types": [
		{
			"nom": "addition",
			"parametres": {
				"operande1_max": "10",
				"operande2_max": "10"
			},
			"historique": {
			}
		}
*/

function EpvAddition(parametres, validationCallback) {
	var _nomEpreuve				= 'addition';
	var _validationCallback		= function() { validationCallback(); };
	var _plageOperande1 		= parametres.parametres.operande1_max;
	var _plageOperande2 		= parametres.parametres.operande2_max;	
	
	this.nomEpreuve				= function() { return _nomEpreuve; };
	
	initialiserMembres(parametres);
	
	function initialiserMembres(parametres) {
		if (parametres) {
			if (parametres.operande1_max)
				_plageOperande1 = parametres.operande1_max;

			if (parametres.operande2_max)
				_plageOperande2 = parametres.operande2_max;
		}
	}

	this.chargerDependances = function(baseRep) {
	};
	
	this.initialiserEpreuve = function(id) {
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
			_validationCallback();
		});

		$("#EpvAddition_txtSaisie").keyup(function(event){
			if (event.keyCode == 13) {
				_validationCallback();
			}
		});
	};

	this.genererQuestion = function(nouvelleQuestion) {
		if (!nouvelleQuestion)
			return;

		$("#EpvAddition_txtSaisie").val("");
		$("#EpvAddition_txtQuestion").val("");

		var operande1 = Math.floor(_plageOperande1 * Math.random());
		var operande2 = Math.floor(_plageOperande2 * Math.random());
		$("#EpvAddition_txtQuestion").val(operande1 + " + " + operande2);
		
		$("#EpvAddition_txtSaisie").focus();
	};
	
	this.validerReponse = function() {
		return eval($("#EpvAddition_txtQuestion").val()) === eval($("#EpvAddition_txtSaisie").val());
	};
	
	this.ajouterPanneauConfiguration = function(id) {
		$(id).append('	<div id="EpvAddition_Configuration">' +
					'		<h2>Addition</h2>' +
					'		Maximum op&eacute;rande 1 : ' +
					'		<input type="number" id="EpvAddition_Configuration_MaxOperande1" value="' + _plageOperande1 + '" />' +
					'		Maximum op&eacute;rande 2 : ' +
					'		<input type="number" id="EpvAddition_Configuration_MaxOperande2" value="' + _plageOperande2 + '" />' +
					'	</div>');
	};
	
	/*
		retourne les paramètres saisis dans le panneau de configuration de l'épreuve.
	*/
	this.parametresEpreuve = function() {
		// Récupération des données dans le panneau de configuration
		_plageOperande1	= $("#EpvAddition_Configuration_MaxOperande1").val();
		_plageOperande2	= $("#EpvAddition_Configuration_MaxOperande2").val();
		
		return 	{
					"nom": _nomEpreuve,
					"parametres": {
						"operande1_max": _plageOperande1,
						"operande2_max": _plageOperande2
					},
					"historique": {
					}
				};
	};
}