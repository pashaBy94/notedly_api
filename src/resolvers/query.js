module.exports = {
notes: async (parent, args, {models}) => {
    return await models.Note.find().limit(35);
},
        // notes: async (parent, args, {models}) => {
        //     let res = await models.Note.aggregate([{$lookup: {
        //         from: "users",
        //         localField: "author",
        //         foreignField: "_id",
        //         as: "user_1"
        //     }}, {$unwind: {
        //         path: "$user_1",
        //         // includeArrayIndex: 'string',
        //         // preserveNullAndEmptyArrays: boolean
        //       }}]);
        //     console.log(111, res);
        //     return res
        // },
        note: async (parent, args, {models}) => {
            return await models.Note.findById(args.id)
        },
        user: async (parent, args, { models })=>{
            return await models.User.findOne({username: args.username});
        },
        users: async (parent, args, { models })=> await models.User.find({}).limit(35),
        me: async (parent, args, { models, user })=>{
            return await models.User.findOne({_id: user.id});
        },
        noteFeed: async (parent, args, { models })=>{
            let limit = 10;
            let hasNextPage = false;
            let queryCursor = {};
            if(args.cursor){
                queryCursor = {_id:{$lt: args.cursor}}
            }          
            let notes = await models.Note.find(queryCursor).sort({_id:-1}).limit(limit+1);
            if(notes.length > limit){
                hasNextPage = true;
                notes = notes.slice(0, -1);
            }
            console.log(111,notes);
            let newCursor = notes[notes.length-1]._id;
            return{
                notes,
                cursor: newCursor,
                hasNextPage
            }
        }
};