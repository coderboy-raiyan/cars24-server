import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { config } from './app/config';

const server = http.createServer(app);

const PORT = config.PORT || 5000;

async function bootstrap() {
    try {
        await mongoose.connect(config.DATABASE_URL);
        console.log('DB connected successfully...');

        server.listen(PORT, () => {
            console.log('Server is listening on PORT', PORT);
        });
    } catch (error) {
        console.log(error);
    }
}

bootstrap();
