// const express = require('express');
// const { google } = require('googleapis');
// const cors = require('cors'); // Import the cors package

// const OAuth2 = google.auth.OAuth2;
// const session = require('express-session');
// const fs = require('fs');
// const multer = require('multer');


// const app = express();
// app.use(cors({ origin: 'http://localhost:3000' })); // Adjust with your actual frontend URL

// const PORT =  5000;

// const CLIENT_ID =  '537433594191-5cf0dbtmkk1t81o0trkhi91rlt8u1fql.apps.googleusercontent.com';
// const CLIENT_SECRET = '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';
// const REDIRECT_URL = 'http://localhost:5000/oauth2callback';
// const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
// const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// app.use(session({
//   secret: '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',
//   resave: true,
//   saveUninitialized: true
// }));

// const upload = multer({ dest: 'uploads/' });

// app.get('/', (req, res) => {
//   // Check if user is authenticated, otherwise redirect to /authorize
//   if (!req.session.credentials) {
//     res.redirect('/authorize');
//     return;
//   }
//   const youtube = google.youtube({
//     version: 'v3',
//     auth: oauth2Client
//   });

//   res.redirect('http://localhost:3000/upload');




// });




// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// // Route for initiating user authorization
// app.get('/authorize', (req, res) => {
//   console.log('/authorize')
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });

//   console.log('/69')

//   res.json({ authUrl }); // Send the authUrl to the frontend
// });

// // OAuth callback route
// app.get('/oauth2callback', async (req, res) => {
//   console.log('OAuth2 Callback triggered');
//   try {
//     const { tokens } = await oauth2Client.getToken(req.query.code);
//     req.session.credentials = tokens;
//     console.log(tokens)
//     res.redirect('');
//   } catch (error) {
//     console.error('OAuth2 Callback Error:', error);
//     res.status(500).send('OAuth2 Callback Error');
//   }
// });


// app.post('/upload', upload.single('video'), (req, res) => {
//     console.log("reached here")
//     console.log(req.session.credentials)
//     // Check if user is authenticated, otherwise redirect to /authorize
//     if (!req.session.credentials) {
//       res.redirect('/authorize');
//       return;
//     }
    
//     // Create an authenticated YouTube API client
//     const youtube = google.youtube({
//       version: 'v3',
//       auth: oauth2Client
//     });
//     console.log('reachedHere')
//     // Prepare video metadata
//     const videoMetadata = {
//       snippet: {
//         title: 'Uploaded Video Title',
//         description: 'Video Description',
//         tags: ['tag1', 'tag2'],
//         categoryId: '22' // Check the valid category ID in the documentation
//       },
//       status: {
//         privacyStatus: 'private' // Set to 'public', 'private', or 'unlisted'
//       }
//     };
    
//     // Upload video using youtube.videos.insert method
//     youtube.videos.insert(
//       {
//         part: 'snippet,status',
//         requestBody: videoMetadata,
//         media: {
//           body: fs.createReadStream(req.file.path)
//         }
//       },
//       (err, response) => {
//         if (err) {
//           console.error('Error uploading video:', err);
//           // Handle error
//           return;
//         }
        
//         // Video uploaded successfully, redirect to dashboard or display success message
//         // For example: res.send('Video uploaded successfully');
        
//         // Clean up uploaded file
//         fs.unlinkSync(req.file.path);
//       }
//     );
//   });
  



const app = require('express')();
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust with your frontend URL
  methods: ['GET', 'POST'],
  credentials: true, // Set this if you're using cookies or sessions
};

app.use(cors(corsOptions));


const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const session = require('express-session');
app.use(session({

  secret : 'mysecretkey',
  resave : false,
  saveUninitialized : true


}))




passport.use(new GoogleStrategy({
  clientID : '537433594191-j9gfubrmpdl78unardrom51jbskkt1h9.apps.googleusercontent.com',
  clientSecret :'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',
  callbackURL : 'http://localhost:5000/auth/google/callback'
},

function(accessToken, refreshToken, profile, done){
  console.log(profile);
  return done(null, profile)
}
));

passport.serializeUser(function(user, done){

  done(null, user)

})

passport.deserializeUser(function(user, done){

  done(null, user)

})

app.use(passport.initialize());
app.use(passport.session());






app.get('/auth/google',

  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/youtube.upload'] }),
  function(){

    console.log('1')

  }
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to a success page or send a response
    console.log('2')

    res.redirect('/');
  }
)

app.get('/', (req, res) =>{
  res.send("Hello");
})




const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});