import React, { useEffect, useState } from "react";
import { JX } from "../../lib/JX";


function ModalDeletarProjeto({ codProjeto, onClose }) {

    const [erro, setErro] = useState('');
    const [consultaCodAtividadeDev, setConsulta] = useState('')

    const deleteProject = (codProjeto) => {
        JX.deletar('AD_PROJETOSGERAL', [{ ID: codProjeto }])
         .then(data => {
            if (data.status === "0") {
                setErro(data.statusMessage)
                alert('Erro ao excluir o projeto: ', erro)
            } else {
                setErro('');
                window.location.reload();
            }
            })
            .catch(function (error) {
                setErro(erro);
                alert('Erro ao excluir o registro: ', erro)
            });

    };

    

    return (
        <>
            <div id="popup-modal" tabindex="-1" className="rounded-lg fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden top-0 right-0 left-0 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative rounded-lg shadow bg-gray-700">
                        <button
                            type="button"
                            className="absolute top-3 end-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                            data-modal-hide="popup-modal"
                            onClick={onClose}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 w-12 h-12 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-400">Tem certeza que deseja excluir o projeto?</h3>
                            <button
                                data-modal-hide="popup-modal"
                                type="button"
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                onClick={() => deleteProject(codProjeto)}
                            >
                                Sim, excluir
                            </button>
                            <button
                                data-modal-hide="popup-modal"
                                type="button"
                                className="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                                onClick={onClose}
                            >
                                Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ModalDeletarProjeto;