/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.Cdata Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 1
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Util.Xml.Cdata= module provides methods for parsing and serializing CDATA sections of XML documents.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.Cdata',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				// ...

			/*** General Variables ***/
				// ...
		;

		/*** Utility Functions ***/
			// ...

		return Uize.copyInto (
			function () {
			},

			prototype:{
				source:'',
				index:0,
				length:0,
				isValid:false,
				cdata:'',

				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.isValid = false;
					m.index = _index || (_index = 0);
					m.length = 0;
					m.cdata = '';
					/*
						expect <[CDATA[
						expect zero or more characters
						expect ]]>
					*/
				},

				serialize:function () {
					return this.isValid ? '<[CDATA[' + this.cdata + ']]>' : '';
				}
			}
		);
	}
});

