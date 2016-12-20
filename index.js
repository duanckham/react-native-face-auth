import RNFetchBlob from 'react-native-fetch-blob';

class FaceAuth {
    constructor(microsoftAPIKey) {
        this.microsoftAPIKey = microsoftAPIKey;
    };

    async createPersonGroup(personGroupID, personGroupName) {
        let body = JSON.stringify({
            name: personGroupName
        });

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        try {
            let response = await RNFetchBlob.fetch('PUT', `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupID}`, headers, body);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async createPerson(personGroupID, personName) {
        let body = JSON.stringify({
            name: personName
        });

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupID}/persons`, headers, body);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async createPersonFace(personGroupID, personID, picture) {
        let body = JSON.stringify({
            name: personName
        });

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupID}/persons/${personID}/persistedFaces`, headers, body);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async detect(picture) {
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/octet-stream'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `https://api.projectoxford.ai/face/v1.0/detect`, headers, picture);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async identify(personGroupID, faceIDs) {
        let body = JSON.stringify({
            personGroupId: personGroupID,
            faceIds: faceIDs,
            maxNumOfCandidatesReturned: 1,
            confidenceThreshold: 0.5
        });

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `https://api.projectoxford.ai/face/v1.0/identify`, headers, body);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async train(personGroupID) {
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey
        };

        try {
            let response = await RNFetchBlob.fetch('PUT', `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupID}/train`, headers);
            let result = {
                status: response.respInfo.status
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async signin(personGroupID, picture) {
        try {
            let faceResponse = await this.detect(picture);

            if (faceResponse.status !== 200) {
                return faceResponse;
            }

            if (!faceResponse.data.length) {
                return new Error('NO_FACE');
            }

            let faceIDs = faceResponse.data.map(item => item.faceId);
            let identifyResponse = await this.identify(personGroupID, faceIDs);

            if (identifyResponse.status !== 200) {
                return identifyResponse;
            }

            if (identifyResponse.data.length !== 1) {
                return new Error('TOO_MUCH_FACES');
            }

            if (!identifyResponse.data[0].candidates.length) {
                return new Error('STRANGER');
            }

            return identifyResponse;
        } catch(error) {
            return error;
        }
    };

    async signup(personGroupID, personName, picture) {
        let createPersonResponse = await this.createPerson(personGroupID, personName);

        if (createPersonResponse.status !== 200) {
            return createPersonResponse;
        }

        let personID = createPersonResponse.data.personId;
        let createPersonFaceResponse = await this.createPersonFace(personGroupID, personID, picture);

        if (createPersonFaceResponse.status !== 200) {
            return createPersonFaceResponse;
        }

        // Train the persons group.
        await this.train(personGroupID);

        return {
            personID: createPersonFaceResponse.persistedFaceId,
            personName: personName
        };
    };
};

export default FaceAuth;
