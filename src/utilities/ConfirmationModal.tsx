interface Props{
    isOpen: boolean,
    message: string,
    onConfirm: () => void,
    onCancel: () => void
}

function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: Props) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                <h2 className="text-xl font-semibold mb-4">{message}</h2>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;