/**
 *                  ___________       __            __
 *                  \__    ___/____ _/  |_ _____   |  |
 *                    |    |  /  _ \\   __\\__  \  |  |
 *                    |    | |  |_| ||  |   / __ \_|  |__
 *                    |____|  \____/ |__|  (____  /|____/
 *                                              \/
 *          ___          __                                   __
 *         |   |  ____ _/  |_   ____ _______   ____    ____ _/  |_
 *         |   | /    \\   __\_/ __ \\_  __ \ /    \ _/ __ \\   __\
 *         |   ||   |  \|  |  \  ___/ |  | \/|   |  \\  ___/ |  |
 *         |___||___|  /|__|   \_____>|__|   |___|  / \_____>|__|
 *                  \/                           \/
 *                  ________
 *                 /  _____/_______   ____   __ __ ______
 *                /   \  ___\_  __ \ /  _ \ |  |  \\____ \
 *                \    \_\  \|  | \/|  |_| ||  |  /|  |_| |
 *                 \______  /|__|    \____/ |____/ |   __/
 *                        \/                       |__|
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Creative Commons License.
 * It is available through the world-wide-web at this URL:
 * http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 * If you are unable to obtain it through the world-wide-web, please send an email
 * to servicedesk@tig.nl so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this module to newer
 * versions in the future. If you wish to customize this module for your
 * needs please contact servicedesk@tig.nl for more information.
 *
 * @copyright   Copyright (c) Total Internet Group B.V. https://tig.nl/copyright
 * @license     http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 */

/**
 * Make sure the console is available. If not, create a dummy function.
 */
if (typeof console === "undefined"){
    console={};
    console.log = function(){};
    console.info = function(){};
}

/**
 * Make sure the magento translator is available. If not, create a dummy function.
 */
if (typeof Translator == 'undefined' && typeof Translate === 'function') {
    Translator = new Translate();
} else if (typeof Translator == 'undefined') {
    var Translate = Class.create();
    Translate.prototype = {
        initialize : function() {},

        translate : function(text) {
            return text;
        }
    };

    Translator = new Translate();
}

/**
 * Add the option to trigger HTML events on elements.
 */
if (typeof Element.triggerEvent == 'undefined') {
    Element.prototype.triggerEvent = function (eventName) {
        if (document.createEvent) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(eventName, true, true);

            return this.dispatchEvent(evt);
        }

        if (this.fireEvent)
            return this.fireEvent('on' + eventName);
    };
}

/**
 * Add the 'trim' method to strings for browsers that do not natively support this method.
 */
if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

/**
 * Add a 'indexOf' method to arrays.
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    };
}

/**
 * Diacritcs for normalizer methods
 */
var diacriticsMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C4\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OE','letters':/[\u00D6\u0152]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'UE','letters':/[\u00DC]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E4\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oe','letters': /[\u00F6\u0153]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'ss','letters':/[\u00DF]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'ue','letters':/[\u00FC]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
];


/**
 * Add a 'formatMoney' method to numbers.
 */
if (!Number.prototype.formatMoney) {
    Number.prototype.formatMoney = function(c, d, t){
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d == undefined ? "." : d;
        t = t == undefined ? "," : t;
        var n = this,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }
}

/**
 * PostNL delivery options logic class.
 *
 * Uses AJAX to communicate with PostNL and retrieve possible delivery options. This class also manages all available
 * options.
 */
