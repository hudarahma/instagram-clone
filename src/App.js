
import { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db , auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

      } else {
        // user has looged out
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  },[user, username])

  // useEffect --> Runs a piece of code based on a specific condition
  // runs everytime if there's a state in the dependecies with the changes 
  // if no dependencies, runs once ;


  useEffect(()=> {
    //this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time a new post is added, this code fires. shows the changes.
      setPosts(snapshot.docs.map(doc => ({ 
        id: doc.id,
        post: doc.data(),
      })));
    })
  },[]);
  
  


  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);   //close the model

  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false); //close the model
  }

  return (
    <div className="app">

      <Modal
      open={open}
      onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUp'>
            <center>
              <img 
              className='app__headerImage' 
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png' 
              alt='logo'/>
            </center>
            <Input 
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <Button onClick={signUp}>Sign Up</Button>
        
          </form>
        </div>
      </Modal>

      <Modal
      open={openSignIn}
      onClose={()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUp'>
            <center>
              <img 
              className='app__headerImage' 
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png' 
              alt='logo'/>
            </center>
            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      {/* Header */}
      <div className='app__header'>
        <img 
          className='app__headerImage' 
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png' 
          alt='logo'/>

          {user ? (

          <Button onClick={() => auth.signOut()}>LogOut</Button>
          ):(
          <div className='app__loginContainer'>
            <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>   
            <Button onClick={()=> setOpen(true)}>Sign Up</Button>   
          </div>
          )}
      </div>
     
      <div className='app__posts'>
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }

        {/* <div className='app__postsRight'>
            <InstagramImbed 
              url='https://www.instagram.com/p/CA9zK8AAF_G/'
              clientAccessToken='123|456'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />

        </div> */}
      </div>



      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}


     
      {/* Post */}
      {/* Post */}


    </div>
  );
}

export default App;
