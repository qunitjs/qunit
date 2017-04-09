module.exports = {
	_store: Object.create( null ),
	setItem: function( key, value ) {
		this._store[ key ] = value;
	},
	getItem: function( key ) {
		return key in this._store ? this._store[ key ] : null;
	},
	removeItem: function( key ) {
		if ( key in this._store ) {
			delete this._store[ key ];
		}
	},
	key: function( i ) {
		return Object.keys( this._store )[ i ];
	},
	get length() {
		return Object.keys( this._store ).length;
	}
};
