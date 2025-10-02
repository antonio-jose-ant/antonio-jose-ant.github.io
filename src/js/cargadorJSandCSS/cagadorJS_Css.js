export const CSSandJSCargador = (() => {
    const estilosCargados = new Map(); // Guarda ruta de CSS y su <link>
    const archPermitido = [
        'sobre_mi.css',
    ];
    const rutaspermitidas = {
        'sobre_mi.css': './assets/css/sobre_mi.css',
    };

    return {
        cargar: function (ruta, { forzarRecarga = true } = {}) {
            if (!archPermitido.includes(ruta) || !(ruta in rutaspermitidas)) {
                console.log("No, no...");
                return false;
            }

            const rutaReal = rutaspermitidas[ruta];
            const extension = ruta.split('.').pop();

            return new Promise((resolve, reject) => {
                if (extension === 'css') {
                    if (estilosCargados.has(ruta) && !forzarRecarga) {
                        resolve();
                        return;
                    }

                    if (estilosCargados.has(ruta)) {
                        estilosCargados.get(ruta).remove();
                        estilosCargados.delete(ruta);
                    }

                    const nuevoLink = document.createElement('link');
                    nuevoLink.rel = 'stylesheet';
                    nuevoLink.href = rutaReal;
                    nuevoLink.onload = () => {
                        estilosCargados.set(ruta, nuevoLink);
                        resolve();
                    };
                    nuevoLink.onerror = reject;
                    document.head.appendChild(nuevoLink);
                } else {
                    console.log("Tipo de archivo no soportado.");
                    reject(new Error("Tipo de archivo no soportado."));
                }
            });
        },

        eliminar: function (ruta) {
            if (!archPermitido.includes(ruta)) {
                console.log("No, no...");
                return false;
            }

            const extension = ruta.split('.').pop();
            if (extension === 'css' && estilosCargados.has(ruta)) {
                estilosCargados.get(ruta).remove();
                estilosCargados.delete(ruta);
            }
        },

        estaCargado: function (ruta) {
            const extension = ruta.split('.').pop();
            if (extension === 'css') {
                return estilosCargados.has(ruta);
            }
            return false;
        }
    };
})();