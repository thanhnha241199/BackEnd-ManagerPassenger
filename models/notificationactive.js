var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notificationactiveSchema = new Schema(
  {
    registerID: {
      type: String,
      unique: true,
    },
    activeID: {
      type: String,
    },
    tokenID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationActive", notificationactiveSchema);
