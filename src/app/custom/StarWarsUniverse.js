import { EventEmitter } from "eventemitter3";
import Species from "./Species";
import config from "../../config";

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
        if (this.species.length === 0) return undefined;
        return this.species.length;
    }

    async createSpecies() {
        let isMaxSpeciesReached = false;
        let speciesCount = 1;

        while (isMaxSpeciesReached === false) {
            const species = new Species();

            species.on(StarWarsUniverse.events.SPECIES_CREATED, () =>
                this._onSpeciesCreated(species)
            );

            this.on(StarWarsUniverse.events.SPECIES_CREATED, (species) =>
                this._checkForMaxSpecies(species)
            );

            this.once(
                StarWarsUniverse.events.MAX_SPECIES_REACHED,
                () => (isMaxSpeciesReached = true)
            );

            await species.init(config.BASE_URL + speciesCount);
            speciesCount++;
        }
    }

    _onSpeciesCreated(species) {
        this.species.push(species);
        this.emit(StarWarsUniverse.events.SPECIES_CREATED, {
            speciesCount: this.speciesCount,
        });
    }

    _checkForMaxSpecies(species) {
        if (species.speciesCount === this._maxSpecies) {
            this.emit(StarWarsUniverse.events.MAX_SPECIES_REACHED);
        }
    }
}