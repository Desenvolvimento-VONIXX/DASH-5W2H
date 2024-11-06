import { FaCheckCircle } from "react-icons/fa";

function ModalSuccess({ onClose, mensagemSuccess }) {
  
    const handleReload = (() => {
        onClose;
        window.location.reload();
        
    })
    return (
        <>
            <div id="popup-modal" tabindex="-1" className="rounded-lg fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden top-0 right-0 left-0 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative rounded-lg shadow bg-gray-700">
                        <div className="p-4 md:p-5 text-center">
                            <FaCheckCircle
                                className="mx-auto mb-4 text-green-400 w-12 h-12 dark:text-green-200" aria-hidden="true"
                            />

                            <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">{mensagemSuccess}</h3>
                            <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                                onClick={handleReload}
                            >OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ModalSuccess;