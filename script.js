let stack1 = []
let stack2 = []
let stack3 = []
let forTheWin = []

newGame()
move()

/*
    function to clear out the children of an element so new information can be placed
*/
function clearTheElement (element) {
    const elementWithChildren = document.querySelectorAll (element)
    while (elementWithChildren[0].lastElementChild)
        elementWithChildren[0].removeChild ( elementWithChildren[0].lastElementChild )
        return elementWithChildren
}
/*
    function to initialize a new game
*/
function newGame () {
    // generate a form for player input in the header
    clearTheElement (`header`)
    const createForm = document.createElement (`form`)
    createForm.className = `inputForm`
    createForm.innerHTML = (`Please select a game to play: `)
    const headerElements = document.querySelectorAll (`header`)
    headerElements[0].appendChild(createForm)
    // only allow player to choose 3 - 6 disks per game
    for ( i=3; i<=6; i++ ) {
        const createInput = document.createElement (`input`)    
        createInput.setAttribute( `type` , `radio` )
        createInput.setAttribute( `id` , `${i}` )
        createInput.setAttribute( `name` , `gameInput` )
        createInput.setAttribute( `value` , `${i}` )
        createForm.appendChild (createInput)
        let headerLabel = document.createElement (`label`)
        headerLabel.setAttribute ( `for`, `${i}` )
        createForm.appendChild (headerLabel)
        headerLabel.innerHTML = ( `${i} disks ` )
    }
    // initialize the stacks
    stack1 = []
    stack2 = []
    stack3 = []
    // initialize the first stack based on player input
    document.querySelectorAll(`input`).forEach(radioInput => {
        radioInput.addEventListener('click', () => {
            for ( i=parseInt(radioInput.value); i>0; i-- ) {
                stack1.push(i)
                // setup what the winning stack should look like
                forTheWin.push(i)
            }
        return updateGameBoard()
        })        
    })
}
/*
    function to update the game board to visually reflect the game pieces
*/
function updateGameBoard () {
    // clear the header to accept new instructions
    clearTheElement(`header`)
    // iterate through each stack
    for ( currentStack=1; currentStack<=3; currentStack++) {
        currentStack === 1
            ? stackNumber = stack1 : currentStack === 2
                ? stackNumber = stack2 : stackNumber = stack3
        // clear each stack to prepare for upate
        clearTheElement(`#stack${currentStack}`)
        eachStack = document.querySelector(`#stack${currentStack}`)
        // create the disks for each stack based on their contents
        for ( i=stackNumber.length; i>0; i-- ) {
            const createDivStack = document.createElement (`div`)    
            createDivStack.className = `disk`
            createDivStack.setAttribute( `id` , `disk${stackNumber[i-1]}` )
            eachStack.appendChild (createDivStack)
            createDivStack.innerHTML = ( `disk ${stackNumber[i-1]}` )
        }
    }
    document.querySelector(`header`).innerText = 'Select the stack from which you want to move the top disk'
    // after the board is updated, check if player won
    return checkForTheWin()
}
/*
    function to check if the player won yet
*/
function checkForTheWin(){
    // if stack3 matches the winning stack, player wins!
    //    return stack3 === forTheWin <=why doesn't this work? ****************
    if (stack3.length === forTheWin.length) {
        axios ({
            url: `https://api.giphy.com/v1/gifs/search?api_key=2041494ca782403cb6055682a7943c75&tag=&rating=G&q=winner`,
            method: `get`
        })
        .then (response => {
            // IN THE .THEN METHOD, PARSE THE JSON RESPONSE OBJECT AND FIND 
            // THE image_url key
            const winnerImg = response.data.data[Math.floor(Math.random()*25)].images.original.url
            console.log (winnerImg)
            //clearTheElement (`.playArea`)
            const createImg = document.createElement(`img`)
            createImg.setAttribute(`src`, winnerImg)
            document.querySelector(`#stack2`).appendChild(createImg)
            document.querySelector(`header`).innerText = 'You are a winner! Select the RESET button below to start a new game.'
        })
        .catch(error => console.log(error)
        )
    }
}

