import React, { useRef, useState, useEffect } from "react";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";
import ListItem from "../listItem/ListItem";
import "./list.scss";

function List({ list }) {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [clickLimit, setClickLimit] = useState(Math.floor(window.innerWidth / 230));
  const listRef = useRef();

  useEffect(function() {
    const handleResize = function() {
      setClickLimit(Math.floor(window.innerWidth / 230));
    };
    window.addEventListener("resize", handleResize);
    return function() {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(function() {
    console.log("list content:", list.content);
  }, [list.content]);

  const handleClick = function(direction) {
    setIsMoved(true);
    const distance = listRef.current.getBoundingClientRect().x - 50;
    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = "translateX(" + (230 + distance) + "px)";
    }
    if (direction === "right" && slideNumber < list.content.length - clickLimit) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = "translateX(" + (-230 + distance) + "px)";
    }
  };

  if (!list.content || list.content.length === 0) {
    return <div className="list">Loading...</div>;
  }

  return (
    <div className="list">
      <span className="listTitle">{list.title}</span>
      <div className="wrapper">
        <ArrowBackIosOutlined
          className="sliderArrow left"
          onClick={function() { handleClick("left"); }}
          style={{ display: !isMoved ? "none" : "block" }}
        />
        <div className="container" ref={listRef}>
          {list.content.map(function(item, i) {
            return <ListItem key={item._id || i} index={i} item={item} />;
          })}
        </div>
        <ArrowForwardIosOutlined
          className="sliderArrow right"
          onClick={function() { handleClick("right"); }}
        />
      </div>
    </div>
  );
}

export default List;
