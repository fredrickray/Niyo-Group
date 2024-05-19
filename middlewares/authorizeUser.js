const { UserModel } = require("../models/userModel")
const { verifyToken } = require("../utils/authorization");
const { Unauthorized } = require("./errorHandler")


const requireAuth = async (req, res, next) => {
    // verifying authentication
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw new Unauthorized("Authorization token required")
        }

        const token = authorization.split(' ')[1];
        const { id } = verifyToken(token)

        // req.user = await knex('Merchants').where({ _id: id });
        const user = await UserModel.findById({ _id: id })

        if (!user) {
            throw new Unauthorized("User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
};

module.exports = requireAuth;