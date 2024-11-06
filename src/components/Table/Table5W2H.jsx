import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import ModalGraficos from "../Modal/ModalGraficos5W2H";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import CreateNew5W2H from "../Forms/CreateNew5W2H";
import { TbReportAnalytics } from "react-icons/tb";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import ModalDeletar5W2H from "../Modal/ModalDeletar5W2H";
import Edit5W2H from "../Forms/Edit5W2H";

function Table5W2H({ codProjeto, handleReportClick }) {
    const [result, setResult] = useState([]);
    const [consulta, setConsulta] = useState('');
    const [consultarDescAtividade, setConsultaNomeProjeto] = useState('');
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNew5W2H, setShowNew5W2H] = useState(false);
    const [selectedProjeto, setSelectedProjeto] = useState(null);
    const [selected5W2H, setSelected5W2H] = useState(null);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showEdit5W2H, setEdit5W2H] = useState(false)

    useEffect(() => {
        const novaConsulta = `
        SELECT 
            ATV.ID AS ID_PROJETO,
            ATV.ID_ATIVIDADE AS ID_ATIVIDADE,
            USU.NOMEUSU AS QUEM,
            ATV.PORQUE AS PORQUE,
            ATV.COMO AS COMO,
            ATV.ONDE AS ONDE,
            ATV.QUANTO AS QUANTO,
            FORMAT(ATV.QUANDO, 'dd/MM/yyyy') AS QUANDO,
            ATV.QUE AS OQUE,
            CASE 
            WHEN ATV.STATUS = 'FINALIZADO' THEN 'Concluído'
            WHEN ATV.STATUS = 'A FAZER' THEN 'A iniciar'
            WHEN ATV.STATUS = 'ANDAMENTO' THEN 'Em andamento' 
            WHEN ATV.STATUS = 'TESTE' THEN 'Em Teste'
            ELSE ATV.STATUS
            END AS STATUS
            FROM SANKHYA.AD_5W2HGERAL ATV
            INNER JOIN SANKHYA.TSIUSU USU ON USU.CODUSU = ATV.QUEM
            WHERE ATV.ID = ${codProjeto}
        `;
        setConsulta(novaConsulta);
    }, [codProjeto]);

    useEffect(() => {
        const novaConsultaNomeProjeto = `
            SELECT UPPER(NOME_PROJETO) AS NOME_PROJETO
            FROM SANKHYA.AD_PROJETOSGERAL PG 
            WHERE PG.ID = ${codProjeto};
        `;
        setConsultaNomeProjeto(novaConsultaNomeProjeto);
    }, [codProjeto]);

    const { data, loading, error } = useConsultar(consulta);
    const { data: dataNomeProjeto, loading: loadingNomeProjeto, error: errorNomeProjeto } = useConsultar(consultarDescAtividade);

    useEffect(() => {
        if (dataNomeProjeto && dataNomeProjeto.length > 0) {
            setNomeProjeto(dataNomeProjeto[0].NOME_PROJETO);
        }
    }, [dataNomeProjeto]);

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                codProjeto: item.ID_PROJETO,
                codAtividade: item.ID_ATIVIDADE,
                porque: item.PORQUE,
                como: item.COMO,
                quem: item.QUEM,
                onde: item.ONDE,
                quanto: item.QUANTO,
                status: item.STATUS,
                quando: item.QUANDO,
                oque: item.OQUE

            }));
            setResult(formattedData);
        }
    }, [data]);


    const handleClickNew5W2H = () => {
        setShowNew5W2H(true);
    };

    const handleModalDelete = (codAtividade, codProjeto) => {
        setSelected5W2H(codAtividade)
        setSelectedProjeto(codProjeto);
        setShowModalDelete(true);
    }

    
    const handleEdit5w2h = ((codProjeto, codAtividade) => {
        setSelectedProjeto(codProjeto);
        setSelected5W2H(codAtividade)
        setEdit5W2H(true);
    })

    return (
        <>
            {showNew5W2H ? (
                <CreateNew5W2H handleClickNew5W2H={setShowNew5W2H} codProjeto={codProjeto} />
            ) : showEdit5W2H ? (
                <Edit5W2H codProjeto={selectedProjeto} cod5W2H={selected5W2H} handleEdit5w2h={setEdit5W2H} />
            ) : (
                <div>
                    <div className="flex items-center mb-[10px] w-full">

                        <button
                            onClick={() => handleReportClick(false)}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-1"
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            onClick={() => setIsModalOpen({ isOpen: true, nomeProjeto, codProjeto })}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-1"
                        >
                            <BsGraphUpArrow />
                        </button>

                        <div className="ml-2 w-full">
                            <h2 className="text-[25px] font-bold">{nomeProjeto} - (5W2H)</h2>
                        </div>

                        <div className="flex flex-row justify-end w-full">

                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-[10px] text-sm pl-3 pr-3 mb-2 h-[4vh]"
                                onClick={handleClickNew5W2H}
                            >
                                Adicionar 5W2H
                            </button>
                        </div>
                    </div>


                    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg max-h-[65vh] overflow-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-700 bg-white ">
                            <thead className="text-xs uppercase bg-gray-200 text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">O QUE?</h1>
                                        <p className="text-xs">(WHAT?)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">POR QUE?</h1>
                                        <p className="text-xs">(WHY?)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">COMO?</h1>
                                        <p className="text-xs">(HOW?)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">QUEM?</h1>
                                        <p className="text-xs">(WHO?)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">ONDE?</h1>
                                        <p className="text-xs">(WHERE?)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">QUANDO?</h1>
                                        <p className="text-xs">(WHEN?)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">QUANTO?</h1>
                                        <p className="text-xs">(HOW MUCH?)</p>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                        <h1 className="font-semibold text-base text-gray-800">STATUS</h1>
                                    </th>
                                    <th scope="col" className="px-6 py-4">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((item, index) => (
                                    <tr key={index} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-50">
                                        <td className="px-6 py-4 max-w-[200px] break-words whitespace-normal font-medium text-gray-900">{item.oque}</td>
                                        <td className="px-6 py-4 max-w-[200px] break-words whitespace-normal">{item.porque}</td>
                                        <td className="px-6 py-4 max-w-[200px] break-words whitespace-normal">{item.como}</td>
                                        <td className="px-6 py-4 max-w-[200px] break-words whitespace-normal">{item.quem}</td>
                                        <td className="px-6 py-4 max-w-[200px] break-words whitespace-normal">{item.onde}</td>
                                        <td className="px-6 py-4 max-w-[200px] break-words whitespace-normal">{item.quando}</td>
                                        <td className="px-6 py-4 max-w-[200px] break-words whitespace-normal">{item.quanto}</td>
                                        <td className={`px-6 py-4 font-bold ${item.status === 'Concluído' ? 'text-green-700' :
                                            item.status === 'Em andamento' ? 'text-yellow-600' :
                                                item.status === 'A iniciar' ? 'text-blue-800' : 'text-gray-500'}`}>
                                            {item.status}
                                        </td>
                                        <td className="px-6 py-2 text-[#3d3c3c] font-bold">
                                            <div className="flex space-x-2">

                                                <button
                                                    type="button"
                                                    className="gap-5 px-3 py-2 text-[15px] font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300"
                                                    onClick={() => handleEdit5w2h(item.codProjeto, item.codAtividade)} 

                                                >
                                                    <MdEditSquare />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="gap-5 px-3 py-2 text-[15px] font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                                                    onClick={() => handleModalDelete(item.codAtividade, item.codProjeto)}

                                                >
                                                    <MdDelete />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loading && <Snipper />}
                        {error && <p>{error}</p>}
                    </div>

                </div>
            )}


            {/* Modal */}
            {isModalOpen.isOpen && (
                <ModalGraficos
                    nomeProjeto={isModalOpen.nomeProjeto}
                    codProjeto={isModalOpen.codProjeto}
                    onClose={() => setIsModalOpen({ isOpen: false })}
                />
            )}

            {/* Modal Delete*/}
            {showModalDelete && (
                <ModalDeletar5W2H
                    cod5W2H={selected5W2H}
                    codProjeto={selectedProjeto}
                    onClose={() => setShowModalDelete(false)}
                />
            )}
        </>
    )
}

export default Table5W2H;

