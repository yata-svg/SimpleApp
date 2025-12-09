// Arquivo: App.js (CÓDIGO FINAL COM CORREÇÃO DE TEXTO PEQUENO)

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Modal, 
  Platform, 
  Linking, 
} from 'react-native';

import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { APP_CONFIG, LINK_BUTTONS } from './config';

const Icon = require('@expo/vector-icons').FontAwesome5;

// -----------------------------------------------------
// COMPONENTE NAVEGADOR IN-APP 
// -----------------------------------------------------
const InAppBrowser = ({ visible, url, title, onClose }) => {
  const [loading, setLoading] = useState(true);
  const firstLoadComplete = useRef(false);

  useEffect(() => {
    if (visible) {
        setLoading(true);
        firstLoadComplete.current = false;
    }
  }, [visible, url]);

  const customUserAgent = Platform.OS === 'android' 
    ? "Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
    : "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.browserContainer}> 
        <View style={styles.browserHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="times" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.browserTitle} numberOfLines={1}>{title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <WebView
          source={{ uri: url }}
          style={styles.webview}
          userAgent={customUserAgent}

          onLoadStart={() => {
            if (!firstLoadComplete.current) {
                setLoading(true);
            }
          }}
          
          onLoadEnd={() => {
            setLoading(false);
            firstLoadComplete.current = true;
          }}
          
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false} 
          allowsInlineMediaPlayback={true}
          mixedContentMode="always"
          
          onShouldStartLoadWithRequest={(request) => {
            return true;
          }}
        />

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingContainerWeb}> 
            <ActivityIndicator size="large" color="#5A1F78" />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

// -----------------------------------------------------
// COMPONENTE BOTÃO (GRID)
// -----------------------------------------------------
const GridButton = ({ title, url, icon, onPress }) => {
    const windowWidth = Dimensions.get('window').width;
    const buttonSize = windowWidth * 0.28; 

    return (
        <TouchableOpacity
            style={[styles.button, { width: buttonSize, height: buttonSize }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Icon name={icon} size={buttonSize * 0.35} color={APP_CONFIG.buttonTextColor} />
            </View>
            <Text 
                style={styles.buttonText} 
                numberOfLines={2}
                adjustsFontSizeToFit={true} 
                minimumFontScale={0.8}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

// -----------------------------------------------------
// APP PRINCIPAL
// -----------------------------------------------------
export default function App() {
  
  const { width, height } = Dimensions.get('window');
  const [isReady, setIsReady] = useState(false); 
  const [browserVisible, setBrowserVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  // Splash Inicial (1.5s)
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true); 
    }, 1500); 
  }, []); 

  const handleOpenLink = (url, title, key) => {
    const openInExternalBrowser = ['simplelab', 'mais'];
    
    if (openInExternalBrowser.includes(key)) {
      Linking.openURL(url);
    } else {
      setCurrentUrl(url);
      setCurrentTitle(title);
      setBrowserVisible(true);
    }
  };

  const handleCloseBrowser = () => {
    setBrowserVisible(false);
    setCurrentUrl('');
    setCurrentTitle('');
  };

  // TELA DE SPLASH
  if (!isReady) {
    return (
        <ImageBackground
            source={APP_CONFIG.backgroundImageSource}
            style={styles.mainView}
            resizeMode="cover"
        >
            <StatusBar barStyle={APP_CONFIG.statusBarColor} />
            <View style={styles.splashContainer}>
                <Image
                    source={APP_CONFIG.logoUrl}
                    style={[styles.logoSplash, { width: width * 1 }]}
                    resizeMode="contain"
                />
                <ActivityIndicator size="large" color="#ffffff" style={styles.splashIndicator} />
                <Text style={styles.splashText}>Carregando...</Text>
            </View>
        </ImageBackground>
    );
  }

  // TELA PRINCIPAL
  return (
    <ImageBackground
      source={APP_CONFIG.backgroundImageSource}
      style={styles.mainView}
      resizeMode="cover"
    >
      <StatusBar barStyle={APP_CONFIG.statusBarColor} />

      <View style={[styles.container, { height: height }]}>
        <View style={styles.topSection}>
            <Image
                source={APP_CONFIG.logoUrl}
                style={[styles.logo, { width: width * 1 }]}
                resizeMode="contain"
            />
        </View>

        <View style={styles.gridContainer}>
          {LINK_BUTTONS.map((button) => (
            <GridButton
              key={button.key}
              title={button.title}
              url={button.url}
              icon={button.icon}
              onPress={() => handleOpenLink(button.url, button.title, button.key)}
            />
          ))}
        </View>
      </View>

      <InAppBrowser
        visible={browserVisible}
        url={currentUrl}
        title={currentTitle}
        onClose={handleCloseBrowser}
      />
    </ImageBackground>
  );
}

// -----------------------------------------------------
// ESTILOS
// -----------------------------------------------------
const styles = StyleSheet.create({
  mainView: { flex: 1, width: '100%', height: '100%', },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', },
  logoSplash: { height: 300, marginBottom: 50, },
  splashIndicator: { marginTop: 20, },
  splashText: { color: '#ffffff', marginTop: 10, fontSize: 18, fontWeight: 'bold', },
  
  container: { paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 20, paddingHorizontal: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1, },
  topSection: { alignItems: 'center', width: '100%', flex: 1, justifyContent: 'center', },
  logo: { height: 250, marginBottom: 0, },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', width: '95%', alignSelf: 'center', paddingBottom: 20, },
  button: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 20, marginBottom: 15, marginHorizontal: 3, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4, },
  iconContainer: { marginBottom: 8, },
  buttonText: { 
    fontSize: 9, // 👈 CORRIGIDO PARA TAMANHO BASE MENOR
    fontWeight: '700', 
    textAlign: 'center', 
    color: '#5A1F78', 
    width: '95%', // Permitir quase 100% da largura do botão para o texto
    paddingHorizontal: 2 // Pequeno padding para o texto não encostar na borda
  },
  
  browserContainer: { flex: 1, backgroundColor: '#fff', },
  browserHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#F9485C', borderBottomWidth: 0, },
  closeButton: { padding: 8, width: 40, alignItems: 'center', },
  browserTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff', flex: 1, textAlign: 'center', letterSpacing: 0.5, },
  webview: { flex: 1, },
  loadingContainerWeb: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', },
});