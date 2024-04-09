const { input, apiResult } = require("../apis/profileDataApi");
const urlModel = require("../models/url");

const handleUrlResult = async (req, res) => {
  const { url } = req.body;

  //giving input to api#1
  input.directUrls.pop();
  input.directUrls.push(url);

  //creating input for api#2
  try {
    const items = await apiResult();
    await urlModel.create({ details: items[0] });
    return res.render("home", { message: "Success" });
  } catch (error) {
    return res.render("home", { message: "Unable to fetch details" });
  }

  //const { profilePicUrl, latestPosts } = items[0];
};

module.exports = {
  handleUrlResult,
};
