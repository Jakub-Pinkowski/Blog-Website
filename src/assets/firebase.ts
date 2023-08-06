import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: 'AIzaSyCzsl4D6rcQWJ07bDnNVtBdq6Lz9O0ngfw',
    authDomain: 'travel-blog-9cc00.firebaseapp.com',
    databaseURL:
        'https://travel-blog-9cc00-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'travel-blog-9cc00',
    storageBucket: 'travel-blog-9cc00.appspot.com',
    messagingSenderId: '84120951936',
    appId: '1:84120951936:web:d3f805cc005e44b8f71a65',
}

const firebaseApp = initializeApp(firebaseConfig)
const database = getDatabase(firebaseApp)

export { firebaseApp, database }
