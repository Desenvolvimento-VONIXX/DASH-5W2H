import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useConsultar } from "../../../hook/useConsultar";

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

function GraficoStatusPerc({ codProjeto }) {
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
            CAST(ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 0) AS INT) AS QNT
        FROM SANKHYA.AD_5W2HGERAL ATV
        INNER JOIN SANKHYA.TSIUSU USU ON USU.CODUSU = ATV.QUEM
        WHERE ATV.ID = ${codProjeto}
        GROUP BY ATV.STATUS

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

    const labels = result.map(item => item.status);
    const valores = result.map(item => item.qnt);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: '% de ações por status',
                data: valores,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 205, 86, 1)',
                ],
                borderWidth: 1,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '% de Ações por Status'
            },
            datalabels: {
                formatter: (value, context) => `${value}%`,
                color: '#fff',
                font: {
                    weight: 'bold'
                }
            }
        },
    };

    return (
        <>
            <Pie data={chartData} options={chartOptions} />
        </>
    );
}

export default GraficoStatusPerc;
