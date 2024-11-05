const asyncHandler = (requestHandler)=>{
    (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}


// ### 1. **`const asyncHandler = (requestHandler) => {`**
//    - **`const`**: We are declaring a constant variable called `asyncHandler`.
//    - **`(requestHandler)`**: `asyncHandler` is a function that takes one argument, `requestHandler`, which is expected to be another 
//function (likely an asynchronous function). 
//    - This means that `asyncHandler` is a higher-order function—a function that takes another function (`requestHandler`) as input.

//    **In simple terms**: 
//    - We are creating a function (`asyncHandler`) that takes another function (`requestHandler`) as an argument.

// ### 2. **`return (req, res, next) => {`**
//    - This is returning a **new function** that takes three arguments: `req`, `res`, and `next`.
//      - **`req`**: The request object (contains information about the incoming HTTP request).
//      - **`res`**: The response object (used to send back an HTTP response).
//      - **`next`**: A callback function to pass control to the next middleware in the stack (used in Express.js).

//    **In simple terms**: 
//    - `asyncHandler` returns a new function that will handle HTTP requests, which takes in the usual Express.js parameters: `req`, `res`, and `next`.

// ### 3. **`Promise.resolve(requestHandler(req, res, next))`**
//    - **`requestHandler(req, res, next)`**: This calls the `requestHandler` function (which was passed into `asyncHandler`), passing along the `req`, `res`, and `next` arguments. 
//This could be an asynchronous function, like an API call or a database query.
//    - **`Promise.resolve(...)`**: This ensures that the result of calling `requestHandler(req, res, next)` is treated as a promise, 
//even if it's not already. If `requestHandler` returns a non-promise value, `Promise.resolve` will wrap it in a resolved promise.

//    **In simple terms**:
//    - We are making sure that whatever `requestHandler` does is treated as a promise, so we can handle its result properly 
//(including catching any errors).

// ### 4. **`.catch((err) => next(err))`**
//    - **`.catch()`**: This handles any errors that might happen inside the promise (if `requestHandler` fails, throws an error, 
//or returns a rejected promise).
//    - **`(err) => next(err)`**: If there’s an error (`err`), it will call the `next` function, passing the error to it. This allows 
//the error to be passed along to the next error-handling middleware in the Express.js pipeline.

//    **In simple terms**:
//    - If something goes wrong (an error is thrown or the promise is rejected), this catches the error and passes it to the next 
//middleware (which is typically an error handler in Express.js).

// ### Putting it all together:
// - `asyncHandler` is a function that takes an **asynchronous handler function** (`requestHandler`) as an argument.
// - It **returns** a new function that will:
//   - Call `requestHandler(req, res, next)` and ensure it's treated as a promise.
//   - If `requestHandler` succeeds, the promise is resolved and the request continues normally.
//   - If `requestHandler` fails (throws an error or returns a rejected promise), the error is passed to the next middleware 
//(error handler) using `next(err)`.

// ### Why use this?
// This pattern is commonly used in Express.js (and similar frameworks) to handle **asynchronous middleware**. Instead of
// manually wrapping every async route handler with `try-catch` blocks, we can use this `asyncHandler` function to automatically
// catch and forward errors to the next error-handling middleware.









export{asyncHandler}   
              
//Named export

//Key Differences:
// Named Exports (export { asyncHandler }):
// Can export multiple items.
// Must import using the exact same name as the export.
// Makes it explicit what is being exported and imported.
// Default Export (export default asyncHandler):
// Typically used when you export a single item from the module.
// The imported name can be different from the export name.
// There can be only one default export per module.