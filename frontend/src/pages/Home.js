import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeInput from '../components/ResumeInput';
import JobDescriptionInput from '../components/JobDescriptionInput';
import { evaluateFit, saveResult } from '../api';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const [resumeData, setResumeData] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEvaluate = async () => {
    const payload = {
      resume: resumeData,
      company,
      title,
      job_description: description
    };
    const result = await evaluateFit(payload);
    localStorage.setItem('evaluation', JSON.stringify(result));

    if (user) {
      await saveResult({
        ...result,
        company,
        title,
        user_id: user.id
      }, user.token);
    }
    navigate('/results');
  };

  return (
    <div className="container-xl mt-4">
      <h2 className="mb-3">Resume & Job Description</h2>
      <ResumeInput onChange={setResumeData} />
      <JobDescriptionInput
        company={company}
        setCompany={setCompany}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
      <button className="btn btn-primary mt-3" onClick={handleEvaluate}>
        Evaluate Job Fit
      </button>
    </div>
  );
}