/*
 *  I18n.js
 *  =======
 *
 *  Simple localization util.
 *  1. Store your localized labels in json format: `localized-content.json`
 *  2. Write your markup with key references using `data-i18n` attributes.
 *  3. Explicitly invoke a traverse key resolver: `i18n.localize()`
 *     OR
 *     Change the language, and the contents will be refreshed: `i18n.lang('en')`
 *
 *  This util relies on jQuery to work. I would recommend using the latest version
 *  available (1.12.x or 2.1.4+), although this will probably run with any older
 *  version since it is only taking advantage of `$.getJSON()` and the jQuery
 *  selector function `$()`.
 * 
 *  © 2016 Diogo Simões - diogosimoes.com
 *
 */

var demoJson = {
	"demo": {
		"title": {
			"pt": "Exemplo de uso do i18n.js",
			"en": "Simple demo for i18n.js",
			"es": "¡Una cerveza por favor!"
		},
		"text": {
			"pt": "Este exemplo serve apenas para ilustrar os diferentes tipos de atributos de texto que podem ser localizados no cliente com a ajuda do i18n.js",
			"en": "This demo's only purpose is to show the different text attributes that can be localized with the help of i18n.js",
			"es": "Si i18n.js era español entonces sería de puta madre. Ahora así, la han cagado!"
		},
		"form": {
			"name": {
				"pt": "Zé dos Anzóis",
				"en": "John Doe",
				"es": "Fulano de Tal"
			},
			"email": {
				"pt": "zeanzois@email.org",
				"en": "johndoe@email.org",
				"es": "fulanotal@email.org"
			},
			"submit": {
				"pt": "Enviar",
				"en": "Send",
				"es": "¡Tío!"
			}
		}
	},
    "home": {
        "menu":{
            "home":{
                "en": "Home",
                "ct": "首頁"
            },
            "about":{
                "en": "About",
                "ct": "關於慶成"
            },
            "product":{
                "en": "Product",
                "ct": "產品介紹"
            },
            "contacts":{
                "en": "Contacts",
                "ct": "聯絡我們"
            }
        },
        "banner":{
            "a":{
                "title":{
                    "en": "Integrity, Diligence, Innovation",
                    "ct": "誠信、勤儉、革新"
                },
                "content":{
                    "en": "Since 1978, the accumulation of historical experience is the cornerstone of our company for many years.",
                    "ct": "自1978年以來的歷史經驗沉積，是本公司創業多年來的基石"
                },
                "button":{
                    "en": "more",
                    "ct": "更多介紹"
                }

            }
        },
        "container":{
            "title":{
                "white1":{
                    "en": " ",
                    "ct": "本公司最終以"
                },
                "green":{
                    "en": "quality and service first",
                    "ct": "品質第一、服務至上"
                },
                "white2":{
                    "en": " ",
                    "ct": "之基本經營理念"
                },
            },
            "text":{
                "en":"The company specializes in the production of car fans, car electric heating cars and defoggers for more than 40 years. The company adheres to step by step to meet the real needs of customers.",
                "ct":"本公司為專業生產汽車電扇、汽車電暖氣及汽車用除霧器已經有40多年歷史了，本公司秉持一步一腳印，以滿足客戶真正之需求。"
            }
        }
    },
    "product": {
        "type":{
            "all":{
                "en": "All",
                "ct": "全部"
            }
        },
        "list":{
            "en": "Product List",
            "ct": "產品列表"
        },
        "name":{
            "en": "汽車強力風扇",
            "ct": "汽車強力風扇"
        }
    }
};

(function () {
	this.I18n = function (defaultLang) {
		var lang = defaultLang || 'en';
		this.language = lang;

		(function (i18n) {
			i18n.contents = demoJson;
			i18n.contents.prop = function (key) {
				var result = this;
				var keyArr = key.split('.');
				for (var index = 0; index < keyArr.length; index++) {
					var prop = keyArr[index];
					result = result[prop];
				}
				return result;
			};
			i18n.localize();
		})(this);
	};

	this.I18n.prototype.hasCachedContents = function () {
		return this.contents !== undefined;
	};

	this.I18n.prototype.lang = function (lang) {
		if (typeof lang === 'string') {
			this.language = lang;
		}
		this.localize();
		return this.language;
	};

	this.I18n.prototype.localize = function () {
		var contents = this.contents;
		if (!this.hasCachedContents()) {
			return;
		}
		var dfs = function (node, keys, results) {
			var isLeaf = function (node) {
				for (var prop in node) {
					if (node.hasOwnProperty(prop)) {
						if (typeof node[prop] === 'string') {
							return true;
						}
					}
				}
			}
			for (var prop in node) {
				if (node.hasOwnProperty(prop) && typeof node[prop] === 'object') {
					var myKey = keys.slice();
					myKey.push(prop);
					if (isLeaf(node[prop])) {
						//results.push(myKey.reduce((prev, current) => prev + '.' + current));	//not supported in older mobile broweser
						results.push(myKey.reduce( function (previousValue, currentValue, currentIndex, array) {
							return previousValue + '.' + currentValue;
						}));
					} else {
						dfs(node[prop], myKey, results);
					}
				}
			}
			return results;
		};
		var keys = dfs(contents, [], []);
		for (var index = 0; index < keys.length; index++) {
			var key = keys[index];
			if (contents.prop(key).hasOwnProperty(this.language)) {
				$('[data-i18n="'+key+'"]').text(contents.prop(key)[this.language]);
				$('[data-i18n-placeholder="'+key+'"]').attr('placeholder', contents.prop(key)[this.language]);
				$('[data-i18n-value="'+key+'"]').attr('value', contents.prop(key)[this.language]);
			} else {
				$('[data-i18n="'+key+'"]').text(contents.prop(key)['en']);
				$('[data-i18n-placeholder="'+key+'"]').attr('placeholder', contents.prop(key)['en']);
				$('[data-i18n-value="'+key+'"]').attr('value', contents.prop(key)['en']);
			}
		}
	};

}).apply(window);

$( document ).ready( function () {

	var i18n = new I18n();
	i18n.localize();
	$('.lang-picker #english').addClass('selected');
	
	$('.lang-picker #taiwan').on('click', function () {
		i18n.lang('ct');
		selectLang($(this));
	})
	$('.lang-picker #english').on('click', function () {
		i18n.lang('en');
		selectLang($(this));
	})
	$('.lang-picker #spanish').on('click', function () {
		i18n.lang('es');
		selectLang($(this));
	})

	function selectLang (picker) {
		$('.lang-picker li').removeClass('selected');
		picker.addClass('selected');
	}
});
