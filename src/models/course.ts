import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

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

  students: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
});

const CourseModel = model("Course", CourseSchema);
export default CourseModel;
