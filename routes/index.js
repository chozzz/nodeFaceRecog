var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
var execSync = require('child_process').execSync;

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


/* registerFaces page. */
router.get('/registerFaces', function (req, res, next) {
  return res.render('pages/registerFaces', {
    title: "Register Face",
    description: "A page where you register faces to train the machine",
    routeName: "registerFaces"
  });
});

router.post('/registerFaces', function (req, res, next) {
  let body = req.body,
    doSuccess = function (message = "Face has been saved.", data = {}) {
      return res.send({
        code: 200,
        status: "OK",
        message: message,
        data: data
      });
    },
    doFail = function (message = "Failed to save face. Please try again.", data = {}) {
      return res.send({
        code: 400,
        status: "Bad Request",
        message: message,
        data: data
      });
    };

  if (body) {
    let base64Data = body.image.replace(/^data:image\/png;base64,/, ""),
      name = body.name;

    if (name && base64Data) {
      name = name.toLowerCase();

      var timestamp = (new Date()).getTime(),
        facesDir = path.join(_CONFIG_.facesPath, "demos"),
        filepath = path.join(facesDir, name + ".png");

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



/* recognizeFace page. */
router.get('/recognizeFace', function (req, res, next) {
  return res.render("pages/recognizeFace", {
    title: "Recognize Face",
    description: "A page where you do facial recognition",
    routeName: "recognizeFace"
  });
});

router.post('/recognizeFace', function (req, res, next) {
  let body = req.body,
    doSuccess = function (message = "Successfully recognized face.", data = {}) {
      return res.send({
        code: 200,
        status: "OK",
        message: message,
        data: data
      });
    },
    doFail = function (message = "Failed to recognize face. Please try again.", data = {}) {
      return res.send({
        code: 400,
        status: "Bad Request",
        message: message,
        data: data
      });
    };

  if (body) {
    let base64Data = body.image.replace(/^data:image\/png;base64,/, "");

    if (base64Data) {
      var timestamp = (new Date()).getTime(),
        facesDir = path.join(_CONFIG_.facesPath, "demos"),
        targetFacesDir = _CONFIG_.targetFacesPath,
        targetFilepath = path.join(targetFacesDir, "target-" + timestamp + ".png");

      if (!fs.existsSync(targetFacesDir)) {
        fs.mkdirSync(targetFacesDir);
      }

      return fs.writeFile(targetFilepath, base64Data, 'base64', function (err) {
        if (!err) {
          // Success
          let tolerance = 0.5,
            cmd = `face_recognition --show-distance true --tolerance ${tolerance} ${facesDir} ${targetFilepath}`,
            output = execSync(cmd).toString().split(/\r|\n|\r\n/).filter(str => str.length),
            result = output.map(str => {
              var elems = str.split(","),
                name = !elems[1] || elems[1] == 'unknown_person' ? "No Name" : elems[1],
                distance = !elems[2] || elems[2] == 'None' ? 0 : parseFloat(elems[2]) || 0,
                isMatch = (distance || 0) < tolerance;

              return {
                name: name,
                score: (((tolerance * 2) - distance) * 100) * (1 / (tolerance * 2)),
                distance: distance,
                isMatch: isMatch,
                tolerance: tolerance
              };
            });

          return doSuccess(null, result);
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
