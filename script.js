// script.js

let ingresosChart = null;
let gastosChart = null;

// Función para agregar una nueva fila de registro
function agregarRegistro(fecha, tipo, ingreso, gasto, saldo) {
    const table = document.getElementById('registrosTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Insertar los datos en las celdas correspondientes
    const cellFecha = newRow.insertCell();
    cellFecha.textContent = fecha;

    const cellTipo = newRow.insertCell();
    cellTipo.textContent = tipo;

    const cellIngreso = newRow.insertCell();
    cellIngreso.textContent = ingreso !== 0 ? `$${ingreso.toFixed(2)}` : '';

    const cellGasto = newRow.insertCell();
    cellGasto.textContent = gasto !== 0 ? `$${gasto.toFixed(2)}` : '';

    const cellSaldo = newRow.insertCell();
    cellSaldo.textContent = `$${saldo.toFixed(2)}`;

    // Limpiar los campos de entrada después de agregar la nueva fila
    document.getElementById('fecha').value = '';
    document.getElementById('ingresos').value = '';
    document.getElementById('gastos').value = '';

    // Actualizar los gráficos
    actualizarGraficos();
}

// Función para actualizar los gráficos de ingresos y gastos
function actualizarGraficos() {
    const table = document.getElementById('registrosTable').getElementsByTagName('tbody')[0];
    const data = {
        ingresos: [0, 0, 0, 0],
        gastos: [0, 0, 0, 0, 0]
    };

    // Calcular los totales de ingresos y gastos
    for (let i = 0; i < table.rows.length; i++) {
        const tipo = table.rows[i].cells[1].textContent;
        const ingreso = parseFloat(table.rows[i].cells[2].textContent.replace('$', '')) || 0;
        const gasto = parseFloat(table.rows[i].cells[3].textContent.replace('$', '')) || 0;

        if (ingreso > 0) {
            switch (tipo) {
                case 'Salarios':
                    data.ingresos[0] += ingreso;
                    break;
                case 'Honorarios':
                    data.ingresos[1] += ingreso;
                    break;
                case 'Intereses':
                    data.ingresos[2] += ingreso;
                    break;
                case 'Ganancias':
                    data.ingresos[3] += ingreso;
                    break;
            }
        } else if (gasto > 0) {
            switch (tipo) {
                case 'Arriendo':
                    data.gastos[0] += gasto;
                    break;
                case 'Comida':
                    data.gastos[1] += gasto;
                    break;
                case 'Vestuario':
                    data.gastos[2] += gasto;
                    break;
                case 'Educación':
                    data.gastos[3] += gasto;
                    break;
                case 'Deportes':
                    data.gastos[4] += gasto;
                    break;
            }
        }
    }

    const ctxIngresos = document.getElementById('graficoIngresos').getContext('2d');
    const ctxGastos = document.getElementById('graficoGastos').getContext('2d');

    // Si las instancias de los gráficos ya existen, destrúyelas antes de crear nuevas instancias
    if (ingresosChart) ingresosChart.destroy();
    if (gastosChart) gastosChart.destroy();

    ingresosChart = new Chart(ctxIngresos, {
        type: 'pie',
        data: {
            labels: ['Salarios', 'Honorarios', 'Intereses', 'Ganancias'],
            datasets: [{
                label: 'Ingresos',
                data: data.ingresos,
                backgroundColor: ['#36a2eb', '#ffcd56', '#4bc0c0', '#ff6384'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom'
            }
        }
    });

    gastosChart = new Chart(ctxGastos, {
        type: 'pie',
        data: {
            labels: ['Arriendo', 'Comida', 'Vestuario', 'Educación', 'Deportes'],
            datasets: [{
                label: 'Gastos',
                data: data.gastos,
                backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#4bc0c0', '#ff6384'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom'
            }
        }
    });
}

// Evento del botón agregar
document.getElementById('agregar').addEventListener('click', function () {
    const fecha = document.getElementById('fecha').value;
    const tipoIngreso = document.getElementById('tipoIngreso').value;
    const tipoGasto = document.getElementById('tipoGasto').value;
    const ingresos = parseFloat(document.getElementById('ingresos').value) || 0;
    const gastos = parseFloat(document.getElementById('gastos').value) || 0;

    // Validar que solo uno de los campos de ingreso o gasto tenga un valor
    if ((ingresos > 0 && gastos > 0) || (ingresos === 0 && gastos === 0)) {
        alert('Por favor, ingrese un valor solo en ingresos o en gastos, no en ambos.');
        return;
    }

    if (fecha) {
        let saldo = 0;
        const table = document.getElementById('registrosTable').getElementsByTagName('tbody')[0];

        if (table.rows.length > 0) {
            const ultimaFila = table.rows[table.rows.length - 1];
            const saldoAnterior = parseFloat(ultimaFila.cells[4].textContent.replace('$', ''));
            saldo = saldoAnterior + ingresos - gastos;
        } else {
            saldo = ingresos - gastos;
        }

        agregarRegistro(fecha, ingresos > 0 ? tipoIngreso : tipoGasto, ingresos, gastos, saldo);
    } else {
        alert('Por favor, complete la fecha.');
    }
});

// Validar números en los campos de texto
document.getElementById('ingresos').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9.]/g, '');
});

document.getElementById('gastos').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9.]/g, '');
});

// Llamar a actualizar gráficos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarGraficos();
});
 