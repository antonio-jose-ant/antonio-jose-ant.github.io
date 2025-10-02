export function logo(canva) {
    const canvas = document.getElementById(canva);
    console.log(canvas)
    const ctx = canvas.getContext('2d');
    const x = canvas.width;
    const y = canvas.height;
    const quintaparte = x / 5;
    const colors = ["#E95420", "#77216F"];

    ctx.clearRect(0, 0, x, y); // limpia

    ctx.beginPath();
    ctx.fillStyle = "#2C001E"; // color de fondo del círculo
    ctx.arc(x / 2, y / 2, y / 2, 0, Math.PI * 2); // círculo completo
    ctx.fill();
    ctx.stroke();

    function crealogo(grados, color) {
        const rad = grados * (Math.PI / 180);
        const ancho = quintaparte * 2;
        const alto = quintaparte * 2.35;
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(x / 2, y / 2);
        ctx.rotate(rad);
        ctx.beginPath();
        ctx.strokeStyle = colors[color];
        ctx.strokeRect(-ancho / 2 + alto / 5, -(alto + quintaparte) / 2, alto, alto);
        ctx.restore();
    }

    function repeticiones() {
        let grados = 0;
        const colorSelector = (num) => num % 2 ? 1 : 0;
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const color = colorSelector(i);
                crealogo(grados, color);
                grados += 45;
                console.log(360 / 8);
            }, i * 200);
        }
    }

    repeticiones();
}
