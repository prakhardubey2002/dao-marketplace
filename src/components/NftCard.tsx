import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactNode } from 'react';
import { Nft } from '../types';
import Button, { ButtonSize, ButtonType } from './Button';
import { DarkblockBadge } from './DarkblockBadge';

interface NftCardProps {
  nft: Nft;
}

export function NftCard({ nft }: NftCardProps): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <div className="overflow-clip rounded-lg text-white shadow-lg transition hover:scale-[1.02]">
      <img
        src={nft.image}
        alt={`Nft image for ${nft.mintAddress}`}
        className="object-cover w-full aspect-square"
      />
      <div className="p-4">
        <div className="flex flex-row items-center justify-start h-6 gap-2 mb-4 text-white">
          {nft.collection && (
            <img
              src={nft.collection?.nft?.image}
              alt={`Collection NFT image ${nft.collection?.nft.mintAddress}`}
              className="object-cover w-6 rounded-sm aspect-square"
            />
          )}
          <span className="truncate">{nft.name}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-lg">56.90 SOL</span>
          <Button type={ButtonType.Primary} size={ButtonSize.Small}>
            {t('buy')}
          </Button>
        </div>
        {
          nft.isDarkblocked && (
            <DarkblockBadge />
          )
        }
      </div>
    </div>
  );
}

export interface NftCardSkeletonProps {
  className?: string;
  key?: any;
}

function NftCardSkeleton({ className }: NftCardSkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse overflow-clip rounded-lg text-white shadow-lg transition',
        className
      )}
    >
      <div className="object-cover w-full bg-gray-800 aspect-square" />
      <div className="p-4">
        <div className="flex flex-row items-center justify-start gap-2 mb-4 text-white">
          <div className="object-cover w-6 bg-gray-800 rounded-sm aspect-square" />
          <span className="w-20 h-4 truncate bg-gray-800 rounded-md" />
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="w-16 h-6 bg-gray-800 rounded-md" />
          <div className="w-16 h-8 bg-gray-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}

NftCard.Skeleton = NftCardSkeleton;
