import { View, Text, Alert, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { signIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert("error", "Please fill in  all the fields");
    }
    setIsSubmitting(true);

    try {
      const result = await signIn(form.email, form.password);

      // Set global State using context

      router.replace("/home");
    } catch (error) {
      Alert.alert("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className=" bg-primary h-full">
      <ScrollView>
        <View className=" w-full  justify-center min-h-[80vh] px-4 my-6">
          <Image
            source={images.logo}
            className="w-[110px] h-[35px] mx-auto"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl text font-semibold font-psemibold">
            Log in to Eora
          </Text>

          <FormField
            title="Email"
            placeholder="Enter your email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={"mt-6"}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={"mt-6"}
          />

          <CustomButton
            title="Sign in"
            onPress={handleSignIn}
            containerStyles={"mt-6"}
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center items-center gap-2 mt-6">
            <Text className="text-gray-100 text-lg font-pregular">
              Don't have an account?
            </Text>

            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
