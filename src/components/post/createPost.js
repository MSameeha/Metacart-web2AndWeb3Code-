/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import React, { useState, useContext, useEffect } from 'react';
import { create } from 'ipfs-http-client';
import firebase from 'firebase/app';
import useUser from '../../hooks/use-user';
import UserContext from '../../context/user';
// import { postUserPhotos } from '../../services/firebase';
import Web3 from 'web3';
import Minting from '../../abis/Minting.json';
import Tip from '../../abis/Tip.json';

const client = create('https://ipfs.infura.io:5001/api/v0');

export default function CreatePost({ setShowModal, showModal }) {
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState('');
  const [hash, setHash] = useState('');
  const [caption, setcaption] = useState('');
  // const [ likes, setlikes ] = useState([]);
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [basePrice, setbasePrice] = useState(0);
const [acc,setAcc] = useState(null);
  const [mintt, setMintt] = useState(null);
  const [tipp,setTipp] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [totSupply, setTotSupply] = useState(0);
  const [loading, setLoading] = useState(false);

useEffect( async() => {
    await loadWeb3();
    await loadBlockchainData();
 }, []);


 const loadWeb3 = async ()=> {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

const loadBlockchainData = async() =>{
  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts()
  setAcc(accounts[0])
  // Network ID
  const networkId = await web3.eth.net.getId()
  const networkData = Tip.networks[networkId]
  const netData = Minting.networks[networkId]
  if(networkData && netData) {
    const tip = new web3.eth.Contract(Tip.abi, networkData.address)
    const mint = new web3.eth.Contract(Minting.abi, networkData.address)
    setTipp(tip)
    setMintt(mint)
  }else{
    console.log("Contract not deployed");
  }
}

const mint = (nft) => {
  mintt.methods.mint(nft).send({ from: acc })
  .once('receipt', (receipt) => {
    setNfts( (nfts) => [...nfts, nft] );
  })
}

  const onchangeCaption = (e) => {
    setcaption(e.target.value);
  };
  const onchange = (e) => {
    setbasePrice(e.target.value);
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer.from(reader.result));
    };

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = '';
    let hashh = '';

    try {
      const created = await client.add(file);
      url = `https://ipfs.io/ipfs/${created.path}`;
      setHash(created.path);
      hashh = created.path;
      setUrlArr((prev) => [...prev, url]);
    } catch (error) {
      console.log();
    }
    const result = await firebase
      .firestore()
      .collection('photos')
      .add({
        userId: user.userId,
        imageSrc: url,
        price: 1,
        basePrice,
        dateCreated: new Date(Date.now()).toUTCString(),
        caption,
        likes: []
      })
      .then(async (docRef) => {
	      setLoading(true);
      	//mint(hash);
        console.log(hashh);
        console.log(docRef.id);
      	tipp.methods.uploadImage(hashh,docRef.id).send({ from: acc }).on('transactionHash', (hash) => {
      //	tipp.methods.images.map((img) => console.log(img));
          console.log(tipp.methods.images(docRef.id).call());
        setLoading(false);
	})
        await firebase.firestore().collection('photos').doc(docRef.id).update({
          photoId: docRef.id
        });
        await firebase
          .firestore()
          .collection('users')
          .doc(user.docId)
          .update({
            photos: firebase.firestore.FieldValue.arrayUnion(docRef.id)
          });
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  };
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/* content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">create a new post</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/* body */}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit}>
                    <input
                      aria-label="Enter your image"
                      type="file"
                      placeholder=""
                      onChange={retrieveFile}
                    />
                    <button>Upload</button>
                    <input
                      aria-label="Enter your caption"
                      type="text"
                      placeholder="Enter Caption"
                      className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                      onChange={onchangeCaption}
                    />
                    <input
                      aria-label="Enter your base value"
                      type="text"
                      required
                      placeholder="Enter base value"
                      className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                      onChange={onchange}
                    />
                  </form>
                </div>
                {/* footer */}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      // onchange();
                      setShowModal(false);
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  );
}