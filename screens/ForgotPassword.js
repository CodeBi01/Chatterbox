import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, sendPasswordResetEmail } from '@firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleForgotPassword = () => {
        setLoading(true); // Show loading indicator
        sendPasswordResetEmail(getAuth(), email)
            .then(() => {
                Alert.alert('Password Reset Email Sent', 'Check your email to reset your password.', [
                    { text: 'OK', onPress: () => navigation.navigate("Home") }
                ]);
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Error', 'Failed to send reset password email.');
            })
            .finally(() => {
                setLoading(false); // Hide loading indicator
            });
    }

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
                    <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#F8FAFC", fontSize: 17, fontWeight: "600" }}>Password</Text>
                        <Text style={{ color: "#F8FAFC", fontSize: 17, fontWeight: "600", marginTop: 15 }}>Reset password to account</Text>
                    </View>

                    <View style={{ marginTop: 50 }}>
                        <View>
                            <Text style={{ color: "gray", fontSize: 18, fontWeight: "600" }}>Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                style={{
                                    fontSize: email ? 18 : 18,
                                    color: "#FFFFFF",
                                    borderBottomColor: "#F8FAFC", borderBottomWidth: 1, marginVertical: 10, width: 300
                                }}
                                placeholderTextColor={"#F8FAFC"}
                                placeholder='Enter email address' />
                        </View>
                    </View>

                    <Pressable onPress={handleForgotPassword} style={{
                        width: 200,
                        backgroundColor: "#F8FAFC",
                        padding: 15,
                        marginTop: 50,
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 6
                    }}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#010C80" />
                        ) : (
                            <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Reset Password</Text>
                        )}
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Home")} style={{ marginTop: 15 }}>
                        <Text style={{ textAlign: "center", color: '#F8FAFC' }}>Return to Login Page</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default ForgotPassword;

const styles = StyleSheet.create({});
