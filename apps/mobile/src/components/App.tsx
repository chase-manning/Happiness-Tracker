import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import State, { Mode, Tab, Persist } from "../models/state";
import CreateMood from "./overlays/CreateMood";
import firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import MoodService from "../services/MoodService";
import Mood, { MoodResponse } from "../models/mood";
import { StatModel } from "../models/StatModel";
import StatService from "../services/StatService";
import AchievementService from "../services/AchievementService";
import AchievementModel from "../models/AchievementModel";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { createGlobalStyle } from "styled-components";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
const { Storage } = CapacitorPlugins;

const firebaseConfig = {
  apiKey: "AIzaSyAHtDNHcNnaty3hDN9DKkRVCTLRDVeGC0w",
  authDomain: "happiness-software.firebaseapp.com",
  databaseURL: "https://happiness-software.firebaseio.com",
  projectId: "happiness-software",
  storageBucket: "happiness-software.appspot.com",
  messagingSenderId: "293873304513",
  appId: "1:293873304513:web:49a1114e1603ed6978e540",
  measurementId: "G-0KC720H0FM",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const { PushNotifications } = Plugins;

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

type GlobalSyleProps = {
  colorPrimary: string;
  mode: Mode;
};

const GlobalStyle = createGlobalStyle`
  :root {
    --main: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "black"
        : "rgba(255,255,255,0.87)"} ;
    --sub: ;
    --sub: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "#9399A9"
        : "rgba(255,255,255,0.60)"} ;
    --sub-light: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "rgba(147,154,169, 0.1)"
        : "rgba(255,255,255,0.087)"} ;
    --primary: ${(props: GlobalSyleProps) => props.colorPrimary}; 
    --primary-light: ${(props: GlobalSyleProps) => props.colorPrimary + "22"};
    --highlight: #FF6584;
    --bg: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "white"
        : "#121212"} ;
    --bg-mid: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "white"
        : "#1F1F1F"} ;
    --bg-top: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "white"
        : "#2E2E2E"} ;
    --border: ${(props: GlobalSyleProps) =>
      props.mode === Mode.Default || props.mode === Mode.Light
        ? "rgba(0,0,0,0.1)"
        : "none"} ;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
  }
`;

const StyledApp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: var(--bg-top);
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: solid 1px var(--border);
`;

const ContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 60px 0;
  background-color: var(--bg);
`;

const OverlayContainer = styled.div`
  background-color: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default class App extends Component {
  state: State;
  unregisterAuthObserver: any;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  async componentDidMount() {
    let ret: { value: any } = await Storage.get({ key: "state" });
    if (ret.value) {
      let state: Persist = JSON.parse(ret.value);
      this.setState({ persist: { ...state } });
    }

    firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({ persist: { ...this.state.persist, user: user } });
      this.hardUpdate();
    });

    if (!this.state.persist.user) {
      firebase
        .auth()
        .signInAnonymously()
        .then((meow: any) => {
          console.log("memqmqm");
          console.log(meow);
        })
        .catch(function(error) {
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        PushNotifications.register();
      } else {
        console.log("Push Notification Permission Failed");
        // alert("Error");
      }
    });

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        // alert("Push registration success, token: " + token.value);
      }
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      // alert("Error on registration: " + JSON.stringify(error));
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        // alert("Push received: " + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        // alert("Push action performed: " + JSON.stringify(notification));
      }
    );
  }

  render() {
    return (
      <StyledApp data-testid="App">
        <GlobalStyle
          colorPrimary={this.state.persist.colorPrimary}
          mode={this.state.persist.mode}
        />
        {!!this.state.persist.user && (
          <ContentContainer>
            <Tabs
              achivements={this.state.persist.achievements}
              stats={this.state.persist.stats}
              moods={this.state.persist.moods}
              user={this.state.persist.user!}
              activeTab={this.state.activeTab}
              login={() => this.setState({ loggingIn: true })}
              removeMood={(mood: Mood) => this.removeMood(mood)}
              colorPrimary={this.state.persist.colorPrimary}
              setColorPrimary={(colorPrimary: string) => {
                this.setState({
                  persist: {
                    ...this.state.persist,
                    colorPrimary: colorPrimary,
                  },
                });
                this.saveState();
              }}
              mode={this.state.persist.mode}
              toggleMode={() => this.toggleMode()}
              tagOptions={this.state.persist.tagOptions}
              removeTag={(tag: string) => this.removeTag(tag)}
              addTag={(tag: string) => this.addTag(tag)}
            />
            <Header>{this.headerText}</Header>
            <NavBar
              activeTab={this.state.activeTab}
              setActiveTab={(tab: Tab) => this.setState({ activeTab: tab })}
              showCapture={() => {
                this.setState({ moodShowing: true });
              }}
            />
          </ContentContainer>
        )}
        {this.state.loggingIn &&
          (this.state.persist.user?.isAnonymous ||
            !this.state.persist.user) && (
            <OverlayContainer>
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebaseApp.auth()}
              />
            </OverlayContainer>
          )}
        {this.state.moodShowing && (
          <CreateMood
            addMood={(mood: Mood) => this.addMood(mood)}
            user={this.state.persist.user!}
            closeCapture={() => this.setState({ moodShowing: false })}
            tagOptions={this.state.persist.tagOptions}
          />
        )}
      </StyledApp>
    );
  }

  get headerText(): string {
    const activeTab: Tab = this.state.activeTab;
    if (activeTab === Tab.Profile) return "Achievements";
    else if (activeTab === Tab.Entries) return "Entries";
    else if (activeTab === Tab.Stats) return "Analytics";
    else if (activeTab === Tab.Settings) return "More";
    else return "Error";
  }

  async hardUpdate(): Promise<void> {
    await this.updateMoods();
    await this.softUpdate();
  }

  async softUpdate(): Promise<void> {
    const stats: StatModel[] = StatService.getStats(this.state.persist.moods);
    this.setState({ persist: { ...this.state.persist, stats: stats } });
    const achievements: AchievementModel[] = AchievementService.getAchievements(
      this.state.persist.moods
    );
    this.setState({
      persist: { ...this.state.persist, achievements: achievements },
    });
    this.saveState();
  }

  async updateMoods(): Promise<void> {
    const response: any = await MoodService.getMoods(
      this.state.persist.user!,
      "date"
    );
    const moodResponses: MoodResponse[] = await response.json();

    let moods: Mood[] = [];
    moodResponses.forEach((moodResponse: MoodResponse) => {
      moods.push(
        new Mood(
          moodResponse.data.value,
          moodResponse.data.userId,
          moodResponse.data.note,
          moodResponse.data.tags,
          moodResponse.data.date,
          moodResponse.id
        )
      );
    });

    this.setState({ persist: { ...this.state.persist, moods: moods } });
  }

  removeMood(mood: Mood): void {
    let moods: Mood[] = this.state.persist.moods;
    const index = moods.indexOf(mood);
    if (index > -1) {
      moods.splice(index, 1);
    }
    this.setState({ persist: { ...this.state.persist, moods: moods } });
    this.softUpdate();
  }

  addMood(mood: Mood): void {
    let moods: Mood[] = this.state.persist.moods;
    moods.unshift(mood);
    this.setState({ persist: { ...this.state.persist, moods: moods } });
    this.softUpdate();
  }

  async saveState(): Promise<void> {
    Storage.set({ key: "state", value: JSON.stringify(this.state.persist) });
  }

  toggleMode(): void {
    if (this.state.persist.mode === Mode.Dark)
      this.setState({ persist: { ...this.state.persist, mode: Mode.Light } });
    else this.setState({ persist: { ...this.state.persist, mode: Mode.Dark } });
  }

  removeTag(tag: string) {
    let tags: string[] = this.state.persist.tagOptions;
    const index = tags.indexOf(tag);
    if (index > -1) {
      tags.splice(index, 1);
    }
    this.setState({ persist: { ...this.state.persist, tagOptions: tags } });
    this.saveState();
  }

  addTag(tag: string) {
    let tags: string[] = this.state.persist.tagOptions;
    tags.push(tag);
    this.setState({ persist: { ...this.state.persist, tagOptions: tags } });
    this.saveState();
  }
}
