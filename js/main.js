'use strict'

// TODO: Render the cinema (7x15 with middle path)
// TODO: implement the Seat selection flow
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all) 
// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price... 
// TODO: in seat details, show available seats around 
// TODO: Upload to GitHub Pages

var gElSelectedSeat = null
const gCinema = createCinema()
renderCinema()

function createCinema() {
    const cinema = []
    for (var i = 0; i < 7; i++) {
        cinema[i] = []
        for (var j = 0; j < 15; j++) {
            const cell = {
                isSeat: j !== 7
            }
            if (cell.isSeat) {
                cell.isBooked = false
                cell.price = 4 + i
            }

            cinema[i][j] = cell
        }
    }
    cinema[4][4].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]

            var className = (cell.isSeat) ? 'seat' : ''
            if (cell.isBooked) className += ' booked'

            var title = (cell.isSeat)? `Seat: ${i+1}, ${j+1}` : ''
            strHTML += `<td class="cell ${className}" title="${title}" 
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>`
        }
        strHTML += `</tr>`
    }
    // console.log(strHTML)

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
    const cell = gCinema[i][j]

    if (!cell.isSeat || cell.isBooked) return
    console.log('Cell clicked: ', elCell, i, j)

    // Only a single seat should be selected
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }
    elCell.classList.add('selected')
    gElSelectedSeat = elCell
    // TODO: Support Unselecting a seat
    showSeatDetails({ i: i, j: j })
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const seat = gCinema[pos.i][pos.j]
    elPopup.querySelector('h2 span').innerText = `${pos.i+1}-${pos.j+1}`
    elPopup.querySelector('h3 span').innerText = `$${seat.price}`
    const elBtn = elPopup.querySelector('button')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j

    elPopup.querySelector('h4 span').innerText = countEmptySeatsAround(gCinema, pos.i, pos.j)

    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function bookSeat(elBtn) {
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    renderCinema()

    // console.log('Booking seat, button: ', elBtn, i, j)
    unSelectSeat()
}

function unSelectSeat() {
    hideSeatDetails()
    gElSelectedSeat.classList.remove('selected')
    gElSelectedSeat = null
}

function countEmptySeatsAround(cinema, rowIdx, colIdx) {
    var emptySeatsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= cinema.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= cinema[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            var currCell = cinema[i][j]
            if (currCell.isSeat && !currCell.isBooked) emptySeatsCount++
        }
    }
    return emptySeatsCount
}
