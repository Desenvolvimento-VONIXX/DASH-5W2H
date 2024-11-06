import React, { useEffect, useState } from "react";
import { TbReportAnalytics } from "react-icons/tb";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import { useConsultar } from "../../../hook/useConsultar";
import Table5W2H from "./Table5W2H";
import Snipper from "../Snipper";
import FiltroPeriodo from "../Filtro/FiltroDataFinalizacao";
import CreateNewProject from "../Forms/CreateNewProject";
import ModalDeletarProjeto from "../Modal/ModalDeletarProjeto";
import EditProject from "../Forms/EditProject";

function TableAtividades() {
    const [result, setResult] = useState([]);
    const [consulta, setConsulta] = useState('');
    const [showTable5W2H, setShowTable5W2H] = useState(false);
    const [showNewProject, setShowNewProject] = useState(false);
    const [selectedAtividade, setSelectedAtividade] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'codAtividade', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [dataInicial, setDataInicial] = useState(null);
    const [dataFinal, setDataFinal] = useState(null);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showEditProject, setEditProject] = useState(false)

    const handleFilterChange = (novaDataInicial, novaDataFinal) => {
        setDataInicial(novaDataInicial);
        setDataFinal(novaDataFinal);
    };

    useEffect(() => {
        const novaConsulta = `
            SELECT DISTINCT
            PG.ID AS ID_PROJETO,
            PG.NOME_PROJETO AS NOME_PROJETO,
            CAST(PG.DESCRICAO AS VARCHAR(MAX)) AS DESC_ATIVIDADE, 
            FORMAT(PG.DATA_INICIO, 'dd/MM/yyyy') AS DATA_INICIO,
            
            CASE 
                WHEN PG.DATA_FINALIZACAO IS NULL THEN 'Não possui data de finalização'
                ELSE FORMAT(PG.DATA_FINALIZACAO, 'dd/MM/yyyy')
            END AS DATA_FIM,
        
            CASE 
                WHEN PG.STATUS = 'FINALIZADO' THEN 'Finalizado'
                WHEN PG.STATUS = 'ANDAMENTO' THEN 'Em Andamento'
                WHEN PG.STATUS = 'TESTE' THEN 'Em Teste'
                WHEN PG.STATUS = 'A FAZER' THEN 'Não Iniciado'
                ELSE PG.STATUS  
            END AS STATUS,
        
            CASE
                WHEN ATV.ID IS NOT NULL THEN 1
                ELSE 0
            END AS HAS_5W2H_REFERENCE

            FROM SANKHYA.AD_PROJETOSGERAL PG

            LEFT JOIN SANKHYA.AD_5W2HGERAL ATV ON ATV.ID = PG.ID
            INNER JOIN SANKHYA.TSIUSU USU ON USU.CODUSU = SANKHYA.STP_GET_CODUSULOGADO()

            WHERE 
            ${dataInicial && dataFinal ? `PG.DATA_FINALIZACAO BETWEEN '${dataInicial}' AND '${dataFinal}' AND` : ''}

            (
                SANKHYA.STP_GET_CODUSULOGADO() = 4  
                OR 
                PG.SETOR IN (
                    SELECT DISTINCT CODGRUPO 
                    FROM AD_TGFGCI 
                    WHERE CODGRUCIPAI IN (SELECT CODGRUCI FROM AD_TGFGCI WHERE CODGRUPO = USU.CODGRUPO) 
                    OR CODGRUCI IN (SELECT CODGRUCI FROM AD_TGFGCI WHERE CODGRUPO = USU.CODGRUPO)
                )
            )

            ORDER BY DATA_FIM DESC, DATA_INICIO DESC;

        `;
        setConsulta(novaConsulta);
    }, [dataInicial, dataFinal]);

    const { data, loading, error } = useConsultar(consulta);
    console.log(consulta)
    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                codProjeto: item.ID_PROJETO,
                nomeProjeto: item.NOME_PROJETO,
                descProjeto: item.DESC_ATIVIDADE,
                status: item.STATUS,
                dataInicio: item.DATA_INICIO,
                dataFim: item.DATA_FIM,
                has5W2HReference: item.HAS_5W2H_REFERENCE === 1

            }));
            setResult(formattedData);
        }
    }, [data]);


    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...result].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setResult(sortedData);
    };


    const handleReportClick = (codProjeto) => {
        setSelectedAtividade(codProjeto);
        setShowTable5W2H(true);
    };

    const handleClickCreateNewProject = () => {
        setShowNewProject(true);
    };

    const handleModalDelete = (codProjeto) => {
        setSelectedAtividade(codProjeto);
        setShowModalDelete(true);
    }

    // Filtra os resultados com base no termo de pesquisa
    const filteredResults = result.filter(item => {
        return (
            item.codProjeto.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.dataFim.toLowerCase().includes(searchTerm.toLowerCase())

        );
    });

    const handleReload = (() => {
        window.location.reload();
    })

    const handleEditProject = ((codProjeto) => {
        setSelectedAtividade(codProjeto);
        setEditProject(true)
    })

    return (
        <>
            {showNewProject ? (
                <CreateNewProject handleClickCreateNewProject={setShowNewProject} />
            ) : showTable5W2H ? (
                <Table5W2H codProjeto={selectedAtividade} handleReportClick={setShowTable5W2H} />
            ) : showEditProject ? (
                <EditProject codProjeto={selectedAtividade} handleEditProject={setEditProject} />
            ) : (
                <div className="relative sm:rounded-lg">
                    <div className="relative sm:rounded-lg">
                        <div className="flex w-full gap-2 mb-[10px]">
                            <div className="w-[30%]">
                                <label htmlFor="data-final" className="block text-black font-semibold">Pesquisar</label>
                                <div className="relative w-full">
                                    <input
                                        type="search"
                                        id="default-search"
                                        className="h-[6vh] block w-full p-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Pesquisar ..."
                                        required
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="w-[30%]">
                                <FiltroPeriodo onFilterChange={handleFilterChange} />
                            </div>

                            <div className="flex flex-row justify-end w-full">
                                <button
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-[10px] text-sm pl-3 pr-3 me-2 mb-2 h-[4vh]"
                                    onClick={handleReload}
                                >
                                    <TfiReload />
                                </button>
                                <button
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-[10px] text-sm pl-3 pr-3 mb-2 h-[4vh]"
                                    onClick={handleClickCreateNewProject}
                                >
                                    Criar Projeto
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-[#d7d4e6]">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-[15px]" onClick={() => requestSort('codAtividade')}>Id</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]" onClick={() => requestSort('descAtividade')}>Nome Projeto</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]" onClick={() => requestSort('nomeDev')}>Descrição</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]" onClick={() => requestSort('dataInicio')}>Data Inicio</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]" onClick={() => requestSort('dataFim')}>Data Finalização</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]" onClick={() => requestSort('status')}>Status</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]">Editar</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]">Excluir</th>
                                    <th scope="col" className="px-6 py-3 text-[15px]">Ver</th>


                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((item, index) => (
                                    <tr key={index} className="bg-[#d7d4e6] hover:bg-[beige]">
                                        <th scope="row" className="px-6 py-1 font-medium text-[#3d3c3c] whitespace-nowrap text-[15px]">
                                            {item.codProjeto}
                                        </th>
                                        <td className="px-6 py-2 text-[#3d3c3c] text-[15px] font-bold">{item.nomeProjeto}</td>
                                        <td className="px-6 py-2 text-[#3d3c3c] text-[15px] font-bold">{item.descProjeto}</td>
                                        <td className="px-6 py-2 text-[#3d3c3c] text-[15px] font-bold">{item.dataInicio}</td>
                                        <td className="px-6 py-2 text-[#3d3c3c] text-[15px] font-bold">{item.dataFim}</td>
                                        <td className="px-6 py-2 text-[#3d3c3c] text-[15px] font-bold">{item.status}</td>
                                        <td className="px-6 py-2 text-[#3d3c3c] font-bold">
                                            <button
                                                type="button"
                                                className="gap-5 px-3 py-2 text-[15px] font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300"

                                            >
                                                <MdEditSquare onClick={() => handleEditProject(item.codProjeto)} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-2 text-[#3d3c3c] font-bold">
                                            <button
                                                type="button"
                                                className="gap-5 px-3 py-2 text-[15px] font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                                                onClick={() => handleModalDelete(item.codProjeto)}
                                            >
                                                <MdDelete />
                                            </button>
                                        </td>
                                        <td className="px-6 py-2 text-[#3d3c3c] font-bold">
                                            <button
                                                type="button"
                                                className="gap-5 px-3 py-2 text-[15px] font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                                onClick={() => handleReportClick(item.codProjeto)}
                                            >
                                                <TbReportAnalytics />
                                            </button>
                                        </td>



                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {loading && <Snipper />}
                    {error && <p>{error}</p>}
                </div>
            )}

            {/* Modal Delete*/}
            {showModalDelete && (
                <ModalDeletarProjeto
                    codProjeto={selectedAtividade}
                    onClose={() => setShowModalDelete(false)}
                />
            )}
        </>
    );

}

export default TableAtividades;
