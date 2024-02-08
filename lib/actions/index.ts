'use server';

import { revalidatePath } from 'next/cache';
import Product from '../models/product.model';
import { connectToDB } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    connectToDB();
    // Scrape data
    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    let product = scrapedProduct;

    // Save data
    const productExist = await Product.findOne({
      url: scrapedProduct.productUrl,
    });

    if (productExist) {
      const updatedPriceHistory: any = [
        ...productExist.priceHistor,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapedProduct.productUrl,
      },
      product,
      { upsert: true, new: true }
    );
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
  } catch (error) {
    console.log(error);
  }
}
