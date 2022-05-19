import { Schema, model } from "mongoose";

const InstructorSchema = new Schema({
  authData: {
    username: {
      type: String,
      require: true,
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

  courses: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
});

const InstructorModel = model("Instructor", InstructorSchema);
export default InstructorModel;
