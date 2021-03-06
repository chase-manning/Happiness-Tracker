import React from "react";
import styled from "styled-components";
import Mood from "../../models/mood";
import { getTagText } from "./TagSelector";

type StyledEntryDescriptionProps = {
  opacity: number;
  overlay: boolean;
};

const StyledEntryDescription = styled.div`
  width: 100%;
  font-size: 13px;
  line-height: 1.4;
  margin-top: 10px;
  color: var(--main);
  opacity: ${(props: StyledEntryDescriptionProps) => props.opacity};
  position: ${(props: StyledEntryDescriptionProps) =>
    props.overlay ? "absolute" : "relative"};
  top: 0;
  left: 0;
`;

type TagProps = {
  overlay: boolean;
};

const Tag = styled.span`
  color: ${(props: TagProps) =>
    props.overlay ? "var(--primary)" : "var(--highlight)"};
`;

type Props = {
  mood: Mood;
  overlay: boolean;
  opacity: number;
};

const EntryDescription = (props: Props) => {
  const hasFeelings = props.mood.feelings && props.mood.feelings.length > 0;
  const hasActivities =
    props.mood.activities && props.mood.activities.length > 0;
  const hasPlaces = props.mood.places && props.mood.places.length > 0;
  const hasPeople = props.mood.people && props.mood.people.length > 0;

  if (!hasFeelings && !hasActivities && !hasPlaces && !hasPeople) return null;

  return (
    <StyledEntryDescription opacity={props.opacity} overlay={props.overlay}>
      {"I'm "}
      {hasFeelings && (
        <span>
          {"feeling "}
          <Tag overlay={props.overlay}>
            {getTagText(props.mood.feelings)}
          </Tag>{" "}
        </span>
      )}
      {hasActivities && (
        <span>
          {hasFeelings ? "while " : ""}
          <Tag overlay={props.overlay}>
            {getTagText(props.mood.activities)}
          </Tag>{" "}
        </span>
      )}
      {hasPlaces && (
        <span>
          {"at "}
          <Tag overlay={props.overlay}>
            {getTagText(props.mood.places)}
          </Tag>{" "}
        </span>
      )}
      {hasPeople && (
        <span>
          {"with "}
          <Tag overlay={props.overlay}>
            {getTagText(props.mood.people)}
          </Tag>{" "}
        </span>
      )}
    </StyledEntryDescription>
  );
};

export default EntryDescription;
