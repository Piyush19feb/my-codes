import './modal.css';

const Modal = ({ handleClose, show, handleConfirm, children }) => {
  // console.log("modal fun",show, handleClose, handleConfirm);
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button type="button" onClick={handleConfirm}>
            Confirm
        </button>
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
};
export default Modal;