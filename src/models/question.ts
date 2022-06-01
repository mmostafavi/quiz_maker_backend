import { Schema, model } from "mongoose";

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
  },

  answer: {
    type: String,
    required: true,
  },

  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  module: {
    type: Number,
    required: true,
  },

  usage: {
    count: {
      type: Number,
      required: true,
    },

    exams: [{ type: Schema.Types.ObjectId }],
  },
});

const QuestionModel = model("Question", QuestionSchema);
export default QuestionModel;
