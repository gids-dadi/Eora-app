import { View, Text, Alert, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("error", "Please fill in  all the fields");
    }
    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);

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
            Register to Eora
          </Text>

          <FormField
            title="Username"
            placeholder="Enter your username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={"mt-6"}
          />

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
            onPress={handleSignup}
            containerStyles={"mt-6"}
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center items-center gap-2 mt-6">
            <Text className="text-gray-100 text-lg font-pregular">
              Have an account already?
            </Text>

            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
