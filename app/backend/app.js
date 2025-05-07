import express from 'express';
import cors from 'cors';
import authRouter from './app/routes/auth.routes.js';
import addressRouter from './app/routes/address.routes.js';
import categoryRouter from './app/routes/category.routes.js';
import permissionTypeRouter from './app/routes/permissionType.routes.js';
import productRouter from './app/routes/product.routes.js';
import roleRouter from './app/routes/role.routes.js';
import userRouter from './app/routes/user.routes.js';
import orderRouter from './app/routes/order.routes.js';
import creditCardRouter from './app/routes/creditCard.routes.js';
import billRouter from './app/routes/bill.routes.js';
import notificationRouter from './app/routes/notification.routes.js';
import storeSettingsRouter from './app/routes/storeSettings.routes.js';
import staticRouter from './app/routes/static.routes.js';
import reportRouter from './app/routes/report.routes.js';
import verifyJWT from './app/middlewares/verifyJWT.js';

const app = express();

app.use(express.json());
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

const api = '/api';

app.use(`${api}/static`, staticRouter);

app.use(`${api}/auth`, authRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/product`, productRouter);
app.use(`${api}/store-settings`, storeSettingsRouter);
// the user needs to be login
app.use(verifyJWT);
app.use(`${api}/order`, orderRouter);
app.use(`${api}/bill`, billRouter);
app.use(`${api}/credit-card`, creditCardRouter);
app.use(`${api}/notification`, notificationRouter);
app.use(`${api}/address`, addressRouter);
app.use(`${api}/permission-type`, permissionTypeRouter);
app.use(`${api}/role`, roleRouter);
app.use(`${api}/user`, userRouter);

app.use(`${api}/report`, reportRouter);


app.all('api/*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

export default app;