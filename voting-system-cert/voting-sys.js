const poll = new Map();
function addOption(option) {
    if (!poll.has(option) && option !== "") {
        poll.set(option, new Set());
        return `Option "${option}" added to the poll.`

    } else if (poll.has(option)) {
        return `Option "${option}" already exists.`
    } else if (option === "") {
        return `Option cannot be empty.`
    }
}

function vote(option, voterId) {
    if (!poll.has(option)) {
        return `Option "${option}" does not exist.`
    } else if (poll.has(option)) {
        if (poll.get(option).has(voterId)) {
            return `Voter ${voterId} has already voted for "${option}".`
        } else {
            poll.get(option).add(voterId);
            return `Voter ${voterId} voted for "${option}".`
        }
    }

}


console.log(addOption("Egypt"));
console.log(addOption("Dominicana"));
console.log(addOption("Palestine"));
console.log(vote("Egypt", "93562"));
console.log(vote("Palestine", "91562"));
console.log(vote("Palestine", "98562"));


const displayResults = () => {
    let arr = ["Poll Results:"];

    poll.forEach((val, key) => {
        arr.push(`${key}: ${val.size} votes`)
    })
    return arr.join("\n")
}

console.log(displayResults())
