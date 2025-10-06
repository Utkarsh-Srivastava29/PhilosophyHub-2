import Discussion from "../models/Discussion"
import Tag from "../models/Tag";
import User from "../models/User";

export const getAllDiscussions = async (req,res) => {
    try{
        const discussions = await Discussion.find({}).populate({
            path: 'user',
            select: 'name profilePicture'
        }).populate({
            path: 'tags',
            select: 'name'
        })

        return res.status(200).json({
            success: true,
            discussions
        });
    }
    catch(e){
        console.error("Error fetching discussions:", e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


export const tagGenerator = async(tags) => {
    for(let i of tags){
        if(!i.isAvailable){
            const newTag = await Tag.create({
                name: i.name,
                discussions: [],
                responses: []
            });
            i.id = newTag._id;
        }
        i = i.id;
    }
    return tags;
}
export const getDiscussionById = async (req, res) => {
    try{
        const {id} = req.params;
        const discussion = await Discussion.findById(id).populate({
            path: 'user',
            select: 'name profilePicture'
        }).populate({
            path: 'tags',
            select: 'name'
        }).populate('comments');
        if(!discussion){
            return res.status(404).json({
                success: false,
                message: "Discussion not found"
            });
        }
        return res.status(200).json({
            success: true,
            discussion
        });
    }
    catch(e){
        console.error("Error fetching discussion:", e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const createDiscussion = async (req,res) => {
    try{
        const { title, content, tags} = req.body;
        if(!title || !content){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const userId = req.user.id;
        tags = tagGenerator(tags);
        const discussion = await Discussion.create({
            user: userId,
            title,
            content,
            tags
        })
        // Update tags with the new discussion
        await User.findByIdAndUpdate(userId, {
            $push: { discussions: discussion._id }
        })
        for(let i of tags){
            await Tag.findByIdAndUpdate(i, {
                $push: { discussions: discussion._id }
            });
        }
        return res.status(201).json({
            success: true,
            message: "Discussion created successfully",
            discussion
        });
    }
    catch(e){
        console.error("Error creating discussion:", e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateDiscussion = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, content} = req.body;
        if(!title || !content){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        await Discussion.findByIdAndUpdate(id, {
            title,
            content
        })
        return res.status(200).json({
            success: true,
            message: "Discussion updated successfully"
        });
    }
    catch(e){
        console.error("Error updating discussion:", e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const likeDiscussion = async (req,res) => {
    try{
        const { id: discussionId } = req.params;
        if(!discussionId){
            return res.status(400).json({
                success: false,
                message: "Invalid URL"
            });
        }
        const discussion = await Discussion.findById(discussionId);
        if(!discussion){
            return res.status(404).json({
                success: false,
                message: "Discussion not found"
            });
        }
        const { id: userId } = req.user;
        if(!discussion.likes.includes(userId)){
            discussion.likes.push(userId);
        }
        await discussion.save();
        return res.status(200).json({
            liked: true,
            success: true,
            message: "Discussion liked successfully",
            likesCount: discussion.likes.length
        });
    }
    catch(e){
        console.error("Error liking discussion:", e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const dislikeDiscussion = async (req, res) => {
    try{
        const { id: discussionId } = req.params;
        if(!discussionId){
            return res.status(400).json({
                success: false,
                message: "Invalid URL"
            });
        }
        const discussion = await Discussion.findById(discussionId);
        if(!discussion){
            return res.status(404).json({
                success: false,
                message: "Discussion not found"
            });
        }
        const { id: userId } = req.user;
        const index = doubt.likes.indexOf(userId);
        if(index !== -1){
            doubt.likes.splice(index, 1);
        }
        await discussion.save();
        return res.status(200).json({
            liked: false,
            success: true,
            message: "Discussion disliked successfully",
            likesCount: discussion.likes.length
        });
    }
    catch(e){
        console.error("Error disliking discussion:", e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}