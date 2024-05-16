const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    tags: [{
        type: String,
        enum: ['Work', 'Personal', 'Urgent', 'Home', 'Misc'],
    }],
    comments: [String]
},
    { timestamps: true }
)


const TaskModel = model("Task", taskSchema)
module.exports = { TaskModel }