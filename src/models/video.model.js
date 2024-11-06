import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url wew can directly store the images and videos in the database but it gives a lot of load to the DB
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId, //taking ref so we write this as type 
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema) 
// Exporting the model (export const Video = mongoose.model(...)) is typically what you'd want to do because it gives you the complete functionality of the model (querying, saving, updating, etc.) right away.
// Exporting just the schema (export { videoSchema }) is useful if you only want to share the structure of the schema but don't need to use it as a model until later.