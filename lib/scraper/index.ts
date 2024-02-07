import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(productUrl: string) {
  // BrightData proxy config
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    //   Fetch product page
    const response = await axios.get(productUrl, options);

    const $ = cheerio.load(response.data);

    //   Extract the product info
    const title = $('#productTitle').text().trim();

    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a-spacing-top-mini span.a-price-whole')
    );

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );

    const outOfStock =
      $('#availability span').text().trim().toLowerCase() ===
      'currently unavailable';

    const images =
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}';

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($('.a-price-symbol'));
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

    const reviewsCount = $('#acrCustomerReviewLink span.acrCustomerReviewText')
      .text()
      .trim();
    const stars = $(
      '#averageCustomerReviews span.a-declarative a.a-popover-trigger.a-declarative span.a-size-base.a-color-base'
    )
      .text()
      .trim()
      .split(' ')[0];

    const category = $(
      '#wayfinding-breadcrumbs_feature_div ul.a-unordered-list.a-horizontal.a-size-small'
    )
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    const description = extractDescription($);
    // Data object with scraped information
    const data = {
      productUrl,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category,
      reviewsCount,
      stars,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}

// curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_92094949-zone-pricetrack:v2ff08zy6jki -k https://lumtest.com/myip.json
