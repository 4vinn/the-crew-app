import React, {  useRef, useState } from "react";
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

import {PaperClipOutlined} from '@ant-design/icons';


firebase.initializeApp({
  apiKey: "AIzaSyC1z-xpSy3Snax28Z6iGljWDhjy9QRk0_8",
  authDomain: "the-crew-is-here.firebaseapp.com",
  projectId: "the-crew-is-here",
  storageBucket: "the-crew-is-here.appspot.com",
  messagingSenderId: "899577876669",
  appId: "1:899577876669:web:0adbcb393c775cef0367d4",
  measurementId: "G-573EFJC762"
})

const auth= firebase.auth();
const firestore= firebase.firestore();




function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header >
        <h1>TheCREW.</h1>
        <SignOut/>
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>

    </div>
  );
}

function SignIn(){
  const signInWithGoogle=()=> {
    const provider= new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <>
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(20);
  

  const [messages] = useCollectionData(query, { idField: 'id' });
 
  const [formValue, setFormValue] = useState('');
  

 
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    
    await messagesRef.add({
      name: firebase.auth().currentUser.displayName,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      
    })
    //clears the text after sending messgae
    setFormValue('');
    
    //auto scroll
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type..." />
      
      <label htmlFor="upload-button" class="picUpload">
        <PaperClipOutlined className="picture-icon"/>
      </label>
      <input 
       type="file"
       multiple={false}
       id="upload-button"
       style={{display:'none'}}
       >
       </input>
      
      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}
function ChatMessage(props) {
 
  
  const { text, uid, photoURL,name} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  

  return (<>
    <div className={`message ${messageClass}`}>
      
      <img src={photoURL || ' https://c.tenor.com/_PirfTYr7EkAAAAd/laugh-homelander.gif'} />
      <div class="box">
        <p class="msgText">{text }</p>
        <p class="name">{name}</p> 
      </div>
    
    </div>
  </>)
}



export default App;




//make a time stamp
//share image
//active users
//Themes

//1--many words in a sentence, then it automatically writes the next word in next line
//2-one word in a sentecnce- so same line- qwwwwwwwwwwwwwwwwwwwwwwwwww( and this will enable a scrollbar)

//profilepicLinks-
//1)https://c.tenor.com/_PirfTYr7EkAAAAd/laugh-homelander.gif
//2)https://c.tenor.com/wIxFiobxxbIAAAAd/john-jonah-jameson-lol.gif
//3)https://c.tenor.com/MCn_GMSSqAsAAAAd/lol-laughing-hysterically.gif
//4)https://c.tenor.com/7Pc9PS6wCoQAAAAd/homelander-the-boys.gif
//5)https://c.tenor.com/059YAzD6cXMAAAAd/billy-butcher-hahaha.gif
//6)https://c.tenor.com/AgteukZ4JK0AAAAd/the-boys-butcher.gif

