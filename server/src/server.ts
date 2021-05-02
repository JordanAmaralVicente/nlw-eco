import express, { json } from 'express';

const app = express();
app.use(express.json());

app.get('/users', (req, res) => {
    console.log('HTTP_GET: /users');
    // request.query é quando vem como um parametro opcional
    // http://locahost:3001/users?search=pedro
    const search = req.query.search;                        
});

app.get('/users/:id', (req, res) => {
    const users = ['user_1', 'user_2', 'user_3'];
    const id = parseInt(req.params.id);

    res.send(users[id]);
});

app.post('/users', (req,res) => {
    const data = req.body;
    res.json(data);
});

app.listen(3001);