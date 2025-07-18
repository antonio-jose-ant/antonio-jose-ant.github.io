document.addEventListener('DOMContentLoaded', function () {
    CargaModuloHTML.cargaModulo('inicio');
});
const CargaModuloHTML = (() => {
    const idDOMPermitidos = ['inicio', 'section', 'footer'];
    const rutasPermitidas = {
        'inicio': './pages/inicio.html',
        'section': './pages/section.html',
        'footer': './pages/footer.html',
        'header': './pages/header.html'
    }
    return {
        cargaModulo: (modulo, idperm = 'section') => {
            if (!idDOMPermitidos.includes(idperm)) {
                console.error(`El ID '${idperm}' no está permitido.`);
                return;
            }
            if (!rutasPermitidas[modulo]) {
                console.error(`El módulo '${modulo}' no está permitido.`);
                return;
            }
            fetch(rutasPermitidas[modulo])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.text();
                })
                .then(htmlString => {
                    document.getElementById(idperm).innerHTML = htmlString;
                    if(modulo==="inicio"){
                        document.getElementById('I_AM').style.height = window.innerHeight + 'px';
                    }
                })
                .catch(error => {
                    console.error('Error al cargar el módulo:', error);
                });
        }
    }
})();
