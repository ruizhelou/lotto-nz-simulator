import "./style.css";
import "normalize.css";

const playSummary = {
    linesOwned: 0,
    linesPlayed: 0,
    totalSpent: 0,
    totalWon: 0,
    netProfit: 0
}
let winningNumbers = generateLottoLine();

function generateLottoLine() {
    // Create an array with numbers 1 through 40
    const numbers = Array.from({ length: 40 }, (_, i) => i + 1)

    // Shuffle the array using Fisher-Yates algorithm
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]] // Swap elements at i and j using array destructuring
    }

    // Take the first 7 numbers (7th number is the bonus ball)
    return numbers.slice(0, 7)
}

function calculateDivison(lottoLine, winningLine) {
    const isBonusMatched = lottoLine[6] === winningLine[6]
    lottoLine = lottoLine.slice(0, 6)
    winningLine = winningLine.slice(0, 6)

    const numMatching = lottoLine.filter(n => winningLine.includes(n)).length
    
    if(numMatching === 6) {
        return new Division(1, { type: 'money', amount: 350000 }, numMatching, isBonusMatched)
    } else if (numMatching === 5) {
        return isBonusMatched ? 
            new Division(2, { type: 'money', amount: 19995 }, numMatching, isBonusMatched) : 
            new Division(3, { type: 'money', amount: 601 }, numMatching, isBonusMatched)
    } else if (numMatching === 4) {
        return isBonusMatched ? 
            new Division(4, { type: 'money', amount: 55 }, numMatching, isBonusMatched) : 
            new Division(5, { type: 'money', amount: 30}, numMatching, isBonusMatched)
    } else if (numMatching === 3) {
        return isBonusMatched ? 
            new Division(6, { type: 'money', amount: 22 }, numMatching, isBonusMatched) : 
            new Division(7, { type: 'line', amount: 4 }, numMatching, isBonusMatched)
    } else {
        return new Division(null, { type: 'money', amount: 0 }, numMatching, isBonusMatched)
    }
}

class Division {
    constructor(number, prize, numbersMatched, isBonusMatched) {
        this.number = number
        this.prize = prize
        this.numbersMatched = numbersMatched
        this.isBonusMatched = isBonusMatched
    }
}

function renderPlaySummary() {
    const playSummaryDom = document.querySelector('.play-summary')
    playSummaryDom.textContent = ''

    const linesOwnedDom = document.createElement('li')
    linesOwnedDom.textContent = `Lines owned: ${playSummary.linesOwned}`
    playSummaryDom.appendChild(linesOwnedDom)

    const linesPlayedDom = document.createElement('li')
    linesPlayedDom.textContent = `Lines played: ${playSummary.linesPlayed}`
    playSummaryDom.appendChild(linesPlayedDom)
    
    const totalSpentDom = document.createElement('li')
    totalSpentDom.textContent = `Total spent: $${playSummary.totalSpent.toFixed(2)}`
    playSummaryDom.appendChild(totalSpentDom)

    const totalWonDom = document.createElement('li')
    totalWonDom.textContent = `Total won: $${playSummary.totalWon.toFixed(2)}`
    playSummaryDom.appendChild(totalWonDom)

    const netProfitDom = document.createElement('li')
    netProfitDom.textContent = `Net profit: $${playSummary.netProfit.toFixed(2)}`
    playSummaryDom.appendChild(netProfitDom)
}

function renderPlayerNumbers(numbers) {
    const containerDom = document.querySelector('.lotto-play .ball-container')
    for(let i = 0; i < numbers.length; i++) {
        let ball = containerDom.children[i]
        if(i === 6) ball = ball.children[0] // bonus ball

        ball.classList.remove('in-view')
        ball.textContent = numbers[i]

        let ballColour = ''
        let textColour = ''
        if(i === 6) { // bonus ball
            if(numbers[i] === winningNumbers[i]) {
                ballColour = '#a92982' // pink
                textColour = 'white'
            } else {
                ballColour = 'white'
                textColour = '#a92982' // pink
            }
        } else {
            if(winningNumbers.slice(0, 6).includes(numbers[i])) {
                ballColour = '#3d8fd6' // blue
                textColour = 'white'
            } else {
                ballColour = 'white'
                textColour = 'black'
            }
        }
        ball.style.backgroundColor = ballColour
        ball.style.color = textColour
        ball.style.borderColor = 'white'

        setTimeout(() => {
            ball.classList.add('in-view');
        }, i * 100); // stagger each ball
    }
}

