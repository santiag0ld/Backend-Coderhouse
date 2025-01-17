import { program } from "./config/commander.js";
import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { createServer } from "node:http";
import { serverIo } from "./middleware/serverIO.js";
import { connectDB, sessionAtlas } from "./config/config.js";
import appRouter from './routes/index.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import passportConfig from "./config/passport.config.js";
import { configObject } from "./config/config.js";
import { generateMockProducts } from './helpers/mocking-module.js';
import { logger, addLogger } from './utils/logger.js';


const port = 8080;
const app = express();

const { mode } = program.opts();
logger.info(`Mode config: ${mode}`);

const server = createServer(app);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const swaggerOptions = {
  definition:{
    openapi:'3.0.1',
    info:{
      title:"Documentacion",
      description:"API Swagger"
    }
  },
  apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs',swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser(configObject.cookies_code))
app.use(addLogger);

const publicPath = path.join(path.dirname(new URL(import.meta.url).pathname), './src/public');
app.use(express.static(publicPath));

serverIo(server);
connectDB();

app.engine('.hbs', exphbs({
  defaultLayout:'main',
  extname:'.hbs'
}));
app.set("view engine", ".hbs");
app.set('views','./src/views');

app.get('/mockingproducts', (req, res) => {
  try {
    const products = generateMockProducts(100);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate mock products' });
  }
});

sessionAtlas(app);
passportConfig(app);

app.use(appRouter);

server.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
