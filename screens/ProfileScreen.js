import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth'; // Update import
import { getDatabase, ref, set, update, get, child } from 'firebase/database'; // Update import
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Update import

const ProfileScreen = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const navigation = useNavigation();
    const youser = getAuth().currentUser;

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }

            //fetch the current user's profile data from firebase
            const db = getDatabase();
            const userRef = ref(db, `users/${youser.uid}/profile`);
            const snapshot = await get(userRef);

            if(snapshot.exists())
            {
                const profileData = snapshot.val();
                setName(profileData.name || '');
                setBio(profileData.bio || '');

                if(profileData.photoURL)
                {
                    setImage(profileData.imageURL); //set the image to the user's profile image
                }
            }
        })();
    }, [youser]);
    // function to pick an image from the camera roll
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log("Image Picker Result:", result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            console.log("Selected Image URI:", result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };

    const saveProfile = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            // Update bio in database
            const db = getDatabase();

            // Upload image
            let imageUrl = ''; // Default image URL
            if (image)
            {
                const storage = getStorage();
                const storageRef = sRef(storage, "profileImages/" + youser.uid + ".jpg");
                const response = await fetch(image); // Fetch the image
                const blob = await response.blob(); // Convert the image to a blob
                await uploadBytes(storageRef, blob); // Upload the image to Firebase Storage
    
                imageUrl = await getDownloadURL(storageRef); // Get the image URL after uploading
                // let uniqueUsername = true;
            }
           
            const usernameRef = ref(db, 'users');
            const userRef = ref(db, `users/${user.id}/profile/`); // Reference to the user's node
            const snapshot = await get(usernameRef);
            let uniqueUser = true;
            snapshot.forEach((childsnapshot) => {
                childsnapshot.forEach((cs) => {
                    cs.forEach((mcs) => {
                        if(mcs.val() === name) {
                            uniqueUser = false;
                            return;
                        }
                    });
                });
            });
            if(!uniqueUser) {
                Alert.alert("Username already taken");
                return;
            }
            // update and set Firebase profile data
            if(name === "") { 
                throw "Username empty";
            }
            await set(userRef, {
                name,
                bio,
                imageURL: imageUrl || "https://firebasestorage.googleapis.com/v0/b/chatterbox-e329c.appspot.com/o/profileImages%2FBlank%20Profile%20Picture.jpg?alt=media&token=99e96245-0414-40c9-9345-22c9dcac5348", // Set the image URL if it exists
            });
            if(bio === "") {
                await update(userRef, {
                    bio: `Hello, my name is ${name}`
                });
            }
            if(imageUrl === null) {
                const storage = getStorage();
                const storageRef = sRef(storage, "profileImages/hawk tuah.jpg");
                // const response = await fetch(image); // Fetch the image
                // const blob = await response.blob(); // Convert the image to a blob
                // await uploadBytes(storageRef, blob); // Upload the image to Firebase Storage
                imageUrl = await getDownloadURL(storageRef);
                await update(userRef, {
                   imageUrl: imageUrl
                });
            }

            // Update Firebase Auth profile for displayName and photoURL
            await updateProfile(user, {
                displayName: name,
                photoURL: imageUrl || user.photoURL,
            });

            Alert.alert('Profile saved successfully!');
            navigation.navigate("Chat");
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error saving profile. Please try again later.');
        }
    };


    return (
        <View style={styles.container}>
            {/* Display the image */}
            {image && (
                <Image source={{ uri: image }} style={styles.previewImage} />
            )}
            {/* Input for editing name */}
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#010C80"
            />
            {/* Input for editing bio */}
            <TextInput
                style={styles.input}
                placeholder="Bio"
                multiline
                value={bio}
                onChangeText={setBio}
                placeholderTextColor="#010C80"
            />
            {/* Button to pick an image from camera roll */}
             <View style={styles.imageContainer}>
                <Button title="Pick an image from camera roll" onPress={pickImage} color="#25291C" />
            </View>
            {/* Button to save profile */}
            <Button title="Save" onPress={saveProfile} color="#25291C" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#E3E7D3',
    },
    imageContainer: {
        marginBottom: 20,
    },
    previewImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 100,
    },
    input: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: '#010C80',
    },
});

export default ProfileScreen;
