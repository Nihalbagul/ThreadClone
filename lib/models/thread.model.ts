import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text: {type: String, requied:true},
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,

    },
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId:{
        type:String,
    },
    children: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ]
});


const Thread =mongoose.models.Thread || mongoose.model('Thread',threadSchema);

export default Thread;

// thread original -> thread commnet 1-> thread commnet 2 and soon 