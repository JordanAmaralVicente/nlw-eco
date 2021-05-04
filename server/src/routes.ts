import express from 'express';
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

routes.get('/items', async (req, res) => {
    console.log('GET /items');
    const itemsController = new ItemsController();
    return itemsController.index(req, res);
});

routes.post('/points', (req, res) => {
    console.log('POST /points');
    const pointsController = new PointsController();
    return pointsController.create(req, res);
});

routes.get('/points/:id', (req, res) => {
    const point_id = req.params.id;
    console.log(`POST /points/:id - with id=${point_id}`);
    const pointsController = new PointsController();
    return pointsController.show(req, res);
});

routes.get('/points', (req, res) => {
    console.log(`GET /points`);
    const pointsController = new PointsController();
    return pointsController.index(req, res);
});

export default routes;