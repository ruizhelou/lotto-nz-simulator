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

class OutcomeResponse {
    zeroMatch = {index: 0, messages: ['0 Hits','Nothing Landed','No Matches','Clean Miss']}
    oneMatch = {index: 0, messages: ['Just 1 Match','A Single Hit','Lone Number']}
    twoMatch = {index: 0, messages: ['Two Strong','Two\'s Company','A Respectable Pair']}
    threeMatch = {index: 0, messages: ['Three Hits','Triple Match','Three Solid']}
    fourMatch = {index: 0, messages: ['Serious Four','Four Deep','Four Locked In']}
    fiveMatch = {index: 0, messages: ['Five Huge','Massive Five','So Close']}
    sixMatch = {index: 0, messages: ['LOTTO!']}

    responseFrom(responses) {
        if(responses.index < responses.messages.length) {
            return responses.messages[responses.index++]
        }
        responses.index = 0
        return responses.messages[responses.index++]
    }

    getResponse(numMatching) {
        if(numMatching === 0) return this.responseFrom(this.zeroMatch)
        else if(numMatching === 1) return this.responseFrom(this.oneMatch)
        else if(numMatching === 2) return this.responseFrom(this.twoMatch)
        else if(numMatching === 3) return this.responseFrom(this.threeMatch)
        else if(numMatching === 4) return this.responseFrom(this.fourMatch)
        else if(numMatching === 5) return this.responseFrom(this.fiveMatch)
        else return this.responseFrom(this.sixMatch)
    }
}

const outcomeResponses = new OutcomeResponse()

function renderPlaySummary() {
    const linesOwnedStat = document.querySelector('.lines-owned .statistic')
    renderStatistic(linesOwnedStat, `${playSummary.linesOwned}`)

    const linesPlayedDom = document.querySelector('.lines-played .statistic')
    renderStatistic(linesPlayedDom, `${playSummary.linesPlayed}`)
    
    const totalSpentDom = document.querySelector('.total-spent .statistic')
    renderStatistic(totalSpentDom, `$${playSummary.totalSpent.toFixed(2)}`)

    const totalWonDom = document.querySelector('.total-won .statistic')
    renderStatistic(totalWonDom, `$${playSummary.totalWon.toFixed(2)}`)

    const netProfitDom = document.querySelector('.net-profit .statistic')
    renderStatistic(netProfitDom, `$${playSummary.netProfit.toFixed(2)}`)

    if(playSummary.netProfit === 0) netProfitDom.style.color = 'white'
    else if(playSummary.netProfit < 0) netProfitDom.style.color = '#ffb8b8'
    else if(playSummary.netProfit > 0) netProfitDom.style.color = '#6aff6a'
}

function renderStatistic(statisticDom, newStat) {
    if(statisticDom.textContent !== newStat) {
        statisticDom.classList.remove('in-view')
        statisticDom.textContent = newStat
        requestAnimationFrame(() => {
            statisticDom.classList.add('in-view')
        })
    }
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
    const outcomeTitle = document.querySelector('.outcome h2')
    const outcomeFraction = document.querySelector('.outcome-fraction')

    outcomeTitle.classList.remove('in-view')
    outcomeFraction.classList.remove('in-view')

    outcomeTitle.textContent = outcomeResponses.getResponse(division.numbersMatched)
    outcomeFraction.textContent = `${division.numbersMatched}/7`
    
    requestAnimationFrame(() => {
        outcome.classList.add('in-view')
        outcomeTitle.classList.add('in-view')
        outcomeFraction.classList.add('in-view')
    })
}

function shake(domElement) {
    domElement.animate([
            { transform: 'translate(1px, 1px) rotate(0deg)' },
            { transform: 'translate(-1px, -2px) rotate(-1deg)' },
            { transform: 'translate(-3px, 0px) rotate(1deg)' },
            { transform: 'translate(3px, 2px) rotate(0deg)' },
            { transform: 'translate(1px, -1px) rotate(1deg)' },
            { transform: 'translate(-1px, 2px) rotate(-1deg)' },
            { transform: 'translate(-3px, 1px) rotate(0deg)' },
            { transform: 'translate(3px, 1px) rotate(-1deg)' },
            { transform: 'translate(-1px, -1px) rotate(1deg)' },
            { transform: 'translate(1px, 2px) rotate(0deg)' },
            { transform: 'translate(1px, -2px) rotate(-1deg)' }
        ], 
        {
            // Timing options
            duration: 500, // milliseconds
            iterations: 1
        }
    )
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
        if(playSummary.linesOwned <= 0) {
            shake(document.querySelector('.lines-owned'))
            shake(buyButton)
            return
        }
        
        playSummary.linesOwned -= 1
        playSummary.linesPlayed += 1

        const line = generateLottoLine()
        renderPlayerNumbers(line)
        
        const division = calculateDivison(line, winningNumbers)
        console.log(division)

        if(division.prize.type === 'money') {
            playSummary.totalWon += division.prize.amount
            playSummary.netProfit += division.prize.amount
        } else if(division.prize.type === 'line') {
            playSummary.linesOwned += division.prize.amount
        }
        renderOutcome(division)
        renderPlaySummary()
    }
    console.log(playSummary)
})

renderPlaySummary()
renderWinningNumbers(winningNumbers)
renderPlayerNumbers(new Array(7).fill(null))