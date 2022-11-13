import React, { useEffect, useRef } from 'react'
import { SafeAreaView, Text, View, Animated, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

const LottieAnimation = () => {
  const progress = useRef(new Animated.Value(0)).current

  const handleLikeAnimation = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true
    }).start()
  }
  useEffect(() => {
    handleLikeAnimation()
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      clearInterval(interval)
    }
  }, [])

  const interval = setInterval(function () {
    // reset progress
    progress.setValue(0)

    // method to be executed;
    handleLikeAnimation()
  }, 3000)

  return (
    <SafeAreaView>
      <View style={lottieStyle.fullLottie}>
        <LottieView
          style={lottieStyle.lottie}
          progress={progress}
          source={require('../assets/animations/loader.json')}
        />
      </View>
    </SafeAreaView>
  )
}

const lottieStyle = StyleSheet.create({
  fullLottie: {
    Width: '100%',
    height: '100%',
    padding: 20
  },
  lottie: {
    // SMALL LOTTIE
    ...StyleSheet.absoluteFillObject

  }
})

export default LottieAnimation
