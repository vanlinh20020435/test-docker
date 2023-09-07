import React, { useState, useEffect } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    TouchableOpacity
} from 'react-native'

import { AuthContext } from '../component/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';


function QrScreen({ navigation }) {
    const retrieveToken = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            return authToken;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const [qrData, setQRData] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [userStatus, setUserStatus] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState('Bấm nút để tạo mã QR')


    retrieveToken().then((storedToken) => {
        if (storedToken) {
            // Use the stored token for authentication
            setToken(storedToken);
        } else {
            console.log('Hazel');
            // Token not available or retrieval failed
        }
    });

    const getUserStatus = () => {
        var myHeaders = new Headers();
        console.log(token);
        if (token) {
            myHeaders.append("Authorization", "Bearer " + token);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://10.0.3.2:3000/profile", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result.status);
                    if (result.status === 1) {
                         //generateQRCode();
                         setUserStatus(true);
                     } else {
                         setUserStatus(false);
                     }
                })
                .catch(error => console.log('error', error));
        } else {
            console.log("Error vkl");
        }

        //console.log(username);
    }


    useEffect(() => {
        const interval = setInterval(() => {
            getUserStatus();
        }, 1000);
        return () => clearInterval(interval);
    }, [token]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (generated === false) {
                generateQRCode();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [generated]); 

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    const generateQRCode = () => {
        // if (!userStatus) {
        const data = generateRandomString(10);
        console.log(data);
        setQRData(data);
        setShowQR(true);
        setMessage('Đây là mã QR của bạn');
        setGenerated(true);
        /*       } else {
                  setMessage('Không thể tạo mới QR trong phiên gửi')
              } */
    }

    console.log(userStatus);

    return (
        <View style={styles.background}>
            {
                !userStatus ? (
                    <Text>Mã QR chỉ có thể tạo khi bạn đã đặt chỗ</Text>
                ) : (
                    <TouchableOpacity style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#000', fontSize: 20 }}>{message}</Text>
                        <View style={styles.qrContainer}>

                            <QRCode value={qrData} size={250} />

                        </View>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    generatebtn: {
        position: 'absolute',
        bottom: 50,
        padding: 10,
        backgroundColor: '#2957C2',
    },
    qrContainer: {
        marginTop: 30,
        width: 300,
        height: 300,
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default QrScreen;