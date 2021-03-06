import React, { useState } from "react";
import Mood from "../../models/mood";
import styled from "styled-components";
import { createMood } from "../../services/MoodService";
import MoodSlider from "../shared/MoodSlider";
import AddNote from "../shared/AddNote";
import { useSelector, useDispatch } from "react-redux";
import {
  hideMood,
  selectMoodShowing,
  selectMoodDateSearch,
} from "../../state/navigationSlice";
import { addMood, selectMoods } from "../../state/dataSlice";
import {
  updateDateSearchMoods,
  updateMoodDependencies,
} from "../../state/loadingSlice";
import { selectUser } from "../../state/userSlice";
import ExitBar from "../shared/ExitBar";
import { Button, HideComponentProps } from "../../styles/Shared";
import TagSelector from "../shared/TagSelector";
import LoadingCircle from "../shared/LoadingCircle";
import Failed from "../shared/Failed";

const StyledCreateMood = styled.div`
  display: ${(props: HideComponentProps) => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bg-mid);
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  color: var(--main);
`;

const SliderSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Additions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  margin-top: 10px;
`;

class State {
  mood: number = 5;
  note: string = "";
  feelings: string[] = [];
  places: string[] = [];
  activities: string[] = [];
  people: string[] = [];
  loading: boolean = false;
  error: boolean = false;
}

const CreateMood = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const moodShowing = useSelector(selectMoodShowing);
  const user = useSelector(selectUser);
  const moods = useSelector(selectMoods);
  const dateOverride = useSelector(selectMoodDateSearch);

  const clearState = () => setState(new State());
  const showError = () => setState({ ...state, loading: false, error: true });

  const submit = () => {
    if (state.loading) return;
    setState({ ...state, loading: true, error: false });

    const mood: Mood = new Mood(
      user.id,
      state.mood,
      state.feelings,
      state.activities,
      state.places,
      state.people,
      state.note,
      dateOverride ? new Date(dateOverride) : undefined
    );

    createMood(mood)
      .then((newMood) => {
        dispatch(addMood(newMood));
        dispatch(updateMoodDependencies());
        if (dateOverride) dispatch(updateDateSearchMoods());
        console.log("Clearing State");
        clearState();
        dispatch(hideMood());
      })
      .catch(() => showError());
  };

  return (
    <StyledCreateMood show={moodShowing}>
      <ExitBar
        exit={() => {
          dispatch(hideMood());
          clearState();
        }}
        hideExit={moods.length === 0}
      />

      <TagSelector
        feelings={state.feelings}
        activities={state.activities}
        places={state.places}
        people={state.people}
        setFeelingTags={(tags: string[]) =>
          setState({ ...state, feelings: tags })
        }
        setActivitiesTags={(tags: string[]) =>
          setState({ ...state, activities: tags })
        }
        setPlacesTags={(tags: string[]) => setState({ ...state, places: tags })}
        setPeopleTags={(tags: string[]) => setState({ ...state, people: tags })}
        hideContextMenus={!moodShowing}
      />

      <SliderSection>
        <MoodSlider
          value={state.mood}
          updateValue={(value: number) => {
            setState({
              ...state,
              mood: value,
            });
          }}
        />
        <Additions>
          <div />
          <AddNote
            setNote={(note: string) => setState({ ...state, note: note })}
          />
        </Additions>
        <Button onClick={() => submit()}>
          {state.loading ? (
            <LoadingCircle color={"var(--bg-mid)"} size={19} />
          ) : (
            "Done"
          )}
        </Button>
      </SliderSection>
      <Failed
        open={state.error}
        close={() => setState({ ...state, error: false })}
        action={"Mood Creation"}
        tryAgain={() => submit()}
      />
    </StyledCreateMood>
  );
};

export default CreateMood;
