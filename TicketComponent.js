import React from 'react';
import './Ticket.css';

const TicketComponent = ({ id, title, type }) => {
  return (
    <div className="bucket">
      <div className="fi">
        <h3 className="heading">{id}</h3>
        <div className="icon"></div>
      </div>
      <div className="second">
        <h2>{title}</h2>
      </div>
      <div className="thi">
        <div className="exclamation-outer">
          <div className="exclamation">!</div>
        </div>
        <div>{type}</div>
      </div>
    </div>
  );
};

export default TicketComponent;

