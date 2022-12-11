import { DecentSDK, edition } from "@decent.xyz/sdk";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useState } from "react";
import handleTxError from "../lib/handleTxError";
import NumberTicker from "./NumberTicker";
import OpenSeaButton from "./OpenSeaButton";

const MintButton = (props:any) => {
  const { data:signer } = useSigner();
  const [isMinting, setIsMinting] = useState(false);

  const onSigning = (isMinting:boolean) => {
    setIsMinting(isMinting || false);
  };

  const onSuccess = (receipt:any) => {
    if (receipt) setIsMinting(false);
  };

  const onSuccessfulMint = async (receipt:any) => {
    onSuccess?.(receipt);
    toast.success("Minted successfully. Please fill out form below to receive your physical goods!");
  }

  const mint = async () => {
    if (signer) {
      try {
        onSigning?.(true);
        const sdk = new DecentSDK(props.chainId, signer);
        const price:number = props.price * props.quantity;
        const nftOne = await edition.getContract(sdk, props.contractAddress);
        const tx = await nftOne.mint(props.quantity, { value: ethers.utils.parseEther(price.toString()) });
        const receipt = await tx.wait();
        await onSuccessfulMint(receipt);
      } catch (error) {
        handleTxError(error);
        onSigning?.(false);
      }
    } else {
      toast.error("Please connect wallet to continue.");
    }
  }

  return <div className="flex gap-4 py-2 items-center">
    <button className="bg-white hover:bg-opacity-80 hover:drop-shadow-md text-indigo-700 px-5 py-1 rounded-full font-[500] w-full" onClick={mint}>{isMinting ? "..." : "Mint"}</button>
    <NumberTicker quantity={props.quantity} setQuantity={props.setQuantity} />
    <OpenSeaButton openseaLink={props.openseaLink} />
    </div>;
};

export default MintButton;