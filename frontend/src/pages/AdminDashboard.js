import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [fields, setFields] = useState(['']);
    const [forms, setForms] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();

    const handleFieldChange = (index, event) => {
        const newFields = [...fields];
        newFields[index] = event.target.value;
        setFields(newFields);
    };

    const addField = () => {
        setFields([...fields, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = { title, fields };
            const response = await axios.post('https://form-builder-38h6.onrender.com/api/admin/create', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Form created:', response.data);
            alert("Form Created Successfully !")
            setTitle('');
            setFields(['']);
            fetchForms();
        } catch (error) {
            console.error('Error creating form:', error);
        }
    };

    const fetchForms = async () => {
        try {
            const response = await axios.get('https://form-builder-38h6.onrender.com/api/forms/');
            setForms(response.data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get('https://form-builder-38h6.onrender.com/api/admin/submissions');
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
             const statusData = { id, status };
            const response = await axios.patch(
                'https://form-builder-38h6.onrender.com/api/admin/submissions/status',
                statusData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('Submission status updated:', response.data);
            fetchSubmissions();
        } catch (error) {
              console.error('Error updating submission status:', error.response?.data || error.message);
        }
    };

//    const handleDeleteSubmission = async (id) => {
//         try {
//             const response = await axios.delete(`http://localhost:5000/api/admin/submissions/${id}`);
//             console.log('Submission deleted:', response.data);
//             fetchSubmissions();
//         } catch (error) {
//             console.error('Error deleting submission:', error.response?.data || error.message);
//         }
//     };

    const handleDeleteSubmission = async (id) => {
        try {
            const response = await axios.post(
                'https://form-builder-38h6.onrender.com/api/admin/deleteSubmission',
                { id }, // Send the id in the request body
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('Submission deleted:', response.data);
            fetchSubmissions(); // Refresh the list of submissions
        } catch (error) {
            console.error('Error deleting submission:', error.response?.data || error.message);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/'); // Redirect to login page
    };

    useEffect(() => {
        fetchForms();
        fetchSubmissions();
    }, []);

   return (
       <div className="container admin-dashboard-container mt-5">
           <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
               <div className="container">
                   <span className="navbar-brand">Admin Dashboard</span>
                   <ul className="navbar-nav ms-auto">
                       <li className="nav-item">
                           <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                       </li>
                   </ul>
               </div>
           </nav>
           <h1 className="text-center mb-4 text-primary">Admin Dashboard</h1>

           {/* Form Creation Section */}
           <div className="card mb-4">
               <div className="card-body">
                   <h2 className="text-secondary">Create a New Form</h2>
                   <form onSubmit={handleSubmit}>
                       <div className="mb-3">
                           <label className="form-label">Form Title:</label>
                           <input
                               type="text"
                               className="form-control"
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               required
                           />
                       </div>
                       <div className="mb-3">
                           <label className="form-label">Fields:</label>
                           {fields.map((field, index) => (
                               <div key={index} className="input-group mb-2">
                                   <input
                                       type="text"
                                       className="form-control"
                                       value={field}
                                       onChange={(e) => handleFieldChange(index, e)}
                                       placeholder={`Field ${index + 1}`}
                                       required
                                   />
                                   {index > 0 && (
                                       <button
                                           type="button"
                                           className="btn btn-danger"
                                           onClick={() => setFields(fields.filter((_, i) => i !== index))}
                                       >
                                           Remove
                                       </button>
                                   )}
                               </div>
                           ))}
                           <button type="button" className="btn btn-secondary" onClick={addField}>
                               Add Field
                           </button>
                       </div>
                       <button type="submit" className="btn btn-primary">
                           Create Form
                       </button>
                   </form>
               </div>
           </div>

           {/* Form List Section */}
           <div className="card mb-4">
               <div className="card-body">
                   <h2 className="text-secondary">Existing Forms</h2>
                   <ul className="list-group">
                       {forms.map((form) => (
                           <li key={form._id} className="list-group-item">
                               {form.title}
                           </li>
                       ))}
                   </ul>
               </div>
           </div>

           {/* Submission List Section */}
           <div className="submission-section">
             <div className="submission-card">
                <div className="card-body">
                     <h2 className="text-secondary">Submissions</h2>
                        {submissions.map((submission) => (
                         <div key={submission._id} className="submission-item">
                          <div className="submission-item-content">
                            <strong className="text-info">{submission.formId.title}</strong>
                            <p>Status: {submission.status}</p>
                            <ul>
                                {Object.entries(submission.responses).map(([fieldName, value]) => (
                                    <li key={fieldName}>
                                        <strong>{fieldName}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                            <div className="actions">
                              <button
                                   className="btn btn-success me-2"
                                   onClick={() => handleStatusChange(submission._id, 'Verified')}
                                >
                                    Verify
                                </button>
                                <button
                                    className="btn btn-danger me-2"
                                    onClick={() => handleStatusChange(submission._id, 'Rejected')}
                                >
                                    Reject
                                </button>
                                 <button
                                    className="btn btn-danger me-2"
                                    onClick={() => handleDeleteSubmission(submission._id)}
                                >
                                    Delete
                                </button>
                            </div>
                          </div>
                         </div>
                        ))}
                 </div>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;