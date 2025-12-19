// TODO: Supprimer les champs à chaque ajout, actualiser le select à chaque fois qu'on change d'entrée

// Classe représentant un cours
class Course {
    constructor(name, description, id, questions={}) {
        this.name = name
        this.id = id
        this.description = description
        this.questions = questions
    }
}
class Question{
    constructor(question, response) {
        this.question = question 
        this.response = response
    }
}
let courses = {};
// Récuperer les données
async function get_courses() {
    question_course_sel.innerHTML = ""
    courses = {}
    const response = await fetch('http://localhost:8000/api/courses/')   
    let cs = await response.json()  

    cs.forEach(course => {
        add_course(new Course(course['name'], course['description'], course['id']))
        course['questions'].forEach(question => {
            courses[course['name']].questions[question['question']] = new Question(
                question['question'], question['response']
            )
        });
    })
}
 
// Formulaires du document
const course_name_input = document.getElementById("course_name_input") // Nom du cours
const course_desc_area = document.getElementById("course_desc_area") // Description du cours


const question_course_sel = document.getElementById("course_select")
const question = document.getElementById("question")
const response = document.getElementById("response")

get_courses().then(() => {
    refresh_vistable()
})
// Ajouter un cours
function add_course(course) {
    courses[course.name] = course
    // Actualise l'affichage de la liste de déroulante
    const new_option = document.createElement("option")
    new_option.text = course.name
    new_option.value = course.name
    question_course_sel.add(new_option)
}

async function sync_course(course) {
    await fetch('http://localhost:8000/api/courses/'+course.id + "/", 
        {method:'PUT',
        body: JSON.stringify(new Course(course.name, course.description, course.id, Object.values(course.questions))),
        headers: {"Content-Type": 'application/json'}
    })
}
async function sync_add_course(course) {
    await fetch('http://localhost:8000/api/courses/', 
        {method:'POST',
        body: JSON.stringify(new Course(course.name, course.description, course.id, Object.values(course.questions))),
        headers: {"Content-Type": 'application/json'}
    })
    get_courses()
}
async function sync_del_course(course) {
    await fetch('http://localhost:8000/api/courses/' + course.id + '/', 
        {method:'DELETE',
        body: JSON.stringify(new Course(course.name, course.description, course.id, Object.values(course.questions))),
        headers: {"Content-Type": 'application/json'}
    })
    get_courses()
}


// Ajouter une question à un cours 
function add_question(question, course) {
    course.questions[question.question] = question
}

// Actualise l'affichage du tableau de visualisation
function refresh_vistable() {
    table = document.getElementById("table")
    table.innerHTML = ""
    Object.keys(courses[question_course_sel.value].questions).forEach(element => {
        table.innerHTML += "<tr><td>"+ element + "</td>" +
                        "<td>"+ courses[question_course_sel.value].questions[element].response + "</td></tr>"  
    });
}



document.getElementById("add_coursebtn").onclick = function () {
    const errorlab = document.getElementById("err_course_lab")  
    if (course_name_input.value == "") {
        errorlab.innerHTML = "Champ manquant"
        errorlab.style.visibility = "visible"
        return
    }
    
    if(!Object.keys(courses).includes(course_name_input.value)) {
        errorlab.style.visibility = "hidden"
        // Ajoute le cours 
        const course = new Course(course_name_input.value, course_desc_area.value, id="")
        add_course(course)
        sync_add_course(course)
        refresh_vistable()
    } else {
        errorlab.innerHTML = "Cours déjà inscrit"
        errorlab.style.visibility = "visible"
        return
    }
    document.getElementById("add_course_container").style.visibility = "hidden"
}

document.getElementById("add_questionbtn").onclick = function () {
    const errorlab = document.getElementById("err_quesiton_lab")  
    if (question_course_sel.value == "" || question.value == "" || response.value == "") {
        errorlab.innerHTML = "Champ manquant"
        errorlab.style.visibility = "visible"
        return
    }

    if(!Object.keys(courses[question_course_sel.value].questions).includes(question.value)) { 
        errorlab.style.visibility = "hidden"
        add_question(new Question(question.value, response.value, question_course_sel.value), 
            courses[question_course_sel.value])
        refresh_vistable()
        question.value = ""
        response.value = ""
        sync_course(courses[question_course_sel.value])
    }
    else {
        errorlab.innerHTML = "La question est déjà inscrite"
        errorlab.style.visibility = "visible"
    }
}

document.getElementById("app_coursebtn").onclick = function () {
    document.getElementById("add_course_container").style.visibility = "visible"
}

document.getElementById("del_coursebtn").onclick = function () {
    if(confirm("Voulez-vous vraiment supprimer ce cours ? Il sera impossible de le récupérer.")) {
        sync_del_course(courses[question_course_sel.value])
        question_course_sel.value = Object.keys(courses)[0]
        refresh_vistable()
    }
}

question_course_sel.onchange = function () {
    refresh_vistable()
}
