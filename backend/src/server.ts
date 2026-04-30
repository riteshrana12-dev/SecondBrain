import app from "./app";
import connectToDB from "./config/db";
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exitCode = 1;
  }
})();
