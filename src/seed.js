/* eslint-disable no-plusplus */
// We replaced the userId with apna auth ID, which we can get from our firebase.
// Don't use the seeDatabase File over again. It only was for initializing the db
export function seedDatabase(firebase) {
  const users = [
    {
      userId: 'wVomd0Dsr0WqLzLkuIBT78g6jza2', // Auth ID we got for the given mail ID, you can find it now on firestore users section
      username: 'imran',
      fullName: 'imran mirza',
      emailAddress: 'imranmirza@gmail.com',
      following: ['2'],
      followers: ['2', '3', '4'],
      dateCreated: Date.now(),
      photos: ['1', '2', '3']
    },
    {
      userId: '2',
      username: 'castiel',
      fullName: 'Castiel Sanzio Dean Urbino',
      emailAddress: 'castiel@sanzio.com',
      following: [],
      followers: ['wVomd0Dsr0WqLzLkuIBT78g6jza2'],
      dateCreated: Date.now(),
      photos: ['4']
    },
    {
      userId: '3',
      username: 'uriel',
      fullName: 'Urieldor Dalí',
      emailAddress: 'salvador@uriel.com',
      following: [],
      followers: ['wVomd0Dsr0WqLzLkuIBT78g6jza2'],
      dateCreated: Date.now(),
      photos: []
    },
    {
      userId: '4',
      username: 'Hazel',
      fullName: 'Hazel Green Lanchestar',
      emailAddress: 'hazel@green.com',
      following: [],
      followers: ['wVomd0Dsr0WqLzLkuIBT78g6jza2'],
      dateCreated: Date.now(),
      photos: []
    }
  ];

  const photos = [
    {
      // Auth ID we got for the given mail ID, you can find it now on firestore users section
      userId: 'wVomd0Dsr0WqLzLkuIBT78g6jza2',
      photoId: '1',
      dateCreated: Date.now(),
      caption: 'Hey, this imran.1',
      likes: ['2', '3'],
      imageSrc: 'https://ipfs.io/ipfs/QmUZyPkSPhFfRdHq6MjNL9obdezFQvXkfctH6ehe1587F4',
      price: 1,
      basePrice: 1
    },
    {
      userId: 'wVomd0Dsr0WqLzLkuIBT78g6jza2',
      photoId: '2',
      dateCreated: Date.now(),
      caption: 'Hey, this imran.2',
      likes: ['2', '3'],
      imageSrc: 'https://ipfs.io/ipfs/Qman9hzFgNEgTqCLS9MtKDbaUhUoUdGfDPLpVq5753byrV',
      price: 1,
      basePrice: 1
    },
    {
      userId: 'wVomd0Dsr0WqLzLkuIBT78g6jza2',
      photoId: '3',
      dateCreated: Date.now(),
      caption: 'Hey, this imran.3',
      likes: ['2', '3'],
      imageSrc: 'https://ipfs.io/ipfs/QmSM6sMdWFm17KaoopzjLBn1Tpv5YhUYzBnAawTZYD87CJ',
      price: 1,
      basePrice: 1
    },
    {
      userId: '2',
      photoId: '4',
      dateCreated: Date.now(),
      caption: 'Hey, this castiel',
      likes: ['wVomd0Dsr0WqLzLkuIBT78g6jza2', '3'],
      imageSrc: 'https://ipfs.io/ipfs/QmZpfjK814vZQD7eveTbNwLQFWudw2NRRTTxY1svH9suRJ',
      price: 1,
      basePrice: 1
    }
  ];

  for (let k = 0; k < users.length; k++) {
    firebase.firestore().collection('users').add(users[k]);
    firebase.firestore().collection('photos').add(photos[k]);
  }
}
