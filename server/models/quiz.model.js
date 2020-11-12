import Debug from 'debug'
import postgresStore from '../postgres-store.js'
const debug = Debug('geoplay')

export default class Quiz {
    /** @type {Number} */
    id_quiz
    /** @type {String} */
    quiz_name
    /** @type {String} */
    map_name
    /** @type {String} */
    difficulty
    /** @type {Number} */
    duration
    /** @type {Number} */
    id_user
    /** @type {String} */
    questions

    static async generateTable() {
        await postgresStore.client.query(`
        CREATE TABLE quizzes (
            id_quiz SERIAL PRIMARY KEY,
            name text NOT NULL UNIQUE,
            mapId text NOT NULL,
            difficulty text NOT NULL,
            duration integer,
            id_user integer NOT NULL,
            nb_question integer NOT NULL,
            id_location_serie integer NOT NULL,
            CHECK (nb_question >= 5 AND nb_question <= 25),
            CONSTRAINT fk_user
                FOREIGN KEY(id_user)
                    REFERENCES users(id_user),
            CONSTRAINT fk_location_serie
                FOREIGN KEY(id_location_serie)
                    REFERENCES location_series(id_location_serie)
        )
        `)
    }

}