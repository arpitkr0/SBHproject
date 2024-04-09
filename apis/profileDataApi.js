const { ApifyClient } = require("apify-client");

// Initialize the ApifyClient with your Apify API token
const client = new ApifyClient({
  token: "apify_api_h29NNUUk6CBrLLr0nlOYoiAkztJTpM0WhV7j",
});

// Prepare Actor input
const input = {
  directUrls: [],
  resultsType: "details",
  resultsLimit: 200,
  searchType: "user",
  searchLimit: 1,
};

const apiResult = async () => {
  // Run the Actor and wait for it to finish
  const run = await client.actor("apify/instagram-scraper").call(input);

  // Fetch and print Actor results from the run's dataset (if any)
  //console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
  // items.forEach((item) => {
  //   console.dir(item);
  // });
};

module.exports = {
  input,
  apiResult,
};
