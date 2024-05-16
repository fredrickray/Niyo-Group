class IError {
    constructor(field, message) {
        this.field = field;
        this.message = message;
    }
}

async function validateCreateTask(payload) {
    const errors = [];

    if (payload === null) {
        errors.push(new IError("payload", "Payload is required"));
        return errors;
    }

    const { name, description } = payload;

    if (name == null || name === "") {
        errors.push(new IError("name", "Name is required"));
        return errors;
    }

    if (description == null || description === "") {
        errors.push(new IError("description", "Description is required"));
        return errors;
    }

    return errors;
}

async function validateUpdateTask(id, payload) {
    const errors = [];
    validateId(id)

    if (payload == null || JSON.stringify(payload) === "{}") {
        errors.push(new IError("payload", "Payload is required"));
        return errors;
    }

    return errors
}

function validateId(id) {
    const errors = [];

    if (id == null || id === "") {
        errors.push({
            field: "id",
            message: "id is required",
        });
        return errors;
    }

    return errors;
}

module.exports = { validateCreateTask, validateUpdateTask };