/*
These functions handle parsing the chord-pro text format
*/

function parseChordProFormat(chordProLinesArray, transposeNum) {
  //parse the song lines with embedded
  //chord pro chords and add them to DOM

  console.log('type of input: ' + typeof chordProLinesArray)

  //add the lines of text to html <p> elements
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = '' //clear the html
  let readchords = "";
  
  // Stores the different chords to be used for transposition
  const transposeSharp = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
  const transposeFlat = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]

  // Looks at all of the lines in chordProLinesArray to seperate chords from verses, change the color of both, and transpose the chords
  for (let i = 0; i < chordProLinesArray.length; i++) {
    let line = chordProLinesArray[i]
    let bracket = false;
    let currchord = ""
    let rchord = "";
    let blyrics = "";
    let formbline = "";
    let formrline = "";
    let blankspace = 0;

    /* 
    Checks for brackets and if so it will look through all of the characters to make a line of chords (Green) and a line of verses(Blue). 
    Once it is done looking through the current line, it will store both the chords line and verses line to the readchords.
    If there are no brackets in the line, the enter line will be changed to a blue color and added to readchords variable without looking through the line as there will be no chords in the string.
    */
    if (line.includes("[")){
      for(let j = 0; j < line.length; j++){
        if(line[j] === "["){
          formbline += blyrics
          bracket = true;
        }
        else if (line[j] === "]"){
          // If the chords are need to be transposed the following code will occur. It calls the specifiec function based on the sign of the original chord
          if(currchord.includes("/") && transposeNum % 12 != 0){
            let slashIndex;

            slashIndex = currchord.indexOf("/")

            if(currchord[slashIndex + 2] == "b"){
              currchord = checkFlat(currchord, transposeNum, transposeFlat, slashIndex + 1, slashIndex + 2)
            }
            else if(currchord[slashIndex + 2] == "#" ){
              currchord = checkSharp(currchord, transposeNum, transposeSharp, slashIndex + 1, slashIndex + 2)
            }
            else{
              currchord = checkChord(currchord, transposeNum, transposeSharp, slashIndex + 1)
            }

            if(currchord[1] == "b"){
              currchord = checkFlat(currchord, transposeNum, transposeFlat, 0, 1)
            }
            else if(currchord[1] == "#" ){
              currchord = checkSharp(currchord, transposeNum, transposeSharp, 0, 1)
            }
            else{
              currchord = checkChord(currchord, transposeNum, transposeSharp, 0)
            }
            rchord += currchord
            rchord += " ";
            formrline += `<span class="chordr">${rchord}</span>`;
          }
          else if (transposeNum % 12 != 0){
            if(currchord[1] == "b"){
              currchord = checkFlat(currchord, transposeNum, transposeFlat, 0, 1)
            }
            else if(currchord[1] == "#"){
              currchord = checkSharp(currchord, transposeNum, transposeSharp, 0, 1)
            }
            else{
              currchord = checkChord(currchord, transposeNum, transposeSharp, 0)
            }
            rchord += currchord
            rchord += " ";
            formrline += `<span class="chordr">${rchord}</span>`;
          }
          else{
            rchord += currchord
            rchord += " ";
            formrline += `<span class="chord">${rchord}</span>`;
          }
          bracket = false;
          rchord = "";
          blyrics = "";
          currchord = "";
          blankspace ++
        }else if (bracket == true){
          currchord += chordProLinesArray[i][j]
          blankspace ++
        }
        else{
          
          if(blankspace == 0){
            rchord += " "
          }
          else{
            blankspace --
          }
          blyrics += chordProLinesArray[i][j]
        }
      }
      formbline += blyrics;
      readchords += `<pre>${formrline}</pre>`
      readchords += `<p>${formbline}</p>`;
    }else{
      readchords +=  `<p>${line}</p>`;
    }
  }
  textDiv.innerHTML = textDiv.innerHTML + readchords
}

// Transposes the flat chord indicated and returns the chord after the transposition
function checkFlat(currchord, transposeNum, transposeFlat, chordloc1, chordloc2){
  let holder = currchord[chordloc1] + currchord[chordloc2]
  let index = -1;
  for(let i = 0; i < transposeFlat.length; i++){
    if(holder.includes(transposeFlat[i])){
      index = i;
      break;
    }
  }
  if(index != -1){
    let newChord;
    index = (index + transposeNum) % 12
    if (index < 0){
      index = index * -1
    }
    newChord = transposeFlat[index]
    currchord = currchord.replace(holder, newChord)
  }
  return currchord;
}

// Transposes the sharp chord indicated and returns the chord after the transposition
function checkSharp(currchord, transposeNum, transposeSharp, chordloc1, chordloc2){
  let holder = currchord[chordloc1] + currchord[chordloc2]
  let index = -1;

  for(let i = 0; i < transposeSharp.length; i++){
    if(holder.includes(transposeSharp[i])){
      index = i;
    }
  }
  if(index != -1){
    let newChord;
    index = (index + transposeNum) % 12
    if (index < 0){
      index = index * -1
    }
    newChord = transposeSharp[index]
    currchord = currchord.replace(holder, newChord)
  }
  return currchord;
}

// Transposes the chord indicated using the sharp chord array and returns the chord after the transposition
function checkChord(currchord, transposeNum, transposeSharp, chordloc){
  let holder = currchord[chordloc]
  let index = -1;
  for(let i = 0; i < transposeSharp.length; i++){
    if(holder.includes(transposeSharp[i])){
      index = i;
      break;
    }
  }
  if(index != -1){
    let newChord;
    index = (index + transposeNum) % 12
    if (index < 0){
      index = index * -1
    }
    newChord = transposeSharp[index]
    currchord = currchord.replace(holder, newChord)
  }
  return currchord;
}