function Modal({ isOpen, onClose, title, children }) {

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

      <div className="bg-white w-[500px] p-5 rounded shadow-lg">

        <div className="flex justify-between mb-4">

          <h2 className="text-lg font-bold">{title}</h2>

          <button onClick={onClose}>X</button>

        </div>

        {children}

      </div>

    </div>

  );

}

export default Modal;