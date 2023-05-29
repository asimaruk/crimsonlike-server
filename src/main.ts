import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

function main() {
    app.get('/', (req: Request, res: Response) => {
        res.send('Hello, world!');
    });
    
    // Запуск сервера на порту 3000
    app.listen(port, () => {
        console.log(`Server started at port ${port}`);
    });
}

main();