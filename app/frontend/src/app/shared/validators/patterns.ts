export const nitPattern: RegExp = /^(\d{7}-\d|CF)$/;
export const namePattern: RegExp = /^[A-Za-z ]+$/;
export const phonePattern: RegExp = /^[0-9]{8}$/;
export const emailPattern: RegExp = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
export const addressPattern: RegExp = /^[A-Za-z0-9.,\- ]{5,}$/;
export const passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%$!%*?&<>:;.,_\-\(\)\[\]\{\}])[A-Za-z\d@#%$!%*?&<>:;.,_\-\(\)\[\]\{\}]{5,}$/;