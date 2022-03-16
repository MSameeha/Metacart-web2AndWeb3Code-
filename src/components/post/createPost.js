/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import React, { useState, useContext } from 'react';
import { create } from 'ipfs-http-client';
import useUser from '../../hooks/use-user';
import UserContext from '../../context/user';
// import FirebaseContext from '../../context/firebase';
import { postUserPhotos } from '../../services/firebase';

const client = create('https://ipfs.infura.io:5001/api/v0');

export default function CreatePost({ setShowModal, showModal }) {
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState('');
  const [hash, sethash] = useState('');
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [basePrice, setbasePrice] = useState(0);
  // const { firebase, FieldValue } = useContext(FirebaseContext);
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

    try {
      const created = await client.add(file);
      console.log(created);
      url = `https://ipfs.io/ipfs/${created.path}`;
      sethash(created.path);
      console.log(created.path);
      console.log(url);
      console.log(hash);
      setUrlArr((prev) => [...prev, url]);
    } catch (error) {
      console.log(error.message);
    }
    const post = {
      userId: user,
      photoId: '1',
      dateCreated: Date.now(),
      caption: 'Hey, this is new final latest sameeha.2.0',
      imageSrc: url,
      price: 1,
      basePrice
    };
    postUserPhotos(user.uid, post);
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
                      aria-label="Enter your email address"
                      type="text"
                      placeholder="Enter Caption"
                      className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                    />
                    <input
                      aria-label="Enter your email address"
                      type="text"
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
