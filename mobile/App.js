import React, { useState } from "react";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import DiscoverScreen from "./src/screens/DiscoverScreen";

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [profile, setProfile] = useState(null);

  if (screen === "welcome") {
    return <WelcomeScreen onStart={() => setScreen("profile")} />;
  }

  if (screen === "profile") {
    return (
      <ProfileScreen
        onCreateProfile={(newProfile) => {
          setProfile(newProfile);
          setScreen("discover");
        }}
      />
    );
  }

  return <DiscoverScreen profile={profile} />;
}