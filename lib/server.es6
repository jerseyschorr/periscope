
import express from 'express';
import {join}  from 'path';

const app     = express();
const router  = express.Router();
const srcpath = __dirname;
const port    = process.env.PORT || 3000;

// specifies this directory is cleared for serving static files
// app.use(express.static(path.join(__dirname, 'static')));

router.use( (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.get('/', (req, res) => {
  res.sendFile(join(srcpath, '../views/index.html'));
});

router.get('/humans.txt', (req, res) => {
  res.sendFile(join(srcpath, '../views/humans.txt'));
});

router.get('/js/periscope.coffee', (req, res) => {
  res.sendFile(join(srcpath, '../lib/periscope.coffee'));
});

// router.get('/config/appconfig.coffee', (req, res) => {
//   res.sendFile(join(srcpath, '../config/appconfig.coffee'));
// });


router.get(/^[/](css|js|img)[/]/, (req, res) => {
  res.sendFile(join(srcpath, '../static', req.url));
});


app.use('/', router);

app.use('*', (req, res) => {
  res.sendFile(join(srcpath, '404.html'));
});

app.listen(port, () => {
  console.log('Live at Port 3000');
});

