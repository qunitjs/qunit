import config from "./config";

function makeAddGlobalHook( hookName ) {
	return function addGlobalHook( callback ) {
		if ( !config.globalHooks[ hookName ] ) {
			config.globalHooks[ hookName ] = [];
		}
		config.globalHooks[ hookName ].push( callback );
	};
}

export const hooks = {
	beforeEach: makeAddGlobalHook( "beforeEach" ),
	afterEach: makeAddGlobalHook( "afterEach" )
};
