import { Entity } from "./service";
import styled from "styled-components";

import hyperlinkSvg from "./hyperlink.svg";

const HyperlinkIcon = styled.img`
  margin: 0 0 -3px 5px;
  width: 12px;
  height: 16px;
`;

const YearComponent = styled.span`
  margin-left: 5px;
`;

const RatingComponent = styled.span`
  margin-left: 5px;
  padding: 1px 3px;
  border-radius: 3px;
  font-size: small;
  background-color: ${({ rating }: { rating: number }) => {
    if (rating >= 7.5) return "#A9D78C";
    if (rating >= 5) return "#ffdb3a";
    return "#ffa98a";
  }};
`;

// @ts-ignore
const Year = ({ year, endYear }) => {
  if (!year) return null;

  if (endYear && endYear !== year) {
    return <YearComponent>{`${year}-${endYear}`}</YearComponent>;
  }

  return <YearComponent>{year}</YearComponent>;
};

// @ts-ignore
const Rating = ({ rating }) => {
  if (!rating) return null;

  return <RatingComponent rating={rating}>{rating}</RatingComponent>;
};

const MovieSummary = ({ data }: { data: Entity }) => {
  const {
    title,
    year,
    end_year: endYear,
    external_link: externalLink,
    rating,
  } = data;

  if (!title) return null;

  return (
    <span>
      <a href={externalLink} target="_blank" rel="noreferrer">
        <span>{title}</span>
        <HyperlinkIcon src={hyperlinkSvg} />
      </a>
      <Year year={year} endYear={endYear} />
      <Rating rating={rating} />
    </span>
  );
};

export default MovieSummary;
