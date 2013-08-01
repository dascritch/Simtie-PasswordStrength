QUnit.test( "Password Strength", function(assert) {
	var email = 'michel.subotkiewiez@example.com';

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

	assert.equal( 0, jQuery.fn.passStrength_.regex.hasAlphabet.test(''),'hasAlphabet');
	assert.equal( 0, jQuery.fn.passStrength_.regex.hasAlphabet.test('0123'),'hasAlphabet');
	assert.equal( 1, jQuery.fn.passStrength_.regex.hasAlphabet.test('01A23'),'hasAlphabet');

	assert.equal( 0, jQuery.fn.passStrength_.regex.has3numbers.test('abcd'),'has3numbers');
	assert.equal( 0, jQuery.fn.passStrength_.regex.has3numbers.test('ab1cd2'),'has3numbers');
	assert.equal( 1, jQuery.fn.passStrength_.regex.has3numbers.test('ab1cd2ef3'),'has3numbers');
	
	assert.equal( 0, jQuery.fn.passStrength_.regex.has2symbols.test('abcd'),'has2symbols');
	assert.equal( 0, jQuery.fn.passStrength_.regex.has2symbols.test('ab-cd'),'has2symbols');
	assert.equal( 1, jQuery.fn.passStrength_.regex.has2symbols.test('ab$cd!f'),'has2symbols');
	
	assert.equal( 0, jQuery.fn.passStrength_.regex.hasSwitchCase.test('abcd'),'hasSwitchCase');
	assert.equal( 0, jQuery.fn.passStrength_.regex.hasSwitchCase.test('ABCD'),'hasSwitchCase');
	assert.equal( 1, jQuery.fn.passStrength_.regex.hasSwitchCase.test('AbCD'),'hasSwitchCase');

	assert.equal( 0, jQuery.fn.passStrength_.regex.onlyNumbers.test('AbCD'),'onlyNumbers');
	assert.equal( 0, jQuery.fn.passStrength_.regex.onlyNumbers.test('AbC3'),'onlyNumbers');
	assert.equal( 1, jQuery.fn.passStrength_.regex.onlyNumbers.test('1234'),'onlyNumbers');
	
	assert.equal( 0, jQuery.fn.passStrength_.regex.onlyLetters.test('1234'),'onlyLetters');
	assert.equal( 0, jQuery.fn.passStrength_.regex.onlyLetters.test('AbC3'),'onlyLetters');
	assert.equal( 1, jQuery.fn.passStrength_.regex.onlyLetters.test('AbCD'),'onlyLetters');
	
	assert.equal( 0, jQuery.fn.passStrength_.regex.hasRepetition.test('1234'),'hasRepetition');
	assert.equal( 1, jQuery.fn.passStrength_.regex.hasRepetition.test('&&34'),'hasRepetition');
	assert.equal( 1, jQuery.fn.passStrength_.regex.hasRepetition.test('AbAb'),'hasRepetition');
	
	assert.equal( 0, jQuery.fn.passStrength_.test('',defaults) , 'mot de passe vide');
		
	assert.equal( passStrength.score("tes",defaults),			'shortPass',	'Mot de passe trop court.' );
	assert.equal( passStrength.score("mdpfaible",defaults),		'badPass',		'Mot de passe faible.' );
	assert.equal( passStrength.score("essai12micro",defaults),	'goodPass',		'Mot de passe juste correct.' );
	assert.equal( passStrength.score("A(*v_Tt6",defaults), 		'strongPass',	'Mot de passe Strong.' );
	assert.equal( passStrength.score(email,defaults),			'samePassword',	'Mot de passe = email' );
	assert.equal( passStrength.score(" ",defaults), 			'easterEgg',	'Oeuf de Paques' );


});
