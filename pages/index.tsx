import type { NextPage } from 'next';
import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { getReleases } from '../lib/GetReleases';
import { getArtistETH } from '../lib/GetArtistETH';
import NFTCard from '../components/NFTCard';

const Home: NextPage = () => {
  const [NFTs, setNFTs] = useState<any[]>([]);
  const [sum, setSum] = useState(0);
  const address = "arama.eth";

  useEffect(() => {
    async function loadData() {
      let nfts = await getArtistETH(address)
      if (nfts && nfts.length > 0) {
        let sorted = nfts.sort((a,b) => b.data.totalSupply - a.data.totalSupply);
        let total = nfts.reduce((acc, curr) => acc + curr.data.totalSupply, 0);
        setNFTs(sorted);
        setSum(total);
        console.log(nfts);
        
      }
    }
    loadData();
    
  }, []);

  return <>
    <div className={`${styles.container} min-h-screen`}>
      {/* set metadata; reminder to also clear out the Burble images from public/images */}
      <Head>
        <title>Arama.eth Decent Drops</title>
        <meta
          name="description"
          content='Custom mint site for Arama.eth'
        />
        <link rel="icon" href="/images/decent-icon.png" />
      </Head>

      <main className='pt-20 sm:pt-32'>
        <div className='px-12 pb-8 text-lg'>
          <h1 className='w-full pb-4 text-3xl sm:text-5xl'>Arama.eth Releases</h1>

        </div>
        <div className='flex flex-wrap justify-center gap-12 pt-8'>
          {NFTs.map((nft, i) => {
            return (
              <div key={i} className='relative'>
                <NFTCard
                  contractAddress={nft.address}
                  chainId={nft.chainId}
                  creator={nft.creator?.ensName || `${nft.creator?.address.slice(0, 6)}...${nft.creator?.address.slice(38, 42)}`}
                  image={nft.metadata?.image}
                  name={nft.data.name}
                  mintCount={nft.data.totalSupply}
                  type={nft.type}
                  tokenPrice={nft.data.tokenPrice}
                  mimeType={nft.mimeType}
                  animationUrl={nft.metadata?.animation_url}
                />
                <p className="absolute text-2xl font-bold text-white top-4 left-4">{i+1}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
    <footer className='flex items-center justify-center py-4 mt-8 text-white bg-black'>
    <p className='pr-2 tracking-widest text-sm font-[400]'>Powered by </p>
    <Link href="http://decent.xyz/" className='pt-1'>
        <Image src='/images/decent.png' height={12} width={85} alt='Decent 💪' />
      </Link>
    </footer>
  </>;
};

export default Home;