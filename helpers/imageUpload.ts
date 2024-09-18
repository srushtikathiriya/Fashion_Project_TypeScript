import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/src')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace(" ","_"));
    }
  });

export const upload = multer({
    storage: storage
});