var PostnlDeliveryOptions = Class.create();
PostnlDeliveryOptions.prototype = {
    isActive                 : false,

    options                  : {},
    weekdays                 : [],
    datesProcessed           : [],
    cutOffTimes              : {},

    saveUrl                  : null,
    timeframesUrl            : null,
    locationsUrl             : null,
    locationsInAreaUrl       : null,

    postcode                 : null,
    housenumber              : null,
    street                   : null,
    city                     : null,
    country                  : null,
    fullAddress              : null,
    deliveryDate             : null,
    pickupDate               : null,
    imageBaseUrl             : null,

    pgLocation               : false,
    pgeLocation              : false,
    paLocation               : false,

    timeframes               : false,
    locations                : [],
    parsedTimeframes         : false,
    parsedLocations          : false,

    selectedOption           : false,
    selectedType             : false,
    lastSelectedOption       : false,
    lastSelectedType         : false,
    paPhoneCheckPassed       : false,

    deliveryOptionsMap       : false,

    extraCosts               : 0,

    timeframeRequest         : false,
    locationsRequest         : false,
    saveOptionCostsRequest   : false,
    savePaPhoneNumberRequest : false,

    /**
     * Constructor method.
     *
     * @constructor
     *
     * @param {{}}      params
     * @param {{}}      options
     * @param {boolean} debug
     *
     * @returns {void}
     */
    initialize : function(params, options, debug) {
        if (!params.saveUrl
            || !params.timeframesUrl
            || !params.locationsUrl
            || !params.locationsInAreaUrl
            || !params.postcode
            || !params.housenumber
            || !params.street
            || !params.city
            || !params.country
            || !params.deliveryDate
            || !params.pickupDate
            || !params.imageBaseUrl
            || !params.fullAddress
        ) {
            throw 'Missing parameters.';
        }

        this.reset();

        this.saveUrl            = params.saveUrl;
        this.timeframesUrl      = params.timeframesUrl;
        this.locationsUrl       = params.locationsUrl;
        this.locationsInAreaUrl = params.locationsInAreaUrl;
        this.postcode           = params.postcode;
        this.housenumber        = params.housenumber;
        this.street             = params.street;
        this.city               = params.city;
        this.country            = params.country;
        this.deliveryDate       = params.deliveryDate;
        this.pickupDate         = params.pickupDate;
        this.imageBaseUrl       = params.imageBaseUrl;
        this.fullAddress        = params.fullAddress;
        this.cutOffTimes        = params.cutOffTimes;

        this.options = Object.extend({
            isOsc                     : false,
            oscSaveButton             : 'close_options_popup_btn',
            oscOptionsPopup           : 'postnl_delivery_options',
            disableCufon              : false,
            allowDeliveryDays         : true,
            allowTimeframes           : true,
            allowEveningTimeframes    : false,
            allowFallBackTimeFrame    : true,
            allowPg                   : true,
            allowPge                  : false,
            allowPa                   : true,
            allowSundaySorting        : false,
            isBuspakje                : false,
            taxDisplayType            : 1,
            eveningFeeIncl            : 0,
            eveningFeeExcl            : 0,
            sundayFeeIncl             : 0,
            sundayFeeExcl             : 0,
            sameDayFeeIncl            : 0,
            sameDayFeeExcl            : 0,
            expressFeeIncl            : 0,
            expressFeeExcl            : 0,
            eveningFeeText            : '',
            sundayFeeText             : '',
            sameDayFeeText            : '',
            expressFeeText            : '',
            allowStreetview           : true,
            scrollbarContainer        : 'scrollbar_content',
            scrollbarTrack            : 'scrollbar_track',
            loaderDiv                 : 'initial_loader',
            locationsLoader           : 'locations_loader',
            responsiveLocationsLoader : 'responsive_locations_loader',
            searchField               : 'search_field',
            searchErrorDiv            : 'search_error_message',
            optionsContainer          : 'postnl_delivery_options',
            pgLocationContainer       : 'pglocation',
            pgeLocationContainer      : 'pgelocation',
            paLocationContainer       : 'palocation',
            timeframesContainer       : 'timeframes',
            addPhoneContainer         : 'postnl_add_phonenumber',
            currencySymbol            : '€',
            shippingMethodName        : 's_method_postnl_flatrate',
            postnlShippingMethods     : [
                's_method_postnl_tablerate',
                's_method_postnl_flatrate',
                's_method_postnl_matrixrate'
            ],
            extraOptions              : {},
            getLocationsTimeout       : 5,
            getTimeframesTimeout      : 5
        }, options || {});

        this.debug = debug;

        var weekdays = new Array(7);
        weekdays[0] = Translator.translate('Su');
        weekdays[1] = Translator.translate('Mo');
        weekdays[2] = Translator.translate('Tu');
        weekdays[3] = Translator.translate('We');
        weekdays[4] = Translator.translate('Th');
        weekdays[5] = Translator.translate('Fr');
        weekdays[6] = Translator.translate('Sa');

        this.weekdays = weekdays;

        this.registerObservers();
    },

    /******************************
     *                            *
     *  GETTER AND SETTER METHODS *
     *                            *
     ******************************/

    getOptions : function() {
        return this.options;
    },

    getWeekdays : function() {
        return this.weekdays;
    },

    getDatesProcessed : function() {
        return this.datesProcessed;
    },

    getSaveUrl : function() {
        return this.saveUrl;
    },

    getTimeframesUrl : function() {
        return this.timeframesUrl;
    },

    getLocationsUrl : function() {
        return this.locationsUrl;
    },

    getLocationsInAreaUrl : function() {
        return this.locationsInAreaUrl;
    },

    getPostcode : function() {
        return this.postcode;
    },

    getHousenumber : function() {
        return this.housenumber;
    },

    getStreet : function() {
        return this.street;
    },

    getCity : function() {
        return this.city;
    },

    getCountry : function() {
        return this.country;
    },


    getFullAddress : function() {
        return this.fullAddress;
    },

    getDeliveryDate : function() {
        return this.deliveryDate;
    },

    getPickupDate : function() {
        return this.pickupDate;
    },

    getImageBasUrl : function() {
        return this.imageBaseUrl;
    },

    getPgLocation : function() {
        return this.pgLocation;
    },

    setPgLocation : function(location) {
        this.pgLocation = location;

        return this;
    },

    getPgeLocation : function() {
        return this.pgeLocation;
    },

    setPgeLocation : function(location) {
        this.pgeLocation = location;

        return this;
    },

    getPaLocation : function() {
        return this.paLocation;
    },

    setPaLocation : function(location) {
        this.paLocation = location;

        return this;
    },

    setTimeframes : function(timeframes) {
        this.timeframes = timeframes;

        return this;
    },

    setLocations : function(locations) {
        this.locations = locations;

        return this;
    },

    getParsedLocations : function() {
        return this.parsedLocations;
    },

    setParsedTimeframes : function(parsedTimeframes) {
        this.parsedTimeframes = parsedTimeframes;

        return this;
    },

    getParsedTimeframes : function() {
        return this.parsedTimeframes;
    },

    setParsedLocations : function(parsedLocations) {
        this.parsedLocations = parsedLocations;

        return this;
    },

    getSelectedOption : function() {
        return this.selectedOption;
    },

    setSelectedOption : function(option) {
        var fire = false;
        if (this.getSelectedOption() !== option) {
            fire = true;
        }

        this.selectedOption = option;

        if (fire) {
            document.fire('postnl:selectedOptionChange');
        }

        return this;
    },

    getSelectedType : function() {
        return this.selectedType;
    },

    setSelectedType : function(type) {
        var fire = false;
        if (this.getSelectedType() !== type) {
            fire = true;
        }

        this.selectedType = type;

        if (fire) {
            document.fire('postnl:selectedTypeChange');
        }
        return this;
    },

    getLastSelectedOption : function() {
        return this.lastSelectedOption;
    },

    setLastSelectedOption : function(option) {
        this.lastSelectedOption = option;

        return this;
    },

    getLastSelectedType : function() {
        return this.lastSelectedType;
    },

    setLastSelectedType : function(type) {
        this.lastSelectedType = type;

        return this;
    },

    getPaPhoneCheckPassed : function() {
       return this.paPhoneCheckPassed;
    },

    setPaPhoneCheckPassed : function(passed) {
        this.paPhoneCheckPassed = passed;

        return this;
    },

    getDeliveryOptionsMap : function() {
        return this.deliveryOptionsMap;
    },

    getIsBuspakje : function() {
        return this.options.isBuspakje;
    },

    /*
     * Get the name of an image file for the specified location name.
     *
     * @param {string} name
     *
     * @returns {string}
     */
    getImageName : function(name) {
        var imageName = '';
        switch(name) {
            case 'Albert Heijn':
                imageName = 'albertheijn';
                break;
            case 'Bruna':
                imageName = 'bruna';
                break;
            case 'C1000':
                imageName = 'c1000';
                break;
            case 'Coop':
            case 'CoopCompact':
                imageName = 'coop';
                break;
            case 'PostNL':
                imageName = 'default';
                break;
            case 'Emté supermarkt':
                imageName = 'emte';
                break;
            case 'Jumbo':
                imageName = 'jumbo';
                break;
            case 'Plus':
                imageName = 'plus';
                break;
            case 'Primera':
                imageName = 'primera';
                break;
            case 'The Read Shop':
                imageName = 'readshop';
                break;
            case 'Spar':
                imageName = 'spar';
                break;
            case 'Staples Office Centre':
                imageName = 'staples';
                break;
            case 'Gamma':
                imageName = 'gamma';
                break;
            case 'Karwei':
                imageName = 'karwei';
                break;
            case 'automaat':
                imageName = 'automaat';
                break;
            default:
                imageName = 'default';
                break;
        }

        return imageName;
    },

    /**
     * Reset all parameters to their default values.
     *
     * @returns {PostnlDeliveryOptions}
     */
    reset : function() {
        this.isActive = false;

        if (this.debug) {
            console.info('Resetting delivery options.');
        }

        this.datesProcessed   = [];
        this.pgLocation       = false;
        this.pgeLocation      = false;
        this.paLocation       = false;
        this.timeframes       = false;
        this.locations        = [];
        this.parsedTimeframes = false;
        this.parsedLocations  = false;
        this.selectedOption   = false;

        document.stopObserving('postnl:saveDeliveryOptions');
        document.stopObserving('postnl:domModified');
        document.stopObserving('postnl:selectedTypeChange');

        if (this.getOptions().isOsc && this.getOptions().oscSaveButton && $(this.getOptions().oscSaveButton)) {
            var saveButton = $(this.getOptions().oscSaveButton);
            saveButton.stopObserving('click');
        }

        return this;
    },

    /**
     * Register observers.
     *
     * @returns {PostnlDeliveryOptions}
     */
    registerObservers : function() {
        $$('#checkout-shipping-method-load input[type="radio"]').each(function(element) {
            element.observe('click', function(element) {
                var shippingMethods = this.getOptions().postnlShippingMethods;

                for (var i = 0; i < shippingMethods.length; i++) {
                    if (element.identify() == shippingMethods[i]) {
                        if (!this.getSelectedOption() && this.getParsedTimeframes()) {
                            if (this.getLastSelectedType() == 'Avond' || this.getLastSelectedType() == 'Overdag') {
                                this.selectTimeframe(this.getLastSelectedOption().getElement());
                            } else if (this.getLastSelectedType()) {
                                this.selectLocation(
                                    this.getLastSelectedOption().getElements()[this.getLastSelectedType()]
                                );
                            } else {
                                if (this.timeframes[0].getType() != 'Sameday') {
                                    this.selectTimeframe(this.timeframes[0].element);
                                } else {
                                    this.selectTimeframe(this.timeframes[1].element);
                                }
                            }
                        }
                        return;
                    }
                }

                this.unSelectOptions();
                this.updateShippingPrice();
            }.bind(this, element));
        }.bind(this));

        document.observe('postnl:domModified', this.reinitCufon.bind(this));

        if (this.getOptions().isOsc && this.getOptions().oscSaveButton) {
            var saveButton = $(this.getOptions().oscSaveButton);
            saveButton.observe('click', this.saveOscOptions.bind(this));
        }

        document.observe('postnl:selectedTypeChange', function() {
            var extraOptions = this.options.extraOptions;
            if (!extraOptions) {
                return;
            }

            $H(extraOptions).each(function(option) {
                var params = option.value;
                var selectedType = this.getSelectedType();

                if (params.allowedTypes.indexOf(selectedType) < 0) {
                    params.element.checked = false;
                    params.element.disabled = true;
                } else {
                    params.element.disabled = false;
                }
            }.bind(this));
        }.bind(this));

        return this;
    },

    /**
     * Checks if a specified location type is allowed.
     *
     * @param {string} type
     *
     * @returns {boolean}
     */
    isTypeAllowed : function(type) {
        var isAllowed = false;
        switch (type) {
            case 'PG':
                isAllowed = this.isPgAllowed();
                break;
            case 'PGE':
                isAllowed = this.isPgeAllowed();
                break;
            case 'PA':
                isAllowed = this.isPaAllowed();
                break;
            case 'timeframes':
                isAllowed = this.isTimeframesAllowed();
                break;
            case 'EveningTimeframes':
                isAllowed = this.isEveningTimeframesAllowed();
                break;
        }

        return isAllowed;
    },

    /**
     * Check if PGE locations are allowed.
     *
     * @returns {boolean}
     */
    isPgeAllowed : function() {
        return this.getOptions().allowPge !== false;
    },

    /**
     * Check if PG locations are allowed.
     *
     * @returns {boolean}
     */
    isPgAllowed : function() {
        return this.getOptions().allowPg !== false;
    },

    /**
     * Check if PA locations are allowed.
     *
     * @returns {boolean}
     */
    isPaAllowed : function() {
        return this.getOptions().allowPa !== false;
    },

    /**
     * Check if delivery days are allowed.
     *
     * @returns {boolean}
     */
    isDeliveryDaysAllowed : function() {
        return this.getOptions().allowDeliveryDays !== false;
    },

    /**
     * Check if timeframes are allowed.
     *
     * @returns {boolean}
     */
    isTimeframesAllowed : function() {
        return this.getOptions().allowTimeframes !== false;
    },

    /**
     * Check if evening timeframes are allowed.
     *
     * @returns {boolean}
     */
    isEveningTimeframesAllowed : function() {
        return this.getOptions().allowEveningTimeframes !== false;
    },

    /**
     * Start the delivery options functionality by retrieving possible delivery options from PostNL.
     *
     * @returns {PostnlDeliveryOptions}
     */
    showOptions : function() {
        this.isActive = true;

        if (this.debug) {
            console.info('Delivery options starting...');
        }

        this.deliveryOptionsMap = new PostnlDeliveryOptions.Map(this.getFullAddress(), this, this.debug);

        if (this.isDeliveryDaysAllowed()) {
            this.getTimeframes(this.getPostcode(), this.getHousenumber(), this.getCountry(), this.getDeliveryDate());
        } else {
            if (this.debug) {
                console.info('Showing default timeframe.');
            }
            this.showDefaultTimeframe()
                .setParsedTimeframes(true)
                .hideSpinner();
        }
        this.getLocations(this.getPostcode(), this.getHousenumber(), this.getStreet(), this.getCity(), this.getCountry(), this.getDeliveryDate());
        if (this.getOptions().extraOptions.only_stated_address) {
            this.getOptions().extraOptions.only_stated_address.element.observe('click', function (event) {
                this.updateShippingPrice();
            }.bind(this));
        }

        return this;
    },

    /**
     * Get all possible delivery timeframes for a specified postcode, housenumber and delivery date.
     *
     * @param {string} postcode
     * @param {number} housenumber
     * @param {string} country
     * @param {string} deliveryDate
     *
     * @returns {boolean|Array|PostnlDeliveryOptions}
     */
    getTimeframes : function(postcode, housenumber, country, deliveryDate) {
        if (this.debug) {
            console.info('Getting available timeframes.');
        }

        /**
         * @type {Array|boolean}
         */
        var timeframes = this.timeframes;
        if (timeframes) {
            return timeframes;
        }

        if (this.timeframeRequest !== false) {
            try {
                this.timeframeRequest.transport.abort();
            } catch (e) {
                console.error(e);
            }
        }

        if (!postcode) {
            postcode = this.getPostcode();
        }

        if (!housenumber) {
            housenumber = this.getHousenumber();
        }

        if (!country) {
            country = this.getCountry();
        }

        if (!deliveryDate) {
            deliveryDate = this.getDeliveryDate();
        }

        var options = this.getOptions();
        this.timeframeRequest = new Ajax.PostnlRequest(this.getTimeframesUrl(), {
            method : 'post',
            parameters : {
                postcode     : postcode,
                housenumber  : housenumber,
                deliveryDate : deliveryDate,
                country      : country,
                isAjax       : true
            },
            onSuccess : this.processGetTimeframesSuccess.bind(this),
            onFailure : this.showDefaultTimeframe.bind(this),
            onComplete : function() {
                this.timeframeRequest = false;
            }.bind(this),
            onTimeout : this.showDefaultTimeframe.bind(this),
            timeoutDelay: options.getTimeframesTimeout
        });

        return this;
    },

    /**
     * Process a succesful GetTimeframes request.
     *
     * @param response
     *
     * @returns {boolean|PostnlDeliveryOptions}
     */
    processGetTimeframesSuccess : function(response) {
        /**
         * Check that the response is valid.
         *
         * @todo expand error handling.
         */
        var responseText = response.responseText;
        if (responseText == 'not_allowed'
            || responseText == 'invalid_data'
            || responseText == 'error'
            || responseText == 'empty_response'
        ) {
            this.showDefaultTimeframe();

            return false;
        }

        /**
         * Eval the resulting JSON in sanitize mode.
         */
        var timeframes = responseText.evalJSON(true);

        var shippingMethodName = this.getOptions().shippingMethodName;
        var checkbox = $(shippingMethodName);
        var selectPostnlShippingMethod = false;

        if (checkbox.checked) {
            selectPostnlShippingMethod = true;
        }

        /**
         * Parse and render the result.
         */
        this.parseTimeframes(timeframes)
            .renderTimeframes(selectPostnlShippingMethod);

        this.setParsedTimeframes(true)
            .hideSpinner();

        return this;
    },

    /**
     * Parse a list of PostNL timeframe objects.
     *
     * @param {Array} timeframes
     *
     * @returns {PostnlDeliveryOptions}
     */
    parseTimeframes : function(timeframes) {
        var parsedTimeframes = [];

        for(var n = 0, o = 0, l = timeframes.length; n < l; n++) {
            if (o >= 1 && this.isDeliveryDaysAllowed() === false) {
                break;
            }

            var currentTimeframe = timeframes[n];

            for (var i = 0, m = currentTimeframe.Timeframes.TimeframeTimeFrame.length; i < m ; i++, o++) {
                var currentSubTimeframe = currentTimeframe.Timeframes.TimeframeTimeFrame[i];
                if (this.isEveningTimeframesAllowed() === false
                    && currentSubTimeframe.Options.string[0] == 'Evening'
                ) {
                    continue;
                }

                var postnlTimeframe = new PostnlDeliveryOptions.Timeframe(
                    currentTimeframe.Date,
                    currentSubTimeframe,
                    o,
                    this
                );

                parsedTimeframes.push(postnlTimeframe);
            }
        }

        this.setTimeframes(parsedTimeframes);

        if (this.debug) {
            console.log('Timeframes parsed:', parsedTimeframes);
        }

        return this;
    },

    /**
     * Render all timeframes.
     *
     * @param {boolean}  selectTimeframe
     *
     * @returns {PostnlDeliveryOptions}
     */
    renderTimeframes : function(selectTimeframe) {
        var selectedDeliveryOption = PostnlDeliveryOptions.PersistentStorage.getSelectedDeliveryOption();
        selectTimeframe = selectTimeframe && selectedDeliveryOption === null;

        $$('#' + this.getOptions().timeframesContainer + ' li.option').each(function(element) {
            element.remove();
        });

        this.timeframes.each(function(timeframe) {
            timeframe.render(this.getOptions().timeframesContainer);
        }.bind(this));

        if (selectTimeframe) {
            if (PostnlDeliveryOptions.PersistentStorage.getSelectedTimeframe()) {
                this.selectTimeframe(PostnlDeliveryOptions.PersistentStorage.getSelectedTimeframe().element);
            } else if (this.timeframes[0].type != 'Sameday') {
                this.selectTimeframe(this.timeframes[0].getElement());
            } else {
                this.selectTimeframe(this.timeframes[1].getElement());
            }
        }

        if (this.getOptions().isOsc) {
            if (PostnlDeliveryOptions.PersistentStorage.getSelectedTimeframe()) {
                PostnlDeliveryOptions.PersistentStorage.getSelectedTimeframe().renderAsOsc();
            } else if (this.timeframes[0].type != 'Sameday') {
                this.timeframes[0].renderAsOsc();
            } else {
                this.timeframes[1].renderAsOsc();
            }

            if (selectTimeframe) {
                this.saveSelectedOption();
            }

            var fullAddressArray = this.fullAddress.split(',');

            var useBillingForShipping = true;
            if ($('billing:use_for_shipping_yes')) {
                useBillingForShipping = $('billing:use_for_shipping_yes').getValue();
            } else if ($('billing_use_for_shipping_yes')) {
                useBillingForShipping = $('billing_use_for_shipping_yes').getValue();
            }

            if (fullAddressArray[0] == '') {
                if(useBillingForShipping == 1) {
                    if ($('virtual:billing:street1')) {
                        var street  = $('virtual:billing:street1').getValue();
                        var houseNr = $('virtual:billing:street2').getValue();
                    } else {
                        var street = $('billing:street0').getValue();
                        var houseNr = $('billing:street1').getValue();
                    }
                } else {
                    if ($('virtual:shipping:street1')) {
                        var street = $('shipping:street0').getValue();
                        var houseNr = $('shipping:street1').getValue();
                    } else {
                        var street  = $('virtual:shipping:street1').getValue();
                        var houseNr = $('virtual:shipping:street2').getValue();
                    }
                }

                $$('.postnl-container #postnl_add_moment .location-name')[0].update(street + ' ' + houseNr);
            }
        }

        if (this.debug) {
            console.info('Timeframes rendered.');
        }

        return this;
    },

    showDefaultTimeframe : function() {
        if (this.debug) {
            console.info('Showing default timeframe option.');
        }

        if (!this.options.allowFallBackTimeFrame) {
            this.showDefaultTimeframeNotAllowed();
            return this;
        }

        var fakeTimeframe = {
            From          : '09:00:00',
            To            : '18:00:00',
            TimeframeType : 'Overdag',
            Options       : {
                string : []
            }
        };

        var postnlTimeframe = new PostnlDeliveryOptions.Timeframe(this.getDeliveryDate(), fakeTimeframe, 0, this);

        var today = new Date();
        var formattedToday = this.formatDate(today);

        if (postnlTimeframe.date == formattedToday) {
            today.setTime(today.getTime() + 86400000);
            postnlTimeframe.date = this.formatDate(today);
        }

        this.setTimeframes(new Array(postnlTimeframe));

        this.renderTimeframes(true);

        this.setParsedTimeframes(true)
            .hideSpinner();

        return this;
    },

    showDefaultTimeframeNotAllowed : function() {
        if (this.debug) {
            console.info('Showing default timeframe option is not allowed');
        }

        if ($$('#carrier_postnl input')[0] != undefined) {
            $$('#carrier_postnl input')[0].checked = false;
            $$('#carrier_postnl input')[0].disabled = true;
            $$('#carrier_postnl input')[0].style.display = 'none';
            $$('#carrier_postnl label')[0].innerHTML = Translator.translate('Food products delivery is not possible for this postal code. Please choose a different address.');
            $$('#carrier_postnl label')[0].addClassName('defaultTimeFrameNotAvailable');
            $$('#carrier_postnl .postnl-container')[0].style.display = 'none';
        } else {
            $$('.postnl-container')[0].up(2).addClassName('defaultTimeFrameNotAvailable');
            $$('.postnl-container')[0].up(2).innerHTML = Translator.translate('Food products delivery is not possible for this postal code. Please choose a different address.');
        }
    },

    formatDate : function(date) {
        var formattedMonth = date.getMonth() + 1;

        if (formattedMonth.toString().length < 2) {
            formattedMonth = '0' + formattedMonth.toString();
        }

        return date.getDate() + '-' + formattedMonth + '-' + date.getFullYear()
    },

    /**
     * Get all possible delivery locations for a specified postcode, housenumber and delivery date.
     *
     * The result may contain up to 20 locations, however we will end up using a maximum of 3.
     *
     * @param {string} postcode
     * @param {int}    housenumber
     * @param {string} street
     * @param {string} city
     * @param {string} country
     * @param {string} deliveryDate
     *
     * @return {PostnlDeliveryOptions}
     */
    getLocations : function(postcode, housenumber, street, city, country, deliveryDate) {
        if (this.debug) {
            console.info('Getting available delivery locations.');
        }

        if (!this.isPaAllowed() && !this.isPgAllowed()) {
            this.hideLocations();
            return this;
        }

        if (this.locationsRequest !== false) {
            try {
                this.locationsRequest.transport.abort();
            } catch (e) {
                console.error(e);
            }
        }

        var options = this.getOptions();
        this.locationsRequest = new Ajax.PostnlRequest(this.getLocationsUrl(),{
            method : 'post',
            parameters : {
                postcode     : postcode,
                housenumber  : housenumber,
                street       : street,
                deliveryDate : deliveryDate,
                city         : city,
                country      : country,
                isAjax       : true
            },
            onSuccess : this.processGetLocationsSuccess.bind(this),
            onFailure : this.hideLocations.bind(this),
            onComplete : function() {
                this.locationsRequest = false;
            }.bind(this),
            onTimeout : this.hideLocations.bind(this),
            timeoutDelay: options.getLocationsTimeout
        });

        return this;
    },

    removeDiacritics : function(str) {
        for (var i = 0; i < diacriticsMap.length; i++) {
            str = str.replace(diacriticsMap[i].letters, diacriticsMap[i].base);
        }
        return str;
    },

    /**
     * @param response
     * @returns {*}
     */
    processGetLocationsSuccess : function(response) {
        /**
         * Check that the response is valid.
         *
         * @todo expand error handling.
         */
        var responseText = response.responseText;
        if (responseText == 'not_allowed'
            || responseText == 'invalid_data'
            || responseText == 'error'
        ) {
            this.hideLocations();

            return false;
        }

        /**
         * Eval the resulting JSON in sanitize mode.
         */
        var locations = responseText.evalJSON(true);

        /**
         * Add the location to the map interface as markers.
         */
        if (this.getDeliveryOptionsMap()) {
            this.getDeliveryOptionsMap().addMarkers(locations);
        }

        /**
         * Parse and render the result.
         */
        this.parseLocations(locations);
        try {
            this.renderLocations();
        } catch (e) {
            console.log(ed)
        }

        this.setParsedLocations(true)
            .hideSpinner();

        return this;
    },

    /**
     * Parse PostNL delivery locations. We need to filter out unneeded locations so we only end up with the ones closest
     * to the chosen postcode and housenumber.
     *
     * @param {Array} locations.
     *
     * @return {PostnlDeliveryOptions}
     */
    parseLocations : function(locations) {
        var processedPG = false;
        var processedPGE = false;
        var processedPA = false;
        var processedLocations = [];

        for(var n = 0, l = locations.length; n < l; n++) {
            /**
             * If we already have a PakjeGemak, PakjeGemak Express and parcel dispenser location, we're finished and
             * can ignore the remaining locations.
             */
            if (processedPG && processedPGE && processedPA) {
                break;
            }

            /**
             * Get the type of location. Can be PG, PGE or PA.
             */
            var type = locations[n].DeliveryOptions.string;

            /**
             * Instantiate a new PostnlDeliveryOptions.Location object with this location's parameters.
             */
            var postnlLocation = new PostnlDeliveryOptions.Location(
                locations[n],
                this,
                type
            );
            processedLocations.push(postnlLocation);

            if (
                (this.isPgAllowed() && !processedPG && type.indexOf('PG') != -1)
                && (this.isPgeAllowed() && !processedPGE && type.indexOf('PGE') != -1)
            ) {
                postnlLocation.setTooltipClassName('first');

                /**
                 * Register this location as the chosen PGE location.
                 */
                this.setPgeLocation(postnlLocation);
                this.setPgLocation(false);

                processedPGE = true;
                processedPG  = true;
                continue;
            }

            /**
             * If we can add a PGE location, we don't already have a PGE location and this is a PGE location; add it as the chosen
             * PGE location.
             */
            if (this.isPgeAllowed() && !processedPGE && type.indexOf('PGE') != -1) {
                postnlLocation.setTooltipClassName('first');

                /**
                 * Register this location as the chosen PGE location.
                 */
                this.setPgeLocation(postnlLocation);
                processedPGE     = true;
                continue;
            }

            /**
             * If we can add a PG location, we don't already have a PG location and this is a PG location; add it as the chosen
             * PG location.
             */
            if (this.isPgAllowed() && !processedPG && type.indexOf('PG') != -1) {
                postnlLocation.setTooltipClassName('second');

                /**
                 * Register this location as the chosen PG location.
                 */
                this.setPgLocation(postnlLocation);
                processedPG     = true;
                continue;
            }

            /**
             * If we can add a PA location, we don't already have a PA location and this is a PA location; add it as the chosen
             * PA location.
             *
             * N.B. that a single location can be used as both PG, PGE and PA.
             */
            if (this.isPaAllowed() && !processedPA && type.indexOf('PA') != -1) {
                postnlLocation.setTooltipClassName('third');

                /**
                 * Register this location as the chosen PA location.
                 */
                this.setPaLocation(postnlLocation);
                processedPA     = true;
            }
        }

        this.setLocations(processedLocations);
        if (this.getDeliveryOptionsMap()) {
            this.getDeliveryOptionsMap().addMarkers(locations);
        }

        if (this.debug) {
            console.log('Delivery locations parsed:', processedLocations);
        }

        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions}
     */
    renderLocations : function() {
        var pickUpList = $('postnl_pickup');
        pickUpList.show();
        $('responsive_switch').show();

        $$('#' + this.getOptions().pgeLocationContainer + ' li').each(function(element) {
            element.remove();
        });
        $$('#' + this.getOptions().pgLocationContainer + ' li').each(function(element) {
            element.remove();
        });
        $$('#' + this.getOptions().paLocationContainer + ' li').each(function(element) {
            element.remove();
        });

        if (!this.isPgeAllowed() && !this.isPgAllowed() && !this.isPaAllowed()) {
            this.hideLocations();
            return this;
        }

        if (this.isPgeAllowed() && this.getPgeLocation()) {
            this.getPgeLocation().render(this.getOptions().pgeLocationContainer);
        }

        if (this.isPgAllowed() && this.getPgLocation()) {
            this.getPgLocation().render(this.getOptions().pgLocationContainer);
        }

        if (this.isPaAllowed() && this.getPaLocation()) {
            this.getPaLocation().render(this.getOptions().paLocationContainer);
        }

        if (PostnlDeliveryOptions.PersistentStorage.getSelectedDeliveryOption()) {
            this.selectLocation(PostnlDeliveryOptions.PersistentStorage.getSelectedDeliveryOption());
            this.saveOscOptions();
        }

        if (this.debug) {
            console.info('Delivery locations rendered.');
        }

        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions}
     */
    hideLocations : function() {
        this.setParsedLocations(true)
            .hideSpinner();

        $('postnl_pickup').hide();
        $('responsive_switch').hide();

        if (this.debug) {
            console.info('Delivery locations are hidden.');
        }

        return this;
    },

    /**
     * @param element
     * @returns {*}
     */
    selectTimeframe : function(element) {
        if (!element) {
            return this;
        }

        var timeframes = this.timeframes;

        timeframes.each(function(timeframe) {
            if (element && timeframe.element.identify() == element.identify()) {
                this.setLastSelectedOption(timeframe);
                this.setSelectedOption(timeframe);
                this.setLastSelectedType(timeframe.getType());
                this.setSelectedType(timeframe.getType());
                PostnlDeliveryOptions.PersistentStorage.setSelectedTimeframe(timeframe);

                if (this.debug) {
                    console.log('Timeframe selected:', timeframe);
                }

                document.fire('postnl:selectTimeframe');
                document.fire('postnl:selectDeliveryOption');
                timeframe.select();
            } else {
                timeframe.unSelect();
            }
        }.bind(this));

        this.unSelectLocation();
        this.selectPostnlShippingMethod();

        this.updateShippingPrice();

        return false;
    },

    /**
     * @returns {PostnlDeliveryOptions}
     */
    unSelectTimeframe : function() {
        var timeframes = this.timeframes;
        if (!timeframes) {
            return this;
        }

        timeframes.each(function(timeframe) {
            timeframe.unSelect();
        });

        return this;
    },

    /**
     * @param element
     * @returns {PostnlDeliveryOptions}
     */
    selectLocation : function(element) {
        if (!element) {
            return this;
        }

        var locations = this.locations;

        locations.each(function(location) {
            if (!location.elements) {
                return false;
            }

            var elements = location.elements;
            for(var index in elements) {
                if (!elements.hasOwnProperty(index)) {
                    continue;
                }

                var locationElement = elements[index];
                if (element && locationElement.identify() == element.identify()) {
                    this.setLastSelectedOption(location);
                    this.setSelectedOption(location);
                    this.setLastSelectedType(index);
                    this.setSelectedType(index);
                    location.select(index);
                    PostnlDeliveryOptions.PersistentStorage.setSelectedDeliveryOption(element);

                    var selectedMarker = this.getDeliveryOptionsMap().getSelectedMarker();
                    if (location.getMarker() != selectedMarker) {
                        this.getDeliveryOptionsMap().selectMarker(location.getMarker(), true, true);
                    }

                    document.fire('postnl:selectLocation');
                    document.fire('postnl:selectDeliveryOption');

                    if (this.debug) {
                        console.log('Delivery location selected:', location);
                    }
                } else {
                    location.unSelect(index);
                }
            }

            return true;
        }.bind(this));

        this.unSelectTimeframe();
        this.selectPostnlShippingMethod();

        this.updateShippingPrice();

        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions}
     */
    unSelectLocation : function() {
        var locations = this.locations;

        locations.each(function(location) {
            if (!location.elements) {
                return false;
            }

            var elements = location.elements;
            for(var index in elements) {
                if (!elements.hasOwnProperty(index)) {
                    continue;
                }

                location.unSelect(index);
            }

            return true;
        });

        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions}
     */
    unSelectOptions : function() {
        this.unSelectLocation();
        this.unSelectTimeframe();
        this.setSelectedType(null);
        this.setSelectedOption(null);

        return this;
    },

    /**
     * Hides the initial AJAX spinner and shows the delivery options.
     *
     * @returns {PostnlDeliveryOptions}
     */
    hideSpinner : function() {
        if (!this.getOptions().loaderDiv) {
            return this;
        }

        if (!this.getParsedLocations() || !this.getParsedTimeframes()) {
            return this;
        }

        $(this.getOptions().loaderDiv).hide();
        $(this.getOptions().optionsContainer).show();

        document.fire('postnl:loadingFinished');

        return this;
    },

    /**
     * Select the PostNL shipping method radio button.
     *
     * @returns {PostnlDeliveryOptions}
     */
    selectPostnlShippingMethod : function() {
        var shippingMethodName = this.getOptions().shippingMethodName;
        var checkbox = $(shippingMethodName);

        if (checkbox && !this.getOptions().isOsc) {
            checkbox.checked = true;

            return this;
        }

        return this;
    },

    /**
     * Save the selected option for OneStepCheckout.
     *
     * @returns {boolean}
     */
    saveOscOptions : function() {
        if (!this.getSelectedOption()) {
            return false;
        }
        var selectedType   = this.getSelectedType();

        if (selectedType == 'PA' && !this.getPaPhoneCheckPassed()) {
            this.openAddPhoneWindow();
            return false;
        }

        var selectedOption = this.getSelectedOption();
        var isTimeframe    = true;

        if (selectedType == 'PG' || selectedType == 'PGE' || selectedType == 'PA') {
            isTimeframe = false;
        }

        $$('#postnl_add_moment .option').each(function(element) {
            element.remove();
        });

        var n = 0;
        $$('#postnl_add_moment .location').each(function(element) {
            if (n == 0 && isTimeframe) {
                element.show();
            } else if (n == 0) {
                element.hide();
            } else {
                element.remove();
            }
            n++;
        });

        selectedOption.renderAsOsc(selectedType);

        var shippingMethodName = this.getOptions().shippingMethodName;
        var checkbox = $(shippingMethodName);
        checkbox.checked = true;
        checkbox.click();

        $(this.getOptions().oscOptionsPopup).hide();

        this.saveSelectedOption();

        var body = $$('body')[0];
        if (body.hasClassName('responsive-noscroll')) {
            body.removeClassName('responsive-noscroll');
        }

        this.getOptions().postnlShippingMethods.each(function(shippingMethod) {
            if ($(shippingMethod)) {
                $(shippingMethod).checked = true;
            }
        });

        $('postnl_delivery_options').hide();

        document.fire('postnl:domModified');

        if (this.debug) {
            console.info('Saved option for OSC.');
        }
        return true;
    },

    /**
     * Saves the selected option.
     *
     * @returns {boolean}
     */
    saveSelectedOption : function() {
        if (!this.isActive) {
            return true;
        }

        if (typeof(this.timeframes[0]) == "undefined") {
            return true;
        }

        if (!this.getSelectedOption()) {
            this.selectTimeframe(this.timeframes[0].getElement());
        }

        if (this.debug) {
            console.info('Saving selected option...');
        }

        var selectedType = this.getSelectedType();

        if (!this.getOptions().isOsc && selectedType == 'PA' && !this.getPaPhoneCheckPassed()) {
            this.openAddPhoneWindow();
            return false;
        }

        var selectedOption = this.getSelectedOption();

        var extraCosts = {
            incl : this.getExtraCosts(true),
            excl : this.getExtraCosts(false)
        };

        var from = selectedOption.from;
        if (selectedType == 'PG' || selectedType == 'PA') {
            from = '15:00:00';
        } else if (selectedType == 'PGE') {
            from = '09:00:00'
        }

        var options = {
            only_stated_address : false
        };

        var params = {
            isAjax  : true,
            type    : selectedType,
            date    : selectedOption.getDate(),
            from    : from,
            to      : selectedOption.to,
            costs   : Object.toJSON(extraCosts),
            options : null
        };

        if (selectedType == 'PG' || selectedType == 'PGE' || selectedType == 'PA') {
            var address               = selectedOption.getAddress();
            address['City']           = this.removeDiacritics(address.City);
            address['Name']           = selectedOption.getName();
            address['PhoneNumber']    = selectedOption.getPhoneNumber();
            params['address']         = Object.toJSON(address);
            params['locationCode']    = Object.toJSON(selectedOption.locationCode);
            params['retailNetworkId'] = Object.toJSON(selectedOption.retailNetworkID);
        }

        if (selectedType == 'PA') {
            params['number'] = $('add_phone_input').getValue();
        }

        if (this.getOptions().isOsc) {
            params['isOsc'] = true;
        }

        options['only_stated_address'] = this.getOptions().extraOptions.only_stated_address.element.checked;
        params['options'] = Object.toJSON(options);

        if (this.saveOptionCostsRequest) {
            try {
                this.saveOptionCostsRequest.transport.abort();
            } catch (e) {
                console.error(e);
            }
        }

        this.saveOptionCostsRequest = new Ajax.PostnlRequest(this.getSaveUrl(), {
            method     : 'post',
            parameters : params,
            onCreate   : function() {
                document.fire('postnl:selectOptionSaveStart');
            },
            onSuccess  : function(response) {
                var responseText = response.responseText.trim();
                if (responseText != 'OK') {
                    console.error('Invalid response received: ' + responseText);
                }

                document.fire('postnl:selectOptionSaved');
            }
        });

        return true;
    },

    /**
     * Calculate optional extra costs for currently selected option.
     *
     * @returns {Number}
     */
    getExtraCosts : function(inclTax) {
        var selectedType = this.getSelectedType();
        var extraCosts = 0;

        if (!selectedType) {
            return extraCosts;
        }

        if (inclTax) {
            if (selectedType == 'PGE') {
                extraCosts = this.getOptions().expressFeeIncl;
            } else if (selectedType == 'Avond') {
                extraCosts = this.getOptions().eveningFeeIncl;
            } else if (selectedType == 'Sunday') {
                extraCosts = this.getOptions().sundayFeeIncl;
            } else if (selectedType == 'Sameday') {
                extraCosts = this.getOptions().sameDayFeeIncl;
            }

            if (this.getOptions().extraOptions.only_stated_address && this.getOptions().extraOptions.only_stated_address.element.checked) {
                extraCosts += this.getOptions().onlyStatedAddressFeeIncl;
            }

            if (this.debug) {
                console.log('Extra costs incl. VAT:', extraCosts);
            }

            return parseFloat(extraCosts);
        }

        if (selectedType == 'PGE') {
            extraCosts = this.getOptions().expressFeeExcl;
        } else if (selectedType == 'Avond') {
            extraCosts = this.getOptions().eveningFeeExcl;
        } else if (selectedType == 'Sunday') {
            extraCosts = this.getOptions().sundayFeeExcl;
        } else if (selectedType == 'Sameday') {
            extraCosts = this.getOptions().sameDayFeeExcl;
        }
        if (this.getOptions().extraOptions.only_stated_address && this.getOptions().extraOptions.only_stated_address.element.checked) {
            extraCosts += this.getOptions().onlyStatedAddressFeeExcl;
        }

        if (this.debug) {
            console.log('Extra costs excl. VAT:', extraCosts);
        }

        return parseFloat(extraCosts);
    },

    /**
     * Update the displayed shipping price.
     *
     * @returns {PostnlDeliveryOptions}
     */
    updateShippingPrice : function()
    {
        var taxDisplayType = this.getOptions().taxDisplayType;
        if (taxDisplayType == 1) {
            this.updateShippingPriceExclTax(0);
        } else if (taxDisplayType == 2) {
            this.updateShippingPriceInclTax(0);
        } else {
            this.updateShippingPriceExclTax(0);
            this.updateShippingPriceInclTax(1);
        }

        return this;
    },

    /**
     * @param {int} spanNumber
     *
     * @returns {PostnlDeliveryOptions}
     */
    updateShippingPriceExclTax : function(spanNumber) {
        var shippingMethodLabel = $$('label[for="' + this.getOptions().shippingMethodName + '"]')[0];
        var priceContainerExcl = $$('label[for="' + this.getOptions().shippingMethodName + '"] span.price')[spanNumber];

        if (!priceContainerExcl) {
            return this;
        }

        var extraCostsExcl   = this.getExtraCosts(false);
        var defaultCostsExcl = parseFloat(shippingMethodLabel.readAttribute('data-price'));

        var defaultCurrencyExcl = (defaultCostsExcl).formatMoney(2, ',', '.');
        var currencyExcl        = (extraCostsExcl).formatMoney(2, ',', '.');

        var updateText = this.getOptions().currencySymbol
            + ' '
            + defaultCurrencyExcl;

        if (extraCostsExcl) {
            updateText += ' + '
                + this.getOptions().currencySymbol
                + ' '
                + currencyExcl;
        }

        priceContainerExcl.update(updateText);

        return this;
    },

    /**
     * @param {int} spanNumber
     *
     * @returns {PostnlDeliveryOptions}
     */
    updateShippingPriceInclTax : function(spanNumber) {
        var shippingMethodLabel = $$('label[for="' + this.getOptions().shippingMethodName + '"]')[0];
        var priceContainerIncl = $$('label[for="' + this.getOptions().shippingMethodName + '"] span.price')[spanNumber];

        if (!priceContainerIncl) {
            return this;
        }

        var extraCostsIncl   = this.getExtraCosts(true);
        var defaultCostsIncl = parseFloat(shippingMethodLabel.readAttribute('data-price-incl'));

        var defaultCurrencyIncl = (defaultCostsIncl).formatMoney(2, ',', '.');
        var currencyIncl        = (extraCostsIncl).formatMoney(2, ',', '.');

        var updateText   = this.getOptions().currencySymbol
                         + ' '
                         + defaultCurrencyIncl;
        if (extraCostsIncl) {
            updateText += ' + '
                       + this.getOptions().currencySymbol
                       + ' '
                       + currencyIncl;
        }

        priceContainerIncl.update(updateText);

        return this;
    },

    /**
     * Opens the add phone window for PA delivery options.
     *
     * @returns {PostnlDeliveryOptions}
     */
    openAddPhoneWindow : function() {
        var phoneWindow = $(this.getOptions().addPhoneContainer);
        if (!phoneWindow) {
            return this;
        }

        var body = $$('body')[0];
        if (!body.hasClassName('responsive-noscroll')) {
            body.addClassName('responsive-noscroll');
        }

        phoneWindow.show();
        $('add_phone_input').focus();

        if (typeof validateShippingMethod != 'undefined') {
            validateShippingMethod();
        }
        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions}
     */
    closeAddPhoneWindow : function() {
        var phoneWindow = $(this.getOptions().addPhoneContainer);
        if (!phoneWindow) {
            return this;
        }

        var body = $$('body')[0];
        if (body.hasClassName('responsive-noscroll')) {
            body.removeClassName('responsive-noscroll');
        }

        phoneWindow.hide();
        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions}
     */
    reinitCufon : function() {
        if (this.getOptions().disableCufon) {
            return this;
        }

        if (typeof initCufon != 'function') {
            return this;
        }

        if (this.debug) {
            console.info('Refreshing cufon...');
        }

        initCufon();

        return this;
    }
};

