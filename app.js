const express = require('express');

const students = require('./students.json');
const grades = require('./grades.json');

const port = 3000;
const app = express();


// Global middleware
// run this middleware on EVERY request
app.use(express.json());


function checkBody(requiredKeys, message) {
  return (request, response, next) => {
    const hasAllRequiredKeys = requiredKeys
      .every(requiredKey => requiredKey in request.body);

    if (!hasAllRequiredKeys) {
      return response.status(422).send(message);
    }

    next();
  };
}

const hasGradeAndStudentId = checkBody(
  ['studentId', 'grade'],
  'You need to provide a grade and student id!!!',
);

const hasUsernameAndEmail = checkBody(
  ['username', 'email'],
  'You need to provide a username and email!!!',
);

app.get('/students', (req, res) => {
    const { search: username } = req.query;

    if (name) {
        const filtered = students.filter(s => s.username === username);
        return res.json(filtered);
    }

    res.json(data);
});

app.get('/students/:id', (req, res)=>{
    const student = students.find(student => student.id === parseInt(req.params.id));

    // Did everything really go ok?

    if (!student) {
        return res.status(404).send({ error: 'Student was not found' });
    }

    res.json(student);
});

app.get('/grades/:studentId', (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const gradesForStudent = grades.filter(grade => grade.studentId === studentId);
    res.json(gradesForStudent);
});

app.post('/grades', hasGradeAndStudentId, (req, res) => {
    const newGrade = {
        id: getNextId(grades),
        studentId: req.body.studentId,
        class: req.body.class,
        grade: req.body.grade
    };

    grades.push(newGrade);
    res.status(201).json(newGrade);
});

app.post('/register', hasUsernameAndEmail, (req, res) => {
    const newStudent = {
        id: getNextId(students),
        username: req.body.username,
        email: req.body.email
    };

    students.push(newStudent);
    res.status(201).json(newStudent);
});


app.listen(port, () => {
  console.log('Jeremy and Dustin\'s sweet grading school app thing running on port', port);
});

function getNextId(table) {
  const lastId = table[table.length - 1].id;

  return lastId + 1;
}
