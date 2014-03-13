/*
 * Constructeur.
 */
function EpvAdditionATrous(parametres, validationCallback) {
	EpvBaseClass.call(this, parametres, validationCallback);
	
	this.NomEpreuve				= 'addition à trous';
	this.CheminsCss				= ['addition-a-trous.css'];
	
	this._tailleOperandes 		= 3;
	
	initialiserMembres(parametres);
	
	function initialiserMembres(parametres) {
		if (parametres) {
			if (parametres.parametres.taille_operandes)
				_tailleOperandes = eval(parametres.parametres.taille_operandes);
		}
	}
}

// Héritage du prototype de la classe mère.
EpvAdditionATrous.prototype = new EpvBaseClass();

/*
 * Description
 * 		Initialise le panneau de l'épreuve
 * Paramètres
 * 		id:			L'identifiant du div acceuillant la représentation de l'épreuve.
 */
EpvAdditionATrous.prototype.initialiserEpreuve = function(id) {
	var ligneOperande1	= '';
	var ligneOperande2	= '';
	var ligneResultat	= '';
	var ligneRetenue	= '';
	var that			= this;

	for (var i = _tailleOperandes ; i >= 0; i--) {
		if (i > 0) {
			ligneRetenue	+= '<td><input type="text" class="retenue saisie-utilisateur" id="EpvAdditionATrous_Retenue_Colonne' + i + '" /></td>';
		} else {
			ligneRetenue	+= '<td></td>';
		}
		
		if (i < _tailleOperandes) {
			ligneOperande1	+= '<td><input type="text" class="digit" id="EpvAdditionATrous_Operande1_Colonne' + i + '" readonly /></td>';
			ligneOperande2	+= '<td><input type="text" class="digit saisie-utilisateur" id="EpvAdditionATrous_Operande2_Colonne' + i + '" /></td>';
		} else {
			ligneOperande1	+= '<td></td>';
			ligneOperande2	+= '<td></td>';
		}
		
		ligneResultat	+= '<td><input type="text" class="digit" id="EpvAdditionATrous_Resultat_Colonne' + i + '" readonly /></td>';
	}

	ligneRetenue		= '<td></td>' + ligneRetenue;
	ligneOperande1		= '<td></td>' + ligneOperande1;
	ligneOperande2		= '<td>+</td>' + ligneOperande2;
	ligneResultat		= '<td>=</td>' + ligneResultat;
	

	$(id).html(	'<h1>Addition &agrave; trous</h1>' +
				'<div id="EpvAdditionATrous_Question">' +
				'	Compl&eacute;ter l\'addition &agrave; trous :' +
				'	<table>' +
				'		<thead>' +
				'			<tr>' + ligneRetenue + '</tr>' +
				'		</thead>' +
				'		<tbody>' +
				'			<tr>' + ligneOperande1 + '</tr>' +
				'			<tr>' + ligneOperande2 + '</tr>' +
				'			<tr class="resultat">' + ligneResultat + '</tr>' +
				'		</tbody>' +
				'		<tfoot>' +
				'			<tr>' +
				'				<td colspan="' + (_tailleOperandes + 2) + '"><input type="submit" id="EpvAdditionATrous_validation" value="OK" /></td>' +
				'			</tr>' +
				'		</tfoot>' +
				'	</table>' +
				'</div>');
	
	$("#EpvAdditionATrous_Operande2_Colonne0").focus();
	
	// Initialisation des événements
	$("#EpvAdditionATrous_validation").click(function() {
		that.validationCallback();
	}).keyup(function(event) {
		$("#EpvAdditionATrous_Operande2_Colonne0").focus();
	});

	for (var i = 0 ; i <= _tailleOperandes ; i++) {		
		if (i < _tailleOperandes) {
			$("#EpvAdditionATrous_Operande2_Colonne" + i).keyup(i, function(event){
				if (isNumericKeCode(event.keyCode))	{
					$("#EpvAdditionATrous_Retenue_Colonne" + (event.data + 1)).focus();
				} else if (isArrowUpKeyCode(event.keyCode)) {
					$("#EpvAdditionATrous_Retenue_Colonne" + event.data).focus();
				} else if (isArrowRightKeyCode(event.keyCode)) {
					$("#EpvAdditionATrous_Operande2_Colonne" + (event.data - 1)).focus();
				} else if (isArrowLeftKeyCode(event.keyCode)) {
					$("#EpvAdditionATrous_Operande2_Colonne" + (event.data + 1)).focus();
				} else if (isArrowDownKeyCode(event.keyCode)) {
					$("#EpvAdditionATrous_validation").focus();
				}
			}).focus(function() {
				this.select();
			});
		}

		if (i > 0) {
			$("#EpvAdditionATrous_Retenue_Colonne" + i).keyup(i, function(event){
				if (isNumericKeCode(event.keyCode))	{
					$("#EpvAdditionATrous_Operande2_Colonne" + event.data).focus();
				} else if (isArrowDownKeyCode(event.keyCode)) {
					$("#EpvAdditionATrous_Operande2_Colonne" + event.data).focus();
				} else if (isArrowRightKeyCode(event.keyCode)) {
					$("#EpvAdditionATrous_Retenue_Colonne" + (event.data - 1)).focus();
				} else if (isArrowLeftKeyCode(event.keyCode)) {
					$("#EpvAdditionATrous_Retenue_Colonne" + (event.data + 1)).focus();
				}
			}).focus(function() {
				this.select();
			});
		}
	}
};

