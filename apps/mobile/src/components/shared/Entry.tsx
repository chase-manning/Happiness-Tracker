import React, { useState } from "react";
import styled from "styled-components";
import dateFormat from "dateformat";
import MoodService from "../../services/MoodService";
import Mood from "../../models/mood";
import Popup from "./Popup";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { SelectedTag, SelectedTags, Line } from "../../styles/Shared";
import { useDispatch, useSelector } from "react-redux";
import { removeMood } from "../../state/dataSlice";
import { selectUser } from "../../state/userSlice";

const StyledEntry = styled.div`
  width: 100%;
`;

const EntryText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  text-align: left;
`;

const EntryHeader = styled.div`
  color: var(--main);
  margin-bottom: 10px;
`;

const EntrySubHeader = styled.div`
  color: var(--sub);
  font-size: 12px;
`;

const EntryNote = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-bottom: 10px;
`;

const EntryTags = styled.div`
  color: var(--sub);
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const EntryTagMoreText = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-left: 5px;
`;

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PopupHeader = styled.div`
  color: var(--main);
  margin-bottom: 20px;
  font-size: 16px;
  width: 100%;
  text-align: center;
`;

const PopupDetails = styled.div`
  color: var(--sub);
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
`;

const HighlightedWord = styled.p`
  color: var(--main);
  margin-right: 5px;
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--highlight);
  border: solid 1px var(--highlight);
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: var(--bg-mid);
  margin-top: 20px;
`;

class State {
  popupOpen: boolean = false;
}

type Props = {
  mood: Mood;
};

const Entry = (props: Props) => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const user = useSelector(selectUser)!;

  return (
    <StyledEntry data-testid="Entry">
      <Line onClick={() => setState({ popupOpen: true })}>
        <EntryText>
          <EntryHeader>{props.mood.description}</EntryHeader>
          <EntrySubHeader>
            {dateFormat(props.mood.date, " dddd h:MM tt")}
          </EntrySubHeader>
        </EntryText>
        <EntryText>
          <EntryNote>
            {props.mood.note.substring(0, 20) +
              (props.mood.note.length > 20 ? "..." : "")}
          </EntryNote>
          <EntryTags>
            {props.mood.tags.slice(0, 1).map((tag: string) => (
              <SelectedTag includeMargin={false}>{tag}</SelectedTag>
            ))}
            {props.mood.tags.length > 1 && (
              <EntryTagMoreText>+{props.mood.tags.length - 1}</EntryTagMoreText>
            )}
          </EntryTags>
        </EntryText>
        <ChevronRight />
      </Line>
      {state.popupOpen && (
        <Popup
          content={
            <PopupContent>
              <PopupHeader>{props.mood.description}</PopupHeader>
              <PopupDetails>
                <HighlightedWord>Mood: </HighlightedWord>
                {props.mood.value}
              </PopupDetails>
              <PopupDetails>
                <HighlightedWord>Recorded: </HighlightedWord>
                {dateFormat(props.mood.date, "h:MM tt d/m/yy")}
              </PopupDetails>
              {props.mood.note.length > 0 && (
                <PopupDetails>
                  <HighlightedWord>Note: </HighlightedWord>

                  {props.mood.note}
                </PopupDetails>
              )}
              {props.mood.tags.length > 0 && (
                <PopupDetails>
                  <SelectedTags>
                    {props.mood.tags.map((tag: string) => (
                      <SelectedTag includeMargin={true}>{tag}</SelectedTag>
                    ))}
                  </SelectedTags>
                </PopupDetails>
              )}
              <Button
                onClick={() => {
                  setState({ popupOpen: false });
                  MoodService.deleteMood(user!, props.mood.moodId!);
                  dispatch(removeMood(props.mood));
                }}
              >
                Delete
              </Button>
            </PopupContent>
          }
          showButton={false}
          close={() => setState({ popupOpen: false })}
        ></Popup>
      )}
    </StyledEntry>
  );
};

export default Entry;
