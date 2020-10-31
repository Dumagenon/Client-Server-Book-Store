import React from 'react'

const SignInForm = ({ changeHandler, loading, loginHandler }) => {
  return (
    <form className="card white" onSubmit={loginHandler}>
      <div className="card-content black-text">
        <span className="card-title">Sign in to Courses</span>
        <div>
          <div className="input-field">
            <input
              id="logData"
              name="logData"
              type="text"
              required
              className="validate"
              onChange={changeHandler} />
            <label htmlFor="logData">Username or email address</label>
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
        <button disabled={loading}
          className="dark-btn"
        >
          Sign in
        </button>
      </div>
    </form>
  )
}

export default SignInForm;