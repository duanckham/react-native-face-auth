# react-native-face-auth

Installation
---

```
npm i react-native-face-auth
```

Usage
---

**Step 1**

Go to [https://www.azure.cn/cognitive-services/en-us/face-api](https://www.azure.cn/cognitive-services/en-us/face-api) and signup an accnout.

Get the API_KEY.


**Step 2**

Create a person group.

```
import FaceAuth from 'react-native-face-auth';
...

let faceAuth = new FaceAuth(API_KEY);
...

let createPersonGroupResponse = await faceAuth.createPersonGroup(personGroupID, personGroupName);
```

**Step 3**

Signin.

```
import FaceAuth from 'react-native-face-auth';
...

let faceAuth = new FaceAuth(API_KEY);
...

let signinResponse = await faceAuth.signin(personGroupID, facePictureBase64Data);

// If signin fail will return an `Error` object.
if (signinResponse.stack && signinResponse.message === 'STRANGER') {
    // Signup or other operation.
} else {
    // Get the userID and name.
}
```

**Step 4**

Signup.

```
import FaceAuth from 'react-native-face-auth';
...

let faceAuth = new FaceAuth(API_KEY);
...

let signupResponse = await faceAuth.signup(personGroupID, personName, facePictureBase64Data);
```
