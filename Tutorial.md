# Build a Note Taking App with Solidity
---
title: Build a note taking app with solidity
description: Build a CRUD application on the Celo blockchain wht Solidity
author:
- name: Peter Ayuba
  title: Software Developer, 
  url: https://github.com/ubamax
  image_url: https://github.com/ubamax.png
tags: [solidity, react, celo, todolist, beginner]
hide_table_of_contents: true
slug: /build-a-note-taking-app-with-solidity
---

## Introduction 
This tutorial was designed for developers who are new to the space and want to learn the basics of building decentralised applications using Solidity. if you are looking for more complex designs, I recommend you go to the solidity documentation to learn more about the language.

A note taking application is an application that takes in notes from the user and stores the notes for further reference or as reminders to carry out a partucular task. A Note Taking application is the perfect example of application every begineer needs to build so as to understand how to carry out crud operations on that app. 

We will be building a simple note taking applicaition that also has the abilities of a todo-list application. This application will let the users enter the title and content they want to take note of. After saving a note, users can either mark a note as completed or delete a note. All these functionalities are implemented using the most popular smart contract programming language, solidity. We will also deploy the contract to the celo blockchain at the end of the day. We will also build a user interface that you can use to interact with the application using React (also the most popular JavaScript frontend framework.)

## What we are building

Our Note Taking app with have the following functionalities:
- Let users sign in to the app using the celo extension wallet
- Let users create a note or reminder containing an title, content, and the time the note was last modified
- Let users delete note from the list of already created notes
- Let usrs mark a note as completed

Look at a final view of how our app will look like:

![app_shot](https://user-images.githubusercontent.com/110759344/222239672-b86a07be-3c7d-4eb7-80c7-689799218fea.PNG)

## Set up your environment
To follow this tutorial ensure you have the following tools ready.
- Node. A javascript run time environment. Head on to https://nogejs.org to download if you don't already have
- NPM. node package manager. It's required to install React and other node packages
- Git. A version control system. Git is not the same as GitHub. Take note!
- Command line interface. Bash, Powershell, zsh, etc anyone will go with this thtorial
- Code editor. VSCode is what I recommend
- Web browser. Chrome or Brave or Firefox
- Celo Extension Wallet. Install it in your browser.


## Getting Started
To get started with a headstart in this tutorial, clone the project repository by running the command in your terminal:

```bash
git clone https://github.com/ubamax/todo-note-project.git
```
Make sure you have git installed before running the aobue command otherwise you might get an error message asking you to install git.

Navigate into the repository folder you just cloned and run the command from your command line:

```bash
npm install
```
The above command will install all the packages listed in teh package.json file inside a new folder called node_modules.

After the previous command is done running, run the next command to open the app live in your browser:

```bash
npm start
```
The above command will start a development server in your computer mostly running on "http://localhost:3000".

## App Breakdown
Let us break down some important part of teh app that might seems complex to you.

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
This app contains all the packages that are needed for our note app to function properly. A few important packages to highlight are listed below.

- `@celo/contractkit` - This is a library that help developers and validators to interact with the Celo blockchain and is well suited to developers looking for an easy way to integrate Celo Smart Contracts within their applications. it includes common functionality to make it easier to get started building dapps on Celo.
- `bignumber.js` - A JavaScript library for arbitrary-precision arithmetic.
- `sass` - A node implementation of the SASS engine. SASS (Syntactically Awasome Style Sheet) is a CSS extension that allows writing CSS more faster and easier.
- `web3` - a javascript library for interracting with the ethereum blockchain. It can also be used to interract with the celo blockchain as well.

### `src/contracts/Todo.sol`
This file contains our solidituy smart contract. below is the code contained in the file.

```sol
// SPDX-License-Identifier: UNLICENSE

pragma solidity >=0.8.0;

contract Todo {

    event CreateNote(address indexed author, uint256 noteId);
    event UpdateNote(address indexed author, uint256 noteId);
    event DeleteNote(address indexed author, uint256 noteId);

    struct Note {
        uint256 noteId;
        uint256 lastModified;
        string title;
        string note;
        bool completed;
        string tag;
    }

    mapping(address => Note[]) notes;
    uint256 idController;

    // add new note
    function addNote(
        string calldata _title, 
        string calldata _note, 
        string calldata _tag
    ) external {
        Note memory newNote = Note(idController, block.timestamp, _title, _note, false, _tag);
        notes[msg.sender].push(newNote);
        idController++;
        emit CreateNote(msg.sender, idController);
    }

    // set a note to completed
    function setCompleted(uint256 _noteId) external returns (bool) {
        Note[] storage privateNotes = notes[msg.sender];
        for (uint i = 0; i < privateNotes.length; i++) {
            if (privateNotes[i].noteId == _noteId) {
                privateNotes[i].completed = true;

                notes[msg.sender] = privateNotes;
                emit UpdateNote(msg.sender, _noteId);
                return true;
            }
        }

        return false;
    }

    // delete a note
    function deleteNote(uint256 _noteId) external returns (bool) {
        Note[] storage privateNotes = notes[msg.sender];
        for (uint i = 0; i < privateNotes.length; i++) {
            if (privateNotes[i].noteId == _noteId) {
                privateNotes[i] = privateNotes[privateNotes.length - 1];
                privateNotes.pop();                
                
                notes[msg.sender] = privateNotes;
                emit DeleteNote(msg.sender, _noteId);
                return true;
            }
        }
        return false;
    }

    // get note belonging to message sender
    function getNotes() external view returns (Note[] memory) {
        Note[] memory _notes = notes[msg.sender];
        return _notes;
    }

}
```

This file starts with a license identifier (`UNLICENSE`). This means that our source is free and it is not guided by any license. It is 100% free to use. Check out https://spdx.org/licenses/ to learn more abou tother licenses available to use in your solidity code.

We also specified the solidity version to use for compiling the code. We will be using `>=0.8.0`, meaining that our code will go with any version greater thatn 0.8.0 and less than 0.9.0. 

The next line, we created a contract and name it Todo. Inside this contract is where we will define all the functionalities of our dapp as well as state variables.

```sol
    event CreateNote(address indexed author, uint256 noteId);
    event UpdateNote(address indexed author, uint256 noteId);
    event DeleteNote(address indexed author, uint256 noteId);

    struct Note {
        uint256 noteId;
        uint256 lastModified;
        string title;
        string note;
        bool completed;
        string tag;
    }

    mapping(address => Note[]) notes;
    uint256 idController;
```

First thing we did inside the body of our contract is to define tha state variables. Variables created outsdie of functions buy inside body of the contract are called _state variables_. State variables stores data parsistantly on the blockchain and it cots more gas to store them.

The next code inside the body contains events that we will emit in the later part of the code. We created three events: `CreateNote`, `UpdateNote`, and `DeleteNote`. CreateNote event is emitted when a new note is created an dad added to the blockchain. UpdateNote is emitted when A note is updated. DeleteNote is emitted when we delete a not from the blockchain. Go to https://solidity-by-example.org/events/ to learn more about events in solidity.

The next line, we added a struct. A struct os useful for grouping related data together. suppose you want to associate some data to. aparticular variable, e.g associate class, age, grade, to a particular student. Struct will the best data type to use. Go to https://solidity-by-example.org/structs/ to learn more abut structs. The Notes struct we created has some properties about each note such as noteId, lastModified, title, note, completed, tag.

The second to last line, we created a mapping that maps address to an array of notes. /the address is the wallet address of each user, and the array of notes contains all notes the user have created so far. The mapping is stored in a variable ca;led notes.

The last line, we created a variable that will assign uinque id to each note created so the notes can be queried correctly and gas effiently. we called this variable idcontroller.

After creating the state variabies of our contract, the next thing to do is to create the functions. The first function to create is  function as seen below:

```sol
    // add new note
    function addNote(
        string calldata _title, 
        string calldata _note, 
        string calldata _tag
    ) external {
        Note memory newNote = Note(idController, block.timestamp, _title, _note, false, _tag);
        notes[msg.sender].push(newNote);
        idController++;
        emit CreateNote(msg.sender, idController);
    }
```
The  function takes in three arguments - _titlel, _note, and _tag. _title is the title that will be used to save a note. _note is the content  e of a note. The body containing our note message. _tag is the category a note belongs to. This is useful in sorting our notes when they are too large to keep track of. We used `external` to define the function because we want it to be called from outside the contract.

Inside the body of the function. we created a new note data stored inside newNote. We are using a _memory_ location here because we don't want the note to persist in the blockchain storage. 

The next line we add the newly created note insde the notes variable, in the callers' address space. We also incremented the idController by one. Note that the main purpose of idController is to control ids assigned to posts and not to count how many posts created so far, because it will not gibe the correct value when a post is deleted. Lastly, we emited the createNote event passing in the caller's wallet address and the id assigned to the note.

the next functio is the `setCompleted()` function.

```sol
    // set a note to completed
    function setCompleted(uint256 _noteId) external returns (bool) {
        Note[] storage privateNotes = notes[msg.sender];
        for (uint i = 0; i < privateNotes.length; i++) {
            if (privateNotes[i].noteId == _noteId) {
                privateNotes[i].completed = true;

                notes[msg.sender] = privateNotes;
                emit UpdateNote(msg.sender, _noteId);
                return true;
            }
        }

        return false;
    }
```
This function accepts the unique id of a note and set the completed value ofthe note to true and then returns true or false depending on whether the operation was successul. The function first copies all notes belonging to caller and store them in a variable called privatesNotes in memory location. It then loops through all the notes searching for the note which id belongs to _noteId. When it locates this note, it set's it completed value to true, updated the global note with this new note, and then emit the UpddateNote event. The function returns true if it updated the note successfully and false if if did not.

The next function is deleteNote():

```sol
    // delete a note
    function deleteNote(uint256 _noteId) external returns (bool) {
        Note[] storage privateNotes = notes[msg.sender];
        for (uint i = 0; i < privateNotes.length; i++) {
            if (privateNotes[i].noteId == _noteId) {
                privateNotes[i] = privateNotes[privateNotes.length - 1];
                privateNotes.pop();                
                
                notes[msg.sender] = privateNotes;
                emit DeleteNote(msg.sender, _noteId);
                return true;
            }
        }
        return false;
    }
```
deleteNote() function also accepts the note id it want's to delete and returns true if the note was delete, and fals otherwise. Similar to setCompleted() function , deleteNote() function copys caller notes to memory variable called privateNotes. It then loops through the note to search for the note with id or _noteId. When the note is found from the array of notes, it replaces the note with the last note in the note array, and then removes the last element from the array using privateNotes.pop().

This is one method of deleting from an arrayt. Go to https://solidity-by-example.org/array/ to see other methods od deleting an element from an an array. Our function also update the notes stored in storage with the newly updated note, emit the DeleteNote() event, and then return true. If no note was deleted, the function retursn false.

The last function in our contract file is getNotes().

```sol
  // get note belonging to message sender
    function getNotes() external view returns (Note[] memory) {
        Note[] memory _notes = notes[msg.sender];
        return _notes;
    }
```
It external and view which means it can only be called from outsid ethe contract. it is also returns an array of Note data. The function first copy the notes it needs to return into a memory location variable called _notes, it then returns this note from memory location because it costs less gas to return variable from memory than storage.

### `src/contracts/todo.abi.json`
This file contains the abi of our todo contract. abi stands for application binary interface. You will need the abi of a contract in order to interract with the deployed instance o fthat contract. The abi of our todo contract can be generated from Remix IDE. We will discuss how to do this later in the tutorial when deploying the contract using Remix. For now, just know that the abi is not constant. Anytime we make changes to our contract code, we are expected to generate antther abi or else the previous one will not work with the updated contract.

### `src/App.js`
App.js is the file that hpuses the main code for our frontend. It is a js file that contains a React component. Below is the code for our App.js:

```javascript
import React from 'react'
import "./App.scss"
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js";
import Web3 from 'web3';
import abi from "./contracts/todo.abi.json"

const ERC20_DECIMALS = 18
const contractAddress = "0x8216E0B0B9b7ddcD36e22A23e3B33fE1b9409685";

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
        rawNotes.map(note => {
          return {
            id: note.noteId,
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

Oops! That was pretty long :smiley:. Please don't panic, there is no much to it. It's pretty straightforward. Let's dive into the code.

```js
import React from 'react'
import "./App.scss"
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js";
import Web3 from 'web3';
import abi from "./contracts/todo.abi.json"

const ERC20_DECIMALS = 18
const contractAddress = "0x8216E0B0B9b7ddcD36e22A23e3B33fE1b9409685";
```

We started by importing `React` from `react` package we installed earlier (remember our `package.json`). When then imported `App.scss` file. this file contains all the styling that will be applied to our frontend. We used SCSS to make the styling easier and shorter to implement. Alternatively, you can use CSS for your implemetation, depending which one you are comfortable with.

We also import `newKitFromWeb2` from `@celo/contractkit`. This package allows us to communicate and carry out transactions on the celo blockchain. Next, we imported `BigNumber` from `bignumber.js` to handle large numbers we will be using. we also imported `Web3` from `web3` package. `Web3` package creates a web3 instance using the celo extension wallet installed in our browsers. lastly, we imported the abi for our todo contract.

In the last two lines, we created two variables, `ERC20_DECIMALS` and `contractAddrss`. ERC20DECIMALS stores the decimal places of the Celo blockchain native currency (CELO). contractAddress stores the address our todo contract was deployed to.

Next, we created our App component and defined all the state variables we want to keep track of using `React.usestate()`. 

Inside the body of our app component, we defined some functions which are explained below: 

- `accountBalance()` - Fetches the user's wallet balance and stores it in the `account` state
- `connectwallet()` - Connects the user's Celo Extension Wallet to the dapp
- `fetchNotes()` - Retrieves all notes created by current user from the blockchain
- `add()` - Add a new note to the smart contract
- `complete()` - Mark a note as completed
- `deleteNote()` - Delete a note from the contract
- `truncateAddress()` - Format the user wallet address for easy readability
- `formatBigNumber()` - Transform a Javascript number instance to a BigNumber instance

The last part of our app componenbt contains the html that will be rendered when the user visits our app. The styling applied to the html is gotten from app.scss file we imported from above. The html part is straightforward to go throuhg and we won't go through it in this tutorial because it is not in the scope of the tutorial.

## App Deployment using Remix IDE
You remember the `Todo` contract we wrote in `src/contracts/Todo.sol`? We will be deploying it to the Celo Alfajores testnet in order to get an address that we can use to interract with the contract. (You need abi and address to interrct with a contract. We already have the abi, what is left is the contract address).

Follow the steps below to deploy the contract to Celo testnet and generatea contract address.

1. Open remix from your browser using https://remix.etherum.org
2. Create a new file inside the contracts folder and name the file Todo.sol.
<img width="370" alt="image" src="https://user-images.githubusercontent.com/64266194/222228319-0bccd42d-10c5-465e-890e-355e49acc346.png">

3. Search for Celo extension in the extension section an dclick on activate to activate the extension. 
<img width="370" alt="image" src="https://user-images.githubusercontent.com/64266194/222229349-f6f14ea0-8ce5-47e7-b1fa-1d7708f75829.png">

4. After activating the extension, connect your wallet to the extenion
5. Click on the "Deploy" button to deploy already compiled contract to the celo blockchain. Your Celo extension wallet will pop us asking you to sign the transaction.
6. Sign the transactio and wait for it to complete.

After the transaction is success, the contract address will appear next to the "Deploy" button. Copy the address and paste it as the value of the variable `contractAddress` inside our `src/App.js` file. 

## Conclusion
After completing all the steps above, you will a have a fully functional todo notes app. We didn't cover every aspect of the tutorial because we are consious of the tutorial length. But we covered the main parts that might be hard to understand. 

With your newly equipped knowledge, I hope to see the amazing things you will build and write about.

See you in the rabbit hole!

## Author
Peter Ayuba is a software developer with love and passion for contribution to the open source world. He is currently juggling with Solidity and Web3 world.
He loves to listen to heavy metals music in his free time.

## References 
- [Solidity documentation](https://docs.soliditylang.org)
- [Solidity By Example](https://solidity-by-example.org)
- [Celo Documentation](https://celo.org)