PostnlDeliveryOptions.Map = new Class.create({
    map                           : false,
    scrollbar                     : false,
    autocomplete                  : false,

    deliveryOptions               : false,
    fullAddress                   : '',

    isBeingDragged                : false,
    isInfoWindowOpen              : false,

    markers                       : [],
    locations                     : [],
    selectedMarker                : false,
    searchLocationMarker          : false,

    nearestLocationsRequestObject : false,
    locationsInAreaRequestObject  : false,

    filterEarly                   : false,
    filterEvening                 : false,
    filterPA                      : false,

    /**
     * Constructor method.
     * Creates the google maps object and triggers an initial address search based on the user's chosen shipping
     * address.
     *
     * @constructor
     *
     * @param {string} fullAddress
     * @param {PostnlDeliveryOptions} deliveryOptions
     * @param {boolean} debug
     *
     * @returns {void}
     */
    initialize : function(fullAddress, deliveryOptions, debug) {
        if (typeof google.maps == 'undefined') {
            throw 'Google maps is required.';
        }

        if (!deliveryOptions.options.canUseGoogleMaps) {
            $('map-div').hide();
        }

        this.deliveryOptions = deliveryOptions;
        this.fullAddress = fullAddress;
        this.debug = debug;

        var country = this.getDeliveryOptions().getCountry();
        var mapOptions = this.getMapOptions();

        this.map = new google.maps.Map($('map-div'), mapOptions);

        this.scrollbar = new Control.ScrollBar(
            this.getOptions().scrollbarContainer,
            this.getOptions().scrollbarTrack
        );

        this.searchAndPanToAddress(this.getFullAddress(), true, false);

        /**
         * Add autocomplete functionality to the address search field. Results will be located in the Netherlands and
         * may contain only addresses.
         */
        this.autocomplete = new google.maps.places.Autocomplete(
            $('search_field'),
            {
                componentRestrictions : {
                    country : country
                },
                types : [
                    'establishment',
                    'geocode'
                ]
            }
        );
        this.autocomplete.bindTo('bounds', this.map);

        this.registerObservers();
    },

    /******************************
     *                            *
     *  GETTER AND SETTER METHODS *
     *                            *
     ******************************/

    getMap : function() {
        return this.map;
    },

    getScrollbar : function() {
        return this.scrollbar;
    },

    getAutoComplete : function() {
        return this.autocomplete;
    },

    getDeliveryOptions : function() {
        return this.deliveryOptions;
    },

    getFullAddress : function() {
        return this.fullAddress;
    },

    getIsBeingDragged : function() {
        return this.isBeingDragged;
    },

    setIsBeingDragged : function(isBeingDragged) {
        this.isBeingDragged = isBeingDragged;

        return this;
    },

    getIsInfoWindowOpen : function() {
        return this.isInfoWindowOpen;
    },

    setIsInfoWindowOpen : function(isInfoWindowOpen) {
        this.isInfoWindowOpen = isInfoWindowOpen;

        return this;
    },

    getMarkers : function() {
        return this.markers;
    },

    setMarkers : function(markers) {
        this.markers = markers;

        return this;
    },

    hasMarkers : function() {
        var markers = this.getMarkers();

        return markers.length > 0;
    },

    getLocations : function() {
        return this.locations;
    },

    setLocations : function(locations) {
        this.locations = locations;

        return this;
    },

    hasLocations : function() {
        var locations = this.getLocations();

        return locations.length > 0;
    },

    getSelectedMarker : function() {
        return this.selectedMarker;
    },

    setSelectedMarker : function(marker) {
        this.selectedMarker = marker;

        return this;
    },

    hasSelectedMarker : function() {
        return this.getSelectedMarker() ? true : false;
    },

    getSearchLocationMarker : function() {
        return this.searchLocationMarker;
    },

    setSearchLocationMarker : function(marker) {
        this.searchLocationMarker = marker;

        return this;
    },

    getNearestLocationsRequestObject : function() {
        return this.nearestLocationsRequestObject;
    },

    setNearestLocationsRequestObject : function(requestObject) {
        this.nearestLocationsRequestObject = requestObject;

        return this;
    },

    getLocationsInAreaRequestObject : function() {
        return this.locationsInAreaRequestObject;
    },

    setLocationsInAreaRequestObject : function(requestObject) {
        this.locationsInAreaRequestObject = requestObject;

        return this;
    },

    getFilterEarly : function() {
        return this.filterEarly;
    },

    setFilterEarly : function(filter) {
        this.filterEarly = filter;

        return this;
    },

    getFilterEvening : function() {
        return this.filterEvening;
    },

    setFilterEvening : function(filter) {
        this.filterEvening = filter;

        return this;
    },

    getFilterPa : function() {
        return this.filterPa;
    },

    setFilterPa : function(filter) {
        this.filterPa = filter;

        return this;
    },

    getOptions : function() {
        return this.getDeliveryOptions().getOptions();
    },

    /**
     * Get the map icon for unselected markers.
     *
     * @param {object} location
     *
     * @returns {{anchor: Ext.lib.Point, url: string}}
     */
    getMapIcon : function(location) {
        var name = location.Name;
        if (!name) {
            name = location.getName();
        }

        if (typeof location.DeliveryOptions != 'undefined'
            && location.DeliveryOptions.string.indexOf('PA') > -1
        ) {
            name = 'automaat';
        } else if (typeof location.type != 'undefined'
            && location.getType().indexOf('PA') > -1
        ) {
            name = 'automaat';
        }

        var imageName = this.getDeliveryOptions().getImageName(name);
        var imageBase = this.getDeliveryOptions().getImageBasUrl();
        var image = imageBase + '/crc_' + imageName + '.png';

        return {
            anchor : new google.maps.Point(13, 27),
            url    : image
        };
    },

    /**
     * Get the icon for selected markers.
     *
     * @param {object} location
     *
     * @returns {{anchor: Ext.lib.Point, url: string}}
     */
    getMapIconSelected : function(location) {
        var name = location.getName();
        if (!name) {
            name = location.Name;
        }

        var anchor = new google.maps.Point(17, 46);
        if (typeof location.DeliveryOptions != 'undefined'
            && location.DeliveryOptions.string.indexOf('PA') > -1
            ) {
            name = 'automaat';
        } else if (typeof location.type != 'undefined'
            && location.getType().indexOf('PA') > -1
            ) {
            name = 'automaat';
        }

        var imageName = this.getDeliveryOptions().getImageName(name);
        var imageBase = this.getDeliveryOptions().getImageBasUrl();
        var image = imageBase + '/drp_' + imageName + '.png';

        return {
            anchor : anchor,
            url    : image
        };
    },

    getSaveButton : function() {
        return $('location_save');
    },

    /**
     * Get an options object for the map's markers.
     *
     * @param {object} location
     * @param {*} markerLatLng
     * @param {string} markerTitle
     *
     * @returns {object}
     */
    getMarkerOptions : function(location, markerLatLng, markerTitle) {
        return {
            position  : markerLatLng,
            map       : null,
            title     : markerTitle,
            animation : google.maps.Animation.DROP,
            draggable : false,
            clickable : true,
            icon      : this.getMapIcon(location)
        };
    },

    /**
     * Get the shape of a marker.
     *
     * @param {boolean} isPa Whether or not this is for a pakket automaat locations
     *
     * @returns {{coords: number[], type: string}}
     */
    getMarkerShape : function(isPa) {
        var coords = [];
        if (isPa) {
            coords = [
                10, 31, 6, 29, 4, 27, 3, 26, 1, 24, 0, 21, 0, 14, 1, 11, 3, 9, 4, 8, 6, 6, 10, 4, 10, 0, 31, 0, 31, 12,
                27, 12, 27, 21, 26, 24, 24, 26, 23, 27, 21, 29, 17, 31
            ];
        } else {
            coords = [
                10, 27, 6, 25, 4, 23, 3, 22, 1, 20, 0, 17, 0, 10, 1, 7, 3, 5, 4, 4, 6, 2, 10, 0, 17, 0, 21, 2, 23, 4,
                24, 5, 26, 7, 27, 10, 27, 17, 26, 20, 24, 22, 23, 23, 21, 25, 17, 27
            ];
        }

        return {
            coords : coords,
            type   : 'poly'
        };
    },

    /**
     * Get the shape of a selected marker.
     *
     * @param {boolean} isPa Whether or not this is for a pakket automaat locations
     *
     * @returns {{coords: number[], type: string}}
     */
    getSelectedMarkerShape : function(isPa) {
        var coords = [];
        if (isPa) {
            coords = [
                17, 46, 13, 41, 8, 34, 3, 28, 1, 24, 0, 21, 0, 13, 1, 10, 3, 7, 5, 5, 7, 3, 10, 1, 13, 0, 35,0, 35, 21,
                34, 24, 32, 28, 27, 34, 22, 41, 18, 46
            ];
        } else {
            coords = [
                17, 46, 13, 41, 8, 34,3, 28, 1, 24, 0, 21, 0, 13, 1, 10, 3, 7, 5, 5, 7, 3, 10, 1, 13, 0, 22, 0, 25, 1,
                28, 3, 30, 5, 32, 7, 34, 10, 35, 13, 35, 21, 34, 24, 32, 28, 27, 34, 22, 41, 18, 46
            ];
        }

        return {
            coords : coords,
            type   : 'poly'
        };
    },

    /**
     * Get the goolgle maps interface window element.
     *
     * @returns {Element}
     */
    getAddLocationWindow : function() {
        if (this.getDeliveryOptions().getOptions() && this.getDeliveryOptions().getOptions().addLocationWindow) {
            var addLocationWindow = this.getDeliveryOptions().getOptions().addLocationWindow;
            if (typeof addLocationWindow == 'string') {
                return $(addLocationWindow);
            }

            return addLocationWindow;
        }

        return $('postnl_add_location_container');
    },

    /**
     * Gets an option object for the google maps object.
     *
     * @returns {object}
     */
    getMapOptions : function() {
        /**
         * Google map styles.
         * All POI icons are hidden. Road icons (directions, etc.) are also hidden.
         */
        var styles = [
            {
                "featureType" : "poi",
                "elementType" : "labels",
                "stylers"     : [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType" : "road",
                "elementType" : "labels.icon",
                "stylers"     : [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ];

        var zoomControlOptions = {
            style    : google.maps.ZoomControlStyle.SMALL,
            position : google.maps.ControlPosition.LEFT_TOP
        };

        return {
            zoom                   : 14,
            minZoom                : 13,
            maxZoom                : 18,
            center                 : new google.maps.LatLng(52.3702157, 4.895167899999933), //Amsterdam
            mapTypeId              : google.maps.MapTypeId.ROADMAP,
            styles                 : styles,
            draggable              : true,
            panControl             : false,
            mapTypeControl         : false,
            scaleControl           : false,
            overviewMapControl     : false,
            streetViewControl      : this.getOptions().allowStreetview,
            zoomControl            : true,
            zoomControlOptions     : zoomControlOptions,
            disableDoubleClickZoom : false,
            scrollwheel            : true,
            keyboardShortcuts      : false
        };
    },

    /**
     * Register observers for the google maps interface window.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    registerObservers : function () {
        var map = this.getMap();

        /**
         * Register observers for the google maps interface window.
         */
        $('add_location').observe('click', this.openAddLocationWindow.bind(this));
        $('close_popup').observe('click', this.closeAddLocationWindow.bind(this));
        $('postnl_back_link').observe('click', this.closeAddLocationWindow.bind(this));
        $('search_button').observe('click', this.addressSearch.bindAsEventListener(this, 'search_field'));
        $('search_field').observe('keydown', this.addressSearch.bindAsEventListener(this, 'search_field'));
        $('responsive_search_button').observe('click', this.addressSearch.bindAsEventListener(this, 'responsive_search_field'));
        $('responsive_search_field').observe('keydown', this.addressSearch.bindAsEventListener(this, 'responsive_search_field'));
        $('location-details-close').observe('click', this.closeLocationInfoWindow.bind(this));
        this.getSaveButton().observe('click', this.saveLocation.bind(this));
        Event.observe(this.getOptions().scrollbarTrack, 'mouse:wheel', this.scrollbar.boundMouseWheelEvent);

        /**
         * Register filter observers.
         */
        var earlyPickupFilter = $('early-filter');
        earlyPickupFilter.observe('click', function() {
            if (earlyPickupFilter.hasClassName('selected')) {
                this.setFilterEarly(false);
                earlyPickupFilter.removeClassName('selected');
            } else {
                this.setFilterEarly(true);
                earlyPickupFilter.addClassName('selected');
            }

            this.filter();
        }.bind(this));

        var earlyPickupFilterResp = $('early-filter-responsive');
        earlyPickupFilterResp.observe('click', function() {
            if (earlyPickupFilterResp.hasClassName('selected')) {
                this.setFilterEarly(false);
                earlyPickupFilterResp.removeClassName('selected');
            } else {
                this.setFilterEarly(true);
                earlyPickupFilterResp.addClassName('selected');
            }

            this.filter();
        }.bind(this));

        var eveningPickupFilter = $('evening-filter');
        eveningPickupFilter.observe('click', function() {
            if (eveningPickupFilter.hasClassName('selected')) {
                this.setFilterEvening(false);
                eveningPickupFilter.removeClassName('selected');
            } else {
                this.setFilterEvening(true);
                eveningPickupFilter.addClassName('selected');
            }
            this.filter();
        }.bind(this));

        var eveningPickupFilterResp = $('evening-filter-responsive');
        eveningPickupFilterResp.observe('click', function() {
            if (eveningPickupFilterResp.hasClassName('selected')) {
                this.setFilterEvening(false);
                eveningPickupFilterResp.removeClassName('selected');
            } else {
                this.setFilterEvening(true);
                eveningPickupFilterResp.addClassName('selected');
            }
            this.filter();
        }.bind(this));

        var paPickupFilter = $('pa-filter');
        paPickupFilter.observe('click', function() {
            if (paPickupFilter.hasClassName('selected')) {
                this.setFilterPa(false);
                paPickupFilter.removeClassName('selected');
            } else {
                this.setFilterPa(true);
                paPickupFilter.addClassName('selected');
            }
            this.filter();
        }.bind(this));

        var paPickupFilterResp = $('pa-filter-responsive');
        paPickupFilterResp.observe('click', function() {
            if (paPickupFilterResp.hasClassName('selected')) {
                this.setFilterPa(false);
                paPickupFilterResp.removeClassName('selected');
            } else {
                this.setFilterPa(true);
                paPickupFilterResp.addClassName('selected');
            }
            this.filter();
        }.bind(this));

        /**
         * Register observers specific for the google map.
         */
        google.maps.event.addListener(map, 'zoom_changed', function() {
            if (this.getIsInfoWindowOpen()) {
                return;
            }

            if (map.getZoom() < 14) {
                this.getNearestLocations(true);
            } else {
                this.getLocationsWithinBounds();
            }
        }.bind(this));

        google.maps.event.addListener(map, 'dragstart', function() {
            this.setIsBeingDragged(true);
        }.bind(this));

        google.maps.event.addListener(map, 'dragend', function() {
            this.setIsBeingDragged(false);

            if (map.getZoom() < 14) {
                this.getNearestLocations(true);
            } else {
                this.getLocationsWithinBounds();
            }
        }.bind(this));

        google.maps.event.addListener(this.autocomplete, 'place_changed', this.placeSearch.bind(this));

        return this;
    },

    /**
     * Trigger the google maps resize event. This prevents sizing errors when the map has been initialized in a hidden
     * div.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    triggerResize : function() {
        var map = this.getMap();

        /**
         * Make sure the map keeps it's previous center.
         */
        var center = map.getCenter();

        google.maps.event.trigger(map, "resize");

        map.setCenter(center);

        if (!this.hasMarkers()) {
            this.getLocationsWithinBounds();
        }

        return this;
    },

    /**
     * Open the google maps interface window.
     *
     * @param {Event} event
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    openAddLocationWindow : function(event) {
        if (this.debug) {
            console.info('Opening add location window...');
        }

        /**
         * Stop event propagation and the default action from triggering.
         */
        if (event) {
            event.stop();
        }

        var body = $$('body')[0];
        if (!this.getOptions().isOsc) {
            body.addClassName('responsive-noscroll');
        }

        $$('#postnl_delivery_options .responsive-protector')[0].addClassName('responsive-hidden');
        $$('#postnl_delivery_options .responsive-switch-wrapper ul')[0].addClassName('responsive-hidden');
        $('postnl_back_link').show();

        this.getAddLocationWindow().show();

        /**
         * This causes the map to resize according to the now visible window's viewport.
         */
        this.triggerResize();
        this.recalculateScrollbar();

        document.fire('postnl:domModified');

        return this;
    },

    /**
     * Close the google maps interface window.
     *
     * @param {Event} event
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    closeAddLocationWindow : function(event) {
        if (this.debug) {
            console.info('Closing add location window...');
        }

        /**
         * Stop event propagation and the default action from triggering.
         */
        if (event) {
            event.stop();
        }

        var body = $$('body')[0];
        if (!this.getOptions().isOsc) {
            body.removeClassName('responsive-noscroll');
        }

        $$('#postnl_delivery_options .responsive-protector')[0].removeClassName('responsive-hidden');
        $$('#postnl_delivery_options .responsive-switch-wrapper ul')[0].removeClassName('responsive-hidden');
        $('postnl_back_link').hide();

        this.getAddLocationWindow().hide();

        return this;
    },

    /**
     * Search for an address. The address can be any value, but a postcode or street name is recommended.
     *
     * @param {Event} event
     * @param {String} searchField
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    addressSearch : function(event, searchField) {
        /**
         * If this event was triggered by a keypress, we want to ignore any except the return key.
         */
        if (event && event.keyCode && event.keyCode != Event.KEY_RETURN) {
            return this;
        }

        /**
         * If this event was triggered by the return key and a pac-item was selected, ignore it. The google maps
         * place-changed event will handle it instead.
         */
        if (event
            && event.keyCode
            && event.keyCode == Event.KEY_RETURN
            && $$('.pac-item.pac-item-selected').length > 0
        ) {
            return this;
        }

        /**
         * Stop event propagation and the default action from triggering.
         */
        if (event) {
            event.stop();
        }

        var address = $(searchField).getValue();
        if (!address) {
            return this;
        }

        if (this.debug) {
            console.log('Searching for address:', address);
        }

        /**
         * Search for an address, pan the map to the new location and search for locations nearby.
         */
        this.searchAndPanToAddress(address, true, true);

        return this;
    },

    /**
     * Search for a place. The place will contain an address for google's geocode service to search for.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    placeSearch : function() {
        var searchField = $(this.getOptions().searchField);

        /**
         * Get the currently selected place.
         */
        var place = this.getAutoComplete().getPlace();
        var address = place.formatted_address;

        /**
         * Fix for some locations returning 'Netherlands' as the address. Appears to be a bug in google's autocomplete
         * service.
         */
        if (address == 'Netherlands') {
            address = searchField.getValue();
        }

        if (this.debug) {
            console.log('Searching for address:', address);
        }

        /**
         * Search for the place's address, pan the map to the new location and search for locations nearby.
         */
        this.searchAndPanToAddress(address, true, true);

        /**
         * Hack to force the input element to contain the address of the selected place, rather than the name.
         */
        var input = searchField;
        input.blur();
        setTimeout(function() {
            input.setValue(address);
        }, 1);

        return this;
    },

    /**
     * Search for an address and pan to the new location. Can optionally add a marker to the searched address's location
     * and search for new locations nearby.
     *
     * @param {string}  address      The address to search for.
     * @param {boolean} addMarker    Whether to add a marker to the address's position.
     * @param {boolean} getLocations Whether to search for nearby locations.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    searchAndPanToAddress : function(address, addMarker, getLocations) {
        if (!address) {
            return this;
        }

        this.unselectMarker();

        this.geocode(address, this.panMapToAddress.bind(this, addMarker, getLocations), this.showSearchErrorDiv);

        return this;
    },

    /**
     * Geocode an address and then trigger the success- or failurecallback.
     *
     * @param {string} address
     * @param {function} successCallback
     * @param {function} failureCallback
     *
     * @returns {void}
     */
    geocode : function(address, successCallback, failureCallback) {
        var geocoder = new google.maps.Geocoder();
        var country = this.getDeliveryOptions().getCountry();
        geocoder.geocode(
            {
                address                : address,
                bounds                 : this.map.getBounds(),
                componentRestrictions  : {
                    country : country
                }
            },
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    successCallback.call(this, results, status);
                } else {
                    failureCallback.call(this, results, status);
                }
            }.bind(this)
        );
    },

    /**
     * Pan the map to a set of geocode results. May optionally add a marker to the selected result and search for
     * locations nearby.
     *
     * @param {boolean} addMarker
     * @param {boolean} getLocations
     * @param {Array} results
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    panMapToAddress : function(addMarker, getLocations, results) {
        /**
         * Hide the search error div.
         */
        this.hideSearchErrorDiv();
        var selectedResult = false;

        var country = this.getDeliveryOptions().getCountry();

        /**
         * Loop through all results and validate each to find a suitable result to use.
         */
        results.each(function(result) {
            if (selectedResult !== false) {
                return false;
            }

            /**
             * These are the results that google returns when it actually can't find the address.
             */
            if (result.formatted_address === 'Nederland'
                || result.formatted_address === '8362 Nederland'
                || result.formatted_address === 'The Netherlands'
            ) {
                return false;
            }

            /**
             * Make sure the result is located in the Netherlands.
             */
            var resultIsDomestic = false;
            var components = result.address_components;
            components.each(function(component) {
                if (selectedResult !== false) {
                    return false;
                }

                if (component.short_name != country) {
                    return false;
                }

                resultIsDomestic = true;
                return true;
            });

            if (!resultIsDomestic) {
                return false;
            }

            selectedResult = result;
            return true;
        });

        /**
         * If no result was validated, show the error div.
         */
        if (selectedResult === false) {
            this.showSearchErrorDiv();

            if (this.debug) {
                console.log('No geocoding result found.');
            }

            return this;
        }

        if (this.debug) {
            console.log('Geocoding result:', selectedResult);
        }

        /**
         * Pan the map and zoom to the location.
         */
        var map = this.map;
        var latlng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        map.panTo(latlng);
        if (map.getZoom() < 13) {
            map.setZoom(13);
        }

        /**
         * If we need to search for nearby locations, do so. All existing markers will be removed.
         */
        if (getLocations) {
            this.removeMarkers();
            this.getNearestLocations();
        }

        /**
         * We may need to add a special (actually, it's the default google maps marker) marker to the resulting
         * location.
         */
        if (addMarker) {
            var searchLocationMarker;

            /**
             * Remove any existing searchLocationMarker from the map.
             */
            if (this.getSearchLocationMarker()) {
                this.getSearchLocationMarker().setMap(null);
            }

            /**
             * Create a new marker.
             */
            searchLocationMarker = new google.maps.Marker({
                position  : latlng,
                map       : map,
                title     : selectedResult.formatted_address,
                draggable : false,
                zIndex    : 0
            });

            this.setSearchLocationMarker(searchLocationMarker);
        }

        return this;
    },

    /**
     * Get the element containing the search error message.
     *
     * @returns {Element|boolean}
     */
    getSearchErrorDiv : function() {
        if (this.getDeliveryOptions().getOptions().searchErrorDiv) {
            return $(this.getDeliveryOptions().getOptions().searchErrorDiv);
        }

        return false;
    },

    /**
     * Hide the search error message container.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    hideSearchErrorDiv : function() {
        if (this.getSearchErrorDiv()) {
            this.getSearchErrorDiv().hide();
        }

        return this;
    },

    /**
     * Show the search error message.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    showSearchErrorDiv : function() {
        if (this.getSearchErrorDiv()) {
            this.getSearchErrorDiv().show();
        }

        return this;
    },

    /**
     * Search for nearby locations. Search is based on the current center of the map and the provided delivery date. The
     * result will contain up to 20 locations of varying types.
     *
     * @param {boolean} checkBounds
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    getNearestLocations : function(checkBounds) {
        if (this.debug) {
            console.info('Getting nearest locations...');
        }

        var locationsLoader            = $(this.getOptions().locationsLoader);
        var responsiveLocationsLoader = $(this.getOptions().responsiveLocationsLoader);

        if (checkBounds !== true) {
            checkBounds = false;
        }

        /**
         * Get the map's center.
         */
        var map = this.map;
        var center = map.getCenter();

        /**
         * Abort any in-progress requests.
         */
        if (this.getNearestLocationsRequestObject()) {
            try {
                this.getNearestLocationsRequestObject().transport.abort();
            } catch (e) {
                console.error(e);
            }
        }

        if (this.getLocationsInAreaRequestObject()) {
            try {
                this.getLocationsInAreaRequestObject().transport.abort();
            } catch (e) {
                console.error(e);
            }
        }

        var country = this.getDeliveryOptions().getCountry();

        /**
         * Send a new getNearestLocations request.
         */
        var nearestLocationsRequestObject = new Ajax.PostnlRequest(this.getDeliveryOptions().getLocationsUrl(), {
            method : 'post',
            parameters : {
                lat          : center.lat(),
                'long'       : center.lng(),
                country      : country,
                deliveryDate : this.getDeliveryOptions().getDeliveryDate(),
                isAjax       : true
            },
            onCreate : function() {
                locationsLoader.show();
                responsiveLocationsLoader.show();
            },
            onSuccess : function(response) {
                var responseText = response.responseText;
                if (responseText == 'not_allowed'
                    || responseText == 'invalid_data'
                    || responseText == 'error'
                    || responseText == 'no_result'
                ) {
                    return this;
                }

                var locations = responseText.evalJSON(true);

                /**
                 * Add new markers for the locations we found.
                 */
                this.addMarkers(locations, checkBounds);

                return this;
            }.bind(this),
            onFailure : function() {
                return false;
            },
            onComplete : function() {
                this.setNearestLocationsRequestObject(false);
                locationsLoader.hide();
                responsiveLocationsLoader.hide();
            }.bind(this)
        });

        /**
         * Store the request. That way we can abort it if we need to send another request before this one is done.
         */
        this.setNearestLocationsRequestObject(nearestLocationsRequestObject);

        return this;
    },

    /**
     * Search for locations inside the maps' viewport. Results will contain up to 20 locations of varying types.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    getLocationsWithinBounds : function() {
        if (this.debug) {
            console.info('Getting locations within map bounds...');
        }
        var locationsLoader           = $(this.getOptions().locationsLoader);
        var responsiveLocationsLoader = $(this.getOptions().responsiveLocationsLoader);
        var map = this.map;

        /**
         * Get the bounds of the map. These will be a set of NE and SW coordinates.
         */
        var bounds = map.getBounds();
        var northEast = bounds.getNorthEast();
        var southWest = bounds.getSouthWest();

        /**
         * Abort any in-progress requests.
         */
        if (this.getLocationsInAreaRequestObject()) {
            try {
                this.getLocationsInAreaRequestObject().transport.abort();
            } catch (e) {
                console.error(e);
            }
        }

        if (this.getNearestLocationsRequestObject()) {
            try {
                this.getNearestLocationsRequestObject().transport.abort();
            } catch (e) {
                console.error(e);
            }
        }

        var country = this.getDeliveryOptions().getCountry();

        var locationsInAreaRequestObject = new Ajax.PostnlRequest(this.deliveryOptions.getLocationsInAreaUrl(), {
            method : 'post',
            parameters : {
                northEastLat : northEast.lat(),
                northEastLng : northEast.lng(),
                southWestLat : southWest.lat(),
                southWestLng : southWest.lng(),
                country      : country,
                deliveryDate : this.getDeliveryOptions().getDeliveryDate(),
                isAjax       : true
            },
            onCreate : function() {
                locationsLoader.show();
                responsiveLocationsLoader.show();
            },
            onSuccess : function(response) {
                var responseText = response.responseText;
                if (responseText == 'not_allowed'
                    || responseText == 'invalid_data'
                    || responseText == 'error'
                    || responseText == 'no_result'
                ) {
                    return this;
                }

                var locations = responseText.evalJSON(true);

                /**
                 * Add new markers for the locations we found.
                 */
                this.addMarkers(locations);

                return this;
            }.bind(this),
            onFailure : function() {
                return false;
            },
            onComplete : function() {
                this.setLocationsInAreaRequestObject(false);
                locationsLoader.hide();
                responsiveLocationsLoader.hide();
            }.bind(this)
        });

        this.setLocationsInAreaRequestObject(locationsInAreaRequestObject);

        return this;
    },

    /**
     * Add markers for an array of locations.
     *
     * @param {Array} locations
     *
     * @param {boolean|null} filterBounds
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    addMarkers : function(locations, filterBounds) {
        var markers = [];

        /**
         * If we have existing markers, get those as we will be adding (not replacing) markers.
         */
        if (this.hasMarkers()) {
            markers = this.getMarkers();
        }

        var parsedLocations = [];
        var newLocations = [];

        /**
         * If we have existing locations, get those as we will be adding (not replacing) locations.
         */
        if (this.hasLocations()) {
            parsedLocations = this.getLocations();
        }

        /**
         * Loop through each location to add a marker.
         */
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];

            /**
             * Check that this location's types are allowed. Only if all of the location's types are disallowed is the
             * location skipped.
             */
            var type = location.DeliveryOptions.string;
            var isTypeAllowed = false;
            type.each(function(type) {
                if (this.getDeliveryOptions().isTypeAllowed(type)) {
                    isTypeAllowed = true;
                }
            }.bind(this));

            if (!isTypeAllowed) {
                continue;
            }

            /**
             * Check that this marker doesn't already exist.
             */
            if (this.markerExists(location.LocationCode)) {
                continue;
            }

            /**
             * Get the position of the new marker.
             */
            var markerLatLng = new google.maps.LatLng(location.Latitude, location.Longitude);
            if (filterBounds === true && !this.getMap().getBounds().contains(markerLatLng)) {
                continue;
            }

            /**
             * Format the location's address for the marker's title.
             */
            var markerTitle = location.Name + ', ' + location.Address.Street + ' ' + location.Address.HouseNr;
            if (location.Address.HouseNrExt) {
                markerTitle += ' ' + location.Address.HouseNrExt;
            }

            /**
             * Add the new marker.
             */
            var markerOptions = this.getMarkerOptions(location, markerLatLng, markerTitle);
            var marker = new google.maps.Marker(markerOptions);

            var isPa = false;
            if (type.indexOf('PA') > -1) {
                isPa = true;
            }
            marker.setShape(this.getMarkerShape(isPa));
            marker.setZIndex(markers.length + 1);

            /**
             * Create a new PostNL location object to associate with this marker.
             */
            var parsedLocation = new PostnlDeliveryOptions.Location(
                location,
                this.getDeliveryOptions(),
                type
            );

            /**
             * Attach the marker to the location.
             */
            parsedLocation.setMarker(marker);

            /**
             * Attach the location to the marker.
             */
            marker.locationCode = location.LocationCode;
            marker.location = parsedLocation;

            /**
             * Register some observers for the marker. These will allow the marker to be selected and will change it's
             * icon on hover.
             */
            google.maps.event.addListener(marker, "click", this.markerOnClick.bind(this, marker));
            google.maps.event.addListener(marker, "dblclick", this.markerOnDblClick.bind(this, marker));
            google.maps.event.addListener(marker, "mouseover", this.markerOnMouseOver.bind(this, marker));
            google.maps.event.addListener(marker, "mousedown", this.markerOnMouseDown.bind(this));
            google.maps.event.addListener(marker, "mouseup", this.markerOnMouseUp.bind(this));
            google.maps.event.addListener(marker, "mouseout", this.markerOnMouseOut.bind(this, marker));

            /**
             * Add the marker and the location to the marker and location lists.
             */
            markers.push(marker);
            parsedLocations.push(parsedLocation);
            newLocations.push(parsedLocation);
        }

        if (this.debug) {
            console.log('Processed new locations:', newLocations);
        }

        /**
         * Render the locations.
         */
        this.renderLocations(newLocations);

        this.setLocations(parsedLocations);
        this.setMarkers(markers);

        /**
         * If no marker has been selected, select the first marker.
         */
        if (!this.hasSelectedMarker()) {
            this.selectMarker(markers[0], true, false);
        }

        /**
         * Have the marker's drop sequentially, rather than all at once.
         */
        for (var o = 0, n = 0; n < markers.length; n++) {
            marker = markers[n];
            if (marker.getMap()) {
                continue;
            }

            setTimeout(function(marker) {
                marker.setMap(this.getMap());
            }.bind(this, marker), o * 50);

            o++;
        }

        this.filter();

        return this;
    },

    /**
     * Removes all markers.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    removeMarkers : function() {
        var markers = this.getMarkers();

        /**
         * Remove each marker from the map and unset it.
         */
        markers.each(function(marker) {
            marker.setMap(null);
            marker = null;
        });

        /**
         * Remove all location elements.
         */
        $$('#scrollbar_content li.location').each(function(location) {
            location.remove();
        });

        $$('#responsive_location_list li.location-details').each(function(location) {
            location.remove();
        });

        /**
         * Reset the markers array.
         */
        this.setMarkers([]);

        this.getScrollbar().reset();
        this.recalculateScrollbar();
        return this;
    },

    /**
     * Render location elements.
     *
     * @param {Array} locations
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    renderLocations : function(locations) {
        if (locations.length < 1) {
            return this;
        }

        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];

            /**
             * Only the first request can render it's distance to the searched address. Future requests will no longer
             * be accurate enough to display.
             */
            var renderDistance = true;
            if (this.hasMarkers()) {
                renderDistance = false;
            }

            location.renderAsMapLocation('scrollbar_content', 'responsive_location_list', renderDistance);
        }

        this.recalculateScrollbar();

        document.fire('postnl:domModified');

        return this;
    },

    /**
     * Checks if a marker already exists for a specified location.
     *
     * @param {string} location
     *
     * @returns {boolean}
     */
    markerExists : function(location) {
        var markers = this.getMarkers();

        for (var i = 0; i < markers.length; i++) {
            if (markers[i].locationCode == location) {
                return true;
            }
        }

        return false;
    },

    /**
     * Select a marker.
     *
     * @param {*}       marker   The marker to select.
     * @param {boolean} scrollTo Whether the locations list should scroll to the selected marker's location element.
     * @param {boolean} panTo    Whether the map should pan to the selected marker.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    selectMarker : function(marker, scrollTo, panTo) {
        /**
         * If the marker is already selected, we don't have to do anything.
         */
        if (this.hasSelectedMarker()
            && this.getSelectedMarker().location
            && marker.location
            && this.getSelectedMarker().location.getMapElement().identify()
                == marker.location.getMapElement().identify()
        ) {
            if (panTo) {
                this.panToMarker(marker);
            }

            if (scrollTo) {
                this.scrollToMarker(marker);
            }

            return this;
        }

        if (!marker.location) {
            return this;
        }

        var element = false;
        if (marker.location.getMapElement()) {
            element = marker.location.getMapElement();
        }

        var responsiveElement = false;
        if (marker.location.getResponsiveMapElement()) {
            responsiveElement = marker.location.getResponsiveMapElement();
        }

        var isPa = false;
        if (marker.location.getType().indexOf('PA') > -1) {
            isPa = true;
        }

        /**
         * Update the marker's icon and the marker's location's classname.
         */
        marker.setIcon(this.getMapIconSelected(marker.location));
        marker.setShape(this.getSelectedMarkerShape(isPa));

        if (!marker.oldZIndex) {
            marker.oldZIndex = marker.getZIndex();
        }
        marker.setZIndex(this.getMarkers().length + 1);

        if (element) {
            element.addClassName('selected');
        }

        if (responsiveElement) {
            responsiveElement.select('.radio')[0].addClassName('selected');
        }

        this.unselectMarker();

        /**
         * If required, scroll to the marker's location in the locations list.
         */
        if (scrollTo && element) {
            this.getScrollbar().scrollTo(
                element.offsetTop - $('scrollbar_content').offsetTop - 36, true
            );
        }

        if (this.debug) {
            console.log('Marker selected:', marker);
        }

        /**
         * Set this marker as the selected marker.
         */
        this.setSelectedMarker(marker);

        /**
         * Pan the map to the marker's position if required.
         */
        if (panTo) {
            this.panToMarker(marker);
        }

        this.enableSaveButton();

        return this;
    },

    /**
     * Pans the map to a specified marker's position.
     *
     * @param {*} marker
     * @returns {PostnlDeliveryOptions.Map}
     */
    panToMarker : function(marker) {
        this.getMap().panTo(marker.getPosition());

        var streetView = this.getMap().getStreetView();

        if (streetView !== undefined && streetView.getVisible()) {
            streetView.setPosition(marker.getPosition());
        }

        return this;
    },

    /**
     * @param marker
     * @returns {PostnlDeliveryOptions.Map}
     */
    scrollToMarker : function(marker) {
        element = marker.location.getMapElement();

        if (!element) {
            return this;
        }

        this.getScrollbar().scrollTo(
            element.offsetTop - $('scrollbar_content').offsetTop - 36, true
        );

        return this;
    },

    /**
     * Unselect the currently selected marker.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    unselectMarker : function() {
        if (!this.hasSelectedMarker()) {
            return this;
        }

        var marker = this.getSelectedMarker();
        marker.setIcon(this.getMapIcon(marker.location));

        if (marker.location && marker.location.getMapElement()) {
            marker.location.getMapElement().removeClassName('selected');
        }

        if (marker.location && marker.location.getResponsiveMapElement()) {
            marker.location.getResponsiveMapElement().select('.radio')[0].removeClassName('selected');
        }

        var isPa = false;
        if (typeof location.type != 'undefined'
            && location.getType().indexOf('PA') > -1
        ) {
            isPa = true;
        }
        marker.setShape(this.getMarkerShape(isPa));
        marker.setZIndex(marker.oldZIndex ? marker.oldZIndex : 0);
        marker.oldZIndex = false;

        this.setSelectedMarker(false);

        return this;
    },

    /**
     * @param {*} marker
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    markerOnClick : function(marker) {
        if (this.getIsInfoWindowOpen()) {
            return this;
        }

        this.selectMarker(marker, true, true);

        return this;
    },

    /**
     * @param {*} marker
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    markerOnDblClick : function(marker) {
        if (this.getIsInfoWindowOpen()) {
            return this;
        }

        this.selectMarker(marker, true, true);
        this.saveLocation();

        return this;
    },

    /**
     * Update the marker's icon on mouseover.
     *
     * @param {*} marker
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    markerOnMouseOver : function(marker) {
        /**
         * Don't do anything if the map is currently being dragged.
         */
        if (this.getIsBeingDragged() || this.getIsInfoWindowOpen()) {
            return this;
        }

        /**
         * Only update the marker is it's not the currently selected marker.
         */
        if (!this.getSelectedMarker()
            || this.getSelectedMarker().location.getMapElement().identify()
                != marker.location.getMapElement().identify()
        ) {
            if (!marker.oldZIndex) {
                marker.oldZIndex = marker.getZIndex();
            }
            marker.setZIndex(this.getMarkers().length + 2);
            marker.setIcon(this.getMapIconSelected(marker.location));
            marker.setShape(false); //remove any shape, as the new icon has a different shape. This could cause
                                    //flickering.
        }

        marker.location.getMapElement().setStyle({
            backgroundColor : '#f2f2f2'
        });

        return this;
    },

    markerOnMouseDown : function()
    {
        this.setIsBeingDragged(true);
    },

    markerOnMouseUp : function()
    {
        this.setIsBeingDragged(false);
    },


    /**
     * Update the marker's icon on mouseout.
     *
     * @param {*} marker
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    markerOnMouseOut : function(marker) {
        /**
         * Don't do anything if the map is currently being dragged.
         */
        if (this.getIsBeingDragged() || this.getIsInfoWindowOpen()) {
            return this;
        }

        /**
         * Only update the marker is it's not the currently selected marker.
         */
        if (!this.getSelectedMarker()
            || this.getSelectedMarker().location.getMapElement().identify() != marker.location.getMapElement().identify()
        ) {
            var isPa = false;
            if (marker.location.getType().indexOf('PA') > -1) {
                isPa = true;
            }

            marker.setZIndex(marker.oldZIndex ? marker.oldZIndex : 0);
            marker.setIcon(this.getMapIcon(marker.location));
            marker.setShape(this.getMarkerShape(isPa));
            marker.oldZIndex = false;
        }

        marker.location.getMapElement().writeAttribute('style', '');

        return this;
    },

    /**
     * Save a selected location as a new pickup location.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    saveLocation : function() {
        if (this.debug) {
            console.info('Saving selected location...');
        }
        var deliveryOptions = this.getDeliveryOptions();

        /**
         * Get the selected location.
         */
        var customLocation = this.getSelectedMarker().location;
        if (!customLocation) {
            return this;
        }

        /**
         * Remove any previously saved locations.
         */
        $$('#customlocation li').each(function(element) {
            element.remove();
        });

        /**
         * Remove the previously saved location from the stored locations list.
         */
        var currentSelectedLocationIndex = deliveryOptions.locations.indexOf(
            deliveryOptions.customLocation
        );

        if (currentSelectedLocationIndex > -1) {
            deliveryOptions.locations.splice(currentSelectedLocationIndex, 1);
        }


        if (!this.locationExists(customLocation, true)) {
            /**
             * Set this location as the (new) selected location.
             */
            deliveryOptions.customLocation = customLocation;

            /**
             * Add the location to the stored locations list and render it.
             */
            deliveryOptions.locations.push(customLocation);
            customLocation.render('customlocation');

            /**
             * Select the new element.
             */
            var elements = customLocation.getElements();
            if (elements.PA) {
                deliveryOptions.selectLocation(elements.PA);
            } else if (elements.PGE && this.getFilterEarly()) {
                deliveryOptions.selectLocation(elements.PGE);
            } else {
                deliveryOptions.selectLocation(elements.PG);
            }
        }

        /**
         * Update the frontend
         */
        if (this.getOptions().isOsc) {
            deliveryOptions.saveOscOptions();
        }

        /**
         * Close the google maps interface window.
         */
        this.closeAddLocationWindow();

        document.fire('postnl:domModified');

        return this;
    },

    /**
     * Check if a new custom location already exists.
     *
     * @param {PostnlDeliveryOptions.Location} customLocation
     * @param {boolean}                        select
     *
     * @returns {boolean}
     */
    locationExists : function(customLocation, select) {
        var deliveryOptions = this.getDeliveryOptions();

        /**
         * Check if this location is already available as the default PGE location. If so, select it and close the
         * window.
         */
        if (deliveryOptions.getPgeLocation() &&
            customLocation.getLocationCode() == deliveryOptions.getPgeLocation().getLocationCode()
        ) {
            if (select) {
                deliveryOptions.selectLocation(deliveryOptions.getPgeLocation().getElements().PGE);
            }

            return true;
        }


        /**
         * Check if this location is already available as the default PGE location. If so, select it and close the
         * window.
         */
        if (deliveryOptions.getPgLocation() &&
            customLocation.getLocationCode() == deliveryOptions.getPgLocation().getLocationCode()
        ) {
            if (select) {
                deliveryOptions.selectLocation(deliveryOptions.getPgLocation().getElements().PG);
            }

            return true;
        }

        /**
         * Check if this location is already available as the default PG location. If so, select it and close the
         * window.
         */
        if (deliveryOptions.getPaLocation() &&
            customLocation.getLocationCode() == deliveryOptions.getPaLocation().getLocationCode()
        ) {
            if (select) {
                deliveryOptions.selectLocation(deliveryOptions.getPaLocation().getElements().PA);
            }

            return true;
        }

        return false;
    },

    /**
     * Open the location info window.
     *
     * @param {string} content
     * @param {string} code
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    openLocationInfoWindow : function(content, code) {
        if (this.getMap().getStreetView().getVisible()) {
            return this;
        }

        this.setIsInfoWindowOpen(true);

        var locationInfoWindow = $('location-info-window');
        var map                = this.getMap();
        var mapOptions         = this.getMapOptions();

        mapOptions.draggable              = false;
        mapOptions.scrollwheel            = false;
        mapOptions.zoomControl            = false;
        mapOptions.streetViewControl      = false;
        mapOptions.disableDoubleClickZoom = true;
        mapOptions.center                 = map.getCenter();

        map.setOptions(mapOptions);

        $$('#location-info-window div').each(function(element) {
            element.remove();
        });

        locationInfoWindow.insert({
            top: content
        });

        if (code) {
            locationInfoWindow.setAttribute('data-locationcode', code);
        } else {
            locationInfoWindow.removeAttribute('data-locationcode');
        }

        locationInfoWindow.show();

        document.fire('postnl:domModified');

        return this;
    },

    /**
     * Close the location info window.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    closeLocationInfoWindow : function() {

        var locationInfoWindow = $('location-info-window');
        var map = this.getMap();
        var mapOptions = this.getMapOptions();

        mapOptions.draggable = true;
        mapOptions.center = map.getCenter();

        map.setOptions(mapOptions);

        $$('#location-info-window div').each(function(element) {
            element.remove();
        });

        locationInfoWindow.removeAttribute('data-locationcode');
        locationInfoWindow.hide();

        this.setIsInfoWindowOpen(false);

        return this;
    },

    /**
     * Filter visible markers and locations based on currently applied filters.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    filter : function() {
        var filterEarly       = this.getFilterEarly();
        var filterEvening     = this.getFilterEvening();
        var filterPa          = this.getFilterPa();
        var locations         = this.getLocations();
        var hasVisibleMarkers = false;

        locations.each(function(location) {
            var type = location.getType();
            if (filterEarly) {
                if (type.indexOf('PGE') < 0 && type.indexOf('PA') < 0) {
                    location.getMapElement().hide();
                    location.getResponsiveMapElement().hide();
                    location.getMarker().setVisible(false);

                    return false;
                }
            }

            if (filterEvening) {
                if (!location.getIsEveningLocation()) {
                    location.getMapElement().hide();
                    location.getResponsiveMapElement().hide();
                    location.getMarker().setVisible(false);

                    return false;
                }
            }

            if (filterPa) {
                if (type.indexOf('PA') < 0) {
                    location.getMapElement().hide();
                    location.getResponsiveMapElement().hide();
                    location.getMarker().setVisible(false);

                    return false;
                }
            }

            location.getMapElement().show();
            location.getResponsiveMapElement().show();
            location.getMarker().setVisible(true);

            hasVisibleMarkers = true;

            return true;
        }.bind(this));

        if (this.hasSelectedMarker()) {
            var selectedMarker = this.getSelectedMarker();
            if (!selectedMarker.getVisible()) {
                this.unselectMarker();
            }
        }

        if (hasVisibleMarkers === true) {
            $('no_locations_error').hide();
            $('no_locations_error_responsive').hide();
            if (this.hasSelectedMarker()) {
                this.enableSaveButton();
            }
        } else {
            $('no_locations_error').show();
            $('no_locations_error_responsive').show();
        }

        this.recalculateScrollbar();

        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions.Map}
     * deprecated since v1.15.1
     */
    disableSaveButton : function() {
        if (this.getSaveButton().disabled) {
            return this;
        }

        this.getSaveButton().disabled = true;
        if (!this.getSaveButton().hasClassName('disabled')) {
            this.getSaveButton().addClassName('disabled');
        }

        document.fire('postnl:domModified');

        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions.Map}
     */
    enableSaveButton : function() {
        if (!this.getSaveButton().disabled) {
            return this;
        }

        this.getSaveButton().disabled = false;
        if (this.getSaveButton().hasClassName('disabled')) {
            this.getSaveButton().removeClassName('disabled');
        }

        document.fire('postnl:domModified');

        return this;
    },

    /**
     * Recalculate the scrollbar after the scrollbar contents were changed and make sure the scrollbar stays in the
     * same position.
     *
     * @returns {PostnlDeliveryOptions.Map}
     */
    recalculateScrollbar : function() {
        var scrollbar = this.getScrollbar();
        var scrollbarOffset = scrollbar.slider.value;

        scrollbar.recalculateLayout();
        scrollbar.scrollTo(scrollbarOffset * scrollbar.getCurrentMaximumDelta());

        return this;
    }
});

