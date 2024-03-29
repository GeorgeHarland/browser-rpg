import styled from "styled-components";

export const ZoneTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

export const SubtitleLine = styled.div<{ textcolour: string }>`
  font-size: 18px;
  color: ${(props) => props.textcolour};
  margin-top: -0.2rem;
  margin-bottom: -0.6rem;
  font-weight: 600;
`;

export const SpacerWithLine = styled.div`
  margin: 1rem 0;
  border-bottom: 0.2px solid firebrick;
`;

export const Spacer = styled.div`
  margin: 1.5rem 0;
`;

export const NarrativeLine = styled.i<{ textcolour: string }>`
  color: ${(props) => props.textcolour};
`;

export const OptionText = styled.div`
  color: blue;
  cursor: pointer;
  width: fit-content;
`;
