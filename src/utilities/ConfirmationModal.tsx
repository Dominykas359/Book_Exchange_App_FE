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
            <div>
                <h2>{message}</h2>
                <div>
                    <button onClick={onConfirm} className="modal-delete">Delete</button>
                    <button onClick={onCancel} className="modal-cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;