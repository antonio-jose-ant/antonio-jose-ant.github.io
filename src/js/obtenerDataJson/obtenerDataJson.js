export const creaConst = ( () => {
    const cache = {}; // Guarda aquí los datos una vez cargados
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

        // Si ya lo cargaste una vez, devuélvelo directamente
        if (cache[json]) return cache[json];

        try {
            const response = await fetch(listJson[json]);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            cache[json] = data; // Guardar en caché
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