import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Zap.css';


function triggerZap(name, email, message, setData) {
  const data = {
    name: name,
    email: email,
    message: message
  };
  
  console.log('Data being sent to Zapier:', data);

try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://hooks.zapier.com/hooks/catch/14826135/3355td9/");
    xhr.send(JSON.stringify(data));
    console.log("Pushed to Zapier successfully!");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            setData(JSON.parse(this.responseText));
            console.log("Response from Zapier:", this.responseText);
            const newData = JSON.parse(this.responseText);
            console.log("New data from Zapier:", newData);
            setData(prevData => [{...prevData, newData}]) // push new data to array and update state
            if (Array.isArray(newData)) {
                setData(newData);
            }
            // setData(newData);
        }

    };
  } catch(e) {
    console.error(e);
  }
  

}

function MyForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    triggerZap(name, email, message, setData);
    setName('');
    setEmail('');
    setMessage('');
  };

   useEffect(() => {
      axios.get('put your goosheet link here')
        .then(response => {
          console.log('Data received from Google Sheets:', response.data);
          if ( response.data) {
            setData(response.data); // exclude header row
          }
        })
        .catch(error => {
          console.log('Failed to get data from Google Sheets:', error.message);
        });
    }, []);

return (
    <div className='form'>
        <form onSubmit={handleSubmit}>
        <label className='name'>
            Name:
            <input className="name-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="email">
            Email:
            <input className="email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="message">
            Message:
            <textarea className="message-box" value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
        <button className="button" type="submit">Submit</button>
        </form>
        <div className='table'>
            <table> 
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody> 
                    {data && data.map((item, index) => (
                        <tr key={index}>
                            <td>{item['Name']}</td>
                            <td>{item['Email']}</td>
                            <td>{item['Message']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>

  );
}

function App() {
  return (
    <div className='heading'>
      <h1>React Zapier Integration</h1>
      <MyForm />
      {/* <FetchData /> */}
    </div>
  );
}


export default App;

