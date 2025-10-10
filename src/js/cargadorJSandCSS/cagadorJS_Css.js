export const CSSandJSCargador = (() => {
    const estilosCargados = new Map(); // Guarda ruta de CSS y su <link>
    const archPermitido = [
        'sobre_mi.css',
        'contacto.css',
        'experiencia.css',
        'habilidades.css',
        'inicio.css',
        'proyectos.css',
        'sobre_mi.css',
        'consola.css',
        'menu.css',
    ];
    const rutaspermitidas = {
        'sobre_mi.css': './assets/css/modulos/sobre_mi.css',
        'contacto.css': './assets/css/modulos/contacto.css',
        'experiencia.css': './assets/css/modulos/experiencia.css',
        'habilidades.css': './assets/css/modulos/habilidades.css',
        'inicio.css': './assets/css/modulos/inicio.css',
        'proyectos.css': './assets/css/modulos/proyectos.css',
        'consola.css': './assets/css/componentes/consola.css',
        'menu.css': './assets/css/componentes/menu.css',
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
                    document.head.insertBefore(nuevoLink, document.head.firstChild);
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