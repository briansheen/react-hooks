import React, { Fragment, useEffect, useReducer, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import { useInput } from './useInput';
import { useFetch } from './useFetch';

const [, second] = ["Brian", "Annie"];
console.log(second);

const createArray = (length) => Array(length).fill();

function Star({ isSelected = false, selectStar }) {
  return (
    <FaStar color={ isSelected ? "red" : "gray" } onClick={selectStar}/>
  )
}

function StarRating({ numStars = 5 }) {
  const [selectedStars, setSelectedStars] = useState(0);
  const stars = createArray(numStars);

  return (
    <Fragment>
      {stars.map((value, index) => {
        let isSelected = selectedStars > index;
        return <Star key={index} isSelected={isSelected} selectStar={() => setSelectedStars(index + 1)}/>
      })}
      <p>{selectedStars} of {numStars} Stars</p>
    </Fragment>
  )
}

function reducer(statee, action) {
  switch(action.type) {
    case "add": 
      return {
        ...statee,
        buttonCount: statee.buttonCount + 1
      }
    case "subtract":
      return {
        ...statee,
        buttonCount: statee.buttonCount - 1
      }
    case "reset":
      return {
        ...statee,
        buttonCount: initialStatee.buttonCount
      }
    case "submit_color":
      return {
        ...statee,
        color: {
          name: action.color.name,
          value: action.color.value
        }
      }
  }
}

const initialStatee = {
  buttonCount: 0,
  color: {
    name: "",
    value: ""
  }
};

function App({ name }) {
  const [state, setState] = useState({status: "Not Delivered"});
  const [data, setData] = useState([]);

  const [count, setCount] = useReducer((count, arg) => { return count + arg }, 0);
  const [checked, setChecked] = useReducer((checked) => { return !checked; }, false);
  const [statee, dispatch] = useReducer(reducer, initialStatee);

  const colorInput = useRef();
  const colorName = useRef();

  const [loginProps, resetLogin] = useInput("");
  const [titleProps, resetTitle] = useInput("");
  const [login, setLogin] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const { loading, result, error } = useFetch({ uri: `https://api.github.com/users/`, login: login });

  useEffect(() => {
    fetch(`https://api.github.com/users`)
      .then(response => response.json())
      .then(response => setData(response))
  }, [])

  let users;

  if (data) {
    users = (
      <ul>
        {data.map(user => {
          return (<li key={user.id}>
            {user.login}
          </li>)
        })}
      </ul>
      )
  }

  const yourColor = statee.color.name && statee.color.value ? `Your Color: ${statee.color.name} is ${statee.color.value}` : "No Color Submitted Yet!"
  const loadingHtml = !loading ? null : (
    <h1>Loading...</h1>
  )
  const resultHtml = !result ? null : (
    <div>
      <img src={result.avatar_url} />
      <h1>{result.name ? result.name : null}</h1>
      <h2>{result.html_url ? result.html_url : null}</h2>
    </div>
  )
  
  return (
    <Fragment>
      <div className="App">
        <h1>The package is: {state.status}</h1>
        <button onClick={() => setState({...state, status: "Delivered"})}>Deliver</button>
        <h2>Hi {name}!</h2>
        <input type="checkbox" onChange={() => setChecked()} checked={checked}/>
      </div>

      <StarRating numStars={5} />
      {users ? users : (
        <p>No Users</p>
      )}
      <button onClick={() => setData([])}>Remove Data</button>

      <h1 onClick={() => setCount(1)}>Click Count! {count}</h1>

      <h1>Another Click Count... with Buttons!: {statee.buttonCount}</h1>
      <button onClick={() => dispatch({ type: "add" })}>+1</button>
      <button onClick={() => dispatch({ type: "subtract" })}>-1</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>

      <br/>

      <input type="text" ref={colorName} />
      <input type="color" ref={colorInput} />
      <button onClick={() => dispatch({ type: "submit_color", color: { name: colorName.current.value, value: colorInput.current.value}})}>Submit Color</button>
      <h1>{yourColor}</h1>

      <br/>

      <div className={"title"}>
        <h3>Title: </h3>
        <input type="text" value={titleProps.value} onChange={titleProps.onChange} />
        <button onClick={resetTitle}>Reset Title</button>
      </div>

      <br/>
      <br/>

      <label for="loginName">Enter your github username: </label>
      <input id="loginName" type="text" value={loginProps.value} onChange={loginProps.onChange} />
      <button onClick={() => setLogin(loginProps.value)}>Look Up User</button>

      <br/>
      <br/>

      {loadingHtml}
      {resultHtml}
      {error ? error : null}
      
    </Fragment>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App
      name={second} 
    />
  </React.StrictMode>,
  document.getElementById('root')
);
