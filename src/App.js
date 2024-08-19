import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';

const AppContext = React.createContext();

const initialEvents = [
  { id: 1, date: '2024-08-20', title: 'Meeting', category: 'Work' },
  { id: 2, date: '2024-08-21', title: 'Birthday Party', category: 'Personal' },
];

const CalendarApp = () => {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState('All');

  const addEvent = (event) => {
    setEvents([...events, { id: events.length + 1, ...event }]);
  };

  const editEvent = (updatedEvent) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const filteredEvents = filter === 'All' ? events : events.filter(event => event.category === filter);

  return (
    <AppContext.Provider value={{ events: filteredEvents, addEvent, editEvent, deleteEvent, setFilter }}>
      <Router>
        <AppWrapper>
          <ContentWrapper>
            <Header>
              <h1 >August</h1>
              <Nav>
                <Link to="/">Calendar</Link>
                <Link to="/add">Add Event</Link>
              </Nav>
            </Header>
            <Routes>
              <Route path="/" element={<CalendarView />} />
              <Route path="/add" element={<AddEvent />} />
              <Route path="/event/:id" element={<EventDetails />} />
            </Routes>
          </ContentWrapper>
        </AppWrapper>
      </Router>
    </AppContext.Provider>
  );
};

const CalendarView = () => {
  const { events, setFilter } = useContext(AppContext);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <h2>Tasks</h2>
      <Filter>
        <label htmlFor="filter">Filter by Category:</label>
        <select id="filter" onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
      </Filter>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <Link to={`/event/${event.id}`}>{event.date} - {event.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AddEvent = () => {
  const { addEvent } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent({ title, date, category });
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <h2>Add Event</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
      <button type="submit">Add Event</button>
    </FormWrapper>
  );
};

const EventDetails = () => {
  const { events, editEvent, deleteEvent } = useContext(AppContext);
  const eventId = parseInt(window.location.pathname.split('/').pop());
  const event = events.find(event => event.id === eventId);

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [category, setCategory] = useState(event.category);

  const handleEdit = () => {
    editEvent({ id: event.id, title, date, category });
  };

  return (
    <div>
      <h2>Event Details</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      <button onClick={handleEdit}>Save Changes</button>
      <button onClick={() => deleteEvent(event.id)}>Delete Event</button>
    </div>
  );
};

// Styled components

const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e6f7ff; /* Light blue background color */
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;

  h1 {
    color: #009087;
    justify-content:center;
    display:flex;
    margin-left:300px /* Blue text color for the heading */
  }
`;

const Nav = styled.nav`
  a {
    margin-right: 15px;
    text-decoration: none;
    color: #007BFF;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Filter = styled.div`
  margin-bottom: 20px;
  select {
    margin-left: 10px;
    padding: 5px;
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export default CalendarApp;