/*
    function to track moves made by player
*/
function move () {
    diskInPlay = ``
    // const divStack1 = document.querySelector(`div #stack1`)
    // divStack1.addEventListener(`click`, () => {
    //     // don't allow an empty stack be selected if no disk has been choosen yet
    //     if (stack1.length === 0 && diskInPlay === ``) {            
    //         console.log ('nothing selected yet')
    //     // otherwise, is no disk has been choosen yet, grab the last disk off the stack
    //     } else if ( diskInPlay === `` ) {
    //         diskInPlay = stack1[stack1.length-1]
    //         stack1.pop()
    //         divStack1.setAttribute(`style`, `border: solid red`)
    //     // otherwise if disk choosen is smaller than the last disk on the target stack
    //     // or no disks yet exist on the stack,
    //     // place the disk on the stack
    //     } else if (diskInPlay < stack1[stack1.length-1] || stack1.length===0) {
    //         stack1.push(diskInPlay)
    //         diskInPlay=``
    //         divStack1.setAttribute(`style`, `border:revert`)
    //         divStack2.setAttribute(`style`, `border:revert`)
    //         divStack3.setAttribute(`style`, `border:revert`)
    //         //update the game board
    //         updateGameBoard()
    //     // otherwise don't allow move
    //     } else {
    //         alert (`illegal move`)
    //     }
    // })
    const divStack1 = document.querySelector(`div #stack1`)
    divStack1.addEventListener(`click`, () => {
        // don't allow an empty stack be selected if no disk has been choosen yet
        if (stack1.length === 0 && diskInPlay === ``) {            
            console.log ('nothing selected yet')
        // otherwise, is no disk has been choosen yet, grab the last disk off the stack
        } else if ( diskInPlay === `` ) {
            diskInPlay = stack1[stack1.length-1]
            stack1.pop()
            divStack1.setAttribute(`style`, `border: solid red`)
            document.querySelector(`header`).innerText = 'Select a target stack to put the disk'
        // otherwise if disk choosen is smaller than the last disk on the target stack
        // or no disks yet exist on the stack,
        // place the disk on the stack
        } else if (diskInPlay < stack1[stack1.length-1] || stack1.length===0) {
            stack1.push(diskInPlay)
            diskInPlay=``
            divStack1.setAttribute(`style`, `border:revert`)
            divStack2.setAttribute(`style`, `border:revert`)
            divStack3.setAttribute(`style`, `border:revert`)
            //update the game board
            updateGameBoard()
        // otherwise don't allow move
        } else {
            document.querySelector(`header`).innerText = 'You cannot choose a stack that has a smaller disk on top. '
        }
    })
    const divStack2 = document.querySelector(`div #stack2`)
    divStack2.addEventListener(`click`, () => {
        // don't allow an empty stack be selected if no disk has been choosen yet
        if (stack2.length === 0 && diskInPlay === ``) {            
            console.log ('nothing selected yet')
        // otherwise, is no disk has been choosen yet, grab the last disk off the stack
        } else if ( diskInPlay === `` ) {
            diskInPlay = stack2[stack2.length-1]
            stack2.pop()
            divStack2.setAttribute(`style`, `border: solid red`)
        // otherwise if disk choosen is smaller than the last disk on the target stack
        // or no disks yet exist on the stack,
        // place the disk on the stack
        } else if (diskInPlay < stack2[stack2.length-1] || stack2.length===0) {
            stack2.push(diskInPlay)
            diskInPlay=``
            divStack1.setAttribute(`style`, `border:revert`)
            divStack2.setAttribute(`style`, `border:revert`)
            divStack3.setAttribute(`style`, `border:revert`)
            //update the game board
            updateGameBoard()
        // otherwise don't allow move
        } else {
            document.querySelector(`header`).innerText = 'You cannot choose a stack that has a smaller disk on top. '
        }
    })
    const divStack3 = document.querySelector(`div #stack3`)
    divStack3.addEventListener(`click`, () => {
        // don't allow an empty stack be selected if no disk has been choosen yet
        if (stack3.length === 0 && diskInPlay === ``) {            
            console.log ('nothing selected yet')
        // otherwise, is no disk has been choosen yet, grab the last disk off the stack
        } else if ( diskInPlay === `` ) {
            diskInPlay = stack3[stack3.length-1]
            stack3.pop()
            divStack3.setAttribute(`style`, `border: solid red`)
        // otherwise if disk choosen is smaller than the last disk on the target stack
        // or no disks yet exist on the stack,
        // place the disk on the stack
        } else if (diskInPlay < stack3[stack3.length-1] || stack3.length===0) {
            stack3.push(diskInPlay)
            diskInPlay=``
            divStack1.setAttribute(`style`, `border:revert`)
            divStack2.setAttribute(`style`, `border:revert`)
            divStack3.setAttribute(`style`, `border:revert`)
            //update the game board
            updateGameBoard()
        // otherwise don't allow move
        } else {
            document.querySelector(`header`).innerText = 'You cannot choose a stack that has a smaller disk on top. '
        }
    })
}