/*
 * Description
 * 		Génère une question.
 * Paramètres
 * 		nouvelleQuestion:	Si false : réitère la question précédente.
 * 							Si true : génère une nouvelle question.
 */
EpvAdditionATrous.prototype.genererQuestion = function(nouvelleQuestion) {
	if (!nouvelleQuestion)
		return;

	for (var i = 0 ; i <= _tailleOperandes ; i++) {
		if (i > 0) {
			$("#EpvAdditionATrous_Retenue_Colonne" + i).val("");
		}
		
		if (i < _tailleOperandes) {
			$("#EpvAdditionATrous_Operande1_Colonne" + i).val("");
			$("#EpvAdditionATrous_Operande2_Colonne" + i).val("");
		}
		
		$("#EpvAdditionATrous_Resultat_Colonne" + i).val("");
	}
	
	var maxOperande = Math.pow(10, _tailleOperandes) - 1;

	var operande1	= Math.floor(maxOperande * Math.random());
	var resultat	= operande1 + Math.floor(maxOperande * Math.random());
	
	operande1		= operande1.toString();
	resultat		= resultat.toString();
	
	for (var i = 0 ; i < _tailleOperandes + 1 ; i++) {
		if (i <= operande1.length)
			$("#EpvAdditionATrous_Operande1_Colonne" + i).val(operande1.substring(operande1.length - i - 1, operande1.length - i));
		
		if (i <= resultat.length)
			$("#EpvAdditionATrous_Resultat_Colonne" + i).val(resultat.substring(resultat.length - i - 1, resultat.length - i));
	}
	
	$("#EpvAdditionATrous_Operande2_Colonne0").focus();
};

/*
 * Description
 * 		Valide la réponse à la question en fonction des données fournies par le joueur.
 * Valeur de Retour
 * 		true :	La réponse est valide.
 * 		false : La réponse est erronnée.
 */
EpvAdditionATrous.prototype.validerReponse = function() {
	var operande1	= '';
	var operande2	= '';
	var resultat	= '';
	var valeur;
	
	// Vérification du résultat
	for (var i = 0 ; i <= _tailleOperandes ; i++) {
		if (i < _tailleOperandes) {
			valeur		= $("#EpvAdditionATrous_Operande1_Colonne" + i).val();
			valeur		= valeur ? eval(valeur) : 0;
			operande1	= valeur + operande1;
			valeur		= $("#EpvAdditionATrous_Operande2_Colonne" + i).val();
			valeur		= valeur ? eval(valeur) : 0;
			operande2	= valeur + operande2;
		}
		
		valeur		= $("#EpvAdditionATrous_Resultat_Colonne" + i).val();
		valeur		= valeur ? eval(valeur) : 0;
		resultat	= valeur + resultat;
	}

	if (parseInt(operande1) + parseInt(operande2) != parseInt(resultat))
		return false;
	
	// Vérification des retenues
	for (var i = 0 ; i <= _tailleOperandes ; i++) {
		var valeurRetenue	= 0;
		var valeurOperande1	= 0;
		var valeurOperande2	= 0;
		var valeurResultat	= 0;
		var somme;
		
		if (i > 0) {
			valeur = $("#EpvAdditionATrous_Retenue_Colonne" + i).val();
			valeurRetenue = valeur ? eval(valeur) : 0;
		}
		
		if (i < _tailleOperandes) {
			valeur = eval($("#EpvAdditionATrous_Operande1_Colonne" + i).val());
			valeurOperande1 = valeur ? eval(valeur) : 0;
			valeur = eval($("#EpvAdditionATrous_Operande2_Colonne" + i).val());
			valeurOperande2 = valeur ? eval(valeur) : 0;
		}
		
		valeur = eval($("#EpvAdditionATrous_Resultat_Colonne" + i).val());
		valeurResultat = valeur ? eval(valeur) : 0;
		
		somme = valeurRetenue + valeurOperande1 + valeurOperande2;
		
		if (somme >= 10)
			somme = somme - 10;
		
		if (somme != valeurResultat)
			return false;
	}
	
	return true;
};
	
/*
 * Description
 * 		Construit le panneau de configuration correspondant à l'épreuve.
 * Valeur de retour
 * 		L'objet jquery contenant le panneau.
 */
EpvAdditionATrous.prototype.construirePanneauConfiguration = function() {
	return $('	<div id="EpvAdditionATrous_Configuration">' +
				'		Longueur des op&eacute;randes : ' +
				'		<input type="number" id="EpvAdditionATrous_Configuration_NbOperandes" value="' + _tailleOperandes + '" />' +
				'	</div>');
};
	
/*
 * Description
 *		Retourne les paramètres saisis dans le panneau de configuration de l'épreuve.
 */
EpvAdditionATrous.prototype.parametresEpreuve = function() {
	// Récupération des données dans le panneau de configuration
	_tailleOperandes	= parseInt($("#EpvAdditionATrous_Configuration_NbOperandes").val());

	return 	{
				"nom": this.NomEpreuve,
				"parametres": {
					"taille_operandes": this._tailleOperandes
				},
				"historique": {
				}
			};
};
