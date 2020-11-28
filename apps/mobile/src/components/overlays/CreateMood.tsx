import React, { useState } from "react";
import Mood from "../../models/mood";
import styled from "styled-components";
import MoodService from "../../services/MoodService";
import MoodSlider from "../shared/MoodSlider";
import AddNote from "../shared/AddNote";
import { useSelector, useDispatch } from "react-redux";
import {
  hideMood,
  selectMoodShowing,
  selectMoodDateSearch,
} from "../../state/navigationSlice";
import { addMood, selectMoods } from "../../state/dataSlice";
import { updateAll, updateDateSearchMoods } from "../../state/loadingSlice";
import { selectUser } from "../../state/userSlice";
import ExitBar from "../shared/ExitBar";
import { Button } from "../../styles/Shared";
import TagSelector from "../shared/TagSelector";
import LoadingCircle from "../shared/LoadingCircle";

const StyledCreateMood = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bg-mid);
  display: flex;
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
}

const CreateMood = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const moodShowing = useSelector(selectMoodShowing);
  const user = useSelector(selectUser);
  const moods = useSelector(selectMoods);
  const dateOverride = useSelector(selectMoodDateSearch);

  const clearState = () => setState({ ...new State() });

  if (!moodShowing) return null;

  return (
    <StyledCreateMood>
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
        <Button
          onClick={() => {
            if (state.loading) return;
            setState({ ...state, loading: true });

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
            dispatch(addMood(mood));
            MoodService.createMood(mood).then(() => {
              dispatch(updateAll());
              if (dateOverride) dispatch(updateDateSearchMoods());
              clearState();
              dispatch(hideMood());
            });
          }}
        >
          {state.loading ? (
            <LoadingCircle color={"var(--bg-mid)"} size={19} />
          ) : (
            "Done"
          )}
        </Button>
      </SliderSection>
    </StyledCreateMood>
  );
};

export default CreateMood;
