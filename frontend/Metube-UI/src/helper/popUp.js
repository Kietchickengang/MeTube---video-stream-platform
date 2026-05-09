import toast from 'react-hot-toast';
 
// Notify "Nothing"
export const notifyEmpty = (field) => {
    toast.error(`${field} is empty`, {
        position: 'top-right',
        duration: 1000,
    });
};

// Notify "Success"
export const notifySuccess = (message) => {
    toast.success(message, {
        position: 'top-right',
        duration: 1000,
    });
};

// Notify "Error"
export const notifyError = (message) => {
    toast.error(message, {
        position: 'top-right',
        duration: 1000,
    });
};