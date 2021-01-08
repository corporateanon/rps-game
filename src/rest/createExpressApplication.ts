import express, { Application } from 'express';
import session from 'express-session';
import { join } from 'path';

export function createExpressAcpplication(): Application {
    const app = express();
    app.set('json spaces', 2);
    app.use(express.static(join(__dirname, '../../client/dist')));
    app.use(
        session({
            secret           : '9857698459745687',
            cookie           : { maxAge: 60000 },
            resave           : false,
            saveUninitialized: true,
        })
    );
    app.listen(process.env.PORT ?? 3000);
    return app;
}
