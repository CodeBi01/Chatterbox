import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    const navigation = useNavigation();

    const handleRegister = () => {
        if (password === confirmPassword) {
            console.log("Passwords match:", password);
            const user = {
                name: name,
                email: email,
                password: password,
                image: image
            }
            // send POST to backend 
            axios.post("http://localhost:8000/register", user).then((response) => {
                console.log(response);
                Alert.alert(
                    "Registration successful",
                    "You have been registered"
                );
                setName("");
                setEmail("");
                setPassword("")
                setConfirmPassword("")
                setImage("");
            }).catch((error) => {
                Alert.alert(
                    "Registration Error"
                )
                console.log("Registration failed", error)
            })
        } else {
            Alert.alert("Passwords do not match. Please try again.");
            setPassword(""); 
            setConfirmPassword("");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#010C80", padding: 10, alignItems: "center" }}>
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
                        <Text style={{ color: "#F8FAFC", fontSize: 17, fontWeight: "600" }}>Register</Text>
                    </View>

                    <View style={{ marginTop: 50 }}>
                        <View>
                            <Text style={{ color: "gray", fontSize: 18, fontWeight: "600" }}>Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={(text) => setName(text)}
                                style={{
                                    fontSize: name ? 18 : 18,
                                    color: "#FFFFFF",
                                    borderBottomColor: "#F8FAFC", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#F8FAFC"}
                                placeholder='Enter name' />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "gray", fontSize: 18, fontWeight: "600" }}>Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                style={{
                                    fontSize: email ? 18 : 18,
                                    color: "#FFFFFF", // Set text color to white
                                    borderBottomColor: "#F8FAFC", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#F8FAFC"}
                                placeholder='Enter email address ' />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "gray", fontSize: 18, fontWeight: "600" }}>Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                                style={{
                                    fontSize: password ? 18 : 18,
                                    color: "#FFFFFF",
                                    borderBottomColor: "#F8FAFC", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#F8FAFC"}
                                placeholder='Enter password' />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "gray", fontSize: 18, fontWeight: "600" }}>Confirm Password</Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                                secureTextEntry={true}
                                style={{
                                    fontSize: confirmPassword ? 18 : 18,
                                    color: "#FFFFFF",
                                    borderBottomColor: "#F8FAFC", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#F8FAFC"}
                                placeholder='Confirm password' />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={{ color: "gray", fontSize: 18, fontWeight: "600" }}>Profile Picture</Text>
                            <TextInput
                                value={image}
                                onChangeText={(text) => setImage(text)}
                                style={{
                                    fontSize: confirmPassword ? 18 : 18,
                                    color: "#FFFFFF",
                                    borderBottomColor: "#F8FAFC", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#F8FAFC"}
                                placeholder='Upload Image' />
                        </View>
                    </View>

                    <Pressable onPress={handleRegister} style={{
                        width: 200,
                        backgroundColor: "#F8FAFC",
                        padding: 15,
                        marginTop: 50,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 6
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Register</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Home")} style={{ marginTop: 15 }}>
                        <Text style={{ textAlign: "center", color: '#F8FAFC' }}>Already have an account? Sign In</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default RegisterScreen;

const styles = StyleSheet.create({});