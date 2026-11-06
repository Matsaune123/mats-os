async function getState() {
    try {

        const response =
            await fetch("/api/loading/state");

        const data =
            await response.json();

        updateUI(data);

    } catch (err) {

        console.error(
            "Failed to fetch state:",
            err
        );
    }
}

async function rotate(amount) {
    try {

        await fetch(
            "/api/loading/rotate",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    amount
                })
            }
        );

        await getState();

    } catch (err) {

        console.error(
            "Rotate failed:",
            err
        );
    }
}

async function answer(index) {
    try {

        await fetch(
            "/api/loading/answer",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    answer_index: index
                })
            }
        );

        await getState();

    } catch (err) {

        console.error(
            "Answer failed:",
            err
        );
    }
}

async function resetGame() {
    try {

        await fetch(
            "/api/loading/reset",
            {
                method: "POST"
            }
        );

        await getState();

    } catch (err) {

        console.error(
            "Reset failed:",
            err
        );
    }
}

function updateUI(data) {

    const progressBar = document.getElementById("progress-bar");
    const progressOuter = document.querySelector(".loading-bar-outer");
    const progressText = document.getElementById("progress-text");
    const statusText =
        document.getElementById(
            "status-text"
        );

    const question =
        document.getElementById(
            "puzzle-question"
        );

    const choiceA =
        document.getElementById(
            "choice-a"
        );

    const choiceB =
        document.getElementById(
            "choice-b"
        );

    const choiceC =
        document.getElementById(
            "choice-c"
        );

    const choicePuzzle =
        document.getElementById(
            "choice-puzzle"
        );

    const winScreen =
        document.getElementById(
            "win-screen"
        );

    // Oppdater bredde (uten transform!)
    progressBar.style.width = data.progress + "%";
    progressText.textContent = data.progress + "%";

    // ROTER KUN OUTER
    if (progressOuter) {
        progressOuter.style.transform = `rotate(${data.angle}deg)`;
    }

    if (data.completed) {
        winScreen.style.display =
            "block";

        choicePuzzle.classList.add(
            "hidden"
        );

        statusText.textContent =
            "System fully loaded.";

        return;
    }

    if (
        data.waiting_for_puzzle &&
        data.answers.length >= 3
    ) {

        choicePuzzle.classList.remove(
            "hidden"
        );

        question.textContent =
            data.question;

        choiceA.textContent =
            data.answers[0];

        choiceB.textContent =
            data.answers[1];

        choiceC.textContent =
            data.answers[2];

    } else {

        choicePuzzle.classList.add(
            "hidden"
        );
    }

    statusText.textContent = data.waiting_for_puzzle
        ? "Justering påkrevd!"
        : "Progress: " + data.progress + "%";
}

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const left =
            document.getElementById(
                "rotate-left"
            );

        const right =
            document.getElementById(
                "rotate-right"
            );

        const a =
            document.getElementById(
                "choice-a"
            );

        const b =
            document.getElementById(
                "choice-b"
            );

        const c =
            document.getElementById(
                "choice-c"
            );

        const restart =
            document.getElementById(
                "restart-btn"
            );

        if (left) {
            left.addEventListener(
                "click",
                () => rotate(-15)
            );
        }

        if (right) {
            right.addEventListener(
                "click",
                () => rotate(15)
            );
        }

        if (a) {
            a.addEventListener(
                "click",
                () => answer(0)
            );
        }

        if (b) {
            b.addEventListener(
                "click",
                () => answer(1)
            );
        }

        if (c) {
            c.addEventListener(
                "click",
                () => answer(2)
            );
        }

        if (restart) {
            restart.addEventListener(
                "click",
                resetGame
            );
        }

        getState();
    }
);

