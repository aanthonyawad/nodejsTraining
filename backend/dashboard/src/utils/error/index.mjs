import {errorObject} from "./errorMessages.mjs";

class BaseError extends Error{
    constructor(message) {
        super(message);
        this.errorObject = errorObject;
    }
}
export default BaseError