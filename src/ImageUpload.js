import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import firebase from './firebase';
import { storage, db} from './firebase';
import './ImageUpload.css';

function ImageUpload({ username }) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        console.log(url)
                        // Post image inside db
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                //     console.log('File available at', downloadURL);
                // })

                    setProgress(0);
                    setCaption('');
                    setImage(null);
                 });

            }

        )
    }
    return (
        <div className='imageupload'>
            {/* I want to have ... */}
            {/* caption input */}
            {/* file placer */}
            {/* post button */}
            <progress className='imageupload__progress' value={progress} max='100' />
            <input className='text' type='text' placeholder='Enter a caption' onChange={(event) => setCaption(event.target.value)} value={caption} />
            <input type='file' onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
