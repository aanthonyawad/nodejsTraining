import BaseError from "./index.mjs";
import {errorObject} from "./errorMessages.mjs";

class ErrorLanguage extends BaseError{
    constructor(message, lang ) {
        super(message);
        this.lang = lang;
    }

    returnLangError = () =>{
        const obj = Object.values(errorObject).find(obj => `Error: ${obj.name}` === this.message);
        if(obj){
            if(this.lang){
                return obj[this.lang];
            }else{
                return obj.en;
            }
        }else{
            if(this.lang)
                return errorObject.baseError[this.lang]
            else
                return errorObject.baseError.en
        }
    }

}
export default ErrorLanguage