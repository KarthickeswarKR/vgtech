//Tab start
//to open a new tab
function openTab (tab_button) {

	// Getting The Tab ID...
	var tabid = tab_button.getAttribute('data-ref_id');
	var element = $ele(tabid);
	var parent_tab_button = tab_button.parentNode.parentNode;

	//deactivating the ink
	 deactivateInk(parent_tab_button);

	//hidding other tabs
		hidetabs(element,tabid);

	// display blocking the tab element
		element.style.display='block';
		tab_button.className="vg-tab-button-active";
}

//getting the element
function $ele(id){
	return document.getElementById(id);
}

//deactivating the ink
function deactivateInk(parent_tab_button){
	for (var j = 0; j<parent_tab_button.childNodes.length; j++) {
			child = parent_tab_button.childNodes[j];
			if(child.nodeType == 1){
				for (var i = 0; i<child.childNodes.length; i++) {
						child_button = child.childNodes[i];
						if(child_button !== undefined){
							child_button.className="vg-tab-button-inactive";
						}
				}
			}
	}
}

//hidding other tabs
function hidetabs(element,tabid){
	for (var i = 0; i<element.parentNode.childNodes.length; i++) {
		child = element.parentNode.childNodes[i];
		if(child.nodeType == 1 && child.id != tabid ){
			child.style.display='none';
		}
	}
}

//tab end



/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

