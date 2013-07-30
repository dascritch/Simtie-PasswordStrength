QUnit.test( "Password Strength", function(assert) {
  var email = 'michel.subotkiewiez@notalus.fr';

	var passStrength = jQuery.fn.passStrength_;

	var defaults = {
				scores : {
					badPass			:	33,				//optional
					goodPass		:	67,				//optional
					strongPass		:	100,			//optional
				},
				classes : {
					shortPass		:	"shortPass",	//optional
					badPass			:	"badPass",		//optional
					goodPass		:	"goodPass",		//optional
					strongPass		:	"strongPass",	//optional
					samePassword	:	"badPass",		//optional
					baseStyle		:	"testresult",	//optional
					easterEgg		:	"shortPass"		//optional
				},
				messages : {
					shortPass		: 	"Too short",	//optional
					badPass			:	"Weak",			//optional
					goodPass		:	"Good",			//optional
					strongPass		:	"Strong",		//optional
					easterEgg		:	"Sorry, but your password must contain an uppercase letter, a number, a haiku, a gang sign, a hieroglyph, and the blood of a virgin.", //optional
					samePassword	:	"Username and Password identical." 	//optional
				},
				userId		: email,				//required override
				messageloc	: 1,				//before	== 0 or after == 1
				constraint	: {
					minLength	: 8,	//optional
					dictionnary	: [], 	//optional
				}

			}; 

	assert.equal( 0, jQuery.fn.passStrength_.regex.hasAlphabet.test(''));
	assert.equal( 0, jQuery.fn.passStrength_.regex.hasAlphabet.test('0123'));
	assert.equal( 1, jQuery.fn.passStrength_.regex.hasAlphabet.test('01A23'));
			
	assert.equal( 0, jQuery.fn.passStrength_.test('',defaults) , 'mot de passe vide');
		
	assert.equal( passStrength.score("tes",defaults),			'shortPass',	'Mot de passe trop court.' );
	assert.equal( passStrength.score("mdpfaible",defaults),		'badPass',		'Mot de passe faible.' );
	assert.equal( passStrength.score("essai12micro",defaults),	'goodPass',		'Mot de passe juste correct.' );
	assert.equal( passStrength.score("A(*v_Tt6",defaults), 		'strongPass',	'Mot de passe Strong.' );
	assert.equal( passStrength.score(email,defaults),			'samePassword',	'Mot de passe = email' );
	assert.equal( passStrength.score(" ",defaults), 			'easterEgg',	'Oeuf de Paques' );


});
