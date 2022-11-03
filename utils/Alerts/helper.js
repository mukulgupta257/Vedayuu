import { toast } from 'react-toastify';
const showSuccessToast = (msg) => {
    toast.success(msg, {
        toastId: 'success1',
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
const showErrorToast = (msg) => {
    toast.error(msg, {
        toastId: 'error1',
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
const showWarnToast = (msg) => {
    toast.warn(msg, {
        toastId: 'warn1',
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

export {
    showErrorToast,
    showSuccessToast,
    showWarnToast
}