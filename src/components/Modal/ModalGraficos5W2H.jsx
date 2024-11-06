import React, { useEffect, useState } from "react";
import { useConsultar } from "../../../hook/useConsultar";
import GraficoStatus from "../Graficos/GraficoStatus";
import GraficoStatusPerc from "../Graficos/GraficoStatusPerc";

function ModalGraficos({ nomeProjeto, codProjeto, onClose }) {


    return (
        <>
            <div id="static-modal" data-modal-backdrop="static" className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-2xl max-h-full min-height: 40vh;">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                ({codProjeto}) - {nomeProjeto}
                            </h3>
                            <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-10 flex justify-center items-center">
                            <div className="grid grid-cols-12 gap-4 w-full max-w-6xl">
                                <div className="col-span-6 flex justify-center items-center">
                                    <div className="w-full h-[300px] overflow-x-auto">
                                        <GraficoStatus codProjeto={codProjeto} />
                                    </div>
                                </div>

                                <div className="col-span-6 flex justify-center items-center">
                                    <div className="w-full h-[300px] overflow-x-auto">
                                        <GraficoStatusPerc codProjeto={codProjeto} />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalGraficos;
