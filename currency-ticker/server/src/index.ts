import { app } from './app';

const port = 3001;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});