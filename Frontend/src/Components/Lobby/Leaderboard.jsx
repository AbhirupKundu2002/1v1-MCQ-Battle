import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/leaderboard.css';

const API_URL = 'http://localhost:5000'; // Replace with your actual API URL

const calculateAccuracy = (correct, attempt) => (attempt === 0 ? 0 : (correct / attempt) * 100);

const Leaderboard = () => {
  const [showIndividual, setShowIndividual] = useState(true);
  const [individualData, setIndividualData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const [individualResponse, friendsResponse] = await Promise.all([
          axios.get(`${API_URL}/dashboard`),
          axios.get(`${API_URL}/accuracyRoom`),
        ]);

        setIndividualData(individualResponse.data);
        setFriendsData(friendsResponse.data);
      } catch (err) {
        setError(`Unable to fetch leaderboard data: ${err.response ? err.response.data : err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const fetchUsernameByEmail = async (email) => {
    if (usernames[email]) return usernames[email]; // Use cached username if available

    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await axios.get(`${API_URL}/users/user/${email}`);
      const username = response.data.user.username;
      setUsernames((prevUsernames) => ({ ...prevUsernames, [email]: username })); // Cache the fetched username
      return username;
    } catch (err) {
      console.error(`Error fetching username: ${err.response ? err.response.data : err.message}`);
      return email; // Fallback to email if username fetch fails
    }
  };

  if (loading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  const sortedIndividualData = [...individualData].sort((a, b) => {
    if (b.TotalCorrect === a.TotalCorrect) {
      return calculateAccuracy(b.TotalCorrect, b.TotalQuestions) - calculateAccuracy(a.TotalCorrect, a.TotalQuestions);
    }
    return b.TotalCorrect - a.TotalCorrect;
  });

  const sortedFriendsData = [...friendsData].sort((a, b) => {
    if (b.wins === a.wins) {
      return calculateAccuracy(b.wins, b.wins + b.loss) - calculateAccuracy(a.wins, a.wins + a.loss);
    }
    return b.wins - a.wins;
  });

  return (
    <div className="container mt-4 shadow-sm pb-3">
      <h2 style={{ textAlign: 'center', fontFamily: 'Overpass', fontSize: '28px', color: '#e83e8c', paddingTop: '20px', textDecoration: 'underline' }}>Leaderboard</h2>
      <div className="mb-3">
        <Button
          variant="primary"
          onClick={() => setShowIndividual(true)}
          className={`button-container me-2 ${showIndividual ? 'active' : ''}`}
          style={{ backgroundColor: showIndividual ? '#007bff' : '#6c757d', borderColor: '#007bff' }}
        >
          Play Individual
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowIndividual(false)}
          style={{ backgroundColor: !showIndividual ? '#007bff' : '#6c757d', borderColor: '#007bff' }}
          className='button-container'
        >
          Play with Friends
        </Button>
      </div>
      {showIndividual ? (
        <Table striped bordered hover className='table-container'>
          <thead>
            <tr>
              <th className='th-data'>Rank</th>
              <th className='th-data'>Player Username</th>
              <th className='th-data'>Questions Attempted</th>
              <th className='th-data'>Correct Answers</th>
              <th className='th-data'>Accuracy (%)</th>
            </tr>
          </thead>
          <tbody>
            {sortedIndividualData.map((player, index) => (
              <tr key={player.id}>
                <td className='td-data'>{index + 1}</td>
                <td className='td-data' style={{ color: 'grey' }}>{usernames[player.email] || player.email}</td>
                <td className='td-data'>{player.TotalQuestions}</td>
                <td className='td-data'>{player.TotalCorrect}</td>
                <td className='td-data'>{calculateAccuracy(player.TotalCorrect, player.TotalQuestions).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Table striped bordered hover className='table-container'>
          <thead>
            <tr>
              <th className='th-data'>Rank</th>
              <th className='th-data'>Player Username</th>
              <th className='th-data'>Quizzes Attempted</th>
              <th className='th-data'>Wins</th>
              <th className='th-data'>Accuracy (%)</th>
            </tr>
          </thead>
          <tbody>
            {sortedFriendsData.map((player, index) => (
              <tr key={player.id}>
                <td className='td-data'>{index + 1}</td>
                <td className='td-data' style={{ color: 'grey' }}>{usernames[player.email] || player.email}</td>
                <td className='td-data'>{player.wins + player.loss}</td>
                <td className='td-data'>{player.wins}</td>
                <td className='td-data'>{calculateAccuracy(player.wins, player.wins + player.loss).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Leaderboard;
