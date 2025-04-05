import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, Redirect, router } from "expo-router";
import "./global.css";

import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className=" flex w-full justify-center items-center  px-4   ">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px] "
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full max-h-[298px]"
            resizeMode="contain"
          />

          <View className="relative t-5">
            <Text className="text-center text-white font-bold text-3xl">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Eora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[120px] h-[15px] absolute -top-4 -right-8"
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
