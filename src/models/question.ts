import { Schema, model } from "mongoose";

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
});

const QuestionModel = model("Question", QuestionSchema);
export default QuestionModel;
