---
title: Build a Note Taking Dapp With Solidity
description: Build a CRUD note decentralized application on the Celo blockchain with Solidity
author:
- name: Peter Ayuba
  title: Software Developer, 
  url: https://github.com/ubamax
  image_url: https://github.com/ubamax.png
tags: [solidity, react, celo, todolist, beginner]
hide_table_of_contents: true
slug: /build-a-note-taking-dapp-with-solidity
---
# Build a Note Taking Dapp With Solidity

_Estimated reading time: **18 minutes**_

## Table of contents
- [Build a Note Taking Dapp With Solidity](#build-a-note-taking-dapp-with-solidity)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [Getting Started](#getting-started)
  - [App Breakdown](#app-breakdown)
    - [`package.json`](#packagejson)
    - [`src/contracts/Todo.sol`](#srccontractstodosol)
    - [`src/contracts/todo.abi.json`](#srccontractstodoabijson)
    - [`src/App.js`](#srcappjs)
  - [App Deployment Using the Remix IDE](#app-deployment-using-the-remix-ide)
  - [Conclusion](#conclusion)
  - [Author](#author)
  - [References](#references)

## Introduction 
This tutorial was designed for developers who are new to the space and want to learn the basics of building decentralized applications using Solidity. If you are looking for more complex designs, I recommend you go to the [Solidity documentation](https://soliditylang.org/) to learn more about the language.

A note-taking application is an application that takes in notes from the user and stores the notes for further reference or as reminders to carry out a particular task. A note-taking application is the perfect example of an application every beginner needs to build so as to understand how to carry out CRUD (Create, Retrieve, Update, Delete) operations in that language. 

We will be building a simple note-taking decentralized application that also has the abilities of a todo-list application. This dapp will let the users enter the title and content they want to take note of. After saving a note, users can either mark a note as completed or delete it. All these functionalities are implemented using the most popular smart contract programming language, Solidity. We will also deploy the smart contract to the Celo blockchain during this tutorial. We will also build a user interface that you can use to interact with the smart contract using React (also the most popular JavaScript front-end framework).

The following image shows how our dapp will look like at the end of this tutorial:

![app_shot](https://user-images.githubusercontent.com/110759344/222239672-b86a07be-3c7d-4eb7-80c7-689799218fea.PNG)

## Requirements
To follow this tutorial ensure you have the following tools ready:
- [NodeJs](https://nodejs.org). A Javascript run time environment. Head on to https://nodejs.org to download if you don't already have it installed.
- [NPM](https://npmjs.com). Node Package Manager. It's required to install React and other node packages
- [Git](https://git-scm.com/doc). A version control system. Git is not the same as GitHub. Take note!
- A command line interface such as bash or powershell.
- A code editor. [VS Code](https://code.visualstudio.com/) is recommended.
- A web browser.
- The [Celo Extension Wallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en).


## Getting Started
To get started with a headstart in this tutorial, clone the project repository by running the command in your terminal:

```bash
git clone https://github.com/ubamax/todo-note-project.git
```
Make sure you have Git installed before running the above command otherwise you might get an error message.

Navigate into the repository you just cloned and run the following command in your command line:

```bash
npm install
```
The above command will install all the packages listed in the `package.json `file inside a new folder called `node_modules`.

After the previous command is done running, run the next command to run the app locally in your browser:

```bash
npm start
```
The above command will start a development server in your computer mostly running on `http://localhost:3000` by default.

## App Breakdown
Let us break down some important parts of the app that might seem complex to you.

### `package.json`

```json
{
  "name": "todo-note",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@celo/contractkit": "^1.5.2",
    "bignumber.js": "^9.1.1",
    "bootstrap": "^5.1.3",
    "bootstrap-icons": "^1.8.3",
    "react": "^17.0.2",
    "react-bootstrap": "^2.4.0",
    "react-dom": "^17.0.2",
    "react-icons": "^4.3.1",
    "react-jazzicon": "^1.0.3",
    "react-router-dom": "^6.3.0",
    "react-scripts": "4.0.1",
    "sass": "^1.58.3",
    "web-vitals": "^2.1.4",
    "web3": "^1.7.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```
This file contains all the packages that are needed for our note dapp to function properly. A few important packages to highlight are listed below:

- `@celo/contractkit` - This is a library that helps developers and validators to interact with the Celo blockchain and is well suited to developers looking for an easy way to integrate Celo smart contracts within their decentralized applications. It includes common functionality to make it easier to get started building dapps on Celo.
- `bignumber.js` - A JavaScript library for arbitrary-precision arithmetic.
- `sass` - A NodeJS implementation of the SASS engine. SASS (Syntactically Awesome Style Sheet) is a CSS extension that allows writing CSS faster and easier.
- `web3` - A Javascript library for interacting with the Ethereum blockchain and can also be used to interact with the Celo blockchain.

### `src/contracts/Todo.sol`
This file contains our Solidity smart contract. Below is the code contained in the file:

```solidity
// SPDX-License-Identifier: UNLICENSE

pragma solidity >=0.8.0;

/// @notice Todo contract
contract Todo {

    event CreateNote(address indexed author, uint256 noteId);
    event UpdateNote(address indexed author, uint256 noteId);
    event DeleteNote(address indexed author, uint256 noteId);

    struct Note {
        uint256 lastModified;
        string title;
        string note;
        bool completed;
        string tag;
    }

    mapping(address => Note[]) notes;

    /// @notice Add a new note to contract
    /// @param _title Title of new note to add
    /// @param _note Note content of new note to add
    /// @param _tag Category of new note
    function addNote(
        string calldata _title, 
        string calldata _note, 
        string calldata _tag
    ) external {
        require(bytes(_title).length > 0, "Invalid title entered");
        require(bytes(_note).length > 0, "Invalid note entered");
        require(bytes(_tag).length > 0, "Invalid tag entered");
        Note memory newNote = Note(block.timestamp, _title, _note, false, _tag);
        notes[msg.sender].push(newNote);
        emit CreateNote(msg.sender, (notes[msg.sender].length - 1));
    }

    /// @notice Set the `completed` property of a note to true
    /// @param _noteId Index of note to update
    function setCompleted(uint256 _noteId) external {
        Note[] storage privateNotes = notes[msg.sender];
        require(!privateNotes[_noteId].completed, "Note status is already set to completed.");
        privateNotes[_noteId].completed = true;
        privateNotes[_noteId].lastModified = block.timestamp;
        emit UpdateNote(msg.sender, _noteId);
    }

    /// @notice Deletes a note from contract
    /// @param _noteId Index of note to delete
    function deleteNote(uint256 _noteId) external {
        Note[] storage privateNotes = notes[msg.sender];
        privateNotes[_noteId] = privateNotes[privateNotes.length - 1];
        privateNotes.pop();
        emit DeleteNote(msg.sender, _noteId);  
    }

    /// @notice Returns all notes belonging to msg sender
    /// @return An array of Notes
    function getNotes() external view returns (Note[] memory) {
        Note[] memory _notes = notes[msg.sender];
        return _notes;
    }

}
```

This file starts with a license identifier (`UNLICENSE`). This means that our source code is free and is not guided by any license. It is 100% free to use. Check out https://spdx.org/licenses/ to learn more about other licenses available to use in your Solidity code.

We also specified the Solidity compiler version to use when compiling the code. We will be using `>=0.8.0`, meaning that our code will compile on any compiler version greater than _0.8.0_ and less than _0.9.0_. 

In the next line, we created a contract and named it Todo. Inside this contract is where we will define all the functionalities of our dapp as well as state variables.

```solidity
    event CreateNote(address indexed author, uint256 noteId);
    event UpdateNote(address indexed author, uint256 noteId);
    event DeleteNote(address indexed author, uint256 noteId);

    struct Note {
        uint256 lastModified;
        string title;
        string note;
        bool completed;
        string tag;
    }

    mapping(address => Note[]) notes;
```

The first thing we did inside the body of our contract is to define events that we will emit in the later part of the code. We created three events: `CreateNote`, `UpdateNote`, and `DeleteNote`. The `CreateNote` event is emitted when a new note is created and added to the blockchain. `UpdateNote` is emitted when a note is updated. `DeleteNote` is emitted when we delete a not from the blockchain. Go to https://solidity-by-example.org/events/ to learn more about events in solidity. 

The next code inside the body contains the state variables. Variables created outside of functions but inside the body of the contract are called _state variables_. State variables store data persistently on the blockchain and it costs more gas to store them.

In the next line, we added a struct. A struct is a custom data type useful for grouping variables. Suppose you want to associate some data to a particular variable, e.g associate class, age, or grade to a particular student. Go to https://solidity-by-example.org/structs/ to learn more about structs. The `Notes` struct we created has some properties about each note such as `lastModified`, `title`, `note`, `completed`, and `tag`.

Next, we created a mapping `notes` that maps an *address* to an *array* of `Notes` where the *address* is the wallet `address` of a user, and the *array* of `Notes` contains all notes the user has created so far.

After creating the state variables of our contract, the next thing to do is to create the functions. The first function to create is the `addNote()` function as seen below:

```solidity
    /// @notice Add a new note to contract
    /// @param _title Title of new note to add
    /// @param _note Note content of new note to add
    /// @param _tag Category of new note
    function addNote(
        string calldata _title, 
        string calldata _note, 
        string calldata _tag
    ) external {
        require(bytes(_title).length > 0, "Invalid title entered");
        require(bytes(_note).length > 0, "Invalid note entered");
        require(bytes(_tag).length > 0, "Invalid tag entered");
        Note memory newNote = Note(block.timestamp, _title, _note, false, _tag);
        notes[msg.sender].push(newNote);
        emit CreateNote(msg.sender, (notes[msg.sender].length - 1));
    }
```
The function takes in three parameters:
1. `_title` - The title of a *note*. 
2. `_note` - The content of a *note*.
3. `_tag` - The category a *note* belongs to. This is useful in sorting our *notes* when they are too large to keep track of.

We used `external` to define the function because we want it to be callable only from outside the contract, i.e. externally.

Inside the body of the function, we first perform some validation checks on the input data we will receive through the parameters to ensure that only valid data is sent where if any of the `require` statements fails, the transaction is reverted with an error message. If all the checks have passed, we create a new `Note` using the input data and store it inside the variable `newNote`.

In the next line, we push the newly created `newNote` inside the `notes` state of the `sender` of the transaction. Lastly, we emit the `createNote` event passing in the `sender`'s address and the current index of the note inside the `notes` array of the `sender`.

The next function is the `setCompleted(uint256, _noteId)` function.

```solidity
    /// @notice Set the `completed` property of a note to true
    /// @param _noteId Index of note to update
    function setCompleted(uint256 _noteId) external {
        Note[] storage privateNotes = notes[msg.sender];
        require(!privateNotes[_noteId].completed, "Note status is already set to completed.");
        privateNotes[_noteId].completed = true;
        privateNotes[_noteId].lastModified = block.timestamp;
        emit UpdateNote(msg.sender, _noteId);
    }
```
This function takes a `_noteId` parameter which essentially represents the index of a note inside the `notes` array of the `sender` and set the completed property of the note to **true**. The function first creates a `storage` pointer to the `notes` array of the `sender`(To learn more about storage pointers click [here](https://blog.b9lab.com/storage-pointers-in-solidity-7dcfaa536089)). The function then checks if the `completed` property of the note is currently **false** as the function should only be able to update the state of *notes* that are uncompleted. The next two lines update the `completed` property of the note to **true** and the `lastModified` property to the latest timestamp. Finally, we emit the `updateNote` event.

The next function is `deleteNote(uint256 _noteId)`.

```solidity
    /// @notice Deletes a note from contract
    /// @param _noteId Index of note to delete
    function deleteNote(uint256 _noteId) external {
        Note[] storage privateNotes = notes[msg.sender];
        privateNotes[_noteId] = privateNotes[privateNotes.length - 1];
        privateNotes.pop();
        emit DeleteNote(msg.sender, _noteId);  
    }
```
The `deleteNote()` function also takes a `_noteId` parameter which essentially represents the index of a note inside the `notes` array of the `sender` and also creates a `storage` pointer for the array. The function changes the place of the note with the latest note inside the `privateNotes` array and then calls the `pop()` method which essentially removes the latest element of an array or in our case, the note we want to delete. Finally, we emit the `DeleteNote` event. 

This is one method of deleting an element from an array. Go to https://solidity-by-example.org/array/ to see other methods of deleting an element from an array.

The last function in our contract file is `getNotes()`.

```solidity
    /// @notice Returns all notes belonging to msg sender
    /// @return An array of Notes
    function getNotes() external view returns (Note[] memory) {
        Note[] memory _notes = notes[msg.sender];
        return _notes;
    }
```
The `external` and `view` modifiers mean the function can only be called from outside the smart contract and it can only read but not modify the state of the smart contract. It also returns an array of `Note` data. The function first copy the notes it needs to return into a memory location variable called `_notes` which is then returned.

### `src/contracts/todo.abi.json`
This file contains the ABI of our to-do contract. ABI stands for Application Binary Interface. You will need the ABI of a contract to interact with the deployed instance of that contract. The ABI of our to-do contract can be generated from Remix IDE. We will discuss how to do this later in the tutorial when deploying the contract using Remix IDE. For now, just know that the ABI is not constant. Anytime we make changes to our contract code, we are expected to generate another ABI, or else the previous one will not work with the updated contract.

### `src/App.js`

`App.js` is the file that stores the main code for our front-end. It is a Javascript file that contains a React component. Below is the code for our `App.js`:

```javascript
import React from 'react'
import "./App.scss"
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js";
import Web3 from 'web3';
import abi from "./contracts/todo.abi.json"

const ERC20_DECIMALS = 18
const contractAddress = "0x13B229De9301D61C2a84C420C7963c04c47A5449";

const App = () => {
  const [address, setAddress] = React.useState()
  const [balance, setBalance] = React.useState()
  const [notes, setNotes] = React.useState()
  const [title, setTitle] = React.useState()
  const [note, setNote] = React.useState();
  const [kit, setKit] = React.useState();
  const [todoContract, setTodoContract] = React.useState()


  const accountBalance = async () => {
    try {
      const balance = await kit.getTotalBalance(String(address));
      const celoBalance = balance.CELO
      const _todoContract = new kit.web3.eth.Contract(abi, contractAddress);

      setTodoContract(_todoContract)
      setBalance(celoBalance)
    } catch (e) {
      console.log(e)
    }
  }

  const connectWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3)

        const account = await kit.web3.eth.getAccounts();
        const acc = account[0];
        kit.defaultAccount = acc;
        setKit(kit)
        setAddress(account.toString())
      } catch (e) {
        console.log(e)
      }
    } else {
      alert("Please install CeloExtensionWallet to continue with this app")
    }
  }

  React.useEffect(() => {
    connectWallet()
  }, [])

  React.useEffect(() => {
    if (kit && address) {
      accountBalance()
    }
  }, [kit, address])

  React.useEffect(() => {
    if (todoContract) {
      fetchNotes()
    }
  }, [todoContract])

  const fetchNotes = async () => {
    try {
      const rawNotes = await todoContract.methods.getNotes().call();
      const cleanNotes = await Promise.all(
        rawNotes.map((note, index) => {
          return {
            id: index,
            title: note.title,
            note: note.note,
            completed: note.completed,
            lastModified: note.lastModified,
            tag: note.tag
          }
        })
      )
      console.log(cleanNotes)
      setNotes(cleanNotes)
    } catch (e) {
      console.log(e)
    }
  }

  const add = async () => {
    try {
      await todoContract.methods.addNote(
        title,
        note,
        "public"
      ).send({ from: kit.defaultAccount })
    } catch (e) {
      console.log(e)
    }
  }

  const complete = async (noteId) => {
    try {
      await todoContract.methods.setCompleted(noteId).send({ from: kit.defaultAccount })
    } catch (e) {
      console.log(e)
    }
  }

  const deleteNote = async (noteId) => {
    try {
      await todoContract.methods.deleteNote(noteId).send({ from: kit.defaultAccount })
    } catch (e) {
      console.log(e)
    }
  }


  // format a wallet address
  const truncateAddress = (address) => {
    if (!address) return
    return address.slice(0, 5) + "..." + address.slice(address.length - 4, address.length);
  }

  // convert from big number
  const formatBigNumber = (num) => {
    if (!num) return
    return num.shiftedBy(-ERC20_DECIMALS).toFixed(2);
  }
  return (
    <>
      <div className='main'>
        <div className='nav'>
          <div className='address'>{truncateAddress(address)}</div>
          <div className='bal'>{formatBigNumber(BigNumber(balance))} CELO</div>
        </div>
        <div className='todo'>
          <div className='add'>
            <input onChange={e => setTitle(e.target.value)} value={title} placeholder="Enter title here" />
            <textarea onChange={e => setNote(e.target.value)} value={note} placeholder="Enter note here" />
            <button onClick={add}>Add Note</button>
          </div>
          {notes?.map(note => (
            <div className='note'>
              <div className='header'>
                <div className='title'>{note.title}</div>
                <div className='headerR'>
                  <div className='completed'>{note.completed ? "Completed" : "Active"}</div>
                  <div className='lastModified'>{new Date(note.lastModified * 1000).toLocaleTimeString()}</div>
                </div>
              </div>
              <hr />
              <div className='body'>{note.note}</div>
              <hr />
              <div className='footer'>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
                <button onClick={() => complete(note.id)}>Complete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
```

Oops! That was pretty long :smiley:. Please don't panic, there is not much to it. It's pretty straightforward. Let's dive into the code.

```javascript
import React from 'react'
import "./App.scss"
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js";
import Web3 from 'web3';
import abi from "./contracts/todo.abi.json"

const ERC20_DECIMALS = 18
const contractAddress = "0x13B229De9301D61C2a84C420C7963c04c47A5449";
```

We started by importing `React` from the `react` package we installed earlier (remember our `package.json`). We then imported the `App.scss` file, this file contains all the styling that will be applied to our front end. We used SCSS to make the styling easier and shorter to implement. Alternatively, you can use CSS for your implementation, depending on which one you are comfortable with.

We also imported `newKitFromWeb3` from `@celo/contractkit`. This package allows us to communicate and carry out transactions on the Celo blockchain. Next, we imported `BigNumber` from `bignumber.js` to handle the large numbers we will be using. We also imported `Web3` from the `web3` package. The `web3` package creates a `web3` instance using the Celo Extension Wallet installed in our browsers. Lastly, we imported the ABI for our To-do contract.

In the last two lines, we created two variables, `ERC20_DECIMALS` and `contractAddress`. `ERC20_DECIMALS` stores the decimal places of the Celo blockchain native currency (CELO). `contractAddress `stores the address to which our Todo contract was deployed.

Next, we created our App component and defined all the state variables we want to keep track of using `React.usestate()`. 

Inside the body of our app component, we defined some functions which are explained below: 

- `accountBalance()` - Fetches the user's wallet balance and stores it in the `account` state
- `connectWallet()` - Connects the user's Celo Extension Wallet to the dapp
- `fetchNotes()` - Retrieves all notes created by the current user from the blockchain
- `add()` - Add a new note to the smart contract
- `complete()` - Mark a note as completed
- `deleteNote()` - Delete a note from the contract
- `truncateAddress()` - Format the user wallet address for easy readability
- `formatBigNumber()` - Transform a Javascript number instance to a BigNumber instance

The last part of our app component contains the HTML that will be rendered when the user visits our app. The styling applied to the HTML is gotten from the `App.scss` file we imported from above. The HTML part is straightforward to go through and we won't go through it in this tutorial because it is not in the scope of the tutorial.

## App Deployment Using the Remix IDE
Do you remember the `Todo` contract we wrote in `src/contracts/Todo.sol`? We will be deploying it to the Celo Alfajores testnet to get an address that we can use to interact with the contract. (You need ABI and address to interact with a contract. We already have the ABI, what is left is the contract address).

Follow the steps below to deploy the contract to the Celo alfajores testnet and generate a contract address.

1. Open Remix IDE from your browser using https://remix.ethereum.org
2. Create a new file inside the contracts folder and name the file `Todo.sol`.
<img width="370" alt="image" src="https://user-images.githubusercontent.com/64266194/222228319-0bccd42d-10c5-465e-890e-355e49acc346.png">

3. Search for the Celo plugin in the **Plugin manager** section and click on "**Activate**" to activate the plugin. 
<img width="370" alt="image" src="https://user-images.githubusercontent.com/64266194/222229349-f6f14ea0-8ce5-47e7-b1fa-1d7708f75829.png">

4. After activating the plugin, connect your wallet to the plugin interface.
5. Click on the "Deploy" button to deploy the already compiled contract to the Celo blockchain. Your Celo Extension Wallet will pop up asking you to sign the transaction.
6. Sign the transaction and wait for it to complete.

After the transaction is successful, the contract address will appear next to the "Deploy" button. Copy the address and paste it as the value of the variable `contractAddress` inside our `src/App.js` file. 

## Conclusion
After completing all the steps above, you will have a fully functional to-do notes app. We didn't cover every aspect of the tutorial because we are conscious of the tutorial length. But we covered the main parts that might be hard to understand. 

With your newly equipped knowledge, I hope to see the amazing things you will build and write about.

See you in the rabbit hole!

## Author
Peter Ayuba is a software developer with a love and passion for contributing to the open-source world. He is currently juggling Solidity and Web3 world. He loves to listen to heavy metal music in his free time.

## References 
- [Solidity documentation](https://docs.soliditylang.org)
- [Solidity By Example](https://solidity-by-example.org)
- [Celo Documentation](https://celo.org)
