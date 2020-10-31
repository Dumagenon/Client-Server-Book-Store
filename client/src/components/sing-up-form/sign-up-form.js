import React from 'react'

const SignUpForm = ({ changeHandler, loading, registerHandler }) => {
  return (
    <form className="card white" onSubmit={registerHandler}>
      <div className="card-content black-text">
        <span className="card-title">Sign up for Courses</span>
        <div>
          <div className="input-field">
            <input
              id="login"
              name="login"
              type="text"
              className="validate"
              required
              onChange={changeHandler} />
            <label htmlFor="login">Username</label>
          </div>
          <div className="input-field">
            <input
              id="email"
              name="email"
              type="text"
              required
              className="validate"
              onChange={changeHandler} />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="validate"
              onChange={changeHandler} />
            <label htmlFor="password">Password</label>
          </div>
        </div>
      </div>
      <div className="card-action">
        <button
          disabled={loading}
          className="dark-btn"
        >
          Sign up
        </button>
      </div>
    </form>
  )
}

export default SignUpForm;