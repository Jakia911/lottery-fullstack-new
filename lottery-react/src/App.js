import React, { useEffect, useState } from "react";
import lottery from "./lottery";
import web3 from "./web3";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  // Fetch initial data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs only once

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
  };

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently{" "}
        {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>

      <hr />

      <h1>{message}</h1>
    </div>
  );
};

export default App;
