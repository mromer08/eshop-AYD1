import app from './app.js';
import connectToMongoDB from './config/databaseConnection.js';

const PORT = process.env.PORT || 3500;

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});