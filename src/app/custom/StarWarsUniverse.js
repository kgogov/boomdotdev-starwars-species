import { EventEmitter } from "eventemitter3";
import config from "../../config";
import Species from "./Species";

export default class StarWarsUniverse extends EventEmitter {
    constructor() {
        super();

        this.species = [];
        this._maxSpecies = config.MAX_SPECIES;
    }

    static get events() {
        return {
            MAX_SPECIES_REACHED: 'max_species_reached',
            SPECIES_CREATED: 'species_created'
        }
    }

    get speciesCount() {
        return this.species.length;
    }

    async _onSpeciesCreated(data) {
        this.species.push(new Species(data.name, data.classification));
        this.emit(StarWarsUniverse.events.SPECIES_CREATED, { speciesCount: this.species.length });
        
        if (this.species.length === 10) {
            return this.emit(StarWarsUniverse.events.MAX_SPECIES_REACHED);
        }
    }

    async createSpecies() {
        const species = new Species();

        species.on(StarWarsUniverse.events.SPECIES_CREATED, function(data) {
            this._onSpeciesCreated(data);
        }, this);

        for (let i = 1; i <= config.MAX_SPECIES; i++) {
            await species.init(`https://swapi.boom.dev/api/species/${i}/`);
        }

    }
}