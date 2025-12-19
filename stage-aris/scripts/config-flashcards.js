
let courses = [];
// Récuperer les données
async function get_courses() {
    document.getElementById("course_sel").innerHTML = ""
    courses = []
    const response = await fetch('http://localhost:8000/api/courses/')   
    let cs = await response.json()  

    cs.forEach(course => {
        courses.push(course)
    });
}
const sel = document.getElementById("course_sel")
get_courses().then(function() {
    for(let i = 0; i < courses.length; i++) {
        console.log(courses[i]);
        const new_option = document.createElement("option")
        new_option.text = courses[i]['name']
        new_option.value = i
        sel.add(new_option)
    }

    document.getElementById("playbtn").onclick = function() {
        localStorage.setItem("courseid", courses[sel.value]['id'])
        window.location.href = "flashcards.html"
    }
})

