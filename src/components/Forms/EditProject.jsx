import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import ModalSuccess from "../Modal/ModalSuccess";
import ModalError from "../Modal/ModalError";
import { JX } from "../../lib/JX";
 
function EditProject({ codProjeto, handleEditProject }) {
    const [result, setResult] = useState([]);
    const [consultaRegistro, setConsultaRegistro] = useState('');
    const [idPro, setIdProjeto] = useState('');
    const [nomePro, setNomeProjeto] = useState('');
    const [descPro, setDescProjeto] = useState('');
    const [setorPro, setSetor] = useState('');
    const [dataInicioPro, setDataInicio] = useState('');
    const [dataFimPro, setDataFim] = useState('');
    const [statusPro, setStatus] = useState('');
    const [isModalSuccess, setIsModalSuccessOpen] = useState(false);
    const [isModalError, setIsModalErrorOpen] = useState(false);
    const [erro, setErro] = useState('');
    const [isDirty, setIsDirty] = useState(false); // Novo estado para monitorar alterações

    useEffect(() => {
        const novaConsulta = `
            SELECT 
            * 
            FROM SANKHYA.AD_PROJETOSGERAL PG
            WHERE 
            PG.ID = ${codProjeto}
        `;
        setConsultaRegistro(novaConsulta);
    }, [codProjeto]);

    const formatDateInput = (dateString) => {
        if (!dateString) return '';
        const datePart = dateString.split(' ')[0];
        const day = datePart.slice(0, 2);
        const month = datePart.slice(2, 4);
        const year = datePart.slice(4, 8);

        return `${year}-${month}-${day}`;
    };

    const { data, loading, error } = useConsultar(consultaRegistro);

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                idProjeto: item.ID,
                nomeProjeto: item.NOME_PROJETO,
                descProjeto: item.DESCRICAO,
                setor: item.SETOR,
                dataInicio: formatDateInput(item.DATA_INICIO),
                dataFim: formatDateInput(item.DATA_FINALIZACAO),
                status: item.STATUS
            })); 

            setResult(formattedData);
            setIdProjeto(formattedData[0]?.idProjeto || codProjeto);
            setNomeProjeto(formattedData[0]?.nomeProjeto || '');
            setDescProjeto(formattedData[0]?.descProjeto || '');
            setSetor(formattedData[0]?.setor || '');
            setDataInicio(formattedData[0]?.dataInicio || '');
            setDataFim(formattedData[0]?.dataFim || '');
            setStatus(formattedData[0]?.status || '');
        }
    }, [data]);

    // UseEffect para detectar alterações nos campos do formulário
    useEffect(() => {
        const originalValues = result[0] || {};
        const hasChanges =
            nomePro !== originalValues.nomeProjeto ||
            descPro !== originalValues.descProjeto ||
            setorPro !== originalValues.setor ||
            dataInicioPro !== originalValues.dataInicio ||
            dataFimPro !== originalValues.dataFim ||
            statusPro !== originalValues.status;

        setIsDirty(hasChanges); // Atualiza o estado isDirty
    }, [nomePro, descPro, setorPro, dataInicioPro, dataFimPro, statusPro, result]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formatDate = (date) => {
            const d = new Date(date);
            const day = ("0" + d.getUTCDate()).slice(-2);
            const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
            const year = d.getUTCFullYear();
            return `${day}/${month}/${year}`;
        };

        let formattedDataInicio = dataInicioPro;
        let formattedDataFinal = dataFimPro;

        if (dataInicioPro !== "") {
            formattedDataInicio = formatDate(dataInicioPro);
        }

        if (dataFimPro !== "") {
            formattedDataFinal = formatDate(dataFimPro);
        }

        JX.salvar(
            {
                NOME_PROJETO: nomePro,
                DESCRICAO: descPro,
                STATUS: statusPro,
                SETOR: setorPro,
                DATA_INICIO: formattedDataInicio,
                DATA_FINALIZACAO: formattedDataFinal
            },
            "AD_PROJETOSGERAL",
            [
                {
                    ID: codProjeto
                },
            ]
        ).then(data => {
            const response = data[0];
            console.log(response);

            if (response.status === "0") {
                setErro(response.statusMessage || 'Erro desconhecido ao salvar o projeto.');
                setIsModalErrorOpen(true);
            } else {
                setIsModalSuccessOpen(true);
                setErro('');
            }
        });
    };

    return (
        <>
            <div className="flex items-center mb-[10px]">
                <button
                    onClick={() => handleEditProject(false)}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-1"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-[25px] font-bold text-center flex-1">Editar Projeto</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-[30px] w-full">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_nome"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Nome do Projeto
                        </label>
                        <input
                            type="text"
                            value={nomePro}
                            onChange={(e) => setNomeProjeto(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_desc"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Descrição do Projeto
                        </label>
                        <input
                            type="text"
                            value={descPro}
                            onChange={(e) => setDescProjeto(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_dataInicio"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Data de Início
                        </label>
                        <input
                            type="date"
                            value={dataInicioPro}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_dataFim"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Data de Finalização
                        </label>
                        <input
                            type="date"
                            value={dataFimPro}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_status"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Status
                        </label>
                        <select
                            value={statusPro}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        >
                            <option value="" disabled>Selecionar Status</option>
                            <option value="FINALIZADO">Finalizado</option>
                            <option value="ANDAMENTO">Em Andamento</option>
                            <option value="A FAZER">Não Iniciado</option>
                            <option value="TESTE">Em Teste</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5">
                    <button
                        type="button"
                        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center me-2 mb-2"
                        onClick={() => handleEditProject(false)}
                    >
                        Cancelar
                    </button>

                    {isDirty && ( // Mostra o botão "Salvar" apenas se houver alterações
                        <button
                            type="submit"
                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        >
                            Salvar
                        </button>
                    )}
                </div>
            </form>

            {isModalSuccess && (
                <ModalSuccess
                    onClose={() => setIsModalSuccessOpen(false)}
                    mensagemSuccess={'Projeto foi atualizado com sucesso.'}
                />
            )}

            {isModalError && (
                <ModalError
                    onClose={() => setIsModalErrorOpen(false)}
                    mensagemError={erro}
                />
            )}
        </>
    );
}

export default EditProject;
