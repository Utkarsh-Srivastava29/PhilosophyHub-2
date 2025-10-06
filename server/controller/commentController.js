import Comment from "../models/Comment";
import Discussion from "../models/Discussion";

export const createComment = async (req,res) => {
    try{
        const {id : userId} = req.user;
        const { id : discussionId, content } = req.body;
        if(!discussionId || !content){
            return res.status(400).json({
                message: "Discussion ID and content are required",
                success: false,
            });
        }
        const discussion = await Discussion.findById(discussionId);
        if(!discussion){
            return res.status(404).json({
                message: "Discussion not found",
                success: false,
            });
        }
        const comment = await Comment.create({
            user: userId,
            discussion: discussionId,
            content,
        });
        discussion.comments.push(comment._id);
        await discussion.save();
        return res.status(201).json({
            message: "Comment Added Successfully",
            success: true
        })
    }
    catch(e){
        return res.status(500).json({
            message: "Internal Server Error",
            succes: false
        })
    }
}

export const likeComment = async(req,res) => {
    try{
        const {id : commentId} = req.params;
        if(!commentId){
            return res.status(400).json({
                success: false,
                message: "Invalid Url"
            })
        }
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(400).json({
                success: false,
                message: "Comment Not Found"
            })
        }
        const {id: userId} = req.user
        if(comment.likes.includes(userId)){
            return res.status(201).json({
                success: false,
                message: "Liked Successfully",
                liked: true,
                likesCount: comment.likes.length
            })
        }
        comment.likes.push(userId)
        await comment.save();
        return res.status(201).json({
                success: false,
                message: "Liked Successfully",
                liked: true,
                likesCount: comment.likes.length
        })
    }
    catch(e){
        return res.status(500).json({
            succes: false,
            message: "Internal Server Error"
        })
    }
}

export const dislikeComment = async(req,res) => {
    try{
        const {id : commentId} = req.params;
        if(!commentId){
            return res.status(400).json({
                success: false,
                message: "Invalid Url"
            })
        }
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(400).json({
                success: false,
                message: "Comment Not Found"
            })
        }
        const {id: userId} = req.user
        if(!comment.likes.includes(userId)){
            return res.status(201).json({
                success: false,
                message: "Disiked Successfully",
                liked: false
            })
        }
        comment.likes = comment.likes.filter((like) => {
            if(like.toString()===userId) return false;
            return true;
        })
        comment.save();
        return res.status(201).json({
            success: false,
                message: "Disliked Successfully",
                liked: false
        })
    }
    catch(e){
        return res.status(500).json({
            succes: false,
            message: "Internal Server Error"
        })
    }
}