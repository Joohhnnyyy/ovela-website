import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const BrandStatement = () => {
  return (
    <section className="bg-background text-foreground py-16 sm:py-24">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-y-10 lg:gap-x-8">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-y-4 gap-x-6">
            <h3 className="text-xl md:text-2xl font-light uppercase tracking-wider">
              Wear Quality - Embrace Uniqueness
            </h3>
            <Image
              src="https://oflyn.fr/cdn/shop/files/giftest.gif?v=1742053314"
              alt="Sewing machine and Eiffel Tower icons"
              width={140}
              height={32}
              unoptimized
              className="flex-shrink-0"
            />
          </div>

          <Link
            href="/en/pages/about"
            className="group flex w-full sm:w-auto justify-center items-center whitespace-nowrap gap-x-2 rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-muted-foreground/70 transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <ChevronRight className="h-[18px] w-[18px]" />
            <span>More about ovela</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;