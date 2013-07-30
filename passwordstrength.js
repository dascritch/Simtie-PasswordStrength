/**
 * password_strength_plugin.js
 * GPL and Diesel (c) 2013 Michel Subotkiewiez, Xavier "DaScritch" Mouton-Dubosc for Notalus
 *   inspired from works by Darren Mason (djmason9@gmail.com),
 *   himself derivating from Firas Kassem orginal plugin - http://phiras.wordpress.com/2007/04/08/password-strength-meter-a-jquery-plugin/
 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Michel Subotkiewiez (subotm@gmail.com) http://lbc2rss.superfetatoire.com
 * @author Xavier Mouton-Dubosc (xaviermd@gmail.com) http://dascritch.com
 * @date 01/03/2013
 * @version 2.0.1
 * 
 * @requires jquery.js (tested with 1.9)
 * @param shortPass:  "shortPass",	//optional
 * @param badPass:		"badPass",		//optional
 * @param goodPass:		"goodPass",		//optional
 * @param strongPass:	"strongPass",	//optional
 * @param baseStyle:	"testresult",	//optional
 * @param userId:		"",				//required override
 * @param messageloc:	1				//before == 0 or after == 1
 * 
*/

(function(jQuery){ 

jQuery.fn.extend({
	
	passStrength_ : { 
		defaults : {},
		regex :	{
			has3numbers			: /(.*\d){3}/g, // /(.*[0-9].*[0-9].*[0-9])/,
			has2symbols			: /(.*[^a-zA-Z0-9]){2}/, // /(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/,
			hasSwitchCase		: /([a-z].*[A-Z])|([A-Z].*[a-z])/,
			hasAlphabet			: /[a-zA-Z]/g,
			hasLowerCase		: /[a-z]/g, 
			hasUpperCase		: /[A-Z]/g, 
			hasNumbers			: /\d/g, // /([0-9])/
			hasSymbols			: /[^a-zA-Z0-9]/g,
			onlyNumbers			: /^\d+$/,
			onlyLetters			: /^\d+$/,
			hasRepetition		: /(.+)\1+/gi,
			hasDoubleRepetition	: /(.)(.).*\1\2/,
			hasRepeatCharacter	: /(.)\1/i
		},
		matches : function(password, regexp) {
			var matches = password.match(regexp);
			return matches===null ? 0 : matches.length;
		},
		test : function(password,option) {
			var score			= 0; 
			var typeresult		= false;
			var nSymbols		= 0;
			var passwordLength	= password.length;

			// Number of Characters : +(n*4) 	
			score += passwordLength * 4;

			// each symbol : +6
			score += this.matches(password,this.regex.hasSymbols) * 6;


			// each upperCase : + (password length - number of uppercase) * 2
			var upperCaseLength = this.matches(password,this.regex.hasUpperCase);
			score += (upperCaseLength===0)?0:((passwordLength-upperCaseLength) * 2);


			// each lowerCase : + (password length - number of lowercase) * 2
			var lowerCaseLength = this.matches(password,this.regex.hasLowerCase);
			score += (lowerCaseLength===0)?0:((passwordLength-lowerCaseLength) * 2);


			//each number : +1
			score += this.matches(password,this.regex.hasNumbers)*4;


			// Letter only : -length
			if (this.regex.onlyLetters.test(password)) {
				score -= password.length;
			}

			// Number only : -length
			if (this.regex.onlyNumbers.test(password)) {
				score -= password.length*2;
			}

			// each repeating : -3*length
			var repeat = password.match(this.regex.hasRepetition);

			if (repeat!==null) {
				var len = repeat.length - 1;
				for (var idx = len; idx>=0; idx--) {
					score -= repeat[idx].length * 3;
				};
			}

			//verifying 0 < score < 100
			if ( score < 0 ) {
				score = 0;
			}
			if ( score > 100 ) {
				score = 100;
			}

			// minimal length
			if (password.length < option.constraint.minLength ) {
				score = 0;
			}

			// easter egg
			if (password===' ') {
				score = -1;
			}

			// identifiant
			if (password===option.userId) {
				score = -2;
			}

			return score;
		},
		score2Class : function(score,option) {
			var level = 'badPass'; 

			for (var line in option.scores) {
				if (option.scores[line] <= score) {
					level = line;
				}
			}
			if (score === -2) {
				level = 'samePassword';
			}
			if (score === -1) {
				level = 'easterEgg';
			}
			if (score === 0) {
				level = 'shortPass';
			}

			return level;  // this.classes[typeresult];
		},
		score : function(password , option) {
			return jQuery.fn.passStrength_.score2Class(
					jQuery.fn.passStrength_.test(password,option)
					,option);
		},
		
		checkRepetition : function(pLen,str) {
			var res = '';
			for (var i=0; i<str.length ; i++ ) 
			{
				var repeated=true;
				
				for (var j=0;j < pLen && (j+i+pLen) < str.length;j++){
					repeated = repeated && (str.charAt(j+i)==str.charAt(j+i+pLen));
					}
				if (j<pLen){repeated=false;}
				if (repeated) {
					i+=pLen-1;
					repeated=false;
				}
				else {
					res+=str.charAt(i);
				}
			}
			return res;
		},
		ev : function() {
			var $this = $(this);
			var option = $this.data('passStrength');
			var value = this.value;
			if (value==='') {
				option.el.hide();
				if (this.setCustomValidity !== undefined) {
					this.setCustomValidity('');
				}
				return ;
			}
			var typeresult = jQuery.fn.passStrength_.score(value,option);

			if (option.debug) {
				console.log(typeresult,' ← ',jQuery.fn.passStrength_.test(value,option),' ← « ',value,' » ');
			}
			if (this.setCustomValidity  !== undefined) {
				this.setCustomValidity(option.accept[typeresult] ? ''	: option.messages[typeresult]);
			}
			option.el.
				show().
				removeClass().
				addClass(option.classes.baseStyle+ ' ' +option.classes[typeresult]).
				html(option.messages[typeresult]);
		}
	},
	
	passStrength : function(options) {  
		 var defaults = {
				scores : {
					badPass			:	33,				//optional
					goodPass		:	47,				//optional
					strongPass		:	100				//optional
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
					samePassword	:	"Username and password identical." 	//optional
				},
				accept : {
					shortPass		:	false,		//optional
					badPass			:	true,		//optional
					goodPass		:	true,		//optional
					strongPass		:	true,		//optional
					samePassword	:	false,		//optional
					easterEgg		:	false		//optional
				},
				userId		: "",				//required override
				messageloc	: 1,				//before	== 0 or after == 1
				debug		: false,
				constraint	: {
					minLength	: 8,	//optional
					dictionnary	: [] 	//optional
				}
			}; 
			
		var opts = jQuery.extend(defaults, options);  
		opts.el = $('<span>',{'class' : opts.classes.baseStyle});
		
		if (opts.messageloc === 1) {
			this.after(opts.el);
		} else {
			this.before(opts.el);
		}
		
		this.data('passStrength',opts);
		this.off('keyup');
		this.on('keyup',jQuery.fn.passStrength_.ev)
		
		return this;
		
	}
});
	
})(jQuery); 
