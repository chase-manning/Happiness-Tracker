import React from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import CreateMood from "./overlays/CreateMood";
import Header from "../components/shared/Header";
import Login from "./shared/Login";
import GlobalStyles from "../styles/GlobalStyles";
import { useSelector } from "react-redux";
import PushNotificationSetup from "./shared/PushNotifications";
import LoadingScreen from "./shared/LoadingScreen";
import Alerts from "./shared/Alerts";
import Premium from "./shared/Premium";
import Error from "./shared/Error";
import Welcome from "./shared/Welcome";
import { selectActiveTab, Tab } from "../state/navigationSlice";
import MoodDateSearch from "./shared/MoodDateSearch";
import Passcode from "./shared/Passcode";
import Review from "./shared/Review";

const StyledApp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

type ContentContainerProps = {
  tabbedPage: boolean;
};

const ContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: ${(props: ContentContainerProps) =>
    props.tabbedPage ? "113px 0 60px 0" : "82px 0 60px 0"};
  background-color: var(--bg);
`;

const App = () => {
  const activeTab = useSelector(selectActiveTab);

  return (
    <StyledApp>
      <PushNotificationSetup />
      <GlobalStyles />
      <ContentContainer tabbedPage={activeTab === Tab.Entries}>
        <Tabs />
        <Header />
        <NavBar />
      </ContentContainer>
      <Review />
      <Login />
      <MoodDateSearch />
      <CreateMood />
      <Alerts />
      <Premium />
      <Error />
      <LoadingScreen />
      <Welcome />
      <Passcode />
    </StyledApp>
  );
};

export default App;
