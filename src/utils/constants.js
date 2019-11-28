/**
 * Standardization of the different resource types along with
 * their mapped representations in this app, so that we can
 * consistently refer to them (and their corresponding 
 * components) by the same names, in both converted singular
 * and plural form
 */
const RESOURCE_TYPES = {
    films: {
        singular: 'Film',
        plural: 'Films',
    },
    people: {
        singular: 'Person',
        plural: 'People',
    },
    species: {
        singular: 'Species',
        plural: 'Species',
    },
    starships: {
        singular: 'Starship',
        plural: 'Starships',
    },
    vehicles: {
        singular: 'Vehicle',
        plural: 'Vehicles',
    },
    planets: {
        singular: 'Planet',
        plural: 'Planets',
    },
};

export default {
    RESOURCE_TYPES,
};