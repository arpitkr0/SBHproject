const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    details: {
      type: Object,
      required: true,
    },
    result: {
      type: String,
    },
  },
  { timestamps: true }
);

const urlModel = mongoose.model("url", urlSchema);

module.exports = urlModel;
