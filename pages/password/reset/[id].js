import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import axios from 'axios';
import APIUrls from '../../api';
import { useAlert } from 'react-alert';
import { setSession } from '../../../utils/Actions';
import Header from '../../../Components/Header';

export default function reset() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = router.query;
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password === confirmPassword) {
      // axios.post()
      if (id !== 'new') {
        axios.post(APIUrls.reset_password, { password }, {
          headers: {
            'Authorization': `Bearer ${id}`
          }
        }).then(res => {
          console.log("WITHOUT TOKEN", res.data)
          if (res.data.data.message == 'password changed') {
            setSuccess(`Password updated, <a href="/">Login</a>`);
            logout();
          }
        }).catch(e => {
          setError(`${e.response.statusText},<a href="/">Login</a>`);
        })
      } else {
        axios.post(APIUrls.reset_password, { password }).then(res => {
          console.log("WITH TOKEN", res.data)
          if (res.data.data.message == 'password changed') {
            setSuccess(`Password updated,<a href="/">Login</a>`);
            logout();
          }
        }).catch(e => {
          setError(`${e.response.statusText},<a href="/">Login</a>`);
        })
      }
    } else {
      setError('Password & Confirm Password do not match')
    }
  }
  const logout = () => {
    dispatch(setSession(true));
  }
  return (
    <>
    <Header/>
      <div className='reset-wrapper' >
        <div className='form-wrapper'>
          <form onSubmit={(e) => handleSubmit(e)} className='p-0'>
            <div className='input-wrapper'>
              <label>Password:</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Enter password' required />
            </div>
            <div className='input-wrapper'>
              <label>Confirm Password:</label>
              <input type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirm password' required />
            </div>
            <div className='input-wrapper'>
              {error && <span className='text-error' dangerouslySetInnerHTML={{ __html: error }}></span>}
              {success && <span className='text-success' dangerouslySetInnerHTML={{ __html: success }}></span>}
            </div>
            <div className='input-wrapper'>
              <input type='submit' value='RESET' />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
