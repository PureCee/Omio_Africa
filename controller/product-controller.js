const product_model = require("../model/productModel");
const Validator = require("../util/validator");
const multer = require("multer");
const fs = require("fs");
const uploader = require("../util/cloudinary");
const path = require("path");
const deleteFile = require("../util/delete");
const validateDate = require("validate-date");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes("image")) {
    const error = new Error("Can't upload, only image allowed");
    error.status = 405;
    cb(error, false);
  }
  cb(null, true);
};

const upload_post_image = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image");

async function addProducts(req, res, next) {
  upload_post_image(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        const errorMsg = { message: err.message, status: 500 };
        return next(errorMsg);
      } else if (err) {
        const errorMsg = { message: err.message, status: 500 };
        return next(errorMsg);
      } else {
        const { name, price, expiry_date, description } = req.body;

        if (!name || name.trim().length < 3) {
          return next({
            message: "name of product is required",
            field: "name",
          });
        }
        if (!price) {
          return next({
            message: "price of product is required",
            field: "price",
          });
        }

        if (parseFloat(price.trim()) === NaN) {
          return next({
            message: "please enter a valid price",
            field: "price",
          });
        }
        if (!expiry_date) {
          return next({
            message: "expiry date of product is required",
            field: "expiry_date",
          });
        }
        if (
          !validateDate(
            expiry_date,
            (responseType = "boolean"),
            (dateFormat = "yyyy-mm-dd")
          )
        ) {
          return next({
            message: "expiry date is not a valid date, in form yyyy-mm-dd",
            field: "expiry_date",
          });
        }

        const image = req.file;

        const product = new product_model({
          name: name.trim(),
          price,
          expiry_date: new Date(expiry_date).toISOString(),
          description,
          owner: req.user.id,
        });
        let imageUrl;
        if (image) {
          let result = await uploader(path.resolve(image.path), "Omio");
          imageUrl = result.secure_url;
        }
        product.image = imageUrl;
        await product.save();
        if (image) {
          const paths = path.join(process.cwd(), image.path);
          deleteFile(paths);
        }
        res.status(201).json({ message: "product created" });
      }
    } catch (error) {
      if (req.file) {
        const paths = path.join(process.cwd(), req.file.path);
        deleteFile(paths);
      }
      if (error.field) {
        return next(error);
      }
      res.status(500).json({ message: error.message });
    }
  });
}

async function getAllProducts(req, res, next) {
  try {
    const { page } = req.query;
    const pageNumber = parseInt(page);
    let currentIndex;
    let query;
    let documents;
    documents = await product_model.countDocuments({
      expiry_date: { $gte: new Date(Date.now()) },
    });
    query = await product_model
      .find({ expiry_date: { $gte: new Date(Date.now()) } })
      .skip(pageNumber - 1)
      .limit(10);
    let currentNumber = (page ? page : 1) * 10;
    currentIndex = currentNumber > documents ? documents : currentNumber;
    res
      .status(200)
      .json({ posts: query, currentNumber: currentIndex, allPosts: documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//get all discounted sales, with searching and sorting by date
async function searchAndQuery(req, res, next) {
  try {
    const { page, name, date } = req.query;
    const pageNumber = parseInt(page);
    let currentIndex;
    let query;
    let documents;
    documents = await product_model.countDocuments({
      expiry_date: { $gte: new Date(Date.now()) },
    });
    console.log(new Date(date));
    query = await product_model
      .find({
        $or: [
          {
            expiry_date: { $lt: new Date(date).toISOString() },
          },
          { name: { $regex: name ? name : "" } },
        ],
      })
      .skip(pageNumber - 1)
      .limit(2);
    let currentNumber = (page ? page : 1) * 2;
    currentIndex = currentNumber > documents ? documents : currentNumber;
    res
      .status(200)
      .json({ posts: query, currentNumber: currentIndex, allPosts: documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function updateProduct(req, res) {
  const id = req.params.id;
  const product = req.body;
  product.lastUpdateAt = new Date(); // set the lastUpdateAt to the current date
  product_model
    .findByIdAndUpdate(id, product, { new: true })
    .then((newProduct) => {
      res.status(200).send(newProduct);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
}

function deleteProductByID(req, res) {
  const id = req.params.id;
  product_model
    .findByIdAndRemove(id)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
}

module.exports = {
  getAllProducts,
  addProducts,
  updateProduct,
  deleteProductByID,
  searchAndQuery,
};
