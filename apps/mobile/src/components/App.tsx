import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "./shared/NavBar";
import Tabs from "./tabs/Tabs";
import Overlays from "./overlays/Overlays";
import State from "../models/state";

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

export default class App extends Component {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  render() {
    return (
      <StyledApp data-testid="App">
        <Tabs></Tabs>
        <NavBar activeTab={this.state.activeTab}></NavBar>
        <Overlays></Overlays>
      </StyledApp>
    );
  }
}