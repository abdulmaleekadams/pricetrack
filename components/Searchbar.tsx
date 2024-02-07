'use client';

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);

    const hostname = parsedURL.hostname;

    // Check if hostname contains amazon.*
    if (
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.includes('amazon')
    ) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchQuery);

    if (!isValidLink) return alert('Please provide a valid Amazon link');

    try {
      setIsLoading(true);

      // scrape the product page
      const product = await scrapeAndStoreProduct(searchQuery);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Enter product link'
        className='searchbar-input'
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      <button type='submit' className='searchbar-btn' disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default Searchbar;
