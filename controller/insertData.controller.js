const bcrypt = require("bcrypt");
const db = require("../../server/src/models/index");
const datas = require("../../data/data");
const HomeCategory = require("../../data/category_tree.json");
const banner = require("../../data/banner.json");
const batch_list = require("../../data/batch_list.json");
const search_suggestion = require("../../data/search_suggestion.json");
const notify = require("../../data/notify.json");
const flash_sale = require("../../data/flashSale/flash_sale.json");
const shopMall = require("../../data/shopMall.json");
const formatDate = require("../utils/formatDate");
require("dotenv").config();

const InsertControllers = {
  Industries: async (req, res) => {
    try {
      for (let index = 1; index < 15; index++) {
        const global_cats = require(`../../data/cate/cate_${index}.json`).data
          .global_cats;
        await Promise.all(global_cats.map((item, i) => insertIndustry(item)));
      }
    } catch (error) {
      console.log("loi server");
    }
  },

  FlashSale: async (req, res) => {
    try {
      await insertFlashSale();
    } catch (error) {
      console.log("loi server");
    }
  },

  Insert: async (req, res) => {
    try {
      const promises = datas?.items.map(async (item) => {
        await Promise.all([
          insertPost(item),
          insertAttributes(item),
          insertTierVariations(item),
          insertDescription(item),
          insertOverview(item),
          insertCategory(item),
          insertVoucherInfo(item),
          insertVideoInfoList(item),
          insertDeepDiscountSkin(item),
        ]);
      });
      await Promise.all(promises);
      return "done..";
    } catch (error) {
      throw error;
    }
  },

  App: async (req, res) =>
    new Promise(async (resolve, reject) => {
      try {
        await insertHomeCategory();
        await insertBanner();
        await insertShopMall();
        await insertSearchSuggestion();
        await insertNotify();
        await insertBatchList();
      } catch (error) {
        reject(error);
      }
    }),

  Comment: async (req, res) => {
    try {
      for (let index = 0; index < 100; index++) {
        const ratings = require(`../../data/ratings/rating_${index}.json`).data
          ?.ratings;
        ratings.forEach(async (item, i) => {
          new Promise(async (resolve, reject) => {
            console.log(index, i);
            try {
              await insertComment(item);
              await insertItemRatingReply(item);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    } catch (error) {
      console.log("loi server");
    }
  },

  Post: async (req, res) => {
    try {
      for (let index = 0; index < 150; index++) {
        const hotItems = require(`../../data/post/hot_items_${index}.json`).data
          .items;
        await hotItems.forEach(async (item, i) => {
          new Promise(async (resolve, reject) => {
            try {
              await insertOverview(item);
              await insertPost(item);
              await insertTierVariations(item);
              await insertVideoInfoList(item);
              await insertVoucherInfo(item);
              await insertDeepDiscountSkin(item);
              console.log(item?.itemid, index, i);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    } catch (error) {
      console.log("loi server");
    }
  },

  Shop: async (req, res) => {
    try {
      for (let index = 0; index < 100; index++) {
        const item = require(`../../data/shopDetail/shopDetail_${index}.json`);
        new Promise(async (resolve, reject) => {
          try {
            await insertShop(item);
            await insertUser(item);
          } catch (error) {
            reject(error);
          }
        });
      }
    } catch (error) {
      console.log("loi server");
    }
  },
};
module.exports = InsertControllers;

const insertPost = async (item) => {
  await db.Post.findOrCreate({
    where: {
      itemid: item?.itemid,
    },
    defaults: {
      itemid: item?.itemid,
      shopid: item?.shopid,
      currency: item?.currency,
      stock: item?.stock,
      status: item?.status,
      sold: item?.sold,
      liked_count: item?.liked_count,
      catid: item?.catid,
      cmt_count: item?.cmt_count,
      discount: item?.discount,
      raw_discount: item?.raw_discount,
      size_chart:
        item?.size_chart === "undefined"
          ? null
          : `https://cf.shopee.vn/file/${item?.size_chart}`,
      shop_name: item?.shop_name,
      transparent_background_image:
        item?.transparent_background_image === ""
          ? null
          : `https://cf.shopee.vn/file/${item?.transparent_background_image}`,
      images: JSON.stringify(
        item?.images.map((item) => {
          return `https://cf.shopee.vn/file/${item}`;
        })
      ),
      view_count: item?.view_count ? item?.view_count : 0,
      name: item?.name,
      image:
        item?.image === "" ? null : `https://cf.shopee.vn/file/${item?.image}`,
      historical_sold: item?.historical_sold,
      price: +item?.price / 100000,
      price_min: +item?.price_min / 100000,
      price_max: +item?.price_max / 100000,
      price_min_before_discount:
        ((+item.price_min / 100) * (100 - item?.raw_discount)) / 100000,
      price_max_before_discount:
        ((item.price_max / 100) * (100 - item?.raw_discount)) / 100000,
      shop_rating: item?.shop_rating,
      liked: item?.liked ? true : false,
      is_official_shop: item?.is_official_shop,
      is_service_by_shopee: item?.is_service_by_shopee,
      show_free_shipping: item?.show_free_shipping,
      is_deep_discount_skin:
        item?.deep_discount_skin?.skin_data?.promo_label?.promotion_price !==
        "",
      is_video: typeof item?.video_info_list[0]?.video_id !== "undefined",
      is_voucher: typeof item?.voucher_info?.promotion_id !== "undefined",
      is_attributes: typeof item?.attributes?.[0].name !== "undefined",
      ctime: formatDate(item?.ctime),
      createdAt: formatDate(item?.ctime),
    },
  });
};

const insertDescription = async (item) => {
  await db.Description.findOrCreate({
    where: { itemid: item?.itemid },
    defaults: {
      itemid: item?.itemid,
      description: item?.description,
    },
  });
};

const insertOverview = async (item) => {
  await db.Overview.findOrCreate({
    where: { itemid: item?.itemid },
    defaults: {
      itemid: item?.itemid,
      shopid: item?.shopid,
      catid: item?.catid,
      name: item?.name,
      image:
        item?.image === "" ? null : `https://cf.shopee.vn/file/${item?.image}`,
      stock: item?.stock,
      historical_sold: item?.historical_sold,
      price: +item?.price / 100000,
      price_min: +item?.price_min / 100000,
      price_max: +item?.price_max / 100000,
      price_min_before_discount:
        ((+item.price_min / 100) * (100 - item?.raw_discount)) / 100000,
      price_max_before_discount:
        ((item.price_max / 100) * (100 - item?.raw_discount)) / 100000,
      discount: item?.discount,
      shop_rating: item?.shop_rating,
      shop_name: item?.shop_name,
      liked: item?.liked ? true : false,
      is_official_shop: item?.is_official_shop,
      is_service_by_shopee: item?.is_service_by_shopee,
      show_free_shipping: item?.show_free_shipping,
      ctime: formatDate(item?.ctime),
      createdAt: formatDate(item?.ctime),
    },
  });
};

const insertTierVariations = async (item) => {
  if (item?.tier_variations[0]?.name !== "") {
    item?.tier_variations?.map(async (ele) => {
      await db.TierVariation.findOrCreate({
        where: { itemid: item.itemid },
        defaults: {
          itemid: item.itemid,
          name: ele?.name,
          option: JSON.stringify(ele?.options),
          images:
            ele?.images === null
              ? null
              : JSON.stringify(
                  ele?.images?.map((item) => {
                    return `https://cf.shopee.vn/file/${item}`;
                  })
                ),
        },
      });
    });
  }
};

const insertAttributes = async (item) => {
  console.log(item?.attributes?.images);
  if (typeof item?.attributes?.[0].name !== "undefined") {
    await db.Attribute.findOrCreate({
      where: { itemid: item.itemid },
      defaults: {
        name: JSON.stringify(item?.attributes?.map((item) => item?.name)),
        value: JSON.stringify(item?.attributes?.map((item) => item?.value)),
      },
    });
  }
};

const insertCategory = async (item) => {
  await db.Category.findOrCreate({
    where: { itemid: item?.itemid },
    defaults: {
      itemid: item?.itemid,
      display_name: JSON.stringify(
        item?.categories?.map((ele) => ele?.display_name)
      ),
      catid: JSON.stringify(item?.categories?.map((ele) => ele?.catid)),
    },
  });
};

const insertVoucherInfo = async (item) => {
  if (typeof item?.voucher_info?.promotion_id !== "undefined") {
    await db.VoucherProduct.findOrCreate({
      where: { itemid: item?.itemid },
      defaults: {
        itemid: item?.itemid,
        promotion_id: item?.voucher_info?.promotion_id,
        voucher_code: item?.voucher_info?.voucher_code,
        label: item?.voucher_info?.voucher_code,
      },
    });
  }
};

const insertVideoInfoList = async (item) => {
  if (typeof item?.video_info_list[0]?.video_id !== "undefined") {
    await db.Video.findOrCreate({
      where: { itemid: item?.itemid },
      defaults: {
        itemid: item?.itemid,
        video_id: item?.video_info_list[0]?.video_id,
        thumb_url: item?.video_info_list[0]?.thumb_url,
        duration: item?.video_info_list[0]?.duration,
        version: item?.video_info_list[0]?.version,
        defn: item?.video_info_list[0]?.default_format?.defn,
        profile: item?.video_info_list[0]?.default_format?.profile,
        url: item?.video_info_list[0]?.default_format?.url,
        width: item?.video_info_list[0]?.default_format?.width,
        height: item?.video_info_list[0]?.default_format?.height,
      },
    });
  }
};

const insertDeepDiscountSkin = async (item) => {
  if (
    item?.deep_discount_skin?.skin_data?.promo_label?.promotion_price !== ""
  ) {
    await db.DeepDiscountSkin.findOrCreate({
      where: { itemid: item?.itemid },
      defaults: {
        itemid: item?.itemid,
        promotion_price:
          item?.deep_discount_skin?.skin_data?.promo_label?.promotion_price,
        hidden_promotion_price:
          item?.deep_discount_skin?.skin_data?.promo_label
            ?.hidden_promotion_price,
        start_time: formatDate(
          item?.deep_discount_skin?.skin_data?.promo_label?.start_time
        ),
        end_time: formatDate(
          item?.deep_discount_skin?.skin_data?.promo_label?.end_time
        ),
      },
    });
  }
};

const insertBatchList = async () => {
  batch_list?.data?.banners[1]?.banners?.map(async (item) => {
    await db.BatchList.create({
      banner_image: item?.banner_image,
      title: JSON.parse(item.navigate_params.navbar.title).default,
      end: formatDate(item?.end),
      start: formatDate(item?.start),
    });
  });
};

const insertNotify = async () => {
  notify?.map(async (item) => {
    await db.Notification.create({
      userid: item?.userid,
      seen: item?.seen,
      image: item?.image,
      title: item?.title,
      content: item?.content,
      time: item?.time,
    });
  });
};

const insertSearchSuggestion = async () => {
  search_suggestion?.map(async (item) => {
    await db.SearchSuggestion.create({
      text: item?.text,
      count: item?.count,
    });
  });
};

const insertShopMall = async () => {
  shopMall?.data?.shops?.map(async (item) => {
    await db.ShopMall.findOrCreate({
      where: { shopid: item?.shopid },
      defaults: {
        url: item?.url,
        image: `https://cf.shopee.vn/file/dec6ad9d361464deee14f9bec977d29f/${item?.image}`,
        shopid: item?.shopid,
        promo_text: item?.promo_text,
      },
    });
  });
};

const insertBanner = async () => {
  banner?.data?.space_banners[0]?.banners.map(async (item) => {
    await db.Banner.create({
      image_url: `https://cf.shopee.vn/file/${item?.image_url}`,
    });
  });
};

const insertHomeCategory = async () => {
  HomeCategory.data.category_list.map(async (item) => {
    await db.HomeCategory.create({
      catid: item?.catid,
      parent_catid: item?.parent_catid,
      name: item?.name,
      display_name: item?.display_name,
      image: `https://cf.shopee.vn/file/${item?.image}`,
      unselected_image: `https://cf.shopee.vn/file/${item?.unselected_image}`,
      selected_image: `https://cf.shopee.vn/file/${item?.selected_image}`,
      level: item?.level,
    });
    item?.children?.map(async (ele) => {
      await db.HomeCategory.create({
        catid: ele?.catid,
        parent_catid: ele?.parent_catid,
        name: ele?.name,
        display_name: ele?.display_name,
        image: `https://cf.shopee.vn/file/${ele?.image}`,
        unselected_image: ele?.unselected_image,
        selected_image: ele?.selected_image,
        level: ele?.level,
      });
    });
  });
};

const insertFlashSale = async () => {
  flash_sale.data.items?.forEach(async (item) => {
    await db.FlashSale.findOrCreate({
      where: { itemid: item?.itemid },
      defaults: {
        itemid: item?.itemid,
        shopid: item?.shopid,
        catid: item?.catid,
        name: item?.name,
        image:
          item?.image === ""
            ? null
            : `https://cf.shopee.vn/file/${item?.image}`,
        stock: item?.stock,
        historical_sold: item?.historical_sold,
        price: +item?.price / 100000,
        price_min: +item?.price_min / 100000,
        price_max: +item?.price_max / 100000,
        price_min_before_discount:
          ((+item.price_min / 100) * (100 - item?.raw_discount)) / 100000,
        price_max_before_discount:
          ((item.price_max / 100) * (100 - item?.raw_discount)) / 100000,
        discount: item?.discount,
        shop_rating: item?.shop_rating,
        liked: item?.liked ? true : false,
        is_official_shop: item?.is_official_shop,
        is_service_by_shopee: item?.is_service_by_shopee,
        show_free_shipping: item?.show_free_shipping,
        start_time: formatDate(item?.start_time),
        end_time: formatDate(item?.end_time),
      },
    });
  });
};

const insertComment = async (item) => {
  await db.Comment.findOrCreate({
    where: { cmtid: item?.cmtid },
    defaults: {
      orderid: item?.orderid,
      itemid: item?.itemid,
      cmtid: item?.cmtid,
      rating: item?.rating,
      userid: item?.userid,
      shopid: item?.shopid,
      comment: item?.comment,
      rating_star: item?.rating_star,
      status: item?.status,
      author_username: item?.author_username
        ? item?.author_username
        : "người ẩn danh",
      author_portrait:
        item?.author_portrait === ""
          ? null
          : `https://cf.shopee.vn/file/${item?.author_portrait}`,
      images:
        item?.images?.length > 0
          ? JSON.stringify(
              item?.images?.map((item) => {
                return `https://cf.shopee.vn/file/${item}`;
              })
            )
          : null,
      cover: item?.videos?.length >= 0 ? item?.videos[0]?.cover : null,
      videos: item?.videos?.length >= 0 ? item?.videos[0]?.url : null,
      model_name: item?.product_items[0].model_name,
      options:
        item?.product_items[0]?.options?.length > 0
          ? item?.product_items[0]?.options[0]
          : null,
      like_count: item?.like_count ? item?.like_count : 0,
      liked: false,
      mtime: formatDate(item?.mtime),
      ctime: formatDate(item?.ctime),
      createdAt: formatDate(item?.mtime),
    },
  });
};

const insertItemRatingReply = async (item) => {
  if (typeof item.ItemRatingReply?.orderid !== "undefined") {
    await db.CommentReply.findOrCreate({
      where: { cmtid: item?.cmtid },
      defaults: {
        orderid: item?.orderid,
        itemid: item?.itemid,
        shopid: item?.shopid,

        userid: item?.ItemRatingReply?.userid,
        comment: item?.ItemRatingReply?.comment,
        mtime: formatDate(item?.ItemRatingReply?.mtime),
        ctime: formatDate(item?.ItemRatingReply?.ctime),
        createdAt: formatDate(item?.ItemRatingReply?.mtime),
      },
    });
  }
};

const insertUser = async (item) => {
  console.log(`${item?.data?.account?.username}${item?.data?.userid}`);
  const hashPassWord = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  var sex = 0;
  var img_men =
    "https://imgs.search.brave.com/NMbKJRcDath4I02VHl0t8tYf4UJSAmftuegWj3ZCbYs/rs:fit:640:403:1/g:ce/aHR0cDovL3d3dy5i/aXRyZWJlbHMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDEx/LzA0L0ZhY2Vib29r/LU5ldy1EZWZhdWx0/LUF2YXRhci1QaWN0/dXJlLTcuanBn";
  var img_women =
    "https://imgs.search.brave.com/GgQ8DyHg0f1QxTAoZOmh4fYbylAOXHK903G1j_P_EaE/rs:fit:640:403:1/g:ce/aHR0cDovL3d3dy5i/aXRyZWJlbHMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDEx/LzA0L0ZhY2Vib29r/LU5ldy1EZWZhdWx0/LUF2YXRhci1QaWN0/dXJlLTQuanBn";
  await db.User.findOrCreate({
    where: { userid: item?.data?.userid },
    defaults: {
      userid: item?.data?.userid,
      shopid: item?.data?.shopid,
      name: item?.data?.account?.username,
      email: `admin${item?.data?.userid}@gmail.com`,
      sex: sex,
      role: "shop_Admin",
      avatar: sex === 0 ? img_men : img_women,
      address: item?.data?.shop_location,
      phone: 0,
      birthday: "",
      password: hashPassWord(
        `${item?.data?.account?.username}${item?.data?.userid}`
      ),
    },
  });
};

const insertShop = async (item) => {
  await db.Shop.findOrCreate({
    where: { shopid: item?.data?.shopid },
    defaults: {
      shopid: item?.data?.shopid,
      userid: item?.data?.userid,
      place: item?.data?.shop_location,
      portrait:
        item?.data?.account?.portrait === ""
          ? null
          : `https://cf.shopee.vn/file/${item?.data?.account?.portrait}`,
      username: item?.data?.account?.username,
      is_official_shop: item?.data?.is_official_shop,
      shop_location: item?.data?.shop_location,
      item_count: item?.data?.item_count,
      name: item?.data?.name,
      cover: item?.data?.cover,
      rating_star: item?.data?.rating_star,
      rating_bad: item?.data?.rating_bad,
      rating_good: item?.data?.rating_good,
      rating_normal: item?.data?.rating_normal,
      follower_count: item?.data?.follower_count,
      status: item?.data?.status,
      response_time: item?.data?.response_time,
      description: item?.data?.description,
      followed: false,
      ctime: formatDate(item?.data?.ctime),
      mtime: formatDate(item?.data?.mtime),
      response_rate: item?.data?.response_rate,
      country: item?.data?.country,
      last_active_time: item?.data?.last_active_time,
      createdAt: formatDate(item?.data?.ctime),
    },
  });
};

const insertIndustry = async (item) => {
  await db.Industry.create({
    category_name: item?.category_name,
    display_name: item.path[0].category_name,
    images: JSON.stringify(item?.images),
    path_category_name: JSON.stringify(
      item?.path?.map((ele) => ele?.category_name)
    ),
    path_category_id: JSON.stringify(
      item?.path?.map((ele) => ele?.category_id)
    ),
    catid: item?.path[0].category_id,
  });
};