function renderWinningNumbers(numbers) {
    const containerDom = document.querySelector('.lotto-result .ball-container')
    for(let i = 0; i < numbers.length; i++) {
        let ball = containerDom.children[i]
        if(i === 6) ball = ball.children[0] // bonus ball
        ball.classList.remove('in-view')
        ball.textContent = numbers[i]

        let ballColour = ''
        if(numbers[i] === null) ballColour = 'grey'
        else if(numbers[i] <= 10) ballColour = '#5a9bcd' // blue
        else if(numbers[i] <= 20) ballColour = '#e68643' // orange
        else if(numbers[i] <= 30) ballColour = '#a9c561' // green
        else if(numbers[i] <= 40) ballColour = '#d0393a' // red
        ball.style.borderColor = ballColour

        setTimeout(() => {
            ball.classList.add('in-view');
        }, i * 100); // stagger each ball
    }
}

function renderOutcome(division) {
    const outcome = document.querySelector('.outcome')
    outcome.textContent = ''

    const outcomeTitle = document.createElement('h2')
    const outcomeDetails = document.createElement('ol')

    const outcomePrize = document.createElement('li')
    const outcomeDivision = document.createElement('li')
    const outcomeNumbersMatch = document.createElement('li')
    const outcomeIsBonusBall = document.createElement('li')
    outcomeDetails.appendChild(outcomePrize)
    outcomeDetails.appendChild(outcomeDivision)
    outcomeDetails.appendChild(outcomeNumbersMatch)
    outcomeDetails.appendChild(outcomeIsBonusBall)

    if(division.number === null) {
        outcomeTitle.textContent = 'No win this time'
        outcomeDivision.textContent = `Division:`
    } else {
        outcomeTitle.textContent = 'You won!'
        outcomeDivision.textContent = `Division: ${division.number}`
    }
    const prize = division.prize.type === 'money' ? `$${division.prize.amount.toFixed(2)}` : `${division.prize.amount} Lotto lines`
    outcomePrize.textContent = `Prize: ${prize}`
    outcomeNumbersMatch.textContent = `Numbers matched: ${division.numbersMatched}`
    outcomeIsBonusBall.textContent = `Bonus ball matched: ${division.isBonusMatched}`
    
    outcome.appendChild(outcomeTitle)
    outcome.appendChild(outcomeDetails)
}

const buyButton = document.querySelector('.buy-button')
buyButton.addEventListener('click', event => {
    event.preventDefault()
    const linePurchaseDropdownValue = parseInt(document.querySelector('#line-purchase-dropdown').value)
    playSummary.linesOwned += linePurchaseDropdownValue
    playSummary.totalSpent += linePurchaseDropdownValue * 0.7
    playSummary.netProfit -= linePurchaseDropdownValue * 0.7
    renderPlaySummary()
})

const shuffleButton = document.querySelector('.shuffle-button')
shuffleButton.addEventListener('click', event => {
    event.preventDefault()
    winningNumbers = generateLottoLine()
    renderWinningNumbers(winningNumbers)
})

const playButton = document.querySelector('.play-button')
playButton.addEventListener('click', event => {
    event.preventDefault()

    const linesToPlay = parseInt(document.querySelector('#line-play-dropdown').value)
    for(let i = 0; i < linesToPlay; i++) {
        if(playSummary.linesOwned <= 0) return
        
        playSummary.linesOwned -= 1
        playSummary.linesPlayed += 1

        const line = generateLottoLine()
        renderPlayerNumbers(line)
        
        const division = calculateDivison(line, winningNumbers)
        if(division.prize.type === 'money') {
            playSummary.totalWon += division.prize.amount
            playSummary.netProfit += division.prize.amount
        } else if(division.prize.type === 'line') {
            playSummary.linesOwned += division.prize.amount
        }
        renderOutcome(division)
        renderPlaySummary()
    }
})

renderPlaySummary()
renderWinningNumbers(winningNumbers)
renderPlayerNumbers(new Array(7).fill(null))