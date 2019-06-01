/**
 * Copyright (c) 2006
 * 
 * Philipp Berger, Martin Czuchra, Gero Decker, Ole Eckermann, Lutz Gericke,
 * Alexander Hold, Alexander Koglin, Oliver Kopp, Stefan Krumnow, Matthias
 * Kunze, Philipp Maschke, Falko Menge, Christoph Neijenhuis, Hagen Overdick,
 * Zhen Peng, Nicolas Peters, Kerstin Pfitzner, Daniel Polak, Steffen Ryll, Kai
 * Schlichting, Jan-Felix Schwarz, Daniel Taschik, Willi Tscheschner, Bj??rn
 * Wagner, Sven Wagner-Boysen, Matthias Weidlich
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
if (!ORYX) {
	var ORYX = {}
}
ORYX.Utils = {
	getParamFromUrl : function(b) {
		b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var a = "[\\?&]" + b + "=([^&#]*)";
		var d = new RegExp(a);
		var c = d.exec(window.location.href);
		if (c == null) {
			return null
		} else {
			return c[1]
		}
	},
	adjustLightness : function() {
		return arguments[0]
	},
	adjustGradient : function(c, a) {
		if (ORYX.CONFIG.DISABLE_GRADIENT && c) {
			var b = a.getAttributeNS(null, "stop-color") || "#ffffff";
			$A(c.getElementsByTagName("stop")).each(function(d) {
				if (d == a) {
					return

					

										

					

				}
				d.setAttributeNS(null, "stop-color", b)
			})
		}
	}
};
XMLNS = {
	ATOM : "http://www.w3.org/2005/Atom",
	XHTML : "http://www.w3.org/1999/xhtml",
	ERDF : "http://purl.org/NET/erdf/profile",
	RDFS : "http://www.w3.org/2000/01/rdf-schema#",
	RDF : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	RAZIEL : "http://b3mn.org/Raziel",
	SCHEMA : ""
};
var Kickstart = {
	started : false,
	callbacks : [],
	alreadyLoaded : [],
	PATH : "",
	load : function() {
		Kickstart.kick()
	},
	kick : function() {
		if (!Kickstart.started) {
			Kickstart.started = true;
			Kickstart.callbacks.each(function(a) {
				window.setTimeout(a, 1)
			})
		}
	},
	register : function(callback) {
		with (Kickstart) {
			if (started) {
				window.setTimeout(callback, 1)
			} else {
				Kickstart.callbacks.push(callback)
			}
		}
	},
	require : function(a) {
		if (Kickstart.alreadyLoaded.member(a)) {
			return false
		}
		return Kickstart.include(a)
	},
	include : function(a) {
		var b = document.getElementsByTagNameNS(XMLNS.XHTML, "head")[0];
		var c = document.createElementNS(XMLNS.XHTML, "script");
		c.setAttributeNS(XMLNS.XHTML, "type", "text/javascript");
		c.src = Kickstart.PATH + a;
		b.appendChild(c);
		Kickstart.alreadyLoaded.push(a);
		return true
	}
};
Event.observe(window, "load", Kickstart.load);
var ERDF = {
	LITERAL : 1,
	RESOURCE : 2,
	DELIMITERS : [ ".", "-" ],
	HASH : "#",
	HYPHEN : "-",
	schemas : [],
	callback : undefined,
	log : undefined,
	init : function(a) {
		ERDF.callback = a;
		ERDF.registerSchema("schema", XMLNS.SCHEMA);
		ERDF.registerSchema("rdfs", XMLNS.RDFS)
	},
	run : function() {
		return ERDF._checkProfile() && ERDF.parse()
	},
	parse : function() {
		ERDF.__startTime = new Date();
		var b = document.getElementsByTagNameNS(XMLNS.XHTML, "body");
		var c = {
			type : ERDF.RESOURCE,
			value : ""
		};
		var a = ERDF._parseDocumentMetadata() && ERDF._parseFromTag(b[0], c);
		ERDF.__stopTime = new Date();
		var d = (ERDF.__stopTime - ERDF.__startTime) / 1000;
		return a
	},
	_parseDocumentMetadata : function() {
		var b = document.getElementsByTagNameNS(XMLNS.XHTML, "head");
		var a = b[0].getElementsByTagNameNS(XMLNS.XHTML, "link");
		var c = b[0].getElementsByTagNameNS(XMLNS.XHTML, "meta");
		$A(a).each(function(e) {
			var d = e.getAttribute("rel");
			var g = e.getAttribute("rev");
			var f = e.getAttribute("href");
			ERDF._parseTriplesFrom(ERDF.RESOURCE, "", d, ERDF.RESOURCE, f);
			ERDF._parseTriplesFrom(ERDF.RESOURCE, f, g, ERDF.RESOURCE, "")
		});
		$A(c).each(function(f) {
			var e = f.getAttribute("name");
			var d = f.getAttribute("content");
			ERDF._parseTriplesFrom(ERDF.RESOURCE, "", e, ERDF.LITERAL, d)
		});
		return true
	},
	_parseFromTag : function(c, k, d) {
		if (!c || !c.namespaceURI || c.namespaceURI != XMLNS.XHTML) {
			return

			

						

			

		}
		if (!d) {
			d = 0
		}
		var a = c.getAttribute("id");
		if (c.nodeName.endsWith(":a") || c.nodeName == "a") {
			var h = c.getAttribute("rel");
			var e = c.getAttribute("rev");
			var n = c.getAttribute("href");
			var m = c.getAttribute("title");
			var g = c.textContent;
			ERDF._parseTriplesFrom(k.type, k.value, h, ERDF.RESOURCE, n,
					function(p) {
						var o = m ? m : g;
						ERDF._parseTriplesFrom(p.object.type, p.object.value,
								"rdfs.label", ERDF.LITERAL, o)
					});
			ERDF._parseTriplesFrom(k.type, k.value, e, ERDF.RESOURCE, "");
			ERDF._parseTypeTriplesFrom(k.type, k.value, h)
		} else {
			if (c.nodeName.endsWith(":img") || c.nodeName == "img") {
				var h = c.getAttribute("class");
				var n = c.getAttribute("src");
				var f = c.getAttribute("alt");
				ERDF._parseTriplesFrom(k.type, k.value, h, ERDF.RESOURCE, n,
						function(p) {
							var o = f;
							ERDF._parseTriplesFrom(p.object.type,
									p.object.value, "rdfs.label", ERDF.LITERAL,
									o)
						})
			}
		}
		var h = c.getAttribute("class");
		var m = c.getAttribute("title");
		var g = c.textContent;
		var l = m ? m : g;
		ERDF._parseTriplesFrom(k.type, k.value, h, ERDF.LITERAL, l);
		if (a) {
			k = {
				type : ERDF.RESOURCE,
				value : ERDF.HASH + a
			}
		}
		ERDF._parseTypeTriplesFrom(k.type, k.value, h);
		var b = c.childNodes;
		if (b) {
			$A(b).each(function(o) {
				if (o.nodeType == o.ELEMENT_NODE) {
					ERDF._parseFromTag(o, k, d + 1)
				}
			})
		}
	},
	_parseTriplesFrom : function(c, e, d, a, b, f) {
		if (!d) {
			return

			

						

			

		}
		d.toLowerCase().split(" ").each(
				function(h) {
					var g = ERDF.schemas.find(function(l) {
						return false || ERDF.DELIMITERS.find(function(m) {
							return h.startsWith(l.prefix + m)
						})
					});
					if (g && b) {
						h = h.substring(g.prefix.length + 1, h.length);
						var k = ERDF.registerTriple(new ERDF.Resource(e), {
							prefix : g.prefix,
							name : h
						}, (a == ERDF.RESOURCE) ? new ERDF.Resource(b)
								: new ERDF.Literal(b));
						if (f) {
							f(k)
						}
					}
				})
	},
	_parseTypeTriplesFrom : function(a, c, b, d) {
		if (!b) {
			return

			

						

			

		}
		b.toLowerCase().split(" ").each(
				function(f) {
					var e = ERDF.schemas.find(function(h) {
						return false || ERDF.DELIMITERS.find(function(k) {
							return f.startsWith(ERDF.HYPHEN + h.prefix + k)
						})
					});
					if (e && c) {
						f = f.substring(e.prefix.length + 2, f.length);
						var g = ERDF.registerTriple(
								(a == ERDF.RESOURCE) ? new ERDF.Resource(c)
										: new ERDF.Literal(c), {
									prefix : "rdf",
									name : "type"
								}, new ERDF.Resource(e.namespace + f));
						if (d) {
							d(g)
						}
					}
				})
	},
	_checkProfile : function() {
		var b = document.getElementsByTagNameNS(XMLNS.XHTML, "head");
		var a = b[0].getAttribute("profile");
		var c = false;
		if (a && a.split(" ").member(XMLNS.ERDF)) {
			return true
		} else {
			return false
		}
	},
	__stripHashes : function(a) {
		return (a && (typeof a.substring == "function") && a.substring(0, 1) == "#") ? a
				.substring(1, a.length)
				: a
	},
	registerSchema : function(b, a) {
		ERDF.schemas.push({
			prefix : b,
			namespace : a
		})
	},
	registerTriple : function(c, a, b) {
		if (a.prefix.toLowerCase() == "schema") {
			this.registerSchema(a.name, b.value)
		}
		var d = new ERDF.Triple(c, a, b);
		ERDF.callback(d);
		return d
	},
	__enhanceObject : function() {
		this.isResource = function() {
			return this.type == ERDF.RESOURCE
		};
		this.isLocal = function() {
			return this.isResource() && this.value.startsWith("#")
		};
		this.isCurrentDocument = function() {
			return this.isResource() && (this.value == "")
		};
		this.getId = function() {
			return this.isLocal() ? ERDF.__stripHashes(this.value) : false
		};
		this.isLiteral = function() {
			return this.type == ERDF.LIITERAL
		}
	},
	serialize : function(a) {
		if (!a) {
			return ""
		} else {
			if (a.constructor == String) {
				return a
			} else {
				if (a.constructor == Boolean) {
					return a ? "true" : "false"
				} else {
					return a.toString()
				}
			}
		}
	}
};
ERDF.Triple = function(c, a, b) {
	this.subject = c;
	this.predicate = a;
	this.object = b;
	this.toString = function() {
		return "[ERDF.Triple] " + this.subject.toString() + " "
				+ this.predicate.prefix + ":" + this.predicate.name + " "
				+ this.object.toString()
	}
};
ERDF.Resource = function(a) {
	this.type = ERDF.RESOURCE;
	this.value = a;
	ERDF.__enhanceObject.apply(this);
	this.toString = function() {
		return "&lt;" + this.value + "&gt;"
	}
};
ERDF.Literal = function(a) {
	this.type = ERDF.LITERAL;
	this.value = ERDF.serialize(a);
	ERDF.__enhanceObject.apply(this);
	this.toString = function() {
		return '"' + this.value + '"'
	}
};
var USE_ASYNCHRONOUS_REQUESTS = true;
var DISCARD_UNUSED_TRIPLES = true;
var PREFER_SPANS_OVER_DIVS = true;
var PREFER_TITLE_OVER_TEXTNODE = false;
var RESOURCE_ID_PREFIX = "resource";
var SHOW_DEBUG_ALERTS_WHEN_SAVING = false;
var SHOW_EXTENDED_DEBUG_INFORMATION = false;
var USE_ARESS_WORKAROUNDS = true;
var RESOURCE_CREATED = 1;
var RESOURCE_REMOVED = 2;
var RESOURCE_SAVED = 4;
var RESOURCE_RELOADED = 8;
var RESOURCE_SYNCHRONIZED = 16;
var TRIPLE_REMOVE = 1;
var TRIPLE_ADD = 2;
var TRIPLE_RELOAD = 4;
var TRIPLE_SAVE = 8;
var PROCESSDATA_REF = "processdata";
var DataManager = {
	init : function() {
		ERDF.init(DataManager._registerTriple);
		DataManager.__synclocal()
	},
	_triples : [],
	_registerTriple : function(a) {
		DataManager._triples.push(a)
	},
	__synclocal : function() {
		DataManager._triples = [];
		ERDF.run()
	},
	__synchronizeShape : function(a) {
		var c = ResourceManager.getResource(a.resourceId);
		var b = a.serialize();
		b.each(function(d) {
			var f = (d.type == "resource");
			var e = new ERDF.Triple(new ERDF.Resource(a.resourceId), {
				prefix : d.prefix,
				name : d.name
			}, f ? new ERDF.Resource(d.value) : new ERDF.Literal(d.value));
			DataManager.setObject(e)
		});
		return c
	},
	__storeShape : function(a) {
		var b = DataManager.__synchronizeShape(a);
		b.save()
	},
	__forceExistance : function(a) {
		if (!$(a.resourceId)) {
			if (!$$("." + PROCESSDATA_REF)[0]) {
				DataManager.graft(XMLNS.XHTML, document.getElementsByTagNameNS(
						XMLNS.XHTML, "body").item(0), [ "div", {
					"class" : PROCESSDATA_REF,
					style : "display:none;"
				} ])
			}
			DataManager
					.graft(
							XMLNS.XHTML,
							$$("." + PROCESSDATA_REF)[0],
							[
									"div",
									{
										id : a.resourceId,
										"class" : (a instanceof ORYX.Core.Canvas) ? "-oryx-canvas"
												: undefined
									} ])
		} else {
			var c = $(a.resourceId);
			var b = $A(c.childNodes);
			b.each(function(d) {
				c.removeChild(d)
			})
		}
	},
	__persistShape : function(b) {
		var d = b.serialize();
		var a = [];
		var c = new ERDF.Resource(b.resourceId);
		DataManager.removeTriples(DataManager.query(c, undefined, undefined));
		d.each(function(f) {
			var e = (f.type == "resource") ? new ERDF.Resource(f.value)
					: new ERDF.Literal(f.value);
			DataManager.addTriple(new ERDF.Triple(c, {
				prefix : f.prefix,
				name : f.name
			}, e))
		})
	},
	__persistDOM : function(d) {
		var c = d.getCanvas();
		var b = c.getChildShapes(true);
		var a = "";
		b.each(function(e) {
			DataManager.__forceExistance(e)
		});
		DataManager.__renderCanvas(d);
		a += DataManager.serialize($(ERDF
				.__stripHashes(d.getCanvas().resourceId)), true);
		b.each(function(e) {
			DataManager.__persistShape(e);
			a += DataManager.serialize($(ERDF.__stripHashes(e.resourceId)),
					true)
		});
		return a
	},
	__renderCanvas : function(e) {
		var b = e.getCanvas();
		var d = e.getStencilSets();
		var a = b.getChildShapes(true);
		DataManager.__forceExistance(b);
		DataManager.__persistShape(b);
		var c = new ERDF.Resource(b.resourceId);
		DataManager.removeTriples(DataManager.query(c, undefined, undefined));
		DataManager.addTriple(new ERDF.Triple(c, {
			prefix : "oryx",
			name : "mode"
		}, new ERDF.Literal("writable")));
		DataManager.addTriple(new ERDF.Triple(c, {
			prefix : "oryx",
			name : "mode"
		}, new ERDF.Literal("fullscreen")));
		d.values().each(function(f) {
			DataManager.addTriple(new ERDF.Triple(c, {
				prefix : "oryx",
				name : "stencilset"
			}, new ERDF.Resource(f.source().replace(/&/g, "%26"))));
			DataManager.addTriple(new ERDF.Triple(c, {
				prefix : "oryx",
				name : "ssnamespace"
			}, new ERDF.Resource(f.namespace())));
			f.extensions().keys().each(function(g) {
				DataManager.addTriple(new ERDF.Triple(c, {
					prefix : "oryx",
					name : "ssextension"
				}, new ERDF.Literal(g)))
			})
		});
		a.each(function(f) {
			DataManager.addTriple(new ERDF.Triple(c, {
				prefix : "oryx",
				name : "render"
			}, new ERDF.Resource("#" + f.resourceId)))
		})
	},
	__counter : 0,
	__provideId : function() {
		while ($(RESOURCE_ID_PREFIX + DataManager.__counter)) {
			DataManager.__counter++
		}
		return RESOURCE_ID_PREFIX + DataManager.__counter
	},
	serializeDOM : function(a) {
		return DataManager.__persistDOM(a)
	},
	syncGlobal : function(a) {
		return DataManager.__syncglobal(a)
	},
	__syncglobal : function(c) {
		var b = c.getCanvas();
		var a = b.getChildShapes(true);
		a
				.select(function(d) {
					return !($(d.resourceId))
				})
				.each(
						function(d) {
							if (USE_ARESS_WORKAROUNDS) {
								var e = d.properties["raziel-type"];
								var g = '<div xmlns="http://www.w3.org/1999/xhtml"><span class="raziel-type">'
										+ e + "</span></div>";
								var f = ResourceManager.__createResource(g);
								d.resourceId = f.id()
							} else {
								var f = ResourceManager.__createResource();
								d.resourceId = f.id()
							}
						});
		a.each(function(d) {
			DataManager.__storeShape(d)
		})
	},
	serialize : function(f, b) {
		if (f.nodeType == f.ELEMENT_NODE) {
			var e = $A(f.childNodes);
			var c = $A(f.attributes);
			var d = new String(f.getAttribute("class"));
			var g = d.split(" ").member("transient");
			if (g) {
				return ""
			}
			var a = "<" + f.nodeName;
			if (!b) {
				a += ' xmlns="'
						+ (f.namespaceURI ? f.namespaceURI : XMLNS.XHTML)
						+ '" xmlns:oryx="http://oryx-editor.org"'
			}
			c.each(function(h) {
				a += " " + h.nodeName + '="' + h.nodeValue + '"'
			});
			if (e.length == 0) {
				a += "/>"
			} else {
				a += ">";
				e.each(function(h) {
					a += DataManager.serialize(h, true)
				});
				a += "</" + f.nodeName + ">"
			}
			return a
		} else {
			if (f.nodeType == f.TEXT_NODE) {
				return f.nodeValue
			}
		}
	},
	addTriple : function(c) {
		if (!c.subject.type == ERDF.LITERAL) {
			throw "Cannot add the triple " + c.toString()
					+ " because the subject is not a resource."
		}
		var a = ERDF.__stripHashes(c.subject.value);
		var b = $(a);
		if (!b) {
			throw "Cannot add the triple " + c.toString()
					+ ' because the subject "' + a
					+ '" is not in the document.'
		}
		if (c.object.type == ERDF.LITERAL) {
			DataManager.graft(XMLNS.XHTML, b, [ "span", {
				"class" : (c.predicate.prefix + "-" + c.predicate.name)
			}, c.object.value.escapeHTML() ])
		} else {
			DataManager.graft(XMLNS.XHTML, b, [ "a", {
				rel : (c.predicate.prefix + "-" + c.predicate.name),
				href : c.object.value
			} ])
		}
		return true
	},
	removeTriples : function(b) {
		var a = b.select(function(c) {
			return DataManager.__removeTriple(c)
		});
		return a
	},
	removeTriple : function(b) {
		var a = DataManager.__removeTriple(b);
		return a
	},
	__removeTriple : function(d) {
		if (!d.subject.type == ERDF.LITERAL) {
			throw "Cannot remove the triple " + d.toString()
					+ " because the subject is not a resource."
		}
		var b = ERDF.__stripHashes(d.subject.value);
		var c = $(b);
		if (!c) {
			throw "Cannot remove the triple " + d.toString()
					+ " because the subject is not in the document."
		}
		if (d.object.type == ERDF.LITERAL) {
			var a = DataManager.__removeTripleRecursively(d, c);
			return a
		}
	},
	__removeTripleRecursively : function(e, d) {
		if (d.nodeType != d.ELEMENT_NODE) {
			return false
		}
		var b = new String(d.getAttribute("class"));
		var a = $A(d.childNodes);
		if (b.include(e.predicate.prefix + "-" + e.predicate.name)) {
			var c = d.textContent;
			if ((e.object.type == ERDF.LITERAL) && (e.object.value == c)) {
				d.parentNode.removeChild(d)
			}
			return true
		} else {
			a.each(function(f) {
				DataManager.__removeTripleRecursively(e, f)
			});
			return false
		}
	},
	graft : function(g, f, d, l) {
		l = (l || (f && f.ownerDocument) || document);
		var h;
		if (d === undefined) {
			echo("Can't graft an undefined value")
		} else {
			if (d.constructor == String) {
				h = l.createTextNode(d)
			} else {
				for (var c = 0; c < d.length; c++) {
					if (c === 0 && d[c].constructor == String) {
						var a = d[c].match(/^([a-z][a-z0-9]*)\.([^\s\.]+)$/i);
						if (a) {
							h = l.createElementNS(g, a[1]);
							h.setAttributeNS(null, "class", a[2]);
							continue
						}
						a = d[c].match(/^([a-z][a-z0-9]*)$/i);
						if (a) {
							h = l.createElementNS(g, a[1]);
							continue
						}
						h = l.createElementNS(g, "span");
						h.setAttribute(null, "class", "namelessFromLOL")
					}
					if (d[c] === undefined) {
						echo("Can't graft an undefined value in a list!")
					} else {
						if (d[c].constructor == String
								|| d[c].constructor == Array) {
							this.graft(g, h, d[c], l)
						} else {
							if (d[c].constructor == Number) {
								this.graft(g, h, d[c].toString(), l)
							} else {
								if (d[c].constructor == Object) {
									for ( var b in d[c]) {
										h.setAttributeNS(null, b, d[c][b])
									}
								} else {
									if (d[c].constructor == Boolean) {
										this.graft(g, h, d[c] ? "true"
												: "false", l)
									} else {
										throw "Object "
												+ d[c]
												+ " is inscrutable as an graft arglet."
									}
								}
							}
						}
					}
				}
			}
		}
		if (f) {
			f.appendChild(h)
		}
		return Element.extend(h)
	},
	setObject : function(a) {
		var b = DataManager.query(a.subject, a.predicate, undefined);
		DataManager.removeTriples(b);
		DataManager.addTriple(a);
		return true
	},
	query : function(c, a, b) {
		return DataManager._triples
				.select(function(e) {
					var d = ((c) ? (e.subject.type == c.type)
							&& (e.subject.value == c.value) : true);
					if (a) {
						d = d
								&& ((a.prefix) ? (e.predicate.prefix == a.prefix)
										: true);
						d = d
								&& ((a.name) ? (e.predicate.name == a.name)
										: true)
					}
					d = d
							&& ((b) ? (e.object.type == b.type)
									&& (e.object.value == b.value) : true);
					return d
				})
	}
};
Kickstart.register(DataManager.init);
function assert(b, a) {
	if (!b) {
		throw a
	}
}
function DMCommand(a, b) {
	this.action = a;
	this.triple = b;
	this.toString = function() {
		return "Command(" + a + ", " + b + ")"
	}
}
function DMCommandHandler(a) {
	this.__setNext = function(c) {
		var b = this.__next;
		this.__next = a;
		return b ? b : true
	};
	this.__setNext(a);
	this.__invokeNext = function(b) {
		return this.__next ? this.__next.handle(b) : false
	};
	this.handle = function(b) {
		return this.process(b) ? true : this.__invokeNext(b)
	};
	this.process = function(b) {
		return false
	}
}
function MetaTagHandler(next) {
	DMCommandHandler.apply(this, [ next ]);
	this.process = function(command) {
		with (command.triple) {
			if (!((subject instanceof ERDF.Resource)
					&& (subject.isCurrentDocument()) && (object instanceof ERDF.Literal))) {
				return false
			}
		}
	}
}
var chain = new MetaTagHandler();
var command = new DMCommand(TRIPLE_ADD, new ERDF.Triple(new ERDF.Resource(""),
		"rdf:tool", new ERDF.Literal("")));
ResourceManager = {
	__corrupt : false,
	__latelyCreatedResource : undefined,
	__listeners : $H(),
	__token : 1,
	addListener : function(d, b) {
		if (!(d instanceof Function)) {
			throw "Resource event listener is not a function!"
		}
		if (!(b)) {
			throw "Invalid mask for resource event listener registration."
		}
		var a = {
			listener : d,
			mask : b
		};
		var c = ResourceManager.__token++;
		ResourceManager.__listeners[c] = a;
		return c
	},
	removeListener : function(a) {
		return ResourceManager.__listners.remove(a)
	},
	__Event : function(a, b) {
		this.action = a;
		this.resourceId = b
	},
	__dispatchEvent : function(a) {
		ResourceManager.__listeners.values().each(function(b) {
			if (a.action & b.mask) {
				return b.listener(a)
			}
		})
	},
	getResource : function(c) {
		c = ERDF.__stripHashes(c);
		var b = DataManager.query(new ERDF.Resource("#" + c), {
			prefix : "raziel",
			name : "entry"
		}, undefined);
		if ((b.length == 1) && (b[0].object.isResource())) {
			var a = b[0].object.value;
			return new ResourceManager.__Resource(c, a)
		}
		throw ("Resource with id " + c + " not recognized as such. " + ((b.length > 1) ? " There is more than one raziel:entry URL."
				: " There is no raziel:entry URL."));
		return false
	},
	__createResource : function(e) {
		var d = DataManager.query(new ERDF.Resource(""), {
			prefix : "raziel",
			name : "collection"
		}, undefined);
		if ((d.length == 1) && (d[0].object.isResource())) {
			var b = d[0].object.value;
			var c = undefined;
			var a = e ? e : '<div xmlns="http://www.w3.org/1999/xhtml"></div>';
			ResourceManager.__request("POST", b, a, function() {
				var f = (this.responseXML);
				var h = f.childNodes[0];
				var g = h.getAttribute("id");
				if (!$$("." + PROCESSDATA_REF)[0]) {
					DataManager.graft(XMLNS.XHTML, document
							.getElementsByTagNameNS(XMLNS.XHTML, "body")
							.item(0), [ "div", {
						"class" : PROCESSDATA_REF,
						style : "display:none;"
					} ])
				}
				$$("." + PROCESSDATA_REF)[0].appendChild(h.cloneNode(true));
				DataManager.__synclocal();
				c = new ResourceManager.getResource(g);
				ResourceManager.__resourceActionSucceeded(this,
						RESOURCE_CREATED, undefined)
			}, function() {
				ResourceManager.__resourceActionFailed(this, RESOURCE_CREATED,
						undefined)
			}, false);
			return c
		}
		throw "Could not create resource! raziel:collection URL is missing!";
		return false
	},
	__Resource : function(b, a) {
		this.__id = b;
		this.__url = a;
		this.id = function() {
			return this.__id
		};
		this.url = function() {
			return this.__url
		};
		this.reload = function() {
			var d = this.__url;
			var c = this.__id;
			ResourceManager.__request("GET", d, null, function() {
				ResourceManager.__resourceActionSucceeded(this,
						RESOURCE_RELOADED, c)
			}, function() {
				ResourceManager.__resourceActionFailed(this, RESURCE_RELOADED,
						c)
			}, USE_ASYNCHRONOUS_REQUESTS)
		};
		this.save = function(e) {
			var d = this.__url;
			var c = this.__id;
			data = DataManager.serialize($(c));
			ResourceManager.__request("PUT", d, data, function() {
				ResourceManager.__resourceActionSucceeded(this,
						e ? RESOURCE_SAVED | RESOURCE_SYNCHRONIZED
								: RESOURCE_SAVED, c)
			}, function() {
				ResourceManager.__resourceActionFailed(this, e ? RESOURCE_SAVED
						| RESOURCE_SYNCHRONIZED : RESOURCE.SAVED, c)
			}, USE_ASYNCHRONOUS_REQUESTS)
		};
		this.remove = function() {
			var d = this.__url;
			var c = this.__id;
			ResourceManager.__request("DELETE", d, null, function() {
				ResourceManager.__resourceActionSucceeded(this,
						RESOURCE_REMOVED, c)
			}, function() {
				ResourceManager.__resourceActionFailed(this, RESOURCE_REMOVED,
						c)
			}, USE_ASYNCHRONOUS_REQUESTS)
		}
	},
	request : function(c, a) {
		var b = {
			method : "get",
			asynchronous : true,
			parameters : {}
		};
		Object.extend(b, a || {});
		var d = Hash.toQueryString(b.parameters);
		if (d) {
			c += (c.include("?") ? "&" : "?") + d
		}
		return ResourceManager.__request(b.method, c, b.data,
				(b.onSuccess instanceof Function ? function() {
					b.onSuccess(this)
				} : undefined), (b.onFailure instanceof Function ? function() {
					b.onFailure(this)
				} : undefined), b.asynchronous && USE_ASYNCHRONOUS_REQUESTS,
				b.headers)
	},
	__request : function(a, b, f, n, m, d, c) {
		var g = Try.these(function() {
			return new XMLHttpRequest()
		}, function() {
			return new ActiveXObject("Msxml2.XMLHTTP")
		}, function() {
			return new ActiveXObject("Microsoft.XMLHTTP")
		});
		if (!g) {
			if (!this.__corrupt) {
				throw "This browser does not provide any AJAX functionality. You will not be able to use the software provided with the page you are viewing. Please consider installing appropriate extensions."
			}
			this.__corrupt = true;
			return false
		}
		if (n instanceof Function) {
			g.onload = n
		}
		if (m instanceof Function) {
			g.onerror = m
		}
		var k = $H(c);
		k.keys().each(function(e) {
			g.setRequestHeader(e, k[e])
		});
		try {
			if (SHOW_DEBUG_ALERTS_WHEN_SAVING) {
				alert(a + " " + b + "\n" + SHOW_EXTENDED_DEBUG_INFORMATION ? f
						: "")
			}
			g.open(a, b, !d ? false : true);
			g.send(f)
		} catch (l) {
			return false
		}
		return true
	},
	__resourceActionSucceeded : function(g, c, f) {
		var a = g.status;
		var b = g.responseText;
		if (SHOW_DEBUG_ALERTS_WHEN_SAVING) {
			alert(a + " " + url + "\n" + SHOW_EXTENDED_DEBUG_INFORMATION ? data
					: "")
		}
		if (a >= 300) {
			throw "The server responded with an error: "
					+ a
					+ "\n"
					+ (SHOW_EXTENDED_DEBUG_INFORMATION ? +data
							: "If you need additional information here, including the data sent by the server, consider setting SHOW_EXTENDED_DEBUG_INFORMATION to true.")
		}
		switch (c) {
		case RESOURCE_REMOVED:
			var b = (g.responseXML);
			var e = b.childNodes[0];
			var f = e.getAttribute("id");
			var d = document.getElementById(f);
			d.parentNode.removeChild(d);
			break;
		case RESOURCE_CREATED:
			break;
		case RESOURCE_SAVED | RESOURCE_SYNCHRONIZED:
			DataManager.__synclocal();
		case RESOURCE_SAVED:
			break;
		case RESOURCE_RELOADED:
			var b = (g.responseXML);
			var e = b.childNodes[0];
			var f = e.getAttribute("id");
			var d = document.getElementById(f);
			d.parentNode.removeChild(d);
			if (!$$(PROCESSDATA_REF)[0]) {
				DataManager.graft(XMLNS.XHTML, document.getElementsByTagNameNS(
						XMLNS.XHTML, "body").item(0), [ "div", {
					"class" : PROCESSDATA_REF,
					style : "display:none;"
				} ])
			}
			$$(PROCESSDATA_REF)[0].appendChild(e.cloneNode(true));
			DataManager.__synclocal();
			break;
		default:
			DataManager.__synclocal()
		}
		ResourceManager.__dispatchEvent(new ResourceManager.__Event(c, f))
	},
	__resourceActionFailed : function(c, a, b) {
		throw "Fatal: Resource action failed. There is something horribly wrong with either the server, the transport protocol or your online status. Sure you're online?"
	}
};
var Clazz = function() {
};
Clazz.prototype.construct = function() {
};
Clazz.extend = function(e) {
	var a = function() {
		if (arguments[0] !== Clazz) {
			this.construct.apply(this, arguments)
		}
	};
	var d = new this(Clazz);
	var b = this.prototype;
	for ( var f in e) {
		var c = e[f];
		if (c instanceof Function) {
			c.$ = b
		}
		d[f] = c
	}
	a.prototype = d;
	a.extend = this.extend;
	return a
};
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.CONFIG) {
	ORYX.CONFIG = {}
}
ORYX.CONFIG.ROOT_PATH = "editor/";
ORYX.CONFIG.EXPLORER_PATH = "explorer";
ORYX.CONFIG.LIBS_PATH = "libs";
ORYX.CONFIG.SERVER_HANDLER_ROOT = "service";
ORYX.CONFIG.SERVER_EDITOR_HANDLER = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/editor";
ORYX.CONFIG.SERVER_MODEL_HANDLER = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/model";
ORYX.CONFIG.STENCILSET_HANDLER = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/editor_stencilset?embedsvg=true&url=true&namespace=";
ORYX.CONFIG.STENCIL_SETS_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/editor_stencilset";
ORYX.CONFIG.PLUGINS_CONFIG = "editor-app/plugins.xml";
ORYX.CONFIG.SYNTAXCHECKER_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/syntaxchecker";
ORYX.CONFIG.DEPLOY_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/model/deploy";
ORYX.CONFIG.MODEL_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/models";
ORYX.CONFIG.FORM_FLOW_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/formflows";
ORYX.CONFIG.FORM_FLOW_IMAGE_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/formflow";
ORYX.CONFIG.FORM_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/forms";
ORYX.CONFIG.FORM_IMAGE_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/form";
ORYX.CONFIG.SUB_PROCESS_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/subprocesses";
ORYX.CONFIG.SUB_PROCESS_IMAGE_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/subprocess";
ORYX.CONFIG.TEST_SERVICE_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/service/";
ORYX.CONFIG.SERVICE_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT + "/services";
ORYX.CONFIG.CONDITION_ELEMENT_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/conditionelements";
ORYX.CONFIG.VARIABLEDEF_ELEMENT_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/variabledefinitionelements";
ORYX.CONFIG.VALIDATOR_LIST_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/validators";
ORYX.CONFIG.SS_EXTENSIONS_FOLDER = ORYX.CONFIG.ROOT_PATH
		+ "stencilsets/extensions/";
ORYX.CONFIG.SS_EXTENSIONS_CONFIG = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/editor_ssextensions";
ORYX.CONFIG.ORYX_NEW_URL = "/new";
ORYX.CONFIG.BPMN_LAYOUTER = ORYX.CONFIG.ROOT_PATH + "bpmnlayouter";
ORYX.CONFIG.EXPRESSION_METADATA_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/expression-metadata";
ORYX.CONFIG.DATASOURCE_METADATA_URL = ORYX.CONFIG.SERVER_HANDLER_ROOT
		+ "/datasource-metadata";
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.CONFIG) {
	ORYX.CONFIG = {}
}
ORYX.CONFIG.BACKEND_SWITCH = true;
ORYX.CONFIG.PANEL_LEFT_WIDTH = 250;
ORYX.CONFIG.PANEL_RIGHT_COLLAPSED = true;
ORYX.CONFIG.PANEL_RIGHT_WIDTH = 300;
ORYX.CONFIG.APPNAME = "KISBPM";
ORYX.CONFIG.WEB_URL = ".";
ORYX.CONFIG.BLANK_IMAGE = ORYX.CONFIG.LIBS_PATH
		+ "/ext-2.0.2/resources/images/default/s.gif";
ORYX.CONFIG.OFFSET_HEADER = 61;
ORYX.CONFIG.SHOW_GRIDLINE = true;
ORYX.CONFIG.MODE_READONLY = "readonly";
ORYX.CONFIG.MODE_FULLSCREEN = "fullscreen";
ORYX.CONFIG.WINDOW_HEIGHT = 800;
ORYX.CONFIG.PREVENT_LOADINGMASK_AT_READY = false;
ORYX.CONFIG.PLUGINS_ENABLED = true;
ORYX.CONFIG.PLUGINS_FOLDER = "Plugins/";
ORYX.CONFIG.BPMN20_SCHEMA_VALIDATION_ON = true;
ORYX.CONFIG.NAMESPACE_ORYX = "http://www.b3mn.org/oryx";
ORYX.CONFIG.NAMESPACE_SVG = "http://www.w3.org/2000/svg";
ORYX.CONFIG.CANVAS_WIDTH = 1200;
ORYX.CONFIG.CANVAS_HEIGHT = 1050;
ORYX.CONFIG.CANVAS_RESIZE_INTERVAL = 100;
ORYX.CONFIG.CANVAS_MIN_WIDTH = 800;
ORYX.CONFIG.CANVAS_MIN_HEIGHT = 300;
ORYX.CONFIG.SELECTED_AREA_PADDING = 4;
ORYX.CONFIG.CANVAS_BACKGROUND_COLOR = "none";
ORYX.CONFIG.GRID_DISTANCE = 30;
ORYX.CONFIG.GRID_ENABLED = true;
ORYX.CONFIG.ZOOM_OFFSET = 0.1;
ORYX.CONFIG.DEFAULT_SHAPE_MARGIN = 60;
ORYX.CONFIG.SCALERS_SIZE = 7;
ORYX.CONFIG.MINIMUM_SIZE = 20;
ORYX.CONFIG.MAXIMUM_SIZE = 10000;
ORYX.CONFIG.OFFSET_MAGNET = 15;
ORYX.CONFIG.OFFSET_EDGE_LABEL_TOP = 8;
ORYX.CONFIG.OFFSET_EDGE_LABEL_BOTTOM = 8;
ORYX.CONFIG.OFFSET_EDGE_BOUNDS = 5;
ORYX.CONFIG.COPY_MOVE_OFFSET = 30;
ORYX.CONFIG.BORDER_OFFSET = 14;
ORYX.CONFIG.MAX_NUM_SHAPES_NO_GROUP = 20;
ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER = 30;
ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET = 45;
ORYX.CONFIG.SHAPEMENU_RIGHT = "Oryx_Right";
ORYX.CONFIG.SHAPEMENU_BOTTOM = "Oryx_Bottom";
ORYX.CONFIG.SHAPEMENU_LEFT = "Oryx_Left";
ORYX.CONFIG.SHAPEMENU_TOP = "Oryx_Top";
ORYX.CONFIG.MORPHITEM_DISABLED = "Oryx_MorphItem_disabled";
ORYX.CONFIG.TYPE_STRING = "string";
ORYX.CONFIG.TYPE_BOOLEAN = "boolean";
ORYX.CONFIG.TYPE_INTEGER = "integer";
ORYX.CONFIG.TYPE_FLOAT = "float";
ORYX.CONFIG.TYPE_COLOR = "color";
ORYX.CONFIG.TYPE_DATE = "date";
ORYX.CONFIG.TYPE_CHOICE = "choice";
ORYX.CONFIG.TYPE_URL = "url";
ORYX.CONFIG.TYPE_DIAGRAM_LINK = "diagramlink";
ORYX.CONFIG.TYPE_COMPLEX = "complex";
ORYX.CONFIG.TYPE_MULTIPLECOMPLEX = "multiplecomplex";
ORYX.CONFIG.TYPE_TEXT = "text";
ORYX.CONFIG.TYPE_KISBPM_MULTIINSTANCE = "kisbpm-multiinstance";
ORYX.CONFIG.TYPE_MODEL_LINK = "modellink";
ORYX.CONFIG.TYPE_FORM_FLOW_LINK = "formflowlink";
ORYX.CONFIG.TYPE_FORM_LINK = "formlink";
ORYX.CONFIG.TYPE_SUB_PROCESS_LINK = "subprocesslink";
ORYX.CONFIG.TYPE_SERVICE_LINK = "servicelink";
ORYX.CONFIG.TYPE_CONDITIONS = "conditions";
ORYX.CONFIG.TYPE_VARIABLES = "variables";
ORYX.CONFIG.TYPE_LISTENER = "listener";
ORYX.CONFIG.TYPE_EPC_FREQ = "epcfrequency";
ORYX.CONFIG.TYPE_GLOSSARY_LINK = "glossarylink";
ORYX.CONFIG.TYPE_EXPRESSION = "expression";
ORYX.CONFIG.TYPE_DATASOURCE = "datasource";
ORYX.CONFIG.TYPE_DATASOURCE_MINIMAL = "datasource-minimal";
ORYX.CONFIG.TYPE_VALIDATORS = "validators";
ORYX.CONFIG.LABEL_LINE_DISTANCE = 2;
ORYX.CONFIG.LABEL_DEFAULT_LINE_HEIGHT = 12;
ORYX.CONFIG.ENABLE_MORPHMENU_BY_HOVER = false;
ORYX.CONFIG.EDITOR_ALIGN_BOTTOM = 1;
ORYX.CONFIG.EDITOR_ALIGN_MIDDLE = 2;
ORYX.CONFIG.EDITOR_ALIGN_TOP = 4;
ORYX.CONFIG.EDITOR_ALIGN_LEFT = 8;
ORYX.CONFIG.EDITOR_ALIGN_CENTER = 16;
ORYX.CONFIG.EDITOR_ALIGN_RIGHT = 32;
ORYX.CONFIG.EDITOR_ALIGN_SIZE = 48;
ORYX.CONFIG.EVENT_MOUSEDOWN = "mousedown";
ORYX.CONFIG.EVENT_MOUSEUP = "mouseup";
ORYX.CONFIG.EVENT_MOUSEOVER = "mouseover";
ORYX.CONFIG.EVENT_MOUSEOUT = "mouseout";
ORYX.CONFIG.EVENT_MOUSEMOVE = "mousemove";
ORYX.CONFIG.EVENT_DBLCLICK = "dblclick";
ORYX.CONFIG.EVENT_KEYDOWN = "keydown";
ORYX.CONFIG.EVENT_KEYUP = "keyup";
ORYX.CONFIG.EVENT_LOADED = "editorloaded";
ORYX.CONFIG.EVENT_SAVED = "editorSaved";
ORYX.CONFIG.EVENT_EXECUTE_COMMANDS = "executeCommands";
ORYX.CONFIG.EVENT_STENCIL_SET_LOADED = "stencilSetLoaded";
ORYX.CONFIG.EVENT_SELECTION_CHANGED = "selectionchanged";
ORYX.CONFIG.EVENT_SHAPEADDED = "shapeadded";
ORYX.CONFIG.EVENT_SHAPEREMOVED = "shaperemoved";
ORYX.CONFIG.EVENT_PROPERTY_CHANGED = "propertyChanged";
ORYX.CONFIG.EVENT_DRAGDROP_START = "dragdrop.start";
ORYX.CONFIG.EVENT_SHAPE_MENU_CLOSE = "shape.menu.close";
ORYX.CONFIG.EVENT_DRAGDROP_END = "dragdrop.end";
ORYX.CONFIG.EVENT_RESIZE_START = "resize.start";
ORYX.CONFIG.EVENT_RESIZE_END = "resize.end";
ORYX.CONFIG.EVENT_DRAGDOCKER_DOCKED = "dragDocker.docked";
ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW = "highlight.showHighlight";
ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE = "highlight.hideHighlight";
ORYX.CONFIG.EVENT_LOADING_ENABLE = "loading.enable";
ORYX.CONFIG.EVENT_LOADING_DISABLE = "loading.disable";
ORYX.CONFIG.EVENT_LOADING_STATUS = "loading.status";
ORYX.CONFIG.EVENT_OVERLAY_SHOW = "overlay.show";
ORYX.CONFIG.EVENT_OVERLAY_HIDE = "overlay.hide";
ORYX.CONFIG.EVENT_ARRANGEMENT_TOP = "arrangement.setToTop";
ORYX.CONFIG.EVENT_ARRANGEMENT_BACK = "arrangement.setToBack";
ORYX.CONFIG.EVENT_ARRANGEMENT_FORWARD = "arrangement.setForward";
ORYX.CONFIG.EVENT_ARRANGEMENT_BACKWARD = "arrangement.setBackward";
ORYX.CONFIG.EVENT_PROPWINDOW_PROP_CHANGED = "propertyWindow.propertyChanged";
ORYX.CONFIG.EVENT_LAYOUT_ROWS = "layout.rows";
ORYX.CONFIG.EVENT_LAYOUT_BPEL = "layout.BPEL";
ORYX.CONFIG.EVENT_LAYOUT_BPEL_VERTICAL = "layout.BPEL.vertical";
ORYX.CONFIG.EVENT_LAYOUT_BPEL_HORIZONTAL = "layout.BPEL.horizontal";
ORYX.CONFIG.EVENT_LAYOUT_BPEL_SINGLECHILD = "layout.BPEL.singlechild";
ORYX.CONFIG.EVENT_LAYOUT_BPEL_AUTORESIZE = "layout.BPEL.autoresize";
ORYX.CONFIG.EVENT_AUTOLAYOUT_LAYOUT = "autolayout.layout";
ORYX.CONFIG.EVENT_UNDO_EXECUTE = "undo.execute";
ORYX.CONFIG.EVENT_UNDO_ROLLBACK = "undo.rollback";
ORYX.CONFIG.EVENT_BUTTON_UPDATE = "toolbar.button.update";
ORYX.CONFIG.EVENT_LAYOUT = "layout.dolayout";
ORYX.CONFIG.EVENT_GLOSSARY_LINK_EDIT = "glossary.link.edit";
ORYX.CONFIG.EVENT_GLOSSARY_SHOW = "glossary.show.info";
ORYX.CONFIG.EVENT_GLOSSARY_NEW = "glossary.show.new";
ORYX.CONFIG.EVENT_DOCKERDRAG = "dragTheDocker";
ORYX.CONFIG.EVENT_CANVAS_SCROLL = "canvas.scroll";
ORYX.CONFIG.EVENT_SHOW_PROPERTYWINDOW = "propertywindow.show";
ORYX.CONFIG.EVENT_ABOUT_TO_SAVE = "file.aboutToSave";
ORYX.CONFIG.SELECTION_HIGHLIGHT_SIZE = 5;
ORYX.CONFIG.SELECTION_HIGHLIGHT_COLOR = "#4444FF";
ORYX.CONFIG.SELECTION_HIGHLIGHT_COLOR2 = "#9999FF";
ORYX.CONFIG.SELECTION_HIGHLIGHT_STYLE_CORNER = "corner";
ORYX.CONFIG.SELECTION_HIGHLIGHT_STYLE_RECTANGLE = "rectangle";
ORYX.CONFIG.SELECTION_VALID_COLOR = "#00FF00";
ORYX.CONFIG.SELECTION_INVALID_COLOR = "#FF0000";
ORYX.CONFIG.DOCKER_DOCKED_COLOR = "#00FF00";
ORYX.CONFIG.DOCKER_UNDOCKED_COLOR = "#FF0000";
ORYX.CONFIG.DOCKER_SNAP_OFFSET = 10;
ORYX.CONFIG.EDIT_OFFSET_PASTE = 10;
ORYX.CONFIG.KEY_CODE_X = 88;
ORYX.CONFIG.KEY_CODE_C = 67;
ORYX.CONFIG.KEY_CODE_V = 86;
ORYX.CONFIG.KEY_CODE_DELETE = 46;
ORYX.CONFIG.KEY_CODE_META = 224;
ORYX.CONFIG.KEY_CODE_BACKSPACE = 8;
ORYX.CONFIG.KEY_CODE_LEFT = 37;
ORYX.CONFIG.KEY_CODE_RIGHT = 39;
ORYX.CONFIG.KEY_CODE_UP = 38;
ORYX.CONFIG.KEY_CODE_DOWN = 40;
ORYX.CONFIG.KEY_Code_enter = 12;
ORYX.CONFIG.KEY_Code_left = 37;
ORYX.CONFIG.KEY_Code_right = 39;
ORYX.CONFIG.KEY_Code_top = 38;
ORYX.CONFIG.KEY_Code_bottom = 40;
ORYX.CONFIG.META_KEY_META_CTRL = "metactrl";
ORYX.CONFIG.META_KEY_ALT = "alt";
ORYX.CONFIG.META_KEY_SHIFT = "shift";
ORYX.CONFIG.KEY_ACTION_DOWN = "down";
ORYX.CONFIG.KEY_ACTION_UP = "up";
ORYX.CONFIG.FORM_ROW_WIDTH = 350;
ORYX.CONFIG.FORM_GROUP_MARGIN = 5;
ORYX.CONFIG.FORM_GROUP_EMPTY_HEIGHT = 100;
ORYX.CONFIG.FORM_ELEMENT_ID_PREFIX = "http://b3mn.org/stencilset/xforms";
ORYX.CONFIG.FORM_ELEMENT_TYPE_ROOT = "http://b3mn.org/stencilset/xforms#XForm";
ORYX.CONFIG.FORM_ELEMENT_TYPE_GROUP = "http://b3mn.org/stencilset/xforms#Group";
ORYX.CONFIG.FORM_ELEMENT_TYPE_REPEATING_GROUP = "http://b3mn.org/stencilset/xforms#RepeatingGroup";
ORYX.CONFIG.FORM_ELEMENT_TYPE_LABEL_FIELD = "http://b3mn.org/stencilset/xforms#LabelField";
function printf() {
	var a = arguments[0];
	for (var b = 1; b < arguments.length; b++) {
		a = a.replace("%" + (b - 1), arguments[b])
	}
	return a
}
var ORYX_LOGLEVEL_TRACE = 5;
var ORYX_LOGLEVEL_DEBUG = 4;
var ORYX_LOGLEVEL_INFO = 3;
var ORYX_LOGLEVEL_WARN = 2;
var ORYX_LOGLEVEL_ERROR = 1;
var ORYX_LOGLEVEL_FATAL = 0;
var ORYX_LOGLEVEL = 3;
var ORYX_CONFIGURATION_DELAY = 100;
var ORYX_CONFIGURATION_WAIT_ATTEMPTS = 10;
if (!ORYX) {
	var ORYX = {}
}
ORYX = Object
		.extend(
				ORYX,
				{
					PATH : ORYX.CONFIG.ROOT_PATH,
					URLS : [],
					alreadyLoaded : [],
					configrationRetries : 0,
					Version : "0.1.1",
					availablePlugins : [],
					Log : {
						__appenders : [ {
							append : function(a) {
								if (typeof (console) !== "undefined"
										&& console.log !== undefined) {
									console.log(a)
								}
							}
						} ],
						trace : function() {
							if (ORYX_LOGLEVEL >= ORYX_LOGLEVEL_TRACE) {
								ORYX.Log.__log("TRACE", arguments)
							}
						},
						debug : function() {
							if (ORYX_LOGLEVEL >= ORYX_LOGLEVEL_DEBUG) {
								ORYX.Log.__log("DEBUG", arguments)
							}
						},
						info : function() {
							if (ORYX_LOGLEVEL >= ORYX_LOGLEVEL_INFO) {
								ORYX.Log.__log("INFO", arguments)
							}
						},
						warn : function() {
							if (ORYX_LOGLEVEL >= ORYX_LOGLEVEL_WARN) {
								ORYX.Log.__log("WARN", arguments)
							}
						},
						error : function() {
							if (ORYX_LOGLEVEL >= ORYX_LOGLEVEL_ERROR) {
								ORYX.Log.__log("ERROR", arguments)
							}
						},
						fatal : function() {
							if (ORYX_LOGLEVEL >= ORYX_LOGLEVEL_FATAL) {
								ORYX.Log.__log("FATAL", arguments)
							}
						},
						__log : function(c, a) {
							a[0] = (new Date()).getTime() + " " + c + " "
									+ a[0];
							var b = printf.apply(null, a);
							ORYX.Log.__appenders.each(function(d) {
								d.append(b)
							})
						},
						addAppender : function(a) {
							ORYX.Log.__appenders.push(a)
						}
					},
					load : function() {
						ORYX.Log.debug("Oryx begins loading procedure.");
						if ((typeof Prototype == "undefined")
								|| (typeof Element == "undefined")
								|| (typeof Element.Methods == "undefined")
								|| parseFloat(Prototype.Version.split(".")[0]
										+ "." + Prototype.Version.split(".")[1]) < 1.5) {
							throw ("Application requires the Prototype JavaScript framework >= 1.5.3")
						}
						ORYX.Log.debug("Prototype > 1.5 found.");
						ORYX._load()
					},
					_load : function() {
						ORYX.loadPlugins()
					},
					loadPlugins : function() {
						if (ORYX.CONFIG.PLUGINS_ENABLED) {
							ORYX._loadPlugins()
						} else {
							ORYX.Log
									.warn("Ignoring plugins, loading Core only.")
						}
						init()
					},
					_loadPlugins : function() {
						var a = ORYX.CONFIG.PLUGINS_CONFIG;
						ORYX.Log.debug(
								"Loading plugin configuration from '%0'.", a);
						new Ajax.Request(
								a,
								{
									asynchronous : false,
									method : "get",
									onSuccess : function(c) {
										ORYX.Log
												.info("Plugin configuration file loaded.");
										var f = c.responseXML;
										var b = [];
										var d = $A(f
												.getElementsByTagName("properties"));
										d.each(function(h) {
											var g = $A(h.childNodes);
											g.each(function(m) {
												var l = new Hash();
												var k = $A(m.attributes);
												k.each(function(n) {
													l[n.nodeName] = n.nodeValue
												});
												if (k.length > 0) {
													b.push(l)
												}
											})
										});
										var e = f
												.getElementsByTagName("plugin");
										$A(e)
												.each(
														function(k) {
															var p = new Hash();
															$A(k.attributes)
																	.each(
																			function(
																					r) {
																				p[r.nodeName] = r.nodeValue
																			});
															if (!p.name) {
																ORYX.Log
																		.error("A plugin is not providing a name. Ingnoring this plugin.");
																return

																

																																

																

															}
															if (!p.source) {
																ORYX.Log
																		.error(
																				"Plugin with name '%0' doesn't provide a source attribute.",
																				p.name);
																return

																

																																

																

															}
															var n = k
																	.getElementsByTagName("property");
															var o = [];
															$A(n)
																	.each(
																			function(
																					t) {
																				var s = new Hash();
																				var r = $A(t.attributes);
																				r
																						.each(function(
																								u) {
																							s[u.nodeName] = u.nodeValue
																						});
																				if (r.length > 0) {
																					o
																							.push(s)
																				}
																			});
															o = o.concat(b);
															p.properties = o;
															var l = k
																	.getElementsByTagName("requires");
															var q;
															$A(l)
																	.each(
																			function(
																					s) {
																				var r = $A(
																						s.attributes)
																						.find(
																								function(
																										t) {
																									return t.name == "namespace"
																								});
																				if (r
																						&& r.nodeValue) {
																					if (!q) {
																						q = {
																							namespaces : []
																						}
																					}
																					q.namespaces
																							.push(r.nodeValue)
																				}
																			});
															if (q) {
																p.requires = q
															}
															var m = k
																	.getElementsByTagName("notUsesIn");
															var h;
															$A(m)
																	.each(
																			function(
																					s) {
																				var r = $A(
																						s.attributes)
																						.find(
																								function(
																										t) {
																									return t.name == "namespace"
																								});
																				if (r
																						&& r.nodeValue) {
																					if (!h) {
																						h = {
																							namespaces : []
																						}
																					}
																					h.namespaces
																							.push(r.nodeValue)
																				}
																			});
															if (h) {
																p.notUsesIn = h
															}
															var g = ORYX.PATH
																	+ ORYX.CONFIG.PLUGINS_FOLDER
																	+ p.source;
															ORYX.Log
																	.debug(
																			"Requireing '%0'",
																			g);
															ORYX.Log
																	.info(
																			"Plugin '%0' successfully loaded.",
																			p.name);
															ORYX.availablePlugins
																	.push(p)
														})
									},
									onFailure : this._loadPluginsOnFails
								})
					},
					_loadPluginsOnFails : function(a) {
						ORYX.Log
								.error("Plugin configuration file not available.")
					}
				});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.SVG) {
	ORYX.Core.SVG = {}
}
ORYX.Core.SVG.EditPathHandler = Clazz.extend({
	construct : function() {
		arguments.callee.$.construct.apply(this, arguments);
		this.x = 0;
		this.y = 0;
		this.oldX = 0;
		this.oldY = 0;
		this.deltaWidth = 1;
		this.deltaHeight = 1;
		this.d = ""
	},
	init : function(a, f, d, b, c, e) {
		this.x = a;
		this.y = f;
		this.oldX = d;
		this.oldY = b;
		this.deltaWidth = c;
		this.deltaHeight = e;
		this.d = ""
	},
	editPointsAbs : function(c) {
		if (c instanceof Array) {
			var d = [];
			var a, e;
			for (var b = 0; b < c.length; b++) {
				a = (parseFloat(c[b]) - this.oldX) * this.deltaWidth + this.x;
				b++;
				e = (parseFloat(c[b]) - this.oldY) * this.deltaHeight + this.y;
				d.push(a);
				d.push(e)
			}
			return d
		} else {
		}
	},
	editPointsRel : function(c) {
		if (c instanceof Array) {
			var d = [];
			var a, e;
			for (var b = 0; b < c.length; b++) {
				a = parseFloat(c[b]) * this.deltaWidth;
				b++;
				e = parseFloat(c[b]) * this.deltaHeight;
				d.push(a);
				d.push(e)
			}
			return d
		} else {
		}
	},
	arcAbs : function(e, c, k, b, f, h, g) {
		var d = this.editPointsAbs([ h, g ]);
		var a = this.editPointsRel([ e, c ]);
		this.d = this.d.concat(" A" + a[0] + " " + a[1] + " " + k + " " + b
				+ " " + f + " " + d[0] + " " + d[1] + " ")
	},
	arcRel : function(f, d, b, e, c, a, h) {
		var g = this.editPointsRel([ f, d, a, h ]);
		this.d = this.d.concat(" a" + g[0] + " " + g[1] + " " + b + " " + e
				+ " " + c + " " + g[2] + " " + g[3] + " ")
	},
	curvetoCubicAbs : function(c, e, b, d, a, g) {
		var f = this.editPointsAbs([ c, e, b, d, a, g ]);
		this.d = this.d.concat(" C" + f[0] + " " + f[1] + " " + f[2] + " "
				+ f[3] + " " + f[4] + " " + f[5] + " ")
	},
	curvetoCubicRel : function(c, e, b, d, a, g) {
		var f = this.editPointsRel([ c, e, b, d, a, g ]);
		this.d = this.d.concat(" c" + f[0] + " " + f[1] + " " + f[2] + " "
				+ f[3] + " " + f[4] + " " + f[5] + " ")
	},
	linetoHorizontalAbs : function(a) {
		var b = this.editPointsAbs([ a, 0 ]);
		this.d = this.d.concat(" H" + b[0] + " ")
	},
	linetoHorizontalRel : function(a) {
		var b = this.editPointsRel([ a, 0 ]);
		this.d = this.d.concat(" h" + b[0] + " ")
	},
	linetoAbs : function(a, c) {
		var b = this.editPointsAbs([ a, c ]);
		this.d = this.d.concat(" L" + b[0] + " " + b[1] + " ")
	},
	linetoRel : function(a, c) {
		var b = this.editPointsRel([ a, c ]);
		this.d = this.d.concat(" l" + b[0] + " " + b[1] + " ")
	},
	movetoAbs : function(a, c) {
		var b = this.editPointsAbs([ a, c ]);
		this.d = this.d.concat(" M" + b[0] + " " + b[1] + " ")
	},
	movetoRel : function(a, c) {
		var b;
		if (this.d === "") {
			b = this.editPointsAbs([ a, c ])
		} else {
			b = this.editPointsRel([ a, c ])
		}
		this.d = this.d.concat(" m" + b[0] + " " + b[1] + " ")
	},
	curvetoQuadraticAbs : function(b, c, a, e) {
		var d = this.editPointsAbs([ b, c, a, e ]);
		this.d = this.d.concat(" Q" + d[0] + " " + d[1] + " " + d[2] + " "
				+ d[3] + " ")
	},
	curvetoQuadraticRel : function(b, c, a, e) {
		var d = this.editPointsRel([ b, c, a, e ]);
		this.d = this.d.concat(" q" + d[0] + " " + d[1] + " " + d[2] + " "
				+ d[3] + " ")
	},
	curvetoCubicSmoothAbs : function(b, c, a, e) {
		var d = this.editPointsAbs([ b, c, a, e ]);
		this.d = this.d.concat(" S" + d[0] + " " + d[1] + " " + d[2] + " "
				+ d[3] + " ")
	},
	curvetoCubicSmoothRel : function(b, c, a, e) {
		var d = this.editPointsRel([ b, c, a, e ]);
		this.d = this.d.concat(" s" + d[0] + " " + d[1] + " " + d[2] + " "
				+ d[3] + " ")
	},
	curvetoQuadraticSmoothAbs : function(a, c) {
		var b = this.editPointsAbs([ a, c ]);
		this.d = this.d.concat(" T" + b[0] + " " + b[1] + " ")
	},
	curvetoQuadraticSmoothRel : function(a, c) {
		var b = this.editPointsRel([ a, c ]);
		this.d = this.d.concat(" t" + b[0] + " " + b[1] + " ")
	},
	linetoVerticalAbs : function(b) {
		var a = this.editPointsAbs([ 0, b ]);
		this.d = this.d.concat(" V" + a[1] + " ")
	},
	linetoVerticalRel : function(b) {
		var a = this.editPointsRel([ 0, b ]);
		this.d = this.d.concat(" v" + a[1] + " ")
	},
	closePath : function() {
		this.d = this.d.concat(" z")
	}
});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.SVG) {
	ORYX.Core.SVG = {}
}
ORYX.Core.SVG.MinMaxPathHandler = Clazz.extend({
	construct : function() {
		arguments.callee.$.construct.apply(this, arguments);
		this.minX = undefined;
		this.minY = undefined;
		this.maxX = undefined;
		this.maxY = undefined;
		this._lastAbsX = undefined;
		this._lastAbsY = undefined
	},
	calculateMinMax : function(c) {
		if (c instanceof Array) {
			var a, d;
			for (var b = 0; b < c.length; b++) {
				a = parseFloat(c[b]);
				b++;
				d = parseFloat(c[b]);
				this.minX = (this.minX !== undefined) ? Math.min(this.minX, a)
						: a;
				this.maxX = (this.maxX !== undefined) ? Math.max(this.maxX, a)
						: a;
				this.minY = (this.minY !== undefined) ? Math.min(this.minY, d)
						: d;
				this.maxY = (this.maxY !== undefined) ? Math.max(this.maxY, d)
						: d;
				this._lastAbsX = a;
				this._lastAbsY = d
			}
		} else {
		}
	},
	arcAbs : function(f, d, b, e, c, a, g) {
		this.calculateMinMax([ a, g ])
	},
	arcRel : function(f, d, b, e, c, a, g) {
		this.calculateMinMax([ this._lastAbsX + a, this._lastAbsY + g ])
	},
	curvetoCubicAbs : function(c, e, b, d, a, f) {
		this.calculateMinMax([ c, e, b, d, a, f ])
	},
	curvetoCubicRel : function(c, e, b, d, a, f) {
		this.calculateMinMax([ this._lastAbsX + c, this._lastAbsY + e,
				this._lastAbsX + b, this._lastAbsY + d, this._lastAbsX + a,
				this._lastAbsY + f ])
	},
	linetoHorizontalAbs : function(a) {
		this.calculateMinMax([ a, this._lastAbsY ])
	},
	linetoHorizontalRel : function(a) {
		this.calculateMinMax([ this._lastAbsX + a, this._lastAbsY ])
	},
	linetoAbs : function(a, b) {
		this.calculateMinMax([ a, b ])
	},
	linetoRel : function(a, b) {
		this.calculateMinMax([ this._lastAbsX + a, this._lastAbsY + b ])
	},
	movetoAbs : function(a, b) {
		this.calculateMinMax([ a, b ])
	},
	movetoRel : function(a, b) {
		if (this._lastAbsX && this._lastAbsY) {
			this.calculateMinMax([ this._lastAbsX + a, this._lastAbsY + b ])
		} else {
			this.calculateMinMax([ a, b ])
		}
	},
	curvetoQuadraticAbs : function(b, c, a, d) {
		this.calculateMinMax([ b, c, a, d ])
	},
	curvetoQuadraticRel : function(b, c, a, d) {
		this.calculateMinMax([ this._lastAbsX + b, this._lastAbsY + c,
				this._lastAbsX + a, this._lastAbsY + d ])
	},
	curvetoCubicSmoothAbs : function(b, c, a, d) {
		this.calculateMinMax([ b, c, a, d ])
	},
	curvetoCubicSmoothRel : function(b, c, a, d) {
		this.calculateMinMax([ this._lastAbsX + b, this._lastAbsY + c,
				this._lastAbsX + a, this._lastAbsY + d ])
	},
	curvetoQuadraticSmoothAbs : function(a, b) {
		this.calculateMinMax([ a, b ])
	},
	curvetoQuadraticSmoothRel : function(a, b) {
		this.calculateMinMax([ this._lastAbsX + a, this._lastAbsY + b ])
	},
	linetoVerticalAbs : function(a) {
		this.calculateMinMax([ this._lastAbsX, a ])
	},
	linetoVerticalRel : function(a) {
		this.calculateMinMax([ this._lastAbsX, this._lastAbsY + a ])
	},
	closePath : function() {
		return

		

				

		

	}
});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.SVG) {
	ORYX.Core.SVG = {}
}
ORYX.Core.SVG.PointsPathHandler = Clazz.extend({
	construct : function() {
		arguments.callee.$.construct.apply(this, arguments);
		this.points = [];
		this._lastAbsX = undefined;
		this._lastAbsY = undefined
	},
	addPoints : function(c) {
		if (c instanceof Array) {
			var a, d;
			for (var b = 0; b < c.length; b++) {
				a = parseFloat(c[b]);
				b++;
				d = parseFloat(c[b]);
				this.points.push(a);
				this.points.push(d);
				this._lastAbsX = a;
				this._lastAbsY = d
			}
		} else {
		}
	},
	arcAbs : function(f, d, b, e, c, a, g) {
		this.addPoints([ a, g ])
	},
	arcRel : function(f, d, b, e, c, a, g) {
		this.addPoints([ this._lastAbsX + a, this._lastAbsY + g ])
	},
	curvetoCubicAbs : function(c, e, b, d, a, f) {
		this.addPoints([ a, f ])
	},
	curvetoCubicRel : function(c, e, b, d, a, f) {
		this.addPoints([ this._lastAbsX + a, this._lastAbsY + f ])
	},
	linetoHorizontalAbs : function(a) {
		this.addPoints([ a, this._lastAbsY ])
	},
	linetoHorizontalRel : function(a) {
		this.addPoints([ this._lastAbsX + a, this._lastAbsY ])
	},
	linetoAbs : function(a, b) {
		this.addPoints([ a, b ])
	},
	linetoRel : function(a, b) {
		this.addPoints([ this._lastAbsX + a, this._lastAbsY + b ])
	},
	movetoAbs : function(a, b) {
		this.addPoints([ a, b ])
	},
	movetoRel : function(a, b) {
		if (this._lastAbsX && this._lastAbsY) {
			this.addPoints([ this._lastAbsX + a, this._lastAbsY + b ])
		} else {
			this.addPoints([ a, b ])
		}
	},
	curvetoQuadraticAbs : function(b, c, a, d) {
		this.addPoints([ a, d ])
	},
	curvetoQuadraticRel : function(b, c, a, d) {
		this.addPoints([ this._lastAbsX + a, this._lastAbsY + d ])
	},
	curvetoCubicSmoothAbs : function(b, c, a, d) {
		this.addPoints([ a, d ])
	},
	curvetoCubicSmoothRel : function(b, c, a, d) {
		this.addPoints([ this._lastAbsX + a, this._lastAbsY + d ])
	},
	curvetoQuadraticSmoothAbs : function(a, b) {
		this.addPoints([ a, b ])
	},
	curvetoQuadraticSmoothRel : function(a, b) {
		this.addPoints([ this._lastAbsX + a, this._lastAbsY + b ])
	},
	linetoVerticalAbs : function(a) {
		this.addPoints([ this._lastAbsX, a ])
	},
	linetoVerticalRel : function(a) {
		this.addPoints([ this._lastAbsX, this._lastAbsY + a ])
	},
	closePath : function() {
		return

		

				

		

	}
});
NAMESPACE_ORYX = "http://www.b3mn.org/oryx";
NAMESPACE_SVG = "http://www.w3.org/2000/svg/";
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.SVG) {
	ORYX.Core.SVG = {}
}
ORYX.Core.SVG.SVGMarker = Clazz.extend({
	construct : function(a) {
		arguments.callee.$.construct.apply(this, arguments);
		this.id = undefined;
		this.element = a;
		this.refX = undefined;
		this.refY = undefined;
		this.markerWidth = undefined;
		this.markerHeight = undefined;
		this.oldRefX = undefined;
		this.oldRefY = undefined;
		this.oldMarkerWidth = undefined;
		this.oldMarkerHeight = undefined;
		this.optional = false;
		this.enabled = true;
		this.minimumLength = undefined;
		this.resize = false;
		this.svgShapes = [];
		this._init()
	},
	_init : function() {
		if (!(this.element == "[object SVGMarkerElement]")) {
			throw "SVGMarker: Argument is not an instance of SVGMarkerElement."
		}
		this.id = this.element.getAttributeNS(null, "id");
		var a = this.element.getAttributeNS(null, "refX");
		if (a) {
			this.refX = parseFloat(a)
		} else {
			this.refX = 0
		}
		var h = this.element.getAttributeNS(null, "refY");
		if (h) {
			this.refY = parseFloat(h)
		} else {
			this.refY = 0
		}
		var f = this.element.getAttributeNS(null, "markerWidth");
		if (f) {
			this.markerWidth = parseFloat(f)
		} else {
			this.markerWidth = 3
		}
		var c = this.element.getAttributeNS(null, "markerHeight");
		if (c) {
			this.markerHeight = parseFloat(c)
		} else {
			this.markerHeight = 3
		}
		this.oldRefX = this.refX;
		this.oldRefY = this.refY;
		this.oldMarkerWidth = this.markerWidth;
		this.oldMarkerHeight = this.markerHeight;
		var g = this.element.getAttributeNS(NAMESPACE_ORYX, "optional");
		if (g) {
			g = g.strip();
			this.optional = (g.toLowerCase() === "yes")
		} else {
			this.optional = false
		}
		var e = this.element.getAttributeNS(NAMESPACE_ORYX, "enabled");
		if (e) {
			e = e.strip();
			this.enabled = !(e.toLowerCase() === "no")
		} else {
			this.enabled = true
		}
		var d = this.element.getAttributeNS(NAMESPACE_ORYX, "minimumLength");
		if (d) {
			this.minimumLength = parseFloat(d)
		}
		var b = this.element.getAttributeNS(NAMESPACE_ORYX, "resize");
		if (b) {
			b = b.strip();
			this.resize = (b.toLowerCase() === "yes")
		} else {
			this.resize = false
		}
	},
	_getSVGShapes : function(c) {
		if (c.hasChildNodes) {
			var a = [];
			var b = this;
			$A(c.childNodes).each(function(d) {
				try {
					var g = new ORYX.Core.SVG.SVGShape(d);
					a.push(g)
				} catch (f) {
					a = a.concat(b._getSVGShapes(d))
				}
			});
			return a
		}
	},
	update : function() {
		this.oldRefX = this.refX;
		this.oldRefY = this.refY;
		this.oldMarkerWidth = this.markerWidth;
		this.oldMarkerHeight = this.markerHeight
	},
	toString : function() {
		return (this.element) ? "SVGMarker " + this.element.id : "SVGMarker "
				+ this.element
	}
});
NAMESPACE_ORYX = "http://www.b3mn.org/oryx";
NAMESPACE_SVG = "http://www.w3.org/2000/svg/";
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.SVG) {
	ORYX.Core.SVG = {}
}
ORYX.Core.SVG.SVGShape = Clazz
		.extend({
			construct : function(a) {
				arguments.callee.$.construct.apply(this, arguments);
				this.type;
				this.element = a;
				this.x = undefined;
				this.y = undefined;
				this.width = undefined;
				this.height = undefined;
				this.oldX = undefined;
				this.oldY = undefined;
				this.oldWidth = undefined;
				this.oldHeight = undefined;
				this.radiusX = undefined;
				this.radiusY = undefined;
				this.isHorizontallyResizable = false;
				this.isVerticallyResizable = false;
				this.anchorLeft = false;
				this.anchorRight = false;
				this.anchorTop = false;
				this.anchorBottom = false;
				this.allowDockers = true;
				this.resizeMarkerMid = false;
				this.editPathParser;
				this.editPathHandler;
				this.init()
			},
			init : function() {
				if (ORYX.Editor.checkClassType(this.element, SVGRectElement)
						|| ORYX.Editor.checkClassType(this.element,
								SVGImageElement)) {
					this.type = "Rect";
					var I = this.element.getAttributeNS(null, "x");
					if (I) {
						this.oldX = parseFloat(I)
					} else {
						throw "Missing attribute in element " + this.element
					}
					var p = this.element.getAttributeNS(null, "y");
					if (p) {
						this.oldY = parseFloat(p)
					} else {
						throw "Missing attribute in element " + this.element
					}
					var r = this.element.getAttributeNS(null, "width");
					if (r) {
						this.oldWidth = parseFloat(r)
					} else {
						throw "Missing attribute in element " + this.element
					}
					var u = this.element.getAttributeNS(null, "height");
					if (u) {
						this.oldHeight = parseFloat(u)
					} else {
						throw "Missing attribute in element " + this.element
					}
				} else {
					if (ORYX.Editor.checkClassType(this.element,
							SVGCircleElement)) {
						this.type = "Circle";
						var h = undefined;
						var e = undefined;
						var a = this.element.getAttributeNS(null, "cx");
						if (a) {
							h = parseFloat(a)
						} else {
							throw "Missing attribute in element "
									+ this.element
						}
						var w = this.element.getAttributeNS(null, "cy");
						if (w) {
							e = parseFloat(w)
						} else {
							throw "Missing attribute in element "
									+ this.element
						}
						var k = this.element.getAttributeNS(null, "r");
						if (k) {
							this.radiusX = parseFloat(k)
						} else {
							throw "Missing attribute in element "
									+ this.element
						}
						this.oldX = h - this.radiusX;
						this.oldY = e - this.radiusX;
						this.oldWidth = 2 * this.radiusX;
						this.oldHeight = 2 * this.radiusX
					} else {
						if (ORYX.Editor.checkClassType(this.element,
								SVGEllipseElement)) {
							this.type = "Ellipse";
							var h = undefined;
							var e = undefined;
							var a = this.element.getAttributeNS(null, "cx");
							if (a) {
								h = parseFloat(a)
							} else {
								throw "Missing attribute in element "
										+ this.element
							}
							var w = this.element.getAttributeNS(null, "cy");
							if (w) {
								e = parseFloat(w)
							} else {
								throw "Missing attribute in element "
										+ this.element
							}
							var J = this.element.getAttributeNS(null, "rx");
							if (J) {
								this.radiusX = parseFloat(J)
							} else {
								throw "Missing attribute in element "
										+ this.element
							}
							var q = this.element.getAttributeNS(null, "ry");
							if (q) {
								this.radiusY = parseFloat(q)
							} else {
								throw "Missing attribute in element "
										+ this.element
							}
							this.oldX = h - this.radiusX;
							this.oldY = e - this.radiusY;
							this.oldWidth = 2 * this.radiusX;
							this.oldHeight = 2 * this.radiusY
						} else {
							if (ORYX.Editor.checkClassType(this.element,
									SVGLineElement)) {
								this.type = "Line";
								var C = undefined;
								var g = undefined;
								var A = undefined;
								var d = undefined;
								var H = this.element.getAttributeNS(null, "x1");
								if (H) {
									C = parseFloat(H)
								} else {
									throw "Missing attribute in element "
											+ this.element
								}
								var b = this.element.getAttributeNS(null, "y1");
								if (b) {
									g = parseFloat(b)
								} else {
									throw "Missing attribute in element "
											+ this.element
								}
								var m = this.element.getAttributeNS(null, "x2");
								if (m) {
									A = parseFloat(m)
								} else {
									throw "Missing attribute in element "
											+ this.element
								}
								var v = this.element.getAttributeNS(null, "y2");
								if (v) {
									d = parseFloat(v)
								} else {
									throw "Missing attribute in element "
											+ this.element
								}
								this.oldX = Math.min(C, A);
								this.oldY = Math.min(g, d);
								this.oldWidth = Math.abs(C - A);
								this.oldHeight = Math.abs(g - d)
							} else {
								if (ORYX.Editor.checkClassType(this.element,
										SVGPolylineElement)
										|| ORYX.Editor
												.checkClassType(this.element,
														SVGPolygonElement)) {
									this.type = "Polyline";
									var n = [];
									if (this.element.points
											&& this.element.points.numberOfItems) {
										for (var z = 0, s = this.element.points.numberOfItems; z < s; z++) {
											n.push(this.element.points
													.getItem(z).x);
											n.push(this.element.points
													.getItem(z).y)
										}
									} else {
										var y = this.element.getAttributeNS(
												null, "points");
										if (y) {
											y = y.replace(/,/g, " ");
											n = y.split(" ");
											n = n.without("")
										} else {
											throw "Missing attribute in element "
													+ this.element
										}
									}
									if (n && n.length && n.length > 1) {
										var G = parseFloat(n[0]);
										var F = parseFloat(n[1]);
										var E = parseFloat(n[0]);
										var D = parseFloat(n[1]);
										for (var z = 0; z < n.length; z++) {
											G = Math.min(G, parseFloat(n[z]));
											E = Math.max(E, parseFloat(n[z]));
											z++;
											F = Math.min(F, parseFloat(n[z]));
											D = Math.max(D, parseFloat(n[z]))
										}
										this.oldX = G;
										this.oldY = F;
										this.oldWidth = E - G;
										this.oldHeight = D - F
									} else {
										throw "Missing attribute in element "
												+ this.element
									}
								} else {
									if (ORYX.Editor.checkClassType(
											this.element, SVGPathElement)) {
										this.type = "Path";
										this.editPathParser = new PathParser();
										this.editPathHandler = new ORYX.Core.SVG.EditPathHandler();
										this.editPathParser
												.setHandler(this.editPathHandler);
										var f = new PathParser();
										var c = new ORYX.Core.SVG.MinMaxPathHandler();
										f.setHandler(c);
										f.parsePath(this.element);
										this.oldX = c.minX;
										this.oldY = c.minY;
										this.oldWidth = c.maxX - c.minX;
										this.oldHeight = c.maxY - c.minY;
										delete f;
										delete c
									} else {
										throw "Element is not a shape."
									}
								}
							}
						}
					}
				}
				var t = this.element.getAttributeNS(NAMESPACE_ORYX, "resize");
				if (t) {
					t = t.toLowerCase();
					if (t.match(/horizontal/)) {
						this.isHorizontallyResizable = true
					} else {
						this.isHorizontallyResizable = false
					}
					if (t.match(/vertical/)) {
						this.isVerticallyResizable = true
					} else {
						this.isVerticallyResizable = false
					}
				} else {
					this.isHorizontallyResizable = false;
					this.isVerticallyResizable = false
				}
				var x = this.element.getAttributeNS(NAMESPACE_ORYX, "anchors");
				if (x) {
					x = x.replace("/,/g", " ");
					var o = x.split(" ").without("");
					for (var z = 0; z < o.length; z++) {
						switch (o[z].toLowerCase()) {
						case "left":
							this.anchorLeft = true;
							break;
						case "right":
							this.anchorRight = true;
							break;
						case "top":
							this.anchorTop = true;
							break;
						case "bottom":
							this.anchorBottom = true;
							break
						}
					}
				}
				if (ORYX.Editor.checkClassType(this.element, SVGPathElement)) {
					var l = this.element.getAttributeNS(NAMESPACE_ORYX,
							"allowDockers");
					if (l) {
						if (l.toLowerCase() === "no") {
							this.allowDockers = false
						} else {
							this.allowDockers = true
						}
					}
					var B = this.element.getAttributeNS(NAMESPACE_ORYX,
							"resizeMarker-mid");
					if (B) {
						if (B.toLowerCase() === "yes") {
							this.resizeMarkerMid = true
						} else {
							this.resizeMarkerMid = false
						}
					}
				}
				this.x = this.oldX;
				this.y = this.oldY;
				this.width = this.oldWidth;
				this.height = this.oldHeight
			},
			update : function() {
				if (this.x !== this.oldX || this.y !== this.oldY
						|| this.width !== this.oldWidth
						|| this.height !== this.oldHeight) {
					switch (this.type) {
					case "Rect":
						if (this.x !== this.oldX) {
							this.element.setAttributeNS(null, "x", this.x)
						}
						if (this.y !== this.oldY) {
							this.element.setAttributeNS(null, "y", this.y)
						}
						if (this.width !== this.oldWidth) {
							this.element.setAttributeNS(null, "width",
									this.width)
						}
						if (this.height !== this.oldHeight) {
							this.element.setAttributeNS(null, "height",
									this.height)
						}
						break;
					case "Circle":
						this.radiusX = ((this.width < this.height) ? this.width
								: this.height) / 2;
						this.element.setAttributeNS(null, "cx", this.x
								+ this.width / 2);
						this.element.setAttributeNS(null, "cy", this.y
								+ this.height / 2);
						this.element.setAttributeNS(null, "r", this.radiusX);
						break;
					case "Ellipse":
						this.radiusX = this.width / 2;
						this.radiusY = this.height / 2;
						this.element.setAttributeNS(null, "cx", this.x
								+ this.radiusX);
						this.element.setAttributeNS(null, "cy", this.y
								+ this.radiusY);
						this.element.setAttributeNS(null, "rx", this.radiusX);
						this.element.setAttributeNS(null, "ry", this.radiusY);
						break;
					case "Line":
						if (this.x !== this.oldX) {
							this.element.setAttributeNS(null, "x1", this.x)
						}
						if (this.y !== this.oldY) {
							this.element.setAttributeNS(null, "y1", this.y)
						}
						if (this.x !== this.oldX
								|| this.width !== this.oldWidth) {
							this.element.setAttributeNS(null, "x2", this.x
									+ this.width)
						}
						if (this.y !== this.oldY
								|| this.height !== this.oldHeight) {
							this.element.setAttributeNS(null, "y2", this.y
									+ this.height)
						}
						break;
					case "Polyline":
						var d = this.element.getAttributeNS(null, "points");
						if (d) {
							d = d.replace(/,/g, " ").split(" ").without("");
							if (d && d.length && d.length > 1) {
								var g = (this.oldWidth === 0) ? 0 : this.width
										/ this.oldWidth;
								var e = (this.oldHeight === 0) ? 0
										: this.height / this.oldHeight;
								var b = "";
								for (var c = 0; c < d.length; c++) {
									var a = (parseFloat(d[c]) - this.oldX) * g
											+ this.x;
									c++;
									var f = (parseFloat(d[c]) - this.oldY) * e
											+ this.y;
									b += a + " " + f + " "
								}
								this.element.setAttributeNS(null, "points", b)
							} else {
							}
						} else {
						}
						break;
					case "Path":
						var g = (this.oldWidth === 0) ? 0 : this.width
								/ this.oldWidth;
						var e = (this.oldHeight === 0) ? 0 : this.height
								/ this.oldHeight;
						this.editPathHandler.init(this.x, this.y, this.oldX,
								this.oldY, g, e);
						this.editPathParser.parsePath(this.element);
						this.element.setAttributeNS(null, "d",
								this.editPathHandler.d);
						break
					}
					this.oldX = this.x;
					this.oldY = this.y;
					this.oldWidth = this.width;
					this.oldHeight = this.height
				}
				delete this.visible;
				delete this.handler
			},
			isPointIncluded : function(d, b) {
				if (!d || !b || !this.isVisible()) {
					return false
				}
				switch (this.type) {
				case "Rect":
					return (d >= this.x && d <= this.x + this.width
							&& b >= this.y && b <= this.y + this.height);
					break;
				case "Circle":
					return ORYX.Core.Math.isPointInEllipse(d, b, this.x
							+ this.width / 2, this.y + this.height / 2,
							this.radiusX, this.radiusX);
					break;
				case "Ellipse":
					return ORYX.Core.Math.isPointInEllipse(d, b, this.x
							+ this.radiusX, this.y + this.radiusY,
							this.radiusX, this.radiusY);
					break;
				case "Line":
					return ORYX.Core.Math.isPointInLine(d, b, this.x, this.y,
							this.x + this.width, this.y + this.height);
					break;
				case "Polyline":
					var a = this.element.getAttributeNS(null, "points");
					if (a) {
						a = a.replace(/,/g, " ").split(" ").without("");
						a = a.collect(function(e) {
							return parseFloat(e)
						});
						return ORYX.Core.Math.isPointInPolygone(d, b, a)
					} else {
						return false
					}
					break;
				case "Path":
					if (!this.handler) {
						var c = new PathParser();
						this.handler = new ORYX.Core.SVG.PointsPathHandler();
						c.setHandler(this.handler);
						c.parsePath(this.element)
					}
					return ORYX.Core.Math.isPointInPolygone(d, b,
							this.handler.points);
					break;
				default:
					return false
				}
			},
			isVisible : function(c) {
				if (this.visible !== undefined) {
					return this.visible
				}
				if (!c) {
					c = this.element
				}
				var b = false;
				try {
					b = !!c.ownerSVGElement
				} catch (g) {
				}
				if (b) {
					if (ORYX.Editor.checkClassType(c, SVGGElement)) {
						if (c.className && c.className.baseVal == "me") {
							this.visible = true;
							return this.visible
						}
					}
					var f = c.getAttributeNS(null, "fill");
					var d = c.getAttributeNS(null, "stroke");
					if (f && f == "none" && d && d == "none") {
						this.visible = false
					} else {
						var a = c.getAttributeNS(null, "display");
						if (!a) {
							this.visible = this.isVisible(c.parentNode)
						} else {
							if (a == "none") {
								this.visible = false
							} else {
								this.visible = true
							}
						}
					}
				} else {
					this.visible = true
				}
				return this.visible
			},
			toString : function() {
				return (this.element) ? "SVGShape " + this.element.id
						: "SVGShape " + this.element
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.SVG) {
	ORYX.Core.SVG = {}
}
ORYX.Core.SVG.Label = Clazz
		.extend({
			_characterSets : [
					"%W",
					"@",
					"m",
					"wDGMOQ?????#+=<>~^",
					"ABCHKNRSUVXZ??????????&",
					"bdghnopqux???????????ETY1234567890?????_????${}*????`???????????",
					"aeksvyz?????FLP????????????????", "c-", 'rtJ"/()[]:;!|\\',
					"fjI., ", "'", "il" ],
			_characterSetValues : [ 15, 14, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3 ],
			construct : function(m) {
				arguments.callee.$.construct.apply(this, arguments);
				if (!m.textElement) {
					throw "Label: No parameter textElement."
				} else {
					if (!ORYX.Editor.checkClassType(m.textElement,
							SVGTextElement)) {
						throw "Label: Parameter textElement is not an SVGTextElement."
					}
				}
				this.invisibleRenderPoint = -5000;
				this.node = m.textElement;
				this.node.setAttributeNS(null, "stroke-width", "0pt");
				this.node.setAttributeNS(null, "letter-spacing", "-0.01px");
				this.shapeId = m.shapeId;
				this.id;
				this.fitToElemId;
				this.edgePosition;
				this.x;
				this.y;
				this.oldX;
				this.oldY;
				this.isVisible = true;
				this._text;
				this._verticalAlign;
				this._horizontalAlign;
				this._rotate;
				this._rotationPoint;
				this.anchorLeft;
				this.anchorRight;
				this.anchorTop;
				this.anchorBottom;
				this._isChanged = true;
				var k = this.node.getAttributeNS(null, "id");
				if (k) {
					this.id = k
				}
				this.fitToElemId = this.node.getAttributeNS(
						ORYX.CONFIG.NAMESPACE_ORYX, "fittoelem");
				if (this.fitToElemId) {
					this.fitToElemId = this.shapeId + this.fitToElemId
				}
				var f = this.node.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX,
						"align");
				if (f) {
					f = f.replace(/,/g, " ");
					f = f.split(" ");
					f = f.without("");
					f
							.each((function(e) {
								switch (e) {
								case "top":
								case "middle":
								case "bottom":
									if (!this._verticalAlign) {
										this._originVerticalAlign = this._verticalAlign = e
									}
									break;
								case "left":
								case "center":
								case "right":
									if (!this._horizontalAlign) {
										this._originHorizontalAlign = this._horizontalAlign = e
									}
									break
								}
							}).bind(this))
				}
				this.edgePosition = this.node.getAttributeNS(
						ORYX.CONFIG.NAMESPACE_ORYX, "edgePosition");
				if (this.edgePosition) {
					this.originEdgePosition = this.edgePosition = this.edgePosition
							.toLowerCase()
				}
				this.offsetTop = this.node.getAttributeNS(
						ORYX.CONFIG.NAMESPACE_ORYX, "offsetTop")
						|| ORYX.CONFIG.OFFSET_EDGE_LABEL_TOP;
				if (this.offsetTop) {
					this.offsetTop = parseInt(this.offsetTop)
				}
				this.offsetBottom = this.node.getAttributeNS(
						ORYX.CONFIG.NAMESPACE_ORYX, "offsetBottom")
						|| ORYX.CONFIG.OFFSET_EDGE_LABEL_BOTTOM;
				if (this.offsetBottom) {
					this.offsetBottom = parseInt(this.offsetBottom)
				}
				var l = this.node.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX,
						"rotate");
				if (l) {
					try {
						this._rotate = parseFloat(l)
					} catch (g) {
						this._rotate = 0
					}
				} else {
					this._rotate = 0
				}
				var b = this.node.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX,
						"anchors");
				if (b) {
					b = b.replace("/,/g", " ");
					var a = b.split(" ").without("");
					for (var d = 0; d < a.length; d++) {
						switch (a[d].toLowerCase()) {
						case "left":
							this.originAnchorLeft = this.anchorLeft = true;
							break;
						case "right":
							this.originAnchorRight = this.anchorRight = true;
							break;
						case "top":
							this.originAnchorTop = this.anchorTop = true;
							break;
						case "bottom":
							this.originAnchorBottom = this.anchorBottom = true;
							break
						}
					}
				}
				if (!this._verticalAlign) {
					this._verticalAlign = "bottom"
				}
				if (!this._horizontalAlign) {
					this._horizontalAlign = "left"
				}
				var c = this.node.getAttributeNS(null, "x");
				if (c) {
					this.oldX = this.x = parseFloat(c)
				} else {
				}
				var h = this.node.getAttributeNS(null, "y");
				if (h) {
					this.oldY = this.y = parseFloat(h)
				} else {
				}
				this.text(this.node.textContent)
			},
			resetAnchorPosition : function() {
				this.anchorLeft = this.originAnchorLeft || false;
				this.anchorRight = this.originAnchorRight || false;
				this.anchorTop = this.originAnchorTop || false;
				this.anchorBottom = this.originAnchorBottom || false
			},
			isOriginAnchorLeft : function() {
				return this.originAnchorLeft || false
			},
			isOriginAnchorRight : function() {
				return this.originAnchorRight || false
			},
			isOriginAnchorTop : function() {
				return this.originAnchorTop || false
			},
			isOriginAnchorBottom : function() {
				return this.originAnchorBottom || false
			},
			isAnchorLeft : function() {
				return this.anchorLeft || false
			},
			isAnchorRight : function() {
				return this.anchorRight || false
			},
			isAnchorTop : function() {
				return this.anchorTop || false
			},
			isAnchorBottom : function() {
				return this.anchorBottom || false
			},
			getX : function() {
				try {
					var a = this.node.x.baseVal.getItem(0).value;
					switch (this.horizontalAlign()) {
					case "left":
						return a;
					case "center":
						return a - (this.getWidth() / 2);
					case "right":
						return a - this.getWidth()
					}
					return this.node.getBBox().x
				} catch (b) {
					return this.x
				}
			},
			setX : function(a) {
				if (this.position) {
					this.position.x = a
				} else {
					this.setOriginX(a)
				}
			},
			getY : function() {
				try {
					return this.node.getBBox().y
				} catch (a) {
					return this.y
				}
			},
			setY : function(a) {
				if (this.position) {
					this.position.y = a
				} else {
					this.setOriginY(a)
				}
			},
			setOriginX : function(a) {
				this.x = a
			},
			setOriginY : function(a) {
				this.y = a
			},
			getWidth : function() {
				try {
					try {
						var f, h = this.node.childNodes;
						if (h.length == 0) {
							f = this.node.getBBox().width
						} else {
							for (var d = 0, c = h.length; d < c; ++d) {
								var b = h[d].getComputedTextLength();
								if ("undefined" == typeof f || f < b) {
									f = b
								}
							}
						}
						return f + (f % 2 == 0 ? 0 : 1)
					} catch (a) {
						return this.node.getBBox().width
					}
				} catch (g) {
					return 0
				}
			},
			getOriginUpperLeft : function() {
				var a = this.x, b = this.y;
				switch (this._horizontalAlign) {
				case "center":
					a -= this.getWidth() / 2;
					break;
				case "right":
					a -= this.getWidth();
					break
				}
				switch (this._verticalAlign) {
				case "middle":
					b -= this.getHeight() / 2;
					break;
				case "bottom":
					b -= this.getHeight();
					break
				}
				return {
					x : a,
					y : b
				}
			},
			getHeight : function() {
				try {
					return this.node.getBBox().height
				} catch (a) {
					return 0
				}
			},
			getCenter : function() {
				var a = {
					x : this.getX(),
					y : this.getY()
				};
				a.x += this.getWidth() / 2;
				a.y += this.getHeight() / 2;
				return a
			},
			setPosition : function(a) {
				if (!a || a.x === undefined || a.y === undefined) {
					delete this.position
				} else {
					this.position = a
				}
				if (this.position) {
					delete this._referencePoint;
					delete this.edgePosition
				}
				this._isChanged = true;
				this.update()
			},
			getPosition : function() {
				return this.position
			},
			setReferencePoint : function(a) {
				if (a) {
					this._referencePoint = a
				} else {
					delete this._referencePoint
				}
				if (this._referencePoint) {
					delete this.position
				}
			},
			getReferencePoint : function() {
				return this._referencePoint || undefined
			},
			changed : function() {
				this._isChanged = true
			},
			registerOnChange : function(a) {
				if (!this.changeCallbacks) {
					this.changeCallbacks = []
				}
				if (a instanceof Function && !this.changeCallbacks.include(a)) {
					this.changeCallbacks.push(a)
				}
			},
			unregisterOnChange : function(a) {
				if (this.changeCallbacks && a instanceof Function
						&& this.changeCallbacks.include(a)) {
					this.changeCallbacks = this.changeCallbacks.without(a)
				}
			},
			isUpdating : function() {
				return !!this._isUpdating
			},
			getOriginEdgePosition : function() {
				return this.originEdgePosition
			},
			getEdgePosition : function() {
				return this.edgePosition || null
			},
			setEdgePosition : function(a) {
				if ([ "starttop", "startmiddle", "startbottom", "midtop",
						"midbottom", "endtop", "endbottom" ].include(a)) {
					this.edgePosition = a;
					delete this.position;
					delete this._referencePoint
				} else {
					delete this.edgePosition
				}
			},
			update : function(c) {
				var a = this.x, d = this.y;
				if (this.position) {
					a = this.position.x;
					d = this.position.y
				}
				a = Math.floor(a);
				d = Math.floor(d);
				if (this._isChanged || a !== this.oldX || d !== this.oldY
						|| c === true) {
					if (this.isVisible) {
						this._isChanged = false;
						this._isUpdating = true;
						this.node.setAttributeNS(null, "x", a);
						this.node.setAttributeNS(null, "y", d);
						this.node.removeAttributeNS(null, "fill-opacity");
						this.oldX = a;
						this.oldY = d;
						if (!this.position && !this.getReferencePoint()) {
							if (this._rotate !== undefined) {
								if (this._rotationPoint) {
									this.node
											.setAttributeNS(
													null,
													"transform",
													"rotate("
															+ this._rotate
															+ " "
															+ Math
																	.floor(this._rotationPoint.x)
															+ " "
															+ Math
																	.floor(this._rotationPoint.y)
															+ ")")
								} else {
									this.node.setAttributeNS(null, "transform",
											"rotate(" + this._rotate + " "
													+ Math.floor(a) + " "
													+ Math.floor(d) + ")")
								}
							}
						} else {
							this.node.removeAttributeNS(null, "transform")
						}
						var b = this._text.split("\n");
						while (b.last() == "") {
							b.pop()
						}
						if (this.node.ownerDocument) {
							if (this.fitToElemId || this._textHasChanged) {
								this.node.textContent = "";
								b.each((function(f, e) {
									var g = this.node.ownerDocument
											.createElementNS(
													ORYX.CONFIG.NAMESPACE_SVG,
													"tspan");
									g.textContent = f.trim();
									if (this.fitToElemId) {
										g.setAttributeNS(null, "x",
												this.invisibleRenderPoint);
										g.setAttributeNS(null, "y",
												this.invisibleRenderPoint)
									}
									if (g.textContent === "") {
										g.textContent = " "
									}
									this.node.appendChild(g)
								}).bind(this));
								delete this._textHasChanged;
								delete this.indices
							}
							if (this.isVisible && this.fitToElemId) {
								this.node.setAttributeNS(null, "visibility",
										"hidden")
							}
							if (this.fitToElemId) {
								window.setTimeout(
										this._checkFittingToReferencedElem
												.bind(this), 0)
							} else {
								window.setTimeout(
										this._positionText.bind(this), 0)
							}
						}
					} else {
						this.node.textContent = ""
					}
				}
			},
			_checkFittingToReferencedElem : function() {
				try {
					var b = $A(this.node.getElementsByTagNameNS(
							ORYX.CONFIG.NAMESPACE_SVG, "tspan"));
					var d = [];
					var l = this.node.ownerDocument
							.getElementById(this.fitToElemId);
					if (l) {
						var k = l.getBBox();
						var s = this.getFontSize();
						for (var f = 0; f < b.length; f++) {
							var p = b[f];
							var t = this._getRenderedTextLength(p, undefined,
									undefined, s);
							var h = (this._rotate != 0
									&& this._rotate % 180 != 0
									&& this._rotate % 90 == 0 ? k.height
									: k.width);
							if (t > h) {
								var q = 0;
								var n = 0;
								var o = this
										.getTrimmedTextLength(p.textContent);
								for (var g = 0; g < o; g++) {
									var r = this._getRenderedTextLength(p, q, g
											- q, s);
									if (r > h - 2) {
										var c = this.node.ownerDocument
												.createElementNS(
														ORYX.CONFIG.NAMESPACE_SVG,
														"tspan");
										if (n <= q) {
											n = (g == 0) ? g : g - 1;
											c.textContent = p.textContent
													.slice(q, n).trim()
										} else {
											c.textContent = p.textContent
													.slice(q, ++n).trim()
										}
										c.setAttributeNS(null, "x",
												this.invisibleRenderPoint);
										c.setAttributeNS(null, "y",
												this.invisibleRenderPoint);
										d.push(c);
										q = n
									} else {
										var a = p.textContent.charAt(g);
										if (a == " " || a == "-" || a == "."
												|| a == "," || a == ";"
												|| a == ":") {
											n = g
										}
									}
								}
								p.textContent = p.textContent.slice(q).trim()
							}
							d.push(p)
						}
						while (this.node.hasChildNodes()) {
							this.node.removeChild(this.node.childNodes[0])
						}
						while (d.length > 0) {
							this.node.appendChild(d.shift())
						}
					}
				} catch (m) {
					ORYX.Log.fatal("Error " + m)
				}
				window.setTimeout(this._positionText.bind(this), 0)
			},
			_positionText : function() {
				try {
					var d = this.node.childNodes;
					var m = this.getFontSize(this.node);
					var b = [];
					var l = this.x, k = this.y;
					if (this.position) {
						l = this.position.x;
						k = this.position.y
					}
					l = Math.floor(l);
					k = Math.floor(k);
					var f = 0, a = [];
					var g = (this.indices || $R(0, d.length - 1).toArray());
					var c = g.length;
					g.each((function(n) {
						if ("undefined" == typeof n) {
							return

							

														

							

						}
						var o = d[f++];
						if (o.textContent.trim() === "") {
							b.push(o)
						} else {
							var e = 0;
							switch (this._verticalAlign) {
							case "bottom":
								e = -(c - n - 1) * (m);
								break;
							case "middle":
								e = -(c / 2 - n - 1) * (m);
								e -= ORYX.CONFIG.LABEL_LINE_DISTANCE / 2;
								break;
							case "top":
								e = n * (m);
								e += m;
								break
							}
							o.setAttributeNS(null, "dy", Math.floor(e));
							o.setAttributeNS(null, "x", l);
							o.setAttributeNS(null, "y", k);
							a.push(n)
						}
					}).bind(this));
					a.length = d.length;
					this.indices = this.indices || a;
					b.each(function(e) {
						this.node.removeChild(e)
					}.bind(this));
					switch (this._horizontalAlign) {
					case "left":
						this.node.setAttributeNS(null, "text-anchor", "start");
						break;
					case "center":
						this.node.setAttributeNS(null, "text-anchor", "middle");
						break;
					case "right":
						this.node.setAttributeNS(null, "text-anchor", "end");
						break
					}
				} catch (h) {
					this._isChanged = true
				}
				if (this.isVisible) {
					this.node.removeAttributeNS(null, "visibility")
				}
				delete this._isUpdating;
				(this.changeCallbacks || []).each(function(e) {
					e.apply(e)
				})
			},
			_getRenderedTextLength : function(c, d, b, a) {
				if (d === undefined) {
					return c.getComputedTextLength()
				} else {
					return c.getSubStringLength(d, b)
				}
			},
			_estimateTextWidth : function(d, c) {
				var b = 0;
				for (var a = 0; a < d.length; a++) {
					b += this._estimateCharacterWidth(d.charAt(a))
				}
				return b * (c / 14)
			},
			_estimateCharacterWidth : function(b) {
				for (var a = 0; a < this._characterSets.length; a++) {
					if (this._characterSets[a].indexOf(b) >= 0) {
						return this._characterSetValues[a]
					}
				}
				return 9
			},
			getReferencedElementWidth : function() {
				var a = this.node.ownerDocument
						.getElementById(this.fitToElemId);
				if (a) {
					var b = a.getBBox();
					if (b) {
						return (this._rotate != 0 && this._rotate % 180 != 0
								&& this._rotate % 90 == 0 ? b.height : b.width)
					}
				}
				return undefined
			},
			text : function() {
				switch (arguments.length) {
				case 0:
					return this._text;
					break;
				case 1:
					var a = this._text;
					if (arguments[0]) {
						this._text = arguments[0].toString();
						if (this._text != null && this._text != undefined) {
							this._text = this._text.replace(/ {2,}/g, " ")
						}
					} else {
						this._text = ""
					}
					if (a !== this._text) {
						this._isChanged = true;
						this._textHasChanged = true
					}
					break;
				default:
					break
				}
			},
			getOriginVerticalAlign : function() {
				return this._originVerticalAlign
			},
			verticalAlign : function() {
				switch (arguments.length) {
				case 0:
					return this._verticalAlign;
				case 1:
					if ([ "top", "middle", "bottom" ].member(arguments[0])) {
						var a = this._verticalAlign;
						this._verticalAlign = arguments[0];
						if (this._verticalAlign !== a) {
							this._isChanged = true
						}
					}
					break;
				default:
					break
				}
			},
			getOriginHorizontalAlign : function() {
				return this._originHorizontalAlign
			},
			horizontalAlign : function() {
				switch (arguments.length) {
				case 0:
					return this._horizontalAlign;
				case 1:
					if ([ "left", "center", "right" ].member(arguments[0])) {
						var a = this._horizontalAlign;
						this._horizontalAlign = arguments[0];
						if (this._horizontalAlign !== a) {
							this._isChanged = true
						}
					}
					break;
				default:
					break
				}
			},
			rotate : function() {
				switch (arguments.length) {
				case 0:
					return this._rotate;
				case 1:
					if (this._rotate != arguments[0]) {
						this._rotate = arguments[0];
						this._rotationPoint = undefined;
						this._isChanged = true
					}
				case 2:
					if (this._rotate != arguments[0] || !this._rotationPoint
							|| this._rotationPoint.x != arguments[1].x
							|| this._rotationPoint.y != arguments[1].y) {
						this._rotate = arguments[0];
						this._rotationPoint = arguments[1];
						this._isChanged = true
					}
				}
			},
			hide : function() {
				if (this.isVisible) {
					this.isVisible = false;
					this._isChanged = true
				}
			},
			show : function() {
				if (!this.isVisible) {
					this.isVisible = true;
					this._isChanged = true;
					this._textHasChanged = true
				}
			},
			getInheritedFontSize : function(b) {
				if (!b || !b.getAttributeNS) {
					return

					

										

					

				}
				var a = b.getAttributeNS(null, "font-size");
				if (a) {
					return parseFloat(a)
				} else {
					if (!ORYX.Editor.checkClassType(b, SVGSVGElement)) {
						return this.getInheritedFontSize(b.parentNode)
					}
				}
			},
			getFontSize : function(b) {
				var a = this.node.getElementsByTagNameNS(
						ORYX.CONFIG.NAMESPACE_SVG, "tspan");
				var c = this.getInheritedFontSize(this.node);
				if (!c) {
					if (a[0]
							&& /Firefox[\/\s](\d+\.\d+)/
									.test(navigator.userAgent)
							&& new Number(RegExp.$1) >= 3) {
						c = a[0].getExtentOfChar(0).height
					} else {
						c = ORYX.CONFIG.LABEL_DEFAULT_LINE_HEIGHT
					}
					if (c <= 0) {
						c = ORYX.CONFIG.LABEL_DEFAULT_LINE_HEIGHT
					}
				}
				if (c) {
					this.node.setAttribute("oryx:fontSize", c)
				}
				return c
			},
			getTrimmedTextLength : function(b) {
				b = b.strip().gsub("  ", " ");
				var a;
				do {
					a = b.length;
					b = b.gsub("  ", " ")
				} while (a > b.length);
				return b.length
			},
			getOffsetBottom : function() {
				return this.offsetBottom
			},
			getOffsetTop : function() {
				return this.offsetTop
			},
			deserialize : function(b, a) {
				if (b && "undefined" != typeof b.x && "undefined" != typeof b.y) {
					this.setPosition({
						x : b.x,
						y : b.y
					});
					if ("undefined" != typeof b.distance) {
						var d = a.dockers[b.from];
						var c = a.dockers[b.to];
						if (d && c) {
							this.setReferencePoint({
								dirty : true,
								distance : b.distance,
								intersection : {
									x : b.x,
									y : b.y
								},
								orientation : b.orientation,
								segment : {
									from : d,
									fromIndex : b.from,
									fromPosition : d.bounds.center(),
									to : c,
									toIndex : b.to,
									toPosition : c.bounds.center()
								}
							})
						}
					}
					if (b.left) {
						this.anchorLeft = true
					}
					if (b.right) {
						this.anchorRight = true
					}
					if (b.top) {
						this.anchorTop = true
					}
					if (b.bottom) {
						this.anchorBottom = true
					}
					if (b.valign) {
						this.verticalAlign(b.valign)
					}
					if (b.align) {
						this.horizontalAlign(b.align)
					}
				} else {
					if (b && "undefined" != typeof b.edge) {
						this.setEdgePosition(b.edge)
					}
				}
			},
			serialize : function() {
				if (this.getEdgePosition()) {
					if (this.getOriginEdgePosition() !== this.getEdgePosition()) {
						return {
							edge : this.getEdgePosition()
						}
					} else {
						return null
					}
				}
				if (this.position) {
					var b = {
						x : this.position.x,
						y : this.position.y
					};
					if (this.isAnchorLeft()
							&& this.isAnchorLeft() !== this
									.isOriginAnchorLeft()) {
						b.left = true
					}
					if (this.isAnchorRight()
							&& this.isAnchorRight() !== this
									.isOriginAnchorRight()) {
						b.right = true
					}
					if (this.isAnchorTop()
							&& this.isAnchorTop() !== this.isOriginAnchorTop()) {
						b.top = true
					}
					if (this.isAnchorBottom()
							&& this.isAnchorBottom() !== this
									.isOriginAnchorBottom()) {
						b.bottom = true
					}
					if (this.getOriginVerticalAlign() !== this.verticalAlign()) {
						b.valign = this.verticalAlign()
					}
					if (this.getOriginHorizontalAlign() !== this
							.horizontalAlign()) {
						b.align = this.horizontalAlign()
					}
					return b
				}
				if (this.getReferencePoint()) {
					var a = this.getReferencePoint();
					return {
						distance : a.distance,
						x : a.intersection.x,
						y : a.intersection.y,
						from : a.segment.fromIndex,
						to : a.segment.toIndex,
						orientation : a.orientation,
						valign : this.verticalAlign(),
						align : this.horizontalAlign()
					}
				}
				return null
			},
			toString : function() {
				return "Label " + this.id
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.Math) {
	ORYX.Core.Math = {}
}
ORYX.Core.Math.midPoint = function(b, a) {
	return {
		x : (b.x + a.x) / 2,
		y : (b.y + a.y) / 2
	}
};
ORYX.Core.Math.isPointInLine = function(h, f, g, e, b, a, d) {
	d = d ? Math.abs(d) : 1;
	if (Math.abs(g - b) <= d && Math.abs(h - g) <= d && f - Math.max(e, a) <= d
			&& Math.min(e, a) - f <= d) {
		return true
	}
	if (Math.abs(e - a) <= d && Math.abs(f - e) <= d && h - Math.max(g, b) <= d
			&& Math.min(g, b) - h <= d) {
		return true
	}
	if (h > Math.max(g, b) || h < Math.min(g, b)) {
		return false
	}
	if (f > Math.max(e, a) || f < Math.min(e, a)) {
		return false
	}
	var c = (e - a) / (g - b);
	return Math.abs(f - ((c * h) + e - c * g)) < d
};
ORYX.Core.Math.isPointInEllipse = function(h, f, b, g, e, d) {
	if (b === undefined || g === undefined || e === undefined
			|| d === undefined) {
		throw "ORYX.Core.Math.isPointInEllipse needs a ellipse with these properties: x, y, radiusX, radiusY"
	}
	var c = (h - b) / e;
	var a = (f - g) / d;
	return c * c + a * a < 1
};
ORYX.Core.Math.isPointInPolygone = function(a, n, e) {
	if (arguments.length < 3) {
		throw "ORYX.Core.Math.isPointInPolygone needs two arguments"
	}
	var g = e.length - 1;
	if (e[0] !== e[g - 1] || e[1] !== e[g]) {
		e.push(e[0]);
		e.push(e[1])
	}
	var h = 0;
	var c, m, b, l, k;
	for (var f = 0; f < e.length - 3;) {
		c = e[f];
		m = e[++f];
		b = e[++f];
		l = e[f + 1];
		k = (n - m) * (b - c) - (a - c) * (l - m);
		if ((m >= n) != (l >= n)) {
			h += l - m >= 0 ? k >= 0 : k <= 0
		}
		if (!k && Math.min(c, b) <= a && a <= Math.max(c, b)
				&& Math.min(m, l) <= n && n <= Math.max(m, l)) {
			return true
		}
	}
	return (h % 2) ? true : false
};
ORYX.Core.Math.distancePointLinie = function(e, d, a, b) {
	var c = ORYX.Core.Math.getPointOfIntersectionPointLine(e, d, a, b);
	if (!c) {
		return null
	}
	return ORYX.Core.Math.getDistancePointToPoint(a, c)
};
ORYX.Core.Math.getDistancePointToPoint = function(b, a) {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
};
ORYX.Core.Math.getDistanceBetweenTwoPoints = function(c, b, a) {
	return ORYX.Core.Math.getDistancePointToPoint(a, c)
			/ ORYX.Core.Math.getDistancePointToPoint(c, b)
};
ORYX.Core.Math.pointIsLeftOfLine = function(e, d, a) {
	var c = ORYX.Core.Math.getVector(e, d);
	var b = ORYX.Core.Math.getVector(e, a);
	return ((c.x * b.y) - (b.x * c.y)) > 0
};
ORYX.Core.Math.getPointBetweenTwoPoints = function(b, a, c) {
	c = Math.max(Math.min(c || 0, 1), 0);
	if (c === 0) {
		return b
	} else {
		if (c === 1) {
			return a
		}
	}
	return {
		x : b.x + ((a.x - b.x) * c),
		y : b.y + ((a.y - b.y) * c)
	}
};
ORYX.Core.Math.getVector = function(b, a) {
	return {
		x : a.x - b.x,
		y : a.y - b.y
	}
};
ORYX.Core.Math.getIdentityVector = function(a) {
	if (arguments.length == 2) {
		a = ORYX.Core.Math.getVector(arguments[0], arguments[1])
	}
	var b = Math.sqrt((a.x * a.x) + (a.y * a.y));
	return {
		x : a.x / (b || 1),
		y : a.y / (b || 1)
	}
};
ORYX.Core.Math.getOrthogonalIdentityVector = function(c, b) {
	var a = arguments.length == 1 ? c : ORYX.Core.Math.getIdentityVector(c, b);
	return {
		x : a.y,
		y : -a.x
	}
};
ORYX.Core.Math.getPointOfIntersectionPointLine = function(f, c, a, e) {
	var d = Math.pow(c.x - f.x, 2) + Math.pow(c.y - f.y, 2);
	if (d == 0) {
		return undefined
	}
	var b = ((a.x - f.x) * (c.x - f.x) + (a.y - f.y) * (c.y - f.y)) / d;
	if (e) {
		if (!(0 <= b && b <= 1)) {
			return undefined
		}
	}
	pointOfIntersection = new Object();
	pointOfIntersection.x = f.x + b * (c.x - f.x);
	pointOfIntersection.y = f.y + b * (c.y - f.y);
	return pointOfIntersection
};
ORYX.Core.Math.getTranslatedPoint = function(b, c) {
	var a = c.a * b.x + c.c * b.y + c.e * 1;
	var d = c.b * b.x + c.d * b.y + c.f * 1;
	return {
		x : a,
		y : d
	}
};
ORYX.Core.Math.getInverseMatrix = function(b) {
	var c = ORYX.Core.Math.getDeterminant(b), a = b;
	return {
		a : c * ((a.d * 1) - (a.f * 0)),
		b : c * ((a.f * 0) - (a.b * 1)),
		c : c * ((a.e * 0) - (a.c * 1)),
		d : c * ((a.a * 1) - (a.e * 0)),
		e : c * ((a.c * a.f) - (a.e * a.d)),
		f : c * ((a.e * a.b) - (a.a * a.f))
	}
};
ORYX.Core.Math.getDeterminant = function(a) {
	return (a.a * a.d * 1) + (a.c * a.f * 0) + (a.e * a.b * 0)
			- (a.e * a.d * 0) - (a.c * a.b * 1) - (a.a * a.f * 0)
};
ORYX.Core.Math.getTranslatedBoundingBox = function(a) {
	var h = a.getCTM();
	var f = a.getBBox();
	var e = ORYX.Core.Math.getTranslatedPoint({
		x : f.x,
		y : f.y
	}, h);
	var g = ORYX.Core.Math.getTranslatedPoint({
		x : f.x,
		y : f.y + f.height
	}, h);
	var b = ORYX.Core.Math.getTranslatedPoint({
		x : f.x + f.width,
		y : f.y
	}, h);
	var c = ORYX.Core.Math.getTranslatedPoint({
		x : f.x + f.width,
		y : f.y + f.height
	}, h);
	var k = {
		x : Math.min(e.x, g.x, b.x, c.x),
		y : Math.min(e.y, g.y, b.y, c.y)
	};
	var d = {
		x : Math.max(e.x, g.x, b.x, c.x),
		y : Math.max(e.y, g.y, b.y, c.y)
	};
	return {
		x : k.x,
		y : k.y,
		width : d.x - k.x,
		height : d.y - k.y
	}
};
ORYX.Core.Math.getAngle = function(c, a) {
	if (c.x == a.x && c.y == a.y) {
		return 0
	}
	var b = Math.asin(Math.sqrt(Math.pow(c.y - a.y, 2))
			/ (Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(c.y - a.y, 2))))
			* 180 / Math.PI;
	if (a.x >= c.x && a.y <= c.y) {
		return b
	} else {
		if (a.x < c.x && a.y <= c.y) {
			return 180 - b
		} else {
			if (a.x < c.x && a.y > c.y) {
				return 180 + b
			} else {
				return 360 - b
			}
		}
	}
};
new function() {
	var b = 2, c = 8, e = 4, a = 1;
	function d(g, n, m, k, h, f) {
		var l = 0;
		if (n > f) {
			l |= c
		} else {
			if (n < k) {
				l |= e
			}
		}
		if (g > h) {
			l |= b
		} else {
			if (g < m) {
				l |= a
			}
		}
		return l
	}
	ORYX.Core.Math.isRectOverLine = function(k, n, g, m, o, l, h, f) {
		return !!ORYX.Core.Math.clipLineOnRect.apply(ORYX.Core.Math, arguments)
	};
	ORYX.Core.Math.clipLineOnRect = function(h, u, g, s, f, v, q, l) {
		var m, k, p, w = 0;
		var n = false, o = false;
		m = d(h, u, f, v, q, l);
		k = d(g, s, f, v, q, l);
		do {
			if ((m | k) == 0) {
				n = true;
				o = true
			} else {
				if ((m & k) > 0) {
					o = true
				} else {
					var t = 0, r = 0;
					p = m != 0 ? m : k;
					if ((p & c) > 0) {
						t = h + (g - h) * (l - u) / (s - u);
						r = l
					} else {
						if ((p & e) > 0) {
							t = h + (g - h) * (v - u) / (s - u);
							r = v
						} else {
							if ((p & b) > 0) {
								r = u + (s - u) * (q - h) / (g - h);
								t = q
							} else {
								if ((p & a) > 0) {
									r = u + (s - u) * (f - h) / (g - h);
									t = f
								}
							}
						}
					}
					if (p == m) {
						h = t;
						u = r;
						m = d(h, u, f, v, q, l)
					} else {
						g = t;
						s = r;
						k = d(g, s, f, v, q, l)
					}
				}
			}
			w++
		} while (o != true && w < 5000);
		if (n) {
			return {
				a : {
					x : h,
					y : u
				},
				b : {
					x : g,
					y : s
				}
			}
		}
		return null
	}
}();
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.StencilSet) {
	ORYX.Core.StencilSet = {}
}
ORYX.Core.StencilSet.Stencil = {
	construct : function(d, e, a, k, h, g) {
		arguments.callee.$.construct.apply(this, arguments);
		if (!d) {
			throw "Stencilset seems corrupt."
		}
		if (!e) {
			throw "Stencil does not provide namespace."
		}
		if (!a) {
			throw "Stencil does not provide SVG source."
		}
		if (!k) {
			throw "Fatal internal error loading stencilset."
		}
		this._source = a;
		this._jsonStencil = d;
		this._stencilSet = k;
		this._namespace = e;
		this._propertyPackages = h;
		if (g && !this._jsonStencil.position) {
			this._jsonStencil.position = g
		}
		this._view;
		this._properties = new Hash();
		if (!this._jsonStencil.type
				|| !(this._jsonStencil.type === "edge" || this._jsonStencil.type === "node")) {
			throw "ORYX.Core.StencilSet.Stencil(construct): Type is not defined."
		}
		if (!this._jsonStencil.id || this._jsonStencil.id === "") {
			throw "ORYX.Core.StencilSet.Stencil(construct): Id is not defined."
		}
		if (!this._jsonStencil.title || this._jsonStencil.title === "") {
			throw "ORYX.Core.StencilSet.Stencil(construct): Title is not defined."
		}
		if (!this._jsonStencil.description) {
			this._jsonStencil.description = ""
		}
		if (!this._jsonStencil.groups) {
			this._jsonStencil.groups = []
		}
		if (!this._jsonStencil.roles) {
			this._jsonStencil.roles = []
		}
		this._jsonStencil.roles.push(this._jsonStencil.id);
		this._jsonStencil.roles.each((function(m, l) {
			this._jsonStencil.roles[l] = e + m
		}).bind(this));
		this._jsonStencil.roles = this._jsonStencil.roles.uniq();
		this._jsonStencil.id = e + this._jsonStencil.id;
		this.postProcessProperties();
		if (!this._jsonStencil.serialize) {
			this._jsonStencil.serialize = {}
		}
		if (!this._jsonStencil.deserialize) {
			this._jsonStencil.deserialize = {}
		}
		if (!this._jsonStencil.layout) {
			this._jsonStencil.layout = []
		}
		var c = a + "view/" + d.view;
		if (this._jsonStencil.view.trim().match(/</)) {
			var b = new DOMParser();
			var f = b.parseFromString(this._jsonStencil.view, "text/xml");
			if (ORYX.Editor.checkClassType(f.documentElement, SVGSVGElement)) {
				this._view = f.documentElement
			} else {
				throw "ORYX.Core.StencilSet.Stencil(_loadSVGOnSuccess): The response is not a SVG document."
			}
		} else {
			new Ajax.Request(c, {
				asynchronous : false,
				method : "get",
				onSuccess : this._loadSVGOnSuccess.bind(this),
				onFailure : this._loadSVGOnFailure.bind(this)
			})
		}
	},
	postProcessProperties : function() {
		if (this._jsonStencil.propertyPackages
				&& this._jsonStencil.propertyPackages instanceof Array) {
			this._jsonStencil.propertyPackages.each((function(b) {
				var a = this._propertyPackages[b];
				if (a) {
					a.each((function(d) {
						var c = new ORYX.Core.StencilSet.Property(d,
								this._namespace, this);
						this._properties[c.prefix() + "-" + c.id()] = c
					}).bind(this))
				}
			}).bind(this))
		}
		if (this._jsonStencil.properties
				&& this._jsonStencil.properties instanceof Array) {
			this._jsonStencil.properties.each((function(b) {
				var a = new ORYX.Core.StencilSet.Property(b, this._namespace,
						this);
				this._properties[a.prefix() + "-" + a.id()] = a
			}).bind(this))
		}
	},
	equals : function(a) {
		return (this.id() === a.id())
	},
	stencilSet : function() {
		return this._stencilSet
	},
	type : function() {
		return this._jsonStencil.type
	},
	namespace : function() {
		return this._namespace
	},
	id : function() {
		return this._jsonStencil.id
	},
	idWithoutNs : function() {
		return this.id().replace(this.namespace(), "")
	},
	title : function() {
		return ORYX.Core.StencilSet.getTranslation(this._jsonStencil, "title")
	},
	description : function() {
		return ORYX.Core.StencilSet.getTranslation(this._jsonStencil,
				"description")
	},
	groups : function() {
		return ORYX.Core.StencilSet.getTranslation(this._jsonStencil, "groups")
	},
	position : function() {
		return (isNaN(this._jsonStencil.position) ? 0
				: this._jsonStencil.position)
	},
	view : function() {
		return this._view.cloneNode(true) || this._view
	},
	icon : function() {
		return this._jsonStencil.icon
	},
	fixedAspectRatio : function() {
		return this._jsonStencil.fixedAspectRatio === true
	},
	hasMultipleRepositoryEntries : function() {
		return (this.getRepositoryEntries().length > 0)
	},
	getRepositoryEntries : function() {
		return (this._jsonStencil.repositoryEntries) ? $A(this._jsonStencil.repositoryEntries)
				: $A([])
	},
	properties : function() {
		return this._properties.values()
	},
	property : function(a) {
		return this._properties[a]
	},
	roles : function() {
		return this._jsonStencil.roles
	},
	defaultAlign : function() {
		if (!this._jsonStencil.defaultAlign) {
			return "east"
		}
		return this._jsonStencil.defaultAlign
	},
	serialize : function(a, b) {
		return this._jsonStencil.serialize
	},
	deserialize : function(a, b) {
		return this._jsonStencil.deserialize
	},
	layout : function(a) {
		return this._jsonStencil.layout
	},
	addProperty : function(c, b) {
		if (c && b) {
			var a = new ORYX.Core.StencilSet.Property(c, b, this);
			this._properties[a.prefix() + "-" + a.id()] = a
		}
	},
	removeProperty : function(b) {
		if (b) {
			var a = this._properties.values().find(function(c) {
				return (b == c.id())
			});
			if (a) {
				delete this._properties[a.prefix() + "-" + a.id()]
			}
		}
	},
	_loadSVGOnSuccess : function(a) {
		var b = null;
		b = a.responseXML;
		if (ORYX.Editor.checkClassType(b.documentElement, SVGSVGElement)) {
			this._view = b.documentElement
		} else {
			throw "ORYX.Core.StencilSet.Stencil(_loadSVGOnSuccess): The response is not a SVG document."
		}
	},
	_loadSVGOnFailure : function(a) {
		throw "ORYX.Core.StencilSet.Stencil(_loadSVGOnFailure): Loading SVG document failed."
	},
	toString : function() {
		return "Stencil " + this.title() + " (" + this.id() + ")"
	}
};
ORYX.Core.StencilSet.Stencil = Clazz.extend(ORYX.Core.StencilSet.Stencil);
function _evenMoreEvilHack(c, e) {
	if (window.ActiveXObject) {
		var b = new ActiveXObject("MSXML.DomDocument");
		b.loadXML(c);
		return b
	} else {
		if (window.XMLHttpRequest) {
			var a = new XMLHttpRequest;
			a.open("GET", "data:" + (e || "application/xml")
					+ ";charset=utf-8," + encodeURIComponent(c), false);
			if (a.overrideMimeType) {
				a.overrideMimeType(e)
			}
			a.send(null);
			return a.responseXML
		}
	}
}
function _evilSafariHack(d) {
	var b = d;
	var a = "data:text/xml;charset=utf-8," + encodeURIComponent(b);
	var e = null;
	var c = new XMLHttpRequest();
	c.open("GET", a);
	c.onload = function() {
		e = c.responseXML
	};
	c.send(null);
	return e
}
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.StencilSet) {
	ORYX.Core.StencilSet = {}
}
ORYX.Core.StencilSet.Property = Clazz
		.extend({
			construct : function(d, b, c) {
				arguments.callee.$.construct.apply(this, arguments);
				this._jsonProp = d
						|| ORYX.Log.error("Parameter jsonProp is not defined.");
				this._namespace = b
						|| ORYX.Log
								.error("Parameter namespace is not defined.");
				this._stencil = c
						|| ORYX.Log.error("Parameter stencil is not defined.");
				this._items = {};
				this._complexItems = {};
				this._hidden = false;
				d.id = d.id
						|| ORYX.Log
								.error("ORYX.Core.StencilSet.Property(construct): Id is not defined.");
				d.id = d.id.toLowerCase();
				if (!d.type) {
					ORYX.Log
							.info(
									"Type is not defined for stencil '%0', id '%1'. Falling back to 'String'.",
									c, d.id);
					d.type = "string"
				} else {
					d.type = d.type.toLowerCase()
				}
				d.prefix = d.prefix || "oryx";
				d.title = d.title || "";
				d.value = d.value || "";
				d.description = d.description || "";
				d.readonly = d.readonly || false;
				d.optional = d.optional !== false;
				if (this._jsonProp.refToView) {
					if (!(this._jsonProp.refToView instanceof Array)) {
						this._jsonProp.refToView = [ this._jsonProp.refToView ]
					}
				} else {
					this._jsonProp.refToView = []
				}
				var a = this.getMinForType(d.type);
				if (d.min === undefined || d.min === null) {
					d.min = a
				} else {
					if (d.min < a) {
						d.min = a
					}
				}
				var e = this.getMaxForType(d.type);
				if (d.max === undefined || d.max === null) {
					d.max = e
				} else {
					if (d.max > e) {
						d.min = e
					}
				}
				if (!d.fillOpacity) {
					d.fillOpacity = false
				}
				if ("number" != typeof d.lightness) {
					d.lightness = 1
				} else {
					d.lightness = Math.max(0, Math.min(1, d.lightness))
				}
				if (!d.strokeOpacity) {
					d.strokeOpacity = false
				}
				if (d.length === undefined || d.length === null) {
					d.length = Number.MAX_VALUE
				}
				if (!d.wrapLines) {
					d.wrapLines = false
				}
				if (!d.dateFormat) {
					d.dateFormat = ORYX.I18N.PropertyWindow.dateFormat
							|| "m/d/y"
				}
				if (!d.fill) {
					d.fill = false
				}
				if (!d.stroke) {
					d.stroke = false
				}
				if (!d.inverseBoolean) {
					d.inverseBoolean = false
				}
				if (!d.directlyEditable && d.directlyEditable != false) {
					d.directlyEditable = true
				}
				if (d.visible !== false) {
					d.visible = true
				}
				if (d.isList !== true) {
					d.isList = false;
					if (!d.list || !(d.list instanceof Array)) {
						d.list = []
					}
				}
				if (!d.category) {
					if (d.popular) {
						d.category = "popular"
					} else {
						d.category = "others"
					}
				}
				if (!d.alwaysAppearInMultiselect) {
					d.alwaysAppearInMultiselect = false
				}
				if (d.type === ORYX.CONFIG.TYPE_CHOICE) {
					if (d.items && d.items instanceof Array) {
						d.items
								.each((function(f) {
									this._items[f.value.toLowerCase()] = new ORYX.Core.StencilSet.PropertyItem(
											f, b, this)
								}).bind(this))
					} else {
						throw "ORYX.Core.StencilSet.Property(construct): No property items defined."
					}
				} else {
					if (d.type === ORYX.CONFIG.TYPE_COMPLEX
							|| d.type == ORYX.CONFIG.TYPE_MULTIPLECOMPLEX) {
						if (d.complexItems && d.complexItems instanceof Array) {
							d.complexItems
									.each((function(f) {
										this._complexItems[f.id.toLowerCase()] = new ORYX.Core.StencilSet.ComplexPropertyItem(
												f, b, this)
									}).bind(this))
						}
					}
				}
			},
			getMinForType : function(a) {
				if (a.toLowerCase() == ORYX.CONFIG.TYPE_INTEGER) {
					return -Math.pow(2, 31)
				} else {
					return -Number.MAX_VALUE + 1
				}
			},
			getMaxForType : function(a) {
				if (a.toLowerCase() == ORYX.CONFIG.TYPE_INTEGER) {
					return Math.pow(2, 31) - 1
				} else {
					return Number.MAX_VALUE
				}
			},
			equals : function(a) {
				return (this._namespace === a.namespace() && this.id() === a
						.id()) ? true : false
			},
			namespace : function() {
				return this._namespace
			},
			stencil : function() {
				return this._stencil
			},
			id : function() {
				return this._jsonProp.id
			},
			prefix : function() {
				return this._jsonProp.prefix
			},
			type : function() {
				return this._jsonProp.type
			},
			inverseBoolean : function() {
				return this._jsonProp.inverseBoolean
			},
			category : function() {
				return this._jsonProp.category
			},
			setCategory : function(a) {
				this._jsonProp.category = a
			},
			directlyEditable : function() {
				return this._jsonProp.directlyEditable
			},
			visible : function() {
				return this._jsonProp.visible
			},
			title : function() {
				return ORYX.Core.StencilSet.getTranslation(this._jsonProp,
						"title")
			},
			value : function() {
				return this._jsonProp.value
			},
			readonly : function() {
				return this._jsonProp.readonly
			},
			optional : function() {
				return this._jsonProp.optional
			},
			description : function() {
				return ORYX.Core.StencilSet.getTranslation(this._jsonProp,
						"description")
			},
			refToView : function() {
				return this._jsonProp.refToView
			},
			min : function() {
				return this._jsonProp.min
			},
			max : function() {
				return this._jsonProp.max
			},
			fillOpacity : function() {
				return this._jsonProp.fillOpacity
			},
			strokeOpacity : function() {
				return this._jsonProp.strokeOpacity
			},
			length : function() {
				return this._jsonProp.length ? this._jsonProp.length
						: Number.MAX_VALUE
			},
			wrapLines : function() {
				return this._jsonProp.wrapLines
			},
			dateFormat : function() {
				return this._jsonProp.dateFormat
			},
			fill : function() {
				return this._jsonProp.fill
			},
			lightness : function() {
				return this._jsonProp.lightness
			},
			stroke : function() {
				return this._jsonProp.stroke
			},
			items : function() {
				return $H(this._items).values()
			},
			item : function(a) {
				if (a) {
					return this._items[a.toLowerCase()]
				} else {
					return null
				}
			},
			toString : function() {
				return "Property " + this.title() + " (" + this.id() + ")"
			},
			complexItems : function() {
				return $H(this._complexItems).values()
			},
			complexItem : function(a) {
				if (a) {
					return this._complexItems[a.toLowerCase()]
				} else {
					return null
				}
			},
			complexAttributeToView : function() {
				return this._jsonProp.complexAttributeToView || ""
			},
			isList : function() {
				return !!this._jsonProp.isList
			},
			getListItems : function() {
				return this._jsonProp.list
			},
			linkableType : function() {
				return this._jsonProp.linkableType || ""
			},
			alwaysAppearInMultiselect : function() {
				return this._jsonProp.alwaysAppearInMultiselect
			},
			popular : function() {
				return this._jsonProp.popular || false
			},
			setPopular : function() {
				this._jsonProp.popular = true
			},
			hide : function() {
				this._hidden = true
			},
			isHidden : function() {
				return this._hidden
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.StencilSet) {
	ORYX.Core.StencilSet = {}
}
ORYX.Core.StencilSet.PropertyItem = Clazz
		.extend({
			construct : function(a, b, c) {
				arguments.callee.$.construct.apply(this, arguments);
				if (!a) {
					throw "ORYX.Core.StencilSet.PropertyItem(construct): Parameter jsonItem is not defined."
				}
				if (!b) {
					throw "ORYX.Core.StencilSet.PropertyItem(construct): Parameter namespace is not defined."
				}
				if (!c) {
					throw "ORYX.Core.StencilSet.PropertyItem(construct): Parameter property is not defined."
				}
				this._jsonItem = a;
				this._namespace = b;
				this._property = c;
				if (!a.value) {
					throw "ORYX.Core.StencilSet.PropertyItem(construct): Value is not defined."
				}
				if (this._jsonItem.refToView) {
					if (!(this._jsonItem.refToView instanceof Array)) {
						this._jsonItem.refToView = [ this._jsonItem.refToView ]
					}
				} else {
					this._jsonItem.refToView = []
				}
			},
			equals : function(a) {
				return (this.property().equals(a.property()) && this.value() === a
						.value())
			},
			namespace : function() {
				return this._namespace
			},
			property : function() {
				return this._property
			},
			value : function() {
				return this._jsonItem.value
			},
			title : function() {
				return ORYX.Core.StencilSet.getTranslation(this._jsonItem,
						"title")
			},
			refToView : function() {
				return this._jsonItem.refToView
			},
			icon : function() {
				return (this._jsonItem.icon) ? this.property().stencil()._source
						+ "icons/" + this._jsonItem.icon
						: ""
			},
			toString : function() {
				return "PropertyItem " + this.property() + " (" + this.value()
						+ ")"
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.StencilSet) {
	ORYX.Core.StencilSet = {}
}
ORYX.Core.StencilSet.ComplexPropertyItem = Clazz
		.extend({
			construct : function(a, b, c) {
				arguments.callee.$.construct.apply(this, arguments);
				if (!a) {
					throw "ORYX.Core.StencilSet.ComplexPropertyItem(construct): Parameter jsonItem is not defined."
				}
				if (!b) {
					throw "ORYX.Core.StencilSet.ComplexPropertyItem(construct): Parameter namespace is not defined."
				}
				if (!c) {
					throw "ORYX.Core.StencilSet.ComplexPropertyItem(construct): Parameter property is not defined."
				}
				this._jsonItem = a;
				this._namespace = b;
				this._property = c;
				this._items = new Hash();
				this._complexItems = new Hash();
				if (!a.name) {
					throw "ORYX.Core.StencilSet.ComplexPropertyItem(construct): Name is not defined."
				}
				if (!a.type) {
					throw "ORYX.Core.StencilSet.ComplexPropertyItem(construct): Type is not defined."
				} else {
					a.type = a.type.toLowerCase()
				}
				if (a.type === ORYX.CONFIG.TYPE_CHOICE) {
					if (a.items && a.items instanceof Array) {
						a.items
								.each((function(d) {
									this._items[d.value] = new ORYX.Core.StencilSet.PropertyItem(
											d, b, this)
								}).bind(this))
					} else {
						throw "ORYX.Core.StencilSet.Property(construct): No property items defined."
					}
				} else {
					if (a.type === ORYX.CONFIG.TYPE_COMPLEX) {
						if (a.complexItems && a.complexItems instanceof Array) {
							a.complexItems
									.each((function(d) {
										this._complexItems[d.id] = new ORYX.Core.StencilSet.ComplexPropertyItem(
												d, b, this)
									}).bind(this))
						} else {
							throw "ORYX.Core.StencilSet.Property(construct): No property items defined."
						}
					}
				}
			},
			equals : function(a) {
				return (this.property().equals(a.property()) && this.name() === a
						.name())
			},
			namespace : function() {
				return this._namespace
			},
			property : function() {
				return this._property
			},
			name : function() {
				return ORYX.Core.StencilSet.getTranslation(this._jsonItem,
						"name")
			},
			id : function() {
				return this._jsonItem.id
			},
			type : function() {
				return this._jsonItem.type
			},
			optional : function() {
				return this._jsonItem.optional
			},
			width : function() {
				return this._jsonItem.width
			},
			value : function() {
				return this._jsonItem.value
			},
			items : function() {
				return this._items.values()
			},
			complexItems : function() {
				return this._complexItems.values()
			},
			disable : function() {
				return this._jsonItem.disable
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.StencilSet) {
	ORYX.Core.StencilSet = {}
}
ORYX.Core.StencilSet.Rules = {
	construct : function() {
		arguments.callee.$.construct.apply(this, arguments);
		this._stencilSets = [];
		this._stencils = [];
		this._containerStencils = [];
		this._cachedConnectSET = new Hash();
		this._cachedConnectSE = new Hash();
		this._cachedConnectTE = new Hash();
		this._cachedCardSE = new Hash();
		this._cachedCardTE = new Hash();
		this._cachedContainPC = new Hash();
		this._cachedMorphRS = new Hash();
		this._connectionRules = new Hash();
		this._cardinalityRules = new Hash();
		this._containmentRules = new Hash();
		this._morphingRules = new Hash();
		this._layoutRules = new Hash()
	},
	initializeRules : function(l) {
		var k = this._stencilSets.find(function(o) {
			return (o.namespace() == l.namespace())
		});
		if (k) {
			var f = this._stencilSets.clone();
			f = f.without(k);
			f.push(l);
			this._stencilSets = [];
			this._stencils = [];
			this._containerStencils = [];
			this._cachedConnectSET = new Hash();
			this._cachedConnectSE = new Hash();
			this._cachedConnectTE = new Hash();
			this._cachedCardSE = new Hash();
			this._cachedCardTE = new Hash();
			this._cachedContainPC = new Hash();
			this._cachedMorphRS = new Hash();
			this._connectionRules = new Hash();
			this._cardinalityRules = new Hash();
			this._containmentRules = new Hash();
			this._morphingRules = new Hash();
			this._layoutRules = new Hash();
			f.each(function(o) {
				this.initializeRules(o)
			}.bind(this));
			return

			

						

			

		} else {
			this._stencilSets.push(l);
			var m = new Hash(l.jsonRules());
			var e = l.namespace();
			var b = l.stencils();
			l.extensions().values().each(
					function(o) {
						if (o.rules) {
							if (o.rules.connectionRules) {
								m.connectionRules = m.connectionRules
										.concat(o.rules.connectionRules)
							}
							if (o.rules.cardinalityRules) {
								m.cardinalityRules = m.cardinalityRules
										.concat(o.rules.cardinalityRules)
							}
							if (o.rules.containmentRules) {
								m.containmentRules = m.containmentRules
										.concat(o.rules.containmentRules)
							}
							if (o.rules.morphingRules) {
								m.morphingRules = m.morphingRules
										.concat(o.rules.morphingRules)
							}
						}
						if (o.stencils) {
							b = b.concat(o.stencils)
						}
					});
			this._stencils = this._stencils.concat(l.stencils());
			var g = this._connectionRules;
			if (m.connectionRules) {
				m.connectionRules.each((function(o) {
					if (this._isRoleOfOtherNamespace(o.role)) {
						if (!g[o.role]) {
							g[o.role] = new Hash()
						}
					} else {
						if (!g[e + o.role]) {
							g[e + o.role] = new Hash()
						}
					}
					o.connects.each((function(p) {
						var s = [];
						if (p.to) {
							if (!(p.to instanceof Array)) {
								p.to = [ p.to ]
							}
							p.to.each((function(t) {
								if (this._isRoleOfOtherNamespace(t)) {
									s.push(t)
								} else {
									s.push(e + t)
								}
							}).bind(this))
						}
						var r, q;
						if (this._isRoleOfOtherNamespace(o.role)) {
							r = o.role
						} else {
							r = e + o.role
						}
						if (this._isRoleOfOtherNamespace(p.from)) {
							q = p.from
						} else {
							q = e + p.from
						}
						if (!g[r][q]) {
							g[r][q] = s
						} else {
							g[r][q] = g[r][q].concat(s)
						}
					}).bind(this))
				}).bind(this))
			}
			var c = this._cardinalityRules;
			if (m.cardinalityRules) {
				m.cardinalityRules.each((function(q) {
					var o;
					if (this._isRoleOfOtherNamespace(q.role)) {
						o = q.role
					} else {
						o = e + q.role
					}
					if (!c[o]) {
						c[o] = {};
						for (i in q) {
							c[o][i] = q[i]
						}
					}
					var r = new Hash();
					if (q.outgoingEdges) {
						q.outgoingEdges.each((function(s) {
							if (this._isRoleOfOtherNamespace(s.role)) {
								r[s.role] = s
							} else {
								r[e + s.role] = s
							}
						}).bind(this))
					}
					c[o].outgoingEdges = r;
					var p = new Hash();
					if (q.incomingEdges) {
						q.incomingEdges.each((function(s) {
							if (this._isRoleOfOtherNamespace(s.role)) {
								p[s.role] = s
							} else {
								p[e + s.role] = s
							}
						}).bind(this))
					}
					c[o].incomingEdges = p
				}).bind(this))
			}
			var a = this._containmentRules;
			if (m.containmentRules) {
				m.containmentRules.each((function(p) {
					var o;
					if (this._isRoleOfOtherNamespace(p.role)) {
						o = p.role
					} else {
						this._containerStencils.push(e + p.role);
						o = e + p.role
					}
					if (!a[o]) {
						a[o] = []
					}
					(p.contains || []).each((function(q) {
						if (this._isRoleOfOtherNamespace(q)) {
							a[o].push(q)
						} else {
							a[o].push(e + q)
						}
					}).bind(this))
				}).bind(this))
			}
			var d = this._morphingRules;
			if (m.morphingRules) {
				m.morphingRules.each((function(p) {
					var o;
					if (this._isRoleOfOtherNamespace(p.role)) {
						o = p.role
					} else {
						o = e + p.role
					}
					if (!d[o]) {
						d[o] = []
					}
					if (!p.preserveBounds) {
						p.preserveBounds = false
					}
					p.baseMorphs.each((function(r) {
						var q = this._getStencilById(e + r);
						if (q) {
							d[o].push(q)
						}
					}).bind(this))
				}).bind(this))
			}
			var h = this._layoutRules;
			if (m.layoutRules) {
				var n = function(p) {
					return {
						edgeRole : p.edgeRole || undefined,
						t : p.t || 1,
						r : p.r || 1,
						b : p.b || 1,
						l : p.l || 1
					}
				};
				m.layoutRules.each(function(p) {
					var o;
					if (this._isRoleOfOtherNamespace(p.role)) {
						o = p.role
					} else {
						o = e + p.role
					}
					if (!h[o]) {
						h[o] = {}
					}
					if (p["in"]) {
						h[o]["in"] = n(p["in"])
					}
					if (p.ins) {
						h[o]["ins"] = (p.ins || []).map(function(q) {
							return n(q)
						})
					}
					if (p.out) {
						h[o]["out"] = n(p.out)
					}
					if (p.outs) {
						h[o]["outs"] = (p.outs || []).map(function(q) {
							return n(q)
						})
					}
				}.bind(this))
			}
		}
	},
	_getStencilById : function(a) {
		return this._stencils.find(function(b) {
			return b.id() == a
		})
	},
	_cacheConnect : function(a) {
		result = this._canConnect(a);
		if (a.sourceStencil && a.targetStencil) {
			var c = this._cachedConnectSET[a.sourceStencil.id()];
			if (!c) {
				c = new Hash();
				this._cachedConnectSET[a.sourceStencil.id()] = c
			}
			var b = c[a.edgeStencil.id()];
			if (!b) {
				b = new Hash();
				c[a.edgeStencil.id()] = b
			}
			b[a.targetStencil.id()] = result
		} else {
			if (a.sourceStencil) {
				var c = this._cachedConnectSE[a.sourceStencil.id()];
				if (!c) {
					c = new Hash();
					this._cachedConnectSE[a.sourceStencil.id()] = c
				}
				c[a.edgeStencil.id()] = result
			} else {
				var d = this._cachedConnectTE[a.targetStencil.id()];
				if (!d) {
					d = new Hash();
					this._cachedConnectTE[a.targetStencil.id()] = d
				}
				d[a.edgeStencil.id()] = result
			}
		}
		return result
	},
	_cacheCard : function(b) {
		if (b.sourceStencil) {
			var c = this._cachedCardSE[b.sourceStencil.id()];
			if (!c) {
				c = new Hash();
				this._cachedCardSE[b.sourceStencil.id()] = c
			}
			var a = this._getMaximumNumberOfOutgoingEdge(b);
			if (a == undefined) {
				a = -1
			}
			c[b.edgeStencil.id()] = a
		}
		if (b.targetStencil) {
			var d = this._cachedCardTE[b.targetStencil.id()];
			if (!d) {
				d = new Hash();
				this._cachedCardTE[b.targetStencil.id()] = d
			}
			var a = this._getMaximumNumberOfIncomingEdge(b);
			if (a == undefined) {
				a = -1
			}
			d[b.edgeStencil.id()] = a
		}
	},
	_cacheContain : function(b) {
		var a = [
				this._canContain(b),
				this._getMaximumOccurrence(b.containingStencil,
						b.containedStencil) ];
		if (a[1] == undefined) {
			a[1] = -1
		}
		var c = this._cachedContainPC[b.containingStencil.id()];
		if (!c) {
			c = new Hash();
			this._cachedContainPC[b.containingStencil.id()] = c
		}
		c[b.containedStencil.id()] = a;
		return a
	},
	_cacheMorph : function(b) {
		var a = this._cachedMorphRS[b];
		if (!a) {
			a = [];
			if (this._morphingRules.keys().include(b)) {
				a = this._stencils.select(function(c) {
					return c.roles().include(b)
				})
			}
			this._cachedMorphRS[b] = a
		}
		return a
	},
	outgoingEdgeStencils : function(a) {
		if (!a.sourceShape && !a.sourceStencil) {
			return []
		}
		if (a.sourceShape) {
			a.sourceStencil = a.sourceShape.getStencil()
		}
		var b = [];
		this._stencils.each((function(d) {
			if (d.type() === "edge") {
				var c = Object.clone(a);
				c.edgeStencil = d;
				if (this.canConnect(c)) {
					b.push(d)
				}
			}
		}).bind(this));
		return b
	},
	incomingEdgeStencils : function(a) {
		if (!a.targetShape && !a.targetStencil) {
			return []
		}
		if (a.targetShape) {
			a.targetStencil = a.targetShape.getStencil()
		}
		var b = [];
		this._stencils.each((function(d) {
			if (d.type() === "edge") {
				var c = Object.clone(a);
				c.edgeStencil = d;
				if (this.canConnect(c)) {
					b.push(d)
				}
			}
		}).bind(this));
		return b
	},
	sourceStencils : function(b) {
		if (!b || !b.edgeShape && !b.edgeStencil) {
			return []
		}
		if (b.targetShape) {
			b.targetStencil = b.targetShape.getStencil()
		}
		if (b.edgeShape) {
			b.edgeStencil = b.edgeShape.getStencil()
		}
		var a = [];
		this._stencils.each((function(d) {
			var c = Object.clone(b);
			c.sourceStencil = d;
			if (this.canConnect(c)) {
				a.push(d)
			}
		}).bind(this));
		return a
	},
	targetStencils : function(a) {
		if (!a || !a.edgeShape && !a.edgeStencil) {
			return []
		}
		if (a.sourceShape) {
			a.sourceStencil = a.sourceShape.getStencil()
		}
		if (a.edgeShape) {
			a.edgeStencil = a.edgeShape.getStencil()
		}
		var b = [];
		this._stencils.each((function(d) {
			var c = Object.clone(a);
			c.targetStencil = d;
			if (this.canConnect(c)) {
				b.push(d)
			}
		}).bind(this));
		return b
	},
	canConnect : function(c) {
		if (!c
				|| (!c.sourceShape && !c.sourceStencil && !c.targetShape && !c.targetStencil)
				|| !c.edgeShape && !c.edgeStencil) {
			return false
		}
		if (c.sourceShape) {
			c.sourceStencil = c.sourceShape.getStencil()
		}
		if (c.targetShape) {
			c.targetStencil = c.targetShape.getStencil()
		}
		if (c.edgeShape) {
			c.edgeStencil = c.edgeShape.getStencil()
		}
		var b;
		if (c.sourceStencil && c.targetStencil) {
			var e = this._cachedConnectSET[c.sourceStencil.id()];
			if (!e) {
				b = this._cacheConnect(c)
			} else {
				var d = e[c.edgeStencil.id()];
				if (!d) {
					b = this._cacheConnect(c)
				} else {
					var f = d[c.targetStencil.id()];
					if (f == undefined) {
						b = this._cacheConnect(c)
					} else {
						b = f
					}
				}
			}
		} else {
			if (c.sourceStencil) {
				var e = this._cachedConnectSE[c.sourceStencil.id()];
				if (!e) {
					b = this._cacheConnect(c)
				} else {
					var d = e[c.edgeStencil.id()];
					if (d == undefined) {
						b = this._cacheConnect(c)
					} else {
						b = d
					}
				}
			} else {
				var f = this._cachedConnectTE[c.targetStencil.id()];
				if (!f) {
					b = this._cacheConnect(c)
				} else {
					var d = f[c.edgeStencil.id()];
					if (d == undefined) {
						b = this._cacheConnect(c)
					} else {
						b = d
					}
				}
			}
		}
		if (b) {
			if (c.sourceShape) {
				var e = this._cachedCardSE[c.sourceStencil.id()];
				if (!e) {
					this._cacheCard(c);
					e = this._cachedCardSE[c.sourceStencil.id()]
				}
				var a = e[c.edgeStencil.id()];
				if (a == undefined) {
					this._cacheCard(c)
				}
				a = e[c.edgeStencil.id()];
				if (a != -1) {
					b = c.sourceShape
							.getOutgoingShapes()
							.all(
									function(g) {
										if ((g.getStencil().id() === c.edgeStencil
												.id())
												&& ((c.edgeShape) ? g !== c.edgeShape
														: true)) {
											a--;
											return (a > 0) ? true : false
										} else {
											return true
										}
									})
				}
			}
			if (c.targetShape) {
				var f = this._cachedCardTE[c.targetStencil.id()];
				if (!f) {
					this._cacheCard(c);
					f = this._cachedCardTE[c.targetStencil.id()]
				}
				var a = f[c.edgeStencil.id()];
				if (a == undefined) {
					this._cacheCard(c)
				}
				a = f[c.edgeStencil.id()];
				if (a != -1) {
					b = c.targetShape
							.getIncomingShapes()
							.all(
									function(g) {
										if ((g.getStencil().id() === c.edgeStencil
												.id())
												&& ((c.edgeShape) ? g !== c.edgeShape
														: true)) {
											a--;
											return (a > 0) ? true : false
										} else {
											return true
										}
									})
				}
			}
		}
		return b
	},
	_canConnect : function(b) {
		if (!b
				|| (!b.sourceShape && !b.sourceStencil && !b.targetShape && !b.targetStencil)
				|| !b.edgeShape && !b.edgeStencil) {
			return false
		}
		if (b.sourceShape) {
			b.sourceStencil = b.sourceShape.getStencil()
		}
		if (b.targetShape) {
			b.targetStencil = b.targetShape.getStencil()
		}
		if (b.edgeShape) {
			b.edgeStencil = b.edgeShape.getStencil()
		}
		var c;
		var a = this._getConnectionRulesOfEdgeStencil(b.edgeStencil);
		if (a.keys().length === 0) {
			c = false
		} else {
			if (b.sourceStencil) {
				c = b.sourceStencil.roles().any(function(e) {
					var d = a[e];
					if (!d) {
						return false
					}
					if (b.targetStencil) {
						return (d.any(function(f) {
							return b.targetStencil.roles().member(f)
						}))
					} else {
						return true
					}
				})
			} else {
				c = a.values().any(function(d) {
					return b.targetStencil.roles().any(function(e) {
						return d.member(e)
					})
				})
			}
		}
		return c
	},
	isContainer : function(a) {
		return this._containerStencils.member(a.getStencil().id())
	},
	canContain : function(c) {
		if (!c || !c.containingStencil && !c.containingShape
				|| !c.containedStencil && !c.containedShape) {
			return false
		}
		if (c.containedShape) {
			c.containedStencil = c.containedShape.getStencil()
		}
		if (c.containingShape) {
			c.containingStencil = c.containingShape.getStencil()
		}
		if (c.containedStencil.type() == "edge") {
			return false
		}
		var b;
		var d = this._cachedContainPC[c.containingStencil.id()];
		if (!d) {
			b = this._cacheContain(c)
		} else {
			b = d[c.containedStencil.id()];
			if (!b) {
				b = this._cacheContain(c)
			}
		}
		if (!b[0]) {
			return false
		} else {
			if (b[1] == -1) {
				return true
			} else {
				if (c.containingShape) {
					var a = b[1];
					return c.containingShape.getChildShapes(false).all(
							function(e) {
								if (e.getStencil().id() === c.containedStencil
										.id()) {
									a--;
									return (a > 0) ? true : false
								} else {
									return true
								}
							})
				} else {
					return true
				}
			}
		}
	},
	_canContain : function(b) {
		if (!b || !b.containingStencil && !b.containingShape
				|| !b.containedStencil && !b.containedShape) {
			return false
		}
		if (b.containedShape) {
			b.containedStencil = b.containedShape.getStencil()
		}
		if (b.containingShape) {
			b.containingStencil = b.containingShape.getStencil()
		}
		var a;
		a = b.containingStencil.roles().any((function(d) {
			var c = this._containmentRules[d];
			if (c) {
				return c.any(function(e) {
					return b.containedStencil.roles().member(e)
				})
			} else {
				return false
			}
		}).bind(this));
		return a
	},
	morphStencils : function(b) {
		if (!b.stencil && !b.shape) {
			return []
		}
		if (b.shape) {
			b.stencil = b.shape.getStencil()
		}
		var a = [];
		b.stencil.roles().each(function(d) {
			this._cacheMorph(d).each(function(e) {
				a.push(e)
			})
		}.bind(this));
		var c = this.baseMorphs();
		a = a.uniq().sort(
				function(e, d) {
					return c.include(e) && !c.include(d) ? -1 : (c.include(d)
							&& !c.include(e) ? 1 : 0)
				});
		return a
	},
	baseMorphs : function() {
		var a = [];
		this._morphingRules.each(function(b) {
			b.value.each(function(c) {
				a.push(c)
			})
		});
		return a
	},
	containsMorphingRules : function() {
		return this._stencilSets.any(function(a) {
			return !!a.jsonRules().morphingRules
		})
	},
	connectMorph : function(e) {
		if (!e
				|| (!e.sourceShape && !e.sourceStencil && !e.targetShape && !e.targetStencil)) {
			return false
		}
		if (e.sourceShape) {
			e.sourceStencil = e.sourceShape.getStencil()
		}
		if (e.targetShape) {
			e.targetStencil = e.targetShape.getStencil()
		}
		var a = this.incomingEdgeStencils(e);
		var d = this.outgoingEdgeStencils(e);
		var c = a.select(function(f) {
			return d.member(f)
		});
		var b = this.baseMorphs().select(function(f) {
			return c.member(f)
		});
		if (b.size() > 0) {
			return b[0]
		} else {
			if (c.size() > 0) {
				return c[0]
			}
		}
		return null
	},
	showInShapeMenu : function(a) {
		return this._stencilSets.any(function(b) {
			return b.jsonRules().morphingRules.any(function(c) {
				return a.roles().include(b.namespace() + c.role)
						&& c.showInShapeMenu !== false
			})
		})
	},
	preserveBounds : function(a) {
		return this._stencilSets.any(function(b) {
			return b.jsonRules().morphingRules.any(function(c) {
				return a.roles().include(b.namespace() + c.role)
						&& c.preserveBounds
			})
		})
	},
	getLayoutingRules : function(b, d) {
		if (!b || !(b instanceof ORYX.Core.Shape)) {
			return

			

						

			

		}
		var c = {
			"in" : {},
			out : {}
		};
		var a = function(f, e) {
			if (f && f[e]) {
				[ "t", "r", "b", "l" ].each(function(g) {
					c[e][g] = Math.max(f[e][g], c[e][g] || 0)
				})
			}
			if (f && f[e + "s"] instanceof Array) {
				[ "t", "r", "b", "l" ].each(function(k) {
					var g = f[e + "s"].find(function(l) {
						return !l.edgeRole
					});
					var h;
					if (d instanceof ORYX.Core.Edge) {
						h = f[e + "s"].find(function(l) {
							return this._hasRole(d, l.edgeRole)
						}.bind(this))
					}
					c[e][k] = Math.max(h ? h[k] : g[k], c[e][k] || 0)
				}.bind(this))
			}
		}.bind(this);
		b.getStencil().roles().each(function(e) {
			if (this._layoutRules[e]) {
				a(this._layoutRules[e], "in");
				a(this._layoutRules[e], "out")
			}
		}.bind(this));
		[ "in", "out" ].each(function(e) {
			[ "t", "r", "b", "l" ].each(function(f) {
				c[e][f] = c[e][f] !== undefined ? c[e][f] : 1
			})
		});
		return c
	},
	_hasRole : function(b, c) {
		if (!(b instanceof ORYX.Core.Shape) || !c) {
			return

			

						

			

		}
		var a = b.getStencil().roles().any(function(d) {
			return d == c
		});
		return a || b.getStencil().id() == (b.getStencil().namespace() + c)
	},
	_stencilsWithRole : function(a) {
		return this._stencils.findAll(function(b) {
			return (b.roles().member(a)) ? true : false
		})
	},
	_edgesWithRole : function(a) {
		return this._stencils.findAll(function(b) {
			return (b.roles().member(a) && b.type() === "edge") ? true : false
		})
	},
	_nodesWithRole : function(a) {
		return this._stencils.findAll(function(b) {
			return (b.roles().member(a) && b.type() === "node") ? true : false
		})
	},
	_getMaximumOccurrence : function(b, c) {
		var a;
		c.roles().each((function(e) {
			var d = this._cardinalityRules[e];
			if (d && d.maximumOccurrence) {
				if (a) {
					a = Math.min(a, d.maximumOccurrence)
				} else {
					a = d.maximumOccurrence
				}
			}
		}).bind(this));
		return a
	},
	_getMaximumNumberOfOutgoingEdge : function(b) {
		if (!b || !b.sourceStencil || !b.edgeStencil) {
			return false
		}
		var a;
		b.sourceStencil.roles().each((function(d) {
			var c = this._cardinalityRules[d];
			if (c && c.outgoingEdges) {
				b.edgeStencil.roles().each(function(e) {
					var f = c.outgoingEdges[e];
					if (f && f.maximum) {
						if (a) {
							a = Math.min(a, f.maximum)
						} else {
							a = f.maximum
						}
					}
				})
			}
		}).bind(this));
		return a
	},
	_getMaximumNumberOfIncomingEdge : function(b) {
		if (!b || !b.targetStencil || !b.edgeStencil) {
			return false
		}
		var a;
		b.targetStencil.roles().each((function(d) {
			var c = this._cardinalityRules[d];
			if (c && c.incomingEdges) {
				b.edgeStencil.roles().each(function(e) {
					var f = c.incomingEdges[e];
					if (f && f.maximum) {
						if (a) {
							a = Math.min(a, f.maximum)
						} else {
							a = f.maximum
						}
					}
				})
			}
		}).bind(this));
		return a
	},
	_getConnectionRulesOfEdgeStencil : function(b) {
		var a = new Hash();
		b.roles().each((function(c) {
			if (this._connectionRules[c]) {
				this._connectionRules[c].each(function(d) {
					if (a[d.key]) {
						a[d.key] = a[d.key].concat(d.value)
					} else {
						a[d.key] = d.value
					}
				})
			}
		}).bind(this));
		return a
	},
	_isRoleOfOtherNamespace : function(a) {
		return (a.indexOf("#") > 0)
	},
	toString : function() {
		return "Rules"
	}
};
ORYX.Core.StencilSet.Rules = Clazz.extend(ORYX.Core.StencilSet.Rules);
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.StencilSet) {
	ORYX.Core.StencilSet = {}
}
ORYX.Core.StencilSet.StencilSet = Clazz
		.extend({
			construct : function(c, b, a) {
				arguments.callee.$.construct.apply(this, arguments);
				if (!c) {
					throw "ORYX.Core.StencilSet.StencilSet(construct): Parameter 'source' is not defined."
				}
				if (c.endsWith("/")) {
					c = c.substr(0, c.length - 1)
				}
				this._extensions = new Hash();
				this._source = c;
				this._baseUrl = c.substring(0, c.lastIndexOf("/") + 1);
				this._jsonObject = {};
				this._stencils = new Hash();
				this._availableStencils = new Hash();
				if (ORYX.CONFIG.BACKEND_SWITCH) {
					this._baseUrl = "editor/stencilsets/bpmn2.0/";
					this._source = "stencilsets/bpmn2.0/bpmn2.0.json";
					new Ajax.Request(ACTIVITI.CONFIG.contextRoot
							+ "/editor/stencilset?version=" + Date.now(), {
						asynchronous : false,
						method : "get",
						onSuccess : this._init.bind(this),
						onFailure : this._cancelInit.bind(this)
					})
				} else {
					new Ajax.Request(c, {
						asynchronous : false,
						method : "get",
						onSuccess : this._init.bind(this),
						onFailure : this._cancelInit.bind(this)
					})
				}
				if (this.errornous) {
					throw "Loading stencil set " + c + " failed."
				}
			},
			findRootStencilName : function() {
				var a = this._stencils.values().find(function(b) {
					return b._jsonStencil.mayBeRoot
				});
				if (!a) {
					ORYX.Log
							.warn("Did not find any stencil that may be root. Taking a guess.");
					a = this._stencils.values()[0]
				}
				return a.id()
			},
			equals : function(a) {
				return (this.namespace() === a.namespace())
			},
			stencils : function(k, l, h) {
				if (k && l) {
					var a = this._availableStencils.values();
					var e = [ k ];
					var d = [];
					var m = [];
					while (e.size() > 0) {
						var b = e.pop();
						d.push(b);
						var c = a.findAll(function(o) {
							var n = {
								containingStencil : b,
								containedStencil : o
							};
							return l.canContain(n)
						});
						for (var g = 0; g < c.size(); g++) {
							if (!d.member(c[g])) {
								e.push(c[g])
							}
						}
						m = m.concat(c).uniq()
					}
					m = m.sortBy(function(n) {
						return a.indexOf(n)
					});
					if (h) {
						m = m.sortBy(function(n) {
							return n.groups().first()
						})
					}
					var f = a.findAll(function(n) {
						return n.type() == "edge"
					});
					m = m.concat(f);
					return m
				} else {
					if (h) {
						return this._availableStencils.values().sortBy(
								function(n) {
									return n.groups().first()
								})
					} else {
						return this._availableStencils.values()
					}
				}
			},
			nodes : function() {
				return this._availableStencils.values().findAll(function(a) {
					return (a.type() === "node")
				})
			},
			edges : function() {
				return this._availableStencils.values().findAll(function(a) {
					return (a.type() === "edge")
				})
			},
			stencil : function(a) {
				return this._stencils[a]
			},
			title : function() {
				return ORYX.Core.StencilSet.getTranslation(this._jsonObject,
						"title")
			},
			description : function() {
				return ORYX.Core.StencilSet.getTranslation(this._jsonObject,
						"description")
			},
			namespace : function() {
				return this._jsonObject ? this._jsonObject.namespace : null
			},
			jsonRules : function() {
				return this._jsonObject ? this._jsonObject.rules : null
			},
			source : function() {
				return this._source
			},
			extensions : function() {
				return this._extensions
			},
			addExtension : function(a) {
				new Ajax.Request(
						a,
						{
							method : "GET",
							asynchronous : false,
							onSuccess : (function(b) {
								this.addExtensionDirectly(b.responseText)
							}).bind(this),
							onFailure : (function(b) {
								ORYX.Log
										.debug("Loading stencil set extension file failed. The request returned an error."
												+ b)
							}).bind(this),
							onException : (function(b) {
								ORYX.Log
										.debug("Loading stencil set extension file failed. The request returned an error."
												+ b)
							}).bind(this)
						})
			},
			addExtensionDirectly : function(str) {
				try {
					eval("var jsonExtension = " + str);
					if (!(jsonExtension["extends"].endsWith("#"))) {
						jsonExtension["extends"] += "#"
					}
					if (jsonExtension["extends"] == this.namespace()) {
						this._extensions[jsonExtension.namespace] = jsonExtension;
						var defaultPosition = this._stencils.keys().size();
						if (jsonExtension.stencils) {
							$A(jsonExtension.stencils)
									.each(
											function(stencil) {
												defaultPosition++;
												var oStencil = new ORYX.Core.StencilSet.Stencil(
														stencil, this
																.namespace(),
														this._baseUrl, this,
														undefined,
														defaultPosition);
												this._stencils[oStencil.id()] = oStencil;
												this._availableStencils[oStencil
														.id()] = oStencil
											}.bind(this))
						}
						if (jsonExtension.properties) {
							var stencils = this._stencils.values();
							stencils
									.each(function(stencil) {
										var roles = stencil.roles();
										jsonExtension.properties
												.each(function(prop) {
													prop.roles
															.any(function(role) {
																role = jsonExtension["extends"]
																		+ role;
																if (roles
																		.member(role)) {
																	prop.properties
																			.each(function(
																					property) {
																				stencil
																						.addProperty(
																								property,
																								jsonExtension.namespace)
																			});
																	return true
																} else {
																	return false
																}
															})
												})
									}.bind(this))
						}
						if (jsonExtension.removeproperties) {
							jsonExtension.removeproperties.each(function(
									remprop) {
								var stencil = this
										.stencil(jsonExtension["extends"]
												+ remprop.stencil);
								if (stencil) {
									remprop.properties.each(function(propId) {
										stencil.removeProperty(propId)
									})
								}
							}.bind(this))
						}
						if (jsonExtension.removestencils) {
							$A(jsonExtension.removestencils)
									.each(
											function(remstencil) {
												delete this._availableStencils[jsonExtension["extends"]
														+ remstencil]
											}.bind(this))
						}
					}
				} catch (e) {
					ORYX.Log
							.debug("StencilSet.addExtension: Something went wrong when initialising the stencil set extension. "
									+ e)
				}
			},
			removeExtension : function(a) {
				var b = this._extensions[a];
				if (b) {
					if (b.stencils) {
						$A(b.stencils).each(
								function(e) {
									var d = new ORYX.Core.StencilSet.Stencil(e,
											this.namespace(), this._baseUrl,
											this);
									delete this._stencils[d.id()];
									delete this._availableStencils[d.id()]
								}.bind(this))
					}
					if (b.properties) {
						var c = this._stencils.values();
						c.each(function(e) {
							var d = e.roles();
							b.properties.each(function(f) {
								f.roles.any(function(g) {
									g = b["extends"] + g;
									if (d.member(g)) {
										f.properties.each(function(h) {
											e.removeProperty(h.id)
										});
										return true
									} else {
										return false
									}
								})
							})
						}.bind(this))
					}
					if (b.removeproperties) {
						b.removeproperties.each(function(f) {
							var e = this.stencil(b["extends"] + f.stencil);
							if (e) {
								var d = $A(this._jsonObject.stencils).find(
										function(g) {
											return g.id == e.id()
										});
								f.properties.each(function(h) {
									var g = $A(d.properties).find(function(k) {
										return k.id == h
									});
									e.addProperty(g, this.namespace())
								}.bind(this))
							}
						}.bind(this))
					}
					if (b.removestencils) {
						$A(b.removestencils).each(function(d) {
							var e = b["extends"] + d;
							this._availableStencils[e] = this._stencils[e]
						}.bind(this))
					}
				}
				delete this._extensions[a]
			},
			__handleStencilset : function(response) {
				try {
					eval("this._jsonObject =" + response.responseText)
				} catch (e) {
					throw "Stenciset corrupt: " + e
				}
				if (!this._jsonObject) {
					throw "Error evaluating stencilset. It may be corrupt."
				}
				with (this._jsonObject) {
					if (!namespace || namespace === "") {
						throw "Namespace definition missing in stencilset."
					}
					if (!(stencils instanceof Array)) {
						throw "Stencilset corrupt."
					}
					if (!namespace.endsWith("#")) {
						namespace = namespace + "#"
					}
					if (!title) {
						title = ""
					}
					if (!description) {
						description = ""
					}
				}
			},
			_init : function(c) {
				this.__handleStencilset(c);
				var b = new Hash();
				if (this._jsonObject.propertyPackages) {
					$A(this._jsonObject.propertyPackages).each((function(d) {
						b[d.name] = d.properties
					}).bind(this))
				}
				var a = 0;
				$A(this._jsonObject.stencils).each(
						(function(e) {
							a++;
							var d = new ORYX.Core.StencilSet.Stencil(e, this
									.namespace(), this._baseUrl, this, b, a);
							this._stencils[d.id()] = d;
							this._availableStencils[d.id()] = d
						}).bind(this))
			},
			_cancelInit : function(a) {
				this.errornous = true
			},
			toString : function() {
				return "StencilSet " + this.title() + " (" + this.namespace()
						+ ")"
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.StencilSet) {
	ORYX.Core.StencilSet = {}
}
ORYX.Core.StencilSet._stencilSetsByNamespace = new Hash();
ORYX.Core.StencilSet._stencilSetsByUrl = new Hash();
ORYX.Core.StencilSet._StencilSetNSByEditorInstance = new Hash();
ORYX.Core.StencilSet._rulesByEditorInstance = new Hash();
ORYX.Core.StencilSet.stencilSets = function(b) {
	var c = ORYX.Core.StencilSet._StencilSetNSByEditorInstance[b];
	var a = new Hash();
	if (c) {
		c.each(function(e) {
			var d = ORYX.Core.StencilSet.stencilSet(e);
			a[d.namespace()] = d
		})
	}
	return a
};
ORYX.Core.StencilSet.stencilSet = function(a) {
	ORYX.Log.trace("Getting stencil set %0", a);
	var b = a.split("#", 1);
	if (b.length === 1) {
		ORYX.Log.trace("Getting stencil set %0", b[0]);
		return ORYX.Core.StencilSet._stencilSetsByNamespace[b[0] + "#"]
	} else {
		return undefined
	}
};
ORYX.Core.StencilSet.stencil = function(b) {
	ORYX.Log.trace("Getting stencil for %0", b);
	var a = ORYX.Core.StencilSet.stencilSet(b);
	if (a) {
		return a.stencil(b)
	} else {
		ORYX.Log.trace("Cannot fild stencil for %0", b);
		return undefined
	}
};
ORYX.Core.StencilSet.rules = function(a) {
	if (!ORYX.Core.StencilSet._rulesByEditorInstance[a]) {
		ORYX.Core.StencilSet._rulesByEditorInstance[a] = new ORYX.Core.StencilSet.Rules()
	}
	return ORYX.Core.StencilSet._rulesByEditorInstance[a]
};
ORYX.Core.StencilSet.loadStencilSet = function(a, d, c) {
	stencilSet = new ORYX.Core.StencilSet.StencilSet(a, d, c);
	ORYX.Core.StencilSet._stencilSetsByNamespace[stencilSet.namespace()] = stencilSet;
	ORYX.Core.StencilSet._stencilSetsByUrl[a] = stencilSet;
	var b = stencilSet.namespace();
	if (ORYX.Core.StencilSet._StencilSetNSByEditorInstance[c]) {
		ORYX.Core.StencilSet._StencilSetNSByEditorInstance[c].push(b)
	} else {
		ORYX.Core.StencilSet._StencilSetNSByEditorInstance[c] = [ b ]
	}
	if (ORYX.Core.StencilSet._rulesByEditorInstance[c]) {
		ORYX.Core.StencilSet._rulesByEditorInstance[c]
				.initializeRules(stencilSet)
	} else {
		var e = new ORYX.Core.StencilSet.Rules();
		e.initializeRules(stencilSet);
		ORYX.Core.StencilSet._rulesByEditorInstance[c] = e
	}
};
ORYX.Core.StencilSet.getTranslation = function(c, b) {
	var d = ORYX.I18N.Language.toLowerCase();
	var a = c[b + "_" + d];
	if (a) {
		return a
	}
	a = c[b + "_" + d.substr(0, 2)];
	if (a) {
		return a
	}
	return c[b]
};
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.Command = Clazz.extend({
	construct : function() {
	},
	execute : function() {
		throw "Command.execute() has to be implemented!"
	},
	rollback : function() {
		throw "Command.rollback() has to be implemented!"
	}
});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.Bounds = {
	construct : function() {
		this._changedCallbacks = [];
		this.a = {};
		this.b = {};
		this.set.apply(this, arguments);
		this.suspendChange = false;
		this.changedWhileSuspend = false
	},
	_changed : function(a) {
		if (!this.suspendChange) {
			this._changedCallbacks.each(function(b) {
				b(this, a)
			}.bind(this));
			this.changedWhileSuspend = false
		} else {
			this.changedWhileSuspend = true
		}
	},
	registerCallback : function(a) {
		if (!this._changedCallbacks.member(a)) {
			this._changedCallbacks.push(a)
		}
	},
	unregisterCallback : function(a) {
		this._changedCallbacks = this._changedCallbacks.without(a)
	},
	set : function() {
		var e = false;
		switch (arguments.length) {
		case 1:
			if (this.a.x !== arguments[0].a.x) {
				e = true;
				this.a.x = arguments[0].a.x
			}
			if (this.a.y !== arguments[0].a.y) {
				e = true;
				this.a.y = arguments[0].a.y
			}
			if (this.b.x !== arguments[0].b.x) {
				e = true;
				this.b.x = arguments[0].b.x
			}
			if (this.b.y !== arguments[0].b.y) {
				e = true;
				this.b.y = arguments[0].b.y
			}
			break;
		case 2:
			var b = Math.min(arguments[0].x, arguments[1].x);
			var a = Math.min(arguments[0].y, arguments[1].y);
			var d = Math.max(arguments[0].x, arguments[1].x);
			var c = Math.max(arguments[0].y, arguments[1].y);
			if (this.a.x !== b) {
				e = true;
				this.a.x = b
			}
			if (this.a.y !== a) {
				e = true;
				this.a.y = a
			}
			if (this.b.x !== d) {
				e = true;
				this.b.x = d
			}
			if (this.b.y !== c) {
				e = true;
				this.b.y = c
			}
			break;
		case 4:
			var b = Math.min(arguments[0], arguments[2]);
			var a = Math.min(arguments[1], arguments[3]);
			var d = Math.max(arguments[0], arguments[2]);
			var c = Math.max(arguments[1], arguments[3]);
			if (this.a.x !== b) {
				e = true;
				this.a.x = b
			}
			if (this.a.y !== a) {
				e = true;
				this.a.y = a
			}
			if (this.b.x !== d) {
				e = true;
				this.b.x = d
			}
			if (this.b.y !== c) {
				e = true;
				this.b.y = c
			}
			break
		}
		if (e) {
			this._changed(true)
		}
	},
	moveTo : function() {
		var a = this.upperLeft();
		switch (arguments.length) {
		case 1:
			this.moveBy({
				x : arguments[0].x - a.x,
				y : arguments[0].y - a.y
			});
			break;
		case 2:
			this.moveBy({
				x : arguments[0] - a.x,
				y : arguments[1] - a.y
			});
			break;
		default:
		}
	},
	moveBy : function() {
		var c = false;
		switch (arguments.length) {
		case 1:
			var b = arguments[0];
			if (b.x !== 0 || b.y !== 0) {
				c = true;
				this.a.x += b.x;
				this.b.x += b.x;
				this.a.y += b.y;
				this.b.y += b.y
			}
			break;
		case 2:
			var a = arguments[0];
			var d = arguments[1];
			if (a !== 0 || d !== 0) {
				c = true;
				this.a.x += a;
				this.b.x += a;
				this.a.y += d;
				this.b.y += d
			}
			break;
		default:
		}
		if (c) {
			this._changed()
		}
	},
	include : function(c) {
		if ((this.a.x === undefined) && (this.a.y === undefined)
				&& (this.b.x === undefined) && (this.b.y === undefined)) {
			return c
		}
		var a = Math.min(this.a.x, c.a.x);
		var f = Math.min(this.a.y, c.a.y);
		var e = Math.max(this.b.x, c.b.x);
		var d = Math.max(this.b.y, c.b.y);
		this.set(a, f, e, d)
	},
	extend : function(a) {
		if (a.x !== 0 || a.y !== 0) {
			this.b.x += a.x;
			this.b.y += a.y;
			this._changed(true)
		}
	},
	widen : function(a) {
		if (a !== 0) {
			this.suspendChange = true;
			this.moveBy({
				x : -a,
				y : -a
			});
			this.extend({
				x : 2 * a,
				y : 2 * a
			});
			this.suspendChange = false;
			if (this.changedWhileSuspend) {
				this._changed(true)
			}
		}
	},
	upperLeft : function() {
		var a = {};
		a.x = this.a.x;
		a.y = this.a.y;
		return a
	},
	lowerRight : function() {
		var a = {};
		a.x = this.b.x;
		a.y = this.b.y;
		return a
	},
	width : function() {
		return this.b.x - this.a.x
	},
	height : function() {
		return this.b.y - this.a.y
	},
	center : function() {
		var a = {};
		a.x = (this.a.x + this.b.x) / 2;
		a.y = (this.a.y + this.b.y) / 2;
		return a
	},
	midPoint : function() {
		var a = {};
		a.x = (this.b.x - this.a.x) / 2;
		a.y = (this.b.y - this.a.y) / 2;
		return a
	},
	centerMoveTo : function() {
		var a = this.center();
		switch (arguments.length) {
		case 1:
			this.moveBy(arguments[0].x - a.x, arguments[0].y - a.y);
			break;
		case 2:
			this.moveBy(arguments[0] - a.x, arguments[1] - a.y);
			break
		}
	},
	isIncluded : function(a, e) {
		var f, d, e;
		switch (arguments.length) {
		case 1:
			f = arguments[0].x;
			d = arguments[0].y;
			e = 0;
			break;
		case 2:
			if (arguments[0].x && arguments[0].y) {
				f = arguments[0].x;
				d = arguments[0].y;
				e = Math.abs(arguments[1])
			} else {
				f = arguments[0];
				d = arguments[1];
				e = 0
			}
			break;
		case 3:
			f = arguments[0];
			d = arguments[1];
			e = Math.abs(arguments[2]);
			break;
		default:
			throw "isIncluded needs one, two or three arguments"
		}
		var c = this.upperLeft();
		var b = this.lowerRight();
		if (f >= c.x - e && f <= b.x + e && d >= c.y - e && d <= b.y + e) {
			return true
		} else {
			return false
		}
	},
	clone : function() {
		return new ORYX.Core.Bounds(this)
	},
	toString : function() {
		return "( " + this.a.x + " | " + this.a.y + " )/( " + this.b.x + " | "
				+ this.b.y + " )"
	},
	serializeForERDF : function() {
		return this.a.x + "," + this.a.y + "," + this.b.x + "," + this.b.y
	}
};
ORYX.Core.Bounds = Clazz.extend(ORYX.Core.Bounds);
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.UIObject = {
	construct : function(a) {
		this.isChanged = true;
		this.isResized = true;
		this.isVisible = true;
		this.isSelectable = false;
		this.isResizable = false;
		this.isMovable = false;
		this.id = ORYX.Editor.provideId();
		this.parent = undefined;
		this.node = undefined;
		this.children = [];
		this.bounds = new ORYX.Core.Bounds();
		this._changedCallback = this._changed.bind(this);
		this.bounds.registerCallback(this._changedCallback);
		if (a && a.eventHandlerCallback) {
			this.eventHandlerCallback = a.eventHandlerCallback
		}
	},
	_changed : function(b, a) {
		this.isChanged = true;
		if (this.bounds == b) {
			this.isResized = a || this.isResized
		}
	},
	update : function() {
		if (this.isChanged) {
			this.refresh();
			this.isChanged = false;
			this.children.each(function(a) {
				a.update()
			})
		}
	},
	refresh : function() {
	},
	getChildren : function() {
		return this.children.clone()
	},
	getParents : function() {
		var a = [];
		var b = this.parent;
		while (b) {
			a.push(b);
			b = b.parent
		}
		return a
	},
	isParent : function(a) {
		var b = this;
		while (b) {
			if (b === a) {
				return true
			}
			b = b.parent
		}
		return false
	},
	getId : function() {
		return this.id
	},
	getChildById : function(b, a) {
		return this.children.find(function(c) {
			if (c.getId() === b) {
				return c
			} else {
				if (a) {
					var d = c.getChildById(b, a);
					if (d) {
						return d
					}
				}
			}
		})
	},
	add : function(a) {
		if (!(this.children.member(a))) {
			if (a.parent) {
				a.remove(a)
			}
			this.children.push(a);
			a.parent = this;
			a.node = this.node.appendChild(a.node);
			a.bounds.registerCallback(this._changedCallback)
		} else {
			ORYX.Log
					.info("add: ORYX.Core.UIObject is already a child of this object.")
		}
	},
	remove : function(a) {
		if (this.children.member(a)) {
			this.children = this._uiObjects.without(a);
			a.parent = undefined;
			a.node = this.node.removeChild(a.node);
			a.bounds.unregisterCallback(this._changedCallback)
		} else {
			ORYX.Log
					.info("remove: ORYX.Core.UIObject is not a child of this object.")
		}
	},
	absoluteBounds : function() {
		if (this.parent) {
			var a = this.absoluteXY();
			return new ORYX.Core.Bounds(a.x, a.y, a.x + this.bounds.width(),
					a.y + this.bounds.height())
		} else {
			return this.bounds.clone()
		}
	},
	absoluteXY : function() {
		if (this.parent) {
			var b = this.parent.absoluteXY();
			var a = {};
			a.x = b.x + this.bounds.upperLeft().x;
			a.y = b.y + this.bounds.upperLeft().y;
			return a
		} else {
			var a = {};
			a.x = this.bounds.upperLeft().x;
			a.y = this.bounds.upperLeft().y;
			return a
		}
	},
	absoluteCenterXY : function() {
		if (this.parent) {
			var b = this.parent.absoluteXY();
			var a = {};
			a.x = b.x + this.bounds.center().x;
			a.y = b.y + this.bounds.center().y;
			return a
		} else {
			var a = {};
			a.x = this.bounds.center().x;
			a.y = this.bounds.center().y;
			return a
		}
	},
	hide : function() {
		this.node.setAttributeNS(null, "display", "none");
		this.isVisible = false;
		this.children.each(function(a) {
			a.hide()
		})
	},
	show : function() {
		this.node.setAttributeNS(null, "display", "inherit");
		this.isVisible = true;
		this.children.each(function(a) {
			a.show()
		})
	},
	addEventHandlers : function(a) {
		a.addEventListener(ORYX.CONFIG.EVENT_MOUSEDOWN, this._delegateEvent
				.bind(this), false);
		a.addEventListener(ORYX.CONFIG.EVENT_MOUSEMOVE, this._delegateEvent
				.bind(this), false);
		a.addEventListener(ORYX.CONFIG.EVENT_MOUSEUP, this._delegateEvent
				.bind(this), false);
		a.addEventListener(ORYX.CONFIG.EVENT_MOUSEOVER, this._delegateEvent
				.bind(this), false);
		a.addEventListener(ORYX.CONFIG.EVENT_MOUSEOUT, this._delegateEvent
				.bind(this), false);
		a.addEventListener("click", this._delegateEvent.bind(this), false);
		a.addEventListener(ORYX.CONFIG.EVENT_DBLCLICK, this._delegateEvent
				.bind(this), false)
	},
	_delegateEvent : function(a) {
		if (this.eventHandlerCallback) {
			this.eventHandlerCallback(a, this)
		}
	},
	toString : function() {
		return "UIObject " + this.id
	}
};
ORYX.Core.UIObject = Clazz.extend(ORYX.Core.UIObject);
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.AbstractShape = ORYX.Core.UIObject
		.extend({
			construct : function(a, c, b) {
				arguments.callee.$.construct.apply(this, arguments);
				this.resourceId = ORYX.Editor.provideId();
				this._stencil = c;
				if (this._stencil._jsonStencil.superId) {
					stencilId = this._stencil.id();
					superStencilId = stencilId.substring(0, stencilId
							.indexOf("#") + 1)
							+ c._jsonStencil.superId;
					stencilSet = this._stencil.stencilSet();
					this._stencil = stencilSet.stencil(superStencilId)
				}
				this.properties = new Hash();
				this.propertiesChanged = new Hash();
				this.hiddenProperties = new Hash();
				this._stencil.properties().each((function(e) {
					var d = e.prefix() + "-" + e.id();
					this.properties[d] = e.value();
					this.propertiesChanged[d] = true
				}).bind(this));
				if (c._jsonStencil.superId) {
					c.properties().each((function(g) {
						var e = g.prefix() + "-" + g.id();
						var f = g.value();
						var d = this.properties[e];
						this.properties[e] = f;
						this.propertiesChanged[e] = true;
						this._delegateEvent({
							type : ORYX.CONFIG.EVENT_PROPERTY_CHANGED,
							name : e,
							value : f,
							oldValue : d
						})
					}).bind(this))
				}
			},
			layout : function() {
			},
			getStencil : function() {
				return this._stencil
			},
			getChildShapeByResourceId : function(a) {
				a = ERDF.__stripHashes(a);
				return this.getChildShapes(true).find(function(b) {
					return b.resourceId == a
				})
			},
			getChildShapes : function(b, c) {
				var a = [];
				this.children.each(function(d) {
					if (d instanceof ORYX.Core.Shape && d.isVisible) {
						if (c) {
							c(d)
						}
						a.push(d);
						if (b) {
							a = a.concat(d.getChildShapes(b, c))
						}
					}
				});
				return a
			},
			hasChildShape : function(a) {
				return this.getChildShapes().any(function(b) {
					return (b === a) || b.hasChildShape(a)
				})
			},
			getChildNodes : function(b, c) {
				var a = [];
				this.children.each(function(d) {
					if (d instanceof ORYX.Core.Node && d.isVisible) {
						if (c) {
							c(d)
						}
						a.push(d)
					}
					if (d instanceof ORYX.Core.Shape) {
						if (b) {
							a = a.concat(d.getChildNodes(b, c))
						}
					}
				});
				return a
			},
			getChildEdges : function(b, c) {
				var a = [];
				this.children.each(function(d) {
					if (d instanceof ORYX.Core.Edge && d.isVisible) {
						if (c) {
							c(d)
						}
						a.push(d)
					}
					if (d instanceof ORYX.Core.Shape) {
						if (b) {
							a = a.concat(d.getChildEdges(b, c))
						}
					}
				});
				return a
			},
			getAbstractShapesAtPosition : function() {
				var b, e;
				switch (arguments.length) {
				case 1:
					b = arguments[0].x;
					e = arguments[0].y;
					break;
				case 2:
					b = arguments[0];
					e = arguments[1];
					break;
				default:
					throw "getAbstractShapesAtPosition needs 1 or 2 arguments!"
				}
				if (this.isPointIncluded(b, e)) {
					var a = [];
					a.push(this);
					var d = this.getChildNodes();
					var c = this.getChildEdges();
					[ d, c ].each(function(f) {
						var g = new Hash();
						f.each(function(h) {
							if (!h.isVisible) {
								return

								

																

								

							}
							var l = h.getAbstractShapesAtPosition(b, e);
							if (l.length > 0) {
								var k = $A(h.node.parentNode.childNodes);
								var m = k.indexOf(h.node);
								g[m] = l
							}
						});
						g.keys().sort().each(function(h) {
							a = a.concat(g[h])
						})
					});
					return a
				} else {
					return []
				}
			},
			setProperty : function(b, d, c) {
				var a = this.properties[b];
				if (a !== d || c === true) {
					this.properties[b] = d;
					this.propertiesChanged[b] = true;
					this._changed();
					if (!this._isInSetProperty) {
						this._isInSetProperty = true;
						this._delegateEvent({
							type : ORYX.CONFIG.EVENT_PROPERTY_CHANGED,
							elements : [ this ],
							name : b,
							value : d,
							oldValue : a
						});
						delete this._isInSetProperty
					}
				}
			},
			isPropertyChanged : function() {
				return this.propertiesChanged.any(function(a) {
					return a.value
				})
			},
			setHiddenProperty : function(b, c) {
				if (c === undefined) {
					delete this.hiddenProperties[b];
					return

					

										

					

				}
				var a = this.hiddenProperties[b];
				if (a !== c) {
					this.hiddenProperties[b] = c
				}
			},
			isPointIncluded : function(d, c, b) {
				var a = b ? b : this.absoluteBounds();
				return a.isIncluded(d, c)
			},
			serialize : function() {
				var a = [];
				a.push({
					name : "type",
					prefix : "oryx",
					value : this.getStencil().id(),
					type : "literal"
				});
				this.hiddenProperties.each(function(b) {
					a.push({
						name : b.key.replace("oryx-", ""),
						prefix : "oryx",
						value : b.value,
						type : "literal"
					})
				}.bind(this));
				this.getStencil().properties().each((function(d) {
					var c = d.prefix();
					var b = d.id();
					a.push({
						name : b,
						prefix : c,
						value : this.properties[c + "-" + b],
						type : "literal"
					})
				}).bind(this));
				return a
			},
			deserialize : function(b) {
				var a = 0;
				b = b.sort(function(d, c) {
					d = Number(this.properties.keys().member(
							d.prefix + "-" + d.name));
					c = Number(this.properties.keys().member(
							c.prefix + "-" + c.name));
					return d > c ? 1 : (d < c ? -1 : 0)
				}.bind(this));
				b
						.each((function(g) {
							var c = g.name;
							var f = g.prefix;
							var e = g.value;
							if (Object.prototype.toString.call(e) === "Object") {
								e = JSON.stringify(e)
							}
							switch (f + "-" + c) {
							case "raziel-parent":
								if (!this.parent) {
									break
								}
								var d = this.getCanvas()
										.getChildShapeByResourceId(e);
								if (d) {
									d.add(this)
								}
								break;
							default:
								var h = this.getStencil().property(f + "-" + c);
								if (h && h.isList() && typeof e === "string") {
									if ((e || "").strip() && !e.startsWith("[")
											&& !e.startsWith("]")) {
										e = '["' + e.strip() + '"]'
									}
									e = ((e || "").strip() || "[]").evalJSON()
								}
								if (this.properties.keys().member(f + "-" + c)) {
									this.setProperty(f + "-" + c, e)
								} else {
									if (!(c === "bounds" || c === "parent"
											|| c === "target"
											|| c === "dockers"
											|| c === "docker"
											|| c === "outgoing" || c === "incoming")) {
										this.setHiddenProperty(f + "-" + c, e)
									}
								}
							}
						}).bind(this))
			},
			toString : function() {
				return "ORYX.Core.AbstractShape " + this.id
			},
			toJSON : function() {
				var a = {
					resourceId : this.resourceId,
					properties : jQuery
							.extend({}, this.properties, this.hiddenProperties)
							.inject(
									{},
									function(d, h) {
										var c = h[0];
										var f = h[1];
										if (this.getStencil().property(c)
												&& this.getStencil()
														.property(c).type() === ORYX.CONFIG.TYPE_COMPLEX
												&& Object.prototype.toString
														.call(f) === "String") {
											try {
												f = JSON.parse(f)
											} catch (b) {
											}
										} else {
											if (f instanceof Date
													&& this.getStencil()
															.property(c)) {
												try {
													f = f.format(this
															.getStencil()
															.property(c)
															.dateFormat())
												} catch (g) {
												}
											}
										}
										c = c.replace(/^[\w_]+-/, "");
										d[c] = f;
										return d
									}.bind(this)),
					stencil : {
						id : this.getStencil().idWithoutNs()
					},
					childShapes : this.getChildShapes().map(function(b) {
						return b.toJSON()
					})
				};
				if (this.getOutgoingShapes) {
					a.outgoing = this.getOutgoingShapes().map(function(b) {
						return {
							resourceId : b.resourceId
						}
					})
				}
				if (this.bounds) {
					a.bounds = {
						lowerRight : this.bounds.lowerRight(),
						upperLeft : this.bounds.upperLeft()
					}
				}
				if (this.dockers) {
					a.dockers = this.dockers
							.map(function(b) {
								var c = b.getDockedShape() && b.referencePoint ? b.referencePoint
										: b.bounds.center();
								c.getDocker = function() {
									return b
								};
								return c
							})
				}
				jQuery.extend(a, ORYX.Core.AbstractShape.JSONHelper);
				a.getShape = function() {
					return this
				}.bind(this);
				return a
			}
		});
ORYX.Core.AbstractShape.JSONHelper = {
	eachChild : function(c, b, d) {
		if (!this.childShapes) {
			return

			

						

			

		}
		var a = [];
		this.childShapes.each(function(e) {
			if (!(e.eachChild instanceof Function)) {
				jQuery.extend(e, ORYX.Core.AbstractShape.JSONHelper)
			}
			var f = c(e, this);
			if (f) {
				a.push(f)
			}
			if (b) {
				e.eachChild(c, b, d)
			}
		}.bind(this));
		if (d) {
			this.childShapes = a
		}
	},
	getShape : function() {
		return null
	},
	getChildShapes : function(a) {
		var b = this.childShapes;
		if (a) {
			this.eachChild(function(c) {
				if (!(c.getChildShapes instanceof Function)) {
					jQuery.extend(c, ORYX.Core.AbstractShape.JSONHelper)
				}
				b = b.concat(c.getChildShapes(a))
			}, true)
		}
		return b
	},
	serialize : function() {
		return JSON.stringify(this)
	}
};
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.Canvas = ORYX.Core.AbstractShape
		.extend({
			zoomLevel : 1,
			construct : function(a, c, b) {
				arguments.callee.$.construct.apply(this, arguments);
				if (!(a && a.width && a.height)) {
					ORYX.Log
							.fatal("Canvas is missing mandatory parameters options.width and options.height.");
					return

					

										

					

				}
				this.facade = b;
				this.resourceId = a.id;
				this.nodes = [];
				this.edges = [];
				this.colHighlightState = 0;
				this.colHighlightEnabled = false;
				this.rootNode = ORYX.Editor.graft("http://www.w3.org/2000/svg",
						a.parentNode, [ "svg", {
							id : this.id,
							width : a.width,
							height : a.height
						}, [ "defs", {} ] ]);
				this.rootNode.setAttribute("xmlns:xlink",
						"http://www.w3.org/1999/xlink");
				this.rootNode.setAttribute("xmlns:svg",
						"http://www.w3.org/2000/svg");
				this._htmlContainer = ORYX.Editor.graft(
						"http://www.w3.org/1999/xhtml", a.parentNode, [ "div",
								{
									id : "oryx_canvas_htmlContainer",
									style : "position:absolute; top:5px"
								} ]);
				this.underlayNode = ORYX.Editor.graft(
						"http://www.w3.org/2000/svg", this.rootNode, [ "svg", {
							id : "underlay-container"
						} ]);
				this.columnHightlight1 = ORYX.Editor.graft(
						"http://www.w3.org/2000/svg", this.underlayNode, [
								"rect", {
									x : 0,
									width : ORYX.CONFIG.FORM_ROW_WIDTH + 35,
									height : "100%",
									style : "fill: #fff6d5",
									visibility : "hidden"
								} ]);
				this.columnHightlight2 = ORYX.Editor.graft(
						"http://www.w3.org/2000/svg", this.underlayNode, [
								"rect", {
									x : ORYX.CONFIG.FORM_ROW_WIDTH + 35,
									width : ORYX.CONFIG.FORM_ROW_WIDTH + 25,
									height : "100%",
									style : "fill: #fff6d5",
									visibility : "hidden"
								} ]);
				this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg",
						this.rootNode, [ "g", {}, [ "g", {
							"class" : "stencils"
						}, [ "g", {
							"class" : "me"
						} ], [ "g", {
							"class" : "children"
						} ], [ "g", {
							"class" : "edge"
						} ] ], [ "g", {
							"class" : "svgcontainer"
						} ] ]);
				this.node.setAttributeNS(null, "stroke", "none");
				this.node.setAttributeNS(null, "font-family",
						"Verdana, sans-serif");
				this.node.setAttributeNS(null, "font-size-adjust", "none");
				this.node.setAttributeNS(null, "font-style", "normal");
				this.node.setAttributeNS(null, "font-variant", "normal");
				this.node.setAttributeNS(null, "font-weight", "normal");
				this.node.setAttributeNS(null, "line-heigth", "normal");
				this.node.setAttributeNS(null, "font-size",
						ORYX.CONFIG.LABEL_DEFAULT_LINE_HEIGHT);
				this.bounds.set(0, 0, a.width, a.height);
				this.addEventHandlers(this.rootNode.parentNode);
				this.rootNode.oncontextmenu = function() {
					return false
				}
			},
			focus : function() {
				try {
					if (!this.focusEl) {
						this.focusEl = jQuery("body")
								.append(
										jQuery('<a href="#" class="x-grid3-focus x-grid3-focus-canvas"/>'));
						this.focusEl.swallowEvent("click", true)
					}
					this.focusEl.focus.defer(1, this.focusEl);
					this.focusEl.blur.defer(3, this.focusEl)
				} catch (a) {
				}
			},
			setHightlightState : function(a) {
				if (this.colHighlightEnabled && this.colHighlightState != a) {
					if (a == 0) {
						this.columnHightlight1.setAttribute("visibility",
								"hidden");
						this.columnHightlight2.setAttribute("visibility",
								"hidden")
					} else {
						if (a == 1) {
							this.columnHightlight1.setAttribute("visibility",
									"visible");
							this.columnHightlight2.setAttribute("visibility",
									"hidden")
						} else {
							if (a == 2) {
								this.columnHightlight1.setAttribute(
										"visibility", "hidden");
								this.columnHightlight2.setAttribute(
										"visibility", "visible")
							} else {
								if (a == 3) {
									this.columnHightlight1.setAttribute(
											"visibility", "visible");
									this.columnHightlight2.setAttribute(
											"visibility", "visible")
								}
							}
						}
					}
					this.colHighlightState = a
				}
			},
			setHightlightStateBasedOnX : function(a) {
				if (a > ORYX.CONFIG.FORM_ROW_WIDTH + 30) {
					this.setHightlightState(2)
				} else {
					this.setHightlightState(1)
				}
			},
			update : function() {
				this.nodes.each(function(b) {
					this._traverseForUpdate(b)
				}.bind(this));
				var a = this.getStencil().layout();
				if (a) {
					a.each(function(b) {
						b.shape = this;
						b.forceExecution = true;
						b.target = this.rootNode;
						this._delegateEvent(b)
					}.bind(this))
				}
				this.nodes.invoke("_update");
				this.edges.invoke("_update", true)
			},
			_traverseForUpdate : function(a) {
				var b = a.isChanged;
				a.getChildNodes(false, function(c) {
					if (this._traverseForUpdate(c)) {
						b = true
					}
				}.bind(this));
				if (b) {
					a.layout();
					return true
				} else {
					return false
				}
			},
			layout : function() {
			},
			getChildNodes : function(b, c) {
				if (!b && !c) {
					return this.nodes.clone()
				} else {
					var a = [];
					this.nodes.each(function(d) {
						if (c) {
							c(d)
						}
						a.push(d);
						if (b && d instanceof ORYX.Core.Shape) {
							a = a.concat(d.getChildNodes(b, c))
						}
					});
					return a
				}
			},
			add : function(a, c, b) {
				if (a instanceof ORYX.Core.UIObject) {
					if (!(this.children.member(a))) {
						if (a.parent) {
							a.parent.remove(a, true)
						}
						if (c != undefined) {
							this.children.splice(c, 0, a)
						} else {
							this.children.push(a)
						}
						a.parent = this;
						if (a instanceof ORYX.Core.Shape) {
							if (a instanceof ORYX.Core.Edge) {
								a.addMarkers(this.rootNode
										.getElementsByTagNameNS(NAMESPACE_SVG,
												"defs")[0]);
								a.node = this.node.childNodes[0].childNodes[2]
										.appendChild(a.node);
								this.edges.push(a)
							} else {
								a.node = this.node.childNodes[0].childNodes[1]
										.appendChild(a.node);
								this.nodes.push(a)
							}
						} else {
							a.node = this.node.appendChild(a.node)
						}
						a.bounds.registerCallback(this._changedCallback);
						if (this.eventHandlerCallback && b !== true) {
							this.eventHandlerCallback({
								type : ORYX.CONFIG.EVENT_SHAPEADDED,
								shape : a
							})
						}
					} else {
						ORYX.Log
								.warn("add: ORYX.Core.UIObject is already a child of this object.")
					}
				} else {
					ORYX.Log
							.fatal("add: Parameter is not of type ORYX.Core.UIObject.")
				}
			},
			remove : function(a, b) {
				if (this.children.member(a)) {
					var c = a.parent;
					this.children = this.children.without(a);
					a.parent = undefined;
					if (a instanceof ORYX.Core.Shape) {
						if (a instanceof ORYX.Core.Edge) {
							a.removeMarkers();
							a.node = this.node.childNodes[0].childNodes[2]
									.removeChild(a.node);
							this.edges = this.edges.without(a)
						} else {
							a.node = this.node.childNodes[0].childNodes[1]
									.removeChild(a.node);
							this.nodes = this.nodes.without(a)
						}
					} else {
						a.node = this.node.removeChild(a.node)
					}
					if (this.eventHandlerCallback && b !== true) {
						this.eventHandlerCallback({
							type : ORYX.CONFIG.EVENT_SHAPEREMOVED,
							shape : a,
							parent : c
						})
					}
					a.bounds.unregisterCallback(this._changedCallback)
				} else {
					ORYX.Log
							.warn("remove: ORYX.Core.UIObject is not a child of this object.")
				}
			},
			addShapeObjects : function(d, c) {
				if (!d) {
					return

					

										

					

				}
				this.initializingShapes = true;
				var b = function(f, k) {
					var l = ORYX.Core.StencilSet.stencil(this.getStencil()
							.namespace()
							+ f.stencil.id);
					var h = (l.type() == "node") ? ORYX.Core.Node
							: ORYX.Core.Edge;
					var g = new h({
						eventHandlerCallback : c
					}, l, this.facade);
					g.resourceId = f.resourceId;
					g.node.id = "svg-" + f.resourceId;
					f.parent = "#"
							+ ((f.parent && f.parent.resourceId) || k.resourceId);
					this.add(g);
					return {
						json : f,
						object : g
					}
				}.bind(this);
				var e = function(f) {
					var g = [];
					if (f.childShapes && f.childShapes.constructor == String) {
						f.childShapes = JSON.parse(f.childShapes)
					}
					f.childShapes.each(function(h) {
						g.push(b(h, f));
						g = g.concat(e(h))
					});
					return g
				}.bind(this);
				var a = e({
					childShapes : d,
					resourceId : this.resourceId
				});
				a.each(function(f) {
					var g = [];
					for (field in f.json.properties) {
						g.push({
							prefix : "oryx",
							name : field,
							value : f.json.properties[field]
						})
					}
					f.json.outgoing.each(function(k) {
						g.push({
							prefix : "raziel",
							name : "outgoing",
							value : "#" + k.resourceId
						})
					});
					if (f.object instanceof ORYX.Core.Edge) {
						var h = f.json.target || f.json.outgoing[0];
						if (h) {
							g.push({
								prefix : "raziel",
								name : "target",
								value : "#" + h.resourceId
							})
						}
					}
					if (f.json.bounds) {
						g.push({
							prefix : "oryx",
							name : "bounds",
							value : f.json.bounds.upperLeft.x + ","
									+ f.json.bounds.upperLeft.y + ","
									+ f.json.bounds.lowerRight.x + ","
									+ f.json.bounds.lowerRight.y
						})
					}
					if (f.json.dockers) {
						g.push({
							prefix : "oryx",
							name : "dockers",
							value : f.json.dockers.inject("", function(l, k) {
								return l + k.x + " " + k.y + " "
							}) + " #"
						})
					}
					g.push({
						prefix : "raziel",
						name : "parent",
						value : f.json.parent
					});
					f.__properties = g
				}.bind(this));
				a.each(function(f) {
					if (f.object instanceof ORYX.Core.Node) {
						f.object.deserialize(f.__properties, f.json)
					}
				});
				a.each(function(f) {
					if (f.object instanceof ORYX.Core.Edge) {
						f.object.deserialize(f.__properties, f.json);
						f.object._oldBounds = f.object.bounds.clone();
						f.object._update()
					}
				});
				delete this.initializingShapes;
				return a.pluck("object")
			},
			updateSize : function() {
				var b = 0;
				var a = 0;
				var c = 100;
				this.getChildShapes(true, function(e) {
					var d = e.bounds;
					b = Math.max(b, d.lowerRight().x + c);
					a = Math.max(a, d.lowerRight().y + c)
				});
				if (this.bounds.width() < b || this.bounds.height() < a) {
					this.setSize({
						width : Math.max(this.bounds.width(), b),
						height : Math.max(this.bounds.height(), a)
					})
				}
			},
			getRootNode : function() {
				return this.rootNode
			},
			getUnderlayNode : function() {
				return this.underlayNode
			},
			getSvgContainer : function() {
				return this.node.childNodes[1]
			},
			getHTMLContainer : function() {
				return this._htmlContainer
			},
			getShapesWithSharedParent : function(a) {
				if (!a || a.length < 1) {
					return []
				}
				if (a.length == 1) {
					return a
				}
				return a.findAll(function(c) {
					var b = c.parent;
					while (b) {
						if (a.member(b)) {
							return false
						}
						b = b.parent
					}
					return true
				})
			},
			setSize : function(b, a) {
				if (!b || !b.width || !b.height) {
					return

					

										

					

				}
				if (this.rootNode.parentNode) {
					this.rootNode.parentNode.style.width = b.width + "px";
					this.rootNode.parentNode.style.height = b.height + "px"
				}
				this.rootNode.setAttributeNS(null, "width", b.width);
				this.rootNode.setAttributeNS(null, "height", b.height);
				if (!a) {
					this.bounds.set({
						a : {
							x : 0,
							y : 0
						},
						b : {
							x : b.width / this.zoomLevel,
							y : b.height / this.zoomLevel
						}
					})
				}
			},
			getSVGRepresentation : function(o) {
				var k = this.getRootNode().cloneNode(true);
				this._removeInvisibleElements(k);
				var d, n, b, m;
				this.getChildShapes(true).each(function(q) {
					var s = q.absoluteBounds();
					var r = s.upperLeft();
					var e = s.lowerRight();
					if (d == undefined) {
						d = r.x;
						n = r.y;
						b = e.x;
						m = e.y
					} else {
						d = Math.min(d, r.x);
						n = Math.min(n, r.y);
						b = Math.max(b, e.x);
						m = Math.max(m, e.y)
					}
				});
				var f = 50;
				var c, p, h, g;
				if (d == undefined) {
					c = 0;
					p = 0;
					h = 0;
					g = 0
				} else {
					c = b;
					p = m;
					h = -d + f / 2;
					g = -n + f / 2
				}
				k.setAttributeNS(null, "width", c + f);
				k.setAttributeNS(null, "height", p + f);
				k.childNodes[1].removeAttributeNS(null, "transform");
				try {
					var a = k.childNodes[1].childNodes[1];
					a.parentNode.removeChild(a)
				} catch (l) {
				}
				if (o) {
					$A(
							k.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG,
									"tspan")).each(function(e) {
						e.textContent = e.textContent.escapeHTML()
					});
					$A(
							k.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG,
									"text")).each(function(e) {
						if (e.childNodes.length == 0) {
							e.textContent = e.textContent.escapeHTML()
						}
					})
				}
				$A(k.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG, "image"))
						.each(
								function(q) {
									var e = q.getAttributeNS(
											"http://www.w3.org/1999/xlink",
											"href");
									if (!e.match("^(http|https)://")) {
										e = window.location.protocol + "//"
												+ window.location.host + e;
										q.setAttributeNS(
												"http://www.w3.org/1999/xlink",
												"href", e)
									}
								});
				$A(k.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG, "a"))
						.each(
								function(e) {
									e
											.setAttributeNS(
													"http://www.w3.org/1999/xlink",
													"xlink:href",
													(e
															.getAttributeNS(
																	"http://www.w3.org/1999/xlink",
																	"href") || "")
															.escapeHTML())
								});
				return k
			},
			_removeInvisibleElements : function(b) {
				var a = 0;
				while (a < b.childNodes.length) {
					var c = b.childNodes[a];
					if (c.getAttributeNS
							&& c.getAttributeNS(null, "visibility") === "hidden") {
						b.removeChild(c)
					} else {
						this._removeInvisibleElements(c);
						a++
					}
				}
			},
			_delegateEvent : function(a) {
				if (this.eventHandlerCallback
						&& (a.target == this.rootNode || a.target == this.rootNode.parentNode)) {
					this.eventHandlerCallback(a, this)
				}
			},
			toString : function() {
				return "Canvas " + this.id
			},
			toJSON : function() {
				var a = arguments.callee.$.toJSON.apply(this, arguments);
				a.stencilset = {
					url : this.getStencil().stencilSet().source(),
					namespace : this.getStencil().stencilSet().namespace()
				};
				return a
			}
		});
var idCounter = 0;
var ID_PREFIX = "resource";
function init() {
	ORYX.Log.debug("Querying editor instances");
	ORYX.Editor.setMissingClasses();
	if (window.onOryxResourcesLoaded) {
		window.onOryxResourcesLoaded()
	} else {
		var b = window.location.search.substring(4);
		var a = "./service/model/" + b + "/json";
		ORYX.Editor.createByUrl(a)
	}
}
if (!ORYX) {
	var ORYX = {}
}
ORYX.Editor = {
	DOMEventListeners : new Hash(),
	selection : [],
	zoomLevel : 1,
	construct : function(d) {
		this._eventsQueue = [];
		this.loadedPlugins = [];
		this.pluginsData = [];
		this.modelMetaData = d;
		var c = d;
		this.id = c.modelId;
		if (d.model) {
			c = d.model
		}
		if (!this.id) {
			this.id = c.id;
			if (!this.id) {
				this.id = ORYX.Editor.provideId()
			}
		}
		this.fullscreen = d.fullscreen !== false;
		this._initEventListener();
		if (ORYX.CONFIG.BACKEND_SWITCH) {
			var b = (c.stencilset.namespace || c.stencilset.url).replace("#",
					"%23");
			ORYX.Core.StencilSet.loadStencilSet(b, this.modelMetaData, this.id)
		} else {
			var b = c.stencilset.url;
			ORYX.Core.StencilSet.loadStencilSet(b, this.modelMetaData, this.id)
		}
		this._createCanvas(c.stencil ? c.stencil.id : null, c.properties);
		this._generateGUI();
		var f = false;
		var e = false;
		var a = function() {
			if (!f || !e) {
				return

				

								

				

			}
			this._finishedLoading()
		}.bind(this);
		window.setTimeout(function() {
			this.loadPlugins();
			f = true;
			a()
		}.bind(this), 100);
		window.setTimeout(function() {
			this.loadSerialized(c, true);
			this.getCanvas().update();
			e = true;
			a()
		}.bind(this), 200)
	},
	_finishedLoading : function() {
		this.handleEvents({
			type : ORYX.CONFIG.EVENT_LOADED
		})
	},
	_initEventListener : function() {
		document.documentElement.addEventListener(ORYX.CONFIG.EVENT_KEYDOWN,
				this.catchKeyDownEvents.bind(this), false);
		document.documentElement.addEventListener(ORYX.CONFIG.EVENT_KEYUP,
				this.catchKeyUpEvents.bind(this), false);
		this._keydownEnabled = true;
		this._keyupEnabled = true;
		this.DOMEventListeners[ORYX.CONFIG.EVENT_MOUSEDOWN] = [];
		this.DOMEventListeners[ORYX.CONFIG.EVENT_MOUSEUP] = [];
		this.DOMEventListeners[ORYX.CONFIG.EVENT_MOUSEOVER] = [];
		this.DOMEventListeners[ORYX.CONFIG.EVENT_MOUSEOUT] = [];
		this.DOMEventListeners[ORYX.CONFIG.EVENT_SELECTION_CHANGED] = [];
		this.DOMEventListeners[ORYX.CONFIG.EVENT_MOUSEMOVE] = []
	},
	_generateGUI : function() {
		var a = ORYX.CONFIG.WINDOW_HEIGHT;
		var b = this.getCanvas().rootNode.parentNode;
		jQuery("#canvasSection").append(b);
		b.parentNode.setAttributeNS(null, "align", "center");
		b.setAttributeNS(null, "align", "left");
		this.getCanvas().setSize({
			width : ORYX.CONFIG.CANVAS_WIDTH,
			height : ORYX.CONFIG.CANVAS_HEIGHT
		})
	},
	getAvailablePlugins : function() {
		var a = ORYX.availablePlugins.clone();
		a.each(function(b) {
			if (this.loadedPlugins.find(function(c) {
				return c.type == this.name
			}.bind(b))) {
				b.engaged = true
			} else {
				b.engaged = false
			}
		}.bind(this));
		return a
	},
	loadScript : function(b, c) {
		var a = document.createElement("script");
		a.type = "text/javascript";
		if (a.readyState) {
			a.onreadystatechange = function() {
				if (a.readyState == "loaded" || a.readyState == "complete") {
					a.onreadystatechange = null;
					c()
				}
			}
		} else {
			a.onload = function() {
				c()
			}
		}
		a.src = b;
		document.getElementsByTagName("head")[0].appendChild(a)
	},
	activatePluginByName : function(name, callback, loadTry) {
		var match = this.getAvailablePlugins().find(function(value) {
			return value.name == name
		});
		if (match && (!match.engaged || (match.engaged === "false"))) {
			var loadedStencilSetsNamespaces = this.getStencilSets().keys();
			var facade = this._getPluginFacade();
			var newPlugin;
			var me = this;
			ORYX.Log.debug("Initializing plugin '%0'", match.name);
			if (!match.requires || !match.requires.namespaces
					|| match.requires.namespaces.any(function(req) {
						return loadedStencilSetsNamespaces.indexOf(req) >= 0
					})) {
				if (!match.notUsesIn
						|| !match.notUsesIn.namespaces
						|| !match.notUsesIn.namespaces
								.any(function(req) {
									return loadedStencilSetsNamespaces
											.indexOf(req) >= 0
								})) {
					try {
						var className = eval(match.name);
						var newPlugin = new className(facade, match);
						newPlugin.type = match.name;
						if (newPlugin.registryChanged) {
							newPlugin.registryChanged(me.pluginsData)
						}
						if (newPlugin.onSelectionChanged) {
							me.registerOnEvent(
									ORYX.CONFIG.EVENT_SELECTION_CHANGED,
									newPlugin.onSelectionChanged
											.bind(newPlugin))
						}
						this.loadedPlugins.push(newPlugin);
						this.loadedPlugins.each(function(loaded) {
							if (loaded.registryChanged) {
								loaded.registryChanged(this.pluginsData)
							}
						}.bind(me));
						callback(true)
					} catch (e) {
						ORYX.Log.warn("Plugin %0 is not available", match.name);
						if (!!loadTry) {
							callback(false, "INITFAILED");
							return

							

														

							

						}
						this.loadScript("plugins/scripts/" + match.source,
								this.activatePluginByName.bind(this,
										match.name, callback, true))
					}
				} else {
					callback(false, "NOTUSEINSTENCILSET");
					ORYX.Log.info(
							"Plugin need a stencilset which is not loaded'",
							match.name)
				}
			} else {
				callback(false, "REQUIRESTENCILSET");
				ORYX.Log.info("Plugin need a stencilset which is not loaded'",
						match.name)
			}
		} else {
			callback(false, match ? "NOTFOUND" : "YETACTIVATED")
		}
	},
	loadPlugins : function() {
		var me = this;
		var newPlugins = [];
		var loadedStencilSetsNamespaces = this.getStencilSets().keys();
		var facade = this._getPluginFacade();
		if (ORYX.MashupAPI && ORYX.MashupAPI.loadablePlugins
				&& ORYX.MashupAPI.loadablePlugins instanceof Array) {
			ORYX.availablePlugins = $A(ORYX.availablePlugins).findAll(
					function(value) {
						return ORYX.MashupAPI.loadablePlugins
								.include(value.name)
					});
			ORYX.MashupAPI.loadablePlugins.each(function(className) {
				if (!(ORYX.availablePlugins.find(function(val) {
					return val.name == className
				}))) {
					ORYX.availablePlugins.push({
						name : className
					})
				}
			})
		}
		ORYX.availablePlugins
				.each(function(value) {
					ORYX.Log.debug("Initializing plugin '%0'", value.name);
					if ((!value.requires || !value.requires.namespaces || value.requires.namespaces
							.any(function(req) {
								return loadedStencilSetsNamespaces.indexOf(req) >= 0
							}))
							&& (!value.notUsesIn || !value.notUsesIn.namespaces || !value.notUsesIn.namespaces
									.any(function(req) {
										return loadedStencilSetsNamespaces
												.indexOf(req) >= 0
									}))
							&& (value.engaged || (value.engaged === undefined))) {
						try {
							var className = eval(value.name);
							if (className) {
								var plugin = new className(facade, value);
								plugin.type = value.name;
								newPlugins.push(plugin);
								plugin.engaged = true
							}
						} catch (e) {
							ORYX.Log.warn("Plugin %0 is not available %1",
									value.name, e)
						}
					} else {
						ORYX.Log
								.info(
										"Plugin need a stencilset which is not loaded'",
										value.name)
					}
				});
		newPlugins.each(function(value) {
			if (value.registryChanged) {
				value.registryChanged(me.pluginsData)
			}
			if (value.onSelectionChanged) {
				me.registerOnEvent(ORYX.CONFIG.EVENT_SELECTION_CHANGED,
						value.onSelectionChanged.bind(value))
			}
		});
		this.loadedPlugins = newPlugins;
		this.registerPluginsOnKeyEvents();
		this.setSelection()
	},
	_createCanvas : function(c, d) {
		if (c) {
			if (c.search(/^http/) === -1) {
				c = this.getStencilSets().values()[0].namespace() + c
			}
		} else {
			c = this.getStencilSets().values()[0].findRootStencilName()
		}
		var a = ORYX.Core.StencilSet.stencil(c);
		if (!a) {
			ORYX.Log
					.fatal(
							"Initialisation failed, because the stencil with the type %0 is not part of one of the loaded stencil sets.",
							c)
		}
		var e = ORYX.Editor.graft("http://www.w3.org/1999/xhtml", null,
				[ "div" ]);
		e.addClassName("ORYX_Editor");
		this._canvas = new ORYX.Core.Canvas({
			width : ORYX.CONFIG.CANVAS_WIDTH,
			height : ORYX.CONFIG.CANVAS_HEIGHT,
			eventHandlerCallback : this.handleEvents.bind(this),
			id : this.id,
			parentNode : e
		}, a, this._getPluginFacade());
		if (d) {
			var b = [];
			for (field in d) {
				b.push({
					prefix : "oryx",
					name : field,
					value : d[field]
				})
			}
			this._canvas.deserialize(b)
		}
	},
	_getPluginFacade : function() {
		if (!(this._pluginFacade)) {
			this._pluginFacade = {
				activatePluginByName : this.activatePluginByName.bind(this),
				getAvailablePlugins : this.getAvailablePlugins.bind(this),
				offer : this.offer.bind(this),
				getStencilSets : this.getStencilSets.bind(this),
				getStencilSetExtensionDefinition : function() {
					return Object.clone(this.ss_extensions_def || {})
				}.bind(this),
				getRules : this.getRules.bind(this),
				loadStencilSet : this.loadStencilSet.bind(this),
				createShape : this.createShape.bind(this),
				deleteShape : this.deleteShape.bind(this),
				getSelection : this.getSelection.bind(this),
				setSelection : this.setSelection.bind(this),
				updateSelection : this.updateSelection.bind(this),
				getCanvas : this.getCanvas.bind(this),
				importJSON : this.importJSON.bind(this),
				getJSON : this.getJSON.bind(this),
				getSerializedJSON : this.getSerializedJSON.bind(this),
				executeCommands : this.executeCommands.bind(this),
				isExecutingCommands : this.isExecutingCommands.bind(this),
				registerOnEvent : this.registerOnEvent.bind(this),
				unregisterOnEvent : this.unregisterOnEvent.bind(this),
				raiseEvent : this.handleEvents.bind(this),
				enableEvent : this.enableEvent.bind(this),
				disableEvent : this.disableEvent.bind(this),
				eventCoordinates : this.eventCoordinates.bind(this),
				eventCoordinatesXY : this.eventCoordinatesXY.bind(this),
				getModelMetaData : this.getModelMetaData.bind(this)
			}
		}
		return this._pluginFacade
	},
	isExecutingCommands : function() {
		return !!this.commandExecuting
	},
	executeCommands : function(a) {
		if (!this.commandStack) {
			this.commandStack = []
		}
		if (!this.commandStackExecuted) {
			this.commandStackExecuted = []
		}
		this.commandStack = [].concat(this.commandStack).concat(a);
		if (this.commandExecuting) {
			return

			

						

			

		}
		this.commandExecuting = true;
		while (this.commandStack.length > 0) {
			var b = this.commandStack.shift();
			b.execute();
			this.commandStackExecuted.push(b)
		}
		this.handleEvents({
			type : ORYX.CONFIG.EVENT_EXECUTE_COMMANDS,
			commands : this.commandStackExecuted
		});
		delete this.commandStack;
		delete this.commandStackExecuted;
		delete this.commandExecuting;
		this.updateSelection()
	},
	getJSON : function() {
		delete Array.prototype.toJSON;
		var a = this.getCanvas().toJSON();
		a.ssextensions = this.getStencilSets().values()[0].extensions().keys()
				.findAll(function(b) {
					return !b.endsWith("/meta#")
				});
		return a
	},
	getSerializedJSON : function() {
		return JSON.stringify(this.getJSON())
	},
	importJSON : function(d, c) {
		try {
			d = this.renewResourceIds(d)
		} catch (b) {
			throw b
		}
		if (d.stencilset.namespace
				&& d.stencilset.namespace !== this.getCanvas().getStencil()
						.stencilSet().namespace()) {
			alert(String.format(ORYX.I18N.JSONImport.wrongSS,
					d.stencilset.namespace, this.getCanvas().getStencil()
							.stencilSet().namespace()));
			return null
		} else {
			var a = ORYX.Core.Command.extend({
				construct : function(g, k, f, h) {
					this.jsonObject = g;
					this.noSelection = f;
					this.facade = h;
					this.shapes;
					this.connections = [];
					this.parents = new Hash();
					this.selection = this.facade.getSelection();
					this.loadSerialized = k
				},
				execute : function() {
					if (!this.shapes) {
						this.shapes = this.loadSerialized(this.jsonObject);
						this.shapes.each(function(g) {
							if (g.getDockers) {
								var f = g.getDockers();
								if (f) {
									if (f.length > 0) {
										this.connections.push([ f.first(),
												f.first().getDockedShape(),
												f.first().referencePoint ])
									}
									if (f.length > 1) {
										this.connections.push([ f.last(),
												f.last().getDockedShape(),
												f.last().referencePoint ])
									}
								}
							}
							this.parents[g.id] = g.parent
						}.bind(this))
					} else {
						this.shapes.each(function(f) {
							this.parents[f.id].add(f)
						}.bind(this));
						this.connections.each(function(f) {
							f[0].setDockedShape(f[1]);
							f[0].setReferencePoint(f[2]);
							f[0].update()
						})
					}
					this.facade.getCanvas().update();
					if (!this.noSelection) {
						this.facade.setSelection(this.shapes)
					} else {
						this.facade.updateSelection()
					}
					this.facade.getCanvas().updateSize()
				},
				rollback : function() {
					var f = this.facade.getSelection();
					this.shapes.each(function(g) {
						f = f.without(g);
						this.facade.deleteShape(g)
					}.bind(this));
					this.facade.getCanvas().update();
					this.facade.setSelection(f)
				}
			});
			var e = new a(d, this.loadSerialized.bind(this), c, this
					._getPluginFacade());
			this.executeCommands([ e ]);
			return e.shapes.clone()
		}
	},
	renewResourceIds : function(b) {
		if (Object.prototype.toString.call(b) === "String") {
			try {
				var d = b;
				b = JSON.parse(b)
			} catch (a) {
				throw new SyntaxError(a.message)
			}
		} else {
			var d = JSON.stringify(b)
		}
		var e = function(f) {
			if (!f) {
				return []
			}
			return f.map(function(g) {
				return e(g.childShapes).concat(g.resourceId)
			}).flatten()
		};
		var c = e(b.childShapes);
		c.each(function(f) {
			var g = ORYX.Editor.provideId();
			d = d.replace(new RegExp(f, "g"), g)
		});
		return JSON.parse(d)
	},
	loadSerialized : function(d, e) {
		var c = this.getCanvas();
		this.loadSSExtensions(d.ssextensions);
		if (e === true) {
			var b = this.getExtensionForMetaData();
			if (b) {
				this.loadSSExtension(b)
			}
		}
		var a = this.getCanvas().addShapeObjects(d.childShapes,
				this.handleEvents.bind(this));
		if (d.properties) {
			for (key in d.properties) {
				var f = d.properties[key];
				var g = this.getCanvas().getStencil().property("oryx-" + key);
				if (!(typeof f === "string") && (!g || !g.isList())) {
					f = JSON.stringify(f)
				}
				this.getCanvas().setProperty("oryx-" + key, f)
			}
		}
		this.getCanvas().updateSize();
		this.selection = [ null ];
		this.setSelection([]);
		return a
	},
	getExtensionForMetaData : function() {
		if (!this.ss_extensions_def
				|| !(this.ss_extensions_def.extensions instanceof Array)) {
			return null
		}
		var a = this.getStencilSets();
		var b = this.ss_extensions_def.extensions.find(function(c) {
			return !!a[c["extends"]] && c.namespace.endsWith("/meta#")
		});
		return b ? b.namespace || null : null
	},
	loadSSExtensions : function(a) {
		if (!a) {
			return

			

						

			

		}
		a.each(function(b) {
			this.loadSSExtension(b)
		}.bind(this))
	},
	loadSSExtension : function(b) {
		if (this.ss_extensions_def) {
			var c = this.ss_extensions_def.extensions.find(function(d) {
				return (d.namespace == b)
			});
			if (!c) {
				return

				

								

				

			}
			var a = this.getStencilSets()[c["extends"]];
			if (!a) {
				return

				

								

				

			}
			if ((c.definition || "").startsWith("/")) {
				a.addExtension(c.definition)
			} else {
				a.addExtension(ORYX.CONFIG.SS_EXTENSIONS_FOLDER + c.definition)
			}
			this.getRules().initializeRules(a);
			this._getPluginFacade().raiseEvent({
				type : ORYX.CONFIG.EVENT_STENCIL_SET_LOADED
			})
		}
	},
	disableEvent : function(a) {
		if (a == ORYX.CONFIG.EVENT_KEYDOWN) {
			this._keydownEnabled = false
		}
		if (a == ORYX.CONFIG.EVENT_KEYUP) {
			this._keyupEnabled = false
		}
		if (this.DOMEventListeners.keys().member(a)) {
			var b = this.DOMEventListeners.remove(a);
			this.DOMEventListeners["disable_" + a] = b
		}
	},
	enableEvent : function(a) {
		if (a == ORYX.CONFIG.EVENT_KEYDOWN) {
			this._keydownEnabled = true
		}
		if (a == ORYX.CONFIG.EVENT_KEYUP) {
			this._keyupEnabled = true
		}
		if (this.DOMEventListeners.keys().member("disable_" + a)) {
			var b = this.DOMEventListeners.remove("disable_" + a);
			this.DOMEventListeners[a] = b
		}
	},
	registerOnEvent : function(a, b) {
		if (!(this.DOMEventListeners.keys().member(a))) {
			this.DOMEventListeners[a] = []
		}
		this.DOMEventListeners[a].push(b)
	},
	unregisterOnEvent : function(a, b) {
		if (this.DOMEventListeners.keys().member(a)) {
			this.DOMEventListeners[a] = this.DOMEventListeners[a].without(b)
		} else {
		}
	},
	getSelection : function() {
		return this.selection || []
	},
	getStencilSets : function() {
		return ORYX.Core.StencilSet.stencilSets(this.id)
	},
	getRules : function() {
		return ORYX.Core.StencilSet.rules(this.id)
	},
	loadStencilSet : function(a) {
		try {
			ORYX.Core.StencilSet.loadStencilSet(a, this.modelMetaData, this.id);
			this.handleEvents({
				type : ORYX.CONFIG.EVENT_STENCIL_SET_LOADED
			})
		} catch (b) {
			ORYX.Log.warn("Requesting stencil set file failed. (" + b + ")")
		}
	},
	offer : function(a) {
		if (!this.pluginsData.member(a)) {
			this.pluginsData.push(a)
		}
	},
	registerPluginsOnKeyEvents : function() {
		this.pluginsData
				.each(function(a) {
					if (a.keyCodes) {
						a.keyCodes
								.each(function(c) {
									var b = "key.event";
									b += "." + c.keyAction;
									if (c.metaKeys) {
										if (c.metaKeys
												.indexOf(ORYX.CONFIG.META_KEY_META_CTRL) > -1) {
											b += "."
													+ ORYX.CONFIG.META_KEY_META_CTRL
										}
										if (c.metaKeys
												.indexOf(ORYX.CONFIG.META_KEY_ALT) > -1) {
											b += "." + ORYX.CONFIG.META_KEY_ALT
										}
										if (c.metaKeys
												.indexOf(ORYX.CONFIG.META_KEY_SHIFT) > -1) {
											b += "."
													+ ORYX.CONFIG.META_KEY_SHIFT
										}
									}
									if (c.keyCode) {
										b += "." + c.keyCode
									}
									ORYX.Log.debug(
											"Register Plugin on Key Event: %0",
											b);
									if (a.toggle === true && a.buttonInstance) {
										this
												.registerOnEvent(
														b,
														function() {
															a.buttonInstance
																	.toggle(!a.buttonInstance.pressed);
															a.functionality
																	.call(
																			a,
																			a.buttonInstance,
																			a.buttonInstance.pressed)
														})
									} else {
										this
												.registerOnEvent(b,
														a.functionality)
									}
								}.bind(this))
					}
				}.bind(this))
	},
	isEqual : function(d, c) {
		return d === c || (d.length === c.length && d.all(function(a) {
			return c.include(a)
		}))
	},
	isDirty : function(b) {
		return b.any(function(a) {
			return a.isPropertyChanged()
		})
	},
	setSelection : function(c, a, b) {
		if (!c) {
			c = []
		}
		if (!(c instanceof Array)) {
			c = [ c ]
		}
		c = c.findAll(function(d) {
			return d && d instanceof ORYX.Core.Shape
		});
		if (c[0] instanceof ORYX.Core.Canvas) {
			c = []
		}
		if (!b && this.isEqual(this.selection, c) && !this.isDirty(c)) {
			return

			

						

			

		}
		this.selection = c;
		this._subSelection = a;
		this.handleEvents({
			type : ORYX.CONFIG.EVENT_SELECTION_CHANGED,
			elements : c,
			subSelection : a,
			force : !!b
		})
	},
	updateSelection : function() {
		this.setSelection(this.selection, this._subSelection, true)
	},
	getCanvas : function() {
		return this._canvas
	},
	createShape : function(o) {
		if (o && o.serialize && o.serialize instanceof Array) {
			var d = o.serialize.find(function(b) {
				return (b.prefix + "-" + b.name) == "oryx-type"
			});
			var t = ORYX.Core.StencilSet.stencil(d.value);
			if (t.type() == "node") {
				var f = new ORYX.Core.Node({
					eventHandlerCallback : this.handleEvents.bind(this)
				}, t, this._getPluginFacade())
			} else {
				var f = new ORYX.Core.Edge({
					eventHandlerCallback : this.handleEvents.bind(this)
				}, t, this._getPluginFacade())
			}
			this.getCanvas().add(f);
			f.deserialize(o.serialize);
			return f
		}
		if (!o || !o.type || !o.namespace) {
			throw "To create a new shape you have to give an argument with type and namespace"
		}
		var c = this.getCanvas();
		var f;
		var u = o.type;
		var r = ORYX.Core.StencilSet.stencilSet(o.namespace);
		if (r.stencil(u).type() == "node") {
			f = new ORYX.Core.Node({
				eventHandlerCallback : this.handleEvents.bind(this)
			}, r.stencil(u), this._getPluginFacade())
		} else {
			f = new ORYX.Core.Edge({
				eventHandlerCallback : this.handleEvents.bind(this)
			}, r.stencil(u), this._getPluginFacade())
		}
		if (o.template) {
			f._jsonStencil.properties = o.template._jsonStencil.properties;
			f.postProcessProperties()
		}
		if (o.parent && f instanceof ORYX.Core.Node) {
			o.parent.add(f)
		} else {
			c.add(f)
		}
		var s = o.position ? o.position : {
			x : 100,
			y : 200
		};
		var g;
		if (o.connectingType && o.connectedShape
				&& !(f instanceof ORYX.Core.Edge)) {
			g = new ORYX.Core.Edge({
				eventHandlerCallback : this.handleEvents.bind(this)
			}, r.stencil(o.connectingType));
			g.dockers.first().setDockedShape(o.connectedShape);
			var l = o.connectedShape.getDefaultMagnet();
			var a = l ? l.bounds.center() : o.connectedShape.bounds.midPoint();
			g.dockers.first().setReferencePoint(a);
			g.dockers.last().setDockedShape(f);
			g.dockers.last().setReferencePoint(
					f.getDefaultMagnet().bounds.center());
			c.add(g)
		}
		if (f instanceof ORYX.Core.Edge && o.connectedShape) {
			f.dockers.first().setDockedShape(o.connectedShape);
			if (o.connectedShape instanceof ORYX.Core.Node) {
				f.dockers.first().setReferencePoint(
						o.connectedShape.getDefaultMagnet().bounds.center());
				f.dockers.last().bounds.centerMoveTo(s)
			} else {
				f.dockers.first().setReferencePoint(
						o.connectedShape.bounds.midPoint())
			}
			var k = f.dockers.first();
			var e = f.dockers.last();
			if (k.getDockedShape() && e.getDockedShape()) {
				var q = k.getAbsoluteReferencePoint();
				var n = e.getAbsoluteReferencePoint();
				var p = f.createDocker();
				p.bounds.centerMoveTo({
					x : q.x + (endPont.x - q.x) / 2,
					y : q.y + (endPont.y - q.y) / 2
				})
			}
		} else {
			var v = f.bounds;
			if (f instanceof ORYX.Core.Node && f.dockers.length == 1) {
				v = f.dockers.first().bounds
			}
			v.centerMoveTo(s);
			var h = v.upperLeft();
			v.moveBy(-Math.min(h.x, 0), -Math.min(h.y, 0));
			var m = v.lowerRight();
			v.moveBy(-Math.max(m.x - c.bounds.width(), 0), -Math.max(m.y
					- c.bounds.height(), 0))
		}
		if (f instanceof ORYX.Core.Edge) {
			f._update(false)
		}
		if (!(f instanceof ORYX.Core.Edge) && !(o.dontUpdateSelection)) {
			this.setSelection([ f ])
		}
		if (g && g.alignDockers) {
		}
		if (f.alignDockers) {
			f.alignDockers()
		}
		return f
	},
	deleteShape : function(a) {
		if (!a || !a.parent) {
			return

			

						

			

		}
		a.parent.remove(a);
		a.getOutgoingShapes().each(function(c) {
			var b = c.getDockers().first();
			if (b && b.getDockedShape() == a) {
				b.setDockedShape(undefined)
			}
		});
		a.getIncomingShapes().each(function(b) {
			var c = b.getDockers().last();
			if (c && c.getDockedShape() == a) {
				c.setDockedShape(undefined)
			}
		});
		a.getDockers().each(function(b) {
			b.setDockedShape(undefined)
		})
	},
	getModelMetaData : function() {
		return this.modelMetaData
	},
	_executeEventImmediately : function(a) {
		if (this.DOMEventListeners.keys().member(a.event.type)) {
			this.DOMEventListeners[a.event.type].each((function(b) {
				b(a.event, a.arg)
			}).bind(this))
		}
	},
	_executeEvents : function() {
		this._queueRunning = true;
		while (this._eventsQueue.length > 0) {
			var a = this._eventsQueue.shift();
			this._executeEventImmediately(a)
		}
		this._queueRunning = false
	},
	handleEvents : function(b, a) {
		ORYX.Log.trace("Dispatching event type %0 on %1", b.type, a);
		switch (b.type) {
		case ORYX.CONFIG.EVENT_MOUSEDOWN:
			this._handleMouseDown(b, a);
			break;
		case ORYX.CONFIG.EVENT_MOUSEMOVE:
			this._handleMouseMove(b, a);
			break;
		case ORYX.CONFIG.EVENT_MOUSEUP:
			this._handleMouseUp(b, a);
			break;
		case ORYX.CONFIG.EVENT_MOUSEOVER:
			this._handleMouseHover(b, a);
			break;
		case ORYX.CONFIG.EVENT_MOUSEOUT:
			this._handleMouseOut(b, a);
			break
		}
		if (b.forceExecution) {
			this._executeEventImmediately({
				event : b,
				arg : a
			})
		} else {
			this._eventsQueue.push({
				event : b,
				arg : a
			})
		}
		if (!this._queueRunning) {
			this._executeEvents()
		}
		return false
	},
	isValidEvent : function(c) {
		try {
			var a = [ "INPUT", "TEXTAREA" ].include(c.target.tagName
					.toUpperCase());
			var b = c.target.className.include("x-grid3-focus")
					&& !c.target.className.include("x-grid3-focus-canvas");
			return !a && !b
		} catch (c) {
			return false
		}
	},
	catchKeyUpEvents : function(b) {
		if (!this._keyupEnabled) {
			return

			

						

			

		}
		if (!b) {
			b = window.event
		}
		if (!this.isValidEvent(b)) {
			return

			

						

			

		}
		var a = this.createKeyCombEvent(b, ORYX.CONFIG.KEY_ACTION_UP);
		ORYX.Log.debug("Key Event to handle: %0", a);
		this.handleEvents({
			type : a,
			event : b
		})
	},
	catchKeyDownEvents : function(b) {
		if (!this._keydownEnabled) {
			return

			

						

			

		}
		if (!b) {
			b = window.event
		}
		if (!this.isValidEvent(b)) {
			return

			

						

			

		}
		var a = this.createKeyCombEvent(b, ORYX.CONFIG.KEY_ACTION_DOWN);
		ORYX.Log.debug("Key Event to handle: %0", a);
		this.handleEvents({
			type : a,
			event : b
		})
	},
	createKeyCombEvent : function(c, b) {
		var d = c.which || c.keyCode;
		var a = "key.event";
		if (b) {
			a += "." + b
		}
		if (c.ctrlKey || c.metaKey) {
			a += "." + ORYX.CONFIG.META_KEY_META_CTRL
		}
		if (c.altKey) {
			a += "." + ORYX.CONFIG.META_KEY_ALT
		}
		if (c.shiftKey) {
			a += "." + ORYX.CONFIG.META_KEY_SHIFT
		}
		return a + "." + d
	},
	_handleMouseDown : function(a, l) {
		var b = this.getCanvas();
		b.focus();
		var d = a.currentTarget;
		var c = l;
		var g = (c !== null) && (c !== undefined) && (c.isSelectable);
		var m = (c !== null) && (c !== undefined) && (c.isMovable);
		var k = a.shiftKey || a.ctrlKey;
		var h = this.selection.length === 0;
		var e = this.selection.member(c);
		if (g && h) {
			this.setSelection([ c ]);
			ORYX.Log.trace("Rule #1 applied for mouse down on %0", d.id)
		} else {
			if (g && !h && !k && !e) {
				this.setSelection([ c ]);
				ORYX.Log.trace("Rule #3 applied for mouse down on %0", d.id)
			} else {
				if (g && k && !e) {
					var f = this.selection.clone();
					f.push(c);
					this.setSelection(f);
					ORYX.Log
							.trace("Rule #4 applied for mouse down on %0", d.id)
				} else {
					if (g && e && k) {
						var f = this.selection.clone();
						this.setSelection(f.without(c));
						ORYX.Log.trace("Rule #6 applied for mouse down on %0",
								c.id)
					} else {
						if (!g && !m) {
							this.setSelection([]);
							ORYX.Log.trace(
									"Rule #2 applied for mouse down on %0",
									d.id);
							return

							

														

							

						} else {
							if (!g
									&& m
									&& !(c instanceof ORYX.Core.Controls.Docker)) {
								ORYX.Log.trace(
										"Rule #7 applied for mouse down on %0",
										d.id)
							} else {
								if (g && e && !k) {
									this._subSelection = this._subSelection != c ? c
											: undefined;
									this.setSelection(this.selection,
											this._subSelection);
									ORYX.Log
											.trace(
													"Rule #8 applied for mouse down on %0",
													d.id)
								}
							}
						}
					}
				}
			}
		}
		return

		

				

		

	},
	_handleMouseMove : function(b, a) {
		return

		

				

		

	},
	_handleMouseUp : function(d, c) {
		var a = this.getCanvas();
		var e = c;
		var b = this.eventCoordinates(d)
	},
	_handleMouseHover : function(b, a) {
		return

		

				

		

	},
	_handleMouseOut : function(b, a) {
		return

		

				

		

	},
	eventCoordinates : function(f) {
		var b = this.getCanvas();
		var g = b.node.ownerSVGElement.createSVGPoint();
		g.x = f.clientX;
		g.y = f.clientY;
		var e = 1;
		if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
			var c = navigator.userAgent;
			if (c.indexOf("MSIE") >= 0) {
				var d = Math
						.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
				if (d !== 100) {
					e = d / 100
				}
			}
		}
		if (e !== 1) {
			g.x = g.x * e;
			g.y = g.y * e
		}
		var a = b.node.getScreenCTM();
		return g.matrixTransform(a.inverse())
	},
	eventCoordinatesXY : function(a, h) {
		var c = this.getCanvas();
		var g = c.node.ownerSVGElement.createSVGPoint();
		g.x = a;
		g.y = h;
		var f = 1;
		if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
			var d = navigator.userAgent;
			if (d.indexOf("MSIE") >= 0) {
				var e = Math
						.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
				if (e !== 100) {
					f = e / 100
				}
			}
		}
		if (f !== 1) {
			g.x = g.x * f;
			g.y = g.y * f
		}
		var b = c.node.getScreenCTM();
		return g.matrixTransform(b.inverse())
	}
};
ORYX.Editor = Clazz.extend(ORYX.Editor);
ORYX.Editor.createByUrl = function(a) {
	new Ajax.Request(a, {
		method : "GET",
		onSuccess : function(c) {
			var b = JSON.parse(c.responseText);
			new ORYX.Editor(b)
		}.bind(this)
	})
};
ORYX.Editor.graft = function(g, f, d, l) {
	l = (l || (f && f.ownerDocument) || document);
	var h;
	if (d === undefined) {
		throw "Can't graft an undefined value"
	} else {
		if (d.constructor == String) {
			h = l.createTextNode(d)
		} else {
			for (var c = 0; c < d.length; c++) {
				if (c === 0 && d[c].constructor == String) {
					var a;
					a = d[c].match(/^([a-z][a-z0-9]*)\.([^\s\.]+)$/i);
					if (a) {
						h = l.createElementNS(g, a[1]);
						h.setAttributeNS(null, "class", a[2]);
						continue
					}
					a = d[c].match(/^([a-z][a-z0-9]*)$/i);
					if (a) {
						h = l.createElementNS(g, a[1]);
						continue
					}
					h = l.createElementNS(g, "span");
					h.setAttribute(null, "class", "namelessFromLOL")
				}
				if (d[c] === undefined) {
					throw "Can't graft an undefined value in a list!"
				} else {
					if (d[c].constructor == String || d[c].constructor == Array) {
						this.graft(g, h, d[c], l)
					} else {
						if (d[c].constructor == Number) {
							this.graft(g, h, d[c].toString(), l)
						} else {
							if (d[c].constructor == Object) {
								for ( var b in d[c]) {
									h.setAttributeNS(null, b, d[c][b])
								}
							} else {
							}
						}
					}
				}
			}
		}
	}
	if (f && f.appendChild) {
		f.appendChild(h)
	} else {
	}
	return h
};
ORYX.Editor.provideId = function() {
	var b = [], c = "0123456789ABCDEF";
	for (var a = 0; a < 36; a++) {
		b[a] = Math.floor(Math.random() * 16)
	}
	b[14] = 4;
	b[19] = (b[19] & 3) | 8;
	for (var a = 0; a < 36; a++) {
		b[a] = c[b[a]]
	}
	b[8] = b[13] = b[18] = b[23] = "-";
	return "oryx_" + b.join("")
};
ORYX.Editor.resizeFix = function() {
	if (!ORYX.Editor._resizeFixTimeout) {
		ORYX.Editor._resizeFixTimeout = window.setTimeout(function() {
			window.resizeBy(1, 1);
			window.resizeBy(-1, -1);
			ORYX.Editor._resizefixTimeout = null
		}, 100)
	}
};
ORYX.Editor.Cookie = {
	callbacks : [],
	onChange : function(b, a) {
		this.callbacks.push(b);
		this.start(a)
	},
	start : function(a) {
		if (this.pe) {
			return

			

						

			

		}
		var b = document.cookie;
		this.pe = new PeriodicalExecuter(function() {
			if (b != document.cookie) {
				b = document.cookie;
				this.callbacks.each(function(c) {
					c(this.getParams())
				}.bind(this))
			}
		}.bind(this), (a || 10000) / 1000)
	},
	stop : function() {
		if (this.pe) {
			this.pe.stop();
			this.pe = null
		}
	},
	getParams : function() {
		var a = {};
		var b = document.cookie;
		b.split("; ").each(function(c) {
			a[c.split("=")[0]] = c.split("=")[1]
		});
		return a
	},
	toString : function() {
		return document.cookie
	}
};
ORYX.Editor.SVGClassElementsAreAvailable = true;
ORYX.Editor.setMissingClasses = function() {
	try {
		SVGElement
	} catch (a) {
		ORYX.Editor.SVGClassElementsAreAvailable = false;
		SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg",
				"svg").toString();
		SVGGElement = document.createElementNS("http://www.w3.org/2000/svg",
				"g").toString();
		SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg",
				"path").toString();
		SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg",
				"text").toString();
		SVGRectElement = document.createElementNS("http://www.w3.org/2000/svg",
				"rect").toString();
		SVGImageElement = document.createElementNS(
				"http://www.w3.org/2000/svg", "image").toString();
		SVGCircleElement = document.createElementNS(
				"http://www.w3.org/2000/svg", "circle").toString();
		SVGEllipseElement = document.createElementNS(
				"http://www.w3.org/2000/svg", "ellipse").toString();
		SVGLineElement = document.createElementNS("http://www.w3.org/2000/svg",
				"line").toString();
		SVGPolylineElement = document.createElementNS(
				"http://www.w3.org/2000/svg", "polyline").toString();
		SVGPolygonElement = document.createElementNS(
				"http://www.w3.org/2000/svg", "polygon").toString()
	}
};
ORYX.Editor.checkClassType = function(b, a) {
	if (ORYX.Editor.SVGClassElementsAreAvailable) {
		return b instanceof a
	} else {
		return b == a
	}
};
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
new function() {
	ORYX.Core.UIEnableDrag = function(e, d, c) {
		this.uiObj = d;
		var f = d.bounds.upperLeft();
		var b = d.node.getScreenCTM();
		this.faktorXY = {
			x : b.a,
			y : b.d
		};
		this.scrollNode = d.node.ownerSVGElement.parentNode.parentNode;
		this.offSetPosition = {
			x : Event.pointerX(e) - (f.x * this.faktorXY.x),
			y : Event.pointerY(e) - (f.y * this.faktorXY.y)
		};
		this.offsetScroll = {
			x : this.scrollNode.scrollLeft,
			y : this.scrollNode.scrollTop
		};
		this.dragCallback = ORYX.Core.UIDragCallback.bind(this);
		this.disableCallback = ORYX.Core.UIDisableDrag.bind(this);
		this.movedCallback = c ? c.movedCallback : undefined;
		this.upCallback = c ? c.upCallback : undefined;
		document.documentElement.addEventListener(ORYX.CONFIG.EVENT_MOUSEUP,
				this.disableCallback, true);
		document.documentElement.addEventListener(ORYX.CONFIG.EVENT_MOUSEMOVE,
				this.dragCallback, false)
	};
	ORYX.Core.UIDragCallback = function(b) {
		var a = {
			x : Event.pointerX(b) - this.offSetPosition.x,
			y : Event.pointerY(b) - this.offSetPosition.y
		};
		a.x -= this.offsetScroll.x - this.scrollNode.scrollLeft;
		a.y -= this.offsetScroll.y - this.scrollNode.scrollTop;
		a.x /= this.faktorXY.x;
		a.y /= this.faktorXY.y;
		this.uiObj.bounds.moveTo(a);
		if (this.movedCallback) {
			this.movedCallback(b)
		}
	};
	ORYX.Core.UIDisableDrag = function(a) {
		document.documentElement.removeEventListener(
				ORYX.CONFIG.EVENT_MOUSEMOVE, this.dragCallback, false);
		document.documentElement.removeEventListener(ORYX.CONFIG.EVENT_MOUSEUP,
				this.disableCallback, true);
		if (this.upCallback) {
			this.upCallback(a)
		}
		this.upCallback = undefined;
		this.movedCallback = undefined;
		Event.stop(a)
	};
	ORYX.Core.MoveDockersCommand = ORYX.Core.Command
			.extend({
				construct : function(a) {
					this.dockers = $H(a);
					this.edges = $H({})
				},
				execute : function() {
					if (this.changes) {
						this.executeAgain();
						return

						

												

						

					} else {
						this.changes = $H({})
					}
					this.dockers.values().each(function(b) {
						var a = b.docker.parent;
						if (!a) {
							return

							

														

							

						}
						if (!this.changes[a.getId()]) {
							this.changes[a.getId()] = {
								edge : a,
								oldDockerPositions : a.dockers.map(function(c) {
									return c.bounds.center()
								})
							}
						}
						b.docker.bounds.moveBy(b.offset);
						this.edges[a.getId()] = a;
						b.docker.update()
					}.bind(this));
					this.edges
							.each(function(a) {
								this.updateEdge(a.value);
								if (this.changes[a.value.getId()]) {
									this.changes[a.value.getId()].dockerPositions = a.value.dockers
											.map(function(b) {
												return b.bounds.center()
											})
								}
							}.bind(this))
				},
				updateEdge : function(a) {
					a._update(true);
					[ a.getOutgoingShapes(), a.getIncomingShapes() ].flatten()
							.invoke("_update", [ true ])
				},
				executeAgain : function() {
					this.changes.values().each(function(a) {
						this.removeAllDocker(a.edge);
						a.dockerPositions.each(function(d, b) {
							if (b == 0 || b == a.dockerPositions.length - 1) {
								return

								

																

								

							}
							var c = a.edge.createDocker(undefined, d);
							c.bounds.centerMoveTo(d);
							c.update()
						}.bind(this));
						this.updateEdge(a.edge)
					}.bind(this))
				},
				rollback : function() {
					this.changes
							.values()
							.each(
									function(a) {
										this.removeAllDocker(a.edge);
										a.oldDockerPositions
												.each(function(d, b) {
													if (b == 0
															|| b == a.oldDockerPositions.length - 1) {
														return

														

																												

														

													}
													var c = a.edge
															.createDocker(
																	undefined,
																	d);
													c.bounds.centerMoveTo(d);
													c.update()
												}.bind(this));
										this.updateEdge(a.edge)
									}.bind(this))
				},
				removeAllDocker : function(a) {
					a.dockers.slice(1, a.dockers.length - 1).each(function(b) {
						a.removeDocker(b)
					})
				}
			})
}();
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.Shape = {
	construct : function(a, c, b) {
		arguments.callee.$.construct.apply(this, arguments);
		this.facade = b;
		this.dockers = [];
		this.magnets = [];
		this._defaultMagnet;
		this.incoming = [];
		this.outgoing = [];
		this.nodes = [];
		this._dockerChangedCallback = this._dockerChanged.bind(this);
		this._labels = new Hash();
		this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg", null, [
				"g", {
					id : "svg-" + this.resourceId
				}, [ "g", {
					"class" : "stencils"
				}, [ "g", {
					"class" : "me"
				} ], [ "g", {
					"class" : "children",
					style : "overflow:hidden"
				} ], [ "g", {
					"class" : "edge"
				} ] ], [ "g", {
					"class" : "controls"
				}, [ "g", {
					"class" : "dockers"
				} ], [ "g", {
					"class" : "magnets"
				} ] ] ])
	},
	update : function() {
	},
	_update : function() {
	},
	refresh : function() {
		arguments.callee.$.refresh.apply(this, arguments);
		if (this.node.ownerDocument) {
			var a = this;
			this.propertiesChanged
					.each((function(b) {
						if (b.value) {
							var e = this.properties[b.key];
							var d = this.getStencil().property(b.key);
							if (d != undefined) {
								this.propertiesChanged[b.key] = false;
								if (d.type() == ORYX.CONFIG.TYPE_CHOICE) {
									d.refToView().each((function(g) {
										if (g !== "") {
											var f = this._labels[this.id + g];
											if (f && d.item(e)) {
												f.text(d.item(e).title())
											}
										}
									}).bind(this));
									var c = new Hash();
									d
											.items()
											.each(
													(function(f) {
														f
																.refToView()
																.each(
																		(function(
																				g) {
																			if (g == "") {
																				return

																				

																																								

																				

																			}
																			var h = this.node.ownerDocument
																					.getElementById(this.id
																							+ g);
																			if (!h) {
																				return

																				

																																								

																				

																			}
																			if (!c[h.id]
																					|| e == f
																							.value()) {
																				h
																						.setAttributeNS(
																								null,
																								"display",
																								((e == f
																										.value()) ? "inherit"
																										: "none"));
																				c[h.id] = h
																			}
																			if (ORYX.Editor
																					.checkClassType(
																							h,
																							SVGImageElement)) {
																				h
																						.setAttributeNS(
																								"http://www.w3.org/1999/xlink",
																								"href",
																								h
																										.getAttributeNS(
																												"http://www.w3.org/1999/xlink",
																												"href"))
																			}
																		})
																				.bind(this))
													}).bind(this))
								} else {
									d
											.refToView()
											.each(
													(function(h) {
														if (h === "") {
															return

															

																														

															

														}
														var g = this.id + h;
														if (d.type() === ORYX.CONFIG.TYPE_KISBPM_MULTIINSTANCE) {
															if (h === "multiinstance") {
																var l = this.node.ownerDocument
																		.getElementById(this.id
																				+ "parallel");
																if (l) {
																	if (e === "Parallel") {
																		l
																				.setAttributeNS(
																						null,
																						"display",
																						"inherit")
																	} else {
																		l
																				.setAttributeNS(
																						null,
																						"display",
																						"none")
																	}
																}
																var o = this.node.ownerDocument
																		.getElementById(this.id
																				+ "sequential");
																if (o) {
																	if (e === "Sequential") {
																		o
																				.setAttributeNS(
																						null,
																						"display",
																						"inherit")
																	} else {
																		o
																				.setAttributeNS(
																						null,
																						"display",
																						"none")
																	}
																}
															}
															return

															

																														

															

														} else {
															if (d.type() === "cancelactivity") {
																var s = this.node.ownerDocument
																		.getElementById(this.id
																				+ "frame");
																var t = this.node.ownerDocument
																		.getElementById(this.id
																				+ "frame2");
																if (e === "true") {
																	s
																			.setAttributeNS(
																					null,
																					"display",
																					"inherit");
																	t
																			.setAttributeNS(
																					null,
																					"display",
																					"inherit")
																} else {
																	s
																			.setAttributeNS(
																					null,
																					"display",
																					"none");
																	t
																			.setAttributeNS(
																					null,
																					"display",
																					"none")
																}
															}
														}
														var k = this.node.ownerDocument
																.getElementById(g);
														if (!k
																|| !(k.ownerSVGElement)) {
															if (d.type() === ORYX.CONFIG.TYPE_URL
																	|| d.type() === ORYX.CONFIG.TYPE_DIAGRAM_LINK) {
																var r = this.node.ownerDocument
																		.getElementsByTagNameNS(
																				"http://www.w3.org/2000/svg",
																				"a");
																k = $A(r)
																		.find(
																				function(
																						u) {
																					return u
																							.getAttributeNS(
																									null,
																									"id") === g
																				});
																if (!k) {
																	return

																	

																																		

																	

																}
															} else {
																return

																

																																

																

															}
														}
														if (d
																.complexAttributeToView()) {
															var p = this._labels[g];
															if (p) {
																try {
																	propJson = e
																			.evalJSON();
																	var q = propJson[d
																			.complexAttributeToView()];
																	p
																			.text(q ? q
																					: e)
																} catch (m) {
																	p.text(e)
																}
															}
														} else {
															switch (d.type()) {
															case ORYX.CONFIG.TYPE_BOOLEAN:
																if (typeof e == "string") {
																	e = e === "true"
																}
																k
																		.setAttributeNS(
																				null,
																				"display",
																				(!(e === d
																						.inverseBoolean())) ? "inherit"
																						: "none");
																break;
															case ORYX.CONFIG.TYPE_COLOR:
																if (d.fill()) {
																	if (k.tagName
																			.toLowerCase() === "stop") {
																		if (e) {
																			if (d
																					.lightness()
																					&& d
																							.lightness() !== 1) {
																				e = ORYX.Utils
																						.adjustLightness(
																								e,
																								d
																										.lightness())
																			}
																			k
																					.setAttributeNS(
																							null,
																							"stop-color",
																							e);
																			if (k.parentNode.tagName
																					.toLowerCase() === "radialgradient") {
																				ORYX.Utils
																						.adjustGradient(
																								k.parentNode,
																								k)
																			}
																		}
																		if (k.parentNode.tagName
																				.toLowerCase() === "radialgradient") {
																			$A(
																					k.parentNode
																							.getElementsByTagName("stop"))
																					.each(
																							function(
																									u) {
																								u
																										.setAttributeNS(
																												null,
																												"stop-opacity",
																												e ? u
																														.getAttributeNS(
																																ORYX.CONFIG.NAMESPACE_ORYX,
																																"default-stop-opacity") || 1
																														: 0)
																							}
																									.bind(this))
																		}
																	} else {
																		k
																				.setAttributeNS(
																						null,
																						"fill",
																						e)
																	}
																}
																if (d.stroke()) {
																	k
																			.setAttributeNS(
																					null,
																					"stroke",
																					e)
																}
																break;
															case ORYX.CONFIG.TYPE_STRING:
																var p = this._labels[g];
																if (p) {
																	p.text(e)
																}
																break;
															case ORYX.CONFIG.TYPE_EXPRESSION:
																var p = this._labels[g];
																if (p) {
																	p.text(e)
																}
																break;
															case ORYX.CONFIG.TYPE_DATASOURCE:
																var p = this._labels[g];
																if (p) {
																	p.text(e)
																}
																break;
															case ORYX.CONFIG.TYPE_INTEGER:
																var p = this._labels[g];
																if (p) {
																	p.text(e)
																}
																break;
															case ORYX.CONFIG.TYPE_FLOAT:
																if (d
																		.fillOpacity()) {
																	k
																			.setAttributeNS(
																					null,
																					"fill-opacity",
																					e)
																}
																if (d
																		.strokeOpacity()) {
																	k
																			.setAttributeNS(
																					null,
																					"stroke-opacity",
																					e)
																}
																if (!d
																		.fillOpacity()
																		&& !d
																				.strokeOpacity()) {
																	var p = this._labels[g];
																	if (p) {
																		p
																				.text(e)
																	}
																}
																break;
															case ORYX.CONFIG.TYPE_FORM_LINK:
																if (h == "pimg") {
																	var n = k
																			.getAttributeNodeNS(
																					"",
																					"onclick");
																	if (n) {
																		if (e
																				&& ("" + e).length > 0) {
																			n.textContent = "window.location = '../service/editor?id="
																					+ e
																					+ "_form'"
																		} else {
																			newFormFacade = this.facade;
																			n.textContent = "displayNewFormDialog('"
																					+ this.resourceId
																					+ "');"
																		}
																	}
																} else {
																	if (h == "linkIndicator") {
																		if (e
																				&& e.length > 0) {
																			k
																					.setAttributeNS(
																							null,
																							"display",
																							"inherit")
																		} else {
																			k
																					.setAttributeNS(
																							null,
																							"display",
																							"none")
																		}
																	}
																}
																break;
															case ORYX.CONFIG.TYPE_URL:
															case ORYX.CONFIG.TYPE_DIAGRAM_LINK:
																var f = k
																		.getAttributeNodeNS(
																				"http://www.w3.org/1999/xlink",
																				"xlink:href");
																if (f) {
																	f.textContent = e
																} else {
																	k
																			.setAttributeNS(
																					"http://www.w3.org/1999/xlink",
																					"xlink:href",
																					e)
																}
																break
															}
														}
													}).bind(this))
								}
							}
						}
					}).bind(this));
			this._labels.values().each(function(b) {
				b.update()
			})
		}
	},
	layout : function() {
		var a = this.getStencil().layout();
		if (a) {
			a.each(function(b) {
				b.shape = this;
				b.forceExecution = true;
				this._delegateEvent(b)
			}.bind(this))
		}
	},
	getLabels : function() {
		return this._labels.values()
	},
	getLabel : function(a) {
		if (!a) {
			return null
		}
		return (this._labels.find(function(b) {
			return b.key.endsWith(a)
		}) || {}).value || null
	},
	hideLabels : function() {
		this.getLabels().invoke("hide")
	},
	showLabels : function() {
		var a = this.getLabels();
		a.invoke("show");
		a.each(function(b) {
			b.update()
		})
	},
	setOpacity : function(b, a) {
		b = Math.max(Math.min((typeof b == "number" ? b : 1), 1), 0);
		if (b !== 1) {
			b = String(b);
			this.node.setAttributeNS(null, "fill-opacity", b);
			this.node.setAttributeNS(null, "stroke-opacity", b)
		} else {
			this.node.removeAttributeNS(null, "fill-opacity");
			this.node.removeAttributeNS(null, "stroke-opacity")
		}
	},
	getDockers : function() {
		return this.dockers
	},
	getMagnets : function() {
		return this.magnets
	},
	getDefaultMagnet : function() {
		if (this._defaultMagnet) {
			return this._defaultMagnet
		} else {
			if (this.magnets.length > 0) {
				return this.magnets[0]
			} else {
				return undefined
			}
		}
	},
	getParentShape : function() {
		return this.parent
	},
	getIncomingShapes : function(a) {
		if (a) {
			this.incoming.each(a)
		}
		return this.incoming
	},
	getIncomingNodes : function(a) {
		return this.incoming.select(function(b) {
			var c = (b instanceof ORYX.Core.Node);
			if (c && a) {
				a(b)
			}
			return c
		})
	},
	getOutgoingShapes : function(a) {
		if (a) {
			this.outgoing.each(a)
		}
		return this.outgoing
	},
	getOutgoingNodes : function(a) {
		return this.outgoing.select(function(b) {
			var c = (b instanceof ORYX.Core.Node);
			if (c && a) {
				a(b)
			}
			return c
		})
	},
	getAllDockedShapes : function(b) {
		var a = this.incoming.concat(this.outgoing);
		if (b) {
			a.each(b)
		}
		return a
	},
	getCanvas : function() {
		if (this.parent instanceof ORYX.Core.Canvas) {
			return this.parent
		} else {
			if (this.parent instanceof ORYX.Core.Shape) {
				return this.parent.getCanvas()
			} else {
				return undefined
			}
		}
	},
	getChildNodes : function(b, c) {
		if (!b && !c) {
			return this.nodes.clone()
		} else {
			var a = [];
			this.nodes.each(function(d) {
				if (!d.isVisible) {
					return

					

										

					

				}
				if (c) {
					c(d)
				}
				a.push(d);
				if (b && d instanceof ORYX.Core.Shape) {
					a = a.concat(d.getChildNodes(b, c))
				}
			});
			return a
		}
	},
	add : function(b, d, c) {
		if (b instanceof ORYX.Core.UIObject && !(b instanceof ORYX.Core.Edge)) {
			if (!(this.children.member(b))) {
				if (b.parent) {
					b.parent.remove(b, true)
				}
				if (d != undefined) {
					this.children.splice(d, 0, b)
				} else {
					this.children.push(b)
				}
				b.parent = this;
				var e;
				if (b instanceof ORYX.Core.Node) {
					e = this.node.childNodes[0].childNodes[1];
					this.nodes.push(b)
				} else {
					if (b instanceof ORYX.Core.Controls.Control) {
						var a = this.node.childNodes[1];
						if (b instanceof ORYX.Core.Controls.Docker) {
							e = a.childNodes[0];
							if (this.dockers.length >= 2) {
								this.dockers.splice(d !== undefined ? Math.min(
										d, this.dockers.length - 1)
										: this.dockers.length - 1, 0, b)
							} else {
								this.dockers.push(b)
							}
						} else {
							if (b instanceof ORYX.Core.Controls.Magnet) {
								e = a.childNodes[1];
								this.magnets.push(b)
							} else {
								e = a
							}
						}
					} else {
						e = this.node
					}
				}
				if (d != undefined && d < e.childNodes.length) {
					b.node = e.insertBefore(b.node, e.childNodes[d])
				} else {
					b.node = e.appendChild(b.node)
				}
				this._changed();
				if (this.eventHandlerCallback && c !== true) {
					this.eventHandlerCallback({
						type : ORYX.CONFIG.EVENT_SHAPEADDED,
						shape : b
					})
				}
			} else {
				ORYX.Log
						.warn("add: ORYX.Core.UIObject is already a child of this object.")
			}
		} else {
			ORYX.Log.warn("add: Parameter is not of type ORYX.Core.UIObject.")
		}
	},
	remove : function(a, b) {
		if (this.children.member(a)) {
			var c = a.parent;
			this.children = this.children.without(a);
			a.parent = undefined;
			if (a instanceof ORYX.Core.Shape) {
				if (a instanceof ORYX.Core.Edge) {
					a.removeMarkers();
					a.node = this.node.childNodes[0].childNodes[2]
							.removeChild(a.node)
				} else {
					a.node = this.node.childNodes[0].childNodes[1]
							.removeChild(a.node);
					this.nodes = this.nodes.without(a)
				}
			} else {
				if (a instanceof ORYX.Core.Controls.Control) {
					if (a instanceof ORYX.Core.Controls.Docker) {
						a.node = this.node.childNodes[1].childNodes[0]
								.removeChild(a.node);
						this.dockers = this.dockers.without(a)
					} else {
						if (a instanceof ORYX.Core.Controls.Magnet) {
							a.node = this.node.childNodes[1].childNodes[1]
									.removeChild(a.node);
							this.magnets = this.magnets.without(a)
						} else {
							a.node = this.node.childNodes[1]
									.removeChild(a.node)
						}
					}
				}
			}
			if (this.eventHandlerCallback && b !== true) {
				this.eventHandlerCallback({
					type : ORYX.CONFIG.EVENT_SHAPEREMOVED,
					shape : a,
					parent : c
				})
			}
			this._changed()
		} else {
			ORYX.Log
					.warn("remove: ORYX.Core.UIObject is not a child of this object.")
		}
	},
	getIntersectionPoint : function() {
		var p, o, h, g;
		switch (arguments.length) {
		case 2:
			p = arguments[0].x;
			o = arguments[0].y;
			h = arguments[1].x;
			g = arguments[1].y;
			break;
		case 4:
			p = arguments[0];
			o = arguments[1];
			h = arguments[2];
			g = arguments[3];
			break;
		default:
			throw "getIntersectionPoints needs two or four arguments"
		}
		var d, b, e, c;
		var a = this.absoluteBounds();
		if (this.isPointIncluded(p, o, a)) {
			d = p;
			b = o
		} else {
			e = p;
			c = o
		}
		if (this.isPointIncluded(h, g, a)) {
			d = h;
			b = g
		} else {
			e = h;
			c = g
		}
		if (!d || !b || !e || !c) {
			return undefined
		}
		var n = 0;
		var m = 0;
		var r, q;
		var l = 1;
		var k = 0;
		while (true) {
			var n = Math.min(d, e) + ((Math.max(d, e) - Math.min(d, e)) / 2);
			var m = Math.min(b, c) + ((Math.max(b, c) - Math.min(b, c)) / 2);
			if (this.isPointIncluded(n, m, a)) {
				d = n;
				b = m
			} else {
				e = n;
				c = m
			}
			var f = Math.sqrt(Math.pow(d - e, 2) + Math.pow(b - c, 2));
			r = d + ((e - d) / f), q = b + ((c - b) / f);
			if (!this.isPointIncluded(r, q, a)) {
				break
			}
		}
		return {
			x : r,
			y : q
		}
	},
	isPointIncluded : function() {
		return false
	},
	containsNode : function(b) {
		var a = this.node.firstChild.firstChild;
		while (b) {
			if (b == a) {
				return true
			}
			b = b.parentNode
		}
		return false
	},
	isPointOverOffset : function() {
		return this.isPointIncluded.apply(this, arguments)
	},
	_dockerChanged : function() {
	},
	createDocker : function(b, a) {
		var c = new ORYX.Core.Controls.Docker({
			eventHandlerCallback : this.eventHandlerCallback
		});
		c.bounds.registerCallback(this._dockerChangedCallback);
		if (a) {
			c.bounds.centerMoveTo(a)
		}
		this.add(c, b);
		return c
	},
	serialize : function() {
		var a = arguments.callee.$.serialize.apply(this);
		a.push({
			name : "bounds",
			prefix : "oryx",
			value : this.bounds.serializeForERDF(),
			type : "literal"
		});
		this.getOutgoingShapes().each((function(b) {
			a.push({
				name : "outgoing",
				prefix : "raziel",
				value : "#" + ERDF.__stripHashes(b.resourceId),
				type : "resource"
			})
		}).bind(this));
		a.push({
			name : "parent",
			prefix : "raziel",
			value : "#" + ERDF.__stripHashes(this.parent.resourceId),
			type : "resource"
		});
		return a
	},
	deserialize : function(d, c) {
		arguments.callee.$.deserialize.apply(this, arguments);
		var e = d.find(function(b) {
			return "oryx-bounds" === (b.prefix + "-" + b.name)
		});
		if (e) {
			var a = e.value.replace(/,/g, " ").split(" ").without("");
			if (this instanceof ORYX.Core.Edge) {
				if (!this.dockers.first().isChanged) {
					this.dockers.first().bounds.centerMoveTo(parseFloat(a[0]),
							parseFloat(a[1]))
				}
				if (!this.dockers.last().isChanged) {
					this.dockers.last().bounds.centerMoveTo(parseFloat(a[2]),
							parseFloat(a[3]))
				}
			} else {
				this.bounds.set(parseFloat(a[0]), parseFloat(a[1]),
						parseFloat(a[2]), parseFloat(a[3]))
			}
		}
		if (c && c.labels instanceof Array) {
			c.labels.each(function(b) {
				var f = this.getLabel(b.ref);
				if (f) {
					f.deserialize(b, this)
				}
			}.bind(this))
		}
	},
	toJSON : function() {
		var a = arguments.callee.$.toJSON.apply(this, arguments);
		var c = [], b = this.id;
		this._labels.each(function(e) {
			var d = e.value.serialize();
			if (d) {
				d.ref = e.key.replace(b, "");
				c.push(d)
			}
		});
		if (c.length > 0) {
			a.labels = c
		}
		return a
	},
	_init : function(a) {
		this._adjustIds(a, 0)
	},
	_adjustIds : function(c, e) {
		if (c instanceof Element) {
			var a = c.getAttributeNS(null, "id");
			if (a && a !== "") {
				c.setAttributeNS(null, "id", this.id + a)
			} else {
				c.setAttributeNS(null, "id", this.id + "_" + this.id + "_" + e);
				e++
			}
			var d = c.getAttributeNS(null, "fill");
			if (d && d.include("url(#")) {
				d = d.replace(/url\(#/g, "url(#" + this.id);
				c.setAttributeNS(null, "fill", d)
			}
			if (c.hasChildNodes()) {
				for (var b = 0; b < c.childNodes.length; b++) {
					e = this._adjustIds(c.childNodes[b], e)
				}
			}
		}
		return e
	},
	toString : function() {
		return "ORYX.Core.Shape " + this.getId()
	}
};
ORYX.Core.Shape = ORYX.Core.AbstractShape.extend(ORYX.Core.Shape);
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.Controls) {
	ORYX.Core.Controls = {}
}
ORYX.Core.Controls.Control = ORYX.Core.UIObject.extend({
	toString : function() {
		return "Control " + this.id
	}
});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.Controls) {
	ORYX.Core.Controls = {}
}
ORYX.Core.Controls.Docker = ORYX.Core.Controls.Control
		.extend({
			construct : function() {
				arguments.callee.$.construct.apply(this, arguments);
				this.isMovable = true;
				this.bounds.set(0, 0, 16, 16);
				this.referencePoint = undefined;
				this._dockedShapeBounds = undefined;
				this._dockedShape = undefined;
				this._oldRefPoint1 = undefined;
				this._oldRefPoint2 = undefined;
				this.anchorLeft;
				this.anchorRight;
				this.anchorTop;
				this.anchorBottom;
				this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg",
						null, [ "g" ]);
				this._dockerNode = ORYX.Editor.graft(
						"http://www.w3.org/2000/svg", this.node, [ "g", {
							"pointer-events" : "all"
						}, [ "circle", {
							cx : "8",
							cy : "8",
							r : "8",
							stroke : "none",
							fill : "none"
						} ], [ "circle", {
							cx : "8",
							cy : "8",
							r : "3",
							stroke : "black",
							fill : "red",
							"stroke-width" : "1"
						} ] ]);
				this._referencePointNode = ORYX.Editor.graft(
						"http://www.w3.org/2000/svg", this.node, [ "g", {
							"pointer-events" : "none"
						}, [ "circle", {
							cx : this.bounds.upperLeft().x,
							cy : this.bounds.upperLeft().y,
							r : 3,
							fill : "red",
							"fill-opacity" : 0.4
						} ] ]);
				this.hide();
				this.addEventHandlers(this._dockerNode);
				this._updateCallback = this._changed.bind(this)
			},
			update : function() {
				if (this._dockedShape) {
					if (this._dockedShapeBounds
							&& this._dockedShape instanceof ORYX.Core.Node) {
						var g = this._dockedShapeBounds.width();
						var d = this._dockedShapeBounds.height();
						if (!g) {
							g = 1
						}
						if (!d) {
							d = 1
						}
						var o = this._dockedShape.bounds.width() / g;
						var m = this._dockedShape.bounds.height() / d;
						if (o !== 1 || m !== 1) {
							this.referencePoint.x *= o;
							this.referencePoint.y *= m
						}
						this._dockedShapeBounds = this._dockedShape.bounds
								.clone()
					}
					var b = this.parent.dockers.indexOf(this);
					var f = this;
					var e = this.parent.dockers.length > 1 ? (b === 0 ? this.parent.dockers[b + 1]
							: this.parent.dockers[b - 1])
							: undefined;
					var n = f.getDockedShape() ? f.getAbsoluteReferencePoint()
							: f.bounds.center();
					var k = e && e.getDockedShape() ? e
							.getAbsoluteReferencePoint() : e ? e.bounds
							.center() : undefined;
					if (!k) {
						var a = this._dockedShape.absoluteCenterXY();
						var l = this._dockedShape.bounds.width()
								* this._dockedShape.bounds.height();
						k = {
							x : n.x + (a.x - n.x) * -l,
							y : n.y + (a.y - n.y) * -l
						}
					}
					var c = undefined;
					c = this._dockedShape.getIntersectionPoint(n, k);
					if (!c) {
						c = this.getAbsoluteReferencePoint()
					}
					if (this.parent && this.parent.parent) {
						var h = this.parent.parent.absoluteXY();
						c.x -= h.x;
						c.y -= h.y
					}
					this.bounds.centerMoveTo(c);
					this._oldRefPoint1 = n;
					this._oldRefPoint2 = k
				}
				arguments.callee.$.update.apply(this, arguments)
			},
			refresh : function() {
				arguments.callee.$.refresh.apply(this, arguments);
				var a = this.bounds.upperLeft();
				this._dockerNode.setAttributeNS(null, "transform", "translate("
						+ a.x + ", " + a.y + ")");
				a = Object.clone(this.referencePoint);
				if (a && this._dockedShape) {
					var b;
					if (this.parent instanceof ORYX.Core.Edge) {
						b = this._dockedShape.absoluteXY()
					} else {
						b = this._dockedShape.bounds.upperLeft()
					}
					a.x += b.x;
					a.y += b.y
				} else {
					a = this.bounds.center()
				}
				this._referencePointNode.setAttributeNS(null, "transform",
						"translate(" + a.x + ", " + a.y + ")")
			},
			setReferencePoint : function(a) {
				if (this.referencePoint !== a
						&& (!this.referencePoint || !a
								|| this.referencePoint.x !== a.x || this.referencePoint.y !== a.y)) {
					this.referencePoint = a;
					this._changed()
				}
			},
			getAbsoluteReferencePoint : function() {
				if (!this.referencePoint || !this._dockedShape) {
					return undefined
				} else {
					var a = this._dockedShape.absoluteXY();
					return {
						x : this.referencePoint.x + a.x,
						y : this.referencePoint.y + a.y
					}
				}
			},
			setDockedShape : function(b) {
				if (this._dockedShape) {
					this._dockedShape.bounds
							.unregisterCallback(this._updateCallback);
					if (this === this.parent.dockers.first()) {
						this.parent.incoming = this.parent.incoming
								.without(this._dockedShape);
						this._dockedShape.outgoing = this._dockedShape.outgoing
								.without(this.parent)
					} else {
						if (this === this.parent.dockers.last()) {
							this.parent.outgoing = this.parent.outgoing
									.without(this._dockedShape);
							this._dockedShape.incoming = this._dockedShape.incoming
									.without(this.parent)
						}
					}
				}
				this._dockedShape = b;
				this._dockedShapeBounds = undefined;
				var a = undefined;
				if (this._dockedShape) {
					if (this === this.parent.dockers.first()) {
						this.parent.incoming.push(b);
						b.outgoing.push(this.parent)
					} else {
						if (this === this.parent.dockers.last()) {
							this.parent.outgoing.push(b);
							b.incoming.push(this.parent)
						}
					}
					var c = this.bounds;
					var d = b.absoluteXY();
					a = {
						x : c.center().x - d.x,
						y : c.center().y - d.y
					};
					this._dockedShapeBounds = this._dockedShape.bounds.clone();
					this._dockedShape.bounds
							.registerCallback(this._updateCallback);
					this.setDockerColor(ORYX.CONFIG.DOCKER_DOCKED_COLOR)
				} else {
					this.setDockerColor(ORYX.CONFIG.DOCKER_UNDOCKED_COLOR)
				}
				this.setReferencePoint(a);
				this._changed()
			},
			getDockedShape : function() {
				return this._dockedShape
			},
			isDocked : function() {
				return !!this._dockedShape
			},
			setDockerColor : function(a) {
				this._dockerNode.lastChild.setAttributeNS(null, "fill", a)
			},
			preventHiding : function(a) {
				this._preventHiding = Math.max(0, (this._preventHiding || 0)
						+ (a ? 1 : -1))
			},
			hide : function() {
				if (this._preventHiding) {
					return false
				}
				this.node.setAttributeNS(null, "visibility", "hidden");
				this._referencePointNode.setAttributeNS(null, "visibility",
						"hidden");
				this.children.each(function(a) {
					a.hide()
				})
			},
			show : function() {
				this.node.setAttributeNS(null, "visibility", "visible");
				if (this.getDockedShape() instanceof ORYX.Core.Edge) {
					this._referencePointNode.setAttributeNS(null, "visibility",
							"hidden")
				} else {
					this._referencePointNode.setAttributeNS(null, "visibility",
							"visible")
				}
				this.children.each(function(a) {
					a.show()
				})
			},
			toString : function() {
				return "Docker " + this.id
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
if (!ORYX.Core.Controls) {
	ORYX.Core.Controls = {}
}
ORYX.Core.Controls.Magnet = ORYX.Core.Controls.Control.extend({
	construct : function() {
		arguments.callee.$.construct.apply(this, arguments);
		this.anchorLeft;
		this.anchorRight;
		this.anchorTop;
		this.anchorBottom;
		this.bounds.set(0, 0, 16, 16);
		this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg", null, [
				"g", {
					"pointer-events" : "all"
				}, [ "circle", {
					cx : "8",
					cy : "8",
					r : "4",
					stroke : "none",
					fill : "red",
					"fill-opacity" : "0.3"
				} ], ]);
		this.hide()
	},
	update : function() {
		arguments.callee.$.update.apply(this, arguments)
	},
	_update : function() {
		arguments.callee.$.update.apply(this, arguments)
	},
	refresh : function() {
		arguments.callee.$.refresh.apply(this, arguments);
		var a = this.bounds.upperLeft();
		this.node.setAttributeNS(null, "transform", "translate(" + a.x + ", "
				+ a.y + ")")
	},
	show : function() {
		arguments.callee.$.show.apply(this, arguments)
	},
	toString : function() {
		return "Magnet " + this.id
	}
});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.Node = {
	construct : function(a, c, b) {
		arguments.callee.$.construct.apply(this, arguments);
		this.isSelectable = true;
		this.isMovable = true;
		this._dockerUpdated = false;
		this.facade = b;
		this._oldBounds = new ORYX.Core.Bounds();
		this._svgShapes = [];
		this.minimumSize = undefined;
		this.maximumSize = undefined;
		this.isHorizontallyResizable = false;
		this.isVerticallyResizable = false;
		this.dataId = undefined;
		this._init(this._stencil.view());
		this.forcedHeight = -1
	},
	_update : function() {
		this.dockers.invoke("update");
		if (this.isChanged) {
			var c = this.bounds;
			var d = this._oldBounds;
			if (this.isResized) {
				var o = c.width() / d.width();
				var n = c.height() / d.height();
				this._svgShapes.each(function(w) {
					if (w.isHorizontallyResizable) {
						w.width = w.oldWidth * o
					}
					if (w.isVerticallyResizable) {
						w.height = w.oldHeight * n
					}
					var v;
					var s = w.anchorLeft;
					var u = w.anchorRight;
					if (u) {
						v = d.width() - (w.oldX + w.oldWidth);
						if (s) {
							w.width = c.width() - w.x - v
						} else {
							w.x = c.width() - (v + w.width)
						}
					} else {
						if (!s) {
							w.x = o * w.oldX;
							if (!w.isHorizontallyResizable) {
								w.x = w.x + w.width * o / 2 - w.width / 2
							}
						}
					}
					var p = w.anchorTop;
					var t = w.anchorBottom;
					if (t) {
						v = d.height() - (w.oldY + w.oldHeight);
						if (p) {
							w.height = c.height() - w.y - v
						} else {
							if (!w._isYLocked) {
								w.y = c.height() - (v + w.height)
							}
						}
					} else {
						if (!p) {
							w.y = n * w.oldY;
							if (!w.isVerticallyResizable) {
								w.y = w.y + w.height * n / 2 - w.height / 2
							}
						}
					}
				});
				var g = {
					x : 0,
					y : 0
				};
				if (!this.isHorizontallyResizable && c.width() !== d.width()) {
					g.x = d.width() - c.width()
				}
				if (!this.isVerticallyResizable && c.height() !== d.height()) {
					g.y = d.height() - c.height()
				}
				if (g.x !== 0 || g.y !== 0) {
					c.extend(g)
				}
				g = {
					x : 0,
					y : 0
				};
				var e, k;
				if (this.minimumSize) {
					ORYX.Log.debug("Shape (%0)'s min size: (%1x%2)", this,
							this.minimumSize.width, this.minimumSize.height);
					e = this.minimumSize.width - c.width();
					if (e > 0) {
						g.x += e
					}
					k = this.minimumSize.height - c.height();
					if (k > 0) {
						g.y += k
					}
				}
				if (this.maximumSize) {
					ORYX.Log.debug("Shape (%0)'s max size: (%1x%2)", this,
							this.maximumSize.width, this.maximumSize.height);
					e = c.width() - this.maximumSize.width;
					if (e > 0) {
						g.x -= e
					}
					k = c.height() - this.maximumSize.height;
					if (k > 0) {
						g.y -= k
					}
				}
				if (g.x !== 0 || g.y !== 0) {
					c.extend(g)
				}
				var o = c.width() / d.width();
				var n = c.height() / d.height();
				var m, l, q, f, b, a, r;
				this.magnets.each(function(p) {
					m = p.anchorLeft;
					l = p.anchorRight;
					q = p.anchorTop;
					f = p.anchorBottom;
					b = p.bounds.center();
					if (m) {
						a = b.x
					} else {
						if (l) {
							a = c.width() - (d.width() - b.x)
						} else {
							a = b.x * o
						}
					}
					if (q) {
						r = b.y
					} else {
						if (f) {
							r = c.height() - (d.height() - b.y)
						} else {
							r = b.y * n
						}
					}
					if (b.x !== a || b.y !== r) {
						p.bounds.centerMoveTo(a, r)
					}
				});
				this.getLabels().each(
						function(p) {
							if (!p.isAnchorLeft()) {
								if (p.isAnchorRight()) {
									p.setX(c.width() - (d.width() - p.oldX))
								} else {
									p.setX((p.position ? p.position.x : p.x)
											* o)
								}
							}
							if (!p.isAnchorTop()) {
								if (p.isAnchorBottom()) {
									p.setY(c.height() - (d.height() - p.oldY))
								} else {
									p.setY((p.position ? p.position.y : p.y)
											* n)
								}
							}
							if (p.position) {
								if (!p.isOriginAnchorLeft()) {
									if (p.isOriginAnchorRight()) {
										p.setOriginX(c.width()
												- (d.width() - p.oldX))
									} else {
										p.setOriginX(p.x * o)
									}
								}
								if (!p.isOriginAnchorTop()) {
									if (p.isOriginAnchorBottom()) {
										p.setOriginY(c.height()
												- (d.height() - p.oldY))
									} else {
										p.setOriginY(p.y * n)
									}
								}
							}
						});
				var h = this.dockers[0];
				if (h) {
					h.bounds.unregisterCallback(this._dockerChangedCallback);
					if (!this._dockerUpdated) {
						h.bounds.centerMoveTo(this.bounds.center());
						this._dockerUpdated = false
					}
					h.update();
					h.bounds.registerCallback(this._dockerChangedCallback)
				}
				this.isResized = false
			}
			this.refresh();
			this.isChanged = false;
			this._oldBounds = this.bounds.clone()
		}
		this.children.each(function(p) {
			if (!(p instanceof ORYX.Core.Controls.Docker)) {
				p._update()
			}
		});
		if (this.dockers.length > 0 && !this.dockers.first().getDockedShape()) {
			this.dockers.each(function(p) {
				p.bounds.centerMoveTo(this.bounds.center())
			}.bind(this))
		}
	},
	refresh : function() {
		arguments.callee.$.refresh.apply(this, arguments);
		var a = this.bounds.upperLeft().x;
		var b = this.bounds.upperLeft().y;
		this.node.firstChild.setAttributeNS(null, "transform", "translate(" + a
				+ ", " + b + ")");
		this.node.childNodes[1].childNodes[1].setAttributeNS(null, "transform",
				"translate(" + a + ", " + b + ")");
		this._svgShapes.each(function(c) {
			c.update()
		})
	},
	_dockerChanged : function() {
		var a = this.dockers[0];
		this.bounds.centerMoveTo(a.bounds.center());
		this._dockerUpdated = true
	},
	_initSVGShapes : function(c) {
		var a = [];
		try {
			var f = new ORYX.Core.SVG.SVGShape(c);
			a.push(f)
		} catch (d) {
		}
		if (c.hasChildNodes()) {
			for (var b = 0; b < c.childNodes.length; b++) {
				a = a.concat(this._initSVGShapes(c.childNodes[b]))
			}
		}
		return a
	},
	isPointIncluded : function(a, k, c) {
		var h = c && c instanceof ORYX.Core.Bounds ? c : this.absoluteBounds();
		if (!h.isIncluded(a, k)) {
			return false
		} else {
		}
		var e = h.upperLeft();
		var g = a - e.x;
		var f = k - e.y;
		var d = 0;
		do {
			var b = this._svgShapes[d++].isPointIncluded(g, f)
		} while (!b && d < this._svgShapes.length);
		return b
	},
	isPointOverOffset : function(d, c) {
		var b = arguments.callee.$.isPointOverOffset.apply(this, arguments);
		if (b) {
			var a = this.absoluteBounds();
			a.widen(-ORYX.CONFIG.BORDER_OFFSET);
			if (!a.isIncluded(d, c)) {
				return true
			}
		}
		return false
	},
	serialize : function() {
		var a = arguments.callee.$.serialize.apply(this);
		this.dockers.each((function(e) {
			if (e.getDockedShape()) {
				var d = e.referencePoint;
				d = d ? d : e.bounds.center();
				a.push({
					name : "docker",
					prefix : "oryx",
					value : $H(d).values().join(","),
					type : "literal"
				})
			}
		}).bind(this));
		try {
			var b = this.getStencil().serialize();
			if (b.type) {
				b.shape = this;
				b.data = a;
				b.result = undefined;
				b.forceExecution = true;
				this._delegateEvent(b);
				if (b.result) {
					a = b.result
				}
			}
		} catch (c) {
		}
		return a
	},
	deserialize : function(f) {
		arguments.callee.$.deserialize.apply(this, arguments);
		try {
			var a = this.getStencil().deserialize();
			if (a.type) {
				a.shape = this;
				a.data = f;
				a.result = undefined;
				a.forceExecution = true;
				this._delegateEvent(a);
				if (a.result) {
					f = a.result
				}
			}
		} catch (g) {
		}
		var b = f.findAll(function(e) {
			return (e.prefix + "-" + e.name) == "raziel-outgoing"
		});
		b.each((function(h) {
			if (!this.parent) {
				return

				

								

				

			}
			var e = this.getCanvas().getChildShapeByResourceId(h.value);
			if (e) {
				if (e instanceof ORYX.Core.Edge) {
					e.dockers.first().setDockedShape(this);
					e.dockers.first().setReferencePoint(
							e.dockers.first().bounds.center())
				} else {
					if (e.dockers.length > 0) {
						e.dockers.first().setDockedShape(this)
					}
				}
			}
		}).bind(this));
		if (this.dockers.length === 1) {
			var d;
			d = f.find(function(e) {
				return (e.prefix + "-" + e.name === "oryx-dockers")
			});
			if (d) {
				var c = d.value.replace(/,/g, " ").split(" ").without("")
						.without("#");
				if (c.length === 2 && this.dockers[0].getDockedShape()) {
					this.dockers[0].setReferencePoint({
						x : parseFloat(c[0]),
						y : parseFloat(c[1])
					})
				} else {
					this.dockers[0].bounds.centerMoveTo(parseFloat(c[0]),
							parseFloat(c[1]))
				}
			}
		}
	},
	_init : function(n) {
		arguments.callee.$._init.apply(this, arguments);
		var o = n.getElementsByTagName("g")[0];
		var r = n.ownerDocument.createAttribute("title");
		r.nodeValue = this.getStencil().title();
		o.setAttributeNode(r);
		var u = n.ownerDocument.createAttribute("id");
		u.nodeValue = this.id;
		o.setAttributeNode(u);
		var b = this.node.childNodes[0].childNodes[0];
		o = b.appendChild(o);
		this.addEventHandlers(o.parentNode);
		var t = o.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX, "minimumSize");
		if (t) {
			t = t.replace("/,/g", " ");
			var k = t.split(" ");
			k = k.without("");
			if (k.length > 1) {
				this.minimumSize = {
					width : parseFloat(k[0]),
					height : parseFloat(k[1])
				}
			} else {
				this.minimumSize = {
					width : 1,
					height : 1
				}
			}
		}
		var g = o.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX, "maximumSize");
		if (g) {
			g = g.replace("/,/g", " ");
			var l = g.split(" ");
			l = l.without("");
			if (l.length > 1) {
				this.maximumSize = {
					width : parseFloat(l[0]),
					height : parseFloat(l[1])
				}
			}
		}
		if (this.minimumSize
				&& this.maximumSize
				&& (this.minimumSize.width > this.maximumSize.width || this.minimumSize.height > this.maximumSize.height)) {
			throw this + ": Minimum Size must be greater than maxiumSize."
		}
		this._svgShapes = this._initSVGShapes(o);
		var a = {
			x : undefined,
			y : undefined
		};
		var d = {
			x : undefined,
			y : undefined
		};
		var y = this;
		this._svgShapes.each(function(z) {
			a.x = (a.x !== undefined) ? Math.min(a.x, z.x) : z.x;
			a.y = (a.y !== undefined) ? Math.min(a.y, z.y) : z.y;
			d.x = (d.x !== undefined) ? Math.max(d.x, z.x + z.width) : z.x
					+ z.width;
			d.y = (d.y !== undefined) ? Math.max(d.y, z.y + z.height) : z.y
					+ z.height;
			if (z.isHorizontallyResizable) {
				y.isHorizontallyResizable = true;
				y.isResizable = true
			}
			if (z.isVerticallyResizable) {
				y.isVerticallyResizable = true;
				y.isResizable = true
			}
			if (z.anchorTop && z.anchorBottom) {
				y.isVerticallyResizable = true;
				y.isResizable = true
			}
			if (z.anchorLeft && z.anchorRight) {
				y.isHorizontallyResizable = true;
				y.isResizable = true
			}
		});
		this._svgShapes.each(function(z) {
			z.x -= a.x;
			z.y -= a.y;
			z.update()
		});
		var x = a.x;
		var w = a.y;
		d.x -= x;
		d.y -= w;
		a.x = 0;
		a.y = 0;
		if (d.x === 0) {
			d.x = 1
		}
		if (d.y === 0) {
			d.y = 1
		}
		this._oldBounds.set(a, d);
		this.bounds.set(a, d);
		var f = n.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_ORYX, "magnets");
		if (f && f.length > 0) {
			f = $A(f[0].getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_ORYX,
					"magnet"));
			var y = this;
			f
					.each(function(A) {
						var E = new ORYX.Core.Controls.Magnet({
							eventHandlerCallback : y.eventHandlerCallback
						});
						var z = parseFloat(A.getAttributeNS(
								ORYX.CONFIG.NAMESPACE_ORYX, "cx"));
						var F = parseFloat(A.getAttributeNS(
								ORYX.CONFIG.NAMESPACE_ORYX, "cy"));
						E.bounds.centerMoveTo({
							x : z - x,
							y : F - w
						});
						var D = A.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX,
								"anchors");
						if (D) {
							D = D.replace("/,/g", " ");
							D = D.split(" ").without("");
							for (var B = 0; B < D.length; B++) {
								switch (D[B].toLowerCase()) {
								case "left":
									E.anchorLeft = true;
									break;
								case "right":
									E.anchorRight = true;
									break;
								case "top":
									E.anchorTop = true;
									break;
								case "bottom":
									E.anchorBottom = true;
									break
								}
							}
						}
						y.add(E);
						if (!this._defaultMagnet) {
							var C = A.getAttributeNS(
									ORYX.CONFIG.NAMESPACE_ORYX, "default");
							if (C && C.toLowerCase() === "yes") {
								y._defaultMagnet = E
							}
						}
					})
		} else {
			var h = new ORYX.Core.Controls.Magnet();
			h.bounds.centerMoveTo(this.bounds.width() / 2,
					this.bounds.height() / 2);
			this.add(h)
		}
		var s = n.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_ORYX, "docker");
		if (s && s.length > 0) {
			s = s[0];
			var q = this.createDocker();
			var e = parseFloat(s.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX,
					"cx"));
			var c = parseFloat(s.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX,
					"cy"));
			q.bounds.centerMoveTo({
				x : e - x,
				y : c - w
			});
			var p = s.getAttributeNS(ORYX.CONFIG.NAMESPACE_ORYX, "anchors");
			if (p) {
				p = p.replace("/,/g", " ");
				p = p.split(" ").without("");
				for (var v = 0; v < p.length; v++) {
					switch (p[v].toLowerCase()) {
					case "left":
						q.anchorLeft = true;
						break;
					case "right":
						q.anchorRight = true;
						break;
					case "top":
						q.anchorTop = true;
						break;
					case "bottom":
						q.anchorBottom = true;
						break
					}
				}
			}
		}
		var m = o.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG, "text");
		$A(m).each(
				(function(A) {
					var z = new ORYX.Core.SVG.Label({
						textElement : A,
						shapeId : this.id
					});
					z.x -= x;
					z.y -= w;
					this._labels[z.id] = z;
					z.registerOnChange(this.layout.bind(this));
					if (this._stencil.id().indexOf(
							ORYX.CONFIG.FORM_ELEMENT_ID_PREFIX) == 0) {
						z.registerOnChange(this.fitToLabels.bind(this))
					}
				}).bind(this))
	},
	fitToLabels : function() {
		var e = 0;
		this.getLabels().each(function(g) {
			var f = g.getY() + g.getHeight();
			if (f > e) {
				e = f
			}
		});
		var c = this.bounds;
		var b = false;
		if (this.minimumSize) {
			var d = this.minimumSize.height;
			if (e < d && c.height() > d && d > this.forcedHeight) {
				c.set(c.upperLeft().x, c.upperLeft().y, c.lowerRight().x, c
						.upperLeft().y
						+ d);
				b = true
			} else {
				if (e > d && c.height() != e && e > this.forcedHeight) {
					c.set(c.upperLeft().x, c.upperLeft().y, c.lowerRight().x, c
							.upperLeft().y
							+ e);
					b = true
				} else {
					if (c.height() > this.forcedHeight && this.forcedHeight > 0) {
						c.set(c.upperLeft().x, c.upperLeft().y,
								c.lowerRight().x, c.upperLeft().y
										+ this.forcedHeight);
						b = true
					}
				}
			}
		}
		if (b) {
			if (this.facade.getCanvas() != null) {
				this.facade.getCanvas().update()
			}
			if (this.facade.getSelection().member(this)) {
				var a = this.facade.getSelection();
				this.facade.setSelection([]);
				this.facade.setSelection(a)
			}
		}
	},
	createDocker : function() {
		var a = new ORYX.Core.Controls.Docker({
			eventHandlerCallback : this.eventHandlerCallback
		});
		a.bounds.registerCallback(this._dockerChangedCallback);
		this.dockers.push(a);
		a.parent = this;
		a.bounds.registerCallback(this._changedCallback);
		return a
	},
	toString : function() {
		return this._stencil.title() + " " + this.id
	}
};
ORYX.Core.Node = ORYX.Core.Shape.extend(ORYX.Core.Node);
NAMESPACE_SVG = "http://www.w3.org/2000/svg";
NAMESPACE_ORYX = "http://www.b3mn.org/oryx";
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Core) {
	ORYX.Core = {}
}
ORYX.Core.Edge = {
	construct : function(a, d, b) {
		arguments.callee.$.construct.apply(this, arguments);
		this.isMovable = true;
		this.isSelectable = true;
		this._dockerUpdated = false;
		this._markers = new Hash();
		this._paths = [];
		this._interactionPaths = [];
		this._dockersByPath = new Hash();
		this._markersByPath = new Hash();
		this.attachedNodePositionData = new Hash();
		var c = this.node.childNodes[0].childNodes[0];
		c = ORYX.Editor.graft("http://www.w3.org/2000/svg", c, [ "g", {
			"pointer-events" : "painted"
		} ]);
		this.addEventHandlers(c.parentNode);
		this._oldBounds = this.bounds.clone();
		this._init(this._stencil.view());
		if (d instanceof Array) {
			this.deserialize(d)
		}
	},
	_update : function(c) {
		if (this._dockerUpdated || this.isChanged || c) {
			this.dockers.invoke("update");
			if (false && (this.bounds.width() === 0 || this.bounds.height() === 0)) {
				var d = this.bounds.width();
				var q = this.bounds.height();
				this.bounds.extend({
					x : d === 0 ? 2 : 0,
					y : q === 0 ? 2 : 0
				});
				this.bounds.moveBy({
					x : d === 0 ? -1 : 0,
					y : q === 0 ? -1 : 0
				})
			}
			var e = this.bounds.upperLeft();
			var n = this._oldBounds.upperLeft();
			var f = this._oldBounds.width() === 0 ? this.bounds.width()
					: this._oldBounds.width();
			var p = this._oldBounds.height() === 0 ? this.bounds.height()
					: this._oldBounds.height();
			var m = e.x - n.x;
			var k = e.y - n.y;
			var o = (this.bounds.width() / f) || 1;
			var g = (this.bounds.height() / p) || 1;
			this.dockers.each((function(b) {
				b.bounds.unregisterCallback(this._dockerChangedCallback);
				if (!this._dockerUpdated) {
					b.bounds.moveBy(m, k);
					if (o !== 1 || g !== 1) {
						var s = b.bounds.upperLeft().x - e.x;
						var a = b.bounds.upperLeft().y - e.y;
						b.bounds.moveTo(e.x + s * o, e.y + a * g)
					}
				}
				b.update();
				b.bounds.registerCallback(this._dockerChangedCallback)
			}).bind(this));
			if (this._dockerUpdated) {
				var l = this.dockers.first().bounds.center();
				var h = this.dockers.first().bounds.center();
				this.dockers.each((function(b) {
					var a = b.bounds.center();
					l.x = Math.min(l.x, a.x);
					l.y = Math.min(l.y, a.y);
					h.x = Math.max(h.x, a.x);
					h.y = Math.max(h.y, a.y)
				}).bind(this));
				this.bounds.set(Object.clone(l), Object.clone(h))
			}
			e = this.bounds.upperLeft();
			n = this._oldBounds.upperLeft();
			o = (this.bounds.width() / (f || this.bounds.width()));
			g = (this.bounds.height() / (p || this.bounds.height()));
			m = e.x - n.x;
			k = e.y - n.y;
			this
					.getLabels()
					.each(
							function(C) {
								if (C.getReferencePoint()) {
									var w = C.getReferencePoint();
									var K = w.segment.from, b = w.segment.to;
									if (!K || !K.parent || !b || !b.parent) {
										return

										

																				

										

									}
									var J = K.bounds.center(), B = b.bounds
											.center();
									if (J.x === w.segment.fromPosition.x
											&& J.y === w.segment.fromPosition.y
											&& B.x === w.segment.toPosition.x
											&& B.y === w.segment.toPosition.y
											&& !w.dirty) {
										return

										

																				

										

									}
									if (!this.parent.initializingShapes) {
										var L = ORYX.Core.Math
												.getDistanceBetweenTwoPoints(
														w.segment.fromPosition,
														w.segment.toPosition,
														w.intersection);
										var M = ORYX.Core.Math
												.getPointBetweenTwoPoints(J, B,
														isNaN(L) ? 0.5 : L);
										var I = ORYX.Core.Math
												.getOrthogonalIdentityVector(J,
														B);
										var a = Math.abs(I.y) === 1, F = Math
												.abs(I.x) === 1;
										I.x *= w.distance;
										I.y *= w.distance;
										I.x += M.x;
										I.y += M.y;
										var H = a
												&& w.orientation
												&& (w.iorientation || w.orientation)
														.endsWith("r") ? -C
												.getWidth() : 0;
										var G = F
												&& w.orientation
												&& (w.iorientation || w.orientation)
														.startsWith("l") ? -C
												.getHeight() + 2 : 0;
										C.setX(I.x + H);
										C.setY(I.y + G);
										this.updateReferencePointOfLabel(C, M,
												K, b)
									} else {
										var I = ORYX.Core.Math
												.getOrthogonalIdentityVector(J,
														B);
										I.x *= w.distance;
										I.y *= w.distance;
										I.x += w.intersection.x;
										I.y += w.intersection.y;
										C.setX(I.x);
										C.setY(I.y);
										w.segment.fromPosition = J;
										w.segment.toPosition = B
									}
									return

									

																		

									

								}
								if (C.position
										&& !this.parent.initializingShapes) {
									var E = C.position.x + (m * (o || 1));
									if (E > this.bounds.lowerRight().x) {
										E += this.bounds.width()
												- (this.bounds.width() / (o || 1))
									}
									var D = C.position.y + (k * (g || 1));
									if (D > this.bounds.lowerRight().y) {
										D += this.bounds.height()
												- (this.bounds.height() / (g || 1))
									}
									C.setX(E);
									C.setY(D);
									return

									

																		

									

								}
								switch (C.getEdgePosition()) {
								case "starttop":
									var N = this._getAngle(this.dockers[0],
											this.dockers[1]);
									var z = this.dockers.first().bounds
											.center();
									if (N <= 90 || N > 270) {
										C.horizontalAlign("left");
										C.verticalAlign("bottom");
										C.x = z.x + C.getOffsetTop();
										C.y = z.y - C.getOffsetTop();
										C.rotate(360 - N, z)
									} else {
										C.horizontalAlign("right");
										C.verticalAlign("bottom");
										C.x = z.x - C.getOffsetTop();
										C.y = z.y - C.getOffsetTop();
										C.rotate(180 - N, z)
									}
									break;
								case "startmiddle":
									var N = this._getAngle(this.dockers[0],
											this.dockers[1]);
									var z = this.dockers.first().bounds
											.center();
									if (N <= 90 || N > 270) {
										C.horizontalAlign("left");
										C.verticalAlign("bottom");
										C.x = z.x + 2;
										C.y = z.y + 4;
										C.rotate(360 - N, z)
									} else {
										C.horizontalAlign("right");
										C.verticalAlign("bottom");
										C.x = z.x + 1;
										C.y = z.y + 4;
										C.rotate(180 - N, z)
									}
									break;
								case "startbottom":
									var N = this._getAngle(this.dockers[0],
											this.dockers[1]);
									var z = this.dockers.first().bounds
											.center();
									if (N <= 90 || N > 270) {
										C.horizontalAlign("left");
										C.verticalAlign("top");
										C.x = z.x + C.getOffsetBottom();
										C.y = z.y + C.getOffsetBottom();
										C.rotate(360 - N, z)
									} else {
										C.horizontalAlign("right");
										C.verticalAlign("top");
										C.x = z.x - C.getOffsetBottom();
										C.y = z.y + C.getOffsetBottom();
										C.rotate(180 - N, z)
									}
									break;
								case "midtop":
									var v = this.dockers.length;
									if (v % 2 == 0) {
										var N = this._getAngle(
												this.dockers[v / 2 - 1],
												this.dockers[v / 2]);
										var u = this.dockers[v / 2 - 1].bounds
												.center();
										var s = this.dockers[v / 2].bounds
												.center();
										var z = {
											x : (u.x + s.x) / 2,
											y : (u.y + s.y) / 2
										};
										C.horizontalAlign("center");
										C.verticalAlign("bottom");
										C.x = z.x;
										C.y = z.y - C.getOffsetTop();
										if (N <= 90 || N > 270) {
											C.rotate(360 - N, z)
										} else {
											C.rotate(180 - N, z)
										}
									} else {
										var A = parseInt(v / 2);
										var N = this._getAngle(this.dockers[A],
												this.dockers[A + 1]);
										var z = this.dockers[A].bounds.center();
										if (N <= 90 || N > 270) {
											C.horizontalAlign("left");
											C.verticalAlign("bottom");
											C.x = z.x + C.getOffsetTop();
											C.y = z.y - C.getOffsetTop();
											C.rotate(360 - N, z)
										} else {
											C.horizontalAlign("right");
											C.verticalAlign("bottom");
											C.x = z.x - C.getOffsetTop();
											C.y = z.y - C.getOffsetTop();
											C.rotate(180 - N, z)
										}
									}
									break;
								case "midbottom":
									var v = this.dockers.length;
									if (v % 2 == 0) {
										var N = this._getAngle(
												this.dockers[v / 2 - 1],
												this.dockers[v / 2]);
										var u = this.dockers[v / 2 - 1].bounds
												.center();
										var s = this.dockers[v / 2].bounds
												.center();
										var z = {
											x : (u.x + s.x) / 2,
											y : (u.y + s.y) / 2
										};
										C.horizontalAlign("center");
										C.verticalAlign("top");
										C.x = z.x;
										C.y = z.y + C.getOffsetTop();
										if (N <= 90 || N > 270) {
											C.rotate(360 - N, z)
										} else {
											C.rotate(180 - N, z)
										}
									} else {
										var A = parseInt(v / 2);
										var N = this._getAngle(this.dockers[A],
												this.dockers[A + 1]);
										var z = this.dockers[A].bounds.center();
										if (N <= 90 || N > 270) {
											C.horizontalAlign("left");
											C.verticalAlign("top");
											C.x = z.x + C.getOffsetBottom();
											C.y = z.y + C.getOffsetBottom();
											C.rotate(360 - N, z)
										} else {
											C.horizontalAlign("right");
											C.verticalAlign("top");
											C.x = z.x - C.getOffsetBottom();
											C.y = z.y + C.getOffsetBottom();
											C.rotate(180 - N, z)
										}
									}
									break;
								case "endtop":
									var t = this.dockers.length;
									var N = this._getAngle(this.dockers[t - 2],
											this.dockers[t - 1]);
									var z = this.dockers.last().bounds.center();
									if (N <= 90 || N > 270) {
										C.horizontalAlign("right");
										C.verticalAlign("bottom");
										C.x = z.x - C.getOffsetTop();
										C.y = z.y - C.getOffsetTop();
										C.rotate(360 - N, z)
									} else {
										C.horizontalAlign("left");
										C.verticalAlign("bottom");
										C.x = z.x + C.getOffsetTop();
										C.y = z.y - C.getOffsetTop();
										C.rotate(180 - N, z)
									}
									break;
								case "endbottom":
									var t = this.dockers.length;
									var N = this._getAngle(this.dockers[t - 2],
											this.dockers[t - 1]);
									var z = this.dockers.last().bounds.center();
									if (N <= 90 || N > 270) {
										C.horizontalAlign("right");
										C.verticalAlign("top");
										C.x = z.x - C.getOffsetBottom();
										C.y = z.y + C.getOffsetBottom();
										C.rotate(360 - N, z)
									} else {
										C.horizontalAlign("left");
										C.verticalAlign("top");
										C.x = z.x + C.getOffsetBottom();
										C.y = z.y + C.getOffsetBottom();
										C.rotate(180 - N, z)
									}
									break
								}
							}.bind(this));
			this.children.each(function(a) {
				if (a instanceof ORYX.Core.Node) {
					this.calculatePositionOfAttachedChildNode.call(this, a)
				}
			}.bind(this));
			this.refreshAttachedNodes();
			this.refresh();
			this.isChanged = false;
			this._dockerUpdated = false;
			this._oldBounds = this.bounds.clone()
		}
		var r = navigator.userAgent;
		if (navigator.appVersion.indexOf("MSIE 10") !== -1
				|| (r.indexOf("Trident") !== -1 && r.indexOf("rv:11") !== -1)) {
			this.node.parentNode.insertBefore(this.node, this.node)
		}
	},
	movePointToUpperLeftOfNode : function(a, b) {
		a.x -= b.width() / 2;
		a.y -= b.height() / 2
	},
	refreshAttachedNodes : function() {
		this.attachedNodePositionData.values().each(function(a) {
			var d = a.segment.docker1.bounds.center();
			var b = a.segment.docker2.bounds.center();
			this.relativizePoint(d);
			this.relativizePoint(b);
			var c = new Object();
			c.x = d.x + a.relativDistanceFromDocker1 * (b.x - d.x);
			c.y = d.y + a.relativDistanceFromDocker1 * (b.y - d.y);
			this.movePointToUpperLeftOfNode(c, a.node.bounds);
			a.node.bounds.moveTo(c);
			a.node._update()
		}.bind(this))
	},
	calculatePositionOfAttachedChildNode : function(b) {
		var a = new Object();
		a.x = 0;
		a.y = 0;
		if (!this.attachedNodePositionData[b.getId()]) {
			this.attachedNodePositionData[b.getId()] = new Object();
			this.attachedNodePositionData[b.getId()].relativDistanceFromDocker1 = 0;
			this.attachedNodePositionData[b.getId()].node = b;
			this.attachedNodePositionData[b.getId()].segment = new Object();
			this.findEdgeSegmentForNode(b)
		} else {
			if (b.isChanged) {
				this.findEdgeSegmentForNode(b)
			}
		}
	},
	findEdgeSegmentForNode : function(c) {
		var b = this.dockers.length;
		var a = undefined;
		for (i = 1; i < b; i++) {
			var g = this.dockers[i - 1].bounds.center();
			var e = this.dockers[i].bounds.center();
			this.relativizePoint(g);
			this.relativizePoint(e);
			var d = c.bounds.center();
			var f = ORYX.Core.Math.distancePointLinie(g, e, d, true);
			if ((f || f == 0) && ((!a && a != 0) || f < a)) {
				a = f;
				this.attachedNodePositionData[c.getId()].segment.docker1 = this.dockers[i - 1];
				this.attachedNodePositionData[c.getId()].segment.docker2 = this.dockers[i]
			}
			if (!f && !a && a != 0) {
				(ORYX.Core.Math.getDistancePointToPoint(d, g) < ORYX.Core.Math
						.getDistancePointToPoint(d, e)) ? this.attachedNodePositionData[c
						.getId()].relativDistanceFromDocker1 = 0
						: this.attachedNodePositionData[c.getId()].relativDistanceFromDocker1 = 1;
				this.attachedNodePositionData[c.getId()].segment.docker1 = this.dockers[i - 1];
				this.attachedNodePositionData[c.getId()].segment.docker2 = this.dockers[i]
			}
		}
		if (a || a == 0) {
			this.attachedNodePositionData[c.getId()].relativDistanceFromDocker1 = this
					.getLineParameterForPosition(
							this.attachedNodePositionData[c.getId()].segment.docker1,
							this.attachedNodePositionData[c.getId()].segment.docker2,
							c)
		}
	},
	findSegment : function(c) {
		var b = this.dockers.length;
		var a;
		var d = c instanceof ORYX.Core.UIObject ? c.bounds.center() : c;
		for (i = 1; i < b; i++) {
			var g = this.dockers[i - 1].bounds.center();
			var e = this.dockers[i].bounds.center();
			var f = ORYX.Core.Math.distancePointLinie(g, e, d, true);
			if (typeof f == "number" && (a === undefined || f < a.distance)) {
				a = {
					distance : f,
					fromDocker : this.dockers[i - 1],
					toDocker : this.dockers[i]
				}
			}
		}
		return a
	},
	getLineParameterForPosition : function(b, g, d) {
		var f = b.bounds.center();
		var e = g.bounds.center();
		this.relativizePoint(f);
		this.relativizePoint(e);
		var c = ORYX.Core.Math.getPointOfIntersectionPointLine(f, e, d.bounds
				.center(), true);
		if (!c) {
			return 0
		}
		var a = ORYX.Core.Math.getDistancePointToPoint(c, f)
				/ ORYX.Core.Math.getDistancePointToPoint(f, e);
		return a
	},
	relativizePoint : function(a) {
		a.x -= this.bounds.upperLeft().x;
		a.y -= this.bounds.upperLeft().y
	},
	optimizedUpdate : function() {
		var a = function(b) {
			if (!b._dockedShape || !b._dockedShapeBounds) {
				return

				

								

				

			}
			var c = {
				x : b._dockedShape.bounds.a.x - b._dockedShapeBounds.a.x,
				y : b._dockedShape.bounds.a.y - b._dockedShapeBounds.a.y
			};
			b.bounds.moveBy(c);
			b._dockedShapeBounds.moveBy(c)
		};
		a(this.dockers.first());
		a(this.dockers.last());
		this.refresh()
	},
	refresh : function() {
		arguments.callee.$.refresh.apply(this, arguments);
		var b;
		this._paths.each((function(h, f) {
			var e = this._dockersByPath[h.id];
			var l = undefined;
			var k = undefined;
			if (b) {
				k = "M" + b.x + " " + b.y
			} else {
				l = e[0].bounds.center();
				b = l;
				k = "M" + l.x + " " + l.y
			}
			for (var g = 1; g < e.length; g++) {
				l = e[g].bounds.center();
				k = k + "L" + l.x + " " + l.y + " ";
				b = l
			}
			h.setAttributeNS(null, "d", k);
			this._interactionPaths[f].setAttributeNS(null, "d", k)
		}).bind(this));
		if (this.getChildNodes().length > 0) {
			var a = this.bounds.upperLeft().x;
			var c = this.bounds.upperLeft().y;
			this.node.firstChild.childNodes[1].setAttributeNS(null,
					"transform", "translate(" + a + ", " + c + ")")
		}
	},
	getIntersectionPoint : function() {
		var a = Math.floor(this.dockers.length / 2);
		return ORYX.Core.Math.midPoint(this.dockers[a - 1].bounds.center(),
				this.dockers[a].bounds.center())
	},
	isBoundsIncluded : function(c) {
		var a = this.dockers, b = a.length;
		return a.any(function(g, f) {
			if (f == b - 1) {
				return false
			}
			var e = g.bounds.center();
			var d = a[f + 1].bounds.center();
			return ORYX.Core.Math.isRectOverLine(e.x, e.y, d.x, d.y, c.a.x,
					c.a.y, c.b.x, c.b.y)
		})
	},
	isPointIncluded : function(g, f) {
		var a = this.absoluteBounds().isIncluded(g, f,
				ORYX.CONFIG.OFFSET_EDGE_BOUNDS);
		var e = undefined;
		if (a && this.dockers.length > 0) {
			var c = 0;
			var d, b;
			do {
				d = this.dockers[c].bounds.center();
				b = this.dockers[++c].bounds.center();
				e = ORYX.Core.Math.isPointInLine(g, f, d.x, d.y, b.x, b.y,
						ORYX.CONFIG.OFFSET_EDGE_BOUNDS)
			} while (!e && c < this.dockers.length - 1)
		}
		return e
	},
	isPointOverOffset : function() {
		return false
	},
	containsNode : function(a) {
		if (this._paths.include(a) || this._interactionPaths.include(a)) {
			return true
		}
		return false
	},
	_getAngle : function(a, d) {
		var c = a instanceof ORYX.Core.Controls.Docker ? a.absoluteCenterXY()
				: a;
		var b = d instanceof ORYX.Core.Controls.Docker ? d.absoluteCenterXY()
				: d;
		return ORYX.Core.Math.getAngle(c, b)
	},
	alignDockers : function() {
		this._update(true);
		var e = this.dockers.first().bounds.center();
		var d = this.dockers.last().bounds.center();
		var c = d.x - e.x;
		var a = d.y - e.y;
		var b = this.dockers.length - 1;
		this.dockers.each((function(h, g) {
			var f = g / b;
			h.bounds.unregisterCallback(this._dockerChangedCallback);
			h.bounds.moveTo(e.x + f * c, e.y + f * a);
			h.bounds.registerCallback(this._dockerChangedCallback)
		}).bind(this));
		this._dockerChanged()
	},
	add : function(a) {
		arguments.callee.$.add.apply(this, arguments);
		if (a instanceof ORYX.Core.Controls.Docker && this.dockers.include(a)) {
			var b = this._dockersByPath.values()[0];
			if (b) {
				b.splice(this.dockers.indexOf(a), 0, a)
			}
			this.handleChildShapesAfterAddDocker(a)
		}
	},
	handleChildShapesAfterAddDocker : function(f) {
		if (!f instanceof ORYX.Core.Controls.Docker) {
			return undefined
		}
		var d = this.dockers.indexOf(f);
		if (!(0 < d && d < this.dockers.length - 1)) {
			return undefined
		}
		var e = this.dockers[d - 1];
		var b = this.dockers[d + 1];
		var c = this.getAttachedNodePositionDataForSegment(e, b);
		var a = ORYX.Core.Math.getDistancePointToPoint(e.bounds.center(),
				f.bounds.center());
		var h = ORYX.Core.Math.getDistancePointToPoint(b.bounds.center(),
				f.bounds.center());
		if (!(a + h)) {
			return

			

						

			

		}
		var g = a / (a + h);
		c
				.each(function(m) {
					if (m.value.relativDistanceFromDocker1 < g) {
						m.value.segment.docker2 = f;
						m.value.relativDistanceFromDocker1 = m.value.relativDistanceFromDocker1
								/ g
					} else {
						m.value.segment.docker1 = f;
						var l = 1 - g;
						var k = m.value.relativDistanceFromDocker1 - g;
						m.value.relativDistanceFromDocker1 = k / l
					}
				});
		this
				.getLabels()
				.each(
						function(m) {
							var o = m.getReferencePoint();
							if (!o) {
								return

								

																

								

							}
							var l = this.dockers.indexOf(f);
							if (l >= o.segment.fromIndex
									&& l <= o.segment.toIndex) {
								var n = this.findSegment(o.intersection);
								if (!n) {
									n.fromDocker = o.segment.fromIndex >= (this.dockers.length / 2) ? this.dockers[0]
											: this.dockers[this.dockers.length - 2];
									n.toDocker = this.dockers[this.dockers
											.indexOf(from) + 1]
								}
								var k = n.fromDocker.bounds.center(), p = n.toDocker.bounds
										.center();
								var q = ORYX.Core.Math
										.getPointOfIntersectionPointLine(k, p,
												o.intersection, true);
								this.updateReferencePointOfLabel(m, q,
										n.fromDocker, n.toDocker, true)
							}
						}.bind(this));
		this.refreshAttachedNodes()
	},
	getAttachedNodePositionDataForSegment : function(c, a) {
		if (!((c instanceof ORYX.Core.Controls.Docker) && (a instanceof ORYX.Core.Controls.Docker))) {
			return []
		}
		var b = this.attachedNodePositionData.findAll(function(d) {
			return d.value.segment.docker1 === c
					&& d.value.segment.docker2 === a
		});
		if (!b) {
			return []
		}
		return b
	},
	remove : function(a) {
		arguments.callee.$.remove.apply(this, arguments);
		if (this.attachedNodePositionData[a.getId()]) {
			delete this.attachedNodePositionData[a.getId()]
		}
		if (a instanceof ORYX.Core.Controls.Docker) {
			this.handleChildShapesAfterRemoveDocker(a)
		}
	},
	updateReferencePointOfLabel : function(a, g, f, e, b) {
		if (!a.getReferencePoint() || !a.isVisible) {
			return

			

						

			

		}
		var c = a.getReferencePoint();
		if (c.orientation && c.orientation !== "ce") {
			var d = this._getAngle(f, e);
			if (c.distance >= 0) {
				if (d == 0) {
					a.horizontalAlign("left");
					a.verticalAlign("bottom")
				} else {
					if (d > 0 && d < 90) {
						a.horizontalAlign("right");
						a.verticalAlign("bottom")
					} else {
						if (d == 90) {
							a.horizontalAlign("right");
							a.verticalAlign("top")
						} else {
							if (d > 90 && d < 180) {
								a.horizontalAlign("right");
								a.verticalAlign("top")
							} else {
								if (d == 180) {
									a.horizontalAlign("left");
									a.verticalAlign("top")
								} else {
									if (d > 180 && d < 270) {
										a.horizontalAlign("left");
										a.verticalAlign("top")
									} else {
										if (d == 270) {
											a.horizontalAlign("left");
											a.verticalAlign("top")
										} else {
											if (d > 270 && d <= 360) {
												a.horizontalAlign("left");
												a.verticalAlign("bottom")
											}
										}
									}
								}
							}
						}
					}
				}
			} else {
				if (d == 0) {
					a.horizontalAlign("left");
					a.verticalAlign("top")
				} else {
					if (d > 0 && d < 90) {
						a.horizontalAlign("left");
						a.verticalAlign("top")
					} else {
						if (d == 90) {
							a.horizontalAlign("left");
							a.verticalAlign("top")
						} else {
							if (d > 90 && d < 180) {
								a.horizontalAlign("left");
								a.verticalAlign("bottom")
							} else {
								if (d == 180) {
									a.horizontalAlign("left");
									a.verticalAlign("bottom")
								} else {
									if (d > 180 && d < 270) {
										a.horizontalAlign("right");
										a.verticalAlign("bottom")
									} else {
										if (d == 270) {
											a.horizontalAlign("right");
											a.verticalAlign("top")
										} else {
											if (d > 270 && d <= 360) {
												a.horizontalAlign("right");
												a.verticalAlign("top")
											}
										}
									}
								}
							}
						}
					}
				}
			}
			c.iorientation = c.iorientation || c.orientation;
			c.orientation = (a.verticalAlign() == "top" ? "u" : "l")
					+ (a.horizontalAlign() == "left" ? "l" : "r")
		}
		a.setReferencePoint(jQuery.extend({}, {
			intersection : g,
			segment : {
				from : f,
				fromIndex : this.dockers.indexOf(f),
				fromPosition : f.bounds.center(),
				to : e,
				toIndex : this.dockers.indexOf(e),
				toPosition : e.bounds.center()
			},
			dirty : b || false
		}, c))
	},
	handleChildShapesAfterRemoveDocker : function(a) {
		if (!(a instanceof ORYX.Core.Controls.Docker)) {
			return

			

						

			

		}
		this.attachedNodePositionData.each(function(c) {
			if (c.value.segment.docker1 === a) {
				var b = this.dockers.indexOf(c.value.segment.docker2);
				if (b == -1) {
					return

					

										

					

				}
				c.value.segment.docker1 = this.dockers[b - 1]
			} else {
				if (c.value.segment.docker2 === a) {
					var b = this.dockers.indexOf(c.value.segment.docker1);
					if (b == -1) {
						return

						

												

						

					}
					c.value.segment.docker2 = this.dockers[b + 1]
				}
			}
		}.bind(this));
		this.getLabels().each(
				function(b) {
					var d = b.getReferencePoint();
					if (!d) {
						return

						

												

						

					}
					var g = d.segment.from;
					var f = d.segment.to;
					if (g !== a && f !== a) {
						return

						

												

						

					}
					var c = this.findSegment(d.intersection);
					if (!c) {
						g = c.fromDocker;
						f = c.toDocker
					} else {
						g = g === a ? this.dockers[this.dockers.indexOf(f) - 1]
								: g;
						f = this.dockers[this.dockers.indexOf(g) + 1]
					}
					var e = ORYX.Core.Math.getPointOfIntersectionPointLine(
							g.bounds.center(), f.bounds.center(),
							d.intersection, true);
					this.updateReferencePointOfLabel(b, e, g, f, true)
				}.bind(this));
		this.refreshAttachedNodes()
	},
	addDocker : function(b, d) {
		var c;
		var a;
		this._dockersByPath
				.any((function(e) {
					return e.value
							.any((function(h, l) {
								if (!c) {
									c = h;
									return false
								} else {
									var n = c.bounds.center();
									var m = h.bounds.center();
									var f = 1;
									if (!isNaN(screen.logicalXDPI)
											&& !isNaN(screen.systemXDPI)) {
										var g = navigator.userAgent;
										if (g.indexOf("MSIE") >= 0) {
											var p = Math
													.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
											if (p !== 100) {
												f = p / 100
											}
										}
									}
									if (f !== 1) {
										b.x = b.x / f;
										b.y = b.y / f
									}
									if (ORYX.Core.Math.isPointInLine(b.x, b.y,
											n.x, n.y, m.x, m.y, 10)) {
										var q = this._paths.find(function(r) {
											return r.id === e.key
										});
										if (q) {
											var o = q.getAttributeNS(
													NAMESPACE_ORYX,
													"allowDockers");
											if (o && o.toLowerCase() === "no") {
												return true
											}
										}
										var k = (d) ? d : this.createDocker(
												this.dockers.indexOf(c) + 1, b);
										k.bounds.centerMoveTo(b);
										if (d) {
											this
													.add(k, this.dockers
															.indexOf(c) + 1)
										}
										a = k;
										return true
									} else {
										c = h;
										return false
									}
								}
							}).bind(this))
				}).bind(this));
		return a
	},
	removeDocker : function(a) {
		if (this.dockers.length > 2 && !(this.dockers.first() === a)) {
			this._dockersByPath.any((function(b) {
				if (b.value.member(a)) {
					if (a === b.value.last()) {
						return true
					} else {
						this.remove(a);
						this._dockersByPath[b.key] = b.value.without(a);
						this.isChanged = true;
						this._dockerChanged();
						return true
					}
				}
				return false
			}).bind(this))
		}
	},
	removeUnusedDockers : function() {
		var a = $H({});
		this.dockers.each(function(e, b) {
			if (b == 0 || b == this.dockers.length - 1) {
				return

				

								

				

			}
			var d = this.dockers[b - 1];
			if (a.values().indexOf(d) != -1 && this.dockers[b - 2]) {
				d = this.dockers[b - 2]
			}
			var c = this.dockers[b + 1];
			var f = d.getDockedShape() && d.referencePoint ? d
					.getAbsoluteReferencePoint() : d.bounds.center();
			var h = c.getDockedShape() && c.referencePoint ? c
					.getAbsoluteReferencePoint() : c.bounds.center();
			var g = e.bounds.center();
			if (ORYX.Core.Math.isPointInLine(g.x, g.y, f.x, f.y, h.x, h.y, 1)) {
				a[b] = e
			}
		}.bind(this));
		a.each(function(b) {
			this.removeDocker(b.value)
		}.bind(this));
		if (a.values().length > 0) {
			this._update(true)
		}
		return a
	},
	_init : function(f) {
		arguments.callee.$._init.apply(this, arguments);
		var e, c, s, q;
		var k = f.getElementsByTagNameNS(NAMESPACE_SVG, "defs");
		if (k.length > 0) {
			k = k[0];
			var d = $A(k.getElementsByTagNameNS(NAMESPACE_SVG, "marker"));
			var l;
			var o = this;
			d.each(function(t) {
				try {
					l = new ORYX.Core.SVG.SVGMarker(t.cloneNode(true));
					o._markers[l.id] = l;
					var u = $A(l.element.getElementsByTagNameNS(NAMESPACE_SVG,
							"text"));
					var g;
					u.each(function(w) {
						g = new ORYX.Core.SVG.Label({
							textElement : w,
							shapeId : this.id
						});
						o._labels[g.id] = g
					})
				} catch (v) {
				}
			})
		}
		var b = f.getElementsByTagNameNS(NAMESPACE_SVG, "g");
		if (b.length <= 0) {
			throw "Edge: No g element found."
		}
		var m = b[0];
		m.setAttributeNS(null, "id", null);
		var h = true;
		$A(m.childNodes)
				.each(
						(function(G, A) {
							if (ORYX.Editor.checkClassType(G, SVGPathElement)) {
								G = G.cloneNode(false);
								var z = this.id + "_" + A;
								G.setAttributeNS(null, "id", z);
								this._paths.push(G);
								var C = [];
								var H = G.getAttributeNS(null, "marker-start");
								if (H && H !== "") {
									H = H.strip();
									H = H.replace(/^url\(#/, "");
									var w = this.getValidMarkerId(H);
									G.setAttributeNS(null, "marker-start",
											"url(#" + w + ")");
									C.push(this._markers[w])
								}
								H = G.getAttributeNS(null, "marker-mid");
								if (H && H !== "") {
									H = H.strip();
									H = H.replace(/^url\(#/, "");
									var t = this.getValidMarkerId(H);
									G.setAttributeNS(null, "marker-mid",
											"url(#" + t + ")");
									C.push(this._markers[t])
								}
								H = G.getAttributeNS(null, "marker-end");
								if (H && H !== "") {
									H = H.strip();
									var B = this.getValidMarkerId(H);
									G.setAttributeNS(null, "marker-end",
											"url(#" + B + ")");
									C.push(this._markers[B])
								}
								this._markersByPath[z] = C;
								var g = new PathParser();
								var F = new ORYX.Core.SVG.PointsPathHandler();
								g.setHandler(F);
								g.parsePath(G);
								if (F.points.length < 4) {
									throw "Edge: Path has to have two or more points specified."
								}
								this._dockersByPath[z] = [];
								for (var v = 0; v < F.points.length; v += 2) {
									var E = F.points[v];
									var D = F.points[v + 1];
									if (h || v > 0) {
										var u = new ORYX.Core.Controls.Docker(
												{
													eventHandlerCallback : this.eventHandlerCallback
												});
										u.bounds.centerMoveTo(E, D);
										u.bounds
												.registerCallback(this._dockerChangedCallback);
										this.add(u, this.dockers.length);
										if (e) {
											e = Math.min(E, e);
											c = Math.min(D, c)
										} else {
											e = E;
											c = D
										}
										if (s) {
											s = Math.max(E, s);
											q = Math.max(D, q)
										} else {
											s = E;
											q = D
										}
									}
								}
								h = false
							}
						}).bind(this));
		this.bounds.set(e, c, s, q);
		if (false && (this.bounds.width() === 0 || this.bounds.height() === 0)) {
			var a = this.bounds.width();
			var p = this.bounds.height();
			this.bounds.extend({
				x : a === 0 ? 2 : 0,
				y : p === 0 ? 2 : 0
			});
			this.bounds.moveBy({
				x : a === 0 ? -1 : 0,
				y : p === 0 ? -1 : 0
			})
		}
		this._oldBounds = this.bounds.clone();
		this._paths.reverse();
		var r = [];
		this._paths.each((function(g) {
			r.push(this.node.childNodes[0].childNodes[0].childNodes[0]
					.appendChild(g))
		}).bind(this));
		this._paths = r;
		this._paths.each((function(t) {
			var g = t.cloneNode(false);
			g.setAttributeNS(null, "id", undefined);
			g.setAttributeNS(null, "stroke-width", 10);
			g.setAttributeNS(null, "visibility", "hidden");
			g.setAttributeNS(null, "stroke-dasharray", null);
			g.setAttributeNS(null, "stroke", "black");
			g.setAttributeNS(null, "fill", "none");
			g.setAttributeNS(null, "title", this.getStencil().title());
			this._interactionPaths
					.push(this.node.childNodes[0].childNodes[0].childNodes[0]
							.appendChild(g))
		}).bind(this));
		this._paths.reverse();
		this._interactionPaths.reverse();
		var n = f.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG, "text");
		$A(n).each((function(t) {
			var g = new ORYX.Core.SVG.Label({
				textElement : t,
				shapeId : this.id
			});
			this.node.childNodes[0].childNodes[0].appendChild(g.node);
			this._labels[g.id] = g;
			g.registerOnChange(this.layout.bind(this))
		}).bind(this));
		this.propertiesChanged.each(function(g) {
			g.value = true
		})
	},
	getValidMarkerId : function(b) {
		if (b.indexOf('url("#') >= 0) {
			var a = b.replace(/^url\(\"#/, "").replace(/\"\)$/, "");
			return this.id + a
		} else {
			b = b.replace(/^url\(#/, "");
			return this.id.concat(b.replace(/\)$/, ""))
		}
	},
	addMarkers : function(a) {
		this._markers.each(function(b) {
			if (!a.ownerDocument.getElementById(b.value.id)) {
				b.value.element = a.appendChild(b.value.element)
			}
		})
	},
	removeMarkers : function() {
		var b = this.node.ownerSVGElement;
		if (b) {
			var a = b.getElementsByTagNameNS(NAMESPACE_SVG, "defs");
			if (a.length > 0) {
				a = a[0];
				this._markers.each(function(c) {
					var d = a.ownerDocument.getElementById(c.value.id);
					if (d) {
						c.value.element = a.removeChild(c.value.element)
					}
				})
			}
		}
	},
	_dockerChanged : function() {
		this._dockerUpdated = true
	},
	serialize : function() {
		var a = arguments.callee.$.serialize.apply(this);
		var d = "";
		this._dockersByPath
				.each((function(e) {
					e.value
							.each(function(k) {
								var h = k.getDockedShape() && k.referencePoint ? k.referencePoint
										: k.bounds.center();
								d = d.concat(h.x + " " + h.y + " ")
							});
					d += " # "
				}).bind(this));
		a.push({
			name : "dockers",
			prefix : "oryx",
			value : d,
			type : "literal"
		});
		var b = this.dockers.last();
		var g = b.getDockedShape();
		if (g) {
			a.push({
				name : "target",
				prefix : "raziel",
				value : "#" + ERDF.__stripHashes(g.resourceId),
				type : "resource"
			})
		}
		try {
			var c = this.getStencil().serialize();
			if (c.type) {
				c.shape = this;
				c.data = a;
				c.result = undefined;
				c.forceExecution = true;
				this._delegateEvent(c);
				if (c.result) {
					a = c.result
				}
			}
		} catch (f) {
		}
		return a
	},
	deserialize : function(f) {
		try {
			var c = this.getStencil().deserialize();
			if (c.type) {
				c.shape = this;
				c.data = f;
				c.result = undefined;
				c.forceExecution = true;
				this._delegateEvent(c);
				if (c.result) {
					f = c.result
				}
			}
		} catch (h) {
		}
		var g = f.find(function(e) {
			return (e.prefix + "-" + e.name) == "raziel-target"
		});
		var a;
		if (g) {
			a = this.getCanvas().getChildShapeByResourceId(g.value)
		}
		var d = f.findAll(function(e) {
			return (e.prefix + "-" + e.name) == "raziel-outgoing"
		});
		d.each((function(l) {
			if (!this.parent) {
				return

				

								

				

			}
			var e = this.getCanvas().getChildShapeByResourceId(l.value);
			if (e) {
				if (e == a) {
					this.dockers.last().setDockedShape(e);
					this.dockers.last().setReferencePoint({
						x : e.bounds.width() / 2,
						y : e.bounds.height() / 2
					})
				} else {
					if (e instanceof ORYX.Core.Edge) {
						e.dockers.first().setDockedShape(this)
					}
				}
			}
		}).bind(this));
		var b = f.find(function(e) {
			return (e.prefix === "oryx" && e.name === "dockers")
		});
		if (b) {
			var k = b.value.split("#").without("").without(" ");
			k.each((function(l, o) {
				var r = l.replace(/,/g, " ").split(" ").without("");
				if (r.length % 2 === 0) {
					var s = this._paths[o];
					if (s) {
						if (o === 0) {
							while (this._dockersByPath[s.id].length > 2) {
								this.removeDocker(this._dockersByPath[s.id][1])
							}
						} else {
							while (this._dockersByPath[s.id].length > 1) {
								this.removeDocker(this._dockersByPath[s.id][0])
							}
						}
						var e = this._dockersByPath[s.id];
						if (o === 0) {
							var q = parseFloat(r.shift());
							var p = parseFloat(r.shift());
							if (e.first().getDockedShape()) {
								e.first().setReferencePoint({
									x : q,
									y : p
								})
							} else {
								e.first().bounds.centerMoveTo(q, p)
							}
						}
						p = parseFloat(r.pop());
						q = parseFloat(r.pop());
						if (e.last().getDockedShape()) {
							e.last().setReferencePoint({
								x : q,
								y : p
							})
						} else {
							e.last().bounds.centerMoveTo(q, p)
						}
						for (var m = 0; m < r.length; m++) {
							q = parseFloat(r[m]);
							p = parseFloat(r[++m]);
							var n = this.createDocker();
							n.bounds.centerMoveTo(q, p)
						}
					}
				}
			}).bind(this))
		} else {
			this.alignDockers()
		}
		arguments.callee.$.deserialize.apply(this, arguments);
		this._changed()
	},
	toString : function() {
		return this.getStencil().title() + " " + this.id
	},
	getTarget : function() {
		return this.dockers.last() ? this.dockers.last().getDockedShape()
				: null
	},
	getSource : function() {
		return this.dockers.first() ? this.dockers.first().getDockedShape()
				: null
	},
	isDocked : function() {
		var a = false;
		this.dockers.each(function(b) {
			if (b.isDocked()) {
				a = true;
				throw $break
			}
		});
		return a
	},
	toJSON : function() {
		var a = arguments.callee.$.toJSON.apply(this, arguments);
		if (this.getTarget()) {
			a.target = {
				resourceId : this.getTarget().resourceId
			}
		}
		return a
	}
};
ORYX.Core.Edge = ORYX.Core.Shape.extend(ORYX.Core.Edge);
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Plugins) {
	ORYX.Plugins = {}
}
ORYX.Plugins.AbstractPlugin = Clazz
		.extend({
			facade : null,
			construct : function(a) {
				this.facade = a;
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_LOADED,
						this.onLoaded.bind(this))
			},
			onLoaded : function() {
			},
			onSelectionChanged : function() {
			},
			showOverlay : function(a, b, d, c) {
				if (!(a instanceof Array)) {
					a = [ a ]
				}
				a = a.map(
						function(e) {
							var f = e;
							if (typeof e == "string") {
								f = this.facade.getCanvas()
										.getChildShapeByResourceId(e);
								f = f
										|| this.facade.getCanvas()
												.getChildById(e, true)
							}
							return f
						}.bind(this)).compact();
				if (!this.overlayID) {
					this.overlayID = this.type + ORYX.Editor.provideId()
				}
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_OVERLAY_SHOW,
					id : this.overlayID,
					shapes : a,
					attributes : b,
					node : d,
					nodePosition : c || "NW"
				})
			},
			hideOverlay : function() {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_OVERLAY_HIDE,
					id : this.overlayID
				})
			},
			doTransform : function(d, a) {
				if (!a || !d) {
					return ""
				}
				var c = new DOMParser();
				var k = c.parseFromString(d, "text/xml");
				source = a;
				new Ajax.Request(source, {
					asynchronous : false,
					method : "get",
					onSuccess : function(m) {
						xsl = m.responseText
					}.bind(this),
					onFailure : (function(m) {
						ORYX.Log.error("XSL load failed" + m)
					}).bind(this)
				});
				var f = new XSLTProcessor();
				var h = new DOMParser();
				var e = h.parseFromString(xsl, "text/xml");
				f.importStylesheet(e);
				try {
					var l = f.transformToFragment(k, document);
					var b = (new XMLSerializer()).serializeToString(l);
					b = !b.startsWith("<?xml") ? '<?xml version="1.0" encoding="UTF-8"?>'
							+ b
							: b;
					return b
				} catch (g) {
					return -1
				}
			},
			openXMLWindow : function(a) {
				var b = window
						.open("data:application/xml," + encodeURIComponent(a),
								"_blank",
								"resizable=yes,width=600,height=600,toolbar=0,scrollbars=yes")
			},
			openDownloadWindow : function(b, c) {
				var d = window.open("");
				if (d != null) {
					d.document.open();
					d.document.write("<html><body>");
					var a = d.document.createElement("form");
					d.document.body.appendChild(a);
					var e = function(f, g) {
						var h = document.createElement("input");
						h.name = f;
						h.type = "hidden";
						h.value = g;
						return h
					};
					a.appendChild(e("download", c));
					a.appendChild(e("file", b));
					a.method = "POST";
					d.document.write("</body></html>");
					d.document.close();
					a.action = ORYX.PATH + "/download";
					a.submit()
				}
			},
			getSerializedDOM : function() {
				var a = DataManager.serializeDOM(this.facade);
				a = '<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:b3mn="http://b3mn.org/2007/b3mn" xmlns:ext="http://b3mn.org/2007/ext" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:atom="http://b3mn.org/2007/atom+xhtml"><head profile="http://purl.org/NET/erdf/profile"><link rel="schema.dc" href="http://purl.org/dc/elements/1.1/" /><link rel="schema.dcTerms" href="http://purl.org/dc/terms/ " /><link rel="schema.b3mn" href="http://b3mn.org" /><link rel="schema.oryx" href="http://oryx-editor.org/" /><link rel="schema.raziel" href="http://raziel.org/" /><base href="'
						+ location.href.split("?")[0]
						+ '" /></head><body>'
						+ a
						+ "</body></html>";
				return a
			},
			enableReadOnlyMode : function() {
				this.facade.disableEvent(ORYX.CONFIG.EVENT_MOUSEDOWN);
				this._stopSelectionChange = function() {
					if (this.facade.getSelection().length > 0) {
						this.facade.setSelection([])
					}
				};
				this.facade.registerOnEvent(
						ORYX.CONFIG.EVENT_SELECTION_CHANGED,
						this._stopSelectionChange.bind(this))
			},
			disableReadOnlyMode : function() {
				this.facade.enableEvent(ORYX.CONFIG.EVENT_MOUSEDOWN);
				if (this._stopSelectionChange) {
					this.facade.unregisterOnEvent(
							ORYX.CONFIG.EVENT_SELECTION_CHANGED,
							this._stopSelectionChange.bind(this));
					this._stopSelectionChange = undefined
				}
			},
			getRDFFromDOM : function() {
				try {
					var c = "";
					source = ORYX.PATH + "lib/extract-rdf.xsl";
					new Ajax.Request(source, {
						asynchronous : false,
						method : "get",
						onSuccess : function(e) {
							c = e.responseText
						}.bind(this),
						onFailure : (function(e) {
							ORYX.Log.error("XSL load failed" + e)
						}).bind(this)
					});
					var k = new DOMParser();
					var h = k.parseFromString(this.getSerializedDOM(),
							"text/xml");
					var f = k.parseFromString(c, "text/xml");
					var b = new XSLTProcessor();
					b.importStylesheet(f);
					var a = b.transformToFragment(h, document);
					var d = new XMLSerializer();
					return d.serializeToString(a)
				} catch (g) {
					console.log("error serializing " + g);
					return ""
				}
			},
			isStencilSetExtensionLoaded : function(a) {
				return this.facade.getStencilSets().values().any(function(b) {
					return b.extensions().keys().any(function(c) {
						return c == a
					}.bind(this))
				}.bind(this))
			},
			doLayout : function(a) {
				if (this.facade.raiseEvent) {
					this.facade.raiseEvent({
						type : ORYX.CONFIG.EVENT_LAYOUT,
						shapes : a
					})
				} else {
					this.facade.handleEvents({
						type : ORYX.CONFIG.EVENT_LAYOUT,
						shapes : a
					})
				}
			},
			layoutEdges : function(b, a, d) {
				if (!this.facade.isExecutingCommands()) {
					return

					

										

					

				}
				var c = ORYX.Core.Command
						.extend({
							construct : function(f, h, k, g) {
								this.edges = f;
								this.node = h;
								this.plugin = g;
								this.offset = k;
								var e = h.absoluteXY();
								this.ulo = {
									x : e.x - k.x,
									y : e.y - k.y
								}
							},
							execute : function() {
								if (this.changes) {
									this.executeAgain();
									return

									

																		

									

								} else {
									this.changes = [];
									this.edges.each(function(e) {
										this.changes.push({
											edge : e,
											oldDockerPositions : e.dockers
													.map(function(f) {
														return f.bounds
																.center()
													})
										})
									}.bind(this))
								}
								this.edges
										.findAll(function(e) {
											return e.dockers.length > 2
										}.bind(this))
										.each(
												function(g) {
													if (g.dockers.first()
															.getDockedShape() === this.node) {
														var f = g.dockers[1];
														if (this
																.align(
																		f.bounds,
																		g.dockers
																				.first())) {
															f.update()
														}
													} else {
														if (g.dockers
																.last()
																.getDockedShape() === this.node) {
															var e = g.dockers[g.dockers.length - 2];
															if (this
																	.align(
																			e.bounds,
																			g.dockers
																					.last())) {
																e.update()
															}
														}
													}
													g._update(true);
													g.removeUnusedDockers();
													if (this
															.isBendPointIncluded(g)) {
														this.plugin.doLayout(g);
														return

														

																												

														

													}
												}.bind(this));
								this.edges
										.each(function(e) {
											if (e.dockers.length == 2) {
												var g = e.dockers
														.first()
														.getAbsoluteReferencePoint()
														|| e.dockers.first().bounds
																.center();
												var f = e.dockers
														.last()
														.getAbsoluteReferencePoint()
														|| e.dockers.first().bounds
																.center();
												if (Math
														.abs(-Math.abs(g.x
																- f.x)
																+ Math
																		.abs(this.offset.x)) < 2
														|| Math
																.abs(-Math
																		.abs(g.y
																				- f.y)
																		+ Math
																				.abs(this.offset.y)) < 2) {
													this.plugin.doLayout(e)
												}
											}
										}.bind(this));
								this.edges.each(function(f, e) {
									this.changes[e].dockerPositions = f.dockers
											.map(function(g) {
												return g.bounds.center()
											})
								}.bind(this))
							},
							align : function(k, f) {
								var h = f.getAbsoluteReferencePoint()
										|| f.bounds.center();
								var l = k.center().x - h.x;
								var g = k.center().y - h.y;
								if (Math.abs(-Math.abs(l)
										+ Math.abs(this.offset.x)) < 3
										&& this.offset.xs === undefined) {
									k.moveBy({
										x : -l,
										y : 0
									})
								}
								if (Math.abs(-Math.abs(g)
										+ Math.abs(this.offset.y)) < 3
										&& this.offset.ys === undefined) {
									k.moveBy({
										y : -g,
										x : 0
									})
								}
								if (this.offset.xs !== undefined
										|| this.offset.ys !== undefined) {
									var e = f.getDockedShape().absoluteXY();
									l = k.center().x
											- (e.x + ((h.x - e.x) / this.offset.xs));
									g = k.center().y
											- (e.y + ((h.y - e.y) / this.offset.ys));
									if (Math.abs(-Math.abs(l)
											+ Math.abs(this.offset.x)) < 3) {
										k.moveBy({
											x : -(k.center().x - h.x),
											y : 0
										})
									}
									if (Math.abs(-Math.abs(g)
											+ Math.abs(this.offset.y)) < 3) {
										k.moveBy({
											y : -(k.center().y - h.y),
											x : 0
										})
									}
								}
							},
							isBendPointIncluded : function(e) {
								var f = e.dockers.first().getDockedShape();
								var g = e.dockers.last().getDockedShape();
								if (f) {
									f = f.absoluteBounds();
									f.widen(5)
								}
								if (g) {
									g = g.absoluteBounds();
									g.widen(20)
								}
								return e.dockers
										.any(function(k, h) {
											var l = k.bounds.center();
											return h != 0
													&& h != e.dockers.length - 1
													&& ((f && f.isIncluded(l)) || (g && g
															.isIncluded(l)))
										})
							},
							removeAllDocker : function(e) {
								e.dockers.slice(1, e.dockers.length - 1).each(
										function(f) {
											e.removeDocker(f)
										})
							},
							executeAgain : function() {
								this.changes
										.each(function(e) {
											this.removeAllDocker(e.edge);
											e.dockerPositions
													.each(function(h, f) {
														if (f == 0
																|| f == e.dockerPositions.length - 1) {
															return

															

																														

															

														}
														var g = e.edge
																.createDocker(
																		undefined,
																		h);
														g.bounds
																.centerMoveTo(h);
														g.update()
													}.bind(this));
											e.edge._update(true)
										}.bind(this))
							},
							rollback : function() {
								this.changes
										.each(function(e) {
											this.removeAllDocker(e.edge);
											e.oldDockerPositions
													.each(function(h, f) {
														if (f == 0
																|| f == e.oldDockerPositions.length - 1) {
															return

															

																														

															

														}
														var g = e.edge
																.createDocker(
																		undefined,
																		h);
														g.bounds
																.centerMoveTo(h);
														g.update()
													}.bind(this));
											e.edge._update(true)
										}.bind(this))
							}
						});
				this.facade.executeCommands([ new c(a, b, d, this) ])
			}
		});
if (!ORYX) {
	var ORYX = {}
}
if (!ORYX.Plugins) {
	ORYX.Plugins = {}
}
ORYX.Plugins.AbstractLayouter = ORYX.Plugins.AbstractPlugin.extend({
	layouted : [],
	construct : function(a) {
		arguments.callee.$.construct.apply(this, arguments);
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_LAYOUT, this._initLayout
				.bind(this))
	},
	isIncludedInLayout : function(a) {
		if (!(this.layouted instanceof Array)) {
			this.layouted = [ this.layouted ].compact()
		}
		if (this.layouted.length <= 0) {
			return true
		}
		return this.layouted.any(function(b) {
			if (typeof b == "string") {
				return a.getStencil().id().include(b)
			} else {
				return a instanceof b
			}
		})
	},
	_initLayout : function(c) {
		var b = [ c.shapes ].flatten().compact();
		var a = b.findAll(function(d) {
			return this.isIncludedInLayout(d)
		}.bind(this));
		if (a.length > 0) {
			this.layout(a)
		}
	},
	layout : function(a) {
		throw new Error("Layouter has to implement the layout function.")
	}
});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.Edit = Clazz
		.extend({
			construct : function(a) {
				this.facade = a;
				this.clipboard = new ORYX.Plugins.Edit.ClipBoard();
				this.facade.offer({
					name : ORYX.I18N.Edit.cut,
					description : ORYX.I18N.Edit.cutDesc,
					icon : ORYX.PATH + "images/cut.png",
					keyCodes : [ {
						metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
						keyCode : 88,
						keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
					} ],
					functionality : this.callEdit.bind(this, this.editCut),
					group : ORYX.I18N.Edit.group,
					index : 1,
					minShape : 1
				});
				this.facade.offer({
					name : ORYX.I18N.Edit.copy,
					description : ORYX.I18N.Edit.copyDesc,
					icon : ORYX.PATH + "images/page_copy.png",
					keyCodes : [ {
						metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
						keyCode : 67,
						keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
					} ],
					functionality : this.callEdit.bind(this, this.editCopy, [
							true, false ]),
					group : ORYX.I18N.Edit.group,
					index : 2,
					minShape : 1
				});
				this.facade.offer({
					name : ORYX.I18N.Edit.paste,
					description : ORYX.I18N.Edit.pasteDesc,
					icon : ORYX.PATH + "images/page_paste.png",
					keyCodes : [ {
						metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
						keyCode : 86,
						keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
					} ],
					functionality : this.callEdit.bind(this, this.editPaste),
					isEnabled : this.clipboard.isOccupied.bind(this.clipboard),
					group : ORYX.I18N.Edit.group,
					index : 3,
					minShape : 0,
					maxShape : 0
				});
				this.facade.offer({
					name : ORYX.I18N.Edit.del,
					description : ORYX.I18N.Edit.delDesc,
					icon : ORYX.PATH + "images/cross.png",
					keyCodes : [ {
						metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
						keyCode : 8,
						keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
					}, {
						keyCode : 46,
						keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
					} ],
					functionality : this.callEdit.bind(this, this.editDelete),
					group : ORYX.I18N.Edit.group,
					index : 4,
					minShape : 1
				})
			},
			callEdit : function(b, a) {
				window.setTimeout(function() {
					b.apply(this, (a instanceof Array ? a : []))
				}.bind(this), 1)
			},
			handleMouseDown : function(a) {
				if (this._controlPressed) {
					this._controlPressed = false;
					this.editCopy();
					this.editPaste();
					a.forceExecution = true;
					this.facade.raiseEvent(a, this.clipboard.shapesAsJson)
				}
			},
			getAllShapesToConsider : function(b) {
				var a = [];
				var c = [];
				b.each(function(e) {
					isChildShapeOfAnother = b.any(function(g) {
						return g.hasChildShape(e)
					});
					if (isChildShapeOfAnother) {
						return

						

												

						

					}
					a.push(e);
					if (e instanceof ORYX.Core.Node) {
						var f = e.getOutgoingNodes();
						f = f.findAll(function(g) {
							return !b.include(g)
						});
						a = a.concat(f)
					}
					c = c.concat(e.getChildShapes(true))
				}.bind(this));
				var d = this.facade.getCanvas().getChildEdges().select(
						function(e) {
							if (a.include(e)) {
								return false
							}
							if (e.getAllDockedShapes().size() === 0) {
								return false
							}
							return e.getAllDockedShapes().all(
									function(f) {
										return f instanceof ORYX.Core.Edge
												|| c.include(f)
									})
						});
				a = a.concat(d);
				return a
			},
			editCut : function() {
				this.editCopy(false, true);
				this.editDelete(true);
				return false
			},
			editCopy : function(c, a) {
				var b = this.facade.getSelection();
				if (b.length == 0) {
					return

					

										

					

				}
				this.clipboard.refresh(b, this.getAllShapesToConsider(b),
						this.facade.getCanvas().getStencil().stencilSet()
								.namespace(), a);
				if (c) {
					this.facade.updateSelection()
				}
			},
			editPaste : function() {
				var b = {
					childShapes : this.clipboard.shapesAsJson,
					stencilset : {
						namespace : this.clipboard.SSnamespace
					}
				};
				jQuery.extend(b, ORYX.Core.AbstractShape.JSONHelper);
				var a = b.getChildShapes(true).pluck("resourceId");
				var c = {};
				b.eachChild(function(d, e) {
					d.outgoing = d.outgoing.select(function(f) {
						return a.include(f.resourceId)
					});
					d.outgoing.each(function(f) {
						if (!c[f.resourceId]) {
							c[f.resourceId] = []
						}
						c[f.resourceId].push(d)
					});
					return d
				}.bind(this), true, true);
				b
						.eachChild(
								function(d, e) {
									if (d.target
											&& !(a.include(d.target.resourceId))) {
										d.target = undefined;
										d.targetRemoved = true
									}
									if (d.dockers
											&& d.dockers.length >= 1
											&& d.dockers[0].getDocker
											&& ((d.dockers[0].getDocker()
													.getDockedShape() && !a
													.include(d.dockers[0]
															.getDocker()
															.getDockedShape().resourceId)) || !d
													.getShape().dockers[0]
													.getDockedShape()
													&& !c[d.resourceId])) {
										d.sourceRemoved = true
									}
									return d
								}.bind(this), true, true);
				b
						.eachChild(
								function(d, e) {
									if (this.clipboard.useOffset) {
										d.bounds = {
											lowerRight : {
												x : d.bounds.lowerRight.x
														+ ORYX.CONFIG.COPY_MOVE_OFFSET,
												y : d.bounds.lowerRight.y
														+ ORYX.CONFIG.COPY_MOVE_OFFSET
											},
											upperLeft : {
												x : d.bounds.upperLeft.x
														+ ORYX.CONFIG.COPY_MOVE_OFFSET,
												y : d.bounds.upperLeft.y
														+ ORYX.CONFIG.COPY_MOVE_OFFSET
											}
										}
									}
									if (d.dockers) {
										d.dockers = d.dockers
												.map(function(g, f) {
													if ((d.targetRemoved === true
															&& f == d.dockers.length - 1 && g.getDocker)
															|| (d.sourceRemoved === true
																	&& f == 0 && g.getDocker)) {
														g = g.getDocker().bounds
																.center()
													}
													if ((f == 0
															&& g.getDocker instanceof Function
															&& d.sourceRemoved !== true && (g
															.getDocker()
															.getDockedShape() || ((c[d.resourceId] || []).length > 0 && (!(d
															.getShape() instanceof ORYX.Core.Node) || c[d.resourceId][0]
															.getShape() instanceof ORYX.Core.Node))))
															|| (f == d.dockers.length - 1
																	&& g.getDocker instanceof Function
																	&& d.targetRemoved !== true && (g
																	.getDocker()
																	.getDockedShape() || d.target))) {
														return {
															x : g.x,
															y : g.y,
															getDocker : g.getDocker
														}
													} else {
														if (this.clipboard.useOffset) {
															return {
																x : g.x
																		+ ORYX.CONFIG.COPY_MOVE_OFFSET,
																y : g.y
																		+ ORYX.CONFIG.COPY_MOVE_OFFSET,
																getDocker : g.getDocker
															}
														} else {
															return {
																x : g.x,
																y : g.y,
																getDocker : g.getDocker
															}
														}
													}
												}.bind(this))
									} else {
										if (d.getShape() instanceof ORYX.Core.Node
												&& d.dockers
												&& d.dockers.length > 0
												&& (!d.dockers.first().getDocker
														|| d.sourceRemoved === true || !(d.dockers
														.first().getDocker()
														.getDockedShape() || c[d.resourceId]))) {
											d.dockers = d.dockers
													.map(function(g, f) {
														if ((d.sourceRemoved === true
																&& f == 0 && g.getDocker)) {
															g = g.getDocker().bounds
																	.center()
														}
														if (this.clipboard.useOffset) {
															return {
																x : g.x
																		+ ORYX.CONFIG.COPY_MOVE_OFFSET,
																y : g.y
																		+ ORYX.CONFIG.COPY_MOVE_OFFSET,
																getDocker : g.getDocker
															}
														} else {
															return {
																x : g.x,
																y : g.y,
																getDocker : g.getDocker
															}
														}
													}.bind(this))
										}
									}
									return d
								}.bind(this), false, true);
				this.clipboard.useOffset = true;
				this.facade.importJSON(b)
			},
			editDelete : function() {
				var a = this.facade.getSelection();
				var b = new ORYX.Plugins.Edit.ClipBoard();
				b.refresh(a, this.getAllShapesToConsider(a));
				var c = new ORYX.Plugins.Edit.DeleteCommand(b, this.facade);
				this.facade.executeCommands([ c ])
			}
		});
ORYX.Plugins.Edit.ClipBoard = Clazz.extend({
	construct : function() {
		this.shapesAsJson = [];
		this.selection = [];
		this.SSnamespace = "";
		this.useOffset = true
	},
	isOccupied : function() {
		return this.shapesAsJson.length > 0
	},
	refresh : function(d, b, c, a) {
		this.selection = d;
		this.SSnamespace = c;
		this.outgoings = {};
		this.parents = {};
		this.targets = {};
		this.useOffset = a !== true;
		this.shapesAsJson = b.map(function(e) {
			var f = e.toJSON();
			f.parent = {
				resourceId : e.getParentShape().resourceId
			};
			f.parentIndex = e.getParentShape().getChildShapes().indexOf(e);
			return f
		})
	}
});
ORYX.Plugins.Edit.DeleteCommand = ORYX.Core.Command.extend({
	construct : function(b, a) {
		this.clipboard = b;
		this.shapesAsJson = b.shapesAsJson;
		this.facade = a;
		this.dockers = this.shapesAsJson.map(function(g) {
			var e = g.getShape();
			var f = e.getIncomingShapes().map(function(h) {
				return h.getDockers().last()
			});
			var d = e.getOutgoingShapes().map(function(h) {
				return h.getDockers().first()
			});
			var c = e.getDockers().concat(f, d).compact().map(function(h) {
				return {
					object : h,
					referencePoint : h.referencePoint,
					dockedShape : h.getDockedShape()
				}
			});
			return c
		}).flatten()
	},
	execute : function() {
		this.shapesAsJson.each(function(a) {
			this.facade.deleteShape(a.getShape())
		}.bind(this));
		this.facade.setSelection([]);
		this.facade.getCanvas().update();
		this.facade.updateSelection()
	},
	rollback : function() {
		this.shapesAsJson.each(function(c) {
			var a = c.getShape();
			var b = this.facade.getCanvas().getChildShapeByResourceId(
					c.parent.resourceId)
					|| this.facade.getCanvas();
			b.add(a, a.parentIndex)
		}.bind(this));
		this.dockers.each(function(a) {
			a.object.setDockedShape(a.dockedShape);
			a.object.setReferencePoint(a.referencePoint)
		}.bind(this));
		this.facade.setSelection(this.selectedShapes);
		this.facade.getCanvas().update();
		this.facade.updateSelection()
	}
});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.View = {
	facade : undefined,
	construct : function(b, a) {
		this.facade = b;
		this.zoomLevel = 1;
		this.maxFitToScreenLevel = 1.5;
		this.minZoomLevel = 0.1;
		this.maxZoomLevel = 2.5;
		this.diff = 5;
		if (a !== undefined && a !== null) {
			a.properties.each(function(c) {
				if (c.zoomLevel) {
					this.zoomLevel = Number(1)
				}
				if (c.maxFitToScreenLevel) {
					this.maxFitToScreenLevel = Number(c.maxFitToScreenLevel)
				}
				if (c.minZoomLevel) {
					this.minZoomLevel = Number(c.minZoomLevel)
				}
				if (c.maxZoomLevel) {
					this.maxZoomLevel = Number(c.maxZoomLevel)
				}
			}.bind(this))
		}
		this.facade.offer({
			name : ORYX.I18N.View.zoomIn,
			functionality : this.zoom.bind(this,
					[ 1 + ORYX.CONFIG.ZOOM_OFFSET ]),
			group : ORYX.I18N.View.group,
			icon : ORYX.PATH + "images/magnifier_zoom_in.png",
			description : ORYX.I18N.View.zoomInDesc,
			index : 1,
			minShape : 0,
			maxShape : 0,
			isEnabled : function() {
				return this.zoomLevel < this.maxZoomLevel
			}.bind(this)
		});
		this.facade.offer({
			name : ORYX.I18N.View.zoomOut,
			functionality : this.zoom.bind(this,
					[ 1 - ORYX.CONFIG.ZOOM_OFFSET ]),
			group : ORYX.I18N.View.group,
			icon : ORYX.PATH + "images/magnifier_zoom_out.png",
			description : ORYX.I18N.View.zoomOutDesc,
			index : 2,
			minShape : 0,
			maxShape : 0,
			isEnabled : function() {
				return this._checkSize()
			}.bind(this)
		});
		this.facade.offer({
			name : ORYX.I18N.View.zoomStandard,
			functionality : this.setAFixZoomLevel.bind(this, 1),
			group : ORYX.I18N.View.group,
			icon : ORYX.PATH + "images/zoom_standard.png",
			cls : "icon-large",
			description : ORYX.I18N.View.zoomStandardDesc,
			index : 3,
			minShape : 0,
			maxShape : 0,
			isEnabled : function() {
				return this.zoomLevel != 1
			}.bind(this)
		});
		this.facade.offer({
			name : ORYX.I18N.View.zoomFitToModel,
			functionality : this.zoomFitToModel.bind(this),
			group : ORYX.I18N.View.group,
			icon : ORYX.PATH + "images/image.png",
			description : ORYX.I18N.View.zoomFitToModelDesc,
			index : 4,
			minShape : 0,
			maxShape : 0
		})
	},
	setAFixZoomLevel : function(a) {
		this.zoomLevel = a;
		this._checkZoomLevelRange();
		this.zoom(1)
	},
	zoom : function(d) {
		this.zoomLevel *= d;
		var h = this.facade.getCanvas().getHTMLContainer().parentNode.parentNode;
		var c = this.facade.getCanvas();
		var g = c.bounds.width() * this.zoomLevel;
		var a = c.bounds.height() * this.zoomLevel;
		var f = (c.node.parentNode.parentNode.parentNode.offsetHeight - a) / 2;
		f = f > 20 ? f - 20 : 0;
		c.node.parentNode.parentNode.style.marginTop = f + "px";
		f += 5;
		c.getHTMLContainer().style.top = f + "px";
		var b = h.scrollTop
				- Math
						.round((c.getHTMLContainer().parentNode.getHeight() - a) / 2)
				+ this.diff;
		var e = h.scrollLeft
				- Math
						.round((c.getHTMLContainer().parentNode.getWidth() - g) / 2)
				+ this.diff;
		c.setSize({
			width : g,
			height : a
		}, true);
		c.node.setAttributeNS(null, "transform", "scale(" + this.zoomLevel
				+ ")");
		this.facade.updateSelection();
		h.scrollTop = b;
		h.scrollLeft = e;
		c.zoomLevel = this.zoomLevel
	},
	zoomFitToModel : function() {
		var h = this.facade.getCanvas().getHTMLContainer().parentNode.parentNode;
		var b = h.getHeight() - 30;
		var d = h.getWidth() - 30;
		var c = this.facade.getCanvas().getChildShapes();
		if (!c || c.length < 1) {
			return false
		}
		var g = c[0].absoluteBounds().clone();
		c.each(function(k) {
			g.include(k.absoluteBounds().clone())
		});
		var f = d / g.width();
		var a = b / g.height();
		var e = a < f ? a : f;
		if (e > this.maxFitToScreenLevel) {
			e = this.maxFitToScreenLevel
		}
		this.setAFixZoomLevel(e);
		h.scrollTop = Math.round(g.upperLeft().y * this.zoomLevel) - 5;
		h.scrollLeft = Math.round(g.upperLeft().x * this.zoomLevel) - 5
	},
	_checkSize : function() {
		var a = this.facade.getCanvas().getHTMLContainer().parentNode;
		var b = Math.min((a.parentNode.getWidth() / a.getWidth()),
				(a.parentNode.getHeight() / a.getHeight()));
		return 1.05 > b
	},
	_checkZoomLevelRange : function() {
		if (this.zoomLevel < this.minZoomLevel) {
			this.zoomLevel = this.minZoomLevel
		}
		if (this.zoomLevel > this.maxZoomLevel) {
			this.zoomLevel = this.maxZoomLevel
		}
	}
};
ORYX.Plugins.View = Clazz.extend(ORYX.Plugins.View);
if (!Signavio) {
	var Signavio = {}
}
if (!Signavio.Core) {
	Signavio.Core = {}
}
Signavio.Core.Version = "1.0";
if (!Signavio) {
	var Signavio = new Object()
}
if (!Signavio.Plugins) {
	Signavio.Plugins = new Object()
}
if (!Signavio.Plugins.Utils) {
	Signavio.Plugins.Utils = new Object()
}
if (!Signavio.Helper) {
	Signavio.Helper = new Object()
}
new function() {
	ORYX.Editor.provideId = function() {
		var b = [], c = "0123456789ABCDEF";
		for (var a = 0; a < 36; a++) {
			b[a] = Math.floor(Math.random() * 16)
		}
		b[14] = 4;
		b[19] = (b[19] & 3) | 8;
		for (var a = 0; a < 36; a++) {
			b[a] = c[b[a]]
		}
		b[8] = b[13] = b[18] = b[23] = "-";
		return "sid-" + b.join("")
	}
}();
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.Loading = {
	construct : function(a) {
		this.facade = a;
		this.node = ORYX.Editor.graft("http://www.w3.org/1999/xhtml",
				this.facade.getCanvas().getHTMLContainer().parentNode, [ "div",
						{
							"class" : "LoadingIndicator"
						}, "" ]);
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_LOADING_ENABLE,
				this.enableLoading.bind(this));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_LOADING_DISABLE,
				this.disableLoading.bind(this));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_LOADING_STATUS,
				this.showStatus.bind(this));
		this.disableLoading()
	},
	enableLoading : function(a) {
		if (a.text) {
			this.node.innerHTML = a.text + "..."
		} else {
			this.node.innerHTML = ORYX.I18N.Loading.waiting
		}
		this.node.removeClassName("StatusIndicator");
		this.node.addClassName("LoadingIndicator");
		this.node.style.display = "block";
		var b = this.facade.getCanvas().rootNode.parentNode.parentNode.parentNode.parentNode;
		this.node.style.top = b.offsetTop + "px";
		this.node.style.left = b.offsetLeft + "px"
	},
	disableLoading : function() {
		this.node.style.display = "none"
	},
	showStatus : function(a) {
		if (a.text) {
			this.node.innerHTML = a.text;
			this.node.addClassName("StatusIndicator");
			this.node.removeClassName("LoadingIndicator");
			this.node.style.display = "block";
			var c = this.facade.getCanvas().rootNode.parentNode.parentNode.parentNode.parentNode;
			this.node.style.top = c.offsetTop + "px";
			this.node.style.left = c.offsetLeft + "px";
			var b = a.timeout ? a.timeout : 2000;
			window.setTimeout((function() {
				this.disableLoading()
			}).bind(this), b)
		}
	}
};
ORYX.Plugins.Loading = Clazz.extend(ORYX.Plugins.Loading);
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.CanvasResize = Clazz.extend({
	construct : function(a) {
		this.facade = a;
		new ORYX.Plugins.CanvasResizeButton(this.facade.getCanvas(), "N",
				this.resize.bind(this));
		new ORYX.Plugins.CanvasResizeButton(this.facade.getCanvas(), "W",
				this.resize.bind(this));
		new ORYX.Plugins.CanvasResizeButton(this.facade.getCanvas(), "E",
				this.resize.bind(this));
		new ORYX.Plugins.CanvasResizeButton(this.facade.getCanvas(), "S",
				this.resize.bind(this));
		window.setTimeout(function() {
			jQuery(window).trigger("resize")
		})
	},
	resize : function(a, c) {
		resizeCanvas = function(l, m, o) {
			var f = o.getCanvas();
			var n = f.bounds;
			var h = o.getCanvas().getHTMLContainer().parentNode.parentNode;
			if (l == "E" || l == "W") {
				f.setSize({
					width : (n.width() + m) * f.zoomLevel,
					height : (n.height()) * f.zoomLevel
				})
			} else {
				if (l == "S" || l == "N") {
					f.setSize({
						width : (n.width()) * f.zoomLevel,
						height : (n.height() + m) * f.zoomLevel
					})
				}
			}
			if (l == "N" || l == "W") {
				var g = l == "N" ? {
					x : 0,
					y : m
				} : {
					x : m,
					y : 0
				};
				f.getChildNodes(false, function(q) {
					q.bounds.moveBy(g)
				});
				var k = f.getChildEdges().findAll(function(q) {
					return q.getAllDockedShapes().length > 0
				});
				var p = k.collect(function(q) {
					return q.dockers.findAll(function(r) {
						return !r.getDockedShape()
					})
				}).flatten();
				p.each(function(q) {
					q.bounds.moveBy(g)
				})
			} else {
				if (l == "S") {
					h.scrollTop += m
				} else {
					if (l == "E") {
						h.scrollLeft += m
					}
				}
			}
			jQuery(window).trigger("resize");
			f.update();
			o.updateSelection()
		};
		var b = ORYX.Core.Command.extend({
			construct : function(f, h, g) {
				this.position = f;
				this.extentionSize = h;
				this.facade = g
			},
			execute : function() {
				resizeCanvas(this.position, this.extentionSize, this.facade)
			},
			rollback : function() {
				resizeCanvas(this.position, -this.extentionSize, this.facade)
			},
			update : function() {
			}
		});
		var d = ORYX.CONFIG.CANVAS_RESIZE_INTERVAL;
		if (c) {
			d = -d
		}
		var e = new b(a, d, this.facade);
		this.facade.executeCommands([ e ])
	}
});
ORYX.Plugins.CanvasResizeButton = Clazz
		.extend({
			construct : function(b, t, g) {
				this.canvas = b;
				var k = b.getHTMLContainer().parentNode;
				window.myParent = k;
				var s = jQuery("#canvasSection")[0];
				var d = s;
				var e = jQuery("#canvasSection").find(".ORYX_Editor")[0];
				var f = e.children[0];
				var a = "glyphicon glyphicon-chevron-";
				var p = "glyphicon glyphicon-chevron-";
				if (t == "N") {
					a += "up";
					p += "down"
				} else {
					if (t == "S") {
						a += "down";
						p += "up"
					} else {
						if (t == "E") {
							a += "right";
							p += "left"
						} else {
							if (t == "W") {
								a += "left";
								p += "right"
							}
						}
					}
				}
				var l = "canvas-shrink-" + t;
				var r = "canvas-grow-" + t;
				var c = ORYX.Editor
						.graft(
								"http://www.w3.org/1999/xhtml",
								k,
								[
										"div",
										{
											"class" : "canvas_resize_indicator canvas_resize_indicator_grow "
													+ t,
											id : l,
											title : ORYX.I18N.RESIZE.tipGrow
													+ ORYX.I18N.RESIZE[t]
										}, [ "i", {
											"class" : a
										} ] ]);
				var h = ORYX.Editor
						.graft(
								"http://www.w3.org/1999/xhtml",
								k,
								[
										"div",
										{
											"class" : "canvas_resize_indicator canvas_resize_indicator_shrink "
													+ t,
											id : r,
											title : ORYX.I18N.RESIZE.tipGrow
													+ ORYX.I18N.RESIZE[t]
										}, [ "i", {
											"class" : p
										} ] ]);
				var m = 60;
				var q = function(w) {
					var x = w.target.id.indexOf("canvas-shrink") != -1
							|| w.target.id.indexOf("canvas-grow") != -1
							|| w.target.parentNode.id.indexOf("canvas-shrink") != -1
							|| w.target.parentNode.id.indexOf("canvas-grow") != -1;
					if (x) {
						if (w.target.id == l || w.target.id == r
								|| w.target.parentNode.id == l
								|| w.target.parentNode.id == r) {
							return true
						} else {
							return false
						}
					}
					if (w.target != k && w.target != d
							&& w.target != d.firstChild && w.target != f
							&& w.target != d) {
						return false
					}
					var z = w.offsetX !== undefined ? w.offsetX : w.layerX;
					var y = w.offsetY !== undefined ? w.offsetY : w.layerY;
					var u = 0;
					if (e.clientWidth < s.clientWidth) {
						var v = s.clientWidth - e.clientWidth;
						u = v / 2
					}
					y = y - s.scrollTop;
					z = z - s.scrollLeft;
					if (t == "N") {
						return y < m
					} else {
						if (t == "W") {
							return z < m + u
						} else {
							if (t == "E") {
								return s.clientWidth - z < m + u
							} else {
								if (t == "S") {
									return s.clientHeight - y < m
								}
							}
						}
					}
					return false
				};
				var n = (function() {
					c.show();
					var u = b.bounds.width();
					var v = b.bounds.height();
					if (t == "N"
							&& (v - ORYX.CONFIG.CANVAS_RESIZE_INTERVAL > ORYX.CONFIG.CANVAS_MIN_HEIGHT)) {
						h.show()
					} else {
						if (t == "E"
								&& (u - ORYX.CONFIG.CANVAS_RESIZE_INTERVAL > ORYX.CONFIG.CANVAS_MIN_WIDTH)) {
							h.show()
						} else {
							if (t == "S"
									&& (v - ORYX.CONFIG.CANVAS_RESIZE_INTERVAL > ORYX.CONFIG.CANVAS_MIN_HEIGHT)) {
								h.show()
							} else {
								if (t == "W"
										&& (u
												- ORYX.CONFIG.CANVAS_RESIZE_INTERVAL > ORYX.CONFIG.CANVAS_MIN_WIDTH)) {
									h.show()
								} else {
									h.hide()
								}
							}
						}
					}
				}).bind(this);
				var o = function() {
					c.hide();
					h.hide()
				};
				k.parentNode.addEventListener(ORYX.CONFIG.EVENT_MOUSEMOVE,
						function(u) {
							if (q(u)) {
								n()
							} else {
								o()
							}
						}, false);
				c.addEventListener(ORYX.CONFIG.EVENT_MOUSEOVER, function(u) {
					n()
				}, true);
				h.addEventListener(ORYX.CONFIG.EVENT_MOUSEOVER, function(u) {
					n()
				}, true);
				k.parentNode.addEventListener(ORYX.CONFIG.EVENT_MOUSEOUT,
						function(u) {
							o()
						}, true);
				o();
				c.addEventListener("click", function() {
					g(t);
					n()
				}, true);
				h.addEventListener("click", function() {
					g(t, true);
					n()
				}, true)
			}
		});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.RenameShapes = Clazz
		.extend({
			facade : undefined,
			construct : function(a) {
				this.facade = a;
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_CANVAS_SCROLL,
						this.hideField.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_DBLCLICK,
						this.actOnDBLClick.bind(this));
				this.facade.offer({
					keyCodes : [ {
						keyCode : 113,
						keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
					} ],
					functionality : this.renamePerF2.bind(this)
				});
				document.documentElement
						.addEventListener(ORYX.CONFIG.EVENT_MOUSEDOWN,
								this.hide.bind(this), true)
			},
			renamePerF2 : function() {
				var a = this.facade.getSelection();
				this.actOnDBLClick(undefined, a.first())
			},
			actOnDBLClick : function(p, l) {
				if (!(l instanceof ORYX.Core.Shape)) {
					return

					

										

					

				}
				this.destroy();
				var m = l.getStencil().properties()
						.findAll(
								function(t) {
									return (t.refToView()
											&& t.refToView().length > 0 && t
											.directlyEditable())
								});
				m = m
						.findAll(function(t) {
							return !t.readonly()
									&& (t.type() == ORYX.CONFIG.TYPE_STRING
											|| t.type() == ORYX.CONFIG.TYPE_EXPRESSION || t
											.type() == ORYX.CONFIG.TYPE_DATASOURCE)
						});
				var n = m.collect(function(t) {
					return t.refToView()
				}).flatten().compact();
				var h = l.getLabels().findAll(function(t) {
					return n.any(function(u) {
						return t.id.endsWith(u)
					})
				});
				if (h.length == 0) {
					return

					

										

					

				}
				var k = h.length <= 1 ? h[0] : null;
				if (!k) {
					k = h.find(function(t) {
						return t.node == p.target
								|| t.node == p.target.parentNode
					});
					if (!k) {
						var q = this.facade.eventCoordinates(p);
						var b = 1;
						if (!isNaN(screen.logicalXDPI)
								&& !isNaN(screen.systemXDPI)) {
							var e = navigator.userAgent;
							if (e.indexOf("MSIE") >= 0) {
								var r = Math
										.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
								if (r !== 100) {
									b = r / 100
								}
							}
						}
						if (b !== 1) {
							q.x = q.x / b;
							q.y = q.y / b
						}
						q.y += $("editor-header").clientHeight
								- $("canvasSection").scrollTop - 5;
						if (KISBPM.HEADER_CONFIG.showAppTitle == false) {
							q.y += 61
						}
						q.x -= $("canvasSection").scrollLeft;
						var s = this.facade.getCanvas().rootNode.lastChild
								.getScreenCTM();
						q.x *= s.a;
						q.y *= s.d;
						var o = h.collect(function(v) {
							var u = this.getCenterPosition(v.node);
							var t = Math.sqrt(Math.pow(u.x - q.x, 2)
									+ Math.pow(u.y - q.y, 2));
							return {
								diff : t,
								label : v
							}
						}.bind(this));
						o.sort(function(u, t) {
							return u.diff > t.diff
						});
						k = o[0].label
					}
				}
				var d = m.find(function(t) {
					return t.refToView().any(function(u) {
						return k.id == l.id + u
					})
				});
				var f = Math.min(Math.max(100, l.bounds.width()), 200);
				var a = this.getCenterPosition(k.node, l);
				a.x -= (f / 2);
				var c = d.prefix() + "-" + d.id();
				var g = document.createElement("textarea");
				g.id = "shapeTextInput";
				g.style.position = "absolute";
				g.style.width = f + "px";
				g.style.left = (a.x < 10) ? 10 : a.x + "px";
				g.style.top = (a.y - 15) + "px";
				g.className = "x-form-textarea x-form-field x_form_text_set_absolute";
				g.value = l.properties[c];
				this.oldValueText = l.properties[c];
				document.getElementById("canvasSection").appendChild(g);
				this.shownTextField = g;
				this.updateValueFunction = function(x, u) {
					var w = l;
					var v = this.facade;
					if (u != x) {
						var t = ORYX.Core.Command
								.extend({
									construct : function() {
										this.el = w;
										this.propId = c;
										this.oldValue = u;
										this.newValue = x;
										this.facade = v
									},
									execute : function() {
										this.el.setProperty(this.propId,
												this.newValue);
										this.facade.setSelection([ this.el ]);
										this.facade.getCanvas().update();
										this.facade.updateSelection()
									},
									rollback : function() {
										this.el.setProperty(this.propId,
												this.oldValue);
										this.facade.setSelection([ this.el ]);
										this.facade.getCanvas().update();
										this.facade.updateSelection()
									}
								});
						var y = new t();
						this.facade.executeCommands([ y ])
					}
				}.bind(this);
				jQuery("#shapeTextInput").focus();
				jQuery("#shapeTextInput").autogrow();
				this.facade.disableEvent(ORYX.CONFIG.EVENT_KEYDOWN)
			},
			getCenterPosition : function(f, h) {
				if (!f) {
					return {
						x : 0,
						y : 0
					}
				}
				var e = this.facade.getCanvas().node.getScreenCTM();
				var b = h.bounds.upperLeft();
				var p = true;
				var n = h;
				while (p) {
					if (n.getParentShape().getStencil().idWithoutNs() === "BPMNDiagram") {
						p = false
					} else {
						var l = n.getParentShape().bounds.upperLeft();
						b.x += l.x;
						b.y += l.y;
						n = n.getParentShape()
					}
				}
				var c = h.bounds.midPoint();
				c.x += b.x + e.e;
				c.y += b.y + e.f;
				c.x *= e.a;
				c.y *= e.d;
				var a = 1;
				if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
					var d = navigator.userAgent;
					if (d.indexOf("MSIE") >= 0) {
						var r = Math
								.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
						if (r !== 100) {
							a = r / 100
						}
					}
				}
				if (a === 1) {
					c.y = c.y - jQuery("#canvasSection").offset().top + 5;
					c.x -= jQuery("#canvasSection").offset().left
				} else {
					var m = jQuery("#canvasSection").offset().left;
					var o = jQuery("#canvasSection").scrollLeft();
					var k = jQuery("#canvasSection").scrollTop();
					var g = e.e - (m * a);
					var q = 0;
					if (g > 10) {
						q = (g / a) - g
					}
					c.y = c.y - (jQuery("#canvasSection").offset().top * a) + 5
							+ ((k * a) - k);
					c.x = c.x - (m * a) + q + ((o * a) - o)
				}
				return c
			},
			hide : function(b) {
				if (this.shownTextField
						&& (!b || b.target !== this.shownTextField)) {
					var a = this.shownTextField.value;
					if (a !== this.oldValueText) {
						this.updateValueFunction(a, this.oldValueText)
					}
					this.destroy()
				}
			},
			hideField : function(a) {
				if (this.shownTextField) {
					this.destroy()
				}
			},
			destroy : function(a) {
				var b = jQuery("#shapeTextInput");
				if (b) {
					b.remove();
					delete this.shownTextField;
					this.facade.enableEvent(ORYX.CONFIG.EVENT_KEYDOWN)
				}
			}
		});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.ProcessLink = Clazz
		.extend({
			facade : undefined,
			construct : function(a) {
				this.facade = a;
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_PROPERTY_CHANGED,
						this.propertyChanged.bind(this))
			},
			propertyChanged : function(a, b) {
				if (a.name !== "oryx-refuri" || !b instanceof ORYX.Core.Node) {
					return

					

										

					

				}
				if (a.value && a.value.length > 0 && a.value != "undefined") {
					this.show(b, a.value)
				} else {
					this.hide(b)
				}
			},
			show : function(a, b) {
				var c = ORYX.Editor
						.graft(
								"http://www.w3.org/2000/svg",
								null,
								[
										"a",
										{
											target : "_blank"
										},
										[
												"path",
												{
													"stroke-width" : 1,
													stroke : "#00DD00",
													fill : "#00AA00",
													d : "M3,3 l0,-2.5 l7.5,0 l0,-2.5 l7.5,4.5 l-7.5,3.5 l0,-2.5 l-8,0",
													"line-captions" : "round"
												} ] ]);
				var c = ORYX.Editor
						.graft(
								"http://www.w3.org/2000/svg",
								null,
								[
										"a",
										{
											target : "_blank"
										},
										[
												"path",
												{
													style : "fill:#92BFFC;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.72",
													d : "M0 1.44 L0 15.05 L11.91 15.05 L11.91 5.98 L7.37 1.44 L0 1.44 Z"
												} ],
										[
												"path",
												{
													style : "stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.72;fill:none;",
													transform : "translate(7.5, -8.5)",
													d : "M0 10.51 L0 15.05 L4.54 15.05"
												} ],
										[
												"path",
												{
													style : "fill:#f28226;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.72",
													transform : "translate(-3, -1)",
													d : "M0 8.81 L0 13.06 L5.95 13.06 L5.95 15.05 A50.2313 50.2313 -175.57 0 0 10.77 11.08 A49.9128 49.9128 -1.28 0 0 5.95 6.54 L5.95 8.81 L0 8.81 Z"
												} ], ]);
				c.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
						b);
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_OVERLAY_SHOW,
					id : "arissupport.urlref_" + a.id,
					shapes : [ a ],
					node : c,
					nodePosition : "SE"
				})
			},
			hide : function(a) {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_OVERLAY_HIDE,
					id : "arissupport.urlref_" + a.id
				})
			}
		});
Array.prototype.insertFrom = function(e, d) {
	d = Math.max(0, d);
	e = Math.min(Math.max(0, e), this.length - 1);
	var b = this[e];
	var a = this.without(b);
	var c = a.slice(0, d);
	c.push(b);
	if (a.length > d) {
		c = c.concat(a.slice(d))
	}
	return c
};
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.Arrangement = ORYX.Plugins.AbstractPlugin.extend({
	facade : undefined,
	construct : function(a) {
		this.facade = a;
		this.facade.offer({
			name : ORYX.I18N.Arrangement.am,
			functionality : this.alignShapes.bind(this,
					[ ORYX.CONFIG.EDITOR_ALIGN_MIDDLE ]),
			group : ORYX.I18N.Arrangement.groupA,
			icon : ORYX.PATH + "images/shape_align_middle.png",
			description : ORYX.I18N.Arrangement.amDesc,
			index : 1,
			minShape : 2
		});
		this.facade.offer({
			name : ORYX.I18N.Arrangement.ac,
			functionality : this.alignShapes.bind(this,
					[ ORYX.CONFIG.EDITOR_ALIGN_CENTER ]),
			group : ORYX.I18N.Arrangement.groupA,
			icon : ORYX.PATH + "images/shape_align_center.png",
			description : ORYX.I18N.Arrangement.acDesc,
			index : 2,
			minShape : 2
		});
		this.facade.offer({
			name : ORYX.I18N.Arrangement.as,
			functionality : this.alignShapes.bind(this,
					[ ORYX.CONFIG.EDITOR_ALIGN_SIZE ]),
			group : ORYX.I18N.Arrangement.groupA,
			icon : ORYX.PATH + "images/shape_align_size.png",
			description : ORYX.I18N.Arrangement.asDesc,
			index : 3,
			minShape : 2
		});
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_ARRANGEMENT_TOP,
				this.setZLevel.bind(this, this.setToTop));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_ARRANGEMENT_BACK,
				this.setZLevel.bind(this, this.setToBack));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_ARRANGEMENT_FORWARD,
				this.setZLevel.bind(this, this.setForward));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_ARRANGEMENT_BACKWARD,
				this.setZLevel.bind(this, this.setBackward))
	},
	onSelectionChanged : function(a) {
		var b = this.facade.getSelection();
		if (b.length === 1 && b[0] instanceof ORYX.Core.Edge) {
			this.setToTop(b)
		}
	},
	setZLevel : function(d, b) {
		var a = ORYX.Core.Command.extend({
			construct : function(g, f, e) {
				this.callback = g;
				this.elements = f;
				this.elAndIndex = f.map(function(h) {
					return {
						el : h,
						previous : h.parent.children[h.parent.children
								.indexOf(h) - 1]
					}
				});
				this.facade = e
			},
			execute : function() {
				this.callback(this.elements);
				this.facade.setSelection(this.elements)
			},
			rollback : function() {
				var g = this.elAndIndex.sortBy(function(n) {
					var o = n.el;
					var m = $A(o.node.parentNode.childNodes);
					return m.indexOf(o.node)
				});
				for (var f = 0; f < g.length; f++) {
					var h = g[f].el;
					var k = h.parent;
					var l = k.children.indexOf(h);
					var e = k.children.indexOf(g[f].previous);
					e = e || 0;
					k.children = k.children.insertFrom(l, e);
					h.node.parentNode.insertBefore(h.node,
							h.node.parentNode.childNodes[e + 1])
				}
				this.facade.setSelection(this.elements)
			}
		});
		var c = new a(d, this.facade.getSelection(), this.facade);
		if (b.excludeCommand) {
			c.execute()
		} else {
			this.facade.executeCommands([ c ])
		}
	},
	setToTop : function(b) {
		var a = b.sortBy(function(e, c) {
			var d = $A(e.node.parentNode.childNodes);
			return d.indexOf(e.node)
		});
		a.each(function(c) {
			var d = c.parent;
			if (d.children.last() === c) {
				return

				

								

				

			}
			d.children = d.children.without(c);
			d.children.push(c);
			c.node.parentNode.appendChild(c.node)
		})
	},
	setToBack : function(b) {
		var a = b.sortBy(function(e, c) {
			var d = $A(e.node.parentNode.childNodes);
			return d.indexOf(e.node)
		});
		a = a.reverse();
		a.each(function(c) {
			var d = c.parent;
			d.children = d.children.without(c);
			d.children.unshift(c);
			c.node.parentNode
					.insertBefore(c.node, c.node.parentNode.firstChild)
		})
	},
	setBackward : function(c) {
		var b = c.sortBy(function(f, d) {
			var e = $A(f.node.parentNode.childNodes);
			return e.indexOf(f.node)
		});
		b = b.reverse();
		var a = b.findAll(function(d) {
			return !b.some(function(e) {
				return e.node == d.node.previousSibling
			})
		});
		a.each(function(e) {
			if (e.node.previousSibling === null) {
				return

				

								

				

			}
			var f = e.parent;
			var d = f.children.indexOf(e);
			f.children = f.children.insertFrom(d, d - 1);
			e.node.parentNode.insertBefore(e.node, e.node.previousSibling)
		})
	},
	setForward : function(c) {
		var b = c.sortBy(function(f, d) {
			var e = $A(f.node.parentNode.childNodes);
			return e.indexOf(f.node)
		});
		var a = b.findAll(function(d) {
			return !b.some(function(e) {
				return e.node == d.node.nextSibling
			})
		});
		a.each(function(f) {
			var d = f.node.nextSibling;
			if (d === null) {
				return

				

								

				

			}
			var e = f.parent.children.indexOf(f);
			var g = f.parent;
			g.children = g.children.insertFrom(e, e + 1);
			f.node.parentNode.insertBefore(d, f.node)
		})
	},
	alignShapes : function(b) {
		var f = this.facade.getSelection();
		f = this.facade.getCanvas().getShapesWithSharedParent(f);
		f = f.findAll(function(h) {
			return (h instanceof ORYX.Core.Node)
		});
		f = f.findAll(function(h) {
			var k = h.getIncomingShapes();
			return k.length == 0 || !f.include(k[0])
		});
		if (f.length < 2) {
			return

			

						

			

		}
		var e = f[0].absoluteBounds().clone();
		f.each(function(h) {
			e.include(h.absoluteBounds().clone())
		});
		var d = 0;
		var c = 0;
		f.each(function(h) {
			d = Math.max(h.bounds.width(), d);
			c = Math.max(h.bounds.height(), c)
		});
		var a = ORYX.Core.Command.extend({
			construct : function(o, n, m, l, h, k) {
				this.elements = o;
				this.bounds = n;
				this.maxHeight = m;
				this.maxWidth = l;
				this.way = h;
				this.facade = k.facade;
				this.plugin = k;
				this.orgPos = []
			},
			setBounds : function(h, l) {
				if (!l) {
					l = {
						width : ORYX.CONFIG.MAXIMUM_SIZE,
						height : ORYX.CONFIG.MAXIMUM_SIZE
					}
				}
				if (!h.bounds) {
					throw "Bounds not definined."
				}
				var k = {
					a : {
						x : h.bounds.upperLeft().x
								- (this.maxWidth - h.bounds.width()) / 2,
						y : h.bounds.upperLeft().y
								- (this.maxHeight - h.bounds.height()) / 2
					},
					b : {
						x : h.bounds.lowerRight().x
								+ (this.maxWidth - h.bounds.width()) / 2,
						y : h.bounds.lowerRight().y
								+ (this.maxHeight - h.bounds.height()) / 2
					}
				};
				if (this.maxWidth > l.width) {
					k.a.x = h.bounds.upperLeft().x
							- (l.width - h.bounds.width()) / 2;
					k.b.x = h.bounds.lowerRight().x
							+ (l.width - h.bounds.width()) / 2
				}
				if (this.maxHeight > l.height) {
					k.a.y = h.bounds.upperLeft().y
							- (l.height - h.bounds.height()) / 2;
					k.b.y = h.bounds.lowerRight().y
							+ (l.height - h.bounds.height()) / 2
				}
				h.bounds.set(k)
			},
			execute : function() {
				this.elements.each(function(h, k) {
					this.orgPos[k] = h.bounds.upperLeft();
					var l = this.bounds.clone();
					var o;
					if (h.parent && !(h.parent instanceof ORYX.Core.Canvas)) {
						var n = h.parent.absoluteBounds().upperLeft();
						l.moveBy(-n.x, -n.y)
					}
					switch (this.way) {
					case ORYX.CONFIG.EDITOR_ALIGN_BOTTOM:
						o = {
							x : h.bounds.upperLeft().x,
							y : l.b.y - h.bounds.height()
						};
						break;
					case ORYX.CONFIG.EDITOR_ALIGN_MIDDLE:
						o = {
							x : h.bounds.upperLeft().x,
							y : (l.a.y + l.b.y - h.bounds.height()) / 2
						};
						break;
					case ORYX.CONFIG.EDITOR_ALIGN_TOP:
						o = {
							x : h.bounds.upperLeft().x,
							y : l.a.y
						};
						break;
					case ORYX.CONFIG.EDITOR_ALIGN_LEFT:
						o = {
							x : l.a.x,
							y : h.bounds.upperLeft().y
						};
						break;
					case ORYX.CONFIG.EDITOR_ALIGN_CENTER:
						o = {
							x : (l.a.x + l.b.x - h.bounds.width()) / 2,
							y : h.bounds.upperLeft().y
						};
						break;
					case ORYX.CONFIG.EDITOR_ALIGN_RIGHT:
						o = {
							x : l.b.x - h.bounds.width(),
							y : h.bounds.upperLeft().y
						};
						break;
					case ORYX.CONFIG.EDITOR_ALIGN_SIZE:
						if (h.isResizable) {
							this.orgPos[k] = {
								a : h.bounds.upperLeft(),
								b : h.bounds.lowerRight()
							};
							this.setBounds(h, h.maximumSize)
						}
						break
					}
					if (o) {
						var m = {
							x : h.bounds.upperLeft().x - o.x,
							y : h.bounds.upperLeft().y - o.y
						};
						h.bounds.moveTo(o);
						this.plugin.layoutEdges(h, h.getAllDockedShapes(), m)
					}
				}.bind(this))
			},
			rollback : function() {
				this.elements.each(function(h, k) {
					if (this.way == ORYX.CONFIG.EDITOR_ALIGN_SIZE) {
						if (h.isResizable) {
							h.bounds.set(this.orgPos[k])
						}
					} else {
						h.bounds.moveTo(this.orgPos[k])
					}
				}.bind(this))
			}
		});
		var g = new a(f, e, c, d, parseInt(b), this);
		this.facade.executeCommands([ g ])
	}
});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.Save = Clazz
		.extend({
			facade : undefined,
			processURI : undefined,
			changeSymbol : "*",
			construct : function(a) {
				this.facade = a;
				document.addEventListener("keydown", function(b) {
					if (b.ctrlKey && b.keyCode === 83) {
						Event.stop(b)
					}
				}, false);
				window.onbeforeunload = this.onUnLoad.bind(this);
				this.changeDifference = 0;
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_UNDO_EXECUTE,
						function() {
							this.changeDifference++;
							this.updateTitle()
						}.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_EXECUTE_COMMANDS,
						function() {
							this.changeDifference++;
							this.updateTitle()
						}.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_SAVED,
						function() {
							this.changeDifference = 0;
							this.updateTitle()
						}.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_UNDO_ROLLBACK,
						function() {
							this.changeDifference--;
							this.updateTitle()
						}.bind(this));
				this.hasChanges = this._hasChanges.bind(this)
			},
			updateTitle : function() {
				var a = window.document.title
						|| document.getElementsByTagName("title")[0].childNodes[0].nodeValue;
				if (this.changeDifference === 0
						&& a.startsWith(this.changeSymbol)) {
					window.document.title = a.slice(1)
				} else {
					if (this.changeDifference !== 0
							&& !a.startsWith(this.changeSymbol)) {
						window.document.title = this.changeSymbol + "" + a
					}
				}
			},
			_hasChanges : function() {
				return this.changeDifference !== 0
						|| (this.facade.getModelMetaData()["new"] && this.facade
								.getCanvas().getChildShapes().size() > 0)
			},
			onUnLoad : function() {
				if (this._hasChanges()) {
					return ORYX.I18N.Save.unsavedData
				}
			}
		});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.DragDropResize = ORYX.Plugins.AbstractPlugin
		.extend({
			construct : function(b) {
				this.facade = b;
				this.currentShapes = [];
				this.toMoveShapes = [];
				this.distPoints = [];
				this.isResizing = false;
				this.dragEnable = false;
				this.dragIntialized = false;
				this.edgesMovable = true;
				this.offSetPosition = {
					x : 0,
					y : 0
				};
				this.faktorXY = {
					x : 1,
					y : 1
				};
				this.containmentParentNode;
				this.isAddingAllowed = false;
				this.isAttachingAllowed = false;
				this.callbackMouseMove = this.handleMouseMove.bind(this);
				this.callbackMouseUp = this.handleMouseUp.bind(this);
				var a = this.facade.getCanvas().getSvgContainer();
				this.selectedRect = new ORYX.Plugins.SelectedRect(a);
				if (ORYX.CONFIG.SHOW_GRIDLINE) {
					this.vLine = new ORYX.Plugins.GridLine(a,
							ORYX.Plugins.GridLine.DIR_VERTICAL);
					this.hLine = new ORYX.Plugins.GridLine(a,
							ORYX.Plugins.GridLine.DIR_HORIZONTAL)
				}
				a = this.facade.getCanvas().getHTMLContainer();
				this.scrollNode = this.facade.getCanvas().rootNode.parentNode.parentNode;
				this.resizerSE = new ORYX.Plugins.Resizer(a, "southeast",
						this.facade);
				this.resizerSE.registerOnResize(this.onResize.bind(this));
				this.resizerSE.registerOnResizeEnd(this.onResizeEnd.bind(this));
				this.resizerSE.registerOnResizeStart(this.onResizeStart
						.bind(this));
				this.resizerNW = new ORYX.Plugins.Resizer(a, "northwest",
						this.facade);
				this.resizerNW.registerOnResize(this.onResize.bind(this));
				this.resizerNW.registerOnResizeEnd(this.onResizeEnd.bind(this));
				this.resizerNW.registerOnResizeStart(this.onResizeStart
						.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEDOWN,
						this.handleMouseDown.bind(this))
			},
			handleMouseDown : function(d, c) {
				if (!this.dragBounds || !this.currentShapes.member(c)
						|| !this.toMoveShapes.length) {
					return

					

										

					

				}
				this.dragEnable = true;
				this.dragIntialized = true;
				this.edgesMovable = true;
				var b = this.facade.getCanvas().node.getScreenCTM();
				this.faktorXY.x = b.a;
				this.faktorXY.y = b.d;
				var g = Event.pointerX(d);
				var e = Event.pointerY(d);
				var f = this.dragBounds.upperLeft();
				this.offSetPosition = {
					x : g - (f.x * this.faktorXY.x),
					y : e - (f.y * this.faktorXY.y)
				};
				this.offsetScroll = {
					x : this.scrollNode.scrollLeft,
					y : this.scrollNode.scrollTop
				};
				document.documentElement.addEventListener(
						ORYX.CONFIG.EVENT_MOUSEMOVE, this.callbackMouseMove,
						false);
				document.documentElement.addEventListener(
						ORYX.CONFIG.EVENT_MOUSEUP, this.callbackMouseUp, true);
				return

				

								

				

			},
			handleMouseUp : function(d) {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
					highlightId : "dragdropresize.contain"
				});
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
					highlightId : "dragdropresize.attached"
				});
				if (this.dragEnable) {
					if (!this.dragIntialized) {
						this.afterDrag();
						if (this.isAttachingAllowed
								&& this.toMoveShapes.length == 1
								&& this.toMoveShapes[0] instanceof ORYX.Core.Node
								&& this.toMoveShapes[0].dockers.length > 0) {
							var b = this.facade.eventCoordinates(d);
							var e = this.toMoveShapes[0].dockers[0];
							var c = ORYX.Core.Command
									.extend({
										construct : function(k, f, h, g) {
											this.docker = k;
											this.newPosition = f;
											this.newDockedShape = h;
											this.newParent = h.parent
													|| g.getCanvas();
											this.oldPosition = k.parent.bounds
													.center();
											this.oldDockedShape = k
													.getDockedShape();
											this.oldParent = k.parent.parent
													|| g.getCanvas();
											this.facade = g;
											if (this.oldDockedShape) {
												this.oldPosition = k.parent
														.absoluteBounds()
														.center()
											}
										},
										execute : function() {
											this.dock(this.newDockedShape,
													this.newParent,
													this.newPosition);
											this.facade
													.raiseEvent({
														type : ORYX.CONFIG.EVENT_ARRANGEMENT_TOP,
														excludeCommand : true
													})
										},
										rollback : function() {
											this.dock(this.oldDockedShape,
													this.oldParent,
													this.oldPosition)
										},
										dock : function(f, g, h) {
											g.add(this.docker.parent);
											this.docker
													.setDockedShape(undefined);
											this.docker.bounds.centerMoveTo(h);
											this.docker.setDockedShape(f);
											this.facade
													.setSelection([ this.docker.parent ]);
											this.facade.getCanvas().update();
											this.facade.updateSelection()
										}
									});
							var a = [ new c(e, b, this.containmentParentNode,
									this.facade) ];
							this.facade.executeCommands(a)
						} else {
							if (this.isAddingAllowed) {
								this.refreshSelectedShapes()
							}
						}
						this.facade.updateSelection();
						this.facade.raiseEvent({
							type : ORYX.CONFIG.EVENT_DRAGDROP_END
						})
					}
					if (this.vLine) {
						this.vLine.hide()
					}
					if (this.hLine) {
						this.hLine.hide()
					}
				}
				this.dragEnable = false;
				document.documentElement.removeEventListener(
						ORYX.CONFIG.EVENT_MOUSEUP, this.callbackMouseUp, true);
				document.documentElement.removeEventListener(
						ORYX.CONFIG.EVENT_MOUSEMOVE, this.callbackMouseMove,
						false);
				return

				

								

				

			},
			handleMouseMove : function(b) {
				if (!this.dragEnable) {
					return

					

										

					

				}
				if (this.dragIntialized) {
					this.facade.raiseEvent({
						type : ORYX.CONFIG.EVENT_DRAGDROP_START
					});
					this.dragIntialized = false;
					this.resizerSE.hide();
					this.resizerNW.hide();
					this._onlyEdges = this.currentShapes.all(function(c) {
						return (c instanceof ORYX.Core.Edge)
					});
					this.beforeDrag();
					this._currentUnderlyingNodes = []
				}
				var e = {
					x : Event.pointerX(b) - this.offSetPosition.x,
					y : Event.pointerY(b) - this.offSetPosition.y
				};
				e.x -= this.offsetScroll.x - this.scrollNode.scrollLeft;
				e.y -= this.offsetScroll.y - this.scrollNode.scrollTop;
				var k = b.shiftKey || b.ctrlKey;
				if (ORYX.CONFIG.GRID_ENABLED && !k) {
					e = this.snapToGrid(e)
				} else {
					if (this.vLine) {
						this.vLine.hide()
					}
					if (this.hLine) {
						this.hLine.hide()
					}
				}
				e.x /= this.faktorXY.x;
				e.y /= this.faktorXY.y;
				e.x = Math.max(0, e.x);
				e.y = Math.max(0, e.y);
				var g = this.facade.getCanvas();
				e.x = Math.min(g.bounds.width() - this.dragBounds.width(), e.x);
				e.y = Math.min(g.bounds.height() - this.dragBounds.height(),
						e.y);
				this.dragBounds.moveTo(e);
				this.resizeRectangle(this.dragBounds);
				this.isAttachingAllowed = false;
				var f = this.facade.eventCoordinates(b);
				var a = 1;
				if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
					var d = navigator.userAgent;
					if (d.indexOf("MSIE") >= 0) {
						var m = Math
								.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
						if (m !== 100) {
							a = m / 100
						}
					}
				}
				if (a !== 1) {
					f.x = f.x / a;
					f.y = f.y / a
				}
				var l = $A(this.facade.getCanvas().getAbstractShapesAtPosition(
						f));
				var h = this.toMoveShapes.length == 1
						&& this.toMoveShapes[0] instanceof ORYX.Core.Node
						&& this.toMoveShapes[0].dockers.length > 0;
				h = h && l.length != 1;
				if (!h && l.length === this._currentUnderlyingNodes.length
						&& l.all(function(o, c) {
							return this._currentUnderlyingNodes[c] === o
						}.bind(this))) {
					return

					

										

					

				} else {
					if (this._onlyEdges) {
						this.isAddingAllowed = true;
						this.containmentParentNode = this.facade.getCanvas()
					} else {
						var n = {
							event : b,
							underlyingNodes : l,
							checkIfAttachable : h
						};
						this.checkRules(n)
					}
				}
				this._currentUnderlyingNodes = l.reverse();
				if (this.isAttachingAllowed) {
					this.facade
							.raiseEvent({
								type : ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
								highlightId : "dragdropresize.attached",
								elements : [ this.containmentParentNode ],
								style : ORYX.CONFIG.SELECTION_HIGHLIGHT_STYLE_RECTANGLE,
								color : ORYX.CONFIG.SELECTION_VALID_COLOR
							})
				} else {
					this.facade.raiseEvent({
						type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
						highlightId : "dragdropresize.attached"
					})
				}
				if (!this.isAttachingAllowed) {
					if (this.isAddingAllowed) {
						this.facade.raiseEvent({
							type : ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
							highlightId : "dragdropresize.contain",
							elements : [ this.containmentParentNode ],
							color : ORYX.CONFIG.SELECTION_VALID_COLOR
						})
					} else {
						this.facade.raiseEvent({
							type : ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
							highlightId : "dragdropresize.contain",
							elements : [ this.containmentParentNode ],
							color : ORYX.CONFIG.SELECTION_INVALID_COLOR
						})
					}
				} else {
					this.facade.raiseEvent({
						type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
						highlightId : "dragdropresize.contain"
					})
				}
				return

				

								

				

			},
			checkRules : function(d) {
				var f = d.event;
				var c = d.underlyingNodes;
				var e = d.checkIfAttachable;
				var b = d.noEdges;
				this.containmentParentNode = c
						.reverse()
						.find(
								(function(g) {
									return (g instanceof ORYX.Core.Canvas)
											|| (((g instanceof ORYX.Core.Node) || ((g instanceof ORYX.Core.Edge) && !b)) && (!(this.currentShapes
													.member(g) || this.currentShapes
													.any(function(h) {
														return (h.children.length > 0 && h
																.getChildNodes(
																		true)
																.member(g))
													}))))
								}).bind(this));
				if (e) {
					this.isAttachingAllowed = this.facade.getRules()
							.canConnect({
								sourceShape : this.containmentParentNode,
								edgeShape : this.toMoveShapes[0],
								targetShape : this.toMoveShapes[0]
							});
					if (this.isAttachingAllowed) {
						var a = this.facade.eventCoordinates(f);
						this.isAttachingAllowed = this.containmentParentNode
								.isPointOverOffset(a.x, a.y)
					}
				}
				if (!this.isAttachingAllowed) {
					this.isAddingAllowed = this.toMoveShapes
							.all((function(g) {
								if (g instanceof ORYX.Core.Edge
										|| g instanceof ORYX.Core.Controls.Docker
										|| this.containmentParentNode === g.parent) {
									return true
								} else {
									if (this.containmentParentNode !== g) {
										if (!(this.containmentParentNode instanceof ORYX.Core.Edge)
												|| !b) {
											if (this.facade
													.getRules()
													.canContain(
															{
																containingShape : this.containmentParentNode,
																containedShape : g
															})) {
												return true
											}
										}
									}
								}
								return false
							}).bind(this))
				}
				if (!this.isAttachingAllowed
						&& !this.isAddingAllowed
						&& (this.containmentParentNode instanceof ORYX.Core.Edge)) {
					d.noEdges = true;
					d.underlyingNodes.reverse();
					this.checkRules(d)
				}
			},
			refreshSelectedShapes : function() {
				if (!this.dragBounds) {
					return

					

										

					

				}
				var d = this.dragBounds.upperLeft();
				var b = this.oldDragBounds.upperLeft();
				var c = {
					x : d.x - b.x,
					y : d.y - b.y
				};
				var a = [ new ORYX.Core.Command.Move(this.toMoveShapes, c,
						this.containmentParentNode, this.currentShapes, this) ];
				if (this._undockedEdgesCommand instanceof ORYX.Core.Command) {
					a.unshift(this._undockedEdgesCommand)
				}
				this.facade.executeCommands(a);
				if (this.dragBounds) {
					this.oldDragBounds = this.dragBounds.clone()
				}
			},
			onResize : function(a) {
				if (!this.dragBounds) {
					return

					

										

					

				}
				this.dragBounds = a;
				this.isResizing = true;
				this.resizeRectangle(this.dragBounds)
			},
			onResizeStart : function() {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_RESIZE_START
				})
			},
			onResizeEnd : function() {
				if (!(this.currentShapes instanceof Array)
						|| this.currentShapes.length <= 0) {
					return

					

										

					

				}
				if (this.isResizing) {
					var a = ORYX.Core.Command.extend({
						construct : function(f, h, g) {
							this.shape = f;
							this.oldBounds = f.bounds.clone();
							this.newBounds = h;
							this.plugin = g
						},
						execute : function() {
							this.shape.bounds.set(this.newBounds.a,
									this.newBounds.b);
							this.update(this.getOffset(this.oldBounds,
									this.newBounds))
						},
						rollback : function() {
							this.shape.bounds.set(this.oldBounds.a,
									this.oldBounds.b);
							this.update(this.getOffset(this.newBounds,
									this.oldBounds))
						},
						getOffset : function(g, f) {
							return {
								x : f.a.x - g.a.x,
								y : f.a.y - g.a.y,
								xs : f.width() / g.width(),
								ys : f.height() / g.height()
							}
						},
						update : function(g) {
							this.shape.getLabels().each(function(h) {
								h.changed()
							});
							var f = [].concat(this.shape.getIncomingShapes())
									.concat(this.shape.getOutgoingShapes())
									.findAll(function(h) {
										return h instanceof ORYX.Core.Edge
									}.bind(this));
							this.plugin.layoutEdges(this.shape, f, g);
							this.plugin.facade.setSelection([ this.shape ]);
							this.plugin.facade.getCanvas().update();
							this.plugin.facade.updateSelection()
						}
					});
					var c = this.dragBounds.clone();
					var b = this.currentShapes[0];
					if (b.parent) {
						var e = b.parent.absoluteXY();
						c.moveBy(-e.x, -e.y)
					}
					var d = new a(b, c, this);
					this.facade.executeCommands([ d ]);
					this.isResizing = false;
					this.facade.raiseEvent({
						type : ORYX.CONFIG.EVENT_RESIZE_END
					})
				}
			},
			beforeDrag : function() {
				var a = ORYX.Core.Command.extend({
					construct : function(b) {
						this.dockers = b.collect(function(c) {
							return c instanceof ORYX.Core.Controls.Docker ? {
								docker : c,
								dockedShape : c.getDockedShape(),
								refPoint : c.referencePoint
							} : undefined
						}).compact()
					},
					execute : function() {
						this.dockers.each(function(b) {
							b.docker.setDockedShape(undefined)
						})
					},
					rollback : function() {
						this.dockers.each(function(b) {
							b.docker.setDockedShape(b.dockedShape);
							b.docker.setReferencePoint(b.refPoint)
						})
					}
				});
				this._undockedEdgesCommand = new a(this.toMoveShapes);
				this._undockedEdgesCommand.execute()
			},
			hideAllLabels : function(a) {
				a.getLabels().each(function(b) {
					b.hide()
				});
				a.getAllDockedShapes().each(function(b) {
					var c = b.getLabels();
					if (c.length > 0) {
						c.each(function(d) {
							d.hide()
						})
					}
				});
				a.getChildren().each((function(b) {
					if (b instanceof ORYX.Core.Shape) {
						this.hideAllLabels(b)
					}
				}).bind(this))
			},
			afterDrag : function() {
			},
			showAllLabels : function(a) {
				for (var d = 0; d < a.length; d++) {
					var b = a[d];
					b.show()
				}
				var f = a.getAllDockedShapes();
				for (var d = 0; d < f.length; d++) {
					var c = f[d];
					var g = c.getLabels();
					if (g.length > 0) {
						g.each(function(h) {
							h.show()
						})
					}
				}
				for (var d = 0; d < a.children.length; d++) {
					var e = a.children[d];
					if (e instanceof ORYX.Core.Shape) {
						this.showAllLabels(e)
					}
				}
			},
			onSelectionChanged : function(b) {
				var d = b.elements;
				this.dragEnable = false;
				this.dragIntialized = false;
				this.resizerSE.hide();
				this.resizerNW.hide();
				if (!d || d.length == 0) {
					this.selectedRect.hide();
					this.currentShapes = [];
					this.toMoveShapes = [];
					this.dragBounds = undefined;
					this.oldDragBounds = undefined
				} else {
					this.currentShapes = d;
					var e = this.facade.getCanvas()
							.getShapesWithSharedParent(d);
					this.toMoveShapes = e;
					this.toMoveShapes = this.toMoveShapes.findAll(function(f) {
						return f instanceof ORYX.Core.Node
								&& (f.dockers.length === 0 || !d
										.member(f.dockers.first()
												.getDockedShape()))
					});
					d.each((function(f) {
						if (!(f instanceof ORYX.Core.Edge)) {
							return

							

														

							

						}
						var h = f.getDockers();
						var k = d.member(h.first().getDockedShape());
						var g = d.member(h.last().getDockedShape());
						if (!k && !g) {
							var l = !h.first().getDockedShape()
									&& !h.last().getDockedShape();
							if (l) {
								this.toMoveShapes = this.toMoveShapes.concat(h)
							}
						}
						if (f.dockers.length > 2 && k && g) {
							this.toMoveShapes = this.toMoveShapes.concat(h
									.findAll(function(n, m) {
										return m > 0 && m < h.length - 1
									}))
						}
					}).bind(this));
					var c = undefined;
					this.toMoveShapes.each(function(g) {
						var f = g;
						if (g instanceof ORYX.Core.Controls.Docker) {
							f = g.parent
						}
						if (!c) {
							c = f.absoluteBounds()
						} else {
							c.include(f.absoluteBounds())
						}
					}.bind(this));
					if (!c) {
						d.each(function(f) {
							if (!c) {
								c = f.absoluteBounds()
							} else {
								c.include(f.absoluteBounds())
							}
						})
					}
					this.dragBounds = c;
					this.oldDragBounds = c.clone();
					this.resizeRectangle(c);
					this.selectedRect.show();
					if (d.length == 1 && d[0].isResizable) {
						var a = d[0].getStencil().fixedAspectRatio() ? d[0].bounds
								.width()
								/ d[0].bounds.height()
								: undefined;
						this.resizerSE.setBounds(this.dragBounds,
								d[0].minimumSize, d[0].maximumSize, a);
						this.resizerSE.show();
						this.resizerNW.setBounds(this.dragBounds,
								d[0].minimumSize, d[0].maximumSize, a);
						this.resizerNW.show()
					} else {
						this.resizerSE.setBounds(undefined);
						this.resizerNW.setBounds(undefined)
					}
					if (ORYX.CONFIG.GRID_ENABLED) {
						this.distPoints = [];
						if (this.distPointTimeout) {
							window.clearTimeout(this.distPointTimeout)
						}
						this.distPointTimeout = window.setTimeout(function() {
							var f = this.facade.getCanvas()
									.getChildShapes(true).findAll(function(h) {
										var g = h.parent;
										while (g) {
											if (d.member(g)) {
												return false
											}
											g = g.parent
										}
										return true
									});
							f.each((function(l) {
								if (!(l instanceof ORYX.Core.Edge)) {
									var h = l.absoluteXY();
									var k = l.bounds.width();
									var g = l.bounds.height();
									this.distPoints.push({
										ul : {
											x : h.x,
											y : h.y
										},
										c : {
											x : h.x + (k / 2),
											y : h.y + (g / 2)
										},
										lr : {
											x : h.x + k,
											y : h.y + g
										}
									})
								}
							}).bind(this))
						}.bind(this), 10)
					}
				}
			},
			snapToGrid : function(h) {
				var a = this.dragBounds;
				var p = {};
				var o = 6;
				var m = 10;
				var q = 6;
				var b = this.vLine ? this.vLine.getScale() : 1;
				var l = {
					x : (h.x / b),
					y : (h.y / b)
				};
				var n = {
					x : (h.x / b) + (a.width() / 2),
					y : (h.y / b) + (a.height() / 2)
				};
				var g = {
					x : (h.x / b) + (a.width()),
					y : (h.y / b) + (a.height())
				};
				var f, d;
				var k, e;
				this.distPoints.each(function(s) {
					var c, u, t, r;
					if (Math.abs(s.c.x - n.x) < m) {
						c = s.c.x - n.x;
						t = s.c.x
					}
					if (Math.abs(s.c.y - n.y) < m) {
						u = s.c.y - n.y;
						r = s.c.y
					}
					if (c !== undefined) {
						f = f === undefined ? c
								: (Math.abs(c) < Math.abs(f) ? c : f);
						if (f === c) {
							k = t
						}
					}
					if (u !== undefined) {
						d = d === undefined ? u
								: (Math.abs(u) < Math.abs(d) ? u : d);
						if (d === u) {
							e = r
						}
					}
				});
				if (f !== undefined) {
					l.x += f;
					l.x *= b;
					if (this.vLine && k) {
						this.vLine.update(k)
					}
				} else {
					l.x = (h.x - (h.x % (ORYX.CONFIG.GRID_DISTANCE / 2)));
					if (this.vLine) {
						this.vLine.hide()
					}
				}
				if (d !== undefined) {
					l.y += d;
					l.y *= b;
					if (this.hLine && e) {
						this.hLine.update(e)
					}
				} else {
					l.y = (h.y - (h.y % (ORYX.CONFIG.GRID_DISTANCE / 2)));
					if (this.hLine) {
						this.hLine.hide()
					}
				}
				return l
			},
			showGridLine : function() {
			},
			resizeRectangle : function(a) {
				this.selectedRect.resize(a)
			}
		});
ORYX.Plugins.SelectedRect = Clazz.extend({
	construct : function(a) {
		this.parentId = a;
		this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg", $(a),
				[ "g" ]);
		this.dashedArea = ORYX.Editor.graft("http://www.w3.org/2000/svg",
				this.node, [ "rect", {
					x : 0,
					y : 0,
					"stroke-width" : 1,
					stroke : "#777777",
					fill : "none",
					"stroke-dasharray" : "2,2",
					"pointer-events" : "none"
				} ]);
		this.hide()
	},
	hide : function() {
		this.node.setAttributeNS(null, "display", "none")
	},
	show : function() {
		this.node.setAttributeNS(null, "display", "")
	},
	resize : function(a) {
		var c = a.upperLeft();
		var b = ORYX.CONFIG.SELECTED_AREA_PADDING;
		this.dashedArea.setAttributeNS(null, "width", a.width() + 2 * b);
		this.dashedArea.setAttributeNS(null, "height", a.height() + 2 * b);
		this.node.setAttributeNS(null, "transform", "translate(" + (c.x - b)
				+ ", " + (c.y - b) + ")")
	}
});
ORYX.Plugins.GridLine = Clazz.extend({
	construct : function(b, a) {
		if (ORYX.Plugins.GridLine.DIR_HORIZONTAL !== a
				&& ORYX.Plugins.GridLine.DIR_VERTICAL !== a) {
			a = ORYX.Plugins.GridLine.DIR_HORIZONTAL
		}
		this.parent = $(b);
		this.direction = a;
		this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg",
				this.parent, [ "g" ]);
		this.line = ORYX.Editor.graft("http://www.w3.org/2000/svg", this.node,
				[ "path", {
					"stroke-width" : 1,
					stroke : "silver",
					fill : "none",
					"stroke-dasharray" : "5,5",
					"pointer-events" : "none"
				} ]);
		this.hide()
	},
	hide : function() {
		this.node.setAttributeNS(null, "display", "none")
	},
	show : function() {
		this.node.setAttributeNS(null, "display", "")
	},
	getScale : function() {
		try {
			return this.parent.parentNode.transform.baseVal.getItem(0).matrix.a
		} catch (a) {
			return 1
		}
	},
	update : function(e) {
		if (this.direction === ORYX.Plugins.GridLine.DIR_HORIZONTAL) {
			var d = e instanceof Object ? e.y : e;
			var c = this.parent.parentNode.parentNode.width.baseVal.value
					/ this.getScale();
			this.line.setAttributeNS(null, "d", "M 0 " + d + " L " + c + " "
					+ d)
		} else {
			var a = e instanceof Object ? e.x : e;
			var b = this.parent.parentNode.parentNode.height.baseVal.value
					/ this.getScale();
			this.line
					.setAttributeNS(null, "d", "M" + a + " 0 L " + a + " " + b)
		}
		this.show()
	}
});
ORYX.Plugins.GridLine.DIR_HORIZONTAL = "hor";
ORYX.Plugins.GridLine.DIR_VERTICAL = "ver";
ORYX.Plugins.Resizer = Clazz.extend({
	construct : function(c, a, b) {
		this.parentId = c;
		this.orientation = a;
		this.facade = b;
		this.node = ORYX.Editor.graft("http://www.w3.org/1999/xhtml",
				$("canvasSection"), [ "div", {
					"class" : "resizer_" + this.orientation,
					style : "left:0px; top:0px;position:absolute;"
				} ]);
		this.node.addEventListener(ORYX.CONFIG.EVENT_MOUSEDOWN,
				this.handleMouseDown.bind(this), true);
		document.documentElement.addEventListener(ORYX.CONFIG.EVENT_MOUSEUP,
				this.handleMouseUp.bind(this), true);
		document.documentElement.addEventListener(ORYX.CONFIG.EVENT_MOUSEMOVE,
				this.handleMouseMove.bind(this), false);
		this.dragEnable = false;
		this.offSetPosition = {
			x : 0,
			y : 0
		};
		this.bounds = undefined;
		this.canvasNode = this.facade.getCanvas().node;
		this.minSize = undefined;
		this.maxSize = undefined;
		this.aspectRatio = undefined;
		this.resizeCallbacks = [];
		this.resizeStartCallbacks = [];
		this.resizeEndCallbacks = [];
		this.hide();
		this.scrollNode = this.node.parentNode.parentNode.parentNode
	},
	handleMouseDown : function(a) {
		this.dragEnable = true;
		this.offsetScroll = {
			x : this.scrollNode.scrollLeft,
			y : this.scrollNode.scrollTop
		};
		this.offSetPosition = {
			x : Event.pointerX(a) - this.position.x,
			y : Event.pointerY(a) - this.position.y
		};
		this.resizeStartCallbacks.each((function(b) {
			b(this.bounds)
		}).bind(this))
	},
	handleMouseUp : function(a) {
		this.dragEnable = false;
		this.containmentParentNode = null;
		this.resizeEndCallbacks.each((function(b) {
			b(this.bounds)
		}).bind(this))
	},
	handleMouseMove : function(b) {
		if (!this.dragEnable) {
			return

			

						

			

		}
		if (b.shiftKey || b.ctrlKey) {
			this.aspectRatio = this.bounds.width() / this.bounds.height()
		} else {
			this.aspectRatio = undefined
		}
		var a = {
			x : Event.pointerX(b) - this.offSetPosition.x,
			y : Event.pointerY(b) - this.offSetPosition.y
		};
		a.x -= this.offsetScroll.x - this.scrollNode.scrollLeft;
		a.y -= this.offsetScroll.y - this.scrollNode.scrollTop;
		a.x = Math.min(a.x, this.facade.getCanvas().bounds.width());
		a.y = Math.min(a.y, this.facade.getCanvas().bounds.height());
		var c = {
			x : a.x - this.position.x,
			y : a.y - this.position.y
		};
		if (this.aspectRatio) {
			newAspectRatio = (this.bounds.width() + c.x)
					/ (this.bounds.height() + c.y);
			if (newAspectRatio > this.aspectRatio) {
				c.x = this.aspectRatio * (this.bounds.height() + c.y)
						- this.bounds.width()
			} else {
				if (newAspectRatio < this.aspectRatio) {
					c.y = (this.bounds.width() + c.x) / this.aspectRatio
							- this.bounds.height()
				}
			}
		}
		if (this.orientation === "northwest") {
			if (this.bounds.width() - c.x > this.maxSize.width) {
				c.x = -(this.maxSize.width - this.bounds.width());
				if (this.aspectRatio) {
					c.y = this.aspectRatio * c.x
				}
			}
			if (this.bounds.width() - c.x < this.minSize.width) {
				c.x = -(this.minSize.width - this.bounds.width());
				if (this.aspectRatio) {
					c.y = this.aspectRatio * c.x
				}
			}
			if (this.bounds.height() - c.y > this.maxSize.height) {
				c.y = -(this.maxSize.height - this.bounds.height());
				if (this.aspectRatio) {
					c.x = c.y / this.aspectRatio
				}
			}
			if (this.bounds.height() - c.y < this.minSize.height) {
				c.y = -(this.minSize.height - this.bounds.height());
				if (this.aspectRatio) {
					c.x = c.y / this.aspectRatio
				}
			}
		} else {
			if (this.bounds.width() + c.x > this.maxSize.width) {
				c.x = this.maxSize.width - this.bounds.width();
				if (this.aspectRatio) {
					c.y = this.aspectRatio * c.x
				}
			}
			if (this.bounds.width() + c.x < this.minSize.width) {
				c.x = this.minSize.width - this.bounds.width();
				if (this.aspectRatio) {
					c.y = this.aspectRatio * c.x
				}
			}
			if (this.bounds.height() + c.y > this.maxSize.height) {
				c.y = this.maxSize.height - this.bounds.height();
				if (this.aspectRatio) {
					c.x = c.y / this.aspectRatio
				}
			}
			if (this.bounds.height() + c.y < this.minSize.height) {
				c.y = this.minSize.height - this.bounds.height();
				if (this.aspectRatio) {
					c.x = c.y / this.aspectRatio
				}
			}
		}
		if (this.orientation === "northwest") {
			this.bounds.extend({
				x : -c.x,
				y : -c.y
			});
			this.bounds.moveBy(c)
		} else {
			this.bounds.extend(c)
		}
		this.update();
		this.resizeCallbacks.each((function(d) {
			d(this.bounds)
		}).bind(this));
		Event.stop(b)
	},
	registerOnResizeStart : function(a) {
		if (!this.resizeStartCallbacks.member(a)) {
			this.resizeStartCallbacks.push(a)
		}
	},
	unregisterOnResizeStart : function(a) {
		if (this.resizeStartCallbacks.member(a)) {
			this.resizeStartCallbacks = this.resizeStartCallbacks.without(a)
		}
	},
	registerOnResizeEnd : function(a) {
		if (!this.resizeEndCallbacks.member(a)) {
			this.resizeEndCallbacks.push(a)
		}
	},
	unregisterOnResizeEnd : function(a) {
		if (this.resizeEndCallbacks.member(a)) {
			this.resizeEndCallbacks = this.resizeEndCallbacks.without(a)
		}
	},
	registerOnResize : function(a) {
		if (!this.resizeCallbacks.member(a)) {
			this.resizeCallbacks.push(a)
		}
	},
	unregisterOnResize : function(a) {
		if (this.resizeCallbacks.member(a)) {
			this.resizeCallbacks = this.resizeCallbacks.without(a)
		}
	},
	hide : function() {
		this.node.style.display = "none"
	},
	show : function() {
		if (this.bounds) {
			this.node.style.display = ""
		}
	},
	setBounds : function(d, b, a, c) {
		this.bounds = d;
		if (!b) {
			b = {
				width : ORYX.CONFIG.MINIMUM_SIZE,
				height : ORYX.CONFIG.MINIMUM_SIZE
			}
		}
		if (!a) {
			a = {
				width : ORYX.CONFIG.MAXIMUM_SIZE,
				height : ORYX.CONFIG.MAXIMUM_SIZE
			}
		}
		this.minSize = b;
		this.maxSize = a;
		this.aspectRatio = c;
		this.update()
	},
	update : function() {
		if (!this.bounds) {
			return

			

						

			

		}
		var d = this.bounds.upperLeft();
		if (this.bounds.width() < this.minSize.width) {
			this.bounds.set(d.x, d.y, d.x + this.minSize.width, d.y
					+ this.bounds.height())
		}
		if (this.bounds.height() < this.minSize.height) {
			this.bounds.set(d.x, d.y, d.x + this.bounds.width(), d.y
					+ this.minSize.height)
		}
		if (this.bounds.width() > this.maxSize.width) {
			this.bounds.set(d.x, d.y, d.x + this.maxSize.width, d.y
					+ this.bounds.height())
		}
		if (this.bounds.height() > this.maxSize.height) {
			this.bounds.set(d.x, d.y, d.x + this.bounds.width(), d.y
					+ this.maxSize.height)
		}
		var g = this.canvasNode.getScreenCTM();
		d.x *= g.a;
		d.y *= g.d;
		var b = 1;
		if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
			var c = navigator.userAgent;
			if (c.indexOf("MSIE") >= 0) {
				var m = Math
						.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
				if (m !== 100) {
					b = m / 100
				}
			}
		}
		if (b === 1) {
			d.y = d.y - jQuery("#canvasSection").offset().top + g.f;
			d.x = d.x - jQuery("#canvasSection").offset().left + g.e
		} else {
			var h = jQuery("#canvasSection").offset().left;
			var k = jQuery("#canvasSection").scrollLeft();
			var f = jQuery("#canvasSection").scrollTop();
			var e = g.e - (h * b);
			var l = 0;
			if (e > 10) {
				l = (e / b) - e
			}
			d.y = d.y - (jQuery("#canvasSection").offset().top * b)
					+ ((f * b) - f) + g.f;
			d.x = d.x - (h * b) + l + ((k * b) - k) + g.e
		}
		if (this.orientation === "northwest") {
			d.x -= 13;
			d.y -= 13
		} else {
			d.x += (g.a * this.bounds.width()) + 3;
			d.y += (g.d * this.bounds.height()) + 3
		}
		this.position = d;
		this.node.style.left = this.position.x + "px";
		this.node.style.top = this.position.y + "px"
	}
});
ORYX.Core.Command.Move = ORYX.Core.Command
		.extend({
			construct : function(b, e, c, a, d) {
				this.moveShapes = b;
				this.selectedShapes = a;
				this.offset = e;
				this.plugin = d;
				this.newParents = b.collect(function(f) {
					return c || f.parent
				});
				this.oldParents = b.collect(function(f) {
					return f.parent
				});
				this.dockedNodes = b.findAll(function(f) {
					return f instanceof ORYX.Core.Node && f.dockers.length == 1
				}).collect(function(f) {
					return {
						docker : f.dockers[0],
						dockedShape : f.dockers[0].getDockedShape(),
						refPoint : f.dockers[0].referencePoint
					}
				})
			},
			execute : function() {
				this.dockAllShapes();
				this.move(this.offset);
				this.addShapeToParent(this.newParents);
				this.selectCurrentShapes();
				this.plugin.facade.getCanvas().update();
				this.plugin.facade.updateSelection()
			},
			rollback : function() {
				var a = {
					x : -this.offset.x,
					y : -this.offset.y
				};
				this.move(a);
				this.addShapeToParent(this.oldParents);
				this.dockAllShapes(true);
				this.selectCurrentShapes();
				this.plugin.facade.getCanvas().update();
				this.plugin.facade.updateSelection()
			},
			move : function(d, a) {
				for (var g = 0; g < this.moveShapes.length; g++) {
					var l = this.moveShapes[g];
					l.bounds.moveBy(d);
					if (l instanceof ORYX.Core.Node) {
						(l.dockers || []).each(function(k) {
							k.bounds.moveBy(d)
						});
						var e = []
								.concat(l.getIncomingShapes())
								.concat(l.getOutgoingShapes())
								.findAll(
										function(k) {
											return k instanceof ORYX.Core.Edge
													&& !this.moveShapes
															.any(function(m) {
																return m == k
																		|| (m instanceof ORYX.Core.Controls.Docker && m.parent == k)
															})
										}.bind(this))
								.findAll(
										function(k) {
											return (k.dockers.first()
													.getDockedShape() == l || !this.moveShapes
													.include(k.dockers.first()
															.getDockedShape()))
													&& (k.dockers.last()
															.getDockedShape() == l || !this.moveShapes
															.include(k.dockers
																	.last()
																	.getDockedShape()))
										}.bind(this));
						this.plugin.layoutEdges(l, e, d);
						var h = []
								.concat(l.getIncomingShapes())
								.concat(l.getOutgoingShapes())
								.findAll(
										function(k) {
											return k instanceof ORYX.Core.Edge
													&& k.dockers.first()
															.isDocked()
													&& k.dockers.last()
															.isDocked()
													&& !this.moveShapes
															.include(k)
													&& !this.moveShapes
															.any(function(m) {
																return m == k
																		|| (m instanceof ORYX.Core.Controls.Docker && m.parent == k)
															})
										}.bind(this))
								.findAll(
										function(k) {
											return this.moveShapes
													.indexOf(k.dockers.first()
															.getDockedShape()) > g
													|| this.moveShapes
															.indexOf(k.dockers
																	.last()
																	.getDockedShape()) > g
										}.bind(this));
						for (var f = 0; f < h.length; f++) {
							for (var b = 1; b < h[f].dockers.length - 1; b++) {
								var c = h[f].dockers[b];
								if (!c.getDockedShape()
										&& !this.moveShapes.include(c)) {
									c.bounds.moveBy(d)
								}
							}
						}
					}
				}
			},
			dockAllShapes : function(a) {
				for (var b = 0; b < this.dockedNodes.length; b++) {
					var c = this.dockedNodes[b].docker;
					c.setDockedShape(a ? this.dockedNodes[b].dockedShape
							: undefined);
					if (c.getDockedShape()) {
						c.setReferencePoint(this.dockedNodes[b].refPoint)
					}
				}
			},
			addShapeToParent : function(e) {
				for (var f = 0; f < this.moveShapes.length; f++) {
					var d = this.moveShapes[f];
					if (d instanceof ORYX.Core.Node && d.parent !== e[f]) {
						var g = e[f].absoluteXY();
						var h = d.absoluteXY();
						var c = h.x - g.x;
						var k = h.y - g.y;
						e[f].add(d);
						d.getOutgoingShapes((function(b) {
							if (b instanceof ORYX.Core.Node
									&& !this.moveShapes.member(b)) {
								e[f].add(b)
							}
						}).bind(this));
						if (d instanceof ORYX.Core.Node
								&& d.dockers.length == 1) {
							var a = d.bounds;
							c += a.width() / 2;
							k += a.height() / 2;
							d.dockers.first().bounds.centerMoveTo(c, k)
						} else {
							d.bounds.moveTo(c, k)
						}
					}
				}
			},
			selectCurrentShapes : function() {
				this.plugin.facade.setSelection(this.selectedShapes)
			}
		});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.DragDocker = Clazz
		.extend({
			construct : function(a) {
				this.facade = a;
				this.VALIDCOLOR = ORYX.CONFIG.SELECTION_VALID_COLOR;
				this.INVALIDCOLOR = ORYX.CONFIG.SELECTION_INVALID_COLOR;
				this.shapeSelection = undefined;
				this.docker = undefined;
				this.dockerParent = undefined;
				this.dockerSource = undefined;
				this.dockerTarget = undefined;
				this.lastUIObj = undefined;
				this.isStartDocker = undefined;
				this.isEndDocker = undefined;
				this.undockTreshold = 10;
				this.initialDockerPosition = undefined;
				this.outerDockerNotMoved = undefined;
				this.isValid = false;
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEDOWN,
						this.handleMouseDown.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_DOCKERDRAG,
						this.handleDockerDrag.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEOVER,
						this.handleMouseOver.bind(this));
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEOUT,
						this.handleMouseOut.bind(this))
			},
			handleMouseOut : function(b, a) {
				if (!this.docker && a instanceof ORYX.Core.Controls.Docker) {
					a.hide()
				} else {
					if (!this.docker && a instanceof ORYX.Core.Edge) {
						a.dockers.each(function(c) {
							c.hide()
						})
					}
				}
			},
			handleMouseOver : function(b, a) {
				if (!this.docker && a instanceof ORYX.Core.Controls.Docker) {
					a.show()
				} else {
					if (!this.docker && a instanceof ORYX.Core.Edge) {
						a.dockers.each(function(c) {
							c.show()
						})
					}
				}
			},
			handleDockerDrag : function(b, a) {
				this.handleMouseDown(b.uiEvent, a)
			},
			handleMouseDown : function(g, f) {
				if (f instanceof ORYX.Core.Controls.Docker && f.isMovable) {
					this.shapeSelection = this.facade.getSelection();
					this.facade.setSelection();
					this.docker = f;
					this.initialDockerPosition = this.docker.bounds.center();
					this.outerDockerNotMoved = false;
					this.dockerParent = f.parent;
					this._commandArg = {
						docker : f,
						dockedShape : f.getDockedShape(),
						refPoint : f.referencePoint || f.bounds.center()
					};
					this.docker.show();
					if (f.parent instanceof ORYX.Core.Edge
							&& (f.parent.dockers.first() == f || f.parent.dockers
									.last() == f)) {
						if (f.parent.dockers.first() == f
								&& f.parent.dockers.last().getDockedShape()) {
							this.dockerTarget = f.parent.dockers.last()
									.getDockedShape()
						} else {
							if (f.parent.dockers.last() == f
									&& f.parent.dockers.first()
											.getDockedShape()) {
								this.dockerSource = f.parent.dockers.first()
										.getDockedShape()
							}
						}
					} else {
						this.dockerSource = undefined;
						this.dockerTarget = undefined
					}
					this.isStartDocker = this.docker.parent.dockers.first() === this.docker;
					this.isEndDocker = this.docker.parent.dockers.last() === this.docker;
					this.facade.getCanvas().add(this.docker.parent);
					this.docker.parent.getLabels().each(function(h) {
						h.hide()
					});
					var c = this.facade.eventCoordinates(g);
					var e = 1;
					if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
						var a = navigator.userAgent;
						if (a.indexOf("MSIE") >= 0) {
							var d = Math
									.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
							if (d !== 100) {
								e = d / 100
							}
						}
					}
					if (e !== 1) {
						c.x = c.x / e;
						c.y = c.y / e
					}
					if ((!this.isStartDocker && !this.isEndDocker)
							|| !this.docker.isDocked()) {
						this.docker.setDockedShape(undefined);
						this.docker.bounds.centerMoveTo(c);
						this.dockerParent._update()
					} else {
						this.outerDockerNotMoved = true
					}
					var b = {
						movedCallback : this.dockerMoved.bind(this),
						upCallback : this.dockerMovedFinished.bind(this)
					};
					this.startEventPos = c;
					ORYX.Core.UIEnableDrag(g, f, b)
				}
			},
			dockerMoved : function(u) {
				this.outerDockerNotMoved = false;
				var m = undefined;
				if (this.docker.parent) {
					if (this.isStartDocker || this.isEndDocker) {
						var p = this.facade.eventCoordinates(u);
						var x = 1;
						if (!isNaN(screen.logicalXDPI)
								&& !isNaN(screen.systemXDPI)) {
							var w = navigator.userAgent;
							if (w.indexOf("MSIE") >= 0) {
								var a = Math
										.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
								if (a !== 100) {
									x = a / 100
								}
							}
						}
						if (x !== 1) {
							p.x = p.x / x;
							p.y = p.y / x
						}
						if (this.docker.isDocked()) {
							var c = ORYX.Core.Math.getDistancePointToPoint(p,
									this.initialDockerPosition);
							if (c < this.undockTreshold) {
								this.outerDockerNotMoved = true;
								return

								

																

								

							}
							this.docker.setDockedShape(undefined);
							this.dockerParent._update()
						}
						var t = this.facade.getCanvas()
								.getAbstractShapesAtPosition(p);
						var s = t.pop();
						if (this.docker.parent === s) {
							s = t.pop()
						}
						if (this.lastUIObj == s) {
						} else {
							if (s instanceof ORYX.Core.Shape) {
								if (this.docker.parent instanceof ORYX.Core.Edge) {
									var v = this
											.getHighestParentBeforeCanvas(s);
									if (v instanceof ORYX.Core.Edge
											&& this.docker.parent === v) {
										this.isValid = false;
										this.dockerParent._update();
										return

										

																				

										

									}
									this.isValid = false;
									var b = s, d = s;
									while (!this.isValid && b
											&& !(b instanceof ORYX.Core.Canvas)) {
										s = b;
										this.isValid = this.facade
												.getRules()
												.canConnect(
														{
															sourceShape : this.dockerSource ? this.dockerSource
																	: (this.isStartDocker ? s
																			: undefined),
															edgeShape : this.docker.parent,
															targetShape : this.dockerTarget ? this.dockerTarget
																	: (this.isEndDocker ? s
																			: undefined)
														});
										b = b.parent
									}
									if (!this.isValid) {
										s = d
									}
								} else {
									this.isValid = this.facade
											.getRules()
											.canConnect(
													{
														sourceShape : s,
														edgeShape : this.docker.parent,
														targetShape : this.docker.parent
													})
								}
								if (this.lastUIObj) {
									this.hideMagnets(this.lastUIObj)
								}
								if (this.isValid) {
									this.showMagnets(s)
								}
								this.showHighlight(s,
										this.isValid ? this.VALIDCOLOR
												: this.INVALIDCOLOR);
								this.lastUIObj = s
							} else {
								this.hideHighlight();
								this.lastUIObj ? this
										.hideMagnets(this.lastUIObj) : null;
								this.lastUIObj = undefined;
								this.isValid = false
							}
						}
						if (this.lastUIObj && this.isValid
								&& !(u.shiftKey || u.ctrlKey)) {
							m = this.lastUIObj.magnets.find(function(A) {
								return A.absoluteBounds().isIncluded(p)
							});
							if (m) {
								this.docker.bounds.centerMoveTo(m
										.absoluteCenterXY())
							}
						}
					}
				}
				if (!(u.shiftKey || u.ctrlKey) && !m) {
					var o = ORYX.CONFIG.DOCKER_SNAP_OFFSET;
					var k = o + 1;
					var g = o + 1;
					var z = this.docker.bounds.center();
					if (this.docker.parent) {
						this.docker.parent.dockers.each((function(B) {
							if (this.docker == B) {
								return

								

																

								

							}
							var A = B.referencePoint ? B
									.getAbsoluteReferencePoint() : B.bounds
									.center();
							k = Math.abs(k) > Math.abs(A.x - z.x) ? A.x - z.x
									: k;
							g = Math.abs(g) > Math.abs(A.y - z.y) ? A.y - z.y
									: g
						}).bind(this));
						if (Math.abs(k) < o || Math.abs(g) < o) {
							k = Math.abs(k) < o ? k : 0;
							g = Math.abs(g) < o ? g : 0;
							this.docker.bounds.centerMoveTo(z.x + k, z.y + g)
						} else {
							var e = this.docker.parent.dockers[Math.max(
									this.docker.parent.dockers
											.indexOf(this.docker) - 1, 0)];
							var r = this.docker.parent.dockers[Math.min(
									this.docker.parent.dockers
											.indexOf(this.docker) + 1,
									this.docker.parent.dockers.length - 1)];
							if (e && r && e !== this.docker
									&& r !== this.docker) {
								var f = e.bounds.center();
								var h = r.bounds.center();
								var q = this.docker.bounds.center();
								if (ORYX.Core.Math.isPointInLine(q.x, q.y, f.x,
										f.y, h.x, h.y, 10)) {
									var y = (Number(h.y) - Number(f.y))
											/ (Number(h.x) - Number(f.x));
									var n = ((f.y - (f.x * y)) - (q.y - (q.x * (-Math
											.pow(y, -1)))))
											/ ((-Math.pow(y, -1)) - y);
									var l = (f.y - (f.x * y)) + (y * n);
									if (isNaN(n) || isNaN(l)) {
										return

										

																				

										

									}
									this.docker.bounds.centerMoveTo(n, l)
								}
							}
						}
					}
				}
				this.dockerParent._update()
			},
			dockerMovedFinished : function(e) {
				this.facade.setSelection(this.shapeSelection);
				this.hideHighlight();
				this.dockerParent.getLabels().each(function(g) {
					g.show()
				});
				if (this.lastUIObj && (this.isStartDocker || this.isEndDocker)) {
					if (this.isValid) {
						this.docker.setDockedShape(this.lastUIObj);
						this.facade.raiseEvent({
							type : ORYX.CONFIG.EVENT_DRAGDOCKER_DOCKED,
							docker : this.docker,
							parent : this.docker.parent,
							target : this.lastUIObj
						})
					}
					this.hideMagnets(this.lastUIObj)
				}
				this.docker.hide();
				if (this.outerDockerNotMoved) {
					var d = this.facade.eventCoordinates(e);
					var a = this.facade.getCanvas()
							.getAbstractShapesAtPosition(d);
					var b = a.findAll(function(g) {
						return g instanceof ORYX.Core.Node
					});
					a = b.length ? b : a;
					this.facade.setSelection(a)
				} else {
					var c = ORYX.Core.Command.extend({
						construct : function(n, h, g, m, l, k) {
							this.docker = n;
							this.index = n.parent.dockers.indexOf(n);
							this.newPosition = h;
							this.newDockedShape = m;
							this.oldPosition = g;
							this.oldDockedShape = l;
							this.facade = k;
							this.index = n.parent.dockers.indexOf(n);
							this.shape = n.parent
						},
						execute : function() {
							if (!this.docker.parent) {
								this.docker = this.shape.dockers[this.index]
							}
							this.dock(this.newDockedShape, this.newPosition);
							this.removedDockers = this.shape
									.removeUnusedDockers();
							this.facade.updateSelection()
						},
						rollback : function() {
							this.dock(this.oldDockedShape, this.oldPosition);
							(this.removedDockers || $H({})).each(function(g) {
								this.shape.add(g.value, Number(g.key));
								this.shape._update(true)
							}.bind(this));
							this.facade.updateSelection()
						},
						dock : function(g, h) {
							this.docker.setDockedShape(undefined);
							if (g) {
								this.docker.setDockedShape(g);
								this.docker.setReferencePoint(h)
							} else {
								this.docker.bounds.centerMoveTo(h)
							}
							this.facade.getCanvas().update()
						}
					});
					if (this.docker.parent) {
						var f = new c(
								this.docker,
								this.docker.getDockedShape() ? this.docker.referencePoint
										: this.docker.bounds.center(),
								this._commandArg.refPoint, this.docker
										.getDockedShape(),
								this._commandArg.dockedShape, this.facade);
						this.facade.executeCommands([ f ])
					}
				}
				this.docker = undefined;
				this.dockerParent = undefined;
				this.dockerSource = undefined;
				this.dockerTarget = undefined;
				this.lastUIObj = undefined
			},
			hideHighlight : function() {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
					highlightId : "validDockedShape"
				})
			},
			showHighlight : function(b, a) {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
					highlightId : "validDockedShape",
					elements : [ b ],
					color : a
				})
			},
			showMagnets : function(a) {
				a.magnets.each(function(b) {
					b.show()
				})
			},
			hideMagnets : function(a) {
				a.magnets.each(function(b) {
					b.hide()
				})
			},
			getHighestParentBeforeCanvas : function(a) {
				if (!(a instanceof ORYX.Core.Shape)) {
					return undefined
				}
				var b = a.parent;
				while (b && !(b.parent instanceof ORYX.Core.Canvas)) {
					b = b.parent
				}
				return b
			}
		});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.AddDocker = Clazz.extend({
	construct : function(a) {
		this.facade = a;
		this.enableAdd = false;
		this.enableRemove = false;
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEDOWN,
				this.handleMouseDown.bind(this))
	},
	setEnableAdd : function(a) {
		this.enableAdd = a;
		if (this.enableAdd) {
			jQuery("#add-bendpoint-button").addClass("pressed")
		} else {
			jQuery("#add-bendpoint-button").removeClass("pressed");
			jQuery("#add-bendpoint-button").blur()
		}
	},
	setEnableRemove : function(a) {
		this.enableRemove = a;
		if (this.enableRemove) {
			jQuery("#remove-bendpoint-button").addClass("pressed")
		} else {
			jQuery("#remove-bendpoint-button").removeClass("pressed");
			jQuery("#remove-bendpoint-button").blur()
		}
	},
	enabledAdd : function(a) {
		return this.enableAdd
	},
	enabledRemove : function() {
		return this.enableRemove
	},
	handleMouseDown : function(b, a) {
		if (this.enabledAdd() && a instanceof ORYX.Core.Edge) {
			this.newDockerCommand({
				edge : a,
				position : this.facade.eventCoordinates(b)
			});
			this.setEnableAdd(false)
		} else {
			if (this.enabledRemove() && a instanceof ORYX.Core.Controls.Docker
					&& a.parent instanceof ORYX.Core.Edge) {
				this.newDockerCommand({
					edge : a.parent,
					docker : a
				});
				this.setEnableRemove(false)
			}
		}
		document.body.style.cursor = "default"
	},
	newDockerCommand : function(b) {
		if (!b.edge) {
			return

			

						

			

		}
		var a = ORYX.Core.Command.extend({
			construct : function(h, f, e, g, k, d) {
				this.addEnabled = h;
				this.deleteEnabled = f;
				this.edge = e;
				this.docker = g;
				this.pos = k;
				this.facade = d
			},
			execute : function() {
				if (this.addEnabled) {
					if (!this.docker) {
						this.docker = this.edge.addDocker(this.pos);
						this.index = this.edge.dockers.indexOf(this.docker)
					} else {
						this.edge.add(this.docker, this.index)
					}
				} else {
					if (this.deleteEnabled) {
						this.index = this.edge.dockers.indexOf(this.docker);
						this.pos = this.docker.bounds.center();
						this.edge.removeDocker(this.docker)
					}
				}
				this.edge.getLabels().invoke("show");
				this.facade.getCanvas().update();
				this.facade.updateSelection()
			},
			rollback : function() {
				if (this.addEnabled) {
					if (this.docker instanceof ORYX.Core.Controls.Docker) {
						this.edge.removeDocker(this.docker)
					}
				} else {
					if (this.deleteEnabled) {
						this.edge.add(this.docker, this.index)
					}
				}
				this.edge.getLabels().invoke("show");
				this.facade.getCanvas().update();
				this.facade.updateSelection()
			}
		});
		var c = new a(this.enabledAdd(), this.enabledRemove(), b.edge,
				b.docker, b.position, this.facade);
		this.facade.executeCommands([ c ])
	}
});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.SelectionFrame = Clazz
		.extend({
			construct : function(a) {
				this.facade = a;
				this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEDOWN,
						this.handleMouseDown.bind(this));
				document.documentElement.addEventListener(
						ORYX.CONFIG.EVENT_MOUSEUP, this.handleMouseUp
								.bind(this), true);
				this.position = {
					x : 0,
					y : 0
				};
				this.size = {
					width : 0,
					height : 0
				};
				this.offsetPosition = {
					x : 0,
					y : 0
				};
				this.moveCallback = undefined;
				this.offsetScroll = {
					x : 0,
					y : 0
				};
				this.node = ORYX.Editor.graft("http://www.w3.org/1999/xhtml",
						$("canvasSection"), [ "div", {
							"class" : "Oryx_SelectionFrame"
						} ]);
				this.hide()
			},
			handleMouseDown : function(d, c) {
				if (c instanceof ORYX.Core.Canvas) {
					var e = c.rootNode.parentNode.parentNode;
					var b = this.facade.getCanvas().node.getScreenCTM();
					this.offsetPosition = {
						x : b.e,
						y : b.f
					};
					this.setPos({
						x : Event.pointerX(d)
								- jQuery("#canvasSection").offset().left,
						y : Event.pointerY(d)
								- jQuery("#canvasSection").offset().top + 5
					});
					this.resize({
						width : 0,
						height : 0
					});
					this.moveCallback = this.handleMouseMove.bind(this);
					document.documentElement.addEventListener(
							ORYX.CONFIG.EVENT_MOUSEMOVE, this.moveCallback,
							false);
					this.offsetScroll = {
						x : e.scrollLeft,
						y : e.scrollTop
					};
					this.show()
				}
				Event.stop(d)
			},
			handleMouseUp : function(e) {
				if (this.moveCallback) {
					this.hide();
					document.documentElement.removeEventListener(
							ORYX.CONFIG.EVENT_MOUSEMOVE, this.moveCallback,
							false);
					this.moveCallback = undefined;
					var g = this.facade.getCanvas().node.getScreenCTM();
					var m = {
						x : this.size.width > 0 ? this.position.x
								: this.position.x + this.size.width,
						y : this.size.height > 0 ? this.position.y
								: this.position.y + this.size.height
					};
					var l = {
						x : m.x + Math.abs(this.size.width),
						y : m.y + Math.abs(this.size.height)
					};
					var d = 1;
					if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
						var f = navigator.userAgent;
						if (f.indexOf("MSIE") >= 0) {
							var q = Math
									.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
							if (q !== 100) {
								d = q / 100
							}
						}
					}
					if (d === 1) {
						m.x = m.x
								- (g.e - jQuery("#canvasSection").offset().left);
						m.y = m.y
								- (g.f - jQuery("#canvasSection").offset().top);
						l.x = l.x
								- (g.e - jQuery("#canvasSection").offset().left);
						l.y = l.y
								- (g.f - jQuery("#canvasSection").offset().top)
					} else {
						var n = jQuery("#canvasSection").offset().left;
						var o = jQuery("#canvasSection").scrollLeft();
						var k = jQuery("#canvasSection").scrollTop();
						var h = m.e - (n * d);
						var p = 0;
						if (h > 10) {
							p = (h / d) - h
						}
						m.x = m.x - (g.e - (n * d) + p + ((o * d) - o));
						m.y = m.y
								- (g.f
										- (jQuery("#canvasSection").offset().top * d) + ((k * d) - k));
						l.x = l.x - (g.e - (n * d) + p + ((o * d) - o));
						l.y = l.y
								- (g.f
										- (jQuery("#canvasSection").offset().top * d) + ((k * d) - k))
					}
					m.x /= g.a;
					m.y /= g.d;
					l.x /= g.a;
					l.y /= g.d;
					var c = this.facade.getCanvas().getChildShapes(true)
							.findAll(
									function(b) {
										var a = b.absoluteBounds();
										var s = a.upperLeft();
										var r = a.lowerRight();
										if (s.x > m.x && s.y > m.y && r.x < l.x
												&& r.y < l.y) {
											return true
										}
										return false
									});
					this.facade.setSelection(c)
				}
			},
			handleMouseMove : function(b) {
				var a = {
					width : Event.pointerX(b) - this.position.x
							- jQuery("#canvasSection").offset().left,
					height : Event.pointerY(b) - this.position.y
							- jQuery("#canvasSection").offset().top + 5
				};
				var c = this.facade.getCanvas().rootNode.parentNode.parentNode;
				a.width -= this.offsetScroll.x - c.scrollLeft;
				a.height -= this.offsetScroll.y - c.scrollTop;
				this.resize(a);
				Event.stop(b)
			},
			hide : function() {
				this.node.style.display = "none"
			},
			show : function() {
				this.node.style.display = ""
			},
			setPos : function(a) {
				this.node.style.top = a.y + "px";
				this.node.style.left = a.x + "px";
				this.position = a
			},
			resize : function(a) {
				this.setPos(this.position);
				this.size = Object.clone(a);
				if (a.width < 0) {
					this.node.style.left = (this.position.x + a.width) + "px";
					a.width = -a.width
				}
				if (a.height < 0) {
					this.node.style.top = (this.position.y + a.height) + "px";
					a.height = -a.height
				}
				this.node.style.width = a.width + "px";
				this.node.style.height = a.height + "px"
			}
		});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.ShapeHighlighting = Clazz.extend({
	construct : function(a) {
		this.parentNode = a.getCanvas().getSvgContainer();
		this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg",
				this.parentNode, [ "g" ]);
		this.highlightNodes = {};
		a.registerOnEvent(ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW, this.setHighlight
				.bind(this));
		a.registerOnEvent(ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE, this.hideHighlight
				.bind(this))
	},
	setHighlight : function(a) {
		if (a && a.highlightId) {
			var b = this.highlightNodes[a.highlightId];
			if (!b) {
				b = ORYX.Editor.graft("http://www.w3.org/2000/svg", this.node,
						[ "path", {
							"stroke-width" : 2,
							fill : "none"
						} ]);
				this.highlightNodes[a.highlightId] = b
			}
			if (a.elements && a.elements.length > 0) {
				this.setAttributesByStyle(b, a);
				this.show(b)
			} else {
				this.hide(b)
			}
		}
	},
	hideHighlight : function(a) {
		if (a && a.highlightId && this.highlightNodes[a.highlightId]) {
			this.hide(this.highlightNodes[a.highlightId])
		}
	},
	hide : function(a) {
		a.setAttributeNS(null, "display", "none")
	},
	show : function(a) {
		a.setAttributeNS(null, "display", "")
	},
	setAttributesByStyle : function(b, a) {
		if (a.style
				&& a.style == ORYX.CONFIG.SELECTION_HIGHLIGHT_STYLE_RECTANGLE) {
			var d = a.elements[0].absoluteBounds();
			var c = a.strokewidth ? a.strokewidth : ORYX.CONFIG.BORDER_OFFSET;
			b.setAttributeNS(null, "d", this.getPathRectangle(d.a, d.b, c));
			b.setAttributeNS(null, "stroke", a.color ? a.color
					: ORYX.CONFIG.SELECTION_HIGHLIGHT_COLOR);
			b.setAttributeNS(null, "stroke-opacity", a.opacity ? a.opacity
					: 0.2);
			b.setAttributeNS(null, "stroke-width", c)
		} else {
			if (a.elements.length == 1
					&& a.elements[0] instanceof ORYX.Core.Edge
					&& a.highlightId != "selection") {
				var e = this.getPathEdge(a.elements[0].dockers);
				if (e && e.length > 0) {
					b.setAttributeNS(null, "d", e)
				}
				b.setAttributeNS(null, "stroke", a.color ? a.color
						: ORYX.CONFIG.SELECTION_HIGHLIGHT_COLOR);
				b.setAttributeNS(null, "stroke-opacity", a.opacity ? a.opacity
						: 0.2);
				b.setAttributeNS(null, "stroke-width",
						ORYX.CONFIG.OFFSET_EDGE_BOUNDS)
			} else {
				var e = this.getPathByElements(a.elements);
				if (e && e.length > 0) {
					b.setAttributeNS(null, "d", e)
				}
				b.setAttributeNS(null, "stroke", a.color ? a.color
						: ORYX.CONFIG.SELECTION_HIGHLIGHT_COLOR);
				b.setAttributeNS(null, "stroke-opacity", a.opacity ? a.opacity
						: 1);
				b.setAttributeNS(null, "stroke-width",
						a.strokewidth ? a.strokewidth : 2)
			}
		}
	},
	getPathByElements : function(a) {
		if (!a || a.length <= 0) {
			return undefined
		}
		var c = ORYX.CONFIG.SELECTED_AREA_PADDING;
		var b = "";
		a.each((function(f) {
			if (!f) {
				return

				

								

				

			}
			var g = f.absoluteBounds();
			g.widen(c);
			var e = g.upperLeft();
			var d = g.lowerRight();
			b = b + this.getPath(e, d)
		}).bind(this));
		return b
	},
	getPath : function(d, c) {
		return this.getPathCorners(d, c)
	},
	getPathCorners : function(d, c) {
		var e = ORYX.CONFIG.SELECTION_HIGHLIGHT_SIZE;
		var f = "";
		f = f + "M" + d.x + " " + (d.y + e) + " l0 -" + e + " l" + e + " 0 ";
		f = f + "M" + d.x + " " + (c.y - e) + " l0 " + e + " l" + e + " 0 ";
		f = f + "M" + c.x + " " + (c.y - e) + " l0 " + e + " l-" + e + " 0 ";
		f = f + "M" + c.x + " " + (d.y + e) + " l0 -" + e + " l-" + e + " 0 ";
		return f
	},
	getPathRectangle : function(d, c, h) {
		var e = ORYX.CONFIG.SELECTION_HIGHLIGHT_SIZE;
		var f = "";
		var g = h / 2;
		f = f + "M" + (d.x + g) + " " + (d.y);
		f = f + " L" + (d.x + g) + " " + (c.y - g);
		f = f + " L" + (c.x - g) + " " + (c.y - g);
		f = f + " L" + (c.x - g) + " " + (d.y + g);
		f = f + " L" + (d.x + g) + " " + (d.y + g);
		return f
	},
	getPathEdge : function(a) {
		var b = a.length;
		var c = "M" + a[0].bounds.center().x + " " + a[0].bounds.center().y;
		for (i = 1; i < b; i++) {
			var d = a[i].bounds.center();
			c = c + " L" + d.x + " " + d.y
		}
		return c
	}
});
ORYX.Plugins.HighlightingSelectedShapes = Clazz.extend({
	construct : function(a) {
		this.facade = a;
		this.opacityFull = 0.9;
		this.opacityLow = 0.4
	},
	onSelectionChanged : function(a) {
		if (a.elements && a.elements.length > 1) {
			this.facade.raiseEvent({
				type : ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
				highlightId : "selection",
				elements : a.elements.without(a.subSelection),
				color : ORYX.CONFIG.SELECTION_HIGHLIGHT_COLOR,
				opacity : !a.subSelection ? this.opacityFull : this.opacityLow
			});
			if (a.subSelection) {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
					highlightId : "subselection",
					elements : [ a.subSelection ],
					color : ORYX.CONFIG.SELECTION_HIGHLIGHT_COLOR,
					opacity : this.opacityFull
				})
			} else {
				this.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
					highlightId : "subselection"
				})
			}
		} else {
			this.facade.raiseEvent({
				type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
				highlightId : "selection"
			});
			this.facade.raiseEvent({
				type : ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
				highlightId : "subselection"
			})
		}
	}
});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.Overlay = Clazz.extend({
	facade : undefined,
	styleNode : undefined,
	construct : function(a) {
		this.facade = a;
		this.changes = [];
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_OVERLAY_SHOW, this.show
				.bind(this));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_OVERLAY_HIDE, this.hide
				.bind(this));
		this.styleNode = document.createElement("style");
		this.styleNode.setAttributeNS(null, "type", "text/css");
		document.getElementsByTagName("head")[0].appendChild(this.styleNode)
	},
	show : function(a) {
		if (!a || !a.shapes || !a.shapes instanceof Array || !a.id
				|| !a.id instanceof String || a.id.length == 0) {
			return

			

						

			

		}
		if (a.attributes) {
			a.shapes.each(function(d) {
				if (!d instanceof ORYX.Core.Shape) {
					return

					

										

					

				}
				this.setAttributes(d.node, a.attributes)
			}.bind(this))
		}
		var c = true;
		try {
			c = a.node && a.node instanceof SVGElement
		} catch (b) {
		}
		if (a.node && c) {
			a._temps = [];
			a.shapes.each(function(g, f) {
				if (!g instanceof ORYX.Core.Shape) {
					return

					

										

					

				}
				var e = {};
				e.svg = a.dontCloneNode ? a.node : a.node.cloneNode(true);
				g.node.firstChild.appendChild(e.svg);
				if (g instanceof ORYX.Core.Edge && !a.nodePosition) {
					a.nodePosition = "START"
				}
				if (a.nodePosition) {
					var d = g.bounds;
					var h = a.nodePosition.toUpperCase();
					if (g instanceof ORYX.Core.Node && h == "START") {
						h = "NW"
					} else {
						if (g instanceof ORYX.Core.Node && h == "END") {
							h = "SE"
						} else {
							if (g instanceof ORYX.Core.Edge && h == "START") {
								d = g.getDockers().first().bounds
							} else {
								if (g instanceof ORYX.Core.Edge && h == "END") {
									d = g.getDockers().last().bounds
								}
							}
						}
					}
					e.callback = function() {
						var k = 0;
						var l = 0;
						if (h == "NW") {
						} else {
							if (h == "N") {
								k = d.width() / 2
							} else {
								if (h == "NE") {
									k = d.width()
								} else {
									if (h == "E") {
										k = d.width();
										l = d.height() / 2
									} else {
										if (h == "SE") {
											k = d.width();
											l = d.height()
										} else {
											if (h == "S") {
												k = d.width() / 2;
												l = d.height()
											} else {
												if (h == "SW") {
													l = d.height()
												} else {
													if (h == "W") {
														l = d.height() / 2
													} else {
														if (h == "START"
																|| h == "END") {
															k = d.width() / 2;
															l = d.height() / 2
														} else {
															return

															

																														

															

														}
													}
												}
											}
										}
									}
								}
							}
						}
						if (g instanceof ORYX.Core.Edge) {
							k += d.upperLeft().x;
							l += d.upperLeft().y
						}
						e.svg.setAttributeNS(null, "transform", "translate("
								+ k + ", " + l + ")")
					}.bind(this);
					e.element = g;
					e.callback();
					d.registerCallback(e.callback)
				}
				a._temps.push(e)
			}.bind(this))
		}
		if (!this.changes[a.id]) {
			this.changes[a.id] = []
		}
		this.changes[a.id].push(a)
	},
	hide : function(a) {
		if (!a || !a.id || !a.id instanceof String || a.id.length == 0
				|| !this.changes[a.id]) {
			return

			

						

			

		}
		this.changes[a.id].each(function(b) {
			b.shapes.each(function(d, c) {
				if (!d instanceof ORYX.Core.Shape) {
					return

					

										

					

				}
				this.deleteAttributes(d.node)
			}.bind(this));
			if (b._temps) {
				b._temps.each(function(c) {
					if (c.svg && c.svg.parentNode) {
						c.svg.parentNode.removeChild(c.svg)
					}
					if (c.callback && c.element) {
						c.element.bounds.unregisterCallback(c.callback)
					}
				}.bind(this))
			}
		}.bind(this));
		this.changes[a.id] = null
	},
	setAttributes : function(c, d) {
		var h = this.getAllChilds(c.firstChild.firstChild);
		var a = [];
		h.each(function(m) {
			a.push($A(m.attributes).findAll(function(n) {
				return n.nodeValue.startsWith("url(#")
			}))
		});
		a = a.flatten().compact();
		a = a.collect(function(m) {
			return m.nodeValue
		}).uniq();
		a = a.collect(function(m) {
			return m.slice(5, m.length - 1)
		});
		a.unshift(c.id + " .me");
		var g = $H(d);
		var e = g.toJSON().gsub(",", ";").gsub('"', "");
		var k = d.stroke ? e.slice(0, e.length - 1) + "; fill:" + d.stroke
				+ ";}" : e;
		var f;
		if (d.fill) {
			var b = Object.clone(d);
			b.fill = "black";
			f = $H(b).toJSON().gsub(",", ";").gsub('"', "")
		}
		csstags = a.collect(function(n, m) {
			return "#" + n + " * " + (!m ? e : k) + ""
					+ (f ? " #" + n + " text * " + f : "")
		});
		var l = csstags.join(" ") + "\n";
		this.styleNode.appendChild(document.createTextNode(l))
	},
	deleteAttributes : function(b) {
		var a = $A(this.styleNode.childNodes).findAll(function(c) {
			return c.textContent.include("#" + b.id)
		});
		a.each(function(c) {
			c.parentNode.removeChild(c)
		})
	},
	getAllChilds : function(a) {
		var b = $A(a.childNodes);
		$A(a.childNodes).each(function(c) {
			b.push(this.getAllChilds(c))
		}.bind(this));
		return b.flatten()
	}
});
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
ORYX.Plugins.KeysMove = ORYX.Plugins.AbstractPlugin.extend({
	facade : undefined,
	construct : function(a) {
		this.facade = a;
		this.copyElements = [];
		this.facade.offer({
			keyCodes : [ {
				metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
				keyCode : 65,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.selectAll.bind(this)
		});
		this.facade.offer({
			keyCodes : [ {
				metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
				keyCode : ORYX.CONFIG.KEY_CODE_LEFT,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move.bind(this, ORYX.CONFIG.KEY_CODE_LEFT,
					false)
		});
		this.facade.offer({
			keyCodes : [ {
				keyCode : ORYX.CONFIG.KEY_CODE_LEFT,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move.bind(this, ORYX.CONFIG.KEY_CODE_LEFT,
					true)
		});
		this.facade.offer({
			keyCodes : [ {
				metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
				keyCode : ORYX.CONFIG.KEY_CODE_RIGHT,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move.bind(this, ORYX.CONFIG.KEY_CODE_RIGHT,
					false)
		});
		this.facade.offer({
			keyCodes : [ {
				keyCode : ORYX.CONFIG.KEY_CODE_RIGHT,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move.bind(this, ORYX.CONFIG.KEY_CODE_RIGHT,
					true)
		});
		this.facade.offer({
			keyCodes : [ {
				metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
				keyCode : ORYX.CONFIG.KEY_CODE_UP,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move
					.bind(this, ORYX.CONFIG.KEY_CODE_UP, false)
		});
		this.facade.offer({
			keyCodes : [ {
				keyCode : ORYX.CONFIG.KEY_CODE_UP,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move.bind(this, ORYX.CONFIG.KEY_CODE_UP, true)
		});
		this.facade.offer({
			keyCodes : [ {
				metaKeys : [ ORYX.CONFIG.META_KEY_META_CTRL ],
				keyCode : ORYX.CONFIG.KEY_CODE_DOWN,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move.bind(this, ORYX.CONFIG.KEY_CODE_DOWN,
					false)
		});
		this.facade.offer({
			keyCodes : [ {
				keyCode : ORYX.CONFIG.KEY_CODE_DOWN,
				keyAction : ORYX.CONFIG.KEY_ACTION_DOWN
			} ],
			functionality : this.move.bind(this, ORYX.CONFIG.KEY_CODE_DOWN,
					true)
		})
	},
	selectAll : function(a) {
		Event.stop(a.event);
		this.facade.setSelection(this.facade.getCanvas().getChildShapes(true))
	},
	move : function(n, k, l) {
		Event.stop(l.event);
		var b = k ? 20 : 5;
		var m = this.facade.getSelection();
		var g = this.facade.getSelection();
		var c = {
			x : 0,
			y : 0
		};
		switch (n) {
		case ORYX.CONFIG.KEY_CODE_LEFT:
			c.x = -1 * b;
			break;
		case ORYX.CONFIG.KEY_CODE_RIGHT:
			c.x = b;
			break;
		case ORYX.CONFIG.KEY_CODE_UP:
			c.y = -1 * b;
			break;
		case ORYX.CONFIG.KEY_CODE_DOWN:
			c.y = b;
			break
		}
		m = m.findAll(function(e) {
			if (e instanceof ORYX.Core.Node && e.dockers.length == 1
					&& m.include(e.dockers.first().getDockedShape())) {
				return false
			}
			var o = e.parent;
			do {
				if (m.include(o)) {
					return false
				}
			} while (o = o.parent);
			return true
		});
		var f = true;
		var h = m.all(function(e) {
			if (e instanceof ORYX.Core.Edge) {
				if (e.isDocked()) {
					f = false
				}
				return true
			}
			return false
		});
		if (h && !f) {
			return

			

						

			

		}
		m = m.map(function(o) {
			if (o instanceof ORYX.Core.Node) {
				return o
			} else {
				if (o instanceof ORYX.Core.Edge) {
					var e = o.dockers;
					if (m.include(o.dockers.first().getDockedShape())) {
						e = e.without(o.dockers.first())
					}
					if (m.include(o.dockers.last().getDockedShape())) {
						e = e.without(o.dockers.last())
					}
					return e
				} else {
					return null
				}
			}
		}).flatten().compact();
		if (m.size() > 0) {
			var a = [ this.facade.getCanvas().bounds.lowerRight().x,
					this.facade.getCanvas().bounds.lowerRight().y, 0, 0 ];
			m.each(function(e) {
				a[0] = Math.min(a[0], e.bounds.upperLeft().x);
				a[1] = Math.min(a[1], e.bounds.upperLeft().y);
				a[2] = Math.max(a[2], e.bounds.lowerRight().x);
				a[3] = Math.max(a[3], e.bounds.lowerRight().y)
			});
			if (a[0] + c.x < 0) {
				c.x = -a[0]
			}
			if (a[1] + c.y < 0) {
				c.y = -a[1]
			}
			if (a[2] + c.x > this.facade.getCanvas().bounds.lowerRight().x) {
				c.x = this.facade.getCanvas().bounds.lowerRight().x - a[2]
			}
			if (a[3] + c.y > this.facade.getCanvas().bounds.lowerRight().y) {
				c.y = this.facade.getCanvas().bounds.lowerRight().y - a[3]
			}
			if (c.x != 0 || c.y != 0) {
				var d = [ new ORYX.Core.Command.Move(m, c, null, g, this) ];
				this.facade.executeCommands(d)
			}
		}
	},
	getUndockedCommant : function(b) {
		var a = ORYX.Core.Command.extend({
			construct : function(c) {
				this.dockers = c.collect(function(d) {
					return d instanceof ORYX.Core.Controls.Docker ? {
						docker : d,
						dockedShape : d.getDockedShape(),
						refPoint : d.referencePoint
					} : undefined
				}).compact()
			},
			execute : function() {
				this.dockers.each(function(c) {
					c.docker.setDockedShape(undefined)
				})
			},
			rollback : function() {
				this.dockers.each(function(c) {
					c.docker.setDockedShape(c.dockedShape);
					c.docker.setReferencePoint(c.refPoint)
				})
			}
		});
		command = new a(b);
		command.execute();
		return command
	},
});
if (!ORYX.Plugins) {
	ORYX.Plugins = {}
}
if (!ORYX.Plugins.Layouter) {
	ORYX.Plugins.Layouter = {}
}
new function() {
	ORYX.Plugins.Layouter.EdgeLayouter = ORYX.Plugins.AbstractLayouter
			.extend({
				layouted : [
						"http://b3mn.org/stencilset/bpmn1.1#SequenceFlow",
						"http://b3mn.org/stencilset/bpmn1.1#MessageFlow",
						"http://b3mn.org/stencilset/timjpdl3#SequenceFlow",
						"http://b3mn.org/stencilset/jbpm4#SequenceFlow",
						"http://b3mn.org/stencilset/bpmn2.0#MessageFlow",
						"http://b3mn.org/stencilset/bpmn2.0#SequenceFlow",
						"http://b3mn.org/stencilset/bpmn2.0choreography#MessageFlow",
						"http://b3mn.org/stencilset/bpmn2.0choreography#SequenceFlow",
						"http://b3mn.org/stencilset/bpmn2.0conversation#ConversationLink",
						"http://b3mn.org/stencilset/epc#ControlFlow",
						"http://www.signavio.com/stencilsets/processmap#ProcessLink",
						"http://www.signavio.com/stencilsets/organigram#connection" ],
				layout : function(a) {
					a.each(function(b) {
						this.doLayout(b)
					}.bind(this))
				},
				doLayout : function(b) {
					var d = b.getIncomingNodes()[0];
					var c = b.getOutgoingNodes()[0];
					if (!d || !c) {
						return

						

												

						

					}
					var a = this.getPositions(d, c, b);
					if (a.length > 0) {
						this.setDockers(b, a[0].a, a[0].b)
					}
				},
				getPositions : function(r, s, e) {
					var u = r.absoluteBounds();
					var n = s.absoluteBounds();
					var q = u.center();
					var o = n.center();
					var l = u.midPoint();
					var d = n.midPoint();
					var k = Object.clone(e.dockers.first().referencePoint);
					var t = Object.clone(e.dockers.last().referencePoint);
					var c = e.dockers.first().getAbsoluteReferencePoint();
					var p = e.dockers.last().getAbsoluteReferencePoint();
					if (Math.abs(c.x - p.x) < 1 || Math.abs(c.y - p.y) < 1) {
						return []
					}
					var g = {};
					g.x = q.x < o.x ? (((o.x - n.width() / 2) - (q.x + u
							.width() / 2)) / 2)
							+ (q.x + u.width() / 2)
							: (((q.x - u.width() / 2) - (o.x + n.width() / 2)) / 2)
									+ (o.x + n.width() / 2);
					g.y = q.y < o.y ? (((o.y - n.height() / 2) - (q.y + u
							.height() / 2)) / 2)
							+ (q.y + u.height() / 2)
							: (((q.y - u.height() / 2) - (o.y + n.height() / 2)) / 2)
									+ (o.y + n.height() / 2);
					u.widen(5);
					n.widen(20);
					var h = [];
					var f = this.getOffset.bind(this);
					if (!u.isIncluded(o.x, q.y) && !n.isIncluded(o.x, q.y)) {
						h.push({
							a : {
								x : o.x + f(t, d, "x"),
								y : q.y + f(k, l, "y")
							},
							z : this.getWeight(r, q.x < o.x ? "r" : "l", s,
									q.y < o.y ? "t" : "b", e)
						})
					}
					if (!u.isIncluded(q.x, o.y) && !n.isIncluded(q.x, o.y)) {
						h.push({
							a : {
								x : q.x + f(k, l, "x"),
								y : o.y + f(t, d, "y")
							},
							z : this.getWeight(r, q.y < o.y ? "b" : "t", s,
									q.x < o.x ? "l" : "r", e)
						})
					}
					if (!u.isIncluded(g.x, q.y) && !n.isIncluded(g.x, o.y)) {
						h.push({
							a : {
								x : g.x,
								y : q.y + f(k, l, "y")
							},
							b : {
								x : g.x,
								y : o.y + f(t, d, "y")
							},
							z : this.getWeight(r, "r", s, "l", e, q.x > o.x)
						})
					}
					if (!u.isIncluded(q.x, g.y) && !n.isIncluded(o.x, g.y)) {
						h.push({
							a : {
								x : q.x + f(k, l, "x"),
								y : g.y
							},
							b : {
								x : o.x + f(t, d, "x"),
								y : g.y
							},
							z : this.getWeight(r, "b", s, "t", e, q.y > o.y)
						})
					}
					return h.sort(function(v, m) {
						return v.z < m.z ? 1 : (v.z == m.z ? -1 : -1)
					})
				},
				getOffset : function(c, b, a) {
					return c[a] - b[a]
				},
				getWeight : function(m, b, n, a, d, g) {
					b = (b || "").toLowerCase();
					a = (a || "").toLowerCase();
					if (![ "t", "r", "b", "l" ].include(b)) {
						b = "r"
					}
					if (![ "t", "r", "b", "l" ].include(a)) {
						b = "l"
					}
					if (g) {
						b = b == "t" ? "b" : (b == "r" ? "l" : (b == "b" ? "t"
								: (b == "l" ? "r" : "r")));
						a = a == "t" ? "b" : (a == "r" ? "l" : (a == "b" ? "t"
								: (a == "l" ? "r" : "r")))
					}
					var f = 0;
					var p = this.facade.getRules().getLayoutingRules(m, d)["out"];
					var o = this.facade.getRules().getLayoutingRules(n, d)["in"];
					var e = p[b];
					var c = o[a];
					var l = function(s, r, q) {
						switch (s) {
						case "t":
							return Math.abs(r.x - q.x) < 2 && r.y < q.y;
						case "r":
							return r.x > q.x && Math.abs(r.y - q.y) < 2;
						case "b":
							return Math.abs(r.x - q.x) < 2 && r.y > q.y;
						case "l":
							return r.x < q.x && Math.abs(r.y - q.y) < 2;
						default:
							return false
						}
					};
					var k = m.getIncomingShapes().findAll(function(q) {
						return q instanceof ORYX.Core.Edge
					}).any(
							function(q) {
								return l(b,
										q.dockers[q.dockers.length - 2].bounds
												.center(),
										q.dockers.last().bounds.center())
							});
					var h = n.getOutgoingShapes().findAll(function(q) {
						return q instanceof ORYX.Core.Edge
					}).any(
							function(q) {
								return l(a, q.dockers[1].bounds.center(),
										q.dockers.first().bounds.center())
							});
					return (k || h ? 0 : e + c)
				},
				setDockers : function(e, d, c) {
					if (!e) {
						return

						

												

						

					}
					e.dockers.each(function(a) {
						e.removeDocker(a)
					});
					[ d, c ].compact().each(function(b) {
						var a = e.createDocker(undefined, b);
						a.bounds.centerMoveTo(b)
					});
					e.dockers.each(function(a) {
						a.update()
					});
					e._update(true)
				}
			})
}();
if (!ORYX.Plugins) {
	ORYX.Plugins = new Object()
}
new function() {
	ORYX.Plugins.BPMN2_0 = {
		construct : function(b) {
			this.facade = b;
			this.facade.registerOnEvent(ORYX.CONFIG.EVENT_DRAGDOCKER_DOCKED,
					this.handleDockerDocked.bind(this));
			this.facade.registerOnEvent(
					ORYX.CONFIG.EVENT_PROPWINDOW_PROP_CHANGED,
					this.handlePropertyChanged.bind(this));
			this.facade.registerOnEvent("layout.bpmn2_0.pool",
					this.handleLayoutPool.bind(this));
			this.facade.registerOnEvent("layout.bpmn2_0.subprocess",
					this.handleSubProcess.bind(this));
			this.facade.registerOnEvent(ORYX.CONFIG.EVENT_SHAPEREMOVED,
					this.handleShapeRemove.bind(this));
			this.facade.registerOnEvent(ORYX.CONFIG.EVENT_LOADED,
					this.afterLoad.bind(this));
			this.namespace = undefined
		},
		afterLoad : function() {
			this.facade.getCanvas().getChildNodes().each(function(b) {
				if (b.getStencil().id().endsWith("Pool")) {
					this.handleLayoutPool({
						shape : b
					})
				}
			}.bind(this))
		},
		onSelectionChanged : function(h) {
			var f = h.elements;
			if (f && f.length === 1) {
				var e = this.getNamespace();
				var b = f[0];
				if (b.getStencil().idWithoutNs() === "Pool") {
					if (b.getChildNodes().length === 0) {
						var d = {
							type : e + "Lane",
							position : {
								x : 0,
								y : 0
							},
							namespace : b.getStencil().namespace(),
							parent : b
						};
						this.facade.createShape(d);
						this.facade.getCanvas().update();
						this.facade.setSelection([ b ])
					}
				}
			}
			if (f.any(function(l) {
				return l instanceof ORYX.Core.Node
						&& l.getStencil().id().endsWith("Lane")
			})) {
				var c = f.findAll(function(l) {
					return l instanceof ORYX.Core.Node
							&& l.getStencil().id().endsWith("Lane")
				});
				var g = [];
				var k = [];
				c.each(function(l) {
					g.push(this.getParentPool(l))
				}.bind(this));
				g = g.uniq().findAll(function(l) {
					var m = this.getLanes(l, true);
					if (m.all(function(n) {
						return c.include(n)
					})) {
						k = k.concat(m);
						return true
					} else {
						if (f.include(l) && m.any(function(n) {
							return c.include(n)
						})) {
							k = k.concat(m);
							return true
						} else {
							return false
						}
					}
				}.bind(this));
				if (k.length > 0 && g.length > 0) {
					f = f.without.apply(f, k);
					f = f.concat(g);
					this.facade.setSelection(f.uniq())
				}
			}
		},
		handleShapeRemove : function(e) {
			var f = e.shape;
			var l = e.parent;
			if (f instanceof ORYX.Core.Node
					&& f.getStencil().idWithoutNs() === "Lane"
					&& this.facade.isExecutingCommands()) {
				var g = this.getParentPool(l);
				if (g && g.parent) {
					var h = function(m) {
						return !m.getChildNodes().any(function(n) {
							return n.getStencil().idWithoutNs() === "Lane"
						})
					};
					var c = h(f);
					var k = l.getChildNodes().any(function(m) {
						return m.getStencil().idWithoutNs() === "Lane"
					});
					if (c && k) {
						var d = new a(f, l, g, this);
						this.facade.executeCommands([ d ])
					} else {
						if (!c
								&& !this.facade
										.getSelection()
										.any(
												function(m) {
													return m instanceof ORYX.Core.Node
															&& m
																	.getStencil()
																	.idWithoutNs() === "Lane"
															&& m.isParent(f)
															&& h(m)
												})) {
							var b = ORYX.Core.Command.extend({
								construct : function(m, n) {
									this.children = m.getChildNodes(true);
									this.facade = n
								},
								execute : function() {
									this.children.each(function(m) {
										m.bounds.moveBy(30, 0)
									})
								},
								rollback : function() {
									this.children.each(function(m) {
										m.bounds.moveBy(-30, 0)
									})
								}
							});
							this.facade
									.executeCommands([ new b(f, this.facade) ])
						} else {
							if (c && !k && l == g) {
								l.add(f)
							}
						}
					}
				}
			}
		},
		hashedSubProcesses : {},
		hashChildShapes : function(b) {
			var c = b.getChildNodes();
			c.each(function(d) {
				if (this.hashedSubProcesses[d.id]) {
					this.hashedSubProcesses[d.id] = d.absoluteXY();
					this.hashedSubProcesses[d.id].width = d.bounds.width();
					this.hashedSubProcesses[d.id].height = d.bounds.height();
					this.hashChildShapes(d)
				}
			}.bind(this))
		},
		handleSubProcess : function(d) {
			var c = d.shape;
			if (!this.hashedSubProcesses[c.id]) {
				this.hashedSubProcesses[c.id] = c.absoluteXY();
				this.hashedSubProcesses[c.id].width = c.bounds.width();
				this.hashedSubProcesses[c.id].height = c.bounds.height();
				return

				

								

				

			}
			var e = c.absoluteXY();
			e.x -= this.hashedSubProcesses[c.id].x;
			e.y -= this.hashedSubProcesses[c.id].y;
			var b = this.hashedSubProcesses[c.id].width !== c.bounds.width()
					|| this.hashedSubProcesses[c.id].height !== c.bounds
							.height();
			this.hashedSubProcesses[c.id] = c.absoluteXY();
			this.hashedSubProcesses[c.id].width = c.bounds.width();
			this.hashedSubProcesses[c.id].height = c.bounds.height();
			this.hashChildShapes(c);
			if (this.facade.isExecutingCommands() && !b) {
				this.moveChildDockers(c, e)
			}
		},
		moveChildDockers : function(d, g) {
			if (!g.x && !g.y) {
				return

				

								

				

			}
			var e = d.getChildNodes(true);
			var c = e.map(
					function(h) {
						return [].concat(h.getIncomingShapes()).concat(
								h.getOutgoingShapes())
					}).flatten().uniq().map(
					function(h) {
						return h.dockers.length > 2 ? h.dockers.slice(1,
								h.dockers.length - 1) : []
					}).flatten();
			var b = d.absoluteBounds();
			b.moveBy(-g.x, -g.y);
			var f = {};
			c.each(function(m) {
				if (m.isChanged) {
					return

					

										

					

				}
				var k = Object.clone(g);
				if (!b.isIncluded(m.bounds.center())) {
					var o = m.parent.dockers.indexOf(m);
					var s = m.parent.dockers.length;
					var q = m.parent.getSource();
					var r = m.parent.getTarget();
					var l = e.include(q) && e.include(r);
					if (!l) {
						var n = o !== 0 ? b
								.isIncluded(m.parent.dockers[o - 1].bounds
										.center()) : false;
						var p = o !== s - 1 ? b
								.isIncluded(m.parent.dockers[o + 1].bounds
										.center()) : false;
						if (!n && !p) {
							return

							

														

							

						}
						var h = m.parent.dockers[n ? o - 1 : o + 1];
						if (Math.abs(-Math.abs(h.bounds.center().x
								- m.bounds.center().x)) < 2) {
							k.y = 0
						} else {
							if (Math.abs(-Math.abs(h.bounds.center().y
									- m.bounds.center().y)) < 2) {
								k.x = 0
							} else {
								return

								

																

								

							}
						}
					}
				}
				f[m.getId()] = {
					docker : m,
					offset : k
				}
			});
			this.facade
					.executeCommands([ new ORYX.Core.MoveDockersCommand(f) ])
		},
		handleDockerDocked : function(d) {
			var e = this.getNamespace();
			var f = d.parent;
			var c = d.target;
			if (f.getStencil().id() === e + "SequenceFlow") {
				var b = c.getStencil().groups().find(function(g) {
					if (g == "Gateways") {
						return g
					}
				});
				if (!b && (f.properties["oryx-conditiontype"] == "Expression")) {
					f.setProperty("oryx-showdiamondmarker", true)
				} else {
					f.setProperty("oryx-showdiamondmarker", false)
				}
				this.facade.getCanvas().update()
			}
		},
		handlePropertyChanged : function(e) {
			var d = this.getNamespace();
			var c = e.elements;
			var f = e.key;
			var b = e.value;
			var g = false;
			c.each(function(k) {
				if ((k.getStencil().id() === d + "SequenceFlow")
						&& (f === "oryx-conditiontype")) {
					if (b != "Expression") {
						k.setProperty("oryx-showdiamondmarker", false)
					} else {
						var l = k.getIncomingShapes();
						if (!l) {
							k.setProperty("oryx-showdiamondmarker", true)
						}
						var h = l.find(function(m) {
							var n = m.getStencil().groups().find(function(o) {
								if (o == "Gateways") {
									return o
								}
							});
							if (n) {
								return n
							}
						});
						if (!h) {
							k.setProperty("oryx-showdiamondmarker", true)
						} else {
							k.setProperty("oryx-showdiamondmarker", false)
						}
					}
					g = true
				}
			}.bind(this));
			if (g) {
				this.facade.getCanvas().update()
			}
		},
		hashedPoolPositions : {},
		hashedLaneDepth : {},
		hashedBounds : {},
		hashedPositions : {},
		handleLayoutPool : function(u) {
			var o = u.shape;
			var F = this.facade.getSelection();
			var w = F.include(o) ? o : F.first();
			w = w || o;
			this.currentPool = o;
			if (!(w.getStencil().id().endsWith("Pool") || w.getStencil().id()
					.endsWith("Lane"))) {
				return

				

								

				

			}
			if (w !== o && !w.isParent(o) && !this.hashedBounds[o.id][w.id]) {
				return

				

								

				

			}
			if (!this.hashedBounds[o.id]) {
				this.hashedBounds[o.id] = {}
			}
			var A = this.getLanes(o);
			if (A.length <= 0) {
				return

				

								

				

			}
			var z = this.getLanes(o, true), b;
			var g = z.clone();
			var k = $H({});
			z.each(function(x) {
				k[x.id] = x.bounds.upperLeft()
			});
			if (A.length === 1 && this.getLanes(A.first()).length <= 0) {
				A.first().setProperty("oryx-showcaption",
						A.first().properties["oryx-name"].trim().length > 0);
				var d = A.first().node.getElementsByTagName("rect");
				d[0].setAttributeNS(null, "display", "none")
			} else {
				z.invoke("setProperty", "oryx-showcaption", true);
				z.each(function(x) {
					var y = x.node.getElementsByTagName("rect");
					y[0].removeAttributeNS(null, "display")
				})
			}
			var t = [];
			var n = [];
			var v = -1;
			while (++v < z.length) {
				if (!this.hashedBounds[o.id][z[v].id]) {
					n.push(z[v])
				}
			}
			if (n.length > 0) {
				w = n.first()
			}
			var C = $H(this.hashedBounds[o.id]).keys();
			var v = -1;
			while (++v < C.length) {
				if (!z.any(function(x) {
					return x.id == C[v]
				})) {
					t.push(this.hashedBounds[o.id][C[v]]);
					F = F.without(function(x) {
						return x.id == C[v]
					})
				}
			}
			var q, s, m, l;
			if (t.length > 0 || n.length > 0) {
				if (n.length === 1 && this.getLanes(n[0].parent).length === 1) {
					q = this.adjustHeight(A, n[0].parent)
				} else {
					q = this.updateHeight(o)
				}
				s = this.adjustWidth(A, o.bounds.width());
				o.update()
			} else {
				if (o == w) {
					if (F.length === 1
							&& this
									.isResized(o,
											this.hashedPoolPositions[o.id])) {
						var B = this.hashedPoolPositions[o.id].upperLeft();
						var f = o.bounds.upperLeft();
						var E = 0;
						if (this.shouldScale(o)) {
							var c = this.hashedPoolPositions[o.id];
							E = c.height() / o.bounds.height()
						}
						this.adjustLanes(o, z, B.x - f.x, B.y - f.y, E)
					}
					q = this.adjustHeight(A, undefined, o.bounds.height());
					s = this.adjustWidth(A, o.bounds.width())
				} else {
					if (F.length === 1
							&& this.isResized(w, this.hashedBounds[o.id][w.id])) {
						var B = this.hashedBounds[o.id][w.id].upperLeft();
						var f = w.absoluteXY();
						m = B.x - f.x;
						l = B.y - f.y;
						if (m || l) {
							g = g.without(w);
							this.adjustLanes(o, this.getAllExcludedLanes(o, w),
									m, 0)
						}
						var h = this.getLanes(w, true);
						if (h.length > 0) {
							if (this.shouldScale(w)) {
								var c = this.hashedBounds[o.id][w.id];
								var E = c.height() / w.bounds.height();
								this.adjustLanes(o, h, m, l, E)
							} else {
								this.adjustLanes(o, h, m, l, 0)
							}
						}
					}
					var D = z.map(function(x) {
						return {
							shape : x,
							bounds : x.bounds.clone()
						}
					});
					q = this.adjustHeight(A, w);
					this.checkForChanges(z, D);
					s = this.adjustWidth(A, w.bounds.width()
							+ (this.getDepth(w, o) * 30))
				}
			}
			this.setDimensions(o, s, q, m, l);
			if (this.facade.isExecutingCommands()
					&& (t.length === 0 || n.length !== 0)) {
				this.updateDockers(g, o);
				if (this.hashedPositions[o.id]
						&& this.hashedPositions[o.id].keys().any(
								function(y, x) {
									return (z[x] || {}).id !== y
								})) {
					var r = ORYX.Core.Command.extend({
						construct : function(H, G, y, I, x) {
							this.originPosition = Object.clone(H);
							this.newPosition = Object.clone(G);
							this.lanes = y;
							this.plugin = I;
							this.pool = x
						},
						execute : function() {
							if (!this.executed) {
								this.executed = true;
								this.lanes.each(function(x) {
									if (this.newPosition[x.id]) {
										x.bounds.moveTo(this.newPosition[x.id])
									}
								}.bind(this));
								this.plugin.hashedPositions[this.pool] = Object
										.clone(this.newPosition)
							}
						},
						rollback : function() {
							this.lanes.each(function(x) {
								if (this.originPosition[x.id]) {
									x.bounds.moveTo(this.originPosition[x.id])
								}
							}.bind(this));
							this.plugin.hashedPositions[this.pool] = Object
									.clone(this.originPosition)
						}
					});
					var p = $H({});
					z.each(function(x) {
						p[x.id] = x.bounds.upperLeft()
					});
					var e = new r(k, p, z, this, o.id);
					this.facade.executeCommands([ e ])
				}
			}
			this.hashedBounds[o.id] = {};
			this.hashedPositions[o.id] = k;
			var v = -1;
			while (++v < z.length) {
				this.hashedBounds[o.id][z[v].id] = z[v].absoluteBounds();
				this.hashChildShapes(z[v]);
				this.hashedLaneDepth[z[v].id] = this.getDepth(z[v], o);
				this.forceToUpdateLane(z[v])
			}
			this.hashedPoolPositions[o.id] = o.bounds.clone()
		},
		shouldScale : function(b) {
			var c = b.getChildNodes().findAll(function(d) {
				return d.getStencil().id().endsWith("Lane")
			});
			return c.length > 1 || c.any(function(d) {
				return this.shouldScale(d)
			}.bind(this))
		},
		checkForChanges : function(b, c) {
			if (this.facade.isExecutingCommands() && c.any(function(e) {
				return e.shape.bounds.toString() !== e.bounds.toString()
			})) {
				var d = ORYX.Core.Command.extend({
					construct : function(e) {
						this.oldState = e;
						this.newState = e.map(function(f) {
							return {
								shape : f.shape,
								bounds : f.bounds.clone()
							}
						})
					},
					execute : function() {
						if (this.executed) {
							this.applyState(this.newState)
						}
						this.executed = true
					},
					rollback : function() {
						this.applyState(this.oldState)
					},
					applyState : function(e) {
						e.each(function(f) {
							f.shape.bounds.set(f.bounds.upperLeft(), f.bounds
									.lowerRight())
						})
					}
				});
				this.facade.executeCommands([ new d(c) ])
			}
		},
		isResized : function(b, d) {
			if (!d || !b) {
				return false
			}
			var c = d;
			return Math.round(c.width() - b.bounds.width()) !== 0
					|| Math.round(c.height() - b.bounds.height()) !== 0
		},
		adjustLanes : function(d, c, b, f, e) {
			e = e || 0;
			c.each(function(g) {
				g.getChildNodes().each(
						function(k) {
							if (!k.getStencil().id().endsWith("Lane")) {
								var h = e ? k.bounds.center().y
										- (k.bounds.center().y / e) : -f;
								k.bounds.moveBy((b || 0), -h);
								if (e
										&& k.getStencil().id().endsWith(
												"Subprocess")) {
									this.moveChildDockers(k, {
										x : (0),
										y : -h
									})
								}
							}
						}.bind(this));
				this.hashedBounds[d.id][g.id].moveBy(-(b || 0), !e ? -f : 0);
				if (e) {
					g.isScaled = true
				}
			}.bind(this))
		},
		getAllExcludedLanes : function(d, b) {
			var c = [];
			d.getChildNodes().each(function(e) {
				if ((!b || e !== b) && e.getStencil().id().endsWith("Lane")) {
					c.push(e);
					c = c.concat(this.getAllExcludedLanes(e, b))
				}
			}.bind(this));
			return c
		},
		forceToUpdateLane : function(b) {
			if (b.bounds.height() !== b._svgShapes[0].height) {
				b.isChanged = true;
				b.isResized = true;
				b._update()
			}
		},
		getDepth : function(d, c) {
			var b = 0;
			while (d && d.parent && d !== c) {
				d = d.parent;
				++b
			}
			return b
		},
		updateDepth : function(c, b, d) {
			var e = (b - d) * 30;
			c.getChildNodes().each(
					function(f) {
						f.bounds.moveBy(e, 0);
						[].concat(children[j].getIncomingShapes()).concat(
								children[j].getOutgoingShapes())
					})
		},
		setDimensions : function(e, f, c, b, g) {
			var d = e.getStencil().id().endsWith("Lane");
			e.bounds.set(d ? 30 : (e.bounds.a.x - (b || 0)), d ? e.bounds.a.y
					: (e.bounds.a.y - (g || 0)), f ? e.bounds.a.x + f
					- (d ? 30 : (b || 0)) : e.bounds.b.x, c ? e.bounds.a.y + c
					- (d ? 0 : (g || 0)) : e.bounds.b.y)
		},
		setLanePosition : function(b, c) {
			b.bounds.moveTo(30, c)
		},
		adjustWidth : function(b, c) {
			(b || []).each(function(d) {
				this.setDimensions(d, c);
				this.adjustWidth(this.getLanes(d), c - 30)
			}.bind(this));
			return c
		},
		adjustHeight : function(e, g, c) {
			var h = 0;
			if (!g && c) {
				var f = -1;
				while (++f < e.length) {
					h += e[f].bounds.height()
				}
			}
			var f = -1;
			var b = 0;
			while (++f < e.length) {
				if (e[f] === g) {
					this.adjustHeight(this.getLanes(e[f]), undefined,
							e[f].bounds.height());
					e[f].bounds.set({
						x : 30,
						y : b
					}, {
						x : e[f].bounds.width() + 30,
						y : e[f].bounds.height() + b
					})
				} else {
					if (!g && c) {
						var d = (e[f].bounds.height() * c) / h;
						this.adjustHeight(this.getLanes(e[f]), undefined, d);
						this.setDimensions(e[f], null, d);
						this.setLanePosition(e[f], b)
					} else {
						var d = this.adjustHeight(this.getLanes(e[f]), g, c);
						if (!d) {
							d = e[f].bounds.height()
						}
						this.setDimensions(e[f], null, d);
						this.setLanePosition(e[f], b)
					}
				}
				b += e[f].bounds.height()
			}
			return b
		},
		updateHeight : function(c) {
			var d = this.getLanes(c);
			if (d.length == 0) {
				return c.bounds.height()
			}
			var b = 0;
			var e = -1;
			while (++e < d.length) {
				this.setLanePosition(d[e], b);
				b += this.updateHeight(d[e])
			}
			this.setDimensions(c, null, b);
			return b
		},
		getOffset : function(b, d, c) {
			var f = {
				x : 0,
				y : 0
			};
			var f = b.absoluteXY();
			var e = this.hashedBounds[c.id][b.id]
					|| (d === true ? this.hashedPoolPositions[b.id] : undefined);
			if (e) {
				f.x -= e.upperLeft().x;
				f.y -= e.upperLeft().y
			} else {
				return {
					x : 0,
					y : 0
				}
			}
			return f
		},
		getNextLane : function(b) {
			while (b && !b.getStencil().id().endsWith("Lane")) {
				if (b instanceof ORYX.Core.Canvas) {
					return null
				}
				b = b.parent
			}
			return b
		},
		getParentPool : function(b) {
			while (b && !b.getStencil().id().endsWith("Pool")) {
				if (b instanceof ORYX.Core.Canvas) {
					return null
				}
				b = b.parent
			}
			return b
		},
		updateDockers : function(B, t) {
			var r = t.absoluteBounds(), v = [];
			var s = (this.hashedPoolPositions[t.id] || r).clone();
			var A = -1, z = -1, y = -1, w = -1, u;
			var C = {};
			while (++A < B.length) {
				if (!this.hashedBounds[t.id][B[A].id]) {
					continue
				}
				var d = B[A].isScaled;
				delete B[A].isScaled;
				var h = B[A].getChildNodes();
				var p = B[A].absoluteBounds();
				var e = (this.hashedBounds[t.id][B[A].id] || p);
				var m = this.getOffset(B[A], true, t);
				var f = 0;
				var E = this.getDepth(B[A], t);
				if (this.hashedLaneDepth[B[A].id] !== undefined
						&& this.hashedLaneDepth[B[A].id] !== E) {
					f = (this.hashedLaneDepth[B[A].id] - E) * 30;
					m.x += f
				}
				z = -1;
				while (++z < h.length) {
					if (f && !h[z].getStencil().id().endsWith("Lane")) {
						v.push({
							xOffset : f,
							shape : h[z]
						});
						h[z].bounds.moveBy(f, 0)
					}
					if (h[z].getStencil().id().endsWith("Subprocess")) {
						this.moveChildDockers(h[z], m)
					}
					var c = [].concat(h[z].getIncomingShapes()).concat(
							h[z].getOutgoingShapes()).findAll(function(k) {
						return k instanceof ORYX.Core.Edge
					});
					y = -1;
					while (++y < c.length) {
						if (c[y].getStencil().id().endsWith("MessageFlow")) {
							this.layoutEdges(h[z], [ c[y] ], m);
							continue
						}
						w = -1;
						while (++w < c[y].dockers.length) {
							u = c[y].dockers[w];
							if (u.getDockedShape() || u.isChanged) {
								continue
							}
							pos = u.bounds.center();
							var b = e.isIncluded(pos);
							var q = !s.isIncluded(pos);
							var g = w == 0 ? b : e
									.isIncluded(c[y].dockers[w - 1].bounds
											.center());
							var n = w == c[y].dockers.length - 1 ? b : e
									.isIncluded(c[y].dockers[w + 1].bounds
											.center());
							var D = Object.clone(m);
							if (d
									&& b
									&& this.isResized(B[A],
											this.hashedBounds[t.id][B[A].id])) {
								var x = (pos.y - p.upperLeft().y + D.y);
								D.y -= (x - (x * (p.height() / e.height())))
							}
							if (b) {
								C[u.id] = {
									docker : u,
									offset : D
								}
							}
						}
					}
				}
			}
			var o = ORYX.Core.Command.extend({
				construct : function(k) {
					this.state = k
				},
				execute : function() {
					if (this.executed) {
						this.state.each(function(k) {
							k.shape.bounds.moveBy(k.xOffset, 0)
						})
					}
					this.executed = true
				},
				rollback : function() {
					this.state.each(function(k) {
						k.shape.bounds.moveBy(-k.xOffset, 0)
					})
				}
			});
			this.facade.executeCommands([ new ORYX.Core.MoveDockersCommand(C),
					new o(v) ])
		},
		moveBy : function(c, b) {
			c.x += b.x;
			c.y += b.y;
			return c
		},
		getHashedBounds : function(b) {
			return this.currentPool
					&& this.hashedBounds[this.currentPool.id][b.id] ? this.hashedBounds[this.currentPool.id][b.id]
					: b.absoluteBounds()
		},
		getLanes : function(b, d) {
			var e = this.getNamespace();
			var c = b.getChildNodes(d || false).findAll(function(f) {
				return (f.getStencil().id() === e + "Lane")
			});
			c = c.sort(function(w, u) {
				var v = Math.round(w.bounds.upperLeft().y);
				var p = Math.round(u.bounds.upperLeft().y);
				var s = Math.round(w.bounds.lowerRight().y);
				var m = Math.round(u.bounds.lowerRight().y);
				var h = this.getHashedBounds(w);
				var g = this.getHashedBounds(u);
				var o = Math.round(h.upperLeft().y);
				var y = Math.round(g.upperLeft().y);
				var l = Math.round(h.lowerRight().y);
				var x = Math.round(g.lowerRight().y);
				if (v == p && s == m) {
					v = o;
					p = y;
					s = l;
					m = x
				}
				if (Math.round(w.bounds.height() - h.height()) === 0
						&& Math.round(u.bounds.height() - g.height()) === 0) {
					return v < p ? -1 : (v > p ? 1 : 0)
				}
				var t = v < p && s < m;
				var q = v > p && s > m;
				var k = v < p && s >= m && l < x;
				var n = v >= p && s < m && o < y;
				var r = v > p && s <= m && l > x;
				var f = v <= p && s > m && o > y;
				return (t || k || n ? -1 : (q || r || f ? 1 : 0))
			}.bind(this));
			return c
		},
		getNamespace : function() {
			if (!this.namespace) {
				var b = this.facade.getStencilSets();
				if (b.keys()) {
					this.namespace = b.keys()[0]
				} else {
					return undefined
				}
			}
			return this.namespace
		}
	};
	var a = ORYX.Core.Command
			.extend({
				construct : function(b, d, c, e) {
					this.facade = e.facade;
					this.plugin = e;
					this.shape = b;
					this.changes;
					this.pool = c;
					this.parent = d;
					this.shapeChildren = [];
					this.shape.getChildShapes().each(function(f) {
						this.shapeChildren.push({
							shape : f,
							bounds : {
								a : {
									x : f.bounds.a.x,
									y : f.bounds.a.y
								},
								b : {
									x : f.bounds.b.x,
									y : f.bounds.b.y
								}
							}
						})
					}.bind(this));
					this.shapeUpperLeft = this.shape.bounds.upperLeft();
					this.parentHeight = this.parent.bounds.height()
				},
				getLeafLanes : function(b) {
					var c = this.plugin.getLanes(b).map(function(d) {
						return this.getLeafLanes(d)
					}.bind(this)).flatten();
					return c.length > 0 ? c : [ b ]
				},
				findNewLane : function() {
					var b = this.plugin.getLanes(this.parent);
					var c = this.getLeafLanes(this.parent);
					this.lane = c.find(function(d) {
						return d.bounds.upperLeft().y >= this.shapeUpperLeft.y
					}.bind(this)) || c.last();
					this.laneUpperLeft = this.lane.bounds.upperLeft()
				},
				execute : function() {
					if (this.changes) {
						this.executeAgain();
						return

						

												

						

					}
					if (!this.lane) {
						this.findNewLane()
					}
					if (this.lane) {
						var f = this.laneUpperLeft;
						var d = this.shapeUpperLeft;
						var c = this.plugin.getDepth(this.lane, this.parent) - 1;
						this.changes = $H({});
						if (f.y >= d.y) {
							this.lane.getChildShapes().each(
									function(g) {
										if (!this.changes[g.getId()]) {
											this.changes[g.getId()] = this
													.computeChanges(g,
															this.lane,
															this.lane,
															this.shape.bounds
																	.height())
										}
										g.bounds.moveBy(0, this.shape.bounds
												.height())
									}.bind(this));
							this.plugin.hashChildShapes(this.lane);
							this.shapeChildren
									.each(function(g) {
										g.shape.bounds.set(g.bounds);
										g.shape.bounds.moveBy((d.x - 30)
												- (c * 30), 0);
										if (!this.changes[g.shape.getId()]) {
											this.changes[g.shape.getId()] = this
													.computeChanges(g.shape,
															this.shape,
															this.lane, 0)
										}
										this.lane.add(g.shape)
									}.bind(this));
							this.lane.bounds.moveBy(0, d.y - f.y)
						} else {
							if (d.y > f.y) {
								this.shapeChildren.each(function(g) {
									g.shape.bounds.set(g.bounds);
									g.shape.bounds.moveBy(
											(d.x - 30) - (c * 30),
											this.lane.bounds.height());
									if (!this.changes[g.shape.getId()]) {
										this.changes[g.shape.getId()] = this
												.computeChanges(g.shape,
														this.shape, this.lane,
														0)
									}
									this.lane.add(g.shape)
								}.bind(this))
							}
						}
					}
					var e = this.lane.bounds.height();
					var b = this.lane.length === 1 ? this.parentHeight
							: this.lane.bounds.height()
									+ this.shape.bounds.height();
					this.setHeight(b, e, this.parent, this.parentHeight, true);
					this.plugin.getLanes(this.parent).each(
							function(g) {
								if (!this.changes[g.getId()] && g !== this.lane
										&& g !== this.shape) {
									this.changes[g.getId()] = this
											.computeChanges(g, this.parent,
													this.parent, 0)
								}
							}.bind(this));
					this.update()
				},
				setHeight : function(b, f, e, d, c) {
					this.plugin.setDimensions(this.lane, this.lane.bounds
							.width(), b);
					this.plugin.hashedBounds[this.pool.id][this.lane.id] = this.lane
							.absoluteBounds();
					this.plugin
							.adjustHeight(this.plugin.getLanes(e), this.lane);
					if (c === true) {
						this.changes[this.shape.getId()] = this.computeChanges(
								this.shape, e, e, 0, f, b)
					}
					this.plugin.setDimensions(e, e.bounds.width(), d);
					if (e !== this.pool) {
						this.plugin.setDimensions(this.pool, this.pool.bounds
								.width(), this.pool.bounds.height() + (b - f))
					}
				},
				update : function() {
					this.plugin.hashedBounds[this.pool.id]["REMOVED"] = true
				},
				rollback : function() {
					var c = this.laneUpperLeft;
					var b = this.shapeUpperLeft;
					this.changes.each(function(h) {
						var g = h.value.oldParent;
						var e = h.value.shape;
						var f = h.value.parentHeight;
						var k = h.value.oldHeight;
						var d = h.value.newHeight;
						if (e.getStencil().id().endsWith("Lane")) {
							e.bounds.moveTo(h.value.oldPosition)
						}
						if (k) {
							this
									.setHeight(k, d, g, g.bounds.height()
											+ (k - d));
							if (c.y >= b.y) {
								this.lane.bounds.moveBy(0, this.shape.bounds
										.height() - 1)
							}
						} else {
							g.add(e);
							e.bounds.moveTo(h.value.oldPosition)
						}
					}.bind(this))
				},
				executeAgain : function() {
					this.changes.each(function(f) {
						var d = f.value.newParent;
						var c = f.value.shape;
						var b = f.value.newHeight;
						var h = f.value.oldHeight;
						if (b) {
							var g = this.laneUpperLeft.y;
							var e = this.shapeUpperLeft.y;
							if (g >= e) {
								this.lane.bounds.moveBy(0, e - g)
							}
							this
									.setHeight(b, h, d, d.bounds.height()
											+ (b - h))
						} else {
							d.add(c);
							c.bounds.moveTo(f.value.newPosition)
						}
					}.bind(this));
					this.update()
				},
				computeChanges : function(d, l, k, c, m, b) {
					l = this.changes[d.getId()] ? this.changes[d.getId()].oldParent
							: l;
					var h = this.changes[d.getId()] ? this.changes[d.getId()].oldPosition
							: d.bounds.upperLeft();
					var f = d.bounds.upperLeft();
					var e = {
						x : f.x,
						y : f.y + c
					};
					var g = {
						shape : d,
						parentHeight : l.bounds.height(),
						oldParent : l,
						oldPosition : h,
						oldHeight : m,
						newParent : k,
						newPosition : e,
						newHeight : b
					};
					return g
				}
			});
	ORYX.Plugins.BPMN2_0 = ORYX.Plugins.AbstractPlugin
			.extend(ORYX.Plugins.BPMN2_0)
}();