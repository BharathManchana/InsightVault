//Read about this file again from doc

class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
       // console.log("Hi1",message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        //console.log("Hi2",message)
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}