import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';
import Web3 from 'web3';
import Tip from '../../abis/Tip.json';


export default function Actions({ docId, totalLikes, likedPhoto, handleFocus, basePrice, price }) {
  const {
    user: { uid: userId }
  } = useContext(UserContext);
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);
  const [currprice, setcurrprice] = useState(price);
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const [acc,setAcc] = useState(null);
  const [tipp,setTipp] = useState(null);
  const [amt,setAmt] = useState('');

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
  if(networkData) {
    const tip = new web3.eth.Contract(Tip.abi, networkData.address);
    setTipp(tip)
    const img = await tip.methods.images(docId).call()
    console.log(img);
    setAmt(img.tipAmount);
  }else{
    console.log("Contract not deployed");
  }
}

  const handleToggleLiked = async () => {
    setToggleLiked((toggleLiked) => !toggleLiked);

    setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
    setcurrprice((currprice) => (toggleLiked ? basePrice : basePrice + likes * (1 / 10000)));
    console.log(currprice);
    await firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        likes: toggleLiked ? FieldValue.arrayRemove(userId) : FieldValue.arrayUnion(userId),
        price: toggleLiked ? basePrice : basePrice + likes * (1 / 10000)
      });
    console.log(price);
    // Pass the price to another function or Component which displays the button.
    // Add price to firestore
    // await firebase.firestore.collection('photos').update({ F });
  };


  return (
    <>
      <div className="flex justify-between p-4">
        <div className="flex">
          <svg
            onClick={handleToggleLiked}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleToggleLiked();
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
              toggleLiked ? 'fill-red text-red-primary' : 'text-black-light'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {/* price details */}
          {<p className="font-bold">Price: ${currprice}</p>}
		<button onClick={async(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(docId, tipAmount)
                            const image = await tipp.methods.images(docId).call()
                            setAmt(image.tipAmount);
                            if(image.id != "") {
                              tipp.methods.tipImageOwner(docId).send({ from: acc, value: tipAmount }).on('transactionHash', (hash) => {
                                // time pass
                              })
                            }
                            else {console.log("Image doesn't exist in the Blockchain");}
                            console.log(amt);
                          }}
                        > TIP 0.1 ETH </button>
                        {/* <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(amt.toString(), 'Ether')} ETH
                        </small> */}
        </div>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold">{likes === 1 ? `${likes} like` : `${likes} likes`}</p>
      </div>
    </>
  );
}

Actions.propTypes = {
  docId: PropTypes.string.isRequired,
  totalLikes: PropTypes.number.isRequired,
  likedPhoto: PropTypes.bool.isRequired,
  handleFocus: PropTypes.func.isRequired,
  basePrice: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired
};
