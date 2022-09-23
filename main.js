let resultElement = document.querySelector('.result')
let mainContainer = document.querySelector(".main-container")
let rowId = 1

//peticion al api

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2680a83f8dmsh7a53c34c7318ab8p1f6958jsn565f84d3585c',
		'X-RapidAPI-Host': '1000-most-common-words.p.rapidapi.com'
	}
};

fetch("https://1000-most-common-words.p.rapidapi.com/words/spanish?words_limit=1", options)
  .then(res => res.json())
  .finally(() => {
    let loadingElement = document.querySelector(".loading")
    loadingElement.style.display = "none"
  })
  .then(data => {
    let word = data[0]
    if(word.length > 7){
      location.reload()
    }
    let wordArray = word.toUpperCase().split("")

    let actualRow = document.querySelector(".row")

    drawSquares(actualRow)
    listenInput(actualRow)

    addFocus(actualRow)


    function listenInput(actualRow){
      let squares = actualRow.querySelectorAll(".square")
      squares = [...squares]

      let userInput = []

      squares.forEach(element => {
        element.addEventListener('input', (event) => {
          //detectar borrado
          if(event.inputType !== 'deleteContentBackward'){
            // Recoger el ingreso del usuario
            userInput.push(event.target.value.toUpperCase())
            if(event.target.nextElementSibling){
              event.target.nextElementSibling.focus()
            }else{
              //crear el arreglo con letras

              //buscar contenido de la fila anterior
              //armar arreglo con el resultado antes de comparar
              let squaresFilled = document.querySelectorAll('.square')
              squaresFilled = [...squaresFilled]
              let lastFiveSquaresFilled = squaresFilled.slice(-word.length)
              let finalUserInput = []
              lastFiveSquaresFilled.forEach(element => {
                finalUserInput.push(element.value.toUpperCase())
              })


              //si la letra no esta en la pos. correcta
              let existIndexArray = existLetter(wordArray, finalUserInput)
              existIndexArray.forEach(element => {
                squares[element].classList.add("gold")//amarillo si solo la letra es correcta
              })

              //si letra y pos son correctas
              let rightIndex = compareArrays(wordArray, finalUserInput)
              rightIndex.forEach(element => {
                squares[element].classList.add('green')//verde si son iguales y pos igual
              })
        
              //si los arreglos son iguales ****GANASTE***
              if(rightIndex.length == wordArray.length){
                showResult("¡Ganaste!")
                return
              }
              //Crear una nueva fila
              let actualRow = createRow()
              if(!actualRow){
                return
              }
              drawSquares(actualRow)
              listenInput(actualRow)
              addFocus(actualRow)
            }
          }else{
            userInput.pop()
          }
          //console.log(userInput); //input inicial sin cambios
          
        })
      })
    }


    //FUNCIONES
    function compareArrays(array1, array2){
      let equalsIndex = []
      array1.forEach(( element, index ) => {
        if(element  == array2[index]){
          //console.log(`En la posicion ${index} si son iguales`);
          equalsIndex.push(index)
        }else{
          //console.log(`En la posicion ${index} NO son iguales`);
        }
      })
      return equalsIndex
    }

    function existLetter(array1, array2){
      let existIndexArray = []
      array2.forEach((element, index) => {
        if(array1.includes(element)){
          existIndexArray.push(index)
        }
      })
      return existIndexArray
    }

    function createRow(){
      rowId++
      if(rowId <= 5){
        let newRow = document.createElement('div')
        newRow.classList.add('row')
        newRow.setAttribute('id', rowId)
        mainContainer.appendChild(newRow)
        return newRow
      }else{
        showResult(`Intentalo de nuevo, la respuesta correcta era: "${word.toUpperCase()}"`)
      }
    }

    function drawSquares(actualRow){
      wordArray.forEach((item, index) => {
        if(index == 0){
          actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus">`
        }else{
          actualRow.innerHTML += `<input type="text" maxlength="1" class="square">`
        }
      })
    }

    function addFocus(actualRow){
      let focusElement = actualRow.querySelector(".focus")
      focusElement.focus()
    }

    function showResult(textMessage){
      resultElement.innerHTML = 
      `
      <p>${textMessage}</p>
      <button class="button">Reiniciar</button>
      `

      let resetBtn = document.querySelector(".button")
      resetBtn.addEventListener('click', () => {
        location.reload()
      })
    }
  })

