const exress = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error-handler');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/db');

// call routes here
const authRoutes = require('./routes/auth-routes/auth-routes');
const userRoutes = require('./routes/user-routes/user-routes')

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
app.use(morgan('dev'));

// import routes here
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// error handler middleware
app.use(errorHandler)

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});