var autoComplete = (function(){
    // "use strict";
    function autoComplete(options){
        if (!document.querySelector) return;

        // helpers
        function hasClass(el, className){ return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className); }

        function addEvent(el, type, handler){
            if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
        }
        function removeEvent(el, type, handler){
            // if (el.removeEventListener) not working in IE11
            if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
        }
        function live(elClass, event, cb, context){
            addEvent(context || document, event, function(e){
                var found, el = e.target || e.srcElement;
                while (el && !(found = hasClass(el, elClass))) el = el.parentElement;
                if (found) cb.call(el, e);
            });
        }

        var o = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: function (item, search){
                // escape special characters
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="vg-autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
            },
            onSelect: function(e, term, item){}
        };
        for (var k in options) { if (options.hasOwnProperty(k)) o[k] = options[k]; }

        // init
        var elems = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (var i=0; i<elems.length; i++) {
            var that = elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = 'vg-autocomplete-suggestions '+o.menuClass;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = function(resize, next){
                //var rect = that.getBoundingClientRect();
                //that.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
                //that.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
               // that.sc.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) { that.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle).maxHeight); }
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = that.sc.querySelector('.vg-autocomplete-suggestion').offsetHeight;
                    if (that.sc.suggestionHeight)
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            var scrTop = that.sc.scrollTop, selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            else if (selTop < 0)
                                that.sc.scrollTop = selTop + scrTop;
                        }
                }

            }
            addEvent(window, 'resize', that.updateSC);
            document.getElementById('autosuggestion').appendChild(that.sc);

            live('vg-autocomplete-suggestion', 'mouseleave', function(e){
                var sel = that.sc.querySelector('.vg-autocomplete-suggestion.selected');
                if (sel) setTimeout(function(){ sel.className = sel.className.replace('selected', ''); }, 20);
            }, that.sc);

            live('vg-autocomplete-suggestion', 'mouseover', function(e){
                var sel = that.sc.querySelector('.vg-autocomplete-suggestion.selected');
                if (sel) sel.className = sel.className.replace('selected', '');
                this.className += ' selected';
            }, that.sc);

            live('vg-autocomplete-suggestion', 'mousedown', function(e){
                if (hasClass(this, 'vg-autocomplete-suggestion')) { // else outside click
                    var v = this.getAttribute('data-val');
                    that.value = v;
                    o.onSelect(e, v, this);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = function(){
                try { var over_sb = document.querySelector('.vg-autocomplete-suggestions:hover'); } catch(e){ var over_sb = 0; }
                if (!over_sb) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(function(){ that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(function(){ that.focus(); }, 20);
            };
            addEvent(that, 'blur', that.blurHandler);

            var suggest = function(data){
                var val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i=0;i<data.length;i++) s += o.renderItem(data[i], val);
                    that.sc.innerHTML = s;
                    that.updateSC(0);
                }
                else
                    that.sc.style.display = 'none';
            }

            that.keydownHandler = function(e){
                var key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key == 40 || key == 38) && that.sc.innerHTML) {
                    var next, sel = that.sc.querySelector('.vg-autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key == 40) ? that.sc.querySelector('.vg-autocomplete-suggestion') : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key == 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        }
                        else { sel.className = sel.className.replace('selected', ''); that.value = that.last_val; next = 0; }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (key == 27) { that.value = that.last_val; that.sc.style.display = 'none'; }
                // enter
                else if (key == 13 || key == 9) {
                    var sel = that.sc.querySelector('.vg-autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display != 'none') { o.onSelect(e, sel.getAttribute('data-val'), sel); setTimeout(function(){ that.sc.style.display = 'none'; }, 20); }
                }
            };
            addEvent(that, 'keydown', that.keydownHandler);

            that.keyupHandler = function(e){
							//alert('yes');
                var key = window.event ? e.keyCode : e.which;
                if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
                    var val = that.value;
                    if (val.length >= o.minChars) {
                        if (val != that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (var i=1; i<val.length-o.minChars; i++) {
                                    var part = val.slice(0, val.length-i);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
														//alert('inside suggest');
                            that.timer = setTimeout(function(){ o.source(val, suggest) }, o.delay);
                        }
                    } else {
										//	alert('else');
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            addEvent(that, 'keyup', that.keyupHandler);

            that.focusHandler = function(e){
							alert('foused '+ e.target.value);
                that.last_val = '\n';
                that.keyupHandler(e)
            };
          addEvent(that, 'focus', that.focusHandler);
        }

        // public destroy method
        this.destroy = function(){
            for (var i=0; i<elems.length; i++) {
                var that = elems[i];
                removeEvent(window, 'resize', that.updateSC);
                //removeEvent(that, 'blur', that.blurHandler);
                removeEvent(that, 'focus', that.focusHandler);
                removeEvent(that, 'keydown', that.keydownHandler);
                removeEvent(that, 'keyup', that.keyupHandler);
                if (that.autocompleteAttr)
                    that.setAttribute('autocomplete', that.autocompleteAttr);
                else
                    that.removeAttribute('autocomplete');
                document.getElementById('autosuggestion').removeChild(that.sc);
                that = null;
            }
        };
    }
    return autoComplete;
})();

(function(){
    if (typeof define === 'function' && define.amd)
        define('autoComplete', function () { return autoComplete; });
    else if (typeof module !== 'undefined' && module.exports)
        module.exports = autoComplete;
    else
        window.autoComplete = autoComplete;
})();


// Autocomplete Start

/*   var demo1 = new autoComplete({
            selector: '#autocomplete-header',
            minChars: 1,
            source: function(term, suggest){
                term = term.toLowerCase();
                var choices = ['ActionScript', 'AppleScript', 'Asp', 'Assembly', 'BASIC', 'Batch', 'C', 'C++', 'CSS', 'Clojure', 'COBOL', 'ColdFusion', 'Erlang', 'Fortran', 'Groovy', 'Haskell', 'HTML', 'Java', 'JavaScript', 'Lisp', 'Perl', 'PHP', 'PowerShell', 'Python', 'Ruby', 'Scala', 'Scheme', 'SQL', 'TeX', 'XML'];
                var suggestions = [];
                for (i=0;i<choices.length;i++)
                    if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                suggest(suggestions);
            }
        });

*/
				var xhr;
				var demo1 = new autoComplete({
				    selector: '#autocomplete-header',
				    source: function(term, response){
							try { xhr.abort(); } catch(e){}
						//	alert('nice');
				        //$.getJSON('/some/ajax/url/', { q: term }, function(data){ response(data); });
								xhr=$.ajax({
								    beforeSend: function(request) {
								        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
											  request.setRequestHeader("userId",localStorage.getItem('userId'));
								    },
								    dataType: "json",
								    url:'http://vgdevelope.com/api/posts/getAllUserPost',
								    success: function(data) {
										//	alert('inside sucess');
											var productNames =[];
											console.log(data.data);
											for (var i = 0; i < data.data.length; i++) {
												//console.log(data.data[i]);
												if(data.data[i]!=null){
													if(data.data[i].postName!=null||data.data[i].postName!=undefined)
													productNames.push(data.data[i].postName);
												}

											}
											term = term.toLowerCase().trim();
							        var choices = productNames;
							        var matches = [];
											console.log('term: '+term);
							        for (i=0; i<choices.length; i++)
							            if (~choices[i].toLowerCase().trim().indexOf(term)) matches.push(choices[i]);
console.log('this is madness: '+matches);
											response(matches);
								        //Your code
								    }
								});
				    }
				});

/*
				var xhr;
				var demo1=new autoComplete({
				    selector: '#autocomplete-header',
						delay:200,
				    source: function(term, response){
				        try { xhr.abort(); } catch(e){}
				      /*  xhr = $.getJSON('/some/ajax/url/', { q: term }, function(data){

								});

								xhr=$.ajax({
								    beforeSend: function(request) {
											alert('yes');
								        request.setRequestHeader("Authorization", 'Bearer' + localStorage.getItem('access_token'));
											  request.setRequestHeader("userId",localStorage.getItem('userId'));
								    },
								    dataType: "json",
								    url:'http://vgdevelope.com/api/posts/getAllUserPost',
								    success: function(data) {
											var productNames;
											for (var i = 0; i < data.data.length; i++) {
												productNames.push(data.data[i].product.name);
											}
											response(productNames);
								        //Your code
								    }
								});
				    }
				});
*/


// Autocomplete End



//card dd start
  function interactions(id){
    element =document.getElementById(id);
  if(element.getAttribute("slideDown")==='false'){
  element.setAttribute("style","display:block");
  element.setAttribute("slideDown","true");
}else
{
  element.setAttribute("style","display:none");
  element.setAttribute("slideDown","false");
}
}
//card dd end


//getting the element
function $ele(id)
{
return document.getElementById(id);
}
