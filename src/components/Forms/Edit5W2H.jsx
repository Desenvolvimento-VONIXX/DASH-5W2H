import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import ModalSuccess from "../Modal/ModalSuccess";
import ModalError from "../Modal/ModalError";
import { JX } from "../../lib/JX";

function Edit5W2H({ codProjeto, cod5W2H, handleEdit5w2h }) {
    const [result, setResult] = useState([]);
    const [consultaRegistro, setConsultaRegistro] = useState('');
    const [resultUsu, setResultUsu] = useState([]);
    const [consultaUsuarios, setConsultaUsuarios] = useState('');
    const [isModalSuccess, setIsModalSuccessOpen] = useState(false);
    const [isModalError, setIsModalErrorOpen] = useState(false);
    const [erro, setErro] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    const [idProjeto, setIdProjeto] = useState('');
    const [idAtividade, setIdAtividade] = useState('');
    const [que, setQue] = useState('');
    const [porque, setPorque] = useState('');
    const [como, setComo] = useState('');
    const [quem, setQuem] = useState('');
    const [onde, setOnde] = useState('');
    const [quando, setQuando] = useState('');
    const [quanto, setQuanto] = useState('');
    const [status, setStatus] = useState('');


    useEffect(() => {
        const novaConsultaUsu = `
            SELECT 
            USU.CODUSU, 
            USU.NOMEUSU, 
            USU.AD_CODSUBGRUPO
            FROM SANKHYA.TSIUSU USU
            INNER JOIN SANKHYA.TFPFUN FUN ON FUN.CPF = USU.CPF
            WHERE 
            USU.CODGRUPO IN (SELECT DISTINCT GCI.CODGRUPO 
            FROM AD_TGFGCI GCI
            INNER JOIN SANKHYA.TSIUSU USU2 ON USU2.CODGRUPO = GCI.CODGRUPO
            WHERE 
            GCI.CODGRUCIPAI IN (SELECT CODGRUCI FROM AD_TGFGCI WHERE CODGRUPO = (SELECT CODGRUPO FROM SANKHYA.TSIUSU WHERE CODUSU = SANKHYA.STP_GET_CODUSULOGADO() AND FUN.SITUACAO = 1))
            OR GCI.CODGRUCI IN (SELECT CODGRUCI FROM AD_TGFGCI WHERE CODGRUPO = (SELECT CODGRUPO FROM SANKHYA.TSIUSU WHERE CODUSU = SANKHYA.STP_GET_CODUSULOGADO() AND FUN.SITUACAO = 1)))
            AND FUN.SITUACAO = 1
            `;
        setConsultaUsuarios(novaConsultaUsu);

    }, [consultaUsuarios]);

    const { data: dataRegistro, loading: loadingRegistro, error: errorRegistro } = useConsultar(consultaRegistro);

    useEffect(() => {
        const novaConsultaRegistro = `
            SELECT * FROM SANKHYA.AD_5W2HGERAL WHERE ID = ${codProjeto} AND ID_ATIVIDADE = ${cod5W2H}
        `;
        setConsultaRegistro(novaConsultaRegistro);
    }, [codProjeto, cod5W2H]);


    const { data: dataUsuarios, loading: loadingUsuarios, error: errorUsuarios } = useConsultar(consultaUsuarios);

    useEffect(() => {
        if (dataUsuarios && dataUsuarios.length > 0) {
            const formattedDataUsu = dataUsuarios.map(item => ({
                codUsu: item.CODUSU,
                nomeUsu: item.NOMEUSU
            }));

            setResultUsu(formattedDataUsu);
        }
    }, [dataUsuarios]);


    const formatDateInput = (dateString) => {
        if (!dateString) return '';
        const datePart = dateString.split(' ')[0];
        const day = datePart.slice(0, 2);
        const month = datePart.slice(2, 4);
        const year = datePart.slice(4, 8);

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (dataRegistro && dataRegistro.length > 0) {
            const formattedData = dataRegistro.map(item => ({
                idProjeto: item.ID,
                idAtividade: item.ID_ATIVIDADE,
                que: item.QUE,
                porque: item.PORQUE,
                como: item.COMO,
                quem: item.QUEM,
                onde: item.ONDE,
                quando: formatDateInput(item.QUANDO),
                quanto: item.QUANTO,
                status: item.STATUS,
            }));

            setResult(formattedData);
            setIdProjeto(formattedData[0]?.idProjeto || codProjeto);
            setIdAtividade(formattedData[0]?.idAtividade || cod5W2H);
            setQue(formattedData[0]?.que || '');
            setPorque(formattedData[0]?.porque || '');
            setComo(formattedData[0]?.como || '');
            setQuem(formattedData[0]?.quem || '');
            setOnde(formattedData[0]?.onde || '');
            setQuando(formattedData[0]?.quando || '');
            setQuanto(formattedData[0]?.quanto || '');
            setStatus(formattedData[0]?.status || '');
        }
    }, [dataRegistro]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formatDate = (date) => {
            const d = new Date(date);
            const day = ("0" + d.getUTCDate()).slice(-2);
            const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
            const year = d.getUTCFullYear();
            return `${day}/${month}/${year}`;
        };

        let formattedDataQuando = quando;

        if (quando !== "") {
            formattedDataQuando = formatDate(quando);
        }

        JX.salvar(
            {
                QUE: que,
                PORQUE: porque,
                COMO: como,
                QUEM: quem,
                ONDE: onde,
                QUANDO: formattedDataQuando,
                QUANTO: quanto,
                STATUS: status
            },
            "AD_5W2HGERAL",
            [
                {
                    ID: codProjeto,
                    ID_ATIVIDADE: cod5W2H,
                },
            ]
        ).then(data => {
            const response = data[0];
            console.log(response);

            if (response.status === "0") {
                setErro(response.statusMessage || 'Erro desconhecido ao salvar o 5W2H.');
                setIsModalErrorOpen(true);
            } else {
                setIsModalSuccessOpen(true);
                setErro('');
            }
        });
    };

    useEffect(() => {
        const originalValues = result[0] || {};
        const hasChanges =
            que !== originalValues.que ||
            porque !== originalValues.porque ||
            como !== originalValues.como ||
            quem !== originalValues.quem ||
            onde !== originalValues.onde ||
            quando !== originalValues.quando ||
            quanto !== originalValues.quanto ||
            status !== originalValues.status;

        setIsDirty(hasChanges); // Atualiza o estado isDirty
    }, [que, porque, como, quem, onde, quando, quanto, status]);

    useEffect(() => {
        console.log(
            idProjeto,
            idAtividade,
            que,
            quem,
            como,
            porque,
            onde,
            quando,
            quanto,
            status
        )
    }, [idProjeto, idAtividade, que, quem, como, porque, onde, quando, quanto, status])

    return (
        <>
            <div className="flex items-center mb-[10px]">
                <button
                    onClick={() => handleEdit5w2h(false)}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-1"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-[25px] font-bold text-center flex-1">Editar 5W2H</h2>
            </div>


            <form onSubmit={handleSubmit} className="mt-[30px] w-full">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_nome"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            O que?
                        </label>
                        <input
                            type="text"
                            value={que}
                            onChange={(e) => setQue(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_desc"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Por que?
                        </label>
                        <input
                            value={porque}
                            onChange={(e) => setPorque(e.target.value)}
                            type="text"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_desc"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Como?
                        </label>
                        <input
                            value={como}
                            onChange={(e) => setComo(e.target.value)}
                            type="text"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_status"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Quem?
                        </label>
                        <select
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            value={quem}
                            onChange={(e) => setQuem(e.target.value)}
                            required
                        >
                            <option value="" disabled selected>Selecionar Usuário</option>
                            {resultUsu.map(user => (
                                <option key={user.codUsu} value={user.codUsu}>
                                    {user.nomeUsu}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_desc"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Onde?
                        </label>
                        <input
                            value={onde}
                            onChange={(e) => setOnde(e.target.value)}
                            type="text"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_dataInicio"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Quando?
                        </label>
                        <input
                            value={quando}
                            onChange={(e) => setQuando(e.target.value)}
                            type="date"
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required
                        />
                    </div>
                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_desc"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Quanto?
                        </label>
                        <input
                            value={quanto}
                            onChange={(e) => setQuanto(e.target.value)}
                            type="text"
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
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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
                        onClick={() => handleEdit5w2h(false)}
                    >
                        Cancelar
                    </button>

                    {isDirty && (
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
                    mensagemSuccess={'O registro foi atualizado com sucesso.'}
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

export default Edit5W2H;
