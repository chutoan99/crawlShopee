require("dotenv").config();
const URL = {
  SHOP_INFO: (shopid) =>
    `${process.env.BASE_URl}/product/get_shop_info?shopid=${shopid}`,
  FLASH_SALE: `${process.env.BASE_URl}/flash_sale/flash_sale_get_items?limit=300&need_personalize=true&offset=0&order_mode=1&sort_soldout=true&with_dp_items=true`,
  CATEGORY_TREE: `${process.env.BASE_URl}/pages/get_category_tree`,
  HOME_CATEGORY_LISTS: `${process.env.BASE_URl}/pages/get_homepage_category_list`,
  SHOP_DETAIL: (userName) =>
    `${process.env.BASE_URl}/shop/get_shop_detail?&username=${userName}&fbclid=IwAR0c-vICsNCDIzP12vPlW3uUEANt-kua6ocxXcnFmdeNODcVDdU36B8uDxc`,

  HOT_SALE_ITEM: (itemId, limit) =>
    `${process.env.BASE_URl}/pdp/get_hot_sales?item_id=${itemId}&limit=${limit}`,
  ADDRESS: `${process.env.BASE_URl}/account/address/get_user_address_list?with_warehouse_whitelist_status=true&fbclid=IwAR2Z1-TavpaxnrbXSrohETKsTVSTXdd5wnrwG_IkASL3Hoh25htNddBIKqI`,
  RATING: (itemId, shopid) =>
    `${process.env.BASE_URl_v2}/item/get_ratings?filter=0&flag=1&itemid=${itemId}&shopid=${shopid}`,
  ITEM_DETAIL: (itemId, shopid) =>
    `${process.env.BASE_URl}/item/get?itemid=21255564928&shopid=38003654`,
  GET_ITEMS: (collectionId) =>
    `  https://shopee.vn/api/v4/collection/get_items?collection_id=${collectionId}&limit=150&show_collection_info=true&source=1`,
  GET_CATE: (page, limit) =>
    `https://banhang.shopee.vn/help/api/v3/global_category/list/?page=${page}&size=${limit}`,
  GET_SHOP_MAll: "https://shopee.vn/api/v4/homepage/mall_shops?limit=100",
};
// https://shopee.vn/api/v4/microsite/get_page_configuration?url=gi-cung-re-freeship&platform=pc&version=2022.08.v4

// https://shopee.vn/api/v4/order/get_all_order_and_checkout_list
// https://shopee.vn/api/v4/official_shop/get_shops?category_id=11036101&limit=23&offset=0
//banhang.shopee.vn/help/api/v3/global_category/list/?page=1&size=16&SPC_CDS=b3fd01b6-7dc8-407a-98c8-5ecac7e79894&SPC_CDS_VER=2};

https: module.exports = URL;