/**
 * A PostNL PakjeGemak, PakjeGemak Express or parcel dispenser location. Contains address information, opening hours,
 * the type of location and any html elements associated to this location.
 */
PostnlDeliveryOptions.Location = new Class.create({
    elements             : [],
    tooltipElement       : null,
    mapElement           : null,
    responsiveMapElement : null,
    tooltipClassName     : null,

    address              : {},
    distance             : null,
    latitude             : null,
    longitude            : null,
    name                 : null,
    phoneNumber          : null,
    openingHours         : null,
    locationCode         : null,
    date                 : null,
    retailNetworkID      : null,

    deliveryOptions      : null,
    type                 : [],
    isEveningLocation    : false,

    marker               : false,

    oldCenter            : false,

    /**
     * Constructor method.
     *
     * @constructor
     *
     * @param {object}                location        The PostNL location JSON object returned by PostNL's webservices
     *                                                associated with this location.
     * @param {PostnlDeliveryOptions} deliveryOptions The current deliveryOptions object with which this location is
     *                                                associated.
     * @param {Array}                 type            An array of PostNL location types. possible options include PE,
     *                                                PGE and PA.
     *
     * @returns {void}
     */
    initialize : function(location, deliveryOptions, type) {
        var pickupDate = deliveryOptions.getPickupDate();
        var today = new Date();
        var formattedToday = PostnlDeliveryOptions.prototype.formatDate(today);

        if (pickupDate == formattedToday) {
            today.setTime(today.getTime() + 86400000);
            pickupDate = PostnlDeliveryOptions.prototype.formatDate(today);
        }

        this.address           = location.Address;
        this.distance          = location.Distance;
        this.latitude          = location.Latitude;
        this.longitude         = location.Longitude;
        this.name              = location.Name;
        this.phoneNumber       = location.PhoneNumber;
        this.openingHours      = location.OpeningHours;
        this.locationCode      = location.LocationCode.replace(/\s+/g, ''); //remove whitespace from the location code
        this.date              = pickupDate;
        this.isEveningLocation = location.isEvening;
        this.retailNetworkID   = location.RetailNetworkID;

        this.deliveryOptions   = deliveryOptions;

        this.type = type;
    },

    /******************************
     *                            *
     *  GETTER AND SETTER METHODS *
     *                            *
     ******************************/

    getElements : function() {
        return this.elements;
    },

    setElements : function(elements) {
        this.elements = elements;

        return this;
    },

    setTooltipElement : function(element) {
        this.tooltipElement = element;

        return this;
    },

    getMapElement : function() {
        return this.mapElement;
    },

    setMapElement : function(mapElement) {
        this.mapElement = mapElement;

        return this;
    },

    getResponsiveMapElement : function() {
        return this.responsiveMapElement;
    },

    setResponsiveMapElement : function(mapElement) {
        this.responsiveMapElement = mapElement;

        return this;
    },

    getTooltipClassName : function() {
        var className = this.tooltipClassName;

        if (className) {
            return className;
        }

        if ($$('.tooltip.first').length < 1) {
            this.setTooltipClassName('first');
            return 'first';
        }

        if ($$('.tooltip.second').length < 1) {
            this.setTooltipClassName('first');
            return 'second';
        }

        if ($$('.tooltip.third').length < 1) {
            this.setTooltipClassName('first');
            return 'third';
        }

        return 'fourth';
    },

    setTooltipClassName : function(className) {
        this.tooltipClassName = className;

        return this;
    },

    getAddress : function() {
        return this.address;
    },

    getDistance : function() {
        return this.distance;
    },

    getName : function() {
        return this.name;
    },

    getPhoneNumber : function() {
        return this.phoneNumber;
    },

    getOpeningHours : function() {
        return this.openingHours;
    },

    getLocationCode : function() {
        return this.locationCode;
    },

    getDate : function() {
        return this.date;
    },

    setDate : function(date) {
        this.date = date;

        return this;
    },

    getDeliveryOptions : function() {
        return this.deliveryOptions;
    },

    getType : function() {
        return this.type;
    },

    getOptions : function() {
        return this.getDeliveryOptions().getOptions();
    },

    getMarker : function() {
        if (this.marker) {
            return this.marker;
        }

        var markers = this.getMap().getMarkers();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (marker.locationCode == this.getLocationCode()) {
                this.setMarker(marker);
                return marker;
            }
        }

        return false;
    },

    setMarker : function(marker) {
        this.marker = marker;

        return this;
    },

    getOldCenter : function() {
        return this.oldCenter;
    },

    setOldCenter : function(oldCenter) {
        this.oldCenter = oldCenter;

        return this;
    },

    getIsEveningLocation : function() {
        return this.isEveningLocation;
    },

    getMap : function() {
        return this.getDeliveryOptions().getDeliveryOptionsMap();
    },

    /**
     * Render the location and attach it to the supplied parent element.
     *
     * @param {string|boolean} parent       The parent element's ID.
     * @param {string|null}    typeToRender
     * @param {boolean|null}   noTooltip
     *
     * @return {PostnlDeliveryOptions.Location|string}
     */
    render : function(parent, typeToRender, noTooltip) {
        var elements = {};
        var element;
        var deliveryDate = this.getDate();
        var date = new Date(
            deliveryDate.substring(6, 10),
            deliveryDate.substring(3, 5) - 1,
            deliveryDate.substring(0, 2)
        );
        var availableDeliveryDate = this.getDeliveryDate(date);
        var paClassName = '';

        if (this.getType().indexOf('PA') > -1) {
            paClassName = 'pa-location';
        }

        this.counter = 0;

        /**
         * Get the html for this location's header.
         */
        var headerHtml = '';
        headerHtml += '<li id="location_header_' + this.getLocationCode() + '" class="location ' + paClassName + '">';
        headerHtml += '<div class="bkg">';
        headerHtml += '<div class="bkg">';
        headerHtml += '<div class="content">';
        headerHtml += '<a href="#" title="'
                    + Translator.translate('Show on the map')
                    + '" class="show-map overflow-protect" id="show_map_'
                    + this.getLocationCode()
                    + '">';
        headerHtml += '<strong class="location-name overflow-protect">' + this.getName() + '</strong>';

        headerHtml += '<span class="location-distance-text">' + this.getDistanceText() + '</span>';

        headerHtml += '</a>';

        if (!noTooltip) {
            headerHtml += '<div class="tooltip-container">';
            headerHtml += '<a class="location-info" id="tooltip_anchor_'
                        + this.getLocationCode()
                        + '">';
            headerHtml += '<span>' + Translator.translate('More Info') + '</span>';
            headerHtml += '</a>';

            headerHtml += this.getTooltipHtml();
            headerHtml += '</div>';
        }

        headerHtml += '<a class="responsive-tooltip-open" id="location_tooltip_'
                    + this.getLocationCode()
                    + '_responsive_open">'
                    + Translator.translate('More Info')
                    + '</a>';
        headerHtml += '</div>';
        headerHtml += '</div>';
        headerHtml += '</div>';
        headerHtml += '</li>';

        if (!noTooltip) {
            headerHtml += '<li class="responsive-tooltip" id="location_tooltip_'
                        + this.getLocationCode()
                        + '_responsive" style="display:none;">';
            headerHtml += '<div class="content">';
            headerHtml += this.getResponsiveTooltipHtml();
            headerHtml += '<div class="close-wrapper" id="location_tooltip_'
                        + this.getLocationCode()
                        + '_responsive_close">';
            headerHtml += '<a class="responsive-tooltip-close">' + Translator.translate('Close') + '</a>';
            headerHtml += '</div>';
            headerHtml += '</div>';
            headerHtml += '</li>';
        }

        /**
         * Attach the header to the bottom of the parent element.
         */
        if (parent) {
            $(parent).insert({
                bottom: headerHtml
            });
        }

        if (typeToRender) {
            element = this.renderOption(typeToRender, availableDeliveryDate, false, true);
            return headerHtml + element;
        }

        /**
         * Add an element for each of this location's types. Most often this will be a a single element or a PE and PGE
         * element.
         */
        this.getType().each(function(type) {

            var today = new Date();

            var todayDay = today.getDate();
            var todayMonth = today.getMonth();
            var todayYear = today.getYear();

            var availableDay = availableDeliveryDate.getDate();
            var availableMonth = availableDeliveryDate.getMonth();
            var availableYear = availableDeliveryDate.getYear();

            //Since it is not possible to ship to a PG location on the same day, add 1 day to the deliveryOption if the
            //found available deliverydate is today.
            if (todayDay == availableDay && todayMonth == availableMonth && todayYear == availableYear) {
                availableDeliveryDate.setTime(availableDeliveryDate.getTime() + 86400000);
            }

            /**
             * Early pickup PG is not allowed on monday.
             */
            if (!(availableDeliveryDate.getDay() === 1 && type === 'PGE')) {
                element = this.renderOption(type, availableDeliveryDate, parent, false);
                if (element) {
                    elements[type] = element;
                }
            }
        }.bind(this));

        /**
         * Save all newly created elements.
         */
        this.setElements(elements);

        /**
         * Add observers to display the tooltip on mouse over and the responsive tooltip on click.
         */
        var locationHeader          = $('location_header_' + this.getLocationCode());
        var tooltipElement          = $('location_tooltip_' + this.getLocationCode());
        var showOnMapAnchor         = $('show_map_' + this.getLocationCode());
        var responsiveTooltipAnchor = $('location_tooltip_' + this.getLocationCode() + '_responsive_open');
        var responsiveTooltip       = $('location_tooltip_' + this.getLocationCode() + '_responsive');
        var responsiveTooltipClose  = $('location_tooltip_' + this.getLocationCode() + '_responsive_close');

        locationHeader.observe('click', function() {
            var responsiveSwitch = $('responsive_switch');
            if (!responsiveSwitch || getComputedStyle(responsiveSwitch).display == 'none') {
                return;
            }

            responsiveTooltipAnchor.triggerEvent('click');
        });

        showOnMapAnchor.observe('click', function(event) {
            event.stop();

            /**
             * If the responsive switcher is shown, modify the observer so it shows the tooltip instead.
             */
            var responsiveSwitch = $('responsive_switch');
            if (responsiveSwitch && getComputedStyle(responsiveSwitch).display != 'none') {
                responsiveTooltipAnchor.triggerEvent('click');

                return;
            }

            this.getMap().openAddLocationWindow();

            if (this.getMarker() !== false) {
                this.getMap().selectMarker(this.getMarker(), true, true);
            }
        }.bind(this));

        responsiveTooltipAnchor.observe('click', function(event) {
            event.stop();

            var tooltipShown = (getComputedStyle(responsiveTooltip).display != 'none');

            $$('.responsive-tooltip').invoke('hide');

            if (!tooltipShown) {
                responsiveTooltip.show();
            }
        }.bind(this));

        responsiveTooltipClose.observe('click', function(event) {
            event.stop();

            $$('.responsive-tooltip').invoke('hide');
        }.bind(this));

        this.setTooltipElement(tooltipElement);

        return this;
    },

    /**
     * @param {string}         type
     * @param {Date}           availableDeliveryDate
     * @param {string|boolean} parent
     * @param {boolean|null}   toHtml
     *
     * @returns {Element|string|boolean}
     */
    renderOption : function(type, availableDeliveryDate, parent, toHtml) {
        if (!this.getDeliveryOptions().isTypeAllowed(type)) {
            return false;
        }

        var id = 'location_' + this.getLocationCode() + '_' + type;

        var optionHtml = '';
        optionHtml += '<li class="option" id="' + id + '">';
        optionHtml += '<div class="bkg">';
        optionHtml += '<div class="bkg">';
        optionHtml += '<div class="content">';

        var spanClass = 'option-dd';
        if (!this.getDeliveryOptions().isDeliveryDaysAllowed()) {
            spanClass += ' no-display';
        }
        optionHtml += '<span class="' + spanClass + '">';

        /**
         * Only the first element will display the delivery date.
         */
        if (this.counter < 1) {
            optionHtml += '<strong class="option-day">'
                + this.getDeliveryOptions().getWeekdays()[availableDeliveryDate.getDay()]
                + '</strong>';
            optionHtml += '<span class="option-date">'
                + ('0' + availableDeliveryDate.getDate()).slice(-2)
                + '-'
                + ('0' + (availableDeliveryDate.getMonth() + 1)).slice(-2)
                + '</span>';
        }

        optionHtml += '</span>';
        optionHtml += '<span class="option-radio"></span>';

        /*
         * Opening times are hardoded as 9:00 A.M. for PGE locations and 4:00 P.M. for other loations.
         */
        if (type == 'PGE') {
            optionHtml += '<span class="option-time">' + Translator.translate('from') + ' 9:00</span>';
        } else {
            optionHtml += '<span class="option-time">' + Translator.translate('from') + ' 15:00</span>';
        }

        optionHtml += '<span class="option-comment">' + this.getCommentHtml(type) + '</span>';
        optionHtml += '</div>';
        optionHtml += '</div>';
        optionHtml += '</div>';
        optionHtml += '</li>';
        if (toHtml) {
            return optionHtml;
        }

        /**
         * Attach the element to the bottom of the parent element.
         */
        $(parent).insert({
            bottom: optionHtml
        });

        var element = $(id);

        /**
         * Add an onclick observer that will select the location.
         */
        element.observe('click', function(element, event) {
            event.stop();

            if (element.hasClassName('active')) {
                return false;
            }

            this.getDeliveryOptions().selectLocation(element);
            return true;
        }.bind(this, element));

        this.counter++;
        return element;
    },

    /**
     * Gets the comment html for this location. The comment contains any additional fees incurred by choosing this option and, in
     * the case of a parcel dispenser location, the fact that it is available 24/7.
     *
     * @param {string} type
     *
     * @return {string}
     */
    getCommentHtml : function(type) {
        var commentHtml = '';

        /**
         * Additional fees may only be charged for PakjeGemak Express locations.
         */
        if (type == 'PGE') {
            var extraCosts = this.getOptions().expressFeeText;
            var extraCostHtml = '';

            if (this.getOptions().expressFeeIncl) {
                extraCostHtml += ' + ' + extraCosts;
            }

            commentHtml = Translator.translate('early delivery') + extraCostHtml;
        }

        return commentHtml;
    },

    /**
     * Get an available delivery date. This method checks the opening times of this location to make sure the location
     * is open when the order is delivered. If not it will check the day after, and the day after that, and so on.
     *
     * Note that this method is recursive and uses the optional parameter n to prevent infinite loops.
     *
     * @param {Date}        date
     * @param {number|void} n    The number of tries that have been made to find a valid delivery date.
     *
     * @returns {Date}
     */
    getDeliveryDate : function(date, n) {
        /**
         * If this is the first attempt, set n to 0
         */
        if (typeof n == 'undefined') {
            n = 0;
        }
        /**
         * If over 7 attempts have been made, return the current date (it should be 1 week after the first attempt).
         */
        if (n > 7) {
            return date;
        }
        var openingDays = this.getOpeningHours();
        /**
         * Check if the location is open on the specified day of the week.
         */
        var openingHours = false;
        switch (date.getDay()) {
            case 0:
                openingHours = false;
                break;
            case 1:
                if (openingDays.Monday) {
                    openingHours = openingDays.Monday.string;
                }
                break;
            case 2:
                if (openingDays.Tuesday) {
                    openingHours = openingDays.Tuesday.string;
                }
                break;
            case 3:
                if (openingDays.Wednesday) {
                    openingHours = openingDays.Wednesday.string;
                }
                break;
            case 4:
                if (openingDays.Thursday) {
                    openingHours = openingDays.Thursday.string;
                }
                break;
            case 5:
                if (openingDays.Friday) {
                    openingHours = openingDays.Friday.string;
                }
                break;
            case 6:
                if (openingDays.Saturday) {
                    openingHours = openingDays.Saturday.string;
                }
                break;
        }

        /**
         * If no openinghours are found for this day, or if the location is closed; check the next day.
         */
        if (!openingHours
            || openingHours.length < 1
            || openingHours[0] == ''
        ) {
            var nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            /**
             * If the next day is Monday, get Tuesday as next day.
             */
            if (nextDay.getDay() == 1) {
                nextDay.setDate(date.getDate() + 2);
            }
            return this.getDeliveryDate(nextDay, n + 1);
        }

        var formattedDate = ('0' + date.getDate()).slice(-2)
                          + '-'
                          + ('0' + (date.getMonth() + 1)).slice(-2)
                          + '-'
                          + date.getFullYear();
        this.setDate(formattedDate);

        return date;
    },

    /**
     * Create the html for this location's tooltip. The tooltip contains address information as well as information regarding
     * the opening hours of this location.
     *
     * @return {string}
     */
    getTooltipHtml : function() {
        /**
         * Get the base tooltip html and the address info.
         */
        var address = this.getAddress();
        var addressText = address.Street + ' ' + address.HouseNr;
        if (address.HouseNrExt) {
            addressText += address.HouseNrExt;
        }
        addressText += '  ' + Translator.translate('in') + ' ' + address.City;

        var html = '<div class="tooltip '
                 + this.getTooltipClassName()
                 + '" id="location_tooltip_'
                 + this.getLocationCode()
                 + '">';
        html += '<div class="tooltip-header">';
        html += '<strong class="location-name">' + this.getName() + '</strong>';
        html += '<strong class="location-address">' + addressText + '</strong>';
        html += '</div>';
        html += '<hr class="tooltip-divider" />';
        html += '<div class="tooltip-content">';
        html += '<table class="business-hours">';
        html += '<thead>';
        html += '<tr>';
        html += '<th colspan="2">' + Translator.translate('Business Hours') + '</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        html += this.getOpeningHoursHtml();

        /**
         * Close all elements and return the result.
         */
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';

        return html;
    },

    /**
     * Create the responsive html for this location's tooltip. The tooltip contains address information as well as
     * information regarding the opening hours of this location.
     *
     * @return {string}
     */
    getResponsiveTooltipHtml : function() {
        /**
         * Get the base tooltip html and the address info.
         */
        var address = this.getAddress();
        var addressText = address.Street + ' ' + address.HouseNr;
        if (address.HouseNrExt) {
            addressText += address.HouseNrExt;
        }
        addressText += '  ' + Translator.translate('in') + ' ' + address.City;

        html = '<strong class="location-address">' + addressText + '</strong>';
        html += '<hr class="divider" />';
        html += '<table class="business-hours">';
        html += '<thead>';
        html += '<tr>';
        html += '<th colspan="2">' + Translator.translate('Business Hours') + '</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        html += this.getOpeningHoursHtml();

        /**
         * Close all elements and return the result.
         */
        html += '</tbody>';
        html += '</table>';

        return html;
    },

    /**
     * Gets html for this location's business hours.
     *
     * Html will be formatted as tr and td elements. This method expects the calling method to provide a container
     * table.
     *
     * @returns {string}
     */
    getOpeningHoursHtml : function() {
        var html = '';

        /**
         * Add the opening hours for every day of the week.
         */
        var openingHours = this.getOpeningHours();

        /**
         * Monday
         */
        html += this.getOpeningHoursRow('Mo', openingHours.Monday);

        /**
         * Tuesday
         */
        html += this.getOpeningHoursRow('Tu', openingHours.Tuesday);

        /**
         * Wednesday
         */
        html += this.getOpeningHoursRow('We', openingHours.Wednesday);

        /**
         * Thursday
         */
        html += this.getOpeningHoursRow('Th', openingHours.Thursday);

        /**
         * Friday
         */
        html += this.getOpeningHoursRow('Fr', openingHours.Friday);

        /**
         * Saturday
         */
        html += this.getOpeningHoursRow('Sa', openingHours.Saturday);

        /**
         * Sunday
         */
        html += this.getOpeningHoursRow('Su', openingHours.Sunday);

        return html;
    },

    /**
     * @param {string} day
     * @param openingHours
     * @returns {string}
     */
    getOpeningHoursRow : function(day, openingHours) {
        var html = '';
        html += '<tr>';
        html += '<th valign="top">' + Translator.translate(day) + '</th>';
        if (openingHours && openingHours.string && openingHours.string.join() != '') {
            html += '<td>' + (openingHours.string.join('<br />')).replace(/-/g, ' - ') + '</td>';
        } else {
            html += '<td>' + Translator.translate('Closed') + '</td>';
        }
        html += '</tr>';

        return html;
    },

    /**
     * Render this location as a map element. Map elements appear in a list below the google maps interface.
     *
     * @param {string}  parent
     * @param {string}  responsiveParent
     * @param {boolean} renderDistance
     *
     * @returns {PostnlDeliveryOptions.Location}
     */
    renderAsMapLocation : function(parent, responsiveParent, renderDistance) {
        var address = this.getAddress();

        /**
         * Format the address.
         */
        var addressText = address.Street + ' ' + address.HouseNr;
        if (address.HouseNrExt) {
            addressText += address.HouseNrExt;
        }
        addressText += ', ' + address.City;

        /**
         * Format the distance to the last searched address.
         */
        var distance = parseInt(this.getDistance());
        var distanceText = '';

        if (renderDistance) {
            distanceText = this.getDistanceText();
        }

        var businessHoursText = '';
        if (this.getType().indexOf('PA') > -1) {
            businessHoursText = Translator.translate('parcel dispenser');
        } else {
            businessHoursText = Translator.translate('business hours');
        }

        var id = 'map-location_' + this.getLocationCode();

        /**
         * Build the element's html.
         */
        var html = '<li class="location" id="' + id + '">';
        html += '<div class="content">';

        var imageName = this.getName();

        var image = this.getDeliveryOptions().getImageBasUrl()
                  + '/tmb_'
                  + this.getDeliveryOptions().getImageName(imageName)
                  + '.png';
        html += '<img src="' + image + '" class="location-icon" alt="' + this.getName() + '" />';
        html += '<span class="overflow-protect">';
        html += '<strong class="location-name">' + this.getName() + '</strong>';
        html += '<span class="location-address">' + addressText + '</span>';
        html += '</span>';
        html += '<span class="location-distance">' + distanceText + '</span>';
        html += '<a class="location-info" id="' + id + '-info">' + businessHoursText + '</a>';
        html += '</div>';
        html += '</li>';

        /**
         * Attach the location to the bottom of the parent element.
         */
        $(parent).insert({
            bottom: html
        });

        var element           = $(id);

        /**
         * Add observers to this element.
         */
        element.observe('click', function(event) {
            var map = this.getMap();

            event.stop();

            if (Event.element(event).hasClassName('location-info')) {
                return false;
            }

            if (!this.getMarker()) {
                return false;
            }

            if (map.getSelectedMarker() == this.getMarker()) {
                return false;
            }

            this.setOldCenter(this.getMarker().getPosition());

            map.selectMarker(this.getMarker(), false, true);

            if (map.getIsInfoWindowOpen()) {
                map.openLocationInfoWindow(
                    this.getMapTooltipHtml(),
                    this.getLocationCode()
                );
            }
            return true;
        }.bind(this));

        element.observe('dblclick', function(event) {
            var map = this.getMap();

            event.stop();

            if (Event.element(event).hasClassName('location-info')) {
                return false;
            }

            if (!this.getMarker()) {
                return false;
            }

            if (map.getSelectedMarker() == this.getMarker()) {
                map.saveLocation();
                return false;
            }

            this.setOldCenter(this.getMarker().getPosition());

            map.selectMarker(this.getMarker(), false, true);

            if (map.getIsInfoWindowOpen()) {
                map.openLocationInfoWindow(
                    this.getMapTooltipHtml(),
                    this.getLocationCode()
                );
            }

            map.saveLocation();
            return true;
        }.bind(this));

        element.observe('mouseover', function() {
            this.mouseOver = true;

            var map = this.getMap();
            if (map.getIsInfoWindowOpen() || map.getIsBeingDragged()) {
                return this;
            }

            if (!this.getMarker()) {
                return false;
            }

            google.maps.event.trigger(this.getMarker(), 'mouseover');

            setTimeout(function() {
                if (!this.mouseOver) {
                    return false;
                }

                this.setOldCenter(map.map.getCenter());
                map.map.panTo(this.getMarker().getPosition());
                return true;
            }.bind(this), 250);

            return true;
        }.bind(this));

        element.observe('mouseout', function() {
            var map = this.getMap();
            if (map.getIsInfoWindowOpen() || map.getIsBeingDragged()) {
                return this;
            }

            if (!this.getMarker()) {
                return false;
            }

            google.maps.event.trigger(this.getMarker(), 'mouseout');
            this.mouseOver = false;
            return true;
        }.bind(this));

        var infoElement = $(id + '-info');
        infoElement.observe('click', function() {
            var map = this.getMap();

            /**
             * If the location info window already has this location's info, close it instead.
             */
            var infoWindow = $('location-info-window');
            if (infoWindow.getAttribute('data-locationcode')
                && infoWindow.getAttribute('data-locationcode') == this.getLocationCode()
            ) {
                map.closeLocationInfoWindow();

                return this;
            }

            if (this.getOldCenter()) {
                map.map.setCenter(this.getOldCenter());
                this.setOldCenter(false);
            }

            google.maps.event.trigger(this.getMarker(), 'mouseout');

            map.openLocationInfoWindow(
                this.getMapTooltipHtml(),
                this.getLocationCode()
            );

            return this;
        }.bind(this));

        this.setMapElement(element);

        /**
         * Format the address.
         */
        var responsiveAddressText = '<strong>' + this.getName() + '</strong><br />';
        responsiveAddressText += address.Street + ' ' + address.HouseNr + '<br />';
        if (responsiveAddressText.HouseNrExt) {
            responsiveAddressText += address.HouseNrExt;
        }
        responsiveAddressText += address.Zipcode + ' ' + address.City;

        /**
         * Get the responsive map location html.
         */
        var responsiveId = 'map_location_' + this.getLocationCode() + '_responsive';
        var responsiveHtml = '<li class="location-details" id="' + responsiveId + '">';
        responsiveHtml += '<div class="content">';
        responsiveHtml += '<div class="location-info">';
        responsiveHtml += '<span class="radio"></span>';
        responsiveHtml += '<span class="address">';
        responsiveHtml += responsiveAddressText;
        responsiveHtml += '</span>';
        responsiveHtml += '<span class="distance"><strong>' + distanceText + '</strong></span>';
        responsiveHtml += '</div>';
        responsiveHtml += '<a href="#" class="info-link" id="'
                        + responsiveId
                        + '_info_open">'
                        + Translator.translate('More info')
                        + '</a>';
        responsiveHtml += '</div>';
        responsiveHtml += '<div class="more-info" id="' + responsiveId + '_info" style="display:none;">';
        responsiveHtml += '<table class="business-hours">';
        responsiveHtml += '<thead>';
        responsiveHtml += '<tr>';
        responsiveHtml += '<th colspan="2">' + businessHoursText + '</th>';
        responsiveHtml += '</tr>';
        responsiveHtml += '</thead>';
        responsiveHtml += '<tbody>';
        responsiveHtml += this.getOpeningHoursHtml();
        responsiveHtml += '</tbody>';
        responsiveHtml += '</table>';
        responsiveHtml += '<div class="actions">';
        responsiveHtml += '<button class="postnl-button" id="'
                        + responsiveId
                        + '_select">'
                        + Translator.translate('Select location')
                        + '</button>';
        responsiveHtml += '<button class="postnl-button white" id="'
                        + responsiveId
                        + '_map">'
                        + Translator.translate('Show map')
                        + '</button>';
        responsiveHtml += '</div>';
        responsiveHtml += '<div class="close-wrapper">';
        responsiveHtml += '<a class="more-info-close" id="'
                        + responsiveId
                        + '_info_close">'
                        + Translator.translate('Close')
                        + '</a>';
        responsiveHtml += '</div>';
        responsiveHtml += '</div>';
        responsiveHtml += '</li>';

        /**
         * Attach the location to the bottom of the parent element.
         */
        $(responsiveParent).insert({
            bottom: responsiveHtml
        });

        var responsiveElement             = $(responsiveId);
        var responsiveElementInfo         = $(responsiveId + '_info');
        var responsiveElementInfoAnchor   = $(responsiveId + '_info_open');
        var responsiveElementInfoClose    = $(responsiveId + '_info_close');
        var responsiveElementSelectButton = $(responsiveId + '_select');
        var responsiveElementMapButton    = $(responsiveId + '_map');

        responsiveElement.select('.location-info').invoke('observe', 'click', function(event) {
            var map = this.getMap();

            event.stop();

            if (!this.getMarker()) {
                return false;
            }

            this.setOldCenter(this.getMarker().getPosition());

            map.selectMarker(this.getMarker(), false, true);

            map.saveLocation();

            return true;
        }.bind(this));

        responsiveElementInfoAnchor.observe('click', function(event) {
            event.stop();

            if (getComputedStyle(responsiveElementInfo).display != 'none') {
                responsiveElementInfo.hide();
                return;
            }

            responsiveElementInfo.show();
        });

        responsiveElementInfoClose.observe('click', function(event) {
            event.stop();

            responsiveElementInfo.hide();
        });

        responsiveElementSelectButton.observe('click', function(event) {
            var map = this.getMap();

            event.stop();

            if (!this.getMarker()) {
                return false;
            }

            this.setOldCenter(this.getMarker().getPosition());

            map.selectMarker(this.getMarker(), false, true);

            map.saveLocation();

            return true;
        }.bind(this));

        responsiveElementMapButton.observe('click', function(event) {
            event.stop();

            var markerPosition = this.getMarker().getPosition();
            var mapsUrl = 'http://maps.google.com/?q=';

            mapsUrl += encodeURIComponent(
                this.getName()
                + ' '
                + address.Street
                + ' '
                + address.HouseNr
                + ' '
                + address.City
            );

            mapsUrl += '&f=d';

            mapsUrl += '&saddr=' + encodeURIComponent(this.getDeliveryOptions().getFullAddress());

            mapsUrl += '&daddr='
                     + markerPosition.lat()
                     + ','
                     + markerPosition.lng();

            if (this.getDeliveryOptions().debug) {
                console.info('Opening google maps with url: ' + mapsUrl);
            }

            window.open(mapsUrl);
        }.bind(this));

        this.setResponsiveMapElement(responsiveElement);

        return this;
    },

    /**
     * Gets contents for the location info tooltip.
     *
     * @returns {string}
     */
    getMapTooltipHtml : function() {
        /**
         * Get the base tooltip html and the address info.
         */
        var address = this.getAddress();
        var addressText = address.Street + ' ' + address.HouseNr;
        if (address.HouseNrExt) {
            addressText += address.HouseNrExt;
        }
        addressText += '  ' + Translator.translate('in') + ' ' + address.City;

        var html = '<div class="left">';
        html += '<strong class="location-name">' + this.getName() + '</strong>';
        html += '<strong class="location-address">' + addressText + '</strong>';
        html += '<span class="location-info">' + this.getLocationInfoText() + '</span>';
        html += '</div>';
        html += '<div class="right">';
        html += '<table class="business-hours">';
        html += '<thead>';
        html += '<tr>';
        html += '<th colspan="2">'+ Translator.translate('Business Hours') + ':</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        html += this.getOpeningHoursHtml();

        html += '</tbody>';
        html += '</table>';
        html += '</div>';

        return html;
    },

    /**
     * Gets info about this location for the location-info tooltip.
     *
     * @returns {string}
     */
    getLocationInfoText : function() {
        var type = this.getType();

        var locationInfo = [];
        if (type.indexOf('PGE') > -1) {
            locationInfo.push(Translator.translate('Early pickup available'));
        }

        if (type.indexOf('PA') > -1) {
            locationInfo.push('24/7 ' + Translator.translate('available'));
        }

        if (this.getIsEveningLocation()) {
            locationInfo.push(Translator.translate('Evening pickup available'));
        }

        return locationInfo.join('<br />');
    },

    /**
     * @param {string} type
     *
     * @returns {PostnlDeliveryOptions.Location}
     */
    renderAsOsc : function(type) {
        var html   = this.render(false, type, true);
        var option = $$('#postnl_add_moment .option-list')[0];

        if (option) {
            option.insert({
                bottom : html
            });
        }

        /**
         * Add observers to display the tooltip on mouse over
         */
        var showOnMapAnchor = $('show_map_' + this.getLocationCode());

        showOnMapAnchor.observe('click', function(event) {
            event.stop();

            this.getMap().openAddLocationWindow();

            if (this.getMarker() !== false) {
                this.getMap().selectMarker(this.getMarker(), true, true);
            }
        }.bind(this));

        return this;
    },

    /**
     * Select an element by adding the 'active' class.
     *
     * @return {PostnlDeliveryOptions.Location}
     */
    select : function(type) {
        var elements = this.getElements();
        if (!elements) {
            return this;
        }

        if (!elements[type].hasClassName('active')) {
            elements[type].addClassName('active');
        }

        return this;
    },

    /**
     * Unselect an option by removing the 'active' class.
     *
     * @return {PostnlDeliveryOptions.Location}
     */
    unSelect : function(type) {
        var elements = this.getElements();
        if (!elements) {
            return this;
        }

        if (elements[type].hasClassName('active')) {
            elements[type].removeClassName('active');
        }

        return this;
    },

    getDistanceText : function () {
        var distance = parseInt(this.getDistance());
        var distanceText = '';

        /**
         * Round the distance to 5 meters.
         */
        distance = Math.round(distance / 5) * 5;

        /**
         * Render distances below 1000 in meters and above 1000 in kilometers.
         */
        if (distance < 1000 && distance > 0) {
            distanceText = distance + ' m';
        } else if (distance > 0) {
            distanceText = parseFloat(Math.round(distance / 100) / 10).toFixed(1) + ' km';
        }

        return distanceText;
    }
});

