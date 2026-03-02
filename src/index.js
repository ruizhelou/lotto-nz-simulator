import "./style.css";
import "normalize.css";

const playSummary = {
    linesOwned: 0,
    linesPlayed: 0,
    totalSpent: 0,
    totalWon: 0,
    netProfit: 0
}
let winningNumbers = generateLottoLine()
const moneyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  currencyDisplay: 'narrowSymbol', // Removes 'A' prefix
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

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

const loseResponses = [
    'No Prize This Time',
    'Not a Winner',
    'No Win Today',
    'Better Luck Next Draw',
    'Unlucky This Round',
    'No Luck This Time',
    'No Payout',
    'Try Again',
    'The Dream Continues',
    'Close… Ish',
    'Fortune Looked Away',
    'Not Today',
    'Luck Took a Break',
    'The Stars Misaligned',
    'Maybe Next Time'
]

function renderPlaySummary() {
    const linesOwnedStat = document.querySelector('.lines-owned .statistic')
    renderStatistic(linesOwnedStat, `${playSummary.linesOwned}`)

    const linesPlayedDom = document.querySelector('.lines-played .statistic')
    renderStatistic(linesPlayedDom, `${playSummary.linesPlayed}`)
    
    const totalSpentDom = document.querySelector('.total-spent .statistic')
    renderStatistic(totalSpentDom, `${moneyFormatter.format(playSummary.totalSpent)}`)

    const totalWonDom = document.querySelector('.total-won .statistic')
    renderStatistic(totalWonDom, `${moneyFormatter.format(playSummary.totalWon)}`)

    const netProfitDom = document.querySelector('.net-profit .statistic')
    renderStatistic(netProfitDom, `${moneyFormatter.format(playSummary.netProfit)}`)

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
    const outcomePrize = document.querySelector('.outcome-prize')

    outcomeTitle.classList.remove('in-view')
    outcomeFraction.classList.remove('in-view')

    if(division.prize.amount === 0) {
        outcomeTitle.textContent = loseResponses[Math.floor(Math.random() * loseResponses.length)]
        outcomeTitle.style.color = 'white'
        outcomePrize.style.display = 'none'
    } else {
        outcomeTitle.textContent = 'Winning ticket!'
        outcomeTitle.style.color = '#f8f333'
        outcomePrize.style.display = 'flex'
        if(division.prize.type === 'money') {
            outcomePrize.textContent = `${moneyFormatter.format(division.prize.amount)}`
        } else { // lines
            outcomePrize.textContent = `${division.prize.amount} Lines`
        }
        pop(outcomePrize, 500)
    }
    outcomeFraction.textContent = `${division.numbersMatched}/6`
    
    requestAnimationFrame(() => {
        outcome.classList.add('in-view')
        outcomeTitle.classList.add('in-view')
        outcomeFraction.classList.add('in-view')
    })
}

function shake(domElement, milliseconds) {
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
            duration: milliseconds,
            iterations: 1
        }
    )
}

function pop(domElement, milliseconds) {
    domElement.animate([
            { transform: 'scale3d(1, 1, 1)' },
            { transform: 'scale3d(1.2, 1.2, 1.2)' },
            { transform: 'scale3d(1, 1, 1)' }
        ], 
        {
            // Timing options
            duration: milliseconds,
            iterations: 1
        }
    )
}

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
            shake(document.querySelector('.lines-owned'), 500)
            shake(buyButton, 500)
            return
        }
        
        playSummary.linesOwned -= 1
        playSummary.linesPlayed += 1
        if(playSummary.linesOwned <= 0) playButton.classList.add('disabled-button')

        const line = generateLottoLine()
        renderPlayerNumbers(line)
        // renderPlayerNumbers(winningNumbers)
        
        const division = calculateDivison(line, winningNumbers)
        // const division = calculateDivison(winningNumbers, winningNumbers)
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
})

const buyButton = document.querySelector('.buy-button')
buyButton.addEventListener('click', event => {
    event.preventDefault()

    playButton.classList.remove('disabled-button')

    const linePurchaseDropdownValue = parseInt(document.querySelector('#line-purchase-dropdown').value)
    playSummary.linesOwned += linePurchaseDropdownValue
    playSummary.totalSpent += linePurchaseDropdownValue * 0.7
    playSummary.netProfit -= linePurchaseDropdownValue * 0.7
    renderPlaySummary()
})

renderPlaySummary()
renderWinningNumbers(winningNumbers)
renderPlayerNumbers(new Array(7).fill(null))