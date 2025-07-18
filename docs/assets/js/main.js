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
                    const container = document.getElementById(idperm);
                    container.innerHTML = htmlString;
                    // Aquí puedes saber que el módulo ya se cargó en el DOM
                    // Por ejemplo, puedes disparar un evento personalizado:
                    const event = new CustomEvent('moduloCargado', { detail: { modulo, idperm } });
                    container.dispatchEvent(event);

                    if (modulo === 'inicio') {
                        const iamElement = document.getElementById('I_AM');
                        console.log('Módulo de inicio cargado');
                        if (iamElement) {
                            iamElement.style.height = `${window.innerHeight/2}px`;
                        }
                    }

                })
                .catch(error => {
                    console.error('Error al cargar el módulo:', error);
                });
        }
    }
})();
