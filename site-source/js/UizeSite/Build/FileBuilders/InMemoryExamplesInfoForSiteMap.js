/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.InMemoryExamplesInfoForSiteMap Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.InMemoryExamplesInfoForSiteMap= module defines a file builder for the in-memory examples-info-for-sitemap object.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.InMemoryExamplesInfoForSiteMap',
	required:'Uize.Data.Matches',
	builder:function () {
		return Uize.package ({
			description:'In-memory examples-info-for-sitemap object',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.memoryUrl ('examples-info-for-sitemap');
			},
			builderInputs:function () {
				return {examplesByKeyword:this.memoryUrl ('examples-by-keyword')};
			},
			builder:function (_inputs) {
				var _examplesByKeyword = this.readFile ({path:_inputs.examplesByKeyword});
				return {
					keywords:Uize.Data.Matches.values (
						Uize.keys (_examplesByKeyword),
						'value && value.slice (0,4) != "Uize"'
					).sort (),
					tools:Uize.map (_examplesByKeyword.tool,'{title:value.title,path:value.path}')
				};
			}
		});
	}
});

