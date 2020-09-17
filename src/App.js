import React, { useState, useEffect } from "react";

import "./App.css";
const initialFormState = { cutlength: "", numberofitems: "" };
function App() {
  const [notes, setNotes] = useState([]);
  const [results, setResults] = useState([]);
  const [baseLength, setBaselength] = useState();
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    //fetchcuts();
  }, []);

  async function createNote() {
    if (!formData.cutlength || !formData.numberofitems) return;

    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteItem(cutlength) {
    const newNotesArray = notes.filter(
      (note) => note.cutlength !== cutlength.cutlength
    );
    setNotes(newNotesArray);
    console.log("remove from notes");
  }

  async function fetchcuts() {
    
    fetch("https://mhcutter-api-dev.azurewebsites.net/api/todoitems")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  async function calculatecuts() {
    if (notes.length > 0 && baseLength !== "") {
      console.log("great success");
      console.log(JSON.stringify({ baseLength: baseLength, cutlength: notes }));
      try {
        //const res = await fetch("https://localhost:5001/api/todoitems", {
        const res = await fetch(
          "https://mhcutter-api-dev.azurewebsites.net/api/cut",
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ baseLength: baseLength, cutlength: notes }),
          }
        );
        const data = await res.json();
        setResults(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("not great success");
    }
  }

  return (
    <div className="App">
      <header className="App-header">Cutting list calculator</header>
      <div className="row">
        <div className="column">
          <input
            placeholder="Base length"
            name="baseLength"
            onChange={(e) => setBaselength(parseInt(e.target.value))}
          />
        </div>
        <div className="column"></div>
      </div>
      <div className="row 2">
        <div className="column">
          <input
            onChange={(e) =>
              setFormData({ ...formData, cutlength: parseInt(e.target.value) })
            }
            placeholder="Item length"
            value={formData.cutlength}
          />
        </div>
        <div className="column">
          <input
            onChange={(e) =>
              setFormData({
                ...formData,
                numberofitems: parseInt(e.target.value),
              })
            }
            placeholder="Number of Items"
            value={formData.numberofitems}
          />
        </div>
        <div className="column">
          <button onClick={createNote}>Create item</button>
        </div>
        <div className="column">
          {notes.map((note) => (
            <div key={note.cutlength || note.numberofitems}>
              <div className="row">
                <div className="column">
                  {note.cutlength} * {note.numberofitems}{" "}
                </div>
                <div className="column">
                  <button onClick={() => deleteItem(note)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row 3">
        <div className="column">
          {notes.length > 0 && baseLength !== "" && (
            <button onClick={() => calculatecuts()}>Calculate</button>
          )}
        </div>
      </div>
      <div className="row 4">
        <div className="column">
          {results.map((plank, i) => (
            <div key={plank.wasteLength * i}>
              <div className="row">
                <div className="column">
                  Plank #{i + 1} Waste: {plank.wasteLength}{" "}
                </div>
                <div className="column">
                  Cuts
                  {plank.cutLengths.map((cutlength, i) => (
                    <div className="row" key={cutlength + i}>
                      <div className="column">{cutlength}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
