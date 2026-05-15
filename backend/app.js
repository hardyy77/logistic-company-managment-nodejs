require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Błąd połączenia z bazą:', err.message);
  } else {
    console.log('Połączono z PostgreSQL:', result.rows[0]);
  }
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moje lokalne API',
      version: '1.0.0',
      description: 'Dokumentacja API w Swagger UI',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const driversRouter = require('./routes/drivers');
const vehiclesRouter = require('./routes/vehicles');
const trailersRouter = require('./routes/trailers');
const transportOrdersRouter = require('./routes/transportOrders');
const dashboardRouter = require('./routes/dashboard');
const permissionsRouter = require('./routes/permissions');
const driverPanelRouter = require('./routes/driverPanel');

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/drivers', driversRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/trailers', trailersRouter);
app.use('/transport-orders', transportOrdersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/permissions', permissionsRouter);
app.use('/driver-panel', driverPanelRouter);

app.get('/', (req, res) => {
  res.send('API działa. Wejdź na /api-docs');
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});