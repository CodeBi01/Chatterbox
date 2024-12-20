import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import { getDatabase, ref, push, get, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDyiBg7M418a5F0VW7uHLzpTtO2fou7g6U",
  authDomain: "chatterbox-e329c.firebaseapp.com",
  projectId: "chatterbox-e329c",
  storageBucket: "chatterbox-e329c.appspot.com",
  messagingSenderId: "293387970762",
  appId: "1:293387970762:web:4ac39d1559141bb28e6c33"
};

initializeApp(firebaseConfig);

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigation = useNavigation();

    const db = getDatabase();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        try {
            let uniqueUser = true;
            const usernameRef = ref(db, 'users');
            const snapshot = await get(usernameRef);
            snapshot.forEach((childsnapshot) => {
                childsnapshot.forEach((cs) => {
                    cs.forEach((mcs) => {
                        if(mcs.val() === username) {
                            uniqueUser = false;
                            Alert.alert('Error', "Username taken");
                            throw "Username Taken";
                        }
                    });
                });
            });
        }
        catch(error) {
            console.error(error);
            return;
        }

        createUserWithEmailAndPassword(getAuth(), email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const usersRef = ref(db, 'users');
                push(usersRef, { email, profile: { 
                    name: username, 
                    bio: `Hello, my name is ${username}`,
                    imageURL: "https://firebasestorage.googleapis.com/v0/b/chatterbox-e329c.appspot.com/o/profileImages%2FBlank%20Profile%20Picture.jpg?alt=media&token=99e96245-0414-40c9-9345-22c9dcac5348"
                 }});
                navigation.navigate("Chat");
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', 'Failed to register. Please try again.');
            });
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#E3E7D3", padding: 10, alignItems: "center" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <KeyboardAvoidingView style={{ alignItems: "center" }}>
                    <Image
                        source={require('../img/png/logo-no-background.png')}
                        style={{ width: 200, height: 200, resizeMode: "contain" }}
                    />
                    <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#25291C", fontSize: 17, fontWeight: "600" }}>Register</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "#25291C", fontSize: 18, fontWeight: "600" }}>Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                style={{
                                    fontSize: email ? 18 : 18,
                                    color: "#25291C",
                                    borderBottomColor: "#25291C", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#25291C"}
                                placeholder='Enter email address ' />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "#25291C", fontSize: 18, fontWeight: "600" }}>Username</Text>
                            <TextInput
                                value={username}
                                onChangeText={(text) => setUsername(text)}
                                style={{
                                    fontSize: username ? 18 : 18,
                                    color: "#25291C",
                                    borderBottomColor: "#25291C", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#25291C"}
                                placeholder='Enter username ' />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "#25291C", fontSize: 18, fontWeight: "600" }}>Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                                style={{
                                    fontSize: password ? 18 : 18,
                                    color: "#25291C",
                                    borderBottomColor: "#25291C", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#25291C"}
                                placeholder='Enter password' />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "#25291C", fontSize: 18, fontWeight: "600" }}>Confirm Password</Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                                secureTextEntry={true}
                                style={{
                                    fontSize: confirmPassword ? 18 : 18,
                                    color: "#25291C",
                                    borderBottomColor: "#25291C", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#25291C"}
                                placeholder='Confirm password' />
                        </View>
                    </View>

                    <Pressable onPress={handleRegister} style={{
                        width: 200,
                        backgroundColor: "#25291C",
                        padding: 15,
                        marginTop: 50,
                        borderRadius: 6
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#E3E7D3" }}>Register</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Home")} style={{ marginTop: 15 }}>
                        <Text style={{ textAlign: "center", color: '#25291C' }}>Already have an account? Sign In</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default RegisterScreen;

const styles = StyleSheet.create({});
