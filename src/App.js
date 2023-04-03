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

// This function gets the accoubt balance of the user
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

  // This function is used to conenct wallet to the dapp
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

  // This function is used to fetch all the notes created by the user
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

  // This function is used to ada a new note to the app
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

  // this function marks a note as completed
  const complete = async (noteId) => {
    try {
      await todoContract.methods.setCompleted(noteId).send({ from: kit.defaultAccount })
    } catch (e) {
      console.log(e)
    }
  }

  // This function delets note from the smart contract
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