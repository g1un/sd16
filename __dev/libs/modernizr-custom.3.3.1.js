/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-backdropfilter-backgroundsize-bgpositionshorthand-bgpositionxy-bgsizecover-borderradius-boxshadow-boxsizing-checked-cssanimations-csscalc-csscolumns-cssfilters-cssgradients-cssmask-csspointerevents-cssremunit-csstransforms-csstransforms3d-csstransitions-cssvhunit-cssvmaxunit-cssvminunit-cssvwunit-flexbox-flexboxlegacy-flexboxtweener-lastchild-multiplebgs-nthchild-opacity-preserve3d-rgba-supports-textshadow-setclasses-cssclassprefix:modernizr- !*/
!function(e,t,n){function r(e,t){return typeof e===t}function i(){var e,t,n,i,s,o,a;for(var d in b)if(b.hasOwnProperty(d)){if(e=[],t=b[d],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(i=r(t.fn,"function")?t.fn():t.fn,s=0;s<e.length;s++)o=e[s],a=o.split("."),1===a.length?Modernizr[a[0]]=i:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=i),y.push((i?"":"no-")+a.join("-"))}}function s(e){var t=S.className,n=Modernizr._config.classPrefix||"";if(k&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),k?S.className.baseVal=t:S.className=t)}function o(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):k?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function a(e,t){return e-1===t||e===t||e+1===t}function d(){var e=t.body;return e||(e=o(k?"svg":"body"),e.fake=!0),e}function l(e,n,r,i){var s,a,l,u,c="modernizr",f=o("div"),p=d();if(parseInt(r,10))for(;r--;)l=o("div"),l.id=i?i[r]:c+(r+1),f.appendChild(l);return s=o("style"),s.type="text/css",s.id="s"+c,(p.fake?p:f).appendChild(s),p.appendChild(f),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(t.createTextNode(e)),f.id=c,p.fake&&(p.style.background="",p.style.overflow="hidden",u=S.style.overflow,S.style.overflow="hidden",S.appendChild(p)),a=n(f,e),p.fake?(p.parentNode.removeChild(p),S.style.overflow=u,S.offsetHeight):f.parentNode.removeChild(f),!!a}function u(e,t){return!!~(""+e).indexOf(t)}function c(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function f(e,t){return function(){return e.apply(t,arguments)}}function p(e,t,n){var i;for(var s in e)if(e[s]in t)return n===!1?e[s]:(i=t[e[s]],r(i,"function")?f(i,n||t):i);return!1}function h(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function m(t,r){var i=t.length;if("CSS"in e&&"supports"in e.CSS){for(;i--;)if(e.CSS.supports(h(t[i]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];i--;)s.push("("+h(t[i])+":"+r+")");return s=s.join(" or "),l("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function g(e,t,i,s){function a(){l&&(delete A.style,delete A.modElem)}if(s=r(s,"undefined")?!1:s,!r(i,"undefined")){var d=m(e,i);if(!r(d,"undefined"))return d}for(var l,f,p,h,g,v=["modernizr","tspan","samp"];!A.style&&v.length;)l=!0,A.modElem=o(v.shift()),A.style=A.modElem.style;for(p=e.length,f=0;p>f;f++)if(h=e[f],g=A.style[h],u(h,"-")&&(h=c(h)),A.style[h]!==n){if(s||r(i,"undefined"))return a(),"pfx"==t?h:!0;try{A.style[h]=i}catch(x){}if(A.style[h]!=g)return a(),"pfx"==t?h:!0}return a(),!1}function v(e,t,n,i,s){var o=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+N.join(o+" ")+o).split(" ");return r(t,"string")||r(t,"undefined")?g(a,t,i,s):(a=(e+" "+I.join(o+" ")+o).split(" "),p(a,t,n))}function x(e,t,r){return v(e,n,n,t,r)}var y=[],b=[],w={_version:"3.3.1",_config:{classPrefix:"modernizr-",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){b.push({name:e,fn:t,options:n})},addAsyncTest:function(e){b.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=w,Modernizr=new Modernizr;var T="CSS"in e&&"supports"in e.CSS,C="supportsCSS"in e;Modernizr.addTest("supports",T||C);var S=t.documentElement,k="svg"===S.nodeName.toLowerCase();Modernizr.addTest("multiplebgs",function(){var e=o("a").style;return e.cssText="background:url(https://),url(https://),red url(https://)",/(url\s*\(.*?){3}/.test(e.background)}),Modernizr.addTest("csspointerevents",function(){var e=o("a").style;return e.cssText="pointer-events:auto","auto"===e.pointerEvents}),Modernizr.addTest("cssremunit",function(){var e=o("a").style;try{e.fontSize="3rem"}catch(t){}return/rem/.test(e.fontSize)}),Modernizr.addTest("rgba",function(){var e=o("a").style;return e.cssText="background-color:rgba(150,255,150,.5)",(""+e.backgroundColor).indexOf("rgba")>-1}),Modernizr.addTest("preserve3d",function(){var e=o("a"),t=o("a");e.style.cssText="display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);",t.style.cssText="display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);",e.appendChild(t),S.appendChild(e);var n=t.getBoundingClientRect();return S.removeChild(e),n.width&&n.width<4}),Modernizr.addTest("bgpositionshorthand",function(){var e=o("a"),t=e.style,n="right 10px bottom 10px";return t.cssText="background-position: "+n+";",t.backgroundPosition===n});var z=w._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];w._prefixes=z,Modernizr.addTest("csscalc",function(){var e="width:",t="calc(10px);",n=o("a");return n.style.cssText=e+z.join(t+e),!!n.style.length}),Modernizr.addTest("cssgradients",function(){for(var e,t="background-image:",n="gradient(linear,left top,right bottom,from(#9f9),to(white));",r="",i=0,s=z.length-1;s>i;i++)e=0===i?"to ":"",r+=t+z[i]+"linear-gradient("+e+"left top, #9f9, white);";Modernizr._config.usePrefixes&&(r+=t+"-webkit-"+n);var a=o("a"),d=a.style;return d.cssText=r,(""+d.backgroundImage).indexOf("gradient")>-1}),Modernizr.addTest("opacity",function(){var e=o("a").style;return e.cssText=z.join("opacity:.55;"),/^0.55$/.test(e.opacity)});var _=w.testStyles=l;Modernizr.addTest("checked",function(){return _("#modernizr {position:absolute} #modernizr input {margin-left:10px} #modernizr :checked {margin-left:20px;display:block}",function(e){var t=o("input");return t.setAttribute("type","checkbox"),t.setAttribute("checked","checked"),e.appendChild(t),20===t.offsetLeft})}),_("#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}",function(e){Modernizr.addTest("lastchild",e.lastChild.offsetWidth>e.firstChild.offsetWidth)},2),_("#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}",function(e){for(var t=e.getElementsByTagName("div"),n=!0,r=0;5>r;r++)n=n&&t[r].offsetWidth===r%2+1;Modernizr.addTest("nthchild",n)},5),_("#modernizr { height: 50vh; }",function(t){var n=parseInt(e.innerHeight/2,10),r=parseInt((e.getComputedStyle?getComputedStyle(t,null):t.currentStyle).height,10);Modernizr.addTest("cssvhunit",r==n)}),_("#modernizr1{width: 50vmax}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}",function(t){var n=t.childNodes[2],r=t.childNodes[1],i=t.childNodes[0],s=parseInt((r.offsetWidth-r.clientWidth)/2,10),o=i.clientWidth/100,d=i.clientHeight/100,l=parseInt(50*Math.max(o,d),10),u=parseInt((e.getComputedStyle?getComputedStyle(n,null):n.currentStyle).width,10);Modernizr.addTest("cssvmaxunit",a(l,u)||a(l,u-s))},3),_("#modernizr1{width: 50vm;width:50vmin}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}",function(t){var n=t.childNodes[2],r=t.childNodes[1],i=t.childNodes[0],s=parseInt((r.offsetWidth-r.clientWidth)/2,10),o=i.clientWidth/100,d=i.clientHeight/100,l=parseInt(50*Math.min(o,d),10),u=parseInt((e.getComputedStyle?getComputedStyle(n,null):n.currentStyle).width,10);Modernizr.addTest("cssvminunit",a(l,u)||a(l,u-s))},3),_("#modernizr { width: 50vw; }",function(t){var n=parseInt(e.innerWidth/2,10),r=parseInt((e.getComputedStyle?getComputedStyle(t,null):t.currentStyle).width,10);Modernizr.addTest("cssvwunit",r==n)});var P="Moz O ms Webkit",N=w._config.usePrefixes?P.split(" "):[];w._cssomPrefixes=N;var I=w._config.usePrefixes?P.toLowerCase().split(" "):[];w._domPrefixes=I;var W={elem:o("modernizr")};Modernizr._q.push(function(){delete W.elem});var A={style:W.elem.style};Modernizr._q.unshift(function(){delete A.style});var E=w.testProp=function(e,t,r){return g([e],n,t,r)};Modernizr.addTest("textshadow",E("textShadow","1px 1px")),w.testAllProps=v,w.testAllProps=x,Modernizr.addTest("cssanimations",x("animationName","a",!0)),Modernizr.addTest("backdropfilter",x("backdropFilter")),Modernizr.addTest("bgpositionxy",function(){return x("backgroundPositionX","3px",!0)&&x("backgroundPositionY","5px",!0)}),Modernizr.addTest("backgroundsize",x("backgroundSize","100%",!0)),Modernizr.addTest("bgsizecover",x("backgroundSize","cover")),Modernizr.addTest("borderradius",x("borderRadius","0px",!0)),Modernizr.addTest("boxshadow",x("boxShadow","1px 1px",!0)),Modernizr.addTest("boxsizing",x("boxSizing","border-box",!0)&&(t.documentMode===n||t.documentMode>7)),function(){Modernizr.addTest("csscolumns",function(){var e=!1,t=x("columnCount");try{(e=!!t)&&(e=new Boolean(e))}catch(n){}return e});for(var e,t,n=["Width","Span","Fill","Gap","Rule","RuleColor","RuleStyle","RuleWidth","BreakBefore","BreakAfter","BreakInside"],r=0;r<n.length;r++)e=n[r].toLowerCase(),t=x("column"+n[r]),("breakbefore"===e||"breakafter"===e||"breakinside"==e)&&(t=t||x(n[r])),Modernizr.addTest("csscolumns."+e,t)}(),Modernizr.addTest("cssfilters",function(){if(Modernizr.supports)return x("filter","blur(2px)");var e=o("a");return e.style.cssText=z.join("filter:blur(2px); "),!!e.style.length&&(t.documentMode===n||t.documentMode>9)}),Modernizr.addTest("flexbox",x("flexBasis","1px",!0)),Modernizr.addTest("flexboxlegacy",x("boxDirection","reverse",!0)),Modernizr.addTest("flexboxtweener",x("flexAlign","end",!0)),Modernizr.addTest("cssmask",x("maskRepeat","repeat-x",!0)),Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&x("transform","scale(1)",!0)}),Modernizr.addTest("csstransforms3d",function(){var e=!!x("perspective","1px",!0),t=Modernizr._config.usePrefixes;if(e&&(!t||"webkitPerspective"in S.style)){var n,r="#modernizr{width:0;height:0}";Modernizr.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}",_(r+n,function(t){e=7===t.offsetWidth&&18===t.offsetHeight})}return e}),Modernizr.addTest("csstransitions",x("transition","all",!0)),i(),s(y),delete w.addTest,delete w.addAsyncTest;for(var j=0;j<Modernizr._q.length;j++)Modernizr._q[j]();e.Modernizr=Modernizr}(window,document);