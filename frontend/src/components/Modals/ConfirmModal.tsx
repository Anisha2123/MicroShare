function ConfirmModal({ text, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-72 text-center">
        <p className="mb-4">{text}</p>
        <div className="flex justify-between">
          <button onClick={onCancel} className="text-gray-500">
            Cancel
          </button>
          <button onClick={onConfirm} className="text-red-500 font-medium">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
