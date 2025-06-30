import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, Redirect, router } from "expo-router";
import "./global.css";

import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

export default function App() {
  const { loading, isLoggedIn } = useGlobalContext();

  // if (!loading && isLoggedIn) {
  //   return <Redirect to="/home" />;
  // }(
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/home");
    }
  },[loading, isLoggedIn, router])



  return (
    <SafeAreaView className="bg-primary flex-1 h-full">
      <ScrollView contentContainerStyle={{ height: "80%" }}>
        <View className="min-h-[80vh] h-full w-full justify-center gap-4 items-center px-4">
            <Image
              source={images.logo}
              className="mx-auto min-w-full w-[100px] h-[8%]"
              resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full max-h-[298px]"
            resizeMode="contain"
          />

          <View className="mt-5 w-[90%]">
            <Text className="relative  text-center text-white font-bold text-3xl">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Eora</Text>
          
            </Text>
              <Image
              source={images.path}
              className="absolute -right-8 -bottom-2 max-w-[200px] max-h-[14px]"
              resizeMode="contain"
            />

          </View>
          <Text className="text-sm font-p-regular text-gray-100 text-center mt-7">
            Where creativity meets innovation: Embark on a journey of limitless
            exploration with Eora.{" "}
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => {
              router.push("/sign-in");
            }}

            
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
