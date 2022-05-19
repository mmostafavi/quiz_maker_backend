import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  instructor: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  modules: [
    {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

const CourseModel = model("Course", CourseSchema);
export default CourseModel;
