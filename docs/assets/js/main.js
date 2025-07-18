document.addEventListener('DOMContentLoaded', function () {
    CargaModuloHTML.cargaModulo('docs/assets/html/home.html');
});
const CargaModuloHTML = (() => {
    return {
        cargaModulo: (modulo,idperm=false) => {
            fetch(modulo)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.text();
                })
                .then(htmlString => {
                    document.getElementById(idperm?idperm:'section').innerHTML = htmlString;
                })
                .catch(error => {
                    console.error('Error al cargar el módulo:', error);
                });
        }
    }
})();
