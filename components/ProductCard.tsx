import { Product } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product._id}`} className='product-card'>
      <div>
        <Image
          width={200}
          height={200}
          src={product.image}
          alt={product.title}
          className='product-card_img'
        />
        <div className='flex flex-col gap-3 p-4'>
          <h3 className='product-title h-[3.9em] text-ellipsis overflow-hidden whitespace-normal hover:text-red-700 transition'>
            {product.title.length > 100
              ? product.title.substring(0, 100) + '...'
              : product.title}
          </h3>
          <p className='text-black opacity-50 text-[0.75rem]'>
            {product?.category}
          </p>
          <p>
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
