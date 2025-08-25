import { Modal } from "../../ui/modal"

interface LoaderModalProps {
    isOpen: boolean;
    text?: string;
}

export default function LoaderModal({ isOpen, text = "Cargando..." }: LoaderModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={() => { }} showCloseButton={false} className="max-w-sm mx-auto rounded-xl shadow-lg">
            <div className="flex flex-col items-center justify-center p-8">
                <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">{text}</span>
            </div>
        </Modal>
    );
}