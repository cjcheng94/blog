//Placeholder for Cards
import React from "react";

const CardPlaceHolder = props => {
  let cards = [];
  for (let i = 0; i < 8; i++) {
    cards.push(
      <div className="col s12 m4 l3 " key={i}>
        <div className="card small hoverable">
          <div className="card-content">
            <div className="card-title-placeholder" />
            <p className="card-author">By ...</p>
            <p className="card-article">......</p>
          </div>
        </div>
      </div>
    );
  }
  return cards;
};
export default CardPlaceHolder;
