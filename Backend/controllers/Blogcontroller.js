const Blogs = require("../models/BlogSchema")
const User = require("../models/UserSchema")
const comments = require("../models/commentSchema")
const Comment = require("../models/commentSchema")
const { uploadImage, deleteImage } = require("../utills/uploadImage")
const { verifyJWT, decodeJWT } = require("../utills/generateToken")
const fs = require('fs');
const uniqueid = require("uniqid");
const { json } = require("stream/consumers")
const path = require("path")

async function CreateBlog(req, res) {
    try {
        const { title, Desc } = req.body
        const { image, images } = req.files
        console.log(image)
        // console.log(images)
        const content = JSON.parse(req.body.content)

        // console.log(content.blocks[0].data.file);
        let imgIndex = 0;

        for (let i = 0; i < content.blocks.length; i++) {
            const block = content.blocks[i]

            if (block.type === 'image') {

                const base64 = images[imgIndex].buffer.toString("base64")
                const dataUrl = `data:image/jpeg;base64,${base64}`

                const { url, public_id } = await uploadImage(dataUrl)

                imgIndex++
                // console.log(url)
                block.data.file.url = url
                block.data.file.public_id = public_id
            }
        }


        const { url, public_id } = await uploadImage(`data:image/jpeg;base64,${image[0].buffer.toString("base64")}`)
        //create a custom blog id
        const blogId = title.toLowerCase().split(" ").join("-") + "-" + uniqueid();
        console.log(blogId)
        //delete the file from local stroage
        // fs.unlinkSync(req.file.path)

        const newBlog = await Blogs.create({
            title,
            image: url,
            imageid: public_id,
            Desc,
            creator: req.user.id,
            blogId,
            content
        })

        await User.findByIdAndUpdate(req.user.id, { $push: { blog: newBlog._id } })

        res.status(201).json({
            success: true,
            message: "Blog has been created for you",
            newBlog
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server err",
            error
        })
    }
}

