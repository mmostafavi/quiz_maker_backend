import { MongoClient, ServerApiVersion } from "mongodb";
import StudentsDAO from "./dao/studentsDAO";
import CoursesDAO from "./dao/coursesDAO";
import InstructorsDAO from "./dao/instructorsDAO";
import QuestionsDAO from "./dao/questionsDAO";
import app from "./server";

const PORT = process.env.PORT || 8000;

const uri = process.env.MONGODB_URI as string;

MongoClient.connect(uri, { serverApi: ServerApiVersion.v1 })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async (client) => {
    // *: inject client to DAOs here
    await InstructorsDAO.injectDB(client);
    await CoursesDAO.injectDB(client);
    await StudentsDAO.injectDB(client);
    await QuestionsDAO.injectDB(client);
    // *: inject client to DAOs here

    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });
  });
