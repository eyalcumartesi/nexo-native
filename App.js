import React from "react";
import { View } from "react-native";
import QRScanner from "./components/QrScanner";

const App = () => {
	return (
		<View style={{ flex: 1 }}>
			<QRScanner />
		</View>
	);
};

export default App;
