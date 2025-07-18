document.addEventListener('DOMContentLoaded', function() {
    cargaModulo('./page/header.html');  
});

const cargaModulo = (modulo) => {
        fetch(modulo)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(htmlString => {
                document.getElementById('section').innerHTML = htmlString;
            })
            .catch(error => {
                console.error('Error al cargar el módulo:', error);
            });
}