import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import './tasks/cronTasks';
import axios from 'axios';
const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser
// app.use(cors());
app.use(cors({
  origin: "*", // Use specific origin in production for security (e.g., "http://localhost:3000")
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);

// app.get("/api/football/teams", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.football-data.org/v4/competitions/PL/teams",
//       {
//         headers: {
//           "X-Auth-Token": "8ed2a374d95c46a797a5ac55e7b37b6d"
//         }
//       }
//     );
//     res.json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching data" });
//   }
// });


//live response
app.get('/', (req: Request, res: Response) => {
  const date = new Date(Date.now());
  res.send(
    `<h1 style="text-align:center; color:#173616; font-family:Verdana;">Beep-beep! The server is alive and kicking.</h1>
    <p style="text-align:center; color:#173616; font-family:Verdana;">${date}</p>
    `,
  );
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
