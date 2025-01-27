import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Speech Recognition Component
const SpeechRecognitionComponent = ({ onSpeech, language }) => {
    const [recognition, setRecognition] = useState(null);

    const getMonthNumber = useCallback((monthName) => {
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const monthIndex = monthNames.findIndex(month => month.startsWith(monthName.toLowerCase()));
        return monthIndex > -1 ? String(monthIndex + 1) : null;
    }, []);

    const formatDate = useCallback((transcript) => {
        const dateRegex1 = /(\d{1,2})[/\\-](\d{1,2})[/\\-](\d{2,4})/; // MM/DD/YYYY or MM-DD-YYYY
        const dateRegex2 = /([a-zA-Z]+)\s*(\d{1,2})(?:st|nd|rd|th)?\s*,\s*(\d{4})/; // Month DD, YYYY
        const dateRegex3 = /(\d{1,2})(?:st|nd|rd|th)?\s*of\s*([a-zA-Z]+)\s*(\d{4})/; // DD of Month YYYY

        let match;

        if ((match = transcript.match(dateRegex1))) {
            return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[3]}`;
        } else if ((match = transcript.match(dateRegex2))) {
            const month = getMonthNumber(match[1]);
            if (month) {
                return `${month.padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[3]}`;
            }
        } else if ((match = transcript.match(dateRegex3))) {
            const month = getMonthNumber(match[2]);
            if (month) {
                return `${month.padStart(2, '0')}/${match[1].padStart(2, '0')}/${match[3]}`;
            }
        }
        return transcript;
    }, [getMonthNumber]);

    const postProcessTranscript = useCallback((transcript) => {
        let processedTranscript = transcript.replace(/at gmail dot com/gi, "@gmail.com");
        processedTranscript = processedTranscript.replace(/at gmail.com/gi, "@gmail.com");
        processedTranscript = processedTranscript.replace(/gmail dot com/gi, "gmail.com");
        processedTranscript = processedTranscript.replace(/gmail com/gi, "gmail.com");
        processedTranscript = processedTranscript.replace(/at the rate gmail dot com/gi, "@gmail.com");
        processedTranscript = processedTranscript.replace(/at the rate gmail.com/gi, "@gmail.com");
        processedTranscript = processedTranscript.replace(/at the rate gmail/gi, "@gmail");
        processedTranscript = processedTranscript.replace(/at gmail/gi, "@gmail");
        processedTranscript = processedTranscript.replace(/add gmail dot com/gi, "@gmail.com");
        processedTranscript = processedTranscript.replace(/add gmail.com/gi, "@gmail.com");
        processedTranscript = processedTranscript.replace(/add gmail/gi, "@gmail");
        processedTranscript = processedTranscript.replace(/gmail/gi, "gmail");
        processedTranscript = processedTranscript.replace(/add the rate/gi, "@");
        processedTranscript = processedTranscript.replace(/at the rate/gi, "@");
        processedTranscript = processedTranscript.replace(/add/gi, "@");
        processedTranscript = formatDate(processedTranscript);
        return processedTranscript;
    }, [formatDate]);

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.lang = language || 'en-US';
            rec.onresult = (event) => {
                let transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                transcript = postProcessTranscript(transcript);
                onSpeech(transcript);
                rec.stop();
            };
            rec.onend = () => { };
            setRecognition(rec);
        } else {
            console.error("Speech recognition is not supported in this browser.");
            alert("Speech recognition is not supported in this browser.");
        }
    }, [onSpeech, language, postProcessTranscript]);

    useEffect(() => {
        if (recognition) {
            recognition.start();
            return () => {
                if (recognition.isListening) recognition.stop();
            };
        }
    }, [recognition]);

    return null;
};

// Fill Form Component
const FillForm = ({ form }) => {
    const [responses, setResponses] = useState({});
    const [listeningField, setListeningField] = useState(null);

    const handleChange = (e, fieldName) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [fieldName]: e.target.value,
        }));
    };

    const handleSpeech = (transcript, fieldName) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [fieldName]: transcript,
        }));
        setListeningField(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedResponses = form.fields.reduce((acc, field) => {
            acc[field] = responses[field] || '';
            return acc;
        }, {});
        const formData = { formId: form._id, responses: formattedResponses };

        fetch('https://form-builder-38h6.onrender.com/api/forms/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Form submitted:', data);
                alert('Form submitted successfully!');
                setResponses({});
            })
            .catch((err) => {
                console.error('Error submitting form:', err);
                alert('Failed to submit the form.');
            });
    };

    return (
        <div className="form-container card mb-4 shadow">
            <div className="card-body">
                <h3 className="card-title">{form.title}</h3>
                <form onSubmit={handleSubmit}>
                    {form.fields.map((field, index) => (
                        <div key={index} className="mb-3 input-field-container">
                            <label htmlFor={`field-${index}`} className="form-label">
                                {field}
                            </label>
                            <div className="d-flex align-items-center">
                                <input
                                    id={`field-${index}`}
                                    type="text"
                                    className="form-control flex-grow-1"
                                    value={responses[field] || ''}
                                    onChange={(e) => handleChange(e, field)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={`btn btn-mic ms-2 ${listeningField === field ? 'listening' : ''}`}
                                    onClick={() => setListeningField(field)}
                                    disabled={listeningField === field}
                                >
                                    {listeningField === field ? 'Listening...' : '🎤'}
                                </button>
                                {listeningField === field && (
                                    <SpeechRecognitionComponent
                                        onSpeech={(transcript) => handleSpeech(transcript, field)}
                                        language="en-US"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-success submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

// User Dashboard Component
const UserDashboard = () => {
    const [forms, setForms] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://form-builder-38h6.onrender.com/api/forms')
            .then(response => setForms(response.data))
            .catch(error => console.error('Error fetching forms:', error));

        axios.get('https://form-builder-38h6.onrender.com/api/forms/getSubmitForm')
            .then(response => setSubmissions(response.data))
            .catch(error => console.error('Error fetching submissions:', error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/');
    };

    return (
        <div className="user-dashboard-container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <span className="navbar-brand">User Dashboard</span>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <h1 className="mb-4  dashboard-title">User Dashboard</h1>
            <div className="form-grid mb-5">
                {forms.length === 0 ? (
                    <p>Loading forms...</p>
                ) : (
                    forms.map((form) => <FillForm key={form._id} form={form} />)
                )}
            </div>
            <h2 className="text-center mb-3">Submissions</h2>
            <div className="container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Form Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center">
                                    No submissions found.
                                </td>
                            </tr>
                        ) : (
                            submissions.map((submission, index) => (
                                <tr key={index}>
                                    <td>{submission.formTitle}</td>
                                    <td>
                                        <span className={`status-tag status-${submission.status.toLowerCase()}`}>
                                            {submission.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDashboard;