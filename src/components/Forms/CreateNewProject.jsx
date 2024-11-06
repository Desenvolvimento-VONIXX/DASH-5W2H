import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import { JX } from "../../lib/JX";
import ModalSuccess from "../Modal/ModalSuccess";
import ModalError from "../Modal/ModalError";

function CreateNewProject({ handleClickCreateNewProject }) {

    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descProjeto, setDescProjeto] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [status, setStatus] = useState('');
    const [codUsu, setCodUsu] = useState('');
    const [codUsuGru, setCodUsuGru] = useState('');
    const [codSubGrupo, setCodSubGrupo] = useState('');
    const [consultarSetor, setConsultarSetor] = useState('');
    const [isModalSuccess, setIsModalSuccessOpen] = useState(false);
    const [isModalError, setIsModalErrorOpen] = useState(false);
    const [erro, setErro] = useState('');


    useEffect(() => {
        const novaConsultaSetor = `
            SELECT CODUSU, CODGRUPO, AD_CODSUBGRUPO FROM SANKHYA.TSIUSU USU WHERE USU.CODUSU = SANKHYA.STP_GET_CODUSULOGADO()
        `;
        setConsultarSetor(novaConsultaSetor);
    }, []);

    const { data, loading, error } = useConsultar(consultarSetor);

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                codUsuLog: item.CODUSU,
                codSetor: item.CODGRUPO,
                codSubGrupo: item.AD_CODSUBGRUPO
            }));
            setCodUsu(formattedData[0]?.codUsuLog || '');
            setCodUsuGru(formattedData[0]?.codSetor || '');
            setCodSubGrupo(formattedData[0]?.codSubGrupo || '');
        }
    }, [data]);


    const handleSubmit = (e) => {
        e.preventDefault();

        const formatDate = (date) => {
            const d = new Date(date);
            const day = ("0" + d.getDate()).slice(-2);
            const month = ("0" + (d.getMonth() + 1)).slice(-2);
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        let formattedDataInicio = dataInicio;
        let formattedDataFinal = dataFinal;

        if (dataInicio !== "") {
            formattedDataInicio = formatDate(dataInicio);
        }
        if (dataFinal !== "") {
            formattedDataFinal = formatDate(dataFinal);
        }

        JX.salvar(
            {
                NOME_PROJETO: nomeProjeto,
                DESCRICAO: descProjeto,
                SETOR: codUsuGru,
                SUBGRUPO: codSubGrupo,
                DATA_INICIO: formattedDataInicio,
                DATA_FINALIZACAO: formattedDataFinal,
                STATUS: status
            },
            "AD_PROJETOSGERAL",
            []
        ).then(data => {
            if (data.status === "0") {
                setIsModalErrorOpen(true);
                setErro(data.statusMessage)
            } else {
                setNomeProjeto('');
                setDescProjeto('');
                setDataInicio('');
                setDataFinal('');
                setStatus('');

                setIsModalSuccessOpen(true);
                setErro('');
            }
        })
            .catch(function (error) {
                setIsModalErrorOpen(true);
                console.error('Erro ao criar o Projeto: ', error);
            });
    };




    return (
        <>
            <div className="flex items-center mb-[10px]">
                <button
                    onClick={() => handleClickCreateNewProject(false)}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-1"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-[25px] font-bold text-center flex-1">Criar Novo Projeto</h2>
            </div>

            <form className="mt-[30px] w-full" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_nome"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Nome do Projeto *
                        </label>
                        <input
                            type="text"
                            value={nomeProjeto}
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
                            Descrição do Projeto *
                        </label>
                        <input
                            type="text"
                            value={descProjeto}
                            onChange={(e) => setDescProjeto(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_dataInicio"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Data de Início *
                        </label>
                        <input
                            type="date"
                            value={dataInicio}
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
                            value={dataFinal}
                            onChange={(e) => setDataFinal(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_status"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Status *
                        </label>
                        <select
                            value={status}
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
                        onClick={() => handleClickCreateNewProject(false)}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    >
                        Enviar
                    </button>
                </div>
            </form>

            {isModalSuccess && (
                <ModalSuccess
                    onClose={() => setIsModalSuccessOpen(false)}
                    mensagemSuccess={'Projeto criado com sucesso.'}
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

export default CreateNewProject;
