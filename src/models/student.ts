import { Schema, model } from "mongoose";

const StudentSchema = new Schema({
  authData: {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },

  fName: {
    type: String,
    required: true,
  },

  lName: {
    type: String,
    required: true,
  },

  courses: [{ type: Schema.Types.ObjectId, required: true }],

  questions: [{ type: Schema.Types.ObjectId, required: true }],
});

const StudentModel = model("Student", StudentSchema);
export default StudentModel;
