import Vue from 'vue';
import Vuex from 'vuex';

import {axiosGet as get, BASE_URL as baseUrl} from '@/utils/global';
import {RESOURCE_TYPES} from '@/utils/constants';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        films: {},
        people: {},
        species: {},
        starships: {},
        vehicles: {},
        planets: {},
        errors: [],
    },
    mutations: {
        setResource: function(state, {type, id, resource}) {
            // probably don't need to convert using RESOURCE_TYPES since the types are all 
            // already in plural format, but just in case
            state[RESOURCE_TYPES[type]['plural'].toLowerCase()][id] = resource;
            return state;
        },
        addError: function(state, err) {
            state.errors.push(err);
        },
        removeError: function(state) {
            state.errors.pop();
        },
        clearErrors: function(state) {
            state.errors = [];
        },
    },
    getters: {
        getResource: function(state) {
            return (type, id) => {
                // check for "Root" resources
                if (!id) {
                    return state[type] && 
                        (Array.isArray(state[type]) ? 
                            state[type].length > 0 :
                            Object.entries(state[type]).length > 0) 
                        ? state[type] : null;
                }

                // check for specific resources with an id
                if (state[type] && state[type][id]) {
                    return state[type][id];
                }
                return null;
            };
        },
        getErrors: function(state) {
            return state.errors;
        },
    },
    actions: {
        /**
         * Handles fetching either the "Root" resource (e.g. /api/films) or
         * a specific id (e.g. /api/people/1)
         */
        async fetchResource({commit, getters}, {type, id = null}) {
            // check if resource already exists in the store
            // if it's already been fetched before, just commit the
            // existing data
            // edit: need to fetch root objects every time because the app
            // can mistakenly think it's fetched _all_ films even though it hasn't
            // and the key is populated 
            let resource = null;
            if (id && (resource = getters.getResource(type, id))) {
                commit('setResource', {type, id, resource});
                return;
            }
            
            let res;
            try {
                res = await get(`/${type}` + (id ? `/${id}` : ""), {promisify: true});
            } catch (err) {                
                commit('addError', err);
            }

            // otherwise, process (unpack) the data first in a way
            // that we can store into Vuexs
            let {pages, lists} = unpackResources(res, id);

            // commit page data (e.g. set of details for one Film)
            // and list data (e.g. all of grouped People, Vehicles, and Planets 
            // for the same Film, in terms of only their resource URL's so far
            for (id in pages) {
                let data = pages[id];
                data['lists'] = lists[id];
                data['id'] = id;
                commit('setResource', {
                    type,
                    id,
                    resource: data,
                });
            }
        },
    },
});

/**
 * Formats and organizes data from the api into useable objects
 * within our app, especially to store within Vuex
 * 
 * @param {Number} id - If we fetched a resource with a specific id,
 *                      pass in so that we have a key for the object
 *                      in which we're assigning the resource
 * @return {
*      fields: {
*          [id]: {
*              name,
*              release_date,
*              url,
*              ...
*          },
*          ...
*      },
*      lists: {
*          [id]: {
*              [type]: [path1, path2, ...],
*          },
*          ...
*      }
* }
*/
function unpackResources(data, id = null) {
    let unpackedPages = {},
        unpackedLists = {};

    // TODO unpack pagination & return it as well
    // ...

    // check if we're fetching a type of resource or a specific item with id
    if (!id) {
        unpackedPages = [];
        unpackedLists = {};
        let results = data.results;
        for (let i = 0; i < results.length; i++) {
            // extract only the id from the url
            const escapedBaseUrl = baseUrl.replace(/\//g, '\\/').replace(/\./g, '\\.');
            let id = results[i].url.match(new RegExp(`^${escapedBaseUrl}\\w+\\/(\\d+)?\\/?`));
            let {fields, listItems} = unpack(results[i]);
            if (id.length != 2) {
                // invalid url? id is missing
                continue;
            }
            id = id[1];
            unpackedPages[id] = fields;
            unpackedLists[id] = listItems;
        }
    } else {
        let {fields, listItems} = unpack(data);
        unpackedPages[id] = fields;
        unpackedLists[id] = listItems;
    }

    /**
    *  separate detail fields and resource URL's, which are
    *  to be converted into ResourceLists later once the 
    *  user interacts with them
    */
    function unpack(item) {
        const unpackedFields = {};
        const unpackedListItems = {};        
        for (let field in item) {
            let value = item[field];
                 
            let urls;
            // figure out if this is a collection of/singular resource URL
            if (Array.isArray(value)) {
                // if empty array, continue because it has no semantic benefit
                // to the user
                if (value.length < 1) {
                    continue;
                }

                urls = value[0].indexOf(baseUrl) > -1 ? value : null;
            } else if (typeof value == 'string' && value.indexOf(baseUrl) > -1) {
                urls = [value];
            }
            if (urls) {
                // loop through all resources
                for (let path of urls) {
                    // extract only the path from the entire string
                    path = path.replace(baseUrl, '');
                    let parts = null;                    
                    if ((parts = path.split('/')).length != 3) {
                        // invalid path, should have exactly three parts 
                        // (including id and type)
                        continue;
                    }
                    // let id = parts[1];
                    let type = parts[0];                    
                    
                    // create the array if it doesn't exist
                    if (unpackedListItems[type] === null ||
                        typeof unpackedListItems[type] === 'undefined') {
                        unpackedListItems[type] = [];
                    }
                    unpackedListItems[type].push(path);
                }
            } else {
                unpackedFields[field] = value;
            }
        }

        return {fields: unpackedFields, listItems: unpackedListItems};
    }

    return {
        pages: unpackedPages,
        lists: unpackedLists,
    };
}
