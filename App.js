


import React, { useState, useEffect } from 'react';
import TicketComponent from './components/TicketComponent';
import Navbar from './components/Nav';
import './App.css';

function App() {
  const [ticketsArray, setTicketsArray] = useState([]);
  const [usersArray, setUsersArray] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [sorting, setSorting] = useState('priority');
  const apiUrl = 'https://api.quicksell.co/v1/internal/frontend-assignment';

  // Function to get priority label
  const getPriorityLabel = (priority) => {
    if (priority === 4) return 'Urgent';
    else if (priority === 3) return 'High';
    else if (priority === 2) return 'Medium';
    else if (priority === 1) return 'Low';
    else if (priority === 0) return 'No priority';
    else return `Unknown Priority (${priority})`;
  };

  // Function to group tickets based on selected criteria
  const groupTickets = (tickets) => {
    if (grouping === 'status') {
      // Group by status
      return tickets.reduce((grouped, ticket) => {
        const status = ticket.status;
        grouped[status] = [...(grouped[status] || []), ticket];
        return grouped;
      }, {});
    } else if (grouping === 'user') {
      // Group by user
      return tickets.reduce((grouped, ticket) => {
        const user = getUserName(ticket.userId);
        grouped[user] = [...(grouped[user] || []), ticket];
        return grouped;
      }, {});
    } else if (grouping === 'priority') {
      // Group by priority
      return tickets.reduce((grouped, ticket) => {
        const priorityLabel = getPriorityLabel(ticket.priority);
        grouped[priorityLabel] = [...(grouped[priorityLabel] || []), ticket];
        return grouped;
      }, {});
    }
  };

  // Function to get user name
  const getUserName = (userId) => {
    const user = usersArray.find((user) => user.id === userId);
    return user ? user.name : `User (${userId})`;
  };

  // Function to sort tickets based on selected criteria
  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (sorting === 'priority') return b.priority - a.priority;
      else if (sorting === 'title') return a.title.localeCompare(b.title) || 0;
      return 0;
    });
  };

  // Effect hook to fetch data on component mount
  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTicketsArray(data.tickets);
        setUsersArray(data.users);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Effect hook to set grouping and sorting from localStorage on component mount
  useEffect(() => {
    const storedGrouping = localStorage.getItem('grouping');
    const storedSorting = localStorage.getItem('sorting');
    setGrouping(storedGrouping || 'status');
    setSorting(storedSorting || 'priority');
  }, []);

  // Handlers for grouping and sorting changes
  const handleGroupingChange = (newGrouping) => {
    setGrouping(newGrouping);
    localStorage.setItem('grouping', newGrouping);
  };

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
    localStorage.setItem('sorting', newSorting);
  };

  // Group and sort the tickets based on the selected criteria
  const sortedAndGroupedTickets = groupTickets(sortTickets(ticketsArray));

  // Render the component
  return (
    <div className="App">
      <div>
        <Navbar
          className="navba"
          onGroupingChange={handleGroupingChange}
          onOrderingChange={handleSortingChange}
        />
      </div>
      <div className="dash">
        {Object.keys(sortedAndGroupedTickets).map((groupKey) => (
          <div key={groupKey} className="diff">
            <h2>{groupKey}</h2>
            {sortedAndGroupedTickets[groupKey].map((ticket) => (
              <TicketComponent key={ticket.id} {...ticket} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
