// Récupération des données
let questions = []
async function get_quesions() {
    const response = await fetch('http://localhost:8000/api/courses/' + localStorage.getItem("courseid") + "/")   
    let cs = await response.json()
    cs['questions'].forEach(q => {
        const qn = new String(q['question'])
        const rsp = new String(q['response'])
        arr = [qn, rsp]
        console.log(arr)
        questions.push(arr)
    })
}  
// Capture du temps passé 
var timer = 0;

setInterval(() => {
    timer++
}, 1000)


let score = 0
let num = 0
const card_disp = document.getElementById("card")
const text = document.getElementById("cardlab")
var card_flipped = false




window.onload = function() {
    get_quesions().then( function () {
        // Elements du document
        // Début du jeu
        text.innerText = questions[0][0]
        document.getElementById("num_label").innerText = "1/" + questions.length

        // Retourner la carte
        card_disp.addEventListener("click", () => {
            card_disp.style.transform= "rotateY(90deg)";
            setTimeout(() => {
                if (!card_flipped) {
                    text.innerText = questions[num][1]
                    card_flipped = true
                    document.getElementById("verify_question").style.visibility = "visible"
                }
                else 
                {
                    text.innerText = questions[num][0]
                    card_flipped = false
                }   
                card_disp.style.transform= "rotateY(0deg)";
            }, 600)
            })}        
        )
}

document.getElementById("yesbtn").onclick = function () {
    score++
    if(num == questions.length - 1) {
        show_endscreen()
    }
    else {
        next_question()
    }
    document.body.style.backgroundColor= "rgb(5, 216, 5)";
    setTimeout(() => {
        document.body.style.backgroundColor= "white"
    }, 350)
    
}
document.getElementById("nobtn").onclick = function () {
    console.log(num)
    if(num == questions.length - 1) {
        show_endscreen()
    }
    else {
        next_question()
    }
    document.body.style.backgroundColor= "rgba(224, 19, 19, 1)";
    setTimeout(() => {
        document.body.style.backgroundColor= "white"
    }, 350)
    
}

// Passer à la prochaine question
function next_question() {
    num++
    text.innerText = questions[num][0]
    document.getElementById("num_label").innerText = num+1 + "/" + questions.length
    document.getElementById("verify_question").style.visibility = "hidden"
    card_flipped = false
}

// Afficher l'écran de fin
function show_endscreen() {
    card_disp.style.visibility = "hidden"
    document.getElementById("verify_question").style.visibility = "hidden"
    
    document.getElementById("endscreen").style.visibility = "visible"
    const scores = document.getElementsByClassName("lvlinfo")

    scores[0].innerHTML = "Score: " + score
    scores[1].innerHTML = "Poucentage de réussite: " + Math.round((score/questions.length)*100)+ "%"
    scores[2].innerHTML = "Temps: " + timer + "s"
}