const crawlController = require("../controller/crawls.controller");
const InsertControllers = require("../controller/insertData.controller");
const express = require("express");
const router = express.Router();

const initRoutes = (app) => {
  //crawl
  router.get("/api/crawl/categoryTree", crawlController.CategoryTree);
  router.get("/api/crawl/homeCategory", crawlController.HomeCategory);
  router.get("/api/crawl/flashSale", crawlController.FlashSale);
  router.get("/api/crawl/hotItems", crawlController.HotItems);
  router.get("/api/crawl/api/crawl/itemDetail", crawlController.ItemDetail);
  router.get("/api/crawl/ratings", crawlController.Ratings);
  router.get("/api/crawl/shopInfo", crawlController.ShopInfo);
  router.get("/shopDetail", crawlController.ShopDetail);
  router.get("/api/crawl/getItem", crawlController.GetItem);
  router.get("/api/crawl/getallcate", crawlController.CATE);
  router.get("/api/crawl/shopMall", crawlController.SHOPMALL);
  //insert
  router.post("/api/insert/insert", InsertControllers.Insert);
  router.post("/api/insert/app", InsertControllers.App);
  router.post("/api/insert/comment", InsertControllers.Comment);
  router.post("/api/insert/post", InsertControllers.Post);
  router.post("/api/insert/shop", InsertControllers.Shop);
  router.post("/api/insert/industry", InsertControllers.Industries);
  router.post("/api/insert/flashSale", InsertControllers.FlashSale);

  // nếu không lọt vào các routes trên thì sẽ lọt vào routes này

  return app.use("/", (req, res) => {
    res.send("server on...");
  });
};

module.exports = initRoutes;
