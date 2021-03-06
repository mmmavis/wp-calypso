/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import pickBy from 'lodash/pickBy';
import keyBy from 'lodash/keyBy';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';

/**
 * Internal dependencies
 */
import { plans } from './plans/reducer';
import { SITE_RECEIVE, SERIALIZE, DESERIALIZE } from 'state/action-types';
import { sitesSchema } from './schema';
import { isValidStateWithSchema } from 'state/utils';

/**
 * Tracks all known site objects, indexed by site ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function items( state = {}, action ) {
	switch ( action.type ) {
		case SITE_RECEIVE:
			return Object.assign( {}, state, {
				[ action.site.ID ]: action.site
			} );
		case SERIALIZE:
			// scrub _events, _maxListeners, and other misc functions
			const sites = Object.keys( state ).map( ( siteID ) => {
				let plainJSObject = pickBy( state[ siteID ], ( value ) => ! isFunction( value ) );
				plainJSObject = omit( plainJSObject, [ '_events', '_maxListeners'] );
				return plainJSObject;
			} );
			return keyBy( sites, 'ID' );
		case DESERIALIZE:
			if ( isValidStateWithSchema( state, sitesSchema ) ) {
				return state;
			}
			return {};
	}
	return state;
}

export default combineReducers( {
	items,
	plans
} );
