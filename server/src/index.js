const exress = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/db');

// call routes here


const app = exress();
const PORT = process.env.PORT || 5000;

// sync db here
sequelize.sync({ force: false })
.then(() => {
  console.log('Database synced successfully');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

app.use(cors());
app.use(exress.json());
app.use(exress.urlencoded({ extended: true }));

// import routes here


// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});