import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { generateMnemonic } from 'bip39'
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";


 function App() {
  return (
    <>
      <Mngenerator/>
      <SolanaWallet/>
      <EthWallet/>

    </>
  )
  }
 
  function Mngenerator(){
    const[mnemonic,setmnemonic]=useState("")
    return(
      <>
      <button onClick={async function() {
        const mn = await generateMnemonic();
        setmnemonic(mn)
      }}>Create seed phase</button>
      <input  value={mnemonic}></input>
      </>
    )
  }

   function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);

    return <div>
        <button onClick={function() {
            const seed = mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setPublicKeys([...publicKeys, keypair.publicKey]);
        }}>
            Add SOL wallet
        </button>
        {publicKeys.map(p => <div>
            {p.toBase58()}
        </div>)}
    </div>
}

 function EthWallet ({mnemonic}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  return (
      <div>
          <button onClick={async function() {
              const seed = await mnemonicToSeed(mnemonic);
              const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
               const hdNode = HDNodeWallet.fromSeed(seed);
               const child = hdNode.derivePath(derivationPath);
               const privateKey = child.privateKey;
               const wallet = new Wallet(privateKey);
               setCurrentIndex(currentIndex + 1);
              setAddresses([...addresses, wallet.address]);
          }}>
              Add ETH wallet
          </button>

          {addresses.map(p => <div>
              Eth - {p}
          </div>)}
      </div>
  )
}
export default App
