import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import Modal from "react-native-modal";

const QRScanner = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [scannedData, setScannedData] = useState({
		userName: "",
		restaurantId: "",
		amount: "",
	});
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [scanning, setScanning] = useState(false); // Flag to control scanning
	const [hasScanned, setHasScanned] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(status === "granted");
		})();
	}, []);

	const closeModal = () => {
		setScanning(true);
		setModalVisible(false);
		setScannedData({
			userName: "",
			restaurantId: "",
			amount: "",
		});
	};

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	const handleBarCodeScanned = ({ data }) => {
		if (!scanning) {
			try {
				const parsedData = JSON.parse(data);
				console.log("Parsed Data:", parsedData);
				const { userName, restaurantId, amount } = parsedData;
				setScannedData({
					userName,
					restaurantId,
					amount,
				});
				toggleModal();
				setScanning(true);
				setTimeout(() => {
					setScanning(false);
				}, 5000);
			} catch (error) {
				console.error("Error parsing QR code data:", error);
			}
		}
	};

	if (hasCameraPermission === null) {
		return <Text>Requesting camera permission...</Text>;
	}
	if (hasCameraPermission === false) {
		return <Text>No access to the camera.</Text>;
	}

	return (
		<View style={{ flex: 1 }}>
			<Camera style={{ flex: 1 }} onBarCodeScanned={handleBarCodeScanned} />
			<Modal isVisible={isModalVisible}>
				<View
					style={{
						padding: 20,
						backgroundColor: "white",
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<Text>Scanned QR Code Data:</Text>
					<Text>Name: {scannedData.userName}</Text>
					<Text>Restaurant ID: {scannedData.restaurantId}</Text>
					<Text>Amount: {scannedData.amount}</Text>
					<TouchableOpacity onPress={closeModal}>
						<Text>Close</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
};

export default QRScanner;
