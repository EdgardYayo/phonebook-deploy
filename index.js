const phonebook = require("./db/data");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
morgan.token('body', (req) => Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '');

const app = express()
app.use(express.json())
app.use(cors("http://localhost:5173/"))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let currentPersons = phonebook.phonebook;

const generateId = () => {
    const maxId = currentPersons.length > 0 ? Math.max(...currentPersons.map(p => Number(p.id))) : 0;
    // console.log((Math.random() * maxId).toString());
    return (Math.random() * maxId).toString();
}

app.get("/api/persons", (request, response) => {
    console.log(currentPersons);
    response.json(currentPersons);
})

app.get("/api/persons/:id", (request, response) => {
    const { id } = request.params;
    const person = currentPersons.find((prsn) => prsn.id === id);

    if(!person) {
        return response.status(404).json({
            error: "Resource not found"
        });
    }

    response.json(person);
})

app.get("/info", (request, response) => {
    let date = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    response.send(
        `<p>The Phonebook has info for ${currentPersons.length} people</p>
         <br>
         <p>${date.toLocaleString("en-US", options)}</p>
        `
    )
})

app.post("/api/persons", (request, response) => {
    const { body } = request;
    
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: "Bad request: name and number are required"
        })
    }

    const personExist = currentPersons.find((person) => person.name.toLowerCase() === body.name.toLowerCase());
    
    if(personExist) {
        return response.status(400).json({
            error: "Bad request: name must be unique"
        })
    }


    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    currentPersons = currentPersons.concat(person);
    console.log(currentPersons);
    response.json(person);
})

app.delete("/api/persons/:id", (request, response) => {
    const { id } = request.params;
    // console.log(id);
    const personToDelete = currentPersons.filter((prsn) => prsn.id !== id);
    // console.log(personToDelete);
    response.status(204).end()
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on " + PORT + " port"));
