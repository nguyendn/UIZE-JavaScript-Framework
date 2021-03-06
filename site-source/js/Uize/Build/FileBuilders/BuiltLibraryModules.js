/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.BuiltLibraryModules Package
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
		The =Uize.Build.FileBuilders.BuiltLibraryModules= module defines a file builder for the built versions of the JavaScript library modules (=.library.js= files) of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.BuiltLibraryModules',
	required:[
		'Uize.Str.Has',
		'Uize.Str.Lines',
		'Uize.Str.Trim',
		'Uize.Build.Util',
		'Uize.Url',
		'Uize.Build.ModuleInfo'
	],
	builder:function () {
		var
			_contentsCommentRegExp = /\/\*\s*Library\s*Contents/i,
			_lineStartsWithIdentifierCharRegExp = /^[a-zA-Z_$]/,
			_libraryUsesUizeModulesHeader =
				'/*______________\n' +
				'|       ______  |   B U I L T     O N     U I Z E     F R A M E W O R K\n' +
				'|     /      /  |   ---------------------------------------------------\n' +
				'|    /    O /   |   This JavaScript application is developed using the object\n' +
				'|   /    / /    |   oriented UIZE JavaScript framework as its foundation.\n' +
				'|  /    / /  /| |\n' +
				'| /____/ /__/_| |    ONLINE : http://www.uize.com\n' +
				'|          /___ |   LICENSE : Available under MIT License or GNU General Public License\n' +
				'|_______________|             http://www.uize.com/license.html\n' +
				'*/\n\n'
		;

		return Uize.package ({
			description:'JavaScript library modules',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					!this.params.isDev &&
					Uize.Str.Has.hasPrefix (_pathname,this.builtUrl (this.params.modulesFolder + '/')) &&
					(
						_urlParts.file == 'library.js' ||
						Uize.Str.Has.hasSuffix (_pathname,'.library.js')
					)
				);
			},
			builderInputs:function (_urlParts) {
				var
					m = this,
					_pathname = _urlParts.pathname,
					_librarySourcePath = m.sourceUrlFromBuiltUrl (_pathname),
					_libraryFileContents = m.readFile ({path:_librarySourcePath}),
					_contentsCommentStartPos = _libraryFileContents.search (_contentsCommentRegExp),
					_contentsCommentEndPos = _libraryFileContents.indexOf ('*/',_contentsCommentStartPos),
					_modules = []
				;
				function _moduleBuiltUrl (_moduleName) {
					return m.builtUrl (m.getModuleUrl (_moduleName));
				}
				Uize.Str.Lines.forEach (
					_contentsCommentStartPos > -1
						?
							_libraryFileContents.slice (_contentsCommentStartPos,_contentsCommentEndPos)
								.replace (_contentsCommentRegExp,'')
						: _libraryFileContents
					,
					function (_moduleName) {
						if (
							(_moduleName = Uize.Str.Trim.trim (_moduleName)) &&
							_lineStartsWithIdentifierCharRegExp.test (_moduleName)
						) {
							Uize.Str.Has.hasSuffix (_moduleName,'->')
								? Uize.push (
									_modules,
									Uize.map (
										Uize.Build.ModuleInfo.traceDependencies (_moduleName.slice (0,-2),['Uize']),
										_moduleBuiltUrl
									)
								)
								: _modules.push (_moduleBuiltUrl (_moduleName))
							;
						}
					}
				);
				return {
					librarySource:_librarySourcePath,
					modules:_modules
				};
			},
			builder:function (_inputs) {
				function _stripModuleHeaderComment (_moduleText) {
					var _moduleHeaderCommentPos = _moduleText.indexOf ('/*');
					return (
						_moduleHeaderCommentPos > -1
							? (
								_moduleText.slice (0,_moduleHeaderCommentPos) +
								_moduleText.slice (_moduleText.indexOf ('*/',_moduleHeaderCommentPos + 2) + 2)
							)
							: _moduleText
					);
				}
				var
					m = this,
					_libraryFileContents = m.readFile ({path:_inputs.librarySource}),
					_contentsCommentStartPos = _libraryFileContents.search (_contentsCommentRegExp),
					_contentsCommentEndPos = _libraryFileContents.indexOf ('*/',_contentsCommentStartPos),
					_libraryUsesUizeModules,
					_libraryContentsChunks = Uize.map (
						_inputs.modules,
						function (_modulePath) {
							if (!_libraryUsesUizeModules)
								_libraryUsesUizeModules = Uize.Str.Has.hasPrefix (Uize.Url.from (_modulePath).fileName,'Uize')
							;
							return _stripModuleHeaderComment (m.readFile ({path:_modulePath}));
						}
					)
				;
				return (
					(_libraryUsesUizeModules ? _libraryUsesUizeModulesHeader : '') +
					_libraryFileContents.slice (0,_contentsCommentStartPos) +
					_libraryContentsChunks.join ('\n') +
					_libraryFileContents.slice (_contentsCommentEndPos + 2)
				);
			}
		});
	}
});

