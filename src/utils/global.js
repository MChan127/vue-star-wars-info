import axios, {get} from 'axios';

const BASE_URL = 'https://swapi.co/api/';
const AXIOS_CONFIG = {
    baseUrl: BASE_URL,

};

/**
 * Enforces error as a string and prints it in an alert popup
 */
function defaultErrHandler(err) {
    if (typeof err !== 'string') {
        err = JSON.stringify(err);
    }
    alert(err);
}

/**
 * Wrapper for Axios GET request with proper configuration
 * and standardized error handling logic
 * 
 * If promisify = true, overwrite callbacks and return a promise instead
 */
function axiosGet(path, {callback, errCallback, promisify = false}) {
    if (promisify !== false) {
        return new Promise(execute);
    } else {
        execute();
    }

    function execute(fulfill = null, reject = null) {
        if (promisify !== false) {
            callback = fulfill;
            errCallback = reject;
            // just in case
            defaultErrHandler = err => {
                defaultErrHandler(err);
                reject(err);
            };
        }

        // actual AJAX request
        get(path).then(res => {
            if (res.status == 200 && res.statusText == 'OK') {
                callback(res.data);   
            } else {
                if (errCallback) {
                    errCallback(res);
                } else {
                    defaultErrHandler(err);
                }
            }
        }).catch(err => {
            if (errCallback) {
                errCallback(err); 
            } else {
                defaultErrHandler(err);
            }
        });
    }
}

export default {
    BASE_URL,
    axiosGet,
    getDetailPageName,
};