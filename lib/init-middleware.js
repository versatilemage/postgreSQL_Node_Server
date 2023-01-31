// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
//
const initMiddleware = (middleware) => {
    return (req, res) =>
        new Promise((resolve, reject) => {
            try {
                middleware(req, res, (result) => {
                    if (result instanceof Error) {
                        return reject(result)
                    }
                    return resolve(result)
                });
            } catch (error) {
                return reject(error);
            }
        });
}

module.exports = initMiddleware;
