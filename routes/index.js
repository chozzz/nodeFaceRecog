var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

// router.use(function (req, res, next) {
//   console.log(_);
//   next();
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('pages/home', {
    title: "Home",
    description: "Home",
    routeName: "home"
  });
});


/* GET facial recognition page. */
router.get('/registerFaces', function (req, res, next) {
  return res.render('pages/registerFaces', {
    title: "Register Face",
    description: "A page where you register faces to train the machine",
    routeName: "registerFaces"
  });
});

router.post('/registerFaces', function (req, res, next) {
  let body = req.body,
    doSuccess = function (message = "Face has been saved.") {
      return res.send({
        code: 200,
        status: "OK",
        message: "Face has been saved."
      });
    },
    doFail = function (message = "Failed to save face. Please try again.") {
      return res.send({
        code: 400,
        status: "Bad Request",
        message: message
      });
    };

  if (body) {
    let base64Data = body.image.replace(/^data:image\/png;base64,/, ""),
      name = body.name;

    if (name && base64Data) {
      var facesDir = path.join(_CONFIG_.facesPath, name),
        timestamp = (new Date()).getTime(),
        filepath = path.join(facesDir, name + "_" + timestamp + ".png");

      if (!fs.existsSync(facesDir)) {
        fs.mkdirSync(facesDir);
      }

      return fs.writeFile(filepath, base64Data, 'base64', function (err) {
        if (!err) {
          return doSuccess();
        }

        console.log(err);
        return doFail();
      });
    }
    else {
      return doFail();
    }
  }
  else {
    return doFail();
  }
});

module.exports = router;