PostnlDeliveryOptions.Timeframe = new Class.create({
    element         : false,

    date            : null,
    from            : null,
    to              : null,
    type            : null,

    timeframeIndex  : 0,
    deliveryOptions : null,

    /**
     * Constructor method.
     *
     * @constructor
     *
     * @param {string}                date
     * @param {object}                timeframe
     * @param {number}                timeframeIndex
     * @param {PostnlDeliveryOptions} deliveryOptions
     *
     * @returns {void}
     */
    initialize : function(date, timeframe, timeframeIndex, deliveryOptions) {
        this.date = date;
        this.from = timeframe.From;
        this.to   = timeframe.To;

        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        var formattedDay = today.getDate();
        var formattedMonth = today.getMonth() + 1;
        var formattedDayTomorrow = tomorrow.getDate();
        var formattedMonthTomorrow = tomorrow.getMonth() + 1;

        if (formattedDay.toString().length < 2) {
            formattedDay = '0' + formattedDay.toString();
        }

        if (formattedMonth.toString().length < 2) {
            formattedMonth = '0' + formattedMonth.toString();
        }

        if (formattedDayTomorrow.toString().length < 2) {
            formattedDayTomorrow = '0' + formattedDayTomorrow.toString();
        }

        if (formattedMonthTomorrow.toString().length < 2) {
            formattedMonthTomorrow = '0' + formattedMonthTomorrow.toString();
        }

        var formattedToday = formattedDay + '-' + formattedMonth + '-' + today.getFullYear();
        var formattedTomorrow = formattedDayTomorrow + '-' + formattedMonthTomorrow + '-' + tomorrow.getFullYear();

        var cutOffTimes = deliveryOptions.cutOffTimes;
        var now = new Date();
        var currentTime = ("0" + now.getHours()).slice(-2)   + ":" +
            ("0" + now.getMinutes()).slice(-2) + ":" +
            ("0" + now.getSeconds()).slice(-2);
        var isPastWeekdayCutoff = cutOffTimes.weekday < currentTime;
        var isPastSaturdayCutoff = cutOffTimes.saturday < currentTime;
        var isPastSundayCutoff = cutOffTimes.sunday < currentTime;
        var isPastCutoff = isPastWeekdayCutoff || isPastSundayCutoff || isPastSaturdayCutoff;

        var type = '';
        timeframe.Options.string.each(function(value) {
            if (value == 'Sameday' && date == formattedToday) {
                type = value;
            } else if (value == 'Sameday' && timeframeIndex == 0 && date == formattedTomorrow && isPastCutoff) {
                type = value;
            } else if (value != 'Sameday' && !type) {
                type = value;
            }
        });

        switch (type) {
            case 'Evening' :
                this.type = 'Avond';
                break;
            case 'Sunday' :
                this.type = 'Sunday';
                break;
            case 'Monday' :
                this.type = 'Monday';
                break;
            case 'Sameday' :
                this.type = 'Sameday';
                break;
            case 'Food' :
                this.type = 'Food';
                break;
            case 'Cooledfood' :
                this.type = 'Cooledfood';
                break;
            default :
                this.type = 'Overdag';
                break;
        }

        this.timeframeIndex = timeframeIndex;

        this.deliveryOptions = deliveryOptions;
    },

    /******************************
     *                            *
     *  GETTER AND SETTER METHODS *
     *                            *
     ******************************/

    getElement : function() {
        return this.element;
    },

    setElement : function(element) {
        this.element = element;

        return this;
    },

    getDate : function() {
        return this.date;
    },

    getFrom : function() {
        return this.from;
    },

    getTo : function() {
        return this.to;
    },

    getType : function() {
        return this.type;
    },

    getTimeframeIndex : function() {
        return this.timeframeIndex;
    },

    getDeliveryOptions : function() {
        return this.deliveryOptions;
    },

    getOptions : function() {
        return this.getDeliveryOptions().getOptions();
    },

    /**
     * Render this time frame as a new html element.
     *
     * @param {string}  parent The parent element's ID to which we will attach this element.
     * @param {boolean} forceDate
     *
     * @returns {PostnlDeliveryOptions.Timeframe}
     */
    render : function(parent, forceDate) {
        /**
         * Sameday delivery is not allowed as Buspakje.
         */
        if (
            !this.getDeliveryOptions().isTimeframesAllowed() &&
            this.getDeliveryOptions().getIsBuspakje() &&
            this.getType() == 'Sameday'
        ) {
            return;
        }

        /**
         * Build the element's html.
         */
        var html = '<li class="option" id="timeframe_' + this.getTimeframeIndex() + '">';
        html += '<div class="bkg">';
        html += '<div class="bkg">';
        html += '<div class="content">';

        var spanClass = 'option-dd';
        if (!this.getDeliveryOptions().isDeliveryDaysAllowed() && this.getDeliveryOptions().country != 'BE') {
            spanClass += ' no-display';
        }
        html += '<span class="' + spanClass + '">';

        /**
         * Add the day of the week on which this time frame is available.
         */
        html += this.getWeekdayHtml(forceDate);

        html += '</span>';
        html += '<span class="option-radio"></span>';

        spanClass = 'option-time';

        var openingHours = '';
        if (!this.getDeliveryOptions().isTimeframesAllowed() && this.getDeliveryOptions().getIsBuspakje()) {
            spanClass += ' no-timeframe-buspakje';
            openingHours += Translator.translate('Fits through the mailslot');
        } else if (this.getDeliveryOptions().country == 'BE') {
            spanClass    += ' no-timeframe-buspakje';

            var date = new Date(this.date.substring(6, 10), this.date.substring(3, 5) - 1, this.date.substring(0, 2));
            if (date.getDay() == 6) {
                openingHours += '09:00 - 18:00';
            } else {
                openingHours += '09:00 - 21:30';
            }
        } else if (!this.getDeliveryOptions().isTimeframesAllowed()
            && !this.getDeliveryOptions().isDeliveryDaysAllowed()
        ) {
            spanClass    += ' no-timeframe-buspakje';
            openingHours += Translator.translate('As soon as possible');
        } else if (
            !this.getDeliveryOptions().isTimeframesAllowed() &&
            this.getType() != 'Sameday' &&
            this.getType() != 'Food' &&
            this.getType() != 'Cooledfood'
        ) {
            spanClass    += ' no-timeframe-buspakje';
            openingHours += '09:00 - 18:00';
        } else {
            openingHours += this.getFrom().substring(0, 5)
                          + ' - '
                          + this.getTo().substring(0, 5);
        }
        html += '<span class="' + spanClass + '">'
              + openingHours
              + '</span>';

        /**
         * Add an optional comment to the timeframe.
         */
        html += this.getCommentHtml();

        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</li>';

        if (!parent) {
            return html;
        }

        /**
         * Add the element to the DOM.
         */
        $(parent).insert({
            bottom: html
        });

        /**
         * Observe the new element's click event.
         */
        var element = $('timeframe_' + this.getTimeframeIndex());
        element.observe('click', function(element, event) {
            event.stop();

            if (element.hasClassName('active')) {
                return true;
            }

            this.getDeliveryOptions().selectTimeframe(element);
            return true;
        }.bind(this, element));

        this.setElement(element);

        return this;
    },

    /**
     * @returns {PostnlDeliveryOptions.Timeframe}
     */
    renderAsOsc : function() {
        var html = this.render(false, true);

        /**
         * Remove existing timeframes and locations.
         */
        $$('#postnl_add_moment .option-list li.option').invoke('remove');

        /**
         * Render the selected timeframe or location.
         */
        $$('#postnl_add_moment .option-list')[0].insert({
            bottom : html
        });

        return this;
    },

    /**
     * Get an optional comment for this timeframe.
     *
     * @returns {string}
     */
    getCommentHtml : function() {
        var comment = '';
        if (this.type == 'Avond') {
            var extraCosts = this.getOptions().eveningFeeText;
            var extraCostHtml = '';

            if (this.getOptions().eveningFeeIncl) {
                extraCostHtml += ' + ' + extraCosts;
            }

            comment = '<span class="option-comment">' + Translator.translate('evening') + extraCostHtml + '</span>';
        }

        if (this.type == 'Sunday') {
            var sundayCosts = this.getOptions().sundayFeeText;
            var sundayCostHtml = '';

            if (this.getOptions().sundayFeeIncl) {
                sundayCostHtml += ' + ' + sundayCosts;
            }

            comment = '<span class="option-comment">' + Translator.translate('sunday') + sundayCostHtml + '</span>';
        }

        if (this.type == 'Sameday') {
            var sameDayCosts = this.getOptions().sameDayFeeText;
            var sameDayCostHtml = '';

            if (this.getOptions().sameDayFeeIncl) {
                sameDayCostHtml += ' + ' + sameDayCosts;
            }

            if (this.isTimeFrameToday()) {
                comment = '<span class="option-comment">' + Translator.translate('today') + sameDayCostHtml + '</span>';
            } else {
                comment = '<span class="option-comment">' + Translator.translate('evening') + sameDayCostHtml + '</span>';
            }
        }

        if (this.type == 'Food') {
            if (this.isTimeFrameToday()) {
                comment = '<span class="option-comment">' + Translator.translate('today') + '</span>';
            } else {
                comment = '<span class="option-comment">' + Translator.translate('evening') + '</span>';
            }
        }

        if (this.type == 'Cooledfood') {
            if (this.isTimeFrameToday()) {
                comment = '<span class="option-comment">' + Translator.translate('today cooled') + '</span>';
            } else {
                comment = '<span class="option-comment">' + Translator.translate('cooled delivery') + '</span>';
            }
        }

        return comment;
    },

    /**
     * @returns {boolean}
     */
    isTimeFrameToday : function() {
        var timeframeDate = new Date(
            this.date.substring(6, 10),
            this.date.substring(3, 5) - 1,
            this.date.substring(0, 2)
        );
        var today = new Date();
        var formattedToday = PostnlDeliveryOptions.prototype.formatDate(today);
        var formattedTimeframeDate = PostnlDeliveryOptions.prototype.formatDate(timeframeDate);

        return formattedToday == formattedTimeframeDate;
    },

    /**
     * Get the day of the week on which this timeframe is available.
     *
     * @param {boolean} skipCheck
     *
     * @returns {string}
     */
    getWeekdayHtml : function(skipCheck) {
        var date = new Date(this.date.substring(6, 10), this.date.substring(3, 5) - 1, this.date.substring(0, 2));

        var datesProcessed = this.getDeliveryOptions().getDatesProcessed();
        var weekdayHtml = '';
        if (skipCheck || datesProcessed.indexOf(date.getTime()) == -1) {
            var weekdays = this.getDeliveryOptions().getWeekdays();

            this.getDeliveryOptions().getDatesProcessed().push(date.getTime());
            weekdayHtml = '<strong class="option-day">' + weekdays[date.getDay()] + '</strong>';
            weekdayHtml += '<span class="option-date">'
                         + ('0' + date.getDate()).slice(-2)
                         + '-'
                         + ('0' + (date.getMonth() + 1)).slice(-2)
                         + '</span>';
        }

        return weekdayHtml;
    },

    /**
     * Select an element by adding the 'active' class.
     *
     * @return {PostnlDeliveryOptions.Timeframe}
     */
    select : function() {
        var element = this.getElement();
        if (!element) {
            return this;
        }

        if (!element.hasClassName('active')) {
            element.addClassName('active');
        }

        return this;
    },

    /**
     * Unselect an option by removing the 'active' class.
     *
     * @return {PostnlDeliveryOptions.Timeframe}
     */
    unSelect : function() {
        var element = this.element;
        if (!element) {
            return this;
        }

        if (element.hasClassName('active')) {
            element.removeClassName('active');
        }

        return this;
    }
});

/**
 * Data saved in this object will be stored, even if the delivery options are reloaded. This is to remember the
 * selected option if there is a refresh, ie when entering a coupon.
 */
PostnlDeliveryOptions.PersistentStorage = {
    selectedTimeframe      : null,
    selectedDeliveryOption : null,

    /**
     * @param timeframe
     * @returns {PostnlDeliveryOptions.PersistentStorage}
     */
    setSelectedTimeframe : function (timeframe) {
        this.selectedTimeframe = timeframe;

        if (timeframe !== null) {
            this.setSelectedDeliveryOption(null);
        }

        return this;
    },

    /**
     * @returns {null|object}
     */
    getSelectedTimeframe : function () {
        return this.selectedTimeframe;
    },

    /**
     * @param deliveryOption
     * @returns {PostnlDeliveryOptions.PersistentStorage}
     */
    setSelectedDeliveryOption : function (deliveryOption) {
        this.selectedDeliveryOption = deliveryOption;

        if (deliveryOption !== null) {
            this.setSelectedTimeframe(null);
        }

        return this;
    },

    /**
     * @returns {null|object}
     */
    getSelectedDeliveryOption : function () {
        return this.selectedDeliveryOption;
    }
};
