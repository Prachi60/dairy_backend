import multer from "multer";

import fs from "fs";

const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

export const upload = multer({ storage });

// export const generateFileUrl = (req, res, next) => {
//   let fileUrl = null;

//   if (req.file) {
//     const filename = req.file.filename;

//     fileUrl = `/media/${filename}`;
//   }

//   req.fileUrl = fileUrl;

//   next();
// };
export const generateFileUrl = (req, res, next) => {
  let fileUrls = [];

  if (req.files && req.files.length > 0) {
    fileUrls = req.files.map((file) => {
      return `/media/${file.filename}`;
    });
  }

  req.fileUrls = fileUrls; 
  next();
};


export const uploadMultiple = multer({storage}).array("image",10);