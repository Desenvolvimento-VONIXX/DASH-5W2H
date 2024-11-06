import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useConsultar } from "../../../hook/useConsultar";

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement, ChartDataLabels);

function GraficoStatus({ codProjeto }) {
    const [result, setResult] = useState([]);
    const [consulta, setConsulta] = useState('');

    useEffect(() => {
        const novaConsulta = `
            SELECT 
            CASE 
            WHEN ATV.STATUS = 'FINALIZADO' THEN 'Concluído'
            WHEN ATV.STATUS = 'A FAZER' THEN 'A iniciar'
            WHEN ATV.STATUS = 'ANDAMENTO' THEN 'Em andamento'
            WHEN ATV.STATUS = 'TESTE' THEN 'Em Teste'
            ELSE ATV.STATUS
            END AS STATUS,
            COUNT(*) AS QNT
            FROM SANKHYA.AD_5W2HGERAL ATV
            INNER JOIN SANKHYA.TSIUSU USU ON USU.CODUSU = ATV.QUEM
            WHERE ID =  ${codProjeto}
            GROUP BY STATUS
        `;
        setConsulta(novaConsulta);
    }, [codProjeto]);

    const { data, loading, error } = useConsultar(consulta);

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                status: item.STATUS,
                qnt: item.QNT
            }));
            setResult(formattedData);
        }
    }, [data]);

    useEffect(()=> {
        console.log("Modal codprojeto", codProjeto);
        console.log("Modal consula", consulta)
    }, [codProjeto, consulta])

    const labels = result.map(item => item.status);
    const valores = result.map(item => item.qnt);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Quantidade de ações por status',
                data: valores,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Quantidade de Ações por Status',
            },
            datalabels: {
                anchor: 'center', // Centraliza o valor dentro da barra
                align: 'center',  // Alinha o valor ao centro verticalmente
                color: '#fff',    // Define a cor do texto
                formatter: (value) => value, // Formata para exibir o valor dentro da barra
                font: {
                    weight: 'bold',
                    size: 14,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quantidade' // Título do eixo Y
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Status' // Título do eixo X
                },
                grid: {
                    display: true,
                },
            },
        },
    };

    return (
        <>
            <Bar data={chartData} options={chartOptions} />
        </>
    );
}

export default GraficoStatus;
