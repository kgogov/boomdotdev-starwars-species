import { EventEmitter } from "eventemitter3";

export default class Species extends EventEmitter {
    constructor(name, classification) {
        super();

        this.name = name || null;
        this.classification = classification || null;
    }

    static get events() {
        return { SPECIES_CREATED: 'species_created' }
    }

    async fetchAndDecode(url) {

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.log(error);
        }
    }

    async init(url) {
        const species = await this.fetchAndDecode(url);

        this.name = species.name;
        this.classification = species.classification;

        this.emit(Species.events.SPECIES_CREATED, this);
    }
}