async function GetBlog(req, res) {
    try {
        const blog = await Blogs.find({})
            .populate({ path: "creator" })
            .populate({
                path: "comments",
                populate: [
                    { path: "user", select: "name" },
                    { path: "replies" }
                ]
            });
        res.status(200).json({
            success: true,
            message: "got the blog",
            blog
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server err",
            err
        })
    }
}
async function GetBlogById(req, res) {
    try {
        // console.log(req.params)
        const { id } = req.params
        const blog = await Blogs.findOne({ blogId: id }).populate({ path: "creator" }).populate({
            path: "comments",
            populate:
                { path: "user", select: "name" },

        }).lean();

        async function populateReplies(comments) {
            for (const comment of comments) {
                let populatedComment = await Comment.findById(comment._id).populate({
                    path: "replies",
                    populate: {
                        path: "user", select: "name"
                    }
                }).lean()

                 comment.replies=populatedComment.replies

                 if(populatedComment.replies.length>0){
                   
                   
                    await populateReplies(populatedComment.replies)
                 }
            }

            return comments

           
        }

        blog.comments = await populateReplies(blog.comments)

        res.status(200).json({
            success: true,
            message: "got the blog",
            blog
        })
    }

    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal server err",
            err
        })
    }
}
async function UpdateBlog(req, res) {
    try {
        const { title, Desc } = req.body
        // console.log(req.body)
        const { id } = req.params
        // console.log("from handler", req.user.id)

        const blogId = id
        const imageUrl = req?.body?.image

        // console.log(title, Desc, imageUrl)
        const creator = req.user.id
        let content = JSON.parse(req.body.content)

        const { images, image } = req.files

        const existingImages = JSON.parse(req.body.existingImages)
        // console.log(existingImages)
        // console.log(images)
        const findblog = await Blogs.findOne({ blogId });

        if (!(req.user.id == findblog.creator)) {
            return res.status(401).json({
                success: false,
                message: "you are not authorized for this action"
            })
        }
        // //cloudinary code
        // console.log(findblog)
        const imageid = findblog.imageid
        let imageToDelete = findblog.content.blocks.filter((block) => (block.type == 'image')).filter(
            (block) => !existingImages.find(({ url }) => url == block.data.file.url)
        ).map((block) => block.data.file.public_id)




        // console.log(imageToDelete)

        if (imageToDelete.length > 0) {

            await Promise.all(
                imageToDelete.map((id) => deleteImage(id))
            )


        }


        if (images) {
            let imgIndex = 0;
            for (let i = 0; i < content.blocks.length; i++) {
                const block = content.blocks[i]

                if (block.type === 'image' && block.data.file.image) {

                    const base64 = images[imgIndex].buffer.toString("base64")
                    const dataUrl = `data:image/jpeg;base64,${base64}`

                    const { url, public_id } = await uploadImage(dataUrl)

                    imgIndex++
                    // console.log(url)
                    block.data.file.url = url
                    block.data.file.public_id = public_id
                }
            }
        }
        console.log(image)

        if (image) {
            await deleteImage(imageid)
            const { url, public_id } = await uploadImage(`data:image/jpeg;base64,${image[0].buffer.toString("base64")}`)
            imageUrl = url;
            imageid = public_id
        }

        const blog = await Blogs.findOneAndUpdate({ blogId: id }, {
            title,
            image: imageUrl,
            imageid: imageid,
            Desc,
            creator: req.user.id,
            blogId,
            content
        },
            { new: true })

        //  console.log(blog)

        res.status(200).json({
            success: true,
            message: "updated succesfully",
            blog
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal server err",
            err
        })
    }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoic29oYW4gZGFzQGdtYWlsLmNvbSIsImlkIjoiNjhjYmQyNzkwODM0Njk5MDVmNzY4ZGFjIn0sImlhdCI6MTc1ODE4ODE1M30.z_a2ZrmRjeW92PN7IMBgN9Mw_BSFtNCCUiZknhdHds0
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoic29uYWlAZ21haWwuY29tIiwiaWQiOiI2OGNjZjc2MjczODBjNjU4Mzk0ZjAxZTQifSwiaWF0IjoxNzU4MjYzMTM4fQ.2zQgC5ssdjZhgZYR5iXqsZU4v9wtKyf3ikQUkRoW5Cs
async function DeleteBlog(req, res) {
    // const { Title, Desc, Draft, Tags, Author } = req.body
    try {
        const creator = req.user.id
        const { id } = req.params

        const findblog = await Blogs.findById(id);

        if (!(req.user.id == findblog.creator)) {
            return res.status(401).json({
                success: false,
                message: "you are not authorized for this action"
            })
        }
        //before deleting the blog delete the image from cloudinary
        const imageid = findblog.imageid;
        await deleteImage(imageid);
        const blog = await Blogs.findByIdAndDelete(id)


        await User.findByIdAndUpdate(creator, { $pull: { blog: id } })
        res.status(200).json({
            success: true,
            message: "Deleted succesfully",
            blog
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server err",
            err
        })
    }
}


async function likeBlog(req, res) {
    // const { Title, Desc, Draft, Tags, Author } = req.body
    try {



        // console.log(creator);
        const { id } = req.params

        let findblog = await Blogs.findOne({ blogId: id });
        if (!findblog) {
            return res.status(500).json({
                success: false,
                message: "blog is not fuond"
            })
        }
        if (!findblog.likes.includes(req.user.id)) {
            findblog = await Blogs.findOneAndUpdate({ blogId: id }, { $push: { likes: req.user.id } }, { new: true })
            return res.status(200).json({
                success: true,
                message: "liked succesfully",
                blog: findblog
            })
        }
        else {
            findblog = await Blogs.findOneAndUpdate({ blogId: id }, { $pull: { likes: req.user.id } }, { new: true })
            return res.status(200).json({
                success: true,
                message: "disliked succesfully",
                blog: findblog
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal server err",
            err
        })
    }
}


module.exports = { CreateBlog, GetBlog, UpdateBlog, DeleteBlog, GetBlogById, likeBlog };