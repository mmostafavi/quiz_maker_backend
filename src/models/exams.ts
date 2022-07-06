import { Schema, model } from "mongoose";

const ExamSchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  date: {
    type: Schema.Types.Date,
    required: true,
  },

  instructorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  questions: [
    {
      moduleId: {
        type: Number,
        required: true,
      },
      questions: [
        {
          type: Schema.Types.ObjectId,
          required: true,
        },
      ],
    },
  ],
});

const ExamModel = model("Exam", ExamSchema);
export default ExamModel;
