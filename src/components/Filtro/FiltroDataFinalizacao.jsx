import React, { useEffect, useState } from "react";

function FiltroPeriodo({ onFilterChange }) {
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [erro, setErro] = useState(''); 

    const handleFilterClick = () => {
        if (dataInicial && dataFinal) {
            const formattedDataInicial = new Date(dataInicial).toLocaleDateString('pt-BR');
            const formattedDataFinal = new Date(dataFinal).toLocaleDateString('pt-BR');
            onFilterChange(formattedDataInicial, formattedDataFinal);
            setErro('');
        }
    };

    useEffect(() => {
        if (dataInicial && dataFinal && new Date(dataInicial) > new Date(dataFinal)) {
            setErro('A Data Inicial não pode ser posterior à Data Final.');
        } else {
            handleFilterClick();
        }
    }, [dataInicial, dataFinal]);

    return (
        <div className="flex items-center space-x-4">
            <div className="relative max-w-sm flex-1">
                <label htmlFor="data-inicial" className="block text-black font-semibold">Data Inicial Finalização</label>
                <input
                    id="data-inicial"
                    type="date"
                    className={`h-[6vh] p-2 bg-gray-50 border ${erro ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full`}
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                />
            </div>
            <div className="relative max-w-sm flex-1">
                <label htmlFor="data-final" className="block text-black font-semibold">Data Final Finalização</label>
                <input
                    id="data-final"
                    type="date"
                    className={`h-[6vh] p-2 bg-gray-50 border ${erro ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full`}
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                />
            </div>
            {erro && <div className="text-red-500">{erro}</div>}
        </div>
    );
}

export default FiltroPeriodo;
