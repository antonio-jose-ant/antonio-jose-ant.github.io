/**
 * Este es un objeto que proporciona métodos para obtener y almacenar en caché datos JSON de rutas de archivo predefinidas. * 
 * @namespace creaConst
 */
export const creaConst = (() => {
    const cache = {};
    /**
     * Esta función asincrónica se encarga de obtener y almacenar en caché datos JSON de una lista predefinida de rutas de archivo.
     * 
     * @function obtenerDataJson
     * @memberof creaConst
     * @async
     * @param {string} json Una cadena que representa la clave del archivo JSON a obtener (por ejemplo, 'allowed_pages', 'commands', etc.).
     * @returns {Promise<Object>} Devuelve una promesa que se resuelve con los datos JSON ya procesados.
     * @throws {Error} Lanza un error si el archivo JSON especificado no existe, o si hay algún problema con la solicitud HTTP o al procesar los datos.
     */
    async function obtenerDataJson(json) {
        const listJson = {
            'allowed_pages': './data/allowed_pages.json',
            'commands': './data/commands.json',
            'contact': './data/contact.json',
            'technologies': './data/technologies.json',
            'tokens': './data/tokens.json'
        };
        if (!listJson[json]) {
            console.error(`El archivo json no existe.`);
            throw new Error(`El archivo json no existe.`);
        }

        if (cache[json]) return cache[json];

        try {
            const response = await fetch(listJson[json]);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            cache[json] = data;
            return data;
        } catch (error) {
            console.error('Error al cargar el JSON:', error);
            throw error;
        }
    }

    return {
        obtenerDataJson
    };
})();