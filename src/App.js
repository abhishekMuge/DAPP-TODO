import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import TodoListContract from "./contracts/TodoList.json";
import getWeb3 from "./getWeb3";

import "./App.css";
// import Todo from "./Components/Todo";

class App extends Component {
  state = {
    loading: true,
    todoCount: 0,
    web3: null,
    accounts: null,
    contract: null,
    todos: [],
    todoItem: "",
  };

  componentDidMount = async () => {
    this.setState({
      loading: false,
    });
    await this.loadContract();
    await this.runExample();
    await this.getTodos();
  };

  loadContract = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoListContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TodoListContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods
    //   .createTodo("Complete todo app today only!")
    //   .send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    const response = await contract.methods.todoCount().call();

    // const todolist = await contract.methods.todos(1).call();
    // console.log(todolist);

    // Update state with the result.
    this.setState({ todoCount: response });
  };

  getTodos = async () => {
    const { contract, todoCount, todos } = this.state;
    for (var i = 1; i <= todoCount; i++) {
      const todo = await contract.methods.todos(i).call();
      this.setState({
        todos: [...this.state.todos, todo],
      });
    }
  };

  createdTodo = async (content) => {
    const { contract, accounts } = this.state;
    const newTodo = await contract.methods
      .createTodo(content)
      .send({ from: accounts[0] });
    window.location.reload();
  };

  toggelTodo = async (id) => {
    const { accounts, contract } = this.state;

    await contract.methods.toggleTodoState(id).send({ from: accounts[0] });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div
                className="card"
                id="list1"
                style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}
              >
                <div className="card-body py-4 px-4 px-md-5">
                  <p className="h1 text-center mt-3 mb-4 pb-3 text-primary">
                    <i className="fas fa-check-square me-1" />
                    <u>My Todo-s</u>
                  </p>
                  <div className="pb-2">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex flex-row align-items-center">
                          <input
                            type="text"
                            ref={(input) => {
                              this.task = input;
                            }}
                            className="form-control form-control-lg"
                            id="exampleFormControlInput1"
                            placeholder="Add new..."
                          />
                          <a
                            href="#!"
                            data-mdb-toggle="tooltip"
                            title="Set due date"
                          >
                            <i className="fas fa-calendar-alt fa-lg me-3" />
                          </a>
                          <div>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => {
                                this.createdTodo(this.task.value);
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3">
                    <a
                      href="#!"
                      style={{ color: "#23af89" }}
                      data-mdb-toggle="tooltip"
                      title="Ascending"
                    >
                      <i className="fas fa-sort-amount-down-alt ms-2" />
                    </a>
                  </div>
                  {this.state.todos &&
                    this.state.todos.map((todo) => (
                      <ul
                        className="list-group list-group-horizontal rounded-0 bg-transparent"
                        key={todo.id}
                      >
                        <li className="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                          <div className="form-check">
                            <input
                              className="form-check-input me-0"
                              name={todo.id}
                              type="checkbox"
                              defaultChecked={todo.isComplete}
                              ref={(input) => {
                                this.checkbox = input;
                              }}
                              onClick={() => {
                                this.toggelTodo(todo.id);
                              }}
                            />
                          </div>
                        </li>
                        <li className="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                          <p className="lead fw-normal mb-0">{todo.content}</p>
                        </li>
                      </ul>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default App;
