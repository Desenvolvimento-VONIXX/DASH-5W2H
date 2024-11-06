import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import { JX } from "../../lib/JX";
import ModalSuccess from "../Modal/ModalSuccess";
import ModalError from "../Modal/ModalError";

function CreateNew5W2H({ handleClickNew5W2H, codProjeto }) {
    const [result, setResult] = useState([]);
    const [consultaUsuarios, setConsultaUsuarios] = useState('');
    const [oque, setOque] = useState('');
    const [porque, setPorque] = useState('');
    const [como, setComo] = useState('');
    const [quem, setQuem] = useState('');
    const [onde, setOnde] = useState('');
    const [quando, setQuando] = useState('');
    const [quanto, setQuanto] = useState('');
    const [status, setStatus] = useState('');
    const [isModalSuccess, setIsModalSuccessOpen] = useState(false);
    const [isModalError, setIsModalErrorOpen] = useState(false);
    const [erro, setErro] = useState('');


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
        `
        setConsultaUsuarios(novaConsultaUsu)
    }, [])

    const { data, loading, error } = useConsultar(consultaUsuarios);

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                codUsu: item.CODUSU,
                nomeUsu: item.NOMEUSU
            }));
            setResult(formattedData);
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

        let formattedQuando = quando;

        if (quando !== "") {
            formattedQuando = formatDate(quando);
        }



        JX.salvar(
            {
                ID: codProjeto,
                QUE: oque,
                PORQUE: porque,
                COMO: como,
                QUEM: quem,
                ONDE: onde,
                QUANDO: formattedQuando,
                QUANTO: quanto,
                STATUS: status

            },
            "AD_5W2HGERAL",
            []
        ).then(data => {
            if (data.status === "0") {
                setIsModalErrorOpen(true);
                setErro(data.statusMessage)
            } else {
                setOque('');
                setComo('');
                setPorque('');
                setQuem('');
                setOnde('');
                setQuando('');
                setQuanto('')
                setStatus('');
                setIsModalSuccessOpen(true);
                setErro('');
            }
        })
            .catch(function (error) {
                setIsModalErrorOpen(true);
                console.error('Erro ao criar o 5W2H: ', error);
            });

    }

    useEffect(() => {
        console.log(codProjeto);

    }, [codProjeto])

    return (
        <>
            <div className="flex items-center mb-[10px]">
                <button
                    onClick={() => handleClickNew5W2H(false)}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-1"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-[25px] font-bold text-center flex-1">Adicionar 5W2H</h2>
            </div>

            <form className="mt-[30px] w-full" onSubmit={handleSubmit}>
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
                            value={oque}
                            onChange={(e) => setOque(e.target.value)}
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
                            type="text"
                            value={porque}
                            onChange={(e) => setPorque(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
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
                            type="text"
                            value={como}
                            onChange={(e) => setComo(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
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
                            {result.map((item) => (
                                <option key={item.codUsu} value={item.codUsu}>{item.codUsu} - {item.nomeUsu}</option>
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
                            type="text"
                            value={onde}
                            onChange={(e) => setOnde(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        />
                    </div>
                    <div className="relative z-0 w-full mb-2 group">
                        <label
                            htmlFor="floating_dataFim"
                            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10"
                        >
                            Quando?
                        </label>
                        <input
                            type="date"
                            value={quando}
                            onChange={(e) => setQuando(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
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
                            type="text"
                            value={quanto}
                            onChange={(e) => setQuanto(e.target.value)}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
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
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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
                        onClick={() => handleClickNew5W2H(false)}
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
                    mensagemSuccess={'5W2H adicionado com sucesso.'}
                />
            )}

            {isModalError && (
                <ModalError
                    onClose={() => setIsModalErrorOpen(false)}
                    mensagemError={erro}
                />
            )}
        </>
    )
}

export default CreateNew